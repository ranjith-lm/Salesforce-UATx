declare module "@salesforce/apex/BankInformationController.loadRecord" {
  export default function loadRecord(param: {recordId: any}): Promise<any>;
}
declare module "@salesforce/apex/BankInformationController.loadTabsConfig" {
  export default function loadTabsConfig(): Promise<any>;
}
declare module "@salesforce/apex/BankInformationController.sendVerificationRequest" {
  export default function sendVerificationRequest(param: {caseId: any, customerId: any, requestBody: any, systemActionName: any, email: any, regionName: any}): Promise<any>;
}
declare module "@salesforce/apex/BankInformationController.cardStatusFilter" {
  export default function cardStatusFilter(param: {recordId: any, option: any}): Promise<any>;
}
declare module "@salesforce/apex/BankInformationController.loadCreditCardPurgeList" {
  export default function loadCreditCardPurgeList(param: {recordId: any, option: any}): Promise<any>;
}
declare module "@salesforce/apex/BankInformationController.loadDebitCardList" {
  export default function loadDebitCardList(param: {recordId: any, option: any}): Promise<any>;
}
declare module "@salesforce/apex/BankInformationController.loadDebitCardPurgeList" {
  export default function loadDebitCardPurgeList(param: {recordId: any, option: any}): Promise<any>;
}
