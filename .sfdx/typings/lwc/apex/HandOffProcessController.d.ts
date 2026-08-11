declare module "@salesforce/apex/HandOffProcessController.getCaseAnnexFields" {
  export default function getCaseAnnexFields(param: {caseId: any}): Promise<any>;
}
declare module "@salesforce/apex/HandOffProcessController.checkContentsofList" {
  export default function checkContentsofList(param: {caseId: any}): Promise<any>;
}
declare module "@salesforce/apex/HandOffProcessController.submitForm" {
  export default function submitForm(param: {caseId: any, earlySettlementReason: any, FEEAmount: any, FEEType: any, ReversalWaiverReason: any, InstallDefermentReason: any, NumberDeferredInstallments: any, PartialSettlementRestructureValue: any, PartialSettlementAmount: any, PartialSettlementTerm: any, newRate: any, InstalmentsForAdvancePayments: any, AdvancePaymentReason: any, AdvancePaymentValue: any, restructuringValue: any, LoanId: any, loanObj: any}): Promise<any>;
}
declare module "@salesforce/apex/HandOffProcessController.syncForm" {
  export default function syncForm(param: {caseId: any, LoanId: any, loanObj: any}): Promise<any>;
}
declare module "@salesforce/apex/HandOffProcessController.getPaymentList" {
  export default function getPaymentList(param: {customerId: any, searchParametersJson: any, regionName: any}): Promise<any>;
}
