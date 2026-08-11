declare module "@salesforce/apex/TermDepositController.termDepositList" {
  export default function termDepositList(param: {customerId: any, regionName: any}): Promise<any>;
}
declare module "@salesforce/apex/TermDepositController.termDepositMatrix" {
  export default function termDepositMatrix(param: {customerId: any, regionName: any}): Promise<any>;
}
declare module "@salesforce/apex/TermDepositController.termDepositDetails" {
  export default function termDepositDetails(param: {customerId: any, urbisContractId: any, regionName: any}): Promise<any>;
}
declare module "@salesforce/apex/TermDepositController.downloadTermDeposit" {
  export default function downloadTermDeposit(param: {customerId: any, urbisContractId: any, regionName: any}): Promise<any>;
}
declare module "@salesforce/apex/TermDepositController.sendEmailWithTermDepositPdf" {
  export default function sendEmailWithTermDepositPdf(param: {conEmail: any, file: any}): Promise<any>;
}
declare module "@salesforce/apex/TermDepositController.updateCaseStatus" {
  export default function updateCaseStatus(param: {recId: any, file: any}): Promise<any>;
}
declare module "@salesforce/apex/TermDepositController.fetchCaseStatus" {
  export default function fetchCaseStatus(param: {recId: any}): Promise<any>;
}
declare module "@salesforce/apex/TermDepositController.createAuditRecordForTermDepositDetails" {
  export default function createAuditRecordForTermDepositDetails(param: {accCIF: any, termDepositId: any, isAlburaqProduct: any}): Promise<any>;
}
declare module "@salesforce/apex/TermDepositController.closedCaseStatus" {
  export default function closedCaseStatus(param: {recId: any}): Promise<any>;
}
declare module "@salesforce/apex/TermDepositController.canUserViewFDButton" {
  export default function canUserViewFDButton(param: {regionFlag: any, segment: any}): Promise<any>;
}
declare module "@salesforce/apex/TermDepositController.getJordanVisibility" {
  export default function getJordanVisibility(param: {customerId: any}): Promise<any>;
}
