({
    getPrepaidCardRecordType: function (component, event, helper) {
        var action = component.get('c.getPrepaidCardCaseRecordType');
        action.setCallback(this, function (actionResult) {
            var statut = actionResult.getState();
            if (statut === "SUCCESS") {
                let data = actionResult.getReturnValue();
                if (data) {
                    component.set("v.prepaidCardRecordTypeId", data);
                }
            } else if (statut === "ERROR") {
                helper.handleErrors(actionResult.getError(), '');
            }
            else {
                console.error("AUTRE ERROR");
            }
        });
        $A.enqueueAction(action);
    },

    getPrepaidCardConfigViaApi: function (component, event, helper) {
        component.set("v.showCardOption", false);
        component.find("RequestedCardType").set("v.value", '');
        var accId = component.get('v.recordId');
        var action = component.get('c.getPrepaidCardConfigViaApi');
        action.setParams({
            accountId: accId,
            caseModel: component.get("v.caseModel")
        });
        action.setCallback(this, function (actionResult) {
            var statut = actionResult.getState();
            if (statut === "SUCCESS") {
                let data = actionResult.getReturnValue();
                console.error('===>');
                console.error(data);
                component.set("v.cardOption", data);
            } else if (statut === "ERROR") {
                helper.handleErrors(actionResult.getError(), 'Error in Credit Card Options API : ');
            }
            else {
                console.error("AUTRE ERROR");
            }
        });
        $A.enqueueAction(action);
    },

    getAccountDetails: function (component, event, helper) {
        var action = component.get('c.getAccountDetails');
        action.setParams({
            accountId: component.get("v.recordId")
        });
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var accountDetails = response.getReturnValue();
                component.set("v.accountDetails", accountDetails);
                console.log('Account details fetched:', accountDetails);
                
                // OTP fields always populated with Primary data (read-only)
                var otpMobileField = component.find("cardHolderMobile");
                var otpEmailField = component.find("cardHolderEmail");
                
                if (otpMobileField && accountDetails && accountDetails.PersonMobilePhone) {
                    let mobilePhone = accountDetails.PersonMobilePhone;
                    mobilePhone = mobilePhone.startsWith("00") ? mobilePhone : "00" + mobilePhone.replace(/^0+/, '');
                    otpMobileField.set("v.value", mobilePhone);
                }
                if (otpEmailField && accountDetails && accountDetails.PersonEmail) {
                    otpEmailField.set("v.value", accountDetails.PersonEmail);
                }
                
                // Initialize transaction fields based on current selection
                helper.initializeTransactionFields(component, event, helper);
            } else if (state === "ERROR") {
                console.error('Error fetching account details:', response.getError());
            }
        });
        $A.enqueueAction(action);
    },

    // ========== FIXED: handleNotificationChange ==========
    handleNotificationChange: function (component, event, helper) {
        var otpNotificationValue = component.find("sendOtpNotification") ? component.find("sendOtpNotification").get("v.value") : '';
        var transactionNotificationValue = component.find("sendTransactionNotification") ? component.find("sendTransactionNotification").get("v.value") : '';
        var accountDetails = component.get("v.accountDetails");

        var transactionMobileField = component.find("cardHolderMobileNo");
        var transactionEmailField = component.find("cardHolderEmailAddress");

        // Case 1: Both OTP and Transaction = Primary → auto‑populate with Primary data, read‑only, not required
        if (otpNotificationValue === 'PRIMARY_CUSTOMER' && transactionNotificationValue === 'PRIMARY_CUSTOMER') {
            if (transactionMobileField && accountDetails && accountDetails.PersonMobilePhone) {
                let primaryMobile = accountDetails.PersonMobilePhone;
                primaryMobile = primaryMobile.startsWith("00") ? primaryMobile : "00" + primaryMobile.replace(/^0+/, '');
                transactionMobileField.set("v.value", primaryMobile);
                transactionMobileField.set("v.disabled", true);
                transactionMobileField.set("v.required", false);
                transactionMobileField.set("v.validity", { valid: true });
            }
            if (transactionEmailField && accountDetails && accountDetails.PersonEmail) {
                transactionEmailField.set("v.value", accountDetails.PersonEmail);
                transactionEmailField.set("v.disabled", true);
                transactionEmailField.set("v.required", false);
                transactionEmailField.set("v.validity", { valid: true });
            }
        } 
        // All other combinations → clear fields, enable, and make mandatory
        else {
            if (transactionMobileField) {
                transactionMobileField.set("v.value", '');          // FIX: clear for user input
                transactionMobileField.set("v.disabled", false);
                transactionMobileField.set("v.required", true);
                transactionMobileField.set("v.validity", { valid: true });
                transactionMobileField.reportValidity();
            }
            if (transactionEmailField) {
                transactionEmailField.set("v.value", '');          // FIX: clear for user input
                transactionEmailField.set("v.disabled", false);
                transactionEmailField.set("v.required", true);
                transactionEmailField.set("v.validity", { valid: true });
                transactionEmailField.reportValidity();
            }
        }
        
        setTimeout(function () {
            if (transactionMobileField) transactionMobileField.reportValidity();
            if (transactionEmailField) transactionEmailField.reportValidity();
        }, 100);
    },

    showSpinner: function (component, event, helper) {
        var spinner = component.find("mySpinner");
        $A.util.removeClass(spinner, "slds-hide");
    },

    hideSpinner: function (component, event, helper) {
        var spinner = component.find("mySpinner");
        $A.util.addClass(spinner, "slds-hide");
    },

    handleErrors: function (errors, addError) {
        let toastParams = {
            mode: "sticky",
            title: "Erreur",
            message: errors,
            type: "error"
        };
        if (errors && Array.isArray(errors) && errors.length > 0) {
            toastParams.message = addError + '' + errors[0].message;
        }
        let toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams(toastParams);
        toastEvent.fire();
    },

    showErrorToast: function (component, event, helper, errorMessage) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "type": "error",
            "title": "Error!",
            "message": errorMessage
        });
        toastEvent.fire();
    },

    handleOtpNotificationChange: function (component, event, helper) {
        // OTP fields are always read‑only; this refreshes transaction fields when OTP changes
        helper.handleNotificationChange(component, event, helper);
    },

    initializeTransactionFields: function (component, event, helper) {
        var transactionNotificationField = component.find("sendTransactionNotification");
        if (transactionNotificationField) {
            var transactionNotificationValue = transactionNotificationField.get("v.value");
            if (transactionNotificationValue) {
                helper.handleNotificationChange(component, event, helper);
            }
        }
    },

    showCardHolderMismatchError: function (component, message) {
        this.showErrorToast(component, null, this, message);
    },
})