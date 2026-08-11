declare module "@salesforce/apex/LoginActivityDetailsService.getRecentActivityDetails" {
  export default function getRecentActivityDetails(param: {customerId: any}): Promise<any>;
}
declare module "@salesforce/apex/LoginActivityDetailsService.getLoginActivities" {
  export default function getLoginActivities(param: {customerId: any, pageSize: any, pageNumber: any, fromDate: any, toDate: any, channel: any}): Promise<any>;
}
declare module "@salesforce/apex/LoginActivityDetailsService.getEmailAlignmentDetails" {
  export default function getEmailAlignmentDetails(param: {customerId: any}): Promise<any>;
}
declare module "@salesforce/apex/LoginActivityDetailsService.getMobileChangeHistory" {
  export default function getMobileChangeHistory(param: {customerId: any}): Promise<any>;
}
declare module "@salesforce/apex/LoginActivityDetailsService.getEmailChangeHistory" {
  export default function getEmailChangeHistory(param: {customerId: any}): Promise<any>;
}
