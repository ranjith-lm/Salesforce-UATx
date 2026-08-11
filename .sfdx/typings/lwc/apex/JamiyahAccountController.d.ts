declare module "@salesforce/apex/JamiyahAccountController.recordTypeServiceRequest" {
  export default function recordTypeServiceRequest(): Promise<any>;
}
declare module "@salesforce/apex/JamiyahAccountController.loadJamiyahAccountList" {
  export default function loadJamiyahAccountList(param: {customerId: any, regionName: any}): Promise<any>;
}
declare module "@salesforce/apex/JamiyahAccountController.loadJamiyahAccountDetails" {
  export default function loadJamiyahAccountDetails(param: {customerId: any, jameyaId: any, regionName: any}): Promise<any>;
}
declare module "@salesforce/apex/JamiyahAccountController.apexStopJamiyah" {
  export default function apexStopJamiyah(param: {customerId: any, isAdmin: any, newCaseId: any, regionName: any}): Promise<any>;
}
declare module "@salesforce/apex/JamiyahAccountController.createAuditRecordForJamiyahDetails" {
  export default function createAuditRecordForJamiyahDetails(param: {accCIF: any, jameyaId: any}): Promise<any>;
}
