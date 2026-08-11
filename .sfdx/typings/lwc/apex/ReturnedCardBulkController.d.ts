declare module "@salesforce/apex/ReturnedCardBulkController.validateFile" {
  export default function validateFile(param: {contentDocumentId: any, region: any}): Promise<any>;
}
declare module "@salesforce/apex/ReturnedCardBulkController.createBatch" {
  export default function createBatch(param: {records: any, fileName: any, contentDocumentId: any, region: any}): Promise<any>;
}
declare module "@salesforce/apex/ReturnedCardBulkController.uploadFile" {
  export default function uploadFile(param: {fileName: any, base64Data: any, region: any}): Promise<any>;
}
