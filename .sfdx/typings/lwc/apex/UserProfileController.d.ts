declare module "@salesforce/apex/UserProfileController.getCaseAccount" {
  export default function getCaseAccount(param: {caseId: any}): Promise<any>;
}
declare module "@salesforce/apex/UserProfileController.loadCusProVisibility" {
  export default function loadCusProVisibility(): Promise<any>;
}
declare module "@salesforce/apex/UserProfileController.updateProfile" {
  export default function updateProfile(param: {acc: any, customerId: any, caseId: any, personEmail: any, regionName: any}): Promise<any>;
}
declare module "@salesforce/apex/UserProfileController.sendOnboardingContinue" {
  export default function sendOnboardingContinue(param: {acc: any, caseId: any, customerId: any, actionName: any, requestBody: any, email: any, regionName: any}): Promise<any>;
}
declare module "@salesforce/apex/UserProfileController.sendManualOnboardingRequest" {
  export default function sendManualOnboardingRequest(param: {caseId: any, customerId: any, actionName: any, requestBody: any, email: any, regionName: any}): Promise<any>;
}
declare module "@salesforce/apex/UserProfileController.sendManualOnboardingRequestForEkey" {
  export default function sendManualOnboardingRequestForEkey(param: {caseId: any, customerId: any, actionName: any, requestBody: any, email: any, regionName: any}): Promise<any>;
}
declare module "@salesforce/apex/UserProfileController.ClearEkeyManual" {
  export default function ClearEkeyManual(param: {caseId: any, customerId: any, email: any, regionName: any}): Promise<any>;
}
declare module "@salesforce/apex/UserProfileController.doSaveFieldUpdate" {
  export default function doSaveFieldUpdate(param: {acc: any}): Promise<any>;
}
declare module "@salesforce/apex/UserProfileController.sendOnboardingContinueFuture" {
  export default function sendOnboardingContinueFuture(param: {acc: any, caseId: any, customerId: any, actionName: any, requestBody: any, email: any}): Promise<any>;
}
declare module "@salesforce/apex/UserProfileController.prospectSource" {
  export default function prospectSource(param: {CaseID: any}): Promise<any>;
}
declare module "@salesforce/apex/UserProfileController.isWatiqueUpload" {
  export default function isWatiqueUpload(param: {caseId: any}): Promise<any>;
}
declare module "@salesforce/apex/UserProfileController.eKYCsignOffCase" {
  export default function eKYCsignOffCase(param: {caseId: any}): Promise<any>;
}
declare module "@salesforce/apex/UserProfileController.checkCaseSubType" {
  export default function checkCaseSubType(param: {caseId: any}): Promise<any>;
}
declare module "@salesforce/apex/UserProfileController.checkMakerResult" {
  export default function checkMakerResult(param: {caseId: any}): Promise<any>;
}
declare module "@salesforce/apex/UserProfileController.updateCustomerTemporaryFields" {
  export default function updateCustomerTemporaryFields(param: {acc: any, customerId: any, caseId: any, personEmail: any, regionName: any}): Promise<any>;
}
declare module "@salesforce/apex/UserProfileController.sendingEmailNotification" {
  export default function sendingEmailNotification(param: {acc: any, customerId: any, caseId: any}): Promise<any>;
}
declare module "@salesforce/apex/UserProfileController.isDuplicateId" {
  export default function isDuplicateId(param: {idNumber: any, acc: any, regionName: any}): Promise<any>;
}
declare module "@salesforce/apex/UserProfileController.checkForDuplicates" {
  export default function checkForDuplicates(param: {caseId: any, email: any, mobile: any, customerId: any}): Promise<any>;
}
declare module "@salesforce/apex/UserProfileController.validateNoDuplicates" {
  export default function validateNoDuplicates(param: {caseId: any, email: any, mobile: any, customerId: any}): Promise<any>;
}
declare module "@salesforce/apex/UserProfileController.continueOnboarding" {
  export default function continueOnboarding(param: {caseId: any, nationality: any}): Promise<any>;
}
declare module "@salesforce/apex/UserProfileController.validateeKeyDocumentsSimple" {
  export default function validateeKeyDocumentsSimple(param: {caseId: any, nationality: any}): Promise<any>;
}
declare module "@salesforce/apex/UserProfileController.verifyEKeyPerson" {
  export default function verifyEKeyPerson(param: {customerId: any, idNumber: any, idCountry: any, expiryDate: any, dateOfBirth: any, gender: any, nationality: any, guardianCIF: any, regionName: any}): Promise<any>;
}
declare module "@salesforce/apex/UserProfileController.getAccountCIF" {
  export default function getAccountCIF(param: {accountId: any}): Promise<any>;
}
declare module "@salesforce/apex/UserProfileController.checkCIFNumber" {
  export default function checkCIFNumber(param: {cifNumber: any}): Promise<any>;
}
