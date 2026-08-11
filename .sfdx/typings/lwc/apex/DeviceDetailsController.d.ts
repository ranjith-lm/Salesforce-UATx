declare module "@salesforce/apex/DeviceDetailsController.loadDeviceList" {
  export default function loadDeviceList(param: {accID: any}): Promise<any>;
}
declare module "@salesforce/apex/DeviceDetailsController.getCurrentCards" {
  export default function getCurrentCards(param: {accID: any}): Promise<any>;
}
declare module "@salesforce/apex/DeviceDetailsController.loadCardDetailsToFetchLimit" {
  export default function loadCardDetailsToFetchLimit(param: {accID: any, requestedPCINumber: any}): Promise<any>;
}
declare module "@salesforce/apex/DeviceDetailsController.getFixedDeposits" {
  export default function getFixedDeposits(param: {accID: any}): Promise<any>;
}
declare module "@salesforce/apex/DeviceDetailsController.getSavingPots" {
  export default function getSavingPots(param: {accID: any}): Promise<any>;
}
declare module "@salesforce/apex/DeviceDetailsController.getCurrentDebitCards" {
  export default function getCurrentDebitCards(param: {accID: any}): Promise<any>;
}
declare module "@salesforce/apex/DeviceDetailsController.getForeignAccounts" {
  export default function getForeignAccounts(param: {accID: any}): Promise<any>;
}
