declare module "@salesforce/apex/WPSPayrollHandler.getFeesDetails" {
  export default function getFeesDetails(param: {data: any}): Promise<any>;
}
declare module "@salesforce/apex/WPSPayrollHandler.calculateFees" {
  export default function calculateFees(param: {recordId: any, regionName: any, payrollAmount: any, payrollCurrency: any, payrollDebitAccountIBAN: any, payrollNoOfSalaries: any, cif: any, customerId: any}): Promise<any>;
}
