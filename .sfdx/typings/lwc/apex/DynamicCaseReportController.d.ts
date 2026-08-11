declare module "@salesforce/apex/DynamicCaseReportController.getPaginatedReportData" {
  export default function getPaginatedReportData(param: {pageNumber: any, pageSize: any, dateRange: any, statusFilter: any, fromDateStr: any, toDateStr: any}): Promise<any>;
}
declare module "@salesforce/apex/DynamicCaseReportController.startBatchExport" {
  export default function startBatchExport(param: {dateRange: any}): Promise<any>;
}
declare module "@salesforce/apex/DynamicCaseReportController.calculateTotalTime" {
  export default function calculateTotalTime(): Promise<any>;
}
declare module "@salesforce/apex/DynamicCaseReportController.getCaseCounts" {
  export default function getCaseCounts(param: {pageNumber: any, pageSize: any, dateRange: any, statusFilter: any, fromDateStr: any, toDateStr: any}): Promise<any>;
}
