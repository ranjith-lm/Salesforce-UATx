declare module "@salesforce/apex/CustomEmailComposerController.sendEmail" {
  export default function sendEmail(param: {toAddress: any, ccAddress: any, subject: any, body: any, recordId: any}): Promise<any>;
}
declare module "@salesforce/apex/CustomEmailComposerController.getJordanCase" {
  export default function getJordanCase(param: {recordId: any}): Promise<any>;
}
declare module "@salesforce/apex/CustomEmailComposerController.updateQueueOwner" {
  export default function updateQueueOwner(param: {recordId: any, queueName: any}): Promise<any>;
}
declare module "@salesforce/apex/CustomEmailComposerController.getHtmlTemplate" {
  export default function getHtmlTemplate(): Promise<any>;
}
