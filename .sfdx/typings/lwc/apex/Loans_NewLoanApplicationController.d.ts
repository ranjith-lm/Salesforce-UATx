declare module "@salesforce/apex/Loans_NewLoanApplicationController.callLoanOptionsAPI" {
  export default function callLoanOptionsAPI(param: {customerId: any, caseModel: any}): Promise<any>;
}
declare module "@salesforce/apex/Loans_NewLoanApplicationController.getUserApplicationInfoAPI" {
  export default function getUserApplicationInfoAPI(param: {customerId: any, loanProductConfigurationId: any, caseModel: any}): Promise<any>;
}
declare module "@salesforce/apex/Loans_NewLoanApplicationController.getExistingLiabilitiesAPI" {
  export default function getExistingLiabilitiesAPI(param: {customerId: any, caseModel: any, loanAmount: any, loanDuration: any, loanMonthlyInstalment: any}): Promise<any>;
}
declare module "@salesforce/apex/Loans_NewLoanApplicationController.getCustomerProductsAPI" {
  export default function getCustomerProductsAPI(param: {customerId: any, caseModel: any}): Promise<any>;
}
declare module "@salesforce/apex/Loans_NewLoanApplicationController.getLoanCalculatorMatrixAPI" {
  export default function getLoanCalculatorMatrixAPI(param: {customerId: any, caseModel: any}): Promise<any>;
}
declare module "@salesforce/apex/Loans_NewLoanApplicationController.getAccountRecord" {
  export default function getAccountRecord(param: {accountId: any}): Promise<any>;
}
declare module "@salesforce/apex/Loans_NewLoanApplicationController.calculatorApiCall" {
  export default function calculatorApiCall(param: {param: any}): Promise<any>;
}
declare module "@salesforce/apex/Loans_NewLoanApplicationController.checkExistanceOfComplianceCase" {
  export default function checkExistanceOfComplianceCase(param: {accountId: any}): Promise<any>;
}
