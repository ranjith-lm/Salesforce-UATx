({
	helperMethod : function() {
		
	},
    showSpinner: function (component, event, helper) {
        var spinner = component.find("waiverSpinner");
        $A.util.removeClass(spinner, "slds-hide");
    },
    hideSpinner: function (component, event, helper) {
        var spinner = component.find("waiverSpinner");
        $A.util.addClass(spinner, "slds-hide");
    },
    handleErrors: function (errors, addError) {
        console.log("actionResult.getError() ",errors);
        debugger;
        // Configure error toast
        let toastParams = {
            mode: "sticky",
            title: "Error",
            message: errors, // Default error message
            type: "error"
        };
        // Pass the error message if any
        if (errors && Array.isArray(errors) && errors.length > 0) {
            
            if(errors[0].pageErrors && errors[0].pageErrors.length > 0){
				toastParams.message = errors[0].pageErrors[0].message;              
            }
            else if(errors[0].message) {
            	toastParams.message = errors[0].message;   
            }
        }
        // Fire error toast
        let toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams(toastParams);
        toastEvent.fire();
    },
    validateFileSize:function(component,event,fileName){
        var action = component.get('c.validateFileSize');
        action.setParams(
        {
            contentDoumentId: component.get('v.contentDocumentId')
        });
        action.setCallback(this, function (actionResult) {
            debugger;
            var status = actionResult.getState();
            let response = actionResult.getReturnValue();
            var toastEvent = $A.get("e.force:showToast");
            if (status === "SUCCESS" && response == 'success') {
                
                toastEvent.setParams({
                    "mode" : "dismissible",
                    "type" : "success",
                    "title" : "Success!",
                    "message" : "File uploaded successfully."
                });
                toastEvent.fire();
                component.set("v.waiverFileName",fileName);
            }
            else {
                component.set("v.documentIdList",'');
                component.set("v.contentDocumentId","");
                toastEvent.setParams({
                    "mode" : "dismissible",
                    "type" : "error",
                    "title" : "Error!",
                    "message" : response 
                });
                toastEvent.fire();  
            }
        });
        $A.enqueueAction(action);
    },
    saveWaiverWithFile: function(component,event){
        const fields = event.getParam("fields");
        var data = {
            accountId : component.get("v.recordId"),
            subject : fields.Subject__c,
            description : fields.Description__c,
            caseModel : fields.Case_Model__c,
            type : fields.Type__c,
            subType : fields.Sub_Type__c,
            requestType : fields.Request_Type__c,
            caseOrigin : fields.Case_Origin__c,
            claimAmount : fields.Claim_Amount__c,
            contentDocumentId : component.get("v.contentDocumentId"),
            transactionRefNumber : fields.Transaction_Reference_Number__c
        }
        
        console.log("new data ",data);
        var action = component.get('c.createWaiverRequest');
        action.setParams(
        {
			jsonFieldData: JSON.stringify(data),
            documentIds: component.get('v.documentIdList')
        });
        
        action.setCallback(this, function (actionResult) {
            var status = actionResult.getState();
            let tmpData = actionResult.getReturnValue();
            console.log("status ",status);
            this.hideSpinner(component);
            if (status === "SUCCESS") {
            	let data = actionResult.getReturnValue();
                console.log('Waiver data ',data);
                if(data){
                    const parseData = JSON.parse(data);
                    $A.get("e.force:closeQuickAction").fire();
                    let toastParams = {
                        mode: "dismissible",
                        title: "Success",
                        message: "Waiver case created successfully.",
                        type: "success"
                    };
                    let toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams(toastParams);
                    toastEvent.fire();
                    
                    const navEvt = $A.get("e.force:navigateToSObject");
                    navEvt.setParams({
                        "recordId": parseData.recordId,
                        "slideDevName": "detail"
                    });
                    navEvt.fire();
                }
                else {
                    this.hideSpinner(component);
                }
            }
            else if (status === "ERROR") {
                // Process error returned by server
                this.handleErrors(actionResult.getError(), 'Error in Waiver Record Creation : ');
                this.hideSpinner(component);
            }
            else {
                this.hideSpinner(component);
            }
        });
        $A.enqueueAction(action);
    }
})