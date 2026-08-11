/********************************************************************************************
* @name                 WaiverRequestController
* @description          This controller is responsible to generate the public link for uploaded file, when Waiver record created.
*						Code coverage of this class is done under WaiverApprovalTriggerHandlerTest
* @date                 23/12/2025
* @cretaedby            Maksud
*********************************************************************************************
* version               Author              Date            Comments
* 1.0                   Maksud           23/12/2025     Initial Version
*********************************************************************************************
*/


public class WaiverRequestController {

    @AuraEnabled(cacheable=true)
    public static List<CustomApprovalResponse> getWaiverApprovalHistory(String recordId){
        
        New_Wavier_Approval__c waiverObj = [Select Id, Email_Approver_User__c,Email_Approver_User__r.Name FROM New_Wavier_Approval__c WHERE Id = :recordId];
        
        List<ProcessInstanceStep> steps = [SELECT Id,Comments,StepStatus,OriginalActor.Name,ProcessInstance.Status,
                                           ProcessInstance.CreatedDate,ProcessInstance.LastModifiedDate,ActorId,Actor.Name
                                           FROM ProcessInstanceStep
                                           WHERE ProcessInstance.TargetObjectId =: recordId ORDER BY CreatedDate DESC];
        
        List<CustomApprovalResponse> response = new List<CustomApprovalResponse>();
        
        for(ProcessInstanceStep step : steps){
            CustomApprovalResponse res = new CustomApprovalResponse();
            
            res.comments = step.Comments;
            res.originalApprover = step.OriginalActor.Name;
            res.status = step.StepStatus;
            res.dtTime = step.ProcessInstance.LastModifiedDate;
            res.currentApprover = step.Actor.Name;
            if(step.StepStatus == 'Approved' || step.StepStatus == 'Rejected'){
                //checking if record is approved through email service.
                if(!String.isEmpty(waiverObj.Email_Approver_User__c)){
                    res.currentApprover = waiverObj.Email_Approver_User__r.Name;
                }
            }
            
            response.add(res);
        }
        
        return response;
    }
    
    @AuraEnabled(cacheable=false)
    public static string createWaiverRequest(String jsonFieldData,List<String> documentIds){
        Map<String,Object> fieldMap = (Map<String,Object>)JSON.deserializeUnTyped(jsonFieldData);
        String recordId = '';
        try {
        	New_Wavier_Approval__c waiver = new New_Wavier_Approval__c();
            waiver.Customer__c = (String)fieldMap.get('accountId');
            waiver.Subject__c = (String)fieldMap.get('subject');
            waiver.Description__c = (String)fieldMap.get('description');
            waiver.Case_Model__c = (String)fieldMap.get('caseModel');
            waiver.Type__c = (String)fieldMap.get('type');
            waiver.Sub_Type__c = (String)fieldMap.get('subType');
            waiver.Request_Type__c = (String)fieldMap.get('requestType');
            waiver.Case_Origin__c = (String)fieldMap.get('caseOrigin');
            String amount = (String)fieldMap.get('claimAmount');
            waiver.ContentDocumentId__c = (String)fieldMap.get('contentDocumentId');
            waiver.Claim_Amount__c = Decimal.valueOf(amount);
            waiver.Transaction_Reference_Number__c = (String) fieldMap.get('transactionRefNumber');
            
            insert waiver;
            recordId = waiver.Id;
            
            //If there is a file selected while creating waiver the below code executed.
            if(!String.isEmpty(waiver.ContentDocumentId__c)){
                
                
            	List<ContentDocumentLink> cdLinksToDelete = new List<ContentDocumentLink>();
                for(ContentDocumentLink cdl : [Select Id,ShareType FROM ContentDocumentLink WHERE 
                                               contentDocumentId IN : documentIds AND LinkedEntityId =:waiver.Customer__c]){
                    if(cdl.ShareType == 'V'){
                        cdLinksToDelete.add(cdl);
                    }
                }
                
                if(!cdLinksToDelete.isEmpty()){
                   //Delete the contentlink record for account, when file was uploaded it associated with account record 
                   //as aura file component directly upload file prior of waiver record creating, so we gave account id reference
                   //now that reference would be deleted and actual record would be linked to uploaded file.
                   delete cdLinksToDelete; 
                }
                
                ContentDocumentLink cdl = new ContentDocumentLink();
                cdl.ContentDocumentId = waiver.contentDocumentId__c;
                cdl.LinkedEntityId = waiver.Id;
                cdl.ShareType = 'V';
                insert cdl;    
            }
            
        }
        catch(Exception ex){
            System.debug('Ex ' + ex);
            System.debug('Ex message ' + ex.getMessage());
            throw ex;
        }
    	return '{\"status\":\"success\",\"recordId\":\"' + recordId + '\"}';
    }
    
    
    
    @AuraEnabled(cacheable=false)
    public static String validateFileSize(String contentDoumentId){
        List<ContentDocument> docs = [SELECT Id,ContentSize 
                                     FROM ContentDocument WHERE Id =: contentDoumentId limit 1];
        Long maxFileSize = 15728640;//default size is 15MB
        if(!docs.isEmpty()){
            if (!String.isBlank(Label.Waiver_File_Size_Limit)) {
                maxFileSize = Long.valueOf(Label.Waiver_File_Size_Limit);
            }
            
            if(docs[0].ContentSize > maxFileSize){
                try {
                	delete docs;
                    Long sizee = maxFileSize / (1024*1024);
                    return 'File size cannot be more than ' + sizee + 'MB';
            	}
                catch(Exception ex){
                    return ex.getMessage();
                }
            }
        }
        return 'success';
    }
    
    
    public class CustomApprovalResponse {
        @AuraEnabled 
        public DateTime dtTime;
        
        @AuraEnabled 
        public String status;
        
        @AuraEnabled 
        public String originalApprover;
        
        @AuraEnabled 
        public String currentApprover;
        
        @AuraEnabled 
        public String comments;
    }
}