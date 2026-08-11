declare module "@salesforce/apex/KanzAPIController.loadPrizeLinkedAccount" {
  export default function loadPrizeLinkedAccount(param: {customerId: any, caseId: any, regionName: any}): Promise<any>;
}
declare module "@salesforce/apex/KanzAPIController.loadKanzAccountTransactions" {
  export default function loadKanzAccountTransactions(param: {customerId: any, searchParametersJson: any, regionName: any}): Promise<any>;
}
declare module "@salesforce/apex/KanzAPIController.createAuditRecordForKanzDetails" {
  export default function createAuditRecordForKanzDetails(param: {accCIF: any, accIBAN: any}): Promise<any>;
}
declare module "@salesforce/apex/KanzAPIController.loadDataSensitiveData" {
  export default function loadDataSensitiveData(param: {customerId: any}): Promise<any>;
}
declare module "@salesforce/apex/KanzAPIController.loadAccountDetails" {
  export default function loadAccountDetails(param: {customerId: any, accountId: any, regionName: any}): Promise<any>;
}
declare module "@salesforce/apex/KanzAPIController.getJordanVisibility" {
  export default function getJordanVisibility(param: {customerId: any}): Promise<any>;
}
