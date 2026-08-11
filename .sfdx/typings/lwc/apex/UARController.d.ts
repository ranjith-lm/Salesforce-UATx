declare module "@salesforce/apex/UARController.createSuspiciousTransactions" {
  export default function createSuspiciousTransactions(param: {transactions: any}): Promise<any>;
}
declare module "@salesforce/apex/UARController.getTransactions" {
  export default function getTransactions(param: {uarId: any}): Promise<any>;
}
declare module "@salesforce/apex/UARController.deleteTransactions" {
  export default function deleteTransactions(param: {transactionIds: any}): Promise<any>;
}
declare module "@salesforce/apex/UARController.updateTransactions" {
  export default function updateTransactions(param: {transactions: any}): Promise<any>;
}
