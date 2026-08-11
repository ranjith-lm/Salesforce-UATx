import { LightningElement, wire, track } from 'lwc';
import getCustomerHolds from '@salesforce/apex/CollateralsHoldsController.getCustomerHolds';

// Mock CIF – replace with actual from the context
const CIF = '12345';

export default class CollateralsHolds extends LightningElement {
    @track accountsWithHolds = [];
    @track selectedAccount = null;
    @track isLoading = true;
    @track isEmpty = false;

    // Wire the Apex method
    @wire(getCustomerHolds, { cif: CIF })
    wiredHolds({ error, data }) {
        this.isLoading = false;
        if (data) {
            // Map data to add a 'selected' flag
            this.accountsWithHolds = data.map(account => ({
                ...account,
                selected: false
            }));
            // Check if any accounts exist
            this.isEmpty = this.accountsWithHolds.length === 0;
            // If there is at least one account, select the first one by default?
            // Requirement: only one record selected at a time; we can leave none selected
            // or pre-select first. We'll leave none selected, so details panel remains empty.
            this.selectedAccount = null;
        } else if (error) {
            console.error('Error fetching holds:', error);
            this.isEmpty = true;
            this.accountsWithHolds = [];
        }
    }

    // Handle radio button change
    handleRadioChange(event) {
        const selectedAccNumber = event.target.value;
        // Update selected flag on all accounts
        this.accountsWithHolds = this.accountsWithHolds.map(account => ({
            ...account,
            selected: account.accountNumber === selectedAccNumber
        }));
        // Find the selected account object
        this.selectedAccount = this.accountsWithHolds.find(acc => acc.accountNumber === selectedAccNumber) || null;
    }
}