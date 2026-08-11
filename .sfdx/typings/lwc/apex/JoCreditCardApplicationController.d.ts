declare module "@salesforce/apex/JoCreditCardApplicationController.loadCardList" {
  export default function loadCardList(param: {customerId: any, personEmail: any, regionName: any}): Promise<any>;
}
declare module "@salesforce/apex/JoCreditCardApplicationController.loadCardDetails" {
  export default function loadCardDetails(param: {customerId: any, cardId: any, personEmail: any, regionName: any}): Promise<any>;
}
declare module "@salesforce/apex/JoCreditCardApplicationController.loadEPPList" {
  export default function loadEPPList(param: {customerId: any, pciNumber: any, regionName: any}): Promise<any>;
}
declare module "@salesforce/apex/JoCreditCardApplicationController.blockCard" {
  export default function blockCard(param: {customerId: any, blockCardData: any, caseId: any, personEmail: any, regionName: any}): Promise<any>;
}
declare module "@salesforce/apex/JoCreditCardApplicationController.requestNewCard" {
  export default function requestNewCard(param: {customerId: any, requestTextJson: any, maskedCardNumber: any, caseId: any, extraParameters: any, personEmail: any, regionName: any}): Promise<any>;
}
declare module "@salesforce/apex/JoCreditCardApplicationController.changeCardStatus" {
  export default function changeCardStatus(param: {customerId: any, parameterData: any, caseId: any, personEmail: any, regionName: any}): Promise<any>;
}
declare module "@salesforce/apex/JoCreditCardApplicationController.changeCardAccountAssociation" {
  export default function changeCardAccountAssociation(param: {customerId: any, parameterData: any, caseId: any, personEmail: any, regionName: any}): Promise<any>;
}
declare module "@salesforce/apex/JoCreditCardApplicationController.loadAccountList" {
  export default function loadAccountList(param: {customerId: any, regionName: any}): Promise<any>;
}
declare module "@salesforce/apex/JoCreditCardApplicationController.getCaseSubType" {
  export default function getCaseSubType(param: {caseIdapex: any}): Promise<any>;
}
declare module "@salesforce/apex/JoCreditCardApplicationController.loadAccountTransactions" {
  export default function loadAccountTransactions(param: {customerId: any, searchParametersJson: any, regionName: any}): Promise<any>;
}
declare module "@salesforce/apex/JoCreditCardApplicationController.caseType" {
  export default function caseType(param: {caseId: any}): Promise<any>;
}
declare module "@salesforce/apex/JoCreditCardApplicationController.fetchMakerResult" {
  export default function fetchMakerResult(param: {caseId: any}): Promise<any>;
}
declare module "@salesforce/apex/JoCreditCardApplicationController.getCardOptions" {
  export default function getCardOptions(param: {accID: any, caseModel: any}): Promise<any>;
}
declare module "@salesforce/apex/JoCreditCardApplicationController.getCardConfigurations" {
  export default function getCardConfigurations(param: {accID: any, caseModel: any}): Promise<any>;
}
declare module "@salesforce/apex/JoCreditCardApplicationController.getAccId" {
  export default function getAccId(param: {cseId: any}): Promise<any>;
}
declare module "@salesforce/apex/JoCreditCardApplicationController.getPCIOptions" {
  export default function getPCIOptions(param: {accID: any, caseModel: any}): Promise<any>;
}
declare module "@salesforce/apex/JoCreditCardApplicationController.getPCIOptionsCashCollateralLimitIncrease" {
  export default function getPCIOptionsCashCollateralLimitIncrease(param: {accID: any, caseModel: any}): Promise<any>;
}
declare module "@salesforce/apex/JoCreditCardApplicationController.getDefaultName" {
  export default function getDefaultName(param: {accID: any}): Promise<any>;
}
declare module "@salesforce/apex/JoCreditCardApplicationController.getRegionName" {
  export default function getRegionName(param: {accID: any}): Promise<any>;
}
declare module "@salesforce/apex/JoCreditCardApplicationController.creditCardFCRAPI" {
  export default function creditCardFCRAPI(param: {customerId: any, parameterData: any, caseId: any, personEmail: any, regionName: any}): Promise<any>;
}
declare module "@salesforce/apex/JoCreditCardApplicationController.sendEmailWithPdf" {
  export default function sendEmailWithPdf(param: {caseId: any, IBAN: any, startDate: any, accountCurrency: any}): Promise<any>;
}
declare module "@salesforce/apex/JoCreditCardApplicationController.sendToBusinessApproval" {
  export default function sendToBusinessApproval(param: {caseId: any}): Promise<any>;
}
declare module "@salesforce/apex/JoCreditCardApplicationController.sendForRejection" {
  export default function sendForRejection(param: {caseId: any}): Promise<any>;
}
declare module "@salesforce/apex/JoCreditCardApplicationController.checkVisibilityStatement" {
  export default function checkVisibilityStatement(param: {accountId: any}): Promise<any>;
}
declare module "@salesforce/apex/JoCreditCardApplicationController.getPCIOptionsV2" {
  export default function getPCIOptionsV2(param: {accID: any, caseModel: any}): Promise<any>;
}
declare module "@salesforce/apex/JoCreditCardApplicationController.loadRewardDetails" {
  export default function loadRewardDetails(param: {customerId: any, cardId: any, regionName: any, Option: any}): Promise<any>;
}
declare module "@salesforce/apex/JoCreditCardApplicationController.createAuditRecordForCreditCardDetails" {
  export default function createAuditRecordForCreditCardDetails(param: {accCIF: any, maskNumber: any, cardClassification: any, cardStatus: any}): Promise<any>;
}
declare module "@salesforce/apex/JoCreditCardApplicationController.termDepositListApiCall" {
  export default function termDepositListApiCall(param: {accID: any, caseModel: any, typeCase: any}): Promise<any>;
}
declare module "@salesforce/apex/JoCreditCardApplicationController.termDepositList" {
  export default function termDepositList(param: {accID: any, caseModel: any}): Promise<any>;
}
declare module "@salesforce/apex/JoCreditCardApplicationController.termDepositListForLimitIncrease" {
  export default function termDepositListForLimitIncrease(param: {accID: any, caseModel: any}): Promise<any>;
}
declare module "@salesforce/apex/JoCreditCardApplicationController.fetchGulfAirId" {
  export default function fetchGulfAirId(param: {customerId: any, membershipId: any}): Promise<any>;
}
declare module "@salesforce/apex/JoCreditCardApplicationController.downloadCashCollateral" {
  export default function downloadCashCollateral(param: {caseId: any, mapOfCardDetails: any}): Promise<any>;
}
declare module "@salesforce/apex/JoCreditCardApplicationController.sendEmailWithCashCollateralCert" {
  export default function sendEmailWithCashCollateralCert(param: {caseId: any, mapOfCardDetails: any}): Promise<any>;
}
declare module "@salesforce/apex/JoCreditCardApplicationController.getVFPageURLWithParams" {
  export default function getVFPageURLWithParams(param: {caseId: any, mapOfCardDetails: any}): Promise<any>;
}
declare module "@salesforce/apex/JoCreditCardApplicationController.updateCaseStatus" {
  export default function updateCaseStatus(param: {caseId: any}): Promise<any>;
}
declare module "@salesforce/apex/JoCreditCardApplicationController.checkCreditCardUser" {
  export default function checkCreditCardUser(): Promise<any>;
}
declare module "@salesforce/apex/JoCreditCardApplicationController.loadCardDetailsToFetchLimit" {
  export default function loadCardDetailsToFetchLimit(param: {accID: any, caseModel: any, requestedPCINumber: any}): Promise<any>;
}
declare module "@salesforce/apex/JoCreditCardApplicationController.getloadCreditCardBankList" {
  export default function getloadCreditCardBankList(param: {accId: any}): Promise<any>;
}
declare module "@salesforce/apex/JoCreditCardApplicationController.updatePCIMaskNumberOnCase" {
  export default function updatePCIMaskNumberOnCase(param: {caseId: any, pciNumber: any, mskCardNumber: any}): Promise<any>;
}
declare module "@salesforce/apex/JoCreditCardApplicationController.checkCIFNumber" {
  export default function checkCIFNumber(param: {accountId: any, cifNumber: any}): Promise<any>;
}
declare module "@salesforce/apex/JoCreditCardApplicationController.getFirstAndLastName" {
  export default function getFirstAndLastName(param: {cifNumber: any}): Promise<any>;
}
