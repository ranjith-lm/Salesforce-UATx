declare module "@salesforce/apex/PayrollController.getPayrolls" {
  export default function getPayrolls(param: {customerId: any, regionName: any, isAlburaqProd: any}): Promise<any>;
}
declare module "@salesforce/apex/PayrollController.getPayrollDetailandSalaries" {
  export default function getPayrollDetailandSalaries(param: {customerId: any, regionName: any, payrollReference: any, recordId: any}): Promise<any>;
}
declare module "@salesforce/apex/PayrollController.loadPayrollSalaryList" {
  export default function loadPayrollSalaryList(param: {customerId: any, regionName: any, isAlburaqProd: any}): Promise<any>;
}
declare module "@salesforce/apex/PayrollController.loadPayrollDetailsAndSalaryList" {
  export default function loadPayrollDetailsAndSalaryList(param: {customerId: any, regionName: any, payrollReference: any}): Promise<any>;
}
declare module "@salesforce/apex/PayrollController.savePayrollTotal" {
  export default function savePayrollTotal(param: {recordId: any, totalAmount: any, actionStatus: any, payrollData: any, selectedPayrollReference: any, CIF: any}): Promise<any>;
}
declare module "@salesforce/apex/PayrollController.getStoredPayrollData" {
  export default function getStoredPayrollData(param: {recordId: any}): Promise<any>;
}
declare module "@salesforce/apex/PayrollController.downloadPayrollDocument" {
  export default function downloadPayrollDocument(param: {customerId: any, regionName: any, payrollRef: any, payrollId: any, status: any, fileOutputType: any, fees: any, vat: any, salaryMonth: any}): Promise<any>;
}
