declare module "@salesforce/apex/CacheServiceController.processCSVFile" {
  export default function processCSVFile(param: {contentDocumentId: any}): Promise<any>;
}
declare module "@salesforce/apex/CacheServiceController.clearCache" {
  export default function clearCache(param: {cacheType: any, cifList: any, fileName: any, contentDocumentId: any}): Promise<any>;
}
declare module "@salesforce/apex/CacheServiceController.getRecentCacheLogs" {
  export default function getRecentCacheLogs(): Promise<any>;
}
