public with sharing class CasePDFCommentController {

    public Id caseId { get; set; }

    @AuraEnabled public Case caseRecord { get; private set; }

    @AuraEnabled public String errorMessage { get; private set; }

    private static String cleanBody(String val) {
        if (String.isBlank(val)) return '';
        // Remove image tags completely
        val = val.replaceAll('(?i)<img[^>]*>', '');
        // Clean up leftover empty paragraphs if any
        val = val.replaceAll('(?i)<p>\\\\s*</p>', '');
        return val.trim();
    }

    // Helper to format call duration as mm:ss
    private static String formatDuration(Integer secs) {
        if (secs == null || secs == 0) return '00:00';
        Integer m = secs / 60;
        Integer s = Math.mod(secs, 60);
        return (m < 10 ? '0' + m : String.valueOf(m)) + ':' + (s < 10 ? '0' + s : String.valueOf(s));
    }

    private static Boolean hasImgAttachment(String rawBody) {
        return String.isNotBlank(rawBody) && rawBody.containsIgnoreCase('<img');
    }

    private static String getImgAttr(String attrs, String attrName) {
        Matcher matcher = Pattern.compile('(?i)' + attrName + '="([^"]*)"').matcher(attrs);
        return matcher.find() ? matcher.group(1) : null;
    }

    private static Boolean isValidExtension(String extension) {
        return String.isNotBlank(extension)
            && extension.length() <= 10
            && !extension.contains(' ')
            && Pattern.matches('[a-zA-Z0-9]+', extension);
    }

    private static String extensionFromFileName(String fileName) {
        if (String.isBlank(fileName) || !fileName.contains('.')) {
            return null;
        }
        String extension = fileName.substring(fileName.lastIndexOf('.') + 1);
        return isValidExtension(extension) ? extension.toLowerCase() : null;
    }

    private static String extensionFromUrl(String url) {
        if (String.isBlank(url)) {
            return null;
        }
        String path = url.contains('?') ? url.substring(0, url.indexOf('?')) : url;
        if (path.contains('/')) {
            path = path.substring(path.lastIndexOf('/') + 1);
        }
        return extensionFromFileName(path);
    }

    public class AttachmentInfo {
        @AuraEnabled public Boolean hasAttachment;
        @AuraEnabled public String attachmentName;
        @AuraEnabled public String attachmentExtension;

        public AttachmentInfo() {
            this.hasAttachment = false;
        }
    }

    private static Set<String> extractFileIds(String rawBody) {
        Set<String> ids = new Set<String>();
        if (String.isBlank(rawBody)) {
            return ids;
        }
        // ContentVersion (068), ContentDocument (069), classic Attachment (00P)
        Matcher m = Pattern.compile('(?i)(068|069|00P)[a-zA-Z0-9]{12,15}').matcher(rawBody);
        while (m.find()) {
            ids.add(m.group(0));
        }
        return ids;
    }

    // Id → "Title.ext" (or PathOnClient / Attachment.Name)
    private static Map<String, String> buildFileNameMap(List<String> rawBodies) {
        Map<String, String> fileNamesById = new Map<String, String>();
        Set<String> fileIds = new Set<String>();
        for (String rawBody : rawBodies) {
            fileIds.addAll(extractFileIds(rawBody));
        }
        if (fileIds.isEmpty()) {
            return fileNamesById;
        }

        if (Schema.sObjectType.ContentVersion.isAccessible()) {
            for (ContentVersion cv : [
                SELECT Id, ContentDocumentId, Title, PathOnClient, FileExtension
                FROM ContentVersion
                WHERE Id IN :fileIds OR ContentDocumentId IN :fileIds
                WITH SECURITY_ENFORCED
            ]) {
                String label = resolveContentVersionLabel(cv);
                if (String.isNotBlank(label)) {
                    fileNamesById.put(String.valueOf(cv.Id), label);
                    fileNamesById.put(String.valueOf(cv.ContentDocumentId), label);
                }
            }
        }

        if (Schema.sObjectType.Attachment.isAccessible()) {
            for (Attachment att : [
                SELECT Id, Name
                FROM Attachment
                WHERE Id IN :fileIds
                WITH SECURITY_ENFORCED
            ]) {
                if (String.isNotBlank(att.Name)) {
                    fileNamesById.put(String.valueOf(att.Id), att.Name);
                }
            }
        }
        return fileNamesById;
    }

    private static String resolveContentVersionLabel(ContentVersion cv) {
        if (String.isNotBlank(cv.PathOnClient)) {
            return cv.PathOnClient.contains('/')
                ? cv.PathOnClient.substring(cv.PathOnClient.lastIndexOf('/') + 1)
                : cv.PathOnClient;
        }
        String title = String.isNotBlank(cv.Title) ? cv.Title : 'Image';
        if (String.isNotBlank(cv.FileExtension) && !title.toLowerCase().endsWith('.' + cv.FileExtension.toLowerCase())) {
            return title + '.' + cv.FileExtension.toLowerCase();
        }
        return title;
    }

    private static Map<Id, String> buildEmailAttachmentLabels(List<EmailMessage> emailList) {
        Map<Id, String> labelsByEmailId = new Map<Id, String>();
        if (emailList == null || emailList.isEmpty()) {
            return labelsByEmailId;
        }

        Set<Id> emailIds = new Set<Id>();
        for (EmailMessage em : emailList) {
            if (em.HasAttachment) {
                emailIds.add(em.Id);
            }
        }
        if (emailIds.isEmpty() || !Schema.sObjectType.ContentDocumentLink.isAccessible()) {
            return labelsByEmailId;
        }

        Map<Id, Id> emailToDocId = new Map<Id, Id>();
        Set<Id> contentDocumentIds = new Set<Id>();
        for (ContentDocumentLink cdl : [
            SELECT LinkedEntityId, ContentDocumentId
            FROM ContentDocumentLink
            WHERE LinkedEntityId IN :emailIds
            WITH SECURITY_ENFORCED
        ]) {
            if (!emailToDocId.containsKey(cdl.LinkedEntityId)) {
                emailToDocId.put(cdl.LinkedEntityId, cdl.ContentDocumentId);
                contentDocumentIds.add(cdl.ContentDocumentId);
            }
        }

        Map<Id, String> labelByDocId = new Map<Id, String>();
        if (!contentDocumentIds.isEmpty() && Schema.sObjectType.ContentVersion.isAccessible()) {
            for (ContentVersion cv : [
                SELECT ContentDocumentId, Title, PathOnClient, FileExtension
                FROM ContentVersion
                WHERE ContentDocumentId IN :contentDocumentIds
                AND IsLatest = true
                WITH SECURITY_ENFORCED
            ]) {
                labelByDocId.put(cv.ContentDocumentId, resolveContentVersionLabel(cv));
            }
        }

        for (Id emailId : emailToDocId.keySet()) {
            Id docId = emailToDocId.get(emailId);
            if (labelByDocId.containsKey(docId)) {
                labelsByEmailId.put(emailId, labelByDocId.get(docId));
            }
        }
        return labelsByEmailId;
    }

    private static String fileNameFromLookup(String rawBody, Map<String, String> fileNamesById) {
        if (fileNamesById == null || fileNamesById.isEmpty()) {
            return null;
        }
        for (String fileId : extractFileIds(rawBody)) {
            if (fileNamesById.containsKey(fileId)) {
                return fileNamesById.get(fileId);
            }
        }
        return null;
    }

    // Resolves a single <img> tag's attributes into an AttachmentInfo.
    private static AttachmentInfo parseSingleImage(String attrs, Map<String, String> fileNamesById, String rawBody) {
        AttachmentInfo info = new AttachmentInfo();
        info.hasAttachment = true;

        String lookedUp = fileNameFromLookup(rawBody, fileNamesById);
        if (String.isNotBlank(lookedUp)) {
            info.attachmentName = lookedUp;
            info.attachmentExtension = extensionFromFileName(lookedUp);
            return info;
        }

        String alt = getImgAttr(attrs, 'alt');
        String src = getImgAttr(attrs, 'src');
        String title = getImgAttr(attrs, 'title');
        String fileName = String.isNotBlank(alt) ? alt : (String.isNotBlank(title) ? title : null);
        String extension = extensionFromFileName(fileName);
        if (String.isBlank(extension)) {
            extension = extensionFromUrl(src);
        }

        if (String.isNotBlank(fileName) && fileName.contains('.')) {
            Integer dotIndex = fileName.lastIndexOf('.');
            String tail = fileName.substring(dotIndex + 1);
            if (isValidExtension(tail)) {
                info.attachmentName = fileName.substring(0, dotIndex) + '.' + tail.toLowerCase();
                info.attachmentExtension = tail.toLowerCase();
                return info;
            }
        }

        String name = String.isNotBlank(fileName) ? fileName : 'Image';
        info.attachmentName = String.isNotBlank(extension) ? name + '.' + extension.toLowerCase() : name;
        info.attachmentExtension = String.isNotBlank(extension) ? extension.toLowerCase() : null;
        return info;
    }

    // Parses ALL <img> tags in a body (previously only the first was captured).
    private static List<AttachmentInfo> parseAttachments(String rawBody, Map<String, String> fileNamesById) {
        List<AttachmentInfo> results = new List<AttachmentInfo>();
        if (!hasImgAttachment(rawBody)) {
            return results;
        }

        Matcher imgMatcher = Pattern.compile('(?i)<img\\s+([^>]+)>').matcher(rawBody);
        Boolean foundTag = false;
        while (imgMatcher.find()) {
            foundTag = true;
            results.add(parseSingleImage(imgMatcher.group(1), fileNamesById, rawBody));
        }

        if (!foundTag) {
            // '<img' was present but didn't match the attribute pattern (e.g. self-closing/no attrs)
            AttachmentInfo fallback = new AttachmentInfo();
            fallback.hasAttachment = true;
            fallback.attachmentName = 'Image';
            results.add(fallback);
        }
        return results;
    }

    public class CommentThread {
        @AuraEnabled public CaseComment comment       { get; set; }
        @AuraEnabled public String      commentBody   { get; set; }
        @AuraEnabled public String      createdByName { get; set; }
        @AuraEnabled public Datetime    createdDate   { get; set; }
        @AuraEnabled public List<ReplyThread> replies { get; set; }
        @AuraEnabled public Boolean  hasAttachment { get; set; }
        @AuraEnabled public String   attachmentName { get; set; }
        @AuraEnabled public String   attachmentExtension { get; set; }
        @AuraEnabled public List<AttachmentInfo> attachments { get; set; }

        public CommentThread(CaseComment cc, Map<String, String> fileNamesById) {
            this.comment       = cc;
            String rawBody     = cc.CommentBody != null ? cc.CommentBody : '';
            this.attachments   = parseAttachments(rawBody, fileNamesById);
            AttachmentInfo primary = this.attachments.isEmpty() ? new AttachmentInfo() : this.attachments[0];
            this.hasAttachment = primary.hasAttachment;
            this.attachmentName = primary.attachmentName;
            this.attachmentExtension = primary.attachmentExtension;

            this.commentBody   = cleanBody(rawBody);
            this.createdByName = cc.CreatedBy != null ? cc.CreatedBy.Name : 'Unknown';
            this.createdDate   = cc.CreatedDate;
            this.replies       = new List<ReplyThread>();
        }
    }

    public class ReplyThread {
        @AuraEnabled public String  body          { get; set; }
        @AuraEnabled public String  createdBy     { get; set; }
        @AuraEnabled public Datetime createdDate   { get; set; }
        @AuraEnabled public Boolean  hasAttachment { get; set; }
        @AuraEnabled public String   attachmentName { get; set; }
        @AuraEnabled public String   attachmentExtension { get; set; }
        @AuraEnabled public List<AttachmentInfo> attachments { get; set; }

        public ReplyThread(FeedComment fc, Map<String, String> fileNamesById) {
            String rawBody     = fc.CommentBody != null ? fc.CommentBody : '';
            this.attachments   = parseAttachments(rawBody, fileNamesById);
            AttachmentInfo primary = this.attachments.isEmpty() ? new AttachmentInfo() : this.attachments[0];
            this.hasAttachment = primary.hasAttachment;
            this.attachmentName = primary.attachmentName;
            this.attachmentExtension = primary.attachmentExtension;

            this.body          = cleanBody(rawBody);
            this.createdBy     = fc.CreatedBy != null ? fc.CreatedBy.Name : 'Unknown';
            this.createdDate   = fc.CreatedDate;
        }
    }

    // ── Email data model
    public class EmailEntry {
        @AuraEnabled public String  subject      { get; set; }
        @AuraEnabled public String  fromName     { get; set; }
        @AuraEnabled public String  fromAddress  { get; set; }
        @AuraEnabled public String  toAddress    { get; set; }
        @AuraEnabled public String  ccAddress    { get; set; }
        @AuraEnabled public Boolean isIncoming   { get; set; }   // true = received, false = sent
        @AuraEnabled public String  directionLabel { get; set; } // 'Inbound' | 'Outbound'
        @AuraEnabled public String  status       { get; set; }
        @AuraEnabled public Datetime messageDate { get; set; }
        @AuraEnabled public Boolean hasAttachment { get; set; }
        @AuraEnabled public String  attachmentName { get; set; }
        @AuraEnabled public String  attachmentExtension { get; set; }

        public EmailEntry(EmailMessage em, String resolvedAttachmentLabel) {
            this.subject       = String.isNotBlank(em.Subject)     ? em.Subject     : '(No Subject)';
            this.fromName      = String.isNotBlank(em.FromName)    ? em.FromName    : '';
            this.fromAddress   = String.isNotBlank(em.FromAddress) ? em.FromAddress : '';
            this.toAddress     = String.isNotBlank(em.ToAddress)   ? em.ToAddress   : '';
            this.ccAddress     = String.isNotBlank(em.CcAddress)   ? em.CcAddress   : '';
            this.isIncoming    = em.Incoming;
            this.directionLabel = em.Incoming ? 'Inbound' : 'Outbound';
            this.status        = em.Status;
            this.messageDate   = em.MessageDate;
            this.hasAttachment = em.HasAttachment;
            if (em.HasAttachment) {
                this.attachmentName = String.isNotBlank(resolvedAttachmentLabel) ? resolvedAttachmentLabel : 'Image';
                this.attachmentExtension = extensionFromFileName(this.attachmentName);
            } else {
                this.attachmentName = null;
                this.attachmentExtension = null;
            }
        }
    }

    // ── Call log data model
    public class CallLogEntry {
        @AuraEnabled public Id       id                { get; set; }
        @AuraEnabled public String   subject           { get; set; }
        @AuraEnabled public String   description       { get; set; }
        @AuraEnabled public String   callType          { get; set; }   // Inbound / Outbound / Internal
        @AuraEnabled public String   callDisposition   { get; set; }
        @AuraEnabled public Integer  callDurationSecs  { get; set; }
        @AuraEnabled public String   callDurationDisplay { get; set; } // formatted mm:ss
        @AuraEnabled public String   status            { get; set; }
        @AuraEnabled public String   createdByName     { get; set; }
        @AuraEnabled public Datetime createdDate       { get; set; }
        @AuraEnabled public Datetime activityDateTime  { get; set; }
        @AuraEnabled public List<ReplyThread> replies  { get; set; }

        public CallLogEntry(Task t) {
            this.id                = t.Id;
            this.subject          = String.isNotBlank(t.Subject) ? t.Subject : '(No Subject)';
            this.description      = String.isNotBlank(t.Description) ? cleanBody(t.Description) : '';
            this.callType          = t.CallType;
            this.callDisposition   = t.CallDisposition;
            this.callDurationSecs  = t.CallDurationInSeconds != null ? Integer.valueOf(t.CallDurationInSeconds) : 0;
            this.callDurationDisplay = CasePDFCommentController.formatDuration(this.callDurationSecs);
            this.status            = t.Status;
            this.createdByName     = t.CreatedBy != null ? t.CreatedBy.Name : 'Unknown';
            this.createdDate       = t.CreatedDate;
            this.activityDateTime  = t.ActivityDate != null ? Datetime.newInstance(t.ActivityDate, Time.newInstance(0,0,0,0)) : null;
            this.replies           = new List<ReplyThread>();
        }
    }

    @AuraEnabled public List<CommentThread> threads { get; private set; }
    @AuraEnabled public Boolean             hasData { get; private set; }
    @AuraEnabled public String              generatedOn { get; private set; }

    // ── Emails exposure
    @AuraEnabled public List<EmailEntry>   emails      { get; private set; }
    @AuraEnabled public Boolean            hasEmails   { get; private set; }

    // ── Call log exposure
    @AuraEnabled public List<CallLogEntry> callLogs    { get; private set; }
    @AuraEnabled public Boolean            hasCallLogs { get; private set; }

    // ── Constructor (called by VF page)
    public CasePDFCommentController() {
        caseId = ApexPages.currentPage() != null
            ? ApexPages.currentPage().getParameters().get('id')
            : null;
        initCollections();
        try {
            loadData();
        } catch (Exception e) {
            errorMessage = 'Unable to load case data: ' + e.getMessage();
        }
    }

    // LWC entry point for Word/PDF export
    @AuraEnabled(cacheable=false)
    public static CasePDFCommentController getPdfData(Id caseId) {
        try {
            return new CasePDFCommentController(caseId);
        } catch (Exception e) {
            throw new AuraHandledException('Unable to load case data: ' + e.getMessage());
        }
    }

    // Private constructor used by getPdfData
    private CasePDFCommentController(Id cId) {
        this.caseId = cId;
        initCollections();
        loadData();
    }

    private void initCollections() {
        threads     = new List<CommentThread>();
        emails      = new List<EmailEntry>();
        callLogs    = new List<CallLogEntry>();
        hasData     = false;
        hasEmails   = false;
        hasCallLogs = false;
        generatedOn = Datetime.now().format('dd/MM/yyyy HH:mm:ss');
    }

    // Shared data loading logic
    private void loadData() {
        if (caseId == null) return;

        if (!Schema.sObjectType.Case.isAccessible()) {
            errorMessage = 'Insufficient access to view this case.';
            return;
        }

        // ── Load case header
        List<Case> cases = [
            SELECT Id, CaseNumber, Subject, Status, Priority,
                   Account.Name, Owner.Name, CreatedDate
            FROM   Case
            WHERE  Id = :caseId
            WITH SECURITY_ENFORCED
            LIMIT  1
        ];
        if (cases.isEmpty()) return;
        caseRecord = cases[0];

        // ── Load CaseComments
        List<CaseComment> comments = new List<CaseComment>();
        if (Schema.sObjectType.CaseComment.isAccessible()) {
            comments = [
                SELECT Id, CommentBody, CreatedDate, CreatedBy.Name, IsPublished
                FROM   CaseComment
                WHERE  ParentId = :caseId
                WITH SECURITY_ENFORCED
                ORDER BY CreatedDate DESC
            ];
        }

        if (!comments.isEmpty()) {
            hasData = true;

            // ── Load FeedItems + their replies in ONE subquery
            List<CaseFeed> caseFeedPosts = [
                SELECT Id, RelatedRecordId, CreatedDate,
                       (SELECT Id, CommentBody, CreatedDate, CreatedBy.Name
                        FROM   FeedComments
                        ORDER BY CreatedDate DESC)
                FROM   CaseFeed
                WHERE  ParentId = :caseId
                AND    Type     = 'CaseCommentPost'
                WITH SECURITY_ENFORCED
                ORDER BY CreatedDate DESC
            ];

            // Collect all HTML bodies so we can resolve file names/extensions in one query
            List<String> attachmentBodies = new List<String>();
            for (CaseComment cc : comments) {
                if (cc.CommentBody != null) {
                    attachmentBodies.add(cc.CommentBody);
                }
            }
            for (CaseFeed cf : caseFeedPosts) {
                if (cf.FeedComments == null) {
                    continue;
                }
                for (FeedComment fc : cf.FeedComments) {
                    if (fc.CommentBody != null) {
                        attachmentBodies.add(fc.CommentBody);
                    }
                }
            }
            Map<String, String> fileNamesById = buildFileNameMap(attachmentBodies);

            // ── Map CaseComment Id → CommentThread
            Map<Id, CommentThread> threadMap = new Map<Id, CommentThread>();
            for (CaseComment cc : comments) {
                threadMap.put(cc.Id, new CommentThread(cc, fileNamesById));
            }

            // Accumulate replies per comment Id
            Map<Id, List<ReplyThread>> repliesByCommentId = new Map<Id, List<ReplyThread>>();

            // Feed posts whose RelatedRecordId is null
            List<CaseFeed> unmatchedFeeds = new List<CaseFeed>();

            for (CaseFeed cf : caseFeedPosts) {
                List<FeedComment> inlineReplies = cf.FeedComments;
                if (inlineReplies == null || inlineReplies.isEmpty()) continue;

                if (cf.RelatedRecordId != null && threadMap.containsKey(cf.RelatedRecordId)) {
                    // ── Primary match via RelatedRecordId
                    Id cId = cf.RelatedRecordId;
                    if (!repliesByCommentId.containsKey(cId)) {
                        repliesByCommentId.put(cId, new List<ReplyThread>());
                    }
                    for (FeedComment fc : inlineReplies) {
                        repliesByCommentId.get(cId).add(new ReplyThread(fc, fileNamesById));
                    }
                } else {
                    // ── RelatedRecordId is null
                    unmatchedFeeds.add(cf);
                }
            }

            // ── Fallback
            if (!unmatchedFeeds.isEmpty()) {
                for (CaseFeed cf : unmatchedFeeds) {
                    Id   bestId   = null;
                    Datetime bestDt = null;
                    for (CaseComment cc : comments) {
                        if (cc.CreatedDate <= cf.CreatedDate) {
                            if (bestDt == null || cc.CreatedDate > bestDt) {
                                bestDt = cc.CreatedDate;
                                bestId = cc.Id;
                            }
                        }
                    }
                    if (bestId != null && cf.FeedComments != null) {
                        if (!repliesByCommentId.containsKey(bestId)) {
                            repliesByCommentId.put(bestId, new List<ReplyThread>());
                        }
                        for (FeedComment fc : cf.FeedComments) {
                            repliesByCommentId.get(bestId).add(new ReplyThread(fc, fileNamesById));
                        }
                    }
                }
            }

            // ── Assign replies and build the ordered thread list
            for (CaseComment cc : comments) {
                CommentThread t = threadMap.get(cc.Id);
                if (repliesByCommentId.containsKey(cc.Id)) {
                    t.replies = repliesByCommentId.get(cc.Id);
                }
                threads.add(t);
            }
        }

        // ── Load EmailMessages linked to this Case
        List<EmailMessage> emailList = new List<EmailMessage>();
        if (Schema.sObjectType.EmailMessage.isAccessible()) {
            emailList = [
                SELECT Id, Subject, FromName, FromAddress, ToAddress, CcAddress,
                       Incoming, Status, MessageDate, HasAttachment
                FROM   EmailMessage
                WHERE  ParentId = :caseId
                WITH SECURITY_ENFORCED
                ORDER BY MessageDate ASC
            ];
        }

        if (!emailList.isEmpty()) {
            hasEmails = true;
            Map<Id, String> emailAttachmentLabels = buildEmailAttachmentLabels(emailList);
            for (EmailMessage em : emailList) {
                emails.add(new EmailEntry(em, emailAttachmentLabels.get(em.Id)));
            }
        }

        // ── Load call logs (Tasks of Type = 'Call' related to the Case)
        List<Task> callTasks = new List<Task>();
        if (Schema.sObjectType.Task.isAccessible()) {
            callTasks = [
                SELECT Id, Subject, Description, CallType, CallDisposition,
                       CallDurationInSeconds, Status, CreatedDate, ActivityDate,
                       CreatedBy.Name
                FROM   Task
                WHERE  WhatId = :caseId
                AND    TaskSubtype   = 'Call'
                WITH SECURITY_ENFORCED
                ORDER BY CreatedDate DESC
            ];
        }

        if (!callTasks.isEmpty()) {
            hasCallLogs = true;
            Set<Id> callTaskIds = new Set<Id>();
            Map<Id, CallLogEntry> callEntryMap = new Map<Id, CallLogEntry>();

            for (Task t : callTasks) {
                callTaskIds.add(t.Id);
                CallLogEntry entry = new CallLogEntry(t);
                callEntryMap.put(t.Id, entry);
                callLogs.add(entry);
            }

            // Query FeedItems + FeedComments at Task level
            List<FeedItem> feeds = [
                SELECT Id, ParentId,
                       (SELECT Id, CommentBody, CreatedDate, CreatedBy.Name
                        FROM   FeedComments
                        ORDER BY CreatedDate ASC)
                FROM   FeedItem
                WHERE  ParentId IN :callTaskIds
                WITH SECURITY_ENFORCED
                ORDER BY CreatedDate ASC
            ];

            List<String> callReplyBodies = new List<String>();
            for (FeedItem fi : feeds) {
                if (fi.FeedComments == null) {
                    continue;
                }
                for (FeedComment fc : fi.FeedComments) {
                    if (fc.CommentBody != null) {
                        callReplyBodies.add(fc.CommentBody);
                    }
                }
            }
            Map<String, String> callFileNamesById = buildFileNameMap(callReplyBodies);

            for (FeedItem fi : feeds) {
                if (fi.FeedComments != null && !fi.FeedComments.isEmpty() && callEntryMap.containsKey(fi.ParentId)) {
                    CallLogEntry entry = callEntryMap.get(fi.ParentId);
                    for (FeedComment fc : fi.FeedComments) {
                        entry.replies.add(new ReplyThread(fc, callFileNamesById));
                    }
                }
            }
        }
    }
}