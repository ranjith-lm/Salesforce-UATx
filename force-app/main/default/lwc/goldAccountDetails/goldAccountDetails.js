import { LightningElement, track, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import getMetalAccounts from '@salesforce/apex/MetalAccountController.getMetalAccounts';
import getMetalTransactions from '@salesforce/apex/MetalAccountController.getMetalTransactions';
import getMetalStatements from '@salesforce/apex/MetalAccountController.getMetalStatements';
import getUserSettings from '@salesforce/apex/MetalAccountController.getUserSettings';
import getAccountStatementDetails from '@salesforce/apex/LTNG006_StampedStatementsController.getAccountStatementDetails';
import Id from '@salesforce/user/Id';

// Field API Names
const REGION_FLAG_FIELD = 'Account.Region_Flag__c';
const CIF_FIELD = 'Account.CIF__pc';
const X_CANARY_FIELD = 'Account.x_canary__pc';
const SEGMENT_FIELD = 'Account.Segment__pc';

const FIELDS = [REGION_FLAG_FIELD, CIF_FIELD, X_CANARY_FIELD, SEGMENT_FIELD];

export default class GoldAccountDetails extends LightningElement {
    @api recordId; // Account ID passed from parent
    
    // Account data from LDS
    @track regionName = 'Bahrain'; // Default value
    @track customerId = null;
    @track xCanary = 'cbs'; // Default value
    @track segment = 'Premium';
    
    // Loading states for LDS
    @track isLoadingLDS = true;
    @track ldsError = null;
    
    // Account related properties
    @track goldAccountExists = true;
    @track isLoadingAccount = false;
    @track accountError = null;
    @track goldAccount = {
        accountNumber: '—',
        status: '—',
        statusClass: 'status-inactive',
        createdDate: '—',
        closureDate: '—',
        availableBalance: '—',
        holdBalance: '—',
        bookBalance: '—',
        fiatEquivalent: null
    };

    // Transactions related properties
    @track isLoadingTransactions = false;
    @track transactionsError = null;
    @track originalTransactions = [];
    @track transactions = [];

    // Statements related properties
    @track isLoadingStatements = false;
    @track statementsError = null;
    @track statements = [];
    @track showStatements = true;

    // Pagination properties
    @track totalRecords = 0;
    @track currentPage = 1;
    @track totalPages = 0;

    // Filter properties
    @track searchTerm = '';
    @track statusFilter = 'all';
    @track typeFilter = 'all';
    @track amountFrom = null;
    @track amountTo = null;
    @track dateFrom = null;
    @track dateTo = null;

    // API Parameters
    metalCurrency = 'XAU';
    pageNumber = 1;
    pageSize = 50;
    fromAmount = null;
    toAmount = null;
    fromDate = null;
    toDate = null;
    tradeType = 'all';
    
    // Account ID for statements (will be set from account data)
    accountId = null;
    
    // Store the gold account data
    goldAccountData = null;

    // User settings
    @track showTransactionsAndStatements = false;
    @track isLoadingSettings = true;
    @track settingsError = null;
    @track showStatementsTable = false;
    @track userId = Id;

    get displayGoldAccount() {
        // If user has permission, show actual data
        if (this.showTransactionsAndStatements) {
            return this.goldAccount;
        }
        
        // If no permission, return empty/blank values
        return {
            accountNumber: this.goldAccount.accountNumber,
            status: this.goldAccount.status,
            statusClass: 'status-inactive',
            createdDate: this.goldAccount.createdDate,
            closureDate: this.goldAccount.closureDate,
            availableBalance: '',
            holdBalance: '',
            bookBalance: '',
            fiatEquivalent: ''
        };
    }

    // Wire method to fetch Account fields
    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    wiredAccount({ error, data }) {
        if (data) {
            console.log('LDS Account data received:', JSON.stringify(data));
            this.isLoadingLDS = false;
            this.ldsError = null;
            
            // Get field values
            this.regionName = getFieldValue(data, REGION_FLAG_FIELD) || 'Bahrain';
            this.customerId = getFieldValue(data, CIF_FIELD);
            this.xCanary = getFieldValue(data, X_CANARY_FIELD) || 'cbs';
            this.segment = getFieldValue(data, SEGMENT_FIELD) || 'Premium';
            
            console.log('Extracted values:', {
                regionName: this.regionName,
                customerId: this.customerId,
                xCanary: this.xCanary
            });
            
            // Validate customerId
            if (!this.customerId) {
                console.warn('No CIF found on Account. Please ensure CIF__pc field has a value.');
                this.showErrorToast('Missing CIF', 'CIF (Customer ID) is not set on this Account');
                this.goldAccountExists = false;
                this.isLoadingLDS = false;
                return;
            }
            
            // First load user settings, then load account data
            this.loadUserSettings();
            
        } else if (error) {
            console.error('Error fetching Account fields:', JSON.stringify(error));
            this.isLoadingLDS = false;
            this.ldsError = error.body?.message || error.message || 'Failed to load Account data';
            this.showErrorToast('Account Load Error', this.ldsError);
            this.goldAccountExists = false;
        }
    }

    // Load user settings from custom setting
    loadUserSettings() {
        this.isLoadingSettings = true;
        this.settingsError = null;

        getUserSettings({ userId: this.userId, customerId: this.recordId })
            .then(result => {
                console.log('User settings response:', result);
                
                if (result && result.success === true) {
                    this.processUserSettings(result);
                } else if (result && result.success === false) {
                    const errorMsg = result.message || 'Failed to load user settings';
                    this.settingsError = errorMsg;
                    this.showErrorToast('Settings Error', errorMsg);
                    // Default to showing everything if settings can't be loaded
                    this.showTransactionsAndStatements = true;
                } else {
                    // If no settings found, default to showing everything
                    console.warn('No user settings found, defaulting to show all data');
                    this.showTransactionsAndStatements = true;
                }
                
                // Load account data regardless of settings result
                this.loadAccountDetails();
                this.loadTransactions();
                this.loadStatements();
            })
            .catch(error => {
                console.error('Error loading user settings:', error);
                this.settingsError = error.message || 'Failed to load user settings';
                // Default to showing everything if settings can't be loaded
                this.showTransactionsAndStatements = true;
                this.showErrorToast('Settings Error', 'Unable to load user settings. Defaulting to show all data.');
                
                // Load account data regardless of settings error
                this.loadAccountDetails();
                this.loadTransactions();
                this.loadStatements();
            })
            .finally(() => {
                this.isLoadingSettings = false;
            });
    }

    processUserSettings(apiData) {
        // Extract settings from response
        let settings = null;
        
        if (apiData.data && apiData.data.settings) {
            settings = apiData.data.settings;
        } else if (apiData.settings) {
            settings = apiData.settings;
        } else if (apiData.data) {
            settings = apiData.data;
        } else {
            settings = apiData;
        }

        // Check if we have settings data
        if (settings) {
            // Use bracket notation to access fields with double underscores
            const viewStaffData = settings['viewStaffData'] || false;
            const viewStaffDataJordan = settings['viewStaffDataJordan'] || false;
            //const viewStaffData = true;
            //const viewStaffDataJordan = true;
            // Show transactions and statements if either flag is true
            // You can adjust the logic based on your business requirements
            this.showTransactionsAndStatements = viewStaffData || viewStaffDataJordan;
            
            console.log('User settings processed:', {
                viewStaffData: viewStaffData,
                viewStaffDataJordan: viewStaffDataJordan,
                showTransactionsAndStatements: this.showTransactionsAndStatements
            });
        } else {
            // If no settings found, default to showing everything
            console.warn('No settings data found in response, defaulting to show all data');
            this.showTransactionsAndStatements = true;
        }
    }

    // Lifecycle hooks
    connectedCallback() {
        console.log('Component initialized with recordId:', this.recordId);
        
        if (!this.recordId) {
            console.warn('No recordId provided. Please pass recordId to the component.');
            this.showErrorToast('Account ID Required', 'Account recordId is required');
            this.goldAccountExists = false;
            this.isLoadingLDS = false;
        }
    }

    // ==================== ACCOUNT METHODS ====================
    
    loadAccountDetails() {
        if (!this.customerId) {
            this.accountError = 'Customer ID (CIF) is required';
            this.goldAccountExists = false;
            return;
        }

        this.isLoadingAccount = true;
        this.accountError = null;

        console.log('Loading account details for customer:', this.customerId);
        console.log('Region Name:', this.regionName);
        console.log('X-Canary:', this.xCanary);

        getMetalAccounts({
            metalType: 'Gold',
            customerId: this.customerId,
            regionName: this.regionName || '',
            xCanary: this.xCanary,
            segment: this.segment
        })
        .then(result => {
            console.log('Account API response:', result);
            
            if (result && result.success === true) {
                this.processAccountResponse(result);
            } else if (result && result.success === false) {
                const errorMsg = result.message || result.meta?.message || 'Failed to load account details';
                this.accountError = 'We are unable to fetch the data at the moment. Please try again later.';
                this.goldAccountExists = false;
                this.showErrorToast('Account Error', errorMsg);
            } else {
                // Check for different response structures
                if (result && result.data && result.data.accounts && Array.isArray(result.data.accounts)) {
                    this.processAccountResponse(result);
                } else if (result && result.accounts && Array.isArray(result.accounts)) {
                    this.processAccountResponse(result);
                } else {
                    this.accountError = 'No gold account found for this customer';
                    this.goldAccountExists = false;
                }
            }
        })
        .catch(error => {
            console.error('Account API error:', error);
            const errorMsg = error.body?.message || error.message || 'Failed to load account details';
            this.accountError = 'We are unable to fetch the data at the moment. Please try again later.';
            this.goldAccountExists = false;
            this.showErrorToast('API Error', errorMsg);
        })
        .finally(() => {
            this.isLoadingAccount = false;
        });
    }

    processAccountResponse(apiData) {
        console.log('Processing account response:', apiData);
        
        let accountsList = [];
        
        // Extract accounts from the response structure based on actual API response
        if (apiData.data && apiData.data.accounts && Array.isArray(apiData.data.accounts)) {
            accountsList = apiData.data.accounts;
        } else if (apiData.accounts && Array.isArray(apiData.accounts)) {
            accountsList = apiData.accounts;
        }

        if (accountsList.length > 0) {
            // Find the Gold account (XAU) from the accounts list
            const goldAccount = accountsList.find(account => account.metalCurrency === 'XAU');
            
            if (goldAccount) {
                this.goldAccountData = goldAccount;
                
                // Map API fields to display fields based on actual response structure
                const status = goldAccount.status || 'ACTIVE';
                const metalAmount = parseFloat(goldAccount.metalAmount) || 0;
                const fiatBalance = this.parseFiatBalance(goldAccount.fiatBalance);
                const linkedCurrency = goldAccount.linkedAccountCurrency || 'BHD';
                const metalCreatedDate = goldAccount.accountCreatedDate ? goldAccount.accountCreatedDate.split('T')[0] : '';
                
                this.goldAccount = {
                    accountNumber: `XAU-${this.customerId}`,
                    status: this.formatStatus(status),
                    statusClass: this.getStatusClass(status),
                    createdDate: metalCreatedDate,
                    closureDate: '—',
                    availableBalance: `${metalAmount.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })} XAU`,
                    holdBalance: 'XAU 0.000',
                    bookBalance: `${metalAmount.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })} XAU`,
                    fiatEquivalent: fiatBalance > 0 ? `${linkedCurrency} ${fiatBalance.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })}` : null

                };
                
                // Store account ID for statements
                this.accountId = `XAU-${this.customerId}`;
                this.goldAccountExists = true;
                
                console.log('Gold account processed successfully:', this.goldAccount);
            } else {
                // No gold account found (only silver or other metals)
                this.goldAccountExists = false;
                this.accountError = 'No Gold account (XAU) found for this customer';
                console.warn('No XAU account found in accounts list');
            }
        } else {
            this.goldAccountExists = false;
            this.accountError = 'No metal accounts found for this customer';
            console.warn('No account data found in response');
        }
    }
    
    parseFiatBalance(fiatBalanceStr) {
        if (!fiatBalanceStr) return 0;
        // Remove commas and convert to number
        const cleaned = fiatBalanceStr.replace(/,/g, '');
        const numValue = parseFloat(cleaned);
        return isNaN(numValue) ? 0 : numValue;
    }
    
    formatStatus(status) {
        if (!status) return 'Inactive';
        const statusLower = status.toLowerCase();
        if (statusLower === 'active') return 'Active';
        if (statusLower === 'inactive') return 'Inactive';
        if (statusLower === 'closed') return 'Closed';
        if (statusLower === 'suspended') return 'Suspended';
        return status;
    }

    getStatusClass(status) {
        if (!status) return 'status-inactive';
        const statusLower = status.toLowerCase();
        if (statusLower === 'active') return 'status-active';
        if (statusLower === 'inactive') return 'status-inactive';
        if (statusLower === 'closed') return 'status-closed';
        if (statusLower === 'suspended') return 'status-suspended';
        return 'status-inactive';
    }

    retryLoadAccount() {
        this.loadAccountDetails();
    }

    // ==================== TRANSACTIONS METHODS ====================

    loadTransactions() {
        // Only load transactions if user has permission
        if (!this.showTransactionsAndStatements) {
            console.log('User does not have permission to view transactions');
            return;
        }

        if (!this.customerId) {
            this.transactionsError = 'Customer ID (CIF) is required';
            return;
        }

        this.isLoadingTransactions = true;
        this.transactionsError = null;

        // Build parameters for API call
        const params = this.buildTransactionParams();
        
        console.log('Loading transactions with params:', params);

        getMetalTransactions(params)
            .then(result => {
                console.log('Transactions API response:', result);
                
                if (result && result.success === true) {
                    this.processTransactionsResponse(result);
                } else if (result && result.success === false) {
                    const errorMsg = result.message || result.meta?.message || 'Failed to load transactions';
                    this.transactionsError = errorMsg;
                    this.showErrorToast('Transactions Error', errorMsg);
                    this.originalTransactions = [];
                    this.transactions = [];
                } else if (result && result.data && result.data.trades && Array.isArray(result.data.trades)) {
                    this.processTransactionsResponse(result);
                } else if (result && result.trades && Array.isArray(result.trades)) {
                    this.processTransactionsResponse(result);
                } else {
                    // No transactions found - this is not an error, just empty state
                    console.log('No transactions data found in response');
                    this.originalTransactions = [];
                    this.transactions = [];
                    this.transactionsError = null;
                }
            })
            .catch(error => {
                console.error('Transactions API error:', error);
                const errorMsg = error.body?.message || error.message || 'Failed to load transactions';
                this.transactionsError = errorMsg;
                this.showErrorToast('API Error', errorMsg);
                this.originalTransactions = [];
                this.transactions = [];
            })
            .finally(() => {
                this.isLoadingTransactions = false;
            });
    }

    buildTransactionParams() {
        const params = {};
        
        if (this.metalCurrency) params.metalCurrency = this.metalCurrency;
        if (this.pageNumber) params.pageNumber = this.pageNumber;
        if (this.pageSize) params.pageSize = this.pageSize;
        if (this.fromAmount) params.fromAmount = this.fromAmount;
        if (this.toAmount) params.toAmount = this.toAmount;
        if (this.fromDate) params.fromDate = this.fromDate;
        if (this.toDate) params.toDate = this.toDate;
        if (this.tradeType && this.tradeType !== 'all') params.tradeType = this.tradeType;
        
        // Use customerId from LDS
        if (this.customerId) params.customerId = this.customerId;
        
        if (this.regionName) params.regionName = this.regionName;
        if (this.xCanary) params.xCanary = this.xCanary;
        
        return params;
    }

    processTransactionsResponse(apiData) {
        let transactionsList = [];
        let pageInfo = null;
        
        // Extract transactions from the response structure based on actual API response
        if (apiData.data && apiData.data.trades && Array.isArray(apiData.data.trades)) {
            transactionsList = apiData.data.trades;
            pageInfo = apiData.data.page;
        } else if (apiData.trades && Array.isArray(apiData.trades)) {
            transactionsList = apiData.trades;
            pageInfo = apiData.page;
        } else if (apiData.data && apiData.data.transactions && Array.isArray(apiData.data.transactions)) {
            transactionsList = apiData.data.transactions;
            pageInfo = apiData.data.page;
        } else if (apiData.transactions && Array.isArray(apiData.transactions)) {
            transactionsList = apiData.transactions;
            pageInfo = apiData.page;
        }

        // Update pagination info
        if (pageInfo) {
            this.totalRecords = pageInfo.totalRecords || 0;
            this.currentPage = pageInfo.page || 1;
            this.totalPages = pageInfo.totalPages || 0;
        }

        if (transactionsList.length > 0) {
            // Filter only XAU transactions (Gold)
            const xauTransactions = transactionsList.filter(txn => txn.metalCurrency === 'XAU');
            this.originalTransactions = xauTransactions.map((txn, index) => this.mapTransaction(txn, index));
            this.transactions = [...this.originalTransactions];
            console.log(`${this.originalTransactions.length} gold transactions loaded successfully`);
            this.transactionsError = null;
        } else {
            console.log('No gold transactions found');
            this.originalTransactions = [];
            this.transactions = [];
            this.transactionsError = null;
        }
    }

    mapTransaction(txn, index) {
        // Determine transaction type and amount based on tradeType
        const tradeType = txn.tradeType || '';
        const isBuy = tradeType === 'BUY';
        const isSell = tradeType === 'SELL';
        
        // Amount is positive for SELL (credit), negative for BUY (debit)
        const amount = txn.amount || 0;
        const transactionType = isBuy ? 'Debit' : (isSell ? 'Credit' : '');
        const amountClass = isBuy ? 'debit' : (isSell ? 'credit' : '');
        
        // Format transaction amount (absolute value for display)
        const displayAmount = Math.abs(amount);
        
        // Get account currency code
        const accountCurrency = txn.accountCurrency?.code || 'BHD';
        
        // Get trade currency code (metal currency)
        const tradeCurrency = txn.tradeCurrency?.code || 'XAU';
        
        // Format metal quantity
        const metalQuantity = txn.quantity || 0;
        
        return {
            id: txn.reference || txn.id || index,
            description: txn.tradeDescription || (isBuy ? 'Buy Gold' : (isSell ? 'Sell Gold' : 'Gold Transaction')),
            debitAccount: txn.accountName || `${accountCurrency} Account`,
            transactionDate: this.formatDate(txn.tradeDate),
            transactionAmount: this.formatCurrency(displayAmount, accountCurrency),
            amountClass: amountClass,
            exchangeRate: txn.tradeExchangeRate ? `${tradeCurrency} 1 = ${this.formatNumber(txn.tradeExchangeRate)} ${accountCurrency}` : '—',
            metalAmount: `${this.formatNumber(metalQuantity)} ${tradeCurrency}`,
            reference: txn.reference || '—',
            status: txn.status || 'Completed',
            type: transactionType,
            amount: displayAmount,
            date: this.formatDateForFilter(txn.tradeDate),
            tradeType: tradeType,
            quantity: metalQuantity,
            tradeExchangeRate: txn.tradeExchangeRate
        };
    }

    refreshTransactions() {
        this.loadTransactions();
    }

    // ==================== STATEMENTS METHODS ====================

    loadStatements() {
        // Only load statements if user has permission
        if (!this.showTransactionsAndStatements) {
            console.log('User does not have permission to view statements');
            return;
        }

        if (!this.customerId) {
            this.statementsError = 'Customer ID (CIF) is required';
            return;
        }

        this.isLoadingStatements = true;
        this.statementsError = null;

        // Wait for account ID if not available yet
        if (!this.accountId && this.goldAccount.accountNumber !== '—') {
            this.accountId = this.goldAccount.accountNumber;
        }

        const params = {
            accountId: this.accountId || `XAU-${this.customerId}`,
            statementType: 'Statement',
            customerId: this.customerId,
            regionName: this.regionName,
            xCanary: this.xCanary
        };

        console.log('Loading statements with params:', params);

        getMetalStatements(params)
            .then(result => {
                console.log('Statements API response:', result);
                
                if (result && result.success === true) {
                    this.processStatementsResponse(result);
                } else if (result && result.success === false) {
                    const errorMsg = result.message || 'Failed to load statements';
                    this.statementsError = errorMsg;
                    this.showErrorToast('Statements Error', errorMsg);
                    this.statements = [];
                } else if (result && result.statements && Array.isArray(result.statements)) {
                    this.processStatementsResponse(result);
                } else if (result && result.data && result.data.statements) {
                    this.processStatementsResponse(result.data);
                } else {
                    // No statements found - not an error, just empty
                    console.log('No statements found');
                    this.statements = [];
                    this.statementsError = null;
                }
            })
            .catch(error => {
                console.error('Statements API error:', error);
                // Don't treat as critical error - statements might not be available
                console.warn('Statements not available:', error.message);
                this.statements = [];
                this.statementsError = null;
            })
            .finally(() => {
                this.isLoadingStatements = false;
            });
    }

    processStatementsResponse(apiData) {
        let statementsList = [];
        
        if (apiData.statements && Array.isArray(apiData.statements)) {
            statementsList = apiData.statements;
        } else if (apiData.data && apiData.data.statements && Array.isArray(apiData.data.statements)) {
            statementsList = apiData.data.statements;
        }

        if (statementsList.length > 0) {
            this.statements = statementsList.map((stmt, index) => ({
                id: stmt.id || stmt.statementId || index,
                statementDescription: stmt.statementDescription,
                generatedDate: stmt.statementDate
            }));
            console.log(`${this.statements.length} statements loaded successfully`);
            this.statementsError = null;
        } else {
            console.log('No statements found');
            this.statements = [];
        }
    }

    fetchStatements() {
        this.showStatementsTable = true;
        this.loadStatements();
    }

    downloadStatement(event) {
        const statementId = event.currentTarget.dataset.id;
        console.log('Downloading statement:', statementId);
        // Implement download logic here
        this.showToast('Info', 'Download functionality to be implemented', 'info');

        console.log('handleAccStatementDetails download');
        this.isLoading = true;

        console.log('statements -->',JSON.stringify(this.statements));
        console.log('statementId -->',statementId);
        
        const statementDate = this.statements[statementId].generatedDate;
        const ibanNumber = this.accountId;
        
        const requestData = {
            accountId: ibanNumber,
            statementDate: statementDate,
            statementType: "Statement"
        };

        console.log('requestData -->',JSON.stringify(requestData));

        // Call the Apex method
        getAccountStatementDetails({
            customerId: this.customerId,
            requestTextJson: JSON.stringify(requestData)
        })
        .then(result => {
            this.isLoading = false;
            
            if (result.isSuccess) {
                // Create download link
                const downloadLink = document.createElement("a");
                downloadLink.setAttribute("type", "hidden");
                downloadLink.href = "data:text/html;base64," + result.responseData.fileContent;
                
                // Generate filename
                const lastFourDigits = ibanNumber.substr(-4);
                const formattedDate = statementDate.replace(/-/g, "");
                downloadLink.download = `Statement-${lastFourDigits}-${formattedDate}.pdf`;
                
                // Trigger download
                document.body.appendChild(downloadLink);
                downloadLink.click();
                downloadLink.remove();
            } else {
                // Handle API error
                console.error(result.errorData);
                this.showErrorToast('Error',result.errorData.code + ' : ' + result.errorData.message);
            }
        })
        .catch(error => {
            this.isLoading = false;
            console.error('Error:', error);
            this.showErrorToast('Error','An error occurred while downloading the statement');
        });
    }

    // ==================== FILTER METHODS ====================

    get filteredTransactions() {
        let filtered = [...this.transactions];
        
        // Apply search filter
        if (this.searchTerm) {
            const searchLower = this.searchTerm.toLowerCase();
            filtered = filtered.filter(txn => 
                (txn.description && txn.description.toLowerCase().includes(searchLower)) ||
                (txn.reference && txn.reference.toLowerCase().includes(searchLower)) ||
                (txn.debitAccount && txn.debitAccount.toLowerCase().includes(searchLower))
            );
        }
        
        // Apply status filter
        if (this.statusFilter !== 'all') {
            filtered = filtered.filter(txn => txn.status === this.statusFilter);
        }
        
        // Apply type filter
        if (this.typeFilter !== 'all') {
            filtered = filtered.filter(txn => txn.type === this.typeFilter);
        }
        
        // Apply amount filters
        if (this.amountFrom !== null && !isNaN(this.amountFrom)) {
            filtered = filtered.filter(txn => txn.amount >= this.amountFrom);
        }
        if (this.amountTo !== null && !isNaN(this.amountTo)) {
            filtered = filtered.filter(txn => txn.amount <= this.amountTo);
        }
        
        // Apply date filters
        if (this.dateFrom) {
            filtered = filtered.filter(txn => txn.date >= this.dateFrom);
        }
        if (this.dateTo) {
            filtered = filtered.filter(txn => txn.date <= this.dateTo);
        }
        
        return filtered;
    }

    get hasTransactions() {
        return this.filteredTransactions && this.filteredTransactions.length > 0;
    }

    get hasStatements() {
        return this.statements && this.statements.length > 0;
    }

    get noTransactionsFound() {
        return this.transactions.length === 0 && !this.isLoadingTransactions && !this.transactionsError;
    }

    handleTransactionSearch(event) {
        this.searchTerm = event.target.value;
    }

    filterByStatus(event) {
        this.statusFilter = event.target.value;
    }

    filterByType(event) {
        this.typeFilter = event.target.value;
    }

    filterAmountFrom(event) {
        this.amountFrom = event.target.value ? parseFloat(event.target.value) : null;
    }

    filterAmountTo(event) {
        this.amountTo = event.target.value ? parseFloat(event.target.value) : null;
    }

    filterDateFrom(event) {
        this.dateFrom = event.target.value;
    }

    filterDateTo(event) {
        this.dateTo = event.target.value;
    }

    // ==================== UTILITY METHODS ====================

    formatDate(dateValue) {
        if (!dateValue) return '—';
        
        try {
            let date;
            if (typeof dateValue === 'string') {
                date = new Date(dateValue);
            } else if (typeof dateValue === 'number') {
                date = new Date(dateValue);
            } else {
                return dateValue;
            }
            
            if (isNaN(date.getTime())) return dateValue;
            
            return date.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            return dateValue;
        }
    }

    formatDateForFilter(dateValue) {
        if (!dateValue) return '';
        
        try {
            let date;
            if (typeof dateValue === 'string') {
                date = new Date(dateValue);
            } else if (typeof dateValue === 'number') {
                date = new Date(dateValue);
            } else {
                return '';
            }
            
            if (isNaN(date.getTime())) return '';
            
            return date.toISOString().split('T')[0];
        } catch (e) {
            return '';
        }
    }

    formatBalance(balance) {
        if (!balance && balance !== 0) return 'XAU 0.000';
        if (typeof balance === 'string' && balance.includes('XAU')) return balance;
        
        const numValue = parseFloat(balance);
        if (isNaN(numValue)) return 'XAU 0.000';
        
        return `XAU ${numValue.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })}`;
    }

    formatCurrency(amount, currency = 'BHD') {
        if (!amount && amount !== 0) return '—';
        
        const numValue = parseFloat(amount);
        if (isNaN(numValue)) return '—';
        
        return `${currency} ${numValue.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })}`;
    }

    formatNumber(value) {
        if (!value && value !== 0) return '—';
        
        const numValue = parseFloat(value);
        if (isNaN(numValue)) return '—';
        
        return numValue.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 });
    }

    formatMonthYear(dateValue) {
        if (!dateValue) return '—';
        
        try {
            let date;
            if (typeof dateValue === 'string') {
                date = new Date(dateValue);
            } else if (typeof dateValue === 'number') {
                date = new Date(dateValue);
            } else {
                return dateValue;
            }
            
            if (isNaN(date.getTime())) return dateValue;
            
            return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        } catch (e) {
            return dateValue;
        }
    }

    showErrorToast(title, message) {
        try {
            const { ShowToastEvent } = require('lightning/platformShowToastEvent');
            const toastEvent = new ShowToastEvent({
                title: title,
                message: message,
                variant: 'error',
                mode: 'dismissible'
            });
            this.dispatchEvent(toastEvent);
        } catch (e) {
            console.error('Toast error:', title, message);
        }
    }

    showToast(title, message, variant = 'info') {
        try {
            const { ShowToastEvent } = require('lightning/platformShowToastEvent');
            const toastEvent = new ShowToastEvent({
                title: title,
                message: message,
                variant: variant,
                mode: 'dismissible'
            });
            this.dispatchEvent(toastEvent);
        } catch (e) {
            console.log('ShowToastEvent not available');
        }
    }
}