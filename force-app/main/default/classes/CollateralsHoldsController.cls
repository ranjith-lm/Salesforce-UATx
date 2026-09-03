public with sharing class CollateralsHoldsController {
    @TestVisible
    private static ApiConnection con = new ApiConnection();

    // Wrapper classes
    public class AccountHoldWrapper {
        @AuraEnabled public String accountNumber;
        @AuraEnabled public String accountName;
        @AuraEnabled public String cury;
        @AuraEnabled public Decimal totalHoldAmount;
        @AuraEnabled public List<HoldDetail> holds;

        public AccountHoldWrapper(String accountNumber, String accountName, String cury, Decimal totalHoldAmount, List<HoldDetail> holds) {
            this.accountNumber = accountNumber;
            this.accountName = accountName;
            this.cury = cury;
            this.totalHoldAmount = totalHoldAmount;
            this.holds = holds;
        }
    }

    public class HoldDetail {
        @AuraEnabled public String holdId;
        @AuraEnabled public String holdType;
        @AuraEnabled public Decimal holdAmount;
        @AuraEnabled public String cury;
        @AuraEnabled public Date fromDate;
        @AuraEnabled public Date expiryDate;

        public HoldDetail(String holdId, String holdType, Decimal holdAmount, String cury, Date fromDate, Date expiryDate) {
            this.holdId = holdId;
            this.holdType = holdType;
            this.holdAmount = holdAmount;
            this.cury = cury;
            this.fromDate = fromDate;
            this.expiryDate = expiryDate;
        }
    }

    @AuraEnabled(cacheable=true)
public static List<AccountHoldWrapper> getCustomerHolds(String cif, String regionName, String xCanaryValue) {
    List<AccountHoldWrapper> result = new List<AccountHoldWrapper>();

    if (String.isBlank(cif)) {
        return result;
    }

    String endpoint = '/api/v1/collaterals';
    HttpRequest req = con.createRequest('GET', endpoint, cif, regionName);
    req.setHeader('x-canary', xCanaryValue);
    req.setTimeout(12000);

    Http http = new Http();
    HttpResponse response = http.send(req);

    System.debug('Response status: ' + response.getStatusCode());
    System.debug('Response body: ' + response.getBody());

    if (response.getStatusCode() == 200 && String.isNotBlank(response.getBody())) {
        try {
            // Parse root as Map
            Map<String, Object> root = (Map<String, Object>) JSON.deserializeUntyped(response.getBody());
            Map<String, Object> data = (Map<String, Object>) root.get('data');
            List<Object> collaterals = (List<Object>) data.get('collaterals');

            if (collaterals == null || collaterals.isEmpty()) {
                return result;
            }

            // Group by accountId
            Map<String, List<HoldDetail>> accountHoldsMap = new Map<String, List<HoldDetail>>();
            Map<String, Decimal> accountTotalMap = new Map<String, Decimal>();
            Map<String, String> accountCurrencyMap = new Map<String, String>();
            Map<String, String> accountProductNameMap = new Map<String, String>(); // NEW

            for (Object collObj : collaterals) {
                Map<String, Object> collMap = (Map<String, Object>) collObj;

                String accountId = (String) collMap.get('accountId');
                String holdId = (String) collMap.get('holdId');
                String holdType = (String) collMap.get('holdType');
                Decimal amount = (Decimal) collMap.get('amount');
                String curry = (String) collMap.get('currency');
                String productName = (String) collMap.get('productName'); // NEW

                // Parse timestamp (milliseconds) to Date
                Date fromDate = null;
                Date expiryDate = null;
                Object fromObj = collMap.get('fromDate');
                Object expiryObj = collMap.get('expiryDate');
                if (fromObj instanceof String) {
                    Long fromMillis = Long.valueOf((String) fromObj);
                    fromDate = DateTime.newInstance(fromMillis).date();
                }
                if (expiryObj instanceof String) {
                    Long expiryMillis = Long.valueOf((String) expiryObj);
                    expiryDate = DateTime.newInstance(expiryMillis).date();
                }

                // Build HoldDetail
                HoldDetail hold = new HoldDetail(holdId, holdType, amount, curry, fromDate, expiryDate);

                // Group by account
                if (!accountHoldsMap.containsKey(accountId)) {
                    accountHoldsMap.put(accountId, new List<HoldDetail>());
                    accountTotalMap.put(accountId, 0);
                    accountCurrencyMap.put(accountId, curry);
                    // Store the productName from the first collateral for this account
                    accountProductNameMap.put(accountId, String.isNotBlank(productName) ? productName : accountId);
                }
                accountHoldsMap.get(accountId).add(hold);
                // Accumulate total for this account
                Decimal currentTotal = accountTotalMap.get(accountId);
                accountTotalMap.put(accountId, currentTotal + (amount != null ? amount : 0));
            }

            System.debug('accountHoldsMap --->' + accountHoldsMap);
            System.debug('keySet --->' + accountHoldsMap.keySet());

            // Build AccountHoldWrapper for each account
            for (String accountId : accountHoldsMap.keySet()) {
                List<HoldDetail> holds = accountHoldsMap.get(accountId);
                Decimal total = accountTotalMap.get(accountId);
                String curry = accountCurrencyMap.get(accountId);
                String accountName = accountProductNameMap.get(accountId); // Use stored productName
                result.add(new AccountHoldWrapper(accountId, accountName, curry, total, holds));
            }

        } catch (Exception e) {
            System.debug('Error parsing response: ' + e.getMessage());
            // Return empty list on parsing error
            return new List<AccountHoldWrapper>();
        }
    } else {
        System.debug('API call failed with status: ' + response.getStatusCode());
        // Optionally throw an exception or return empty list
    }

    return result;
}
}