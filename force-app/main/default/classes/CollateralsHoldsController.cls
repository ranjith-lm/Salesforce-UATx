/**
 * @description Controller for the Collaterals/Holds LWC
 *              Returns mock data until the actual API is integrated.
 */
public with sharing class CollateralsHoldsController {

    /**
     * @description Wrapper for an account that has active holds.
     */
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

    /**
     * @description Wrapper for individual hold details.
     */
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

    /**
     * @description Returns a list of accounts that have active holds for a given CIF.
     *              In production, this would call the GetCustomerHolds API.
     *              For now, mock data is returned.
     * @param cif Customer Identifier
     * @return List<AccountHoldWrapper>
     */
    @AuraEnabled(cacheable=true)
    public static List<AccountHoldWrapper> getCustomerHolds(String cif) {
        // Mock data – simulate accounts with holds
        List<AccountHoldWrapper> result = new List<AccountHoldWrapper>();

        // Account 1 – Currency Account
        List<HoldDetail> holds1 = new List<HoldDetail>{
            new HoldDetail('H001', 'Legal Hold', 1000.00, 'USD', Date.newInstance(2025, 1, 15), Date.newInstance(2025, 12, 31))
        };
        result.add(new AccountHoldWrapper(
            'ACC001',
            'Current Account',
            'USD',
            1000.00,
            holds1
        ));

        // Account 2 – Saving Pot (with multiple holds)
        List<HoldDetail> holds2 = new List<HoldDetail>{
            new HoldDetail('H002', 'Court Order', 500.00, 'BHD', Date.newInstance(2025, 2, 1), Date.newInstance(2025, 6, 30)),
            new HoldDetail('H003', 'Admin Freeze', 200.00, 'BHD', Date.newInstance(2025, 3, 15), Date.newInstance(2025, 5, 15))
        };
        result.add(new AccountHoldWrapper(
            'POT001',
            'Saving Pot – Vacation',
            'BHD',
            700.00,
            holds2
        ));

        // Account 3 – Al Kanz
        List<HoldDetail> holds3 = new List<HoldDetail>{
            new HoldDetail('H004', 'Tax Levy', 300.00, 'BHD', Date.newInstance(2025, 4, 1), Date.newInstance(2025, 9, 30))
        };
        result.add(new AccountHoldWrapper(
            'KANZ001',
            'Al Kanz',
            'BHD',
            300.00,
            holds3
        ));

        // Account 4 – Fixed Deposit (with holds)
        List<HoldDetail> holds4 = new List<HoldDetail>{
            new HoldDetail('H005', 'Legal Hold', 1500.00, 'USD', Date.newInstance(2025, 5, 10), Date.newInstance(2026, 5, 10))
        };
        result.add(new AccountHoldWrapper(
            'FD001',
            'Fixed Deposit – 5-Year',
            'USD',
            1500.00,
            holds4
        ));

        // Account 5 – Another Currency Account (no holds – will be filtered out)
        // We intentionally do not add it to demonstrate that only accounts with holds are shown.

        return result;
    }
}