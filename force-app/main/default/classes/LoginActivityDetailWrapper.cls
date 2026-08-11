public with sharing class LoginActivityDetailWrapper {
    @AuraEnabled public Datetime timestamp { get; set; }
    @AuraEnabled public String channel { get; set; } // e.g., Mobile, Web
    @AuraEnabled public String unit { get; set; } // e.g., ila Bahrain
    @AuraEnabled public String category { get; set; } // e.g., Login Action
    @AuraEnabled public String description { get; set; } // e.g., Successful Login
    @AuraEnabled public String result { get; set; } // Success / Failure
    @AuraEnabled public String errorCode { get; set; }
    
    public LoginActivityDetailWrapper() {}
}