declare module "@salesforce/apex/CaseAnnexController.getConfigJson" {
  export default function getConfigJson(param: {subtype: any, type: any, recTypeDveloperName: any}): Promise<any>;
}
declare module "@salesforce/apex/CaseAnnexController.getCaseAnnexFields" {
  export default function getCaseAnnexFields(param: {recordId: any}): Promise<any>;
}
declare module "@salesforce/apex/CaseAnnexController.getCaseFields" {
  export default function getCaseFields(param: {recordId: any}): Promise<any>;
}
declare module "@salesforce/apex/CaseAnnexController.updateRecordsWithRollback" {
  export default function updateRecordsWithRollback(param: {cas: any, caseAnnexe: any}): Promise<any>;
}
declare module "@salesforce/apex/CaseAnnexController.getOwnerDeveloperName" {
  export default function getOwnerDeveloperName(param: {ownerid: any}): Promise<any>;
}
