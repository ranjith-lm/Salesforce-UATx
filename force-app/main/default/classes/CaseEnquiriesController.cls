public with sharing class CaseEnquiriesController {

    @AuraEnabled(cacheable=true)
    public static Id getAccountIdByCIF(String cif) {
        if (String.isBlank(cif)) {
            return null;
        }
        // Replace 'CIF__pc' with your actual CIF field on Account
        List<Account> accounts = [SELECT Id FROM Account WHERE CIF__pc = :cif LIMIT 1];
        return accounts.isEmpty() ? null : accounts[0].Id;
    }

    @AuraEnabled(cacheable=true)
    public static Id getCaseEnquiriesRecordTypeId() {
        return [SELECT Id FROM RecordType 
                WHERE SObjectType = 'Case' 
                AND DeveloperName = 'Case_Enquiries' 
                LIMIT 1].Id;
    }
}