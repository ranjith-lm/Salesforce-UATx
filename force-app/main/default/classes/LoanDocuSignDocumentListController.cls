public class LoanDocuSignDocumentListController {
    
    public String caseId { get; set; }
    public String caseNumber { get; set; }
    public List<DocuSignWrapper> documentList { get; set; }
    
    @AuraEnabled(cacheable=false)
    public static List<DocuSignWrapper> getDocumentList(Id caseId,Boolean fetchAllDocument){
        List<DocuSignWrapper> documentList = new List<DocuSignWrapper>();
        
        Map<Id,Content__c> docMap = new Map<Id,Content__c>();
        System.debug('case id = ' + caseId);
        
        List<ContentDocumentLink> links = new List<ContentDocumentLink>();
        Case caseObj = [Select Id,CaseNumber,Account.CIF__pc FROM Case WHERE Id =:caseId];
        if(fetchAllDocument){
            for(Content__c cnt : [SELECT Id,Name,Case__c,Document_Model__c,CreatedBy.Name,CreatedDate,Person__r.Name,
                                 LastModifiedDate,Document_Type__c,Case__r.CaseNumber,Region_Flag__c
                                 FROM Content__c WHERE Case__c =: caseId]){
                docMap.put(cnt.Id,cnt);
            }
            
            links = [SELECT Id,LinkedEntityId,ContentDocumentId,ContentDocument.Title,
                     ContentDocument.FileExtension,ContentDocument.ContentSize 
                     FROM ContentDocumentLink 
                     WHERE LinkedEntityId IN :docMap.keyset()];
        }
        else {
            links = [SELECT Id,LinkedEntityId,ContentDocumentId,ContentDocument.Title,
                     ContentDocument.FileExtension,ContentDocument.ContentSize,
                     ContentDocument.LastModifiedDate,ContentDocument.CreatedDate 
                     FROM ContentDocumentLink 
                     WHERE LinkedEntityId =:caseId];
        }
        
		        
        if(links.isEmpty()) return documentList;
        
        if(!links.isEmpty()){
            Integer sno = 1;
            for(ContentDocumentLink cdl :links){
           		documentList.add(new DocuSignWrapper(sno,docMap.get(cdl.LinkedEntityId),cdl,caseObj));
                sno++;
            }   
        }
        
        return documentList;
    }

    @AuraEnabled(cacheable=true)
    public static List<String> getFileData(String caseId) {
        List<String> fileData = new List<String>();
        
        List<DocuSignWrapper> docList = getDocumentList(caseId,true);
        
        if(docList.isEmpty()) return fileData;
        
        Set<Id> contentDocumentIds = new Set<Id>();
        for(DocuSignWrapper contentDoc :docList){
            contentDocumentIds.add(contentDoc.contentDocumentId);
        }
        
        String summary = getCalculationSummaryPDF(caseId);
        System.debug('summary ' + summary);
        fileData.add(summary);
        for(ContentVersion cv : [SELECT Id, VersionData, FileExtension FROM ContentVersion WHERE ContentDocumentId IN :contentDocumentIds ORDER BY CreatedDate DESC]){
            System.debug('cv ' + cv.FileExtension);
            if(cv.FileExtension == 'pdf'){
            	String base64Data = EncodingUtil.base64Encode(cv.VersionData);
	            fileData.add(base64Data);    
            }
        }
        
    	return fileData;
    }
    
    public static String getCalculationSummaryPDF(String caseId){
        PageReference pdfPage = Page.LoanCalculationSummary;
        pdfPage.getParameters().put('id', caseId);
        Blob pdfBlob;
        
        try {
            pdfBlob = pdfPage.getContentAsPDF();
        } catch (Exception e) {
            System.debug('Error -->'+e.getMessage());
            System.debug('Error Line -->'+e.getLineNumber());
        }
        
        String base64Pdf = EncodingUtil.base64Encode(pdfBlob);
        return base64Pdf;
    }
    
    public static String getDocuSignPDF(String caseId){
        PageReference pdfPage = Page.VF02_CalculationSummaryReportPdf;
        pdfPage.getParameters().put('id', caseId);
        Blob pdfBlob;
        
        try {
            pdfBlob = pdfPage.getContentAsPDF();
        } catch (Exception e) {
            System.debug('Error -->'+e.getMessage());
            System.debug('Error Line -->'+e.getLineNumber());
        }
        
        String base64Pdf = EncodingUtil.base64Encode(pdfBlob);
        return base64Pdf;
    }
    
    
    public class DocuSignWrapper {
        
        @AuraEnabled
        public Integer sno { get; set; }
        
        @AuraEnabled
        public String fileTitle { get; set; }
        
        @AuraEnabled
        public String fileExt { get; set; }
        
        @AuraEnabled
        public String caseNumber { get; set; }
        
        @AuraEnabled
        public String contentName { get; set; }
        
        @AuraEnabled
        public String regionFlag { get; set; }
        
        @AuraEnabled
        public String documentModel { get; set; }
        
        @AuraEnabled
        public String contentDocumentId { get; set; }
        
        @AuraEnabled
        public String contentDocumentLinkId { get; set; }
        
        @AuraEnabled
        public String ownerName { get; set; }
        
        @AuraEnabled
        public String fileSize { get; set; }
        
        @AuraEnabled
        public String documentType { get; set; }
        
        @AuraEnabled
        public Date lastModifiedDate { get; set; }
        
        @AuraEnabled
        public Date createdDate { get; set; }
        
        @AuraEnabled
        public String signerName { get; set; }
        
        @AuraEnabled
        public String fileName {
            get {
                return fileTitle + '.' + fileExt;
            }
            private set;
        }
        
        @AuraEnabled
        public String documentURL {
            get {
                return  URL.getOrgDomainUrl().toExternalForm() + '/lightning/r/ContentDocument/' + contentDocumentId + '/view#/';
            }
            private set;
        }

        public DocuSignWrapper(Integer sno,Content__c contentObj,ContentDocumentLink cdl,Case caseObj) {
            this.sno = sno;
            this.documentType = contentObj == null ? '' : contentObj.Document_Type__c;
            this.fileTitle = cdl.ContentDocument.Title;
            this.fileExt = cdl.ContentDocument.FileExtension;
            this.contentDocumentId = cdl.ContentDocumentId;
            this.contentDocumentLinkId = cdl.Id;
            this.caseNumber = caseObj.CaseNumber;
            this.contentName = contentObj == null ? 'Signed' : contentObj.Name;
            this.regionFlag = contentObj == null ? '' : contentObj.Region_Flag__c;
            this.documentModel = contentObj == null ? '' : contentObj.Document_Model__c;
            this.ownerName = contentObj == null ? '' : contentObj.CreatedBy.Name;
            this.fileSize = ((Decimal)cdl.ContentDocument.ContentSize / 1024 / 1024).setScale(2) + ' MB';
            this.lastModifiedDate = contentObj == null ? cdl.ContentDocument.LastModifiedDate.date() : contentObj.LastModifiedDate.date();
            this.createdDate = contentObj == null ? cdl.ContentDocument.CreatedDate.date() : contentObj.CreatedDate.date();
            this.signerName = caseObj.Account.CIF__pc;
        }
    }
    
}