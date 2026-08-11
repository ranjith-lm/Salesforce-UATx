declare module "@salesforce/apex/SegmentAPIHandler.loadSegmentOptionsCRM" {
  export default function loadSegmentOptionsCRM(param: {customerId: any, caseId: any, regionName: any}): Promise<any>;
}
declare module "@salesforce/apex/SegmentAPIHandler.upDowngradeSegment" {
  export default function upDowngradeSegment(param: {customerId: any, availableCard: any, discount: any, embossName: any, caseId: any, regionName: any}): Promise<any>;
}
declare module "@salesforce/apex/SegmentAPIHandler.updateAccount" {
  export default function updateAccount(param: {accountId: any, staffId: any, staffCorporateEmail: any}): Promise<any>;
}
declare module "@salesforce/apex/SegmentAPIHandler.updateSegment" {
  export default function updateSegment(param: {customerId: any, newSegmentCRMId: any, caseId: any, regionName: any}): Promise<any>;
}
declare module "@salesforce/apex/SegmentAPIHandler.sendToSegmentChangeMaker" {
  export default function sendToSegmentChangeMaker(param: {caseId: any, currentSegment: any, newSegment: any, discountName: any}): Promise<any>;
}
declare module "@salesforce/apex/SegmentAPIHandler.updateAccountDetails" {
  export default function updateAccountDetails(param: {accountId: any, staffId: any, exitDate: any, staffCorporateEmail: any, caseId: any, currentSegment: any}): Promise<any>;
}
