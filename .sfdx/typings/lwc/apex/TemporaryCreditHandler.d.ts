declare module "@salesforce/apex/TemporaryCreditHandler.getDocumentType" {
  export default function getDocumentType(param: {caseId: any}): Promise<any>;
}
declare module "@salesforce/apex/TemporaryCreditHandler.updateDocumentType" {
  export default function updateDocumentType(param: {caseId: any, documentType: any}): Promise<any>;
}
declare module "@salesforce/apex/TemporaryCreditHandler.getConsolidatedRoutingDetails" {
  export default function getConsolidatedRoutingDetails(): Promise<any>;
}
declare module "@salesforce/apex/TemporaryCreditHandler.hasContentRecords" {
  export default function hasContentRecords(param: {caseId: any, documentType: any}): Promise<any>;
}
declare module "@salesforce/apex/TemporaryCreditHandler.transferToOperationsQueue" {
  export default function transferToOperationsQueue(param: {caseId: any}): Promise<any>;
}
