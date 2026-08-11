({
	executeAccountClosureAPI : function(component, event,helper) {
		
        var recordId = component.get("v.recordId");
        
        component.set('v.showLoadingSpinner',true);
        var action = component.get("c.getCaseDetails");
        action.setParams({
            recordId : recordId
        });
        
        action.setCallback(this, function(response){
            var state = response.getState();
            console.log("response.getReturnValue() ",response.getReturnValue());
            console.log("state ",state);
            const res = response.getReturnValue();
            if (state === "SUCCESS") {
                component.set('v.showLoadingSpinner',false);
                if(res && res.length > 0){
                    if(res[0].Unit_Termination__c == undefined || res[0].Unit_Termination__c == null || res[0].Unit_Termination__c == ''){
                        component.set("v.errMsg","Unit Termination field value is missing");
                    }
                    else if(res[0].Account && res[0].Account.CustomerStatus__c == 'Closed'){
                        component.set("v.errMsg","Customer relationship status is already closed.");
                    }
                    else if(res[0].Status.toLowerCase() == 'closed'){
                        component.set("v.errMsg","Case is already closed.");
                    }
                    else {
                        helper.accountClosureAPI(component, event,helper,res[0].Unit_Termination__c);    
                    }
                }
                else {
                    component.set("v.errMsg","Case record detail not found.");
                }
            }
        });
        $A.enqueueAction(action);
	},
    accountClosureAPI:function(component, event,helper,unitTermination){
     
        var recordId = component.get("v.recordId");
        
        component.set('v.showLoadingSpinner',true);
        var action = component.get("c.relationshipTerminationAccount");
        action.setParams({
            recordId : recordId,
            unitTermination : unitTermination
        });
        
        action.setCallback(this, function(response){
            var state = response.getState();
            const res = response.getReturnValue();
            console.log("response.getReturnValue() ",res);
            console.log("state ",state);
            if (state === "SUCCESS" && res.isSuccess) {
                let errMsg = '';
                let successMsg = '';
                if(res.responseData.status == 'VALIDATION_FAILED'){
                    for(let i = 0; i < res.responseData.validationErrors.length; i++){
                        errMsg = errMsg + "<li>" + res.responseData.validationErrors[i].product + "<br/>" + res.responseData.validationErrors[i].message + "</li>";
                    }
                    
                    if(errMsg != ''){
                        errMsg = '<p>Error while closing Account(s)</p><ul>' + errMsg + '</ul>';
                        console.log("errMsg ",errMsg);
                        component.set("v.errMsg",errMsg);
                    }
                }
                else if(res.responseData.status == 'AWATING_HASSALA_COB_CLOSURE'){
                    for(let i = 0; i < res.responseData.pendingAccounts.length; i++){
                        errMsg = errMsg + "<li>" + res.responseData.pendingAccounts[i].iban;
                    }
                    if(errMsg != ''){
                        errMsg = '<p>Following Hassala Account(s) are pending for closure</p><ul>' + errMsg + '</ul>';
                        console.log("errMsg ",errMsg);
                        component.set("v.errMsg",errMsg);
                    }
                }
                else if(res.responseData.status == 'SUCCESS'){
                    for(let i = 0; i < res.responseData.closedAccounts.length; i++){
                        successMsg = successMsg + "<li>IBAN - " + res.responseData.closedAccounts[i].iban + " <br/>Account Type - " + res.responseData.closedAccounts[i].accountType + "</li>";
                    }
                    
                    if(successMsg != ''){
                        successMsg = '<p>Following Account(s) are successfully closed</p><ul>' + successMsg + '</ul>';
                        component.set("v.msg",successMsg);
                    }
                    else {
                        component.set("v.msg","Api called successfully completed.");
                    }
                }
            }
            else {
                component.set("v.errMsg",res.errorData.message);
            }
            component.set('v.showLoadingSpinner',false);
        });
        $A.enqueueAction(action);
    }
})