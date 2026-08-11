declare module "@salesforce/apex/OnboardingCaseController.loadCase" {
  export default function loadCase(param: {recordId: any}): Promise<any>;
}
declare module "@salesforce/apex/OnboardingCaseController.sendOnboardingContinueRequest" {
  export default function sendOnboardingContinueRequest(param: {caseId: any, customerId: any, actionName: any, requestBody: any, email: any, regionName: any}): Promise<any>;
}
declare module "@salesforce/apex/OnboardingCaseController.sendOnboardingContinueRequestForEkey" {
  export default function sendOnboardingContinueRequestForEkey(param: {caseId: any, customerId: any, actionName: any, requestBody: any, email: any, regionName: any}): Promise<any>;
}
declare module "@salesforce/apex/OnboardingCaseController.sendComplianceCheckRequest" {
  export default function sendComplianceCheckRequest(param: {caseId: any, customerId: any, actionName: any, email: any, regionName: any}): Promise<any>;
}
declare module "@salesforce/apex/OnboardingCaseController.setNameScreeningResult" {
  export default function setNameScreeningResult(param: {accountId: any, result: any}): Promise<any>;
}
declare module "@salesforce/apex/OnboardingCaseController.updateCaseStatus" {
  export default function updateCaseStatus(param: {caseId: any, status: any, closureType: any, rejectReason: any, fatcaDocumentExpiryDate: any, formType: any}): Promise<any>;
}
