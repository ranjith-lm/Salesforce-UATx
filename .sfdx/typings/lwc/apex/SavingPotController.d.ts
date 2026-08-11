declare module "@salesforce/apex/SavingPotController.loadSavingPots" {
  export default function loadSavingPots(param: {customerId: any, regionName: any}): Promise<any>;
}
declare module "@salesforce/apex/SavingPotController.loadPotDetails" {
  export default function loadPotDetails(param: {customerId: any, potId: any, regionName: any}): Promise<any>;
}
declare module "@salesforce/apex/SavingPotController.loadPotTransactions" {
  export default function loadPotTransactions(param: {customerId: any, potId: any, searchParametersJson: any, regionName: any}): Promise<any>;
}
declare module "@salesforce/apex/SavingPotController.createAuditRecordForSavingPotDetails" {
  export default function createAuditRecordForSavingPotDetails(param: {accCIF: any, potId: any}): Promise<any>;
}
declare module "@salesforce/apex/SavingPotController.getJordanVisibility" {
  export default function getJordanVisibility(param: {customerId: any}): Promise<any>;
}
