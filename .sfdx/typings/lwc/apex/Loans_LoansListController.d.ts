declare module "@salesforce/apex/Loans_LoansListController.loadLoansList" {
  export default function loadLoansList(param: {customerId: any, caseModel: any}): Promise<any>;
}
declare module "@salesforce/apex/Loans_LoansListController.loadLoansEarlySettlmentApiList" {
  export default function loadLoansEarlySettlmentApiList(param: {customerId: any, loanId: any, caseModel: any}): Promise<any>;
}
declare module "@salesforce/apex/Loans_LoansListController.callLoanOptionsAPI" {
  export default function callLoanOptionsAPI(param: {caseId: any}): Promise<any>;
}
declare module "@salesforce/apex/Loans_LoansListController.loadLoanTransactions" {
  export default function loadLoanTransactions(param: {customerId: any, searchParametersJson: any, regionName: any}): Promise<any>;
}
declare module "@salesforce/apex/Loans_LoansListController.getSimulationPaymentList" {
  export default function getSimulationPaymentList(param: {caseId: any, regionName: any, saveLog: any}): Promise<any>;
}
declare module "@salesforce/apex/Loans_LoansListController.getPaymentList" {
  export default function getPaymentList(param: {customerId: any, searchParametersJson: any, regionName: any}): Promise<any>;
}
declare module "@salesforce/apex/Loans_LoansListController.caseRecordType" {
  export default function caseRecordType(param: {caseId: any}): Promise<any>;
}
declare module "@salesforce/apex/Loans_LoansListController.getCaseRecord" {
  export default function getCaseRecord(param: {caseId: any}): Promise<any>;
}
declare module "@salesforce/apex/Loans_LoansListController.getApprovedCases" {
  export default function getApprovedCases(param: {arrangementIds: any}): Promise<any>;
}
