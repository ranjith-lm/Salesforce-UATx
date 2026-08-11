declare module "@salesforce/apex/CBJCifReportService.getReportRequests" {
  export default function getReportRequests(param: {cif: any, email: any, region: any}): Promise<any>;
}
declare module "@salesforce/apex/CBJCifReportService.getAccountDetails" {
  export default function getAccountDetails(param: {cif: any, region: any}): Promise<any>;
}
declare module "@salesforce/apex/CBJCifReportService.getCustomerInfo" {
  export default function getCustomerInfo(param: {recordId: any}): Promise<any>;
}
