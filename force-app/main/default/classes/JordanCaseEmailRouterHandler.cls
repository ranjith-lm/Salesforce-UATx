/********************************************************************************************
* @name                 JordanCaseEmailRouterHandler
* @description          This email service class would fetch the Jordan case email thread reply and attach it to respective record
* @date                 23/12/2025
* @cretaedby            Maksud
*********************************************************************************************
* version               Author              Date            Comments
* 1.0                   Maksud           02/11/2025     Initial Version
*********************************************************************************************
*/

global class JordanCaseEmailRouterHandler implements Messaging.InboundEmailHandler {

    global Messaging.InboundEmailResult handleInboundEmail(Messaging.InboundEmail email, Messaging.InboundEnvelope envelope) {
    	Messaging.InboundEmailResult result = new Messaging.InboundEmailResult();
        if(!String.isEmpty(email.subject) && email.subject.contains('[JL-')){
            Id existingRecordId = findExistingEmailForJordanLoan(email.subject);
            EmailMessage em = new EmailMessage();
            em.FromAddress = envelope.fromAddress;
            em.ToAddress = envelope.toAddress;
            em.Subject = email.subject;
            em.TextBody = email.plainTextBody;
            em.HtmlBody = email.htmlBody;
            if(existingRecordId != null){
            	em.RelatedToId = existingRecordId;    
            }
            em.Incoming = true;
            em.Status = '3'; // Completed
            
            System.debug('Email Object ' + email);
            System.debug('Email Object Binary ' + email.binaryAttachments);
            if(email.binaryAttachments != null && !email.binaryAttachments.isEmpty()){
                List<Attachment> listAttachments = new List<Attachment>();
                for (Messaging.InboundEmail.BinaryAttachment bAttachment : email.binaryAttachments) {
                    System.debug('Email Object bAttachment ' + bAttachment);
                    
                    if (bAttachment.fileName != null && Pattern.matches('(?i)^image\\d{6}\\.png$', bAttachment.fileName)) {
                    	// Skip this inline image
                        continue;
                    }
                    Attachment attach = new Attachment();
                    attach.Name = bAttachment.fileName;
                    attach.Body = bAttachment.body;
                    attach.ParentId = existingRecordId;
                    listAttachments.add(attach);
                }
                insert listAttachments;
            }
            
            System.debug('Email text attachment Binary ' + email.textAttachments);
            // Process Text Attachments
            if (email.textAttachments != null && !email.textAttachments.isEmpty()) {
                List<Attachment> listTextAttachments = new List<Attachment>();
                for (Messaging.InboundEmail.TextAttachment tAttachment : email.textAttachments) {
                    Attachment attach = new Attachment();
                    attach.Name = tAttachment.fileName;
                    attach.Body = Blob.valueOf(tAttachment.body);
                    attach.ParentId = existingRecordId;
                    listTextAttachments.add(attach);
                }
                insert listTextAttachments;
            }
            
            
            insert em;
        }
        return result;
    }
    
    /*
     * @description -  Find existing request using subject for Jordan loan only.
     */ 
    private Id findExistingEmailForJordanLoan(string emailSubject){
        
        try {
            System.debug('emailSubject ' + emailSubject);
        	Pattern subjectPattern = Pattern.compile('\\[JL-\\s*([A-Za-z0-9]+)\\]');
            Matcher matcherSubject = subjectPattern.matcher(emailSubject);
            
            if (matcherSubject.find()) {
                String partialSubject = '%' + matcherSubject.group(1) + '%';
                System.debug('partialSubject ' + partialSubject);
                List<EmailMessage> emailList = [Select Id,RelatedToId FROM EmailMessage WHERE Subject like :partialSubject];
            
                if(emailList.isEmpty()) return null;
                
                return emailList[0].RelatedToId;
            }
            
            return null;    
        }
        catch(Exception ex){
            System.debug('Error while extracting the threadID from subject ' + ex.getMessage());
            return null;
        }        
        
    }
}