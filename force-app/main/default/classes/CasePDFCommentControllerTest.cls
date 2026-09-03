@IsTest
private class CasePDFCommentControllerTest {

    @TestSetup
    static void setupTestData() {
        Account acc = (Account) TestDataFactory.createSObject(
            new Account(CIF__pc = '1293779'),
            'TestFactoryDefaults.AccountDefaults',
            true
        );
        Id issueRtId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('Credit_Card').getRecordTypeId();
        Case cse = (Case) TestDataFactory.createSObject(
            new Case(
                RecordTypeId = issueRtId,
                ContactId = acc.PersonContactId,
                AccountId = acc.Id,
                Case_Model__c = 'ila',
                Subject = 'PDF comments test',
                Status = 'New',
                Origin = 'Email'
            ),
            'TestFactoryDefaults.CaseDefaults',
            true
        );

        ContentVersion cv = new ContentVersion(
            Title = 'Invoice',
            PathOnClient = 'docs/Invoice.PDF',
            VersionData = Blob.valueOf('invoice-bytes')
        );
        insert cv;
        cv = [SELECT Id, ContentDocumentId FROM ContentVersion WHERE Id = :cv.Id];

        Attachment classicAtt = new Attachment(
            ParentId = cse.Id,
            Name = 'classic-note.txt',
            Body = Blob.valueOf('classic')
        );
        insert classicAtt;

        insert new CaseComment(
            ParentId = cse.Id,
            CommentBody = 'Plain comment without files',
            IsPublished = true
        );
        insert new CaseComment(
            ParentId = cse.Id,
            CommentBody =
                '<p>Has files</p>'
                + '<img alt="photo.PNG" src="https://example.com/' + cv.Id + '">'
                + '<img alt="photo.png" src="https://example.com/dup">'
                + '<img title="scan.TIFF" src="https://cdn.example.com/path/scan.tiff?x=1">'
                + '<img src="https://cdn.example.com/folder/chart.jpeg">'
                + '<img>'
                + ' also classic ' + classicAtt.Id,
            IsPublished = false
        );

        List<CaseFeed> commentFeeds = [
            SELECT Id FROM CaseFeed
            WHERE ParentId = :cse.Id AND Type = 'CaseCommentPost'
            LIMIT 1
        ];
        if (!commentFeeds.isEmpty()) {
            insert new FeedComment(
                FeedItemId = commentFeeds[0].Id,
                CommentBody = 'Reply with file <img alt="reply-doc.docx" src="x">'
            );
        }

        EmailMessage inbound = new EmailMessage(
            ParentId = cse.Id,
            Subject = 'Inbound mail',
            FromName = 'Customer',
            FromAddress = 'from@example.com',
            ToAddress = 'to@example.com',
            CcAddress = 'cc@example.com',
            Incoming = true,
            Status = '0',
            MessageDate = Datetime.now().addHours(-2)
        );
        EmailMessage outbound = new EmailMessage(
            ParentId = cse.Id,
            Subject = null,
            FromAddress = 'bank@example.com',
            ToAddress = 'cust@example.com',
            Incoming = false,
            Status = '3',
            MessageDate = Datetime.now().addHours(-1)
        );
        insert new List<EmailMessage>{ inbound, outbound };

        ContentVersion emailFile = new ContentVersion(
            Title = 'EmailAtt',
            PathOnClient = 'EmailAtt.pdf',
            VersionData = Blob.valueOf('email-att')
        );
        insert emailFile;
        emailFile = [SELECT ContentDocumentId FROM ContentVersion WHERE Id = :emailFile.Id];
        insert new ContentDocumentLink(
            LinkedEntityId = inbound.Id,
            ContentDocumentId = emailFile.ContentDocumentId,
            ShareType = 'V'
        );

        Task callTask = new Task(
            WhatId = cse.Id,
            Subject = 'Customer call',
            Description = '<p>Call notes</p><img alt="call.png">',
            Status = 'Completed',
            Priority = 'Normal',
            Type = 'Call',
            TaskSubtype = 'Call',
            CallType = 'Inbound',
            CallDurationInSeconds = 65,
            ActivityDate = Date.today()
        );
        insert callTask;
    }

    @IsTest
    static void testVfConstructorLoadsCase() {
        Case cse = [SELECT Id FROM Case LIMIT 1];
        Test.setCurrentPage(Page.CaseCommentsPDF);
        ApexPages.currentPage().getParameters().put('id', cse.Id);

        Test.startTest();
        CasePDFCommentController ctrl = new CasePDFCommentController();
        Test.stopTest();

        System.assertEquals(cse.Id, ctrl.caseId);
        System.assertNotEquals(null, ctrl.caseRecord);
        System.assertEquals(true, ctrl.hasData);
        System.assertEquals(2, ctrl.threads.size());
        System.assertEquals(true, ctrl.hasEmails);
        System.assertEquals(2, ctrl.emails.size());
        System.assertNotEquals(null, ctrl.generatedOn);
        System.assertEquals(null, ctrl.errorMessage);
    }

    @IsTest
    static void testVfConstructorWithoutId() {
        Test.setCurrentPage(Page.CaseCommentsPDF);

        Test.startTest();
        CasePDFCommentController ctrl = new CasePDFCommentController();
        Test.stopTest();

        System.assertEquals(null, ctrl.caseId);
        System.assertEquals(false, ctrl.hasData);
        System.assertEquals(false, ctrl.hasEmails);
        System.assertEquals(false, ctrl.hasCallLogs);
        System.assertEquals(0, ctrl.threads.size());
    }

    @IsTest
    static void testGetPdfDataWithCommentsEmailsAndCalls() {
        Case cse = [SELECT Id FROM Case LIMIT 1];

        Test.startTest();
        CasePDFCommentController data = CasePDFCommentController.getPdfData(cse.Id);
        Test.stopTest();

        System.assertEquals(cse.Id, data.caseId);
        System.assertNotEquals(null, data.caseRecord);
        System.assertEquals(true, data.hasData);
        System.assertEquals(2, data.threads.size());

        CasePDFCommentController.CommentThread attachedThread;
        CasePDFCommentController.CommentThread plainThread;
        for (CasePDFCommentController.CommentThread t : data.threads) {
            if (t.hasAttachment) {
                attachedThread = t;
            } else {
                plainThread = t;
            }
        }
        System.assertNotEquals(null, attachedThread, 'Expected a comment with attachments');
        System.assertNotEquals(null, plainThread, 'Expected a plain comment');
        System.assertEquals(false, attachedThread.commentBody.contains('<img'));
        System.assert(attachedThread.attachments.size() >= 2, 'Expected multiple distinct attachment labels');

        Set<String> labels = new Set<String>();
        for (CasePDFCommentController.AttachmentInfo info : attachedThread.attachments) {
            labels.add(info.attachmentName.toLowerCase());
        }
        System.assertEquals(labels.size(), attachedThread.attachments.size(), 'Attachment labels should be distinct');

        System.assertEquals(true, data.hasEmails);
        Boolean foundInbound = false;
        Boolean foundOutboundNoSubject = false;
        for (CasePDFCommentController.EmailEntry em : data.emails) {
            if (em.isIncoming) {
                foundInbound = true;
                System.assertEquals('Inbound', em.directionLabel);
                System.assertEquals('Inbound mail', em.subject);
            } else {
                foundOutboundNoSubject = true;
                System.assertEquals('Outbound', em.directionLabel);
                System.assertEquals('(No Subject)', em.subject);
            }
        }
        System.assertEquals(true, foundInbound);
        System.assertEquals(true, foundOutboundNoSubject);

        if (data.hasCallLogs) {
            System.assert(!data.callLogs.isEmpty());
            System.assertEquals('01:05', data.callLogs[0].callDurationDisplay);
        }
    }

    @IsTest
    static void testGetPdfDataNullAndUnknownCase() {
        Test.startTest();
        CasePDFCommentController emptyCtrl = CasePDFCommentController.getPdfData(null);
        CasePDFCommentController missingCtrl = CasePDFCommentController.getPdfData(
            '500000000000000AAA'
        );
        Test.stopTest();

        System.assertEquals(false, emptyCtrl.hasData);
        System.assertEquals(null, missingCtrl.caseRecord);
        System.assertEquals(false, missingCtrl.hasData);
    }

    @IsTest
    static void testCommentThreadParsesAttachmentsAndCleansBody() {
        Map<String, String> namesById = new Map<String, String>{
            '069XXXXXXXXXXXX' => 'looked-up.png'
        };
        CaseComment cc = new CaseComment(
            CommentBody =
                '<p></p><img src="https://x/069XXXXXXXXXXXX">'
                + '<img alt="looked-up.PNG">'
                + '<img alt="other.jpg">'
                + '<img>'
        );

        Test.startTest();
        CasePDFCommentController.CommentThread thread =
            new CasePDFCommentController.CommentThread(cc, namesById);
        Test.stopTest();

        System.assertEquals(true, thread.hasAttachment);
        System.assertEquals('Unknown', thread.createdByName);
        System.assertEquals(false, thread.commentBody.containsIgnoreCase('<img'));
        System.assertEquals(2, thread.attachments.size());
        System.assertEquals('looked-up.png', thread.attachmentName);
        System.assertEquals(0, thread.replies.size());
    }

    @IsTest
    static void testReplyThreadImageFallbacks() {
        FeedComment fc = new FeedComment(
            CommentBody = '<img title="notes" src="https://files.example.com/dir/notes.PDF?token=abc">'
        );

        Test.startTest();
        CasePDFCommentController.ReplyThread reply =
            new CasePDFCommentController.ReplyThread(fc, new Map<String, String>());
        Test.stopTest();

        System.assertEquals(true, reply.hasAttachment);
        System.assertEquals('notes.pdf', reply.attachmentName);
        System.assertEquals('pdf', reply.attachmentExtension);
        System.assertEquals('Unknown', reply.createdBy);
    }

    @IsTest
    static void testEmailEntryAndCallLogEntry() {
        EmailMessage withFiles = (EmailMessage) JSON.deserialize(
            '{"Subject":"","Incoming":false,"HasAttachment":true,"Status":"3"}',
            EmailMessage.class
        );
        EmailMessage noFiles = (EmailMessage) JSON.deserialize(
            '{"Subject":"Hello","FromName":"Agent","FromAddress":"a@b.com","Incoming":true,"HasAttachment":false,"Status":"0"}',
            EmailMessage.class
        );
        Task callTask = new Task(
            Subject = '',
            Description = '<img alt="ignored.png"> kept',
            CallType = 'Outbound',
            CallDurationInSeconds = 5,
            Status = 'Completed',
            ActivityDate = Date.today()
        );
        Task zeroDuration = new Task(Subject = 'Missed', CallDurationInSeconds = 0);

        Test.startTest();
        CasePDFCommentController.EmailEntry fallbackEmail =
            new CasePDFCommentController.EmailEntry(withFiles, null);
        CasePDFCommentController.EmailEntry labeledEmail =
            new CasePDFCommentController.EmailEntry(
                withFiles,
                new List<CasePDFCommentController.AttachmentInfo>{
                    new CasePDFCommentController.AttachmentInfo('stmt.pdf')
                }
            );
        CasePDFCommentController.EmailEntry inbound =
            new CasePDFCommentController.EmailEntry(noFiles, new List<CasePDFCommentController.AttachmentInfo>());
        CasePDFCommentController.CallLogEntry callEntry =
            new CasePDFCommentController.CallLogEntry(callTask);
        CasePDFCommentController.CallLogEntry zeroEntry =
            new CasePDFCommentController.CallLogEntry(zeroDuration);
        CasePDFCommentController.AttachmentInfo emptyInfo =
            new CasePDFCommentController.AttachmentInfo();
        Test.stopTest();

        System.assertEquals('(No Subject)', fallbackEmail.subject);
        System.assertEquals('Outbound', fallbackEmail.directionLabel);
        System.assertEquals('Image', fallbackEmail.attachmentName);
        System.assertEquals('stmt.pdf', labeledEmail.attachmentName);
        System.assertEquals('pdf', labeledEmail.attachmentExtension);
        System.assertEquals('Inbound', inbound.directionLabel);
        System.assertEquals(null, inbound.attachmentName);
        System.assertEquals('(No Subject)', callEntry.subject);
        System.assertEquals('00:05', callEntry.callDurationDisplay);
        System.assertEquals(false, callEntry.description.contains('<img'));
        System.assertNotEquals(null, callEntry.activityDateTime);
        System.assertEquals('00:00', zeroEntry.callDurationDisplay);
        System.assertEquals(false, emptyInfo.hasAttachment);
    }
}