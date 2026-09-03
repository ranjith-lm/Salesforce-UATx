declare module "@salesforce/apex/WaiverRequestController.getWaiverApprovalHistory" {
  export default function getWaiverApprovalHistory(param: {recordId: any}): Promise<any>;
}
declare module "@salesforce/apex/WaiverRequestController.createWaiverRequest" {
  export default function createWaiverRequest(param: {jsonFieldData: any, documentIds: any}): Promise<any>;
}
declare module "@salesforce/apex/WaiverRequestController.sendReminderEmail" {
  export default function sendReminderEmail(param: {recordId: any}): Promise<any>;
}
declare module "@salesforce/apex/WaiverRequestController.validateFileSize" {
  export default function validateFileSize(param: {contentDoumentId: any}): Promise<any>;
}
declare module "@salesforce/apex/WaiverRequestController.loadAccountList" {
  export default function loadAccountList(param: {customerId: any}): Promise<any>;
}
declare module "@salesforce/apex/WaiverRequestController.loadAccountTransactions" {
  export default function loadAccountTransactions(param: {customerId: any, searchParametersJson: any}): Promise<any>;
}
