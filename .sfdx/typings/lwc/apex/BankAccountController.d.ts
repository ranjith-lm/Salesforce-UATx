declare module "@salesforce/apex/BankAccountController.loadHysaList" {
  export default function loadHysaList(param: {customerId: any, regionName: any}): Promise<any>;
}
declare module "@salesforce/apex/BankAccountController.getJordanVisibility" {
  export default function getJordanVisibility(param: {customerId: any}): Promise<any>;
}
declare module "@salesforce/apex/BankAccountController.loadAccountList" {
  export default function loadAccountList(param: {customerId: any, regionName: any}): Promise<any>;
}
declare module "@salesforce/apex/BankAccountController.loadAccountByCif" {
  export default function loadAccountByCif(param: {cif: any}): Promise<any>;
}
declare module "@salesforce/apex/BankAccountController.loadHysaAccountDetails" {
  export default function loadHysaAccountDetails(param: {customerId: any, accountId: any, regionName: any}): Promise<any>;
}
declare module "@salesforce/apex/BankAccountController.loadAccountDetails" {
  export default function loadAccountDetails(param: {customerId: any, accountId: any, regionName: any}): Promise<any>;
}
declare module "@salesforce/apex/BankAccountController.loadAccountTransactions" {
  export default function loadAccountTransactions(param: {customerId: any, searchParametersJson: any, regionName: any}): Promise<any>;
}
declare module "@salesforce/apex/BankAccountController.requestCashCollectionOrDelivery" {
  export default function requestCashCollectionOrDelivery(param: {customerId: any, caseId: any, requestData: any, requestType: any, regionName: any}): Promise<any>;
}
declare module "@salesforce/apex/BankAccountController.requestNewCard" {
  export default function requestNewCard(param: {customerId: any, requestTextJson: any, caseId: any, extraParameters: any, personEmail: any, regionName: any}): Promise<any>;
}
declare module "@salesforce/apex/BankAccountController.loadCountryPicklistValues" {
  export default function loadCountryPicklistValues(): Promise<any>;
}
declare module "@salesforce/apex/BankAccountController.loadCurrencyPicklistValues" {
  export default function loadCurrencyPicklistValues(): Promise<any>;
}
declare module "@salesforce/apex/BankAccountController.sendEmailWithPdf" {
  export default function sendEmailWithPdf(param: {IBAN: any, startDate: any, accountCurrency: any, accountId: any, conEmail: any, conName: any, caseId: any}): Promise<any>;
}
declare module "@salesforce/apex/BankAccountController.updateCaseStatus" {
  export default function updateCaseStatus(param: {recId: any}): Promise<any>;
}
declare module "@salesforce/apex/BankAccountController.downloadIBAN" {
  export default function downloadIBAN(param: {customerId: any, accountId: any, regionName: any}): Promise<any>;
}
declare module "@salesforce/apex/BankAccountController.visibilityOptionsCheck" {
  export default function visibilityOptionsCheck(param: {caseId: any}): Promise<any>;
}
declare module "@salesforce/apex/BankAccountController.loadAccountLastTransaction" {
  export default function loadAccountLastTransaction(param: {customerId: any, searchParametersJson: any, regionName: any}): Promise<any>;
}
declare module "@salesforce/apex/BankAccountController.createAuditRecordForBankAcctDetails" {
  export default function createAuditRecordForBankAcctDetails(param: {accCIF: any, accIBAN: any}): Promise<any>;
}
declare module "@salesforce/apex/BankAccountController.sendEmailWithIBANCertificatePdf" {
  export default function sendEmailWithIBANCertificatePdf(param: {conEmail: any, file: any, accountId: any, caseId: any}): Promise<any>;
}
declare module "@salesforce/apex/BankAccountController.downloadAccountTransactionExcel" {
  export default function downloadAccountTransactionExcel(param: {customerId: any, searchParametersJson: any, regionName: any}): Promise<any>;
}
