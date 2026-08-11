public class EnvelopeStatusHandler extends BaseTriggerHandler {
    
    //override public void beforeInsert () {
    //... your code here
    //}
    
    //override public void beforeUpdate () {
    //... your code here
    //}
    
    override public void afterInsert () {
        documentReceived((list<dfsle__EnvelopeStatus__c>) trigger.New);
    }
    
    override public void afterUpdate () {
        documentSent((list<dfsle__EnvelopeStatus__c>) trigger.New) ;
    }
    
    //override public void afterDelete () {
    //... your code here
    //}
    
    //override public void afterUnDelete () {
    //... your code here
    //}
    public static void documentSent(list<dfsle__EnvelopeStatus__c> documentStatusList){
        Set<Id> caseIdSetCompleted = new Set<Id>();
        for(dfsle__EnvelopeStatus__c vItem : documentStatusList){
            system.debug('EnvelopeStatusTrigger||'+vItem.dfsle__Status__c +'||'+ vItem.dfsle__SourceId__c);
            if(vItem.dfsle__Status__c =='Completed'){
                caseIdSetCompleted.add(vItem.dfsle__SourceId__c);
            }
            
        }
        if(!caseIdSetCompleted .isEmpty()){
            List<Case> caseList = [SELECT Id,cc_isDocumentReceived__c,cc_isDocumentSent__c,cc_Signature_Verifier_Result__c FROM Case WHERE Id In: caseIdSetCompleted];
            for(Case xItem: caseList){
                xItem.cc_isDocumentReceived__c = true;
                xItem.cc_isDocumentSent__c = false;
                xItem.Awaiting_Customer_Feedback__c = false;
                if(xItem.cc_Signature_Verifier_Result__c=='Re-Send'){
                    xItem.cc_Signature_Verifier_Result__c = '';
                }
                update caseList;
            }
        }
    }
    
    public static void documentReceived(list<dfsle__EnvelopeStatus__c> documentStatusList){
        Set<Id> caseIdSetCompleted = new Set<Id>();
        for(dfsle__EnvelopeStatus__c vItem : documentStatusList){
            system.debug('EnvelopeStatusTrigger||'+vItem.dfsle__Status__c +'||'+ vItem.dfsle__SourceId__c);
            if(vItem.dfsle__Status__c =='Sent'){
                caseIdSetCompleted.add(vItem.dfsle__SourceId__c);
            }
            
        }
        if(!caseIdSetCompleted .isEmpty()){
            List<Case> caseList = [SELECT Id,cc_isDocumentReceived__c,cc_isDocumentSent__c,cc_Signature_Verifier_Result__c FROM Case WHERE Id In: caseIdSetCompleted];
            for(Case xItem: caseList){
                xItem.cc_isDocumentReceived__c = false;
                xItem.cc_isDocumentSent__c = true;
            }
            update caseList;
        }
    }
}