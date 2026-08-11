declare module "@salesforce/apex/BondSukukInfoController.loadBondList" {
  export default function loadBondList(param: {customerId: any, regionName: any}): Promise<any>;
}
declare module "@salesforce/apex/BondSukukInfoController.loadBondDetails" {
  export default function loadBondDetails(param: {customerId: any, ISINCode: any, regionName: any}): Promise<any>;
}
declare module "@salesforce/apex/BondSukukInfoController.loadCouponDetails" {
  export default function loadCouponDetails(param: {investment_id: any, regionName: any, customerId: any}): Promise<any>;
}
