declare module "@salesforce/apex/CaseFawriTransferController.getFawriTransferList" {
  export default function getFawriTransferList(param: {customerId: any, regionName: any}): Promise<any>;
}
declare module "@salesforce/apex/CaseFawriTransferController.isUserInCheckerQueue" {
  export default function isUserInCheckerQueue(): Promise<any>;
}
declare module "@salesforce/apex/CaseFawriTransferController.getCaseDetails" {
  export default function getCaseDetails(param: {recordId: any}): Promise<any>;
}
declare module "@salesforce/apex/CaseFawriTransferController.getFawriApiCount" {
  export default function getFawriApiCount(param: {recordId: any}): Promise<any>;
}
declare module "@salesforce/apex/CaseFawriTransferController.cancelFawriTransaction" {
  export default function cancelFawriTransaction(param: {recordId: any}): Promise<any>;
}
declare module "@salesforce/apex/CaseFawriTransferController.sendFawriCancellationEmail" {
  export default function sendFawriCancellationEmail(param: {recordId: any}): Promise<any>;
}
