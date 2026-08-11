declare module "@salesforce/apex/LeadTriggerHandler.setOwnerAsQueue" {
  export default function setOwnerAsQueue(param: {recordid: any}): Promise<any>;
}
declare module "@salesforce/apex/LeadTriggerHandler.setMakerQueueAsOwner" {
  export default function setMakerQueueAsOwner(param: {recIDSF: any, referCommentsSF: any}): Promise<any>;
}
declare module "@salesforce/apex/LeadTriggerHandler.setOwnerAsSelf" {
  export default function setOwnerAsSelf(param: {recID: any}): Promise<any>;
}
