declare module "@salesforce/apex/EmailTemplateController.getTemplatesFromSampleFolder" {
  export default function getTemplatesFromSampleFolder(): Promise<any>;
}
declare module "@salesforce/apex/EmailTemplateController.getCaseDetailsAndTemplates" {
  export default function getCaseDetailsAndTemplates(param: {recordId: any}): Promise<any>;
}
declare module "@salesforce/apex/EmailTemplateController.sendEmailWithAttachment" {
  export default function sendEmailWithAttachment(param: {templateId: any, recordId: any, contentDocumentId: any, toAddress: any, fromAddress: any, subject: any}): Promise<any>;
}
declare module "@salesforce/apex/EmailTemplateController.checkFileSizeAndDelete" {
  export default function checkFileSizeAndDelete(param: {contentDocumentId: any, maxSize: any}): Promise<any>;
}
