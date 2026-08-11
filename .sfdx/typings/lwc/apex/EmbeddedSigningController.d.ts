declare module "@salesforce/apex/EmbeddedSigningController.sendEnvelope" {
  export default function sendEnvelope(param: {recordId: any, channel: any}): Promise<any>;
}
declare module "@salesforce/apex/EmbeddedSigningController.getEmbeddedSigningUrl" {
  export default function getEmbeddedSigningUrl(param: {envId: any, url: any}): Promise<any>;
}
