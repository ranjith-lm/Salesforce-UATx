declare module "@salesforce/apex/CreditCardUpgradeRequestController.getDefaultName" {
  export default function getDefaultName(param: {accID: any}): Promise<any>;
}
declare module "@salesforce/apex/CreditCardUpgradeRequestController.isCampaignUpgradeUser" {
  export default function isCampaignUpgradeUser(): Promise<any>;
}
declare module "@salesforce/apex/CreditCardUpgradeRequestController.getCreditCardPCIOptions" {
  export default function getCreditCardPCIOptions(param: {accID: any, caseModel: any}): Promise<any>;
}
declare module "@salesforce/apex/CreditCardUpgradeRequestController.getCreditCardUpgradeOptions" {
  export default function getCreditCardUpgradeOptions(param: {accID: any, caseModel: any, subType: any}): Promise<any>;
}
declare module "@salesforce/apex/CreditCardUpgradeRequestController.checkOtherCardsExist" {
  export default function checkOtherCardsExist(param: {accID: any}): Promise<any>;
}
declare module "@salesforce/apex/CreditCardUpgradeRequestController.getPCIOptionsSuppCards" {
  export default function getPCIOptionsSuppCards(param: {accID: any, caseModel: any, requestedPCINumber: any}): Promise<any>;
}
declare module "@salesforce/apex/CreditCardUpgradeRequestController.loadCardDetails" {
  export default function loadCardDetails(param: {accID: any, caseModel: any, requestedPCINumber: any}): Promise<any>;
}
declare module "@salesforce/apex/CreditCardUpgradeRequestController.fetchGulfAirId" {
  export default function fetchGulfAirId(param: {customerId: any, membershipId: any}): Promise<any>;
}
declare module "@salesforce/apex/CreditCardUpgradeRequestController.enrollGulfAirMembershipId" {
  export default function enrollGulfAirMembershipId(param: {customerId: any}): Promise<any>;
}
declare module "@salesforce/apex/CreditCardUpgradeRequestController.manageGulfAirMembershipId" {
  export default function manageGulfAirMembershipId(param: {customerId: any, membershipId: any}): Promise<any>;
}
declare module "@salesforce/apex/CreditCardUpgradeRequestController.checkCaseSubType" {
  export default function checkCaseSubType(param: {caseId: any}): Promise<any>;
}
