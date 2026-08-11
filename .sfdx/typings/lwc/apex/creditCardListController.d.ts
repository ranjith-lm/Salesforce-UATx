declare module "@salesforce/apex/creditCardListController.loadCardList" {
  export default function loadCardList(param: {customerId: any, personEmail: any, regionName: any}): Promise<any>;
}
declare module "@salesforce/apex/creditCardListController.getJordanVisibility" {
  export default function getJordanVisibility(param: {customerId: any}): Promise<any>;
}
declare module "@salesforce/apex/creditCardListController.loadCardDetails" {
  export default function loadCardDetails(param: {customerId: any, cardId: any, personEmail: any, regionName: any}): Promise<any>;
}
declare module "@salesforce/apex/creditCardListController.loadEPPList" {
  export default function loadEPPList(param: {customerId: any, pciNumber: any, regionName: any}): Promise<any>;
}
declare module "@salesforce/apex/creditCardListController.blockCard" {
  export default function blockCard(param: {customerId: any, blockCardData: any, caseId: any, personEmail: any, regionName: any}): Promise<any>;
}
declare module "@salesforce/apex/creditCardListController.requestNewCard" {
  export default function requestNewCard(param: {customerId: any, requestTextJson: any, maskedCardNumber: any, caseId: any, extraParameters: any, personEmail: any, regionName: any}): Promise<any>;
}
declare module "@salesforce/apex/creditCardListController.changeCardStatus" {
  export default function changeCardStatus(param: {customerId: any, parameterData: any, caseId: any, personEmail: any, regionName: any}): Promise<any>;
}
declare module "@salesforce/apex/creditCardListController.changeCardAccountAssociation" {
  export default function changeCardAccountAssociation(param: {customerId: any, parameterData: any, caseId: any, personEmail: any, regionName: any}): Promise<any>;
}
declare module "@salesforce/apex/creditCardListController.loadAccountList" {
  export default function loadAccountList(param: {customerId: any, regionName: any}): Promise<any>;
}
declare module "@salesforce/apex/creditCardListController.getCaseSubType" {
  export default function getCaseSubType(param: {caseIdapex: any}): Promise<any>;
}
declare module "@salesforce/apex/creditCardListController.loadAccountTransactions" {
  export default function loadAccountTransactions(param: {customerId: any, searchParametersJson: any, regionName: any}): Promise<any>;
}
declare module "@salesforce/apex/creditCardListController.caseType" {
  export default function caseType(param: {caseId: any}): Promise<any>;
}
declare module "@salesforce/apex/creditCardListController.loadCaseDetail" {
  export default function loadCaseDetail(param: {caseId: any}): Promise<any>;
}
declare module "@salesforce/apex/creditCardListController.fetchMakerResult" {
  export default function fetchMakerResult(param: {caseId: any}): Promise<any>;
}
declare module "@salesforce/apex/creditCardListController.getCardOptions" {
  export default function getCardOptions(param: {accID: any, caseModel: any}): Promise<any>;
}
declare module "@salesforce/apex/creditCardListController.getCardConfigurations" {
  export default function getCardConfigurations(param: {accID: any, caseModel: any}): Promise<any>;
}
declare module "@salesforce/apex/creditCardListController.getPCIOptions" {
  export default function getPCIOptions(param: {accID: any, caseModel: any}): Promise<any>;
}
declare module "@salesforce/apex/creditCardListController.getPCIOptionsCashCollateralLimitIncrease" {
  export default function getPCIOptionsCashCollateralLimitIncrease(param: {accID: any, caseModel: any}): Promise<any>;
}
declare module "@salesforce/apex/creditCardListController.getDefaultName" {
  export default function getDefaultName(param: {accID: any}): Promise<any>;
}
declare module "@salesforce/apex/creditCardListController.getRegionName" {
  export default function getRegionName(param: {accID: any}): Promise<any>;
}
declare module "@salesforce/apex/creditCardListController.creditCardFCRAPI" {
  export default function creditCardFCRAPI(param: {customerId: any, parameterData: any, caseId: any, personEmail: any, regionName: any}): Promise<any>;
}
declare module "@salesforce/apex/creditCardListController.sendEmailWithPdf" {
  export default function sendEmailWithPdf(param: {caseId: any, IBAN: any, startDate: any, accountCurrency: any}): Promise<any>;
}
declare module "@salesforce/apex/creditCardListController.sendToBusinessApproval" {
  export default function sendToBusinessApproval(param: {caseId: any}): Promise<any>;
}
declare module "@salesforce/apex/creditCardListController.sendForRejection" {
  export default function sendForRejection(param: {caseId: any}): Promise<any>;
}
declare module "@salesforce/apex/creditCardListController.checkVisibilityStatement" {
  export default function checkVisibilityStatement(param: {accountId: any}): Promise<any>;
}
declare module "@salesforce/apex/creditCardListController.getPCIOptionsV2" {
  export default function getPCIOptionsV2(param: {accID: any, caseModel: any}): Promise<any>;
}
declare module "@salesforce/apex/creditCardListController.loadRewardDetails" {
  export default function loadRewardDetails(param: {customerId: any, cardId: any, regionName: any, Option: any}): Promise<any>;
}
declare module "@salesforce/apex/creditCardListController.createAuditRecordForCreditCardDetails" {
  export default function createAuditRecordForCreditCardDetails(param: {accCIF: any, maskNumber: any, cardClassification: any, cardStatus: any}): Promise<any>;
}
declare module "@salesforce/apex/creditCardListController.termDepositListApiCall" {
  export default function termDepositListApiCall(param: {accID: any, caseModel: any, typeCase: any}): Promise<any>;
}
declare module "@salesforce/apex/creditCardListController.termDepositList" {
  export default function termDepositList(param: {accID: any, caseModel: any}): Promise<any>;
}
declare module "@salesforce/apex/creditCardListController.termDepositListForLimitIncrease" {
  export default function termDepositListForLimitIncrease(param: {accID: any, caseModel: any}): Promise<any>;
}
declare module "@salesforce/apex/creditCardListController.fetchGulfAirId" {
  export default function fetchGulfAirId(param: {customerId: any, membershipId: any}): Promise<any>;
}
declare module "@salesforce/apex/creditCardListController.downloadCashCollateral" {
  export default function downloadCashCollateral(param: {caseId: any, mapOfCardDetails: any}): Promise<any>;
}
declare module "@salesforce/apex/creditCardListController.sendEmailWithCashCollateralCert" {
  export default function sendEmailWithCashCollateralCert(param: {caseId: any, mapOfCardDetails: any}): Promise<any>;
}
declare module "@salesforce/apex/creditCardListController.getVFPageURLWithParams" {
  export default function getVFPageURLWithParams(param: {caseId: any, mapOfCardDetails: any}): Promise<any>;
}
declare module "@salesforce/apex/creditCardListController.updateCaseStatus" {
  export default function updateCaseStatus(param: {caseId: any}): Promise<any>;
}
declare module "@salesforce/apex/creditCardListController.checkCreditCardUser" {
  export default function checkCreditCardUser(): Promise<any>;
}
declare module "@salesforce/apex/creditCardListController.loadCardDetailsToFetchLimit" {
  export default function loadCardDetailsToFetchLimit(param: {accID: any, caseModel: any, requestedPCINumber: any}): Promise<any>;
}
declare module "@salesforce/apex/creditCardListController.getloadCreditCardBankList" {
  export default function getloadCreditCardBankList(param: {accId: any}): Promise<any>;
}
declare module "@salesforce/apex/creditCardListController.updatePCIMaskNumberOnCase" {
  export default function updatePCIMaskNumberOnCase(param: {caseId: any, pciNumber: any, mskCardNumber: any}): Promise<any>;
}
declare module "@salesforce/apex/creditCardListController.checkCIFNumber" {
  export default function checkCIFNumber(param: {accountId: any, cifNumber: any}): Promise<any>;
}
declare module "@salesforce/apex/creditCardListController.getFirstAndLastName" {
  export default function getFirstAndLastName(param: {cifNumber: any}): Promise<any>;
}
declare module "@salesforce/apex/creditCardListController.getActiveBTPlans" {
  export default function getActiveBTPlans(param: {accID: any, caseModel: any, requestedPCINumber: any}): Promise<any>;
}
declare module "@salesforce/apex/creditCardListController.updateCaseRecord" {
  export default function updateCaseRecord(param: {caseRecord: any}): Promise<any>;
}
declare module "@salesforce/apex/creditCardListController.getCreditCardUpgradeOptions" {
  export default function getCreditCardUpgradeOptions(param: {accID: any, caseModel: any}): Promise<any>;
}
declare module "@salesforce/apex/creditCardListController.getPCIOptionsSuppCards" {
  export default function getPCIOptionsSuppCards(param: {accID: any, caseModel: any, requestedPCINumber: any}): Promise<any>;
}
declare module "@salesforce/apex/creditCardListController.getCreditCardProductMappingCode" {
  export default function getCreditCardProductMappingCode(param: {accID: any, caseModel: any}): Promise<any>;
}
