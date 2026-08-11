declare module "@salesforce/apex/BankCardListController.loadSegmentOptionsCRM" {
  export default function loadSegmentOptionsCRM(param: {customerId: any, caseId: any, regionName: any}): Promise<any>;
}
declare module "@salesforce/apex/BankCardListController.upDowngradeSegment" {
  export default function upDowngradeSegment(param: {customerId: any, availableCard: any, discount: any, embossName: any, caseId: any, regionName: any}): Promise<any>;
}
declare module "@salesforce/apex/BankCardListController.loadCardList" {
  export default function loadCardList(param: {customerId: any, personEmail: any, regionName: any, recordId: any}): Promise<any>;
}
declare module "@salesforce/apex/BankCardListController.loadCardDetails" {
  export default function loadCardDetails(param: {customerId: any, cardId: any, personEmail: any, regionName: any}): Promise<any>;
}
declare module "@salesforce/apex/BankCardListController.blockCard" {
  export default function blockCard(param: {customerId: any, blockCardData: any, caseId: any, personEmail: any, regionName: any}): Promise<any>;
}
declare module "@salesforce/apex/BankCardListController.requestNewCard" {
  export default function requestNewCard(param: {customerId: any, requestTextJson: any, maskedCardNumber: any, caseId: any, extraParameters: any, personEmail: any, regionName: any}): Promise<any>;
}
declare module "@salesforce/apex/BankCardListController.changeCardStatus" {
  export default function changeCardStatus(param: {customerId: any, parameterData: any, caseId: any, personEmail: any, regionName: any}): Promise<any>;
}
declare module "@salesforce/apex/BankCardListController.changeCardAccountAssociation" {
  export default function changeCardAccountAssociation(param: {customerId: any, parameterData: any, caseId: any, personEmail: any, regionName: any}): Promise<any>;
}
declare module "@salesforce/apex/BankCardListController.loadAccountList" {
  export default function loadAccountList(param: {customerId: any, regionName: any}): Promise<any>;
}
declare module "@salesforce/apex/BankCardListController.visibilityOptionsCheck" {
  export default function visibilityOptionsCheck(param: {caseId: any}): Promise<any>;
}
declare module "@salesforce/apex/BankCardListController.createAuditRecordForDebitCardDetails" {
  export default function createAuditRecordForDebitCardDetails(param: {accCIF: any, maskNumber: any, cardClassification: any, cardStatus: any}): Promise<any>;
}
