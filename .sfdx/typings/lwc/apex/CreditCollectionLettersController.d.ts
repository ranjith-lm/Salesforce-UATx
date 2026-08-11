declare module "@salesforce/apex/CreditCollectionLettersController.getCollectionLetterCaseRecordType" {
  export default function getCollectionLetterCaseRecordType(): Promise<any>;
}
declare module "@salesforce/apex/CreditCollectionLettersController.getCollectionLetterCaseQueue" {
  export default function getCollectionLetterCaseQueue(): Promise<any>;
}
declare module "@salesforce/apex/CreditCollectionLettersController.sendEmailWithPdf" {
  export default function sendEmailWithPdf(param: {caseId: any}): Promise<any>;
}
declare module "@salesforce/apex/CreditCollectionLettersController.downloadcasePdf" {
  export default function downloadcasePdf(param: {caseId: any}): Promise<any>;
}
declare module "@salesforce/apex/CreditCollectionLettersController.getDefaultAccountIdViaApi" {
  export default function getDefaultAccountIdViaApi(param: {accountId: any, caseModel: any}): Promise<any>;
}
declare module "@salesforce/apex/CreditCollectionLettersController.validateCreditCard" {
  export default function validateCreditCard(param: {accountId: any, filerOption: any, letterType: any}): Promise<any>;
}
