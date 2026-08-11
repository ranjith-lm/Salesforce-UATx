declare module "@salesforce/apex/MetalAccountController.getMetalAccounts" {
  export default function getMetalAccounts(param: {metalType: any, customerId: any, regionName: any, xCanary: any, segment: any}): Promise<any>;
}
declare module "@salesforce/apex/MetalAccountController.getMetalTransactions" {
  export default function getMetalTransactions(param: {metalCurrency: any, pageNumber: any, pageSize: any, fromAmount: any, toAmount: any, fromDate: any, toDate: any, tradeType: any, customerId: any, regionName: any, xCanary: any}): Promise<any>;
}
declare module "@salesforce/apex/MetalAccountController.getMetalStatements" {
  export default function getMetalStatements(param: {accountId: any, statementType: any, customerId: any, regionName: any, xCanary: any}): Promise<any>;
}
declare module "@salesforce/apex/MetalAccountController.getUserSettings" {
  export default function getUserSettings(param: {userId: any, customerId: any}): Promise<any>;
}
