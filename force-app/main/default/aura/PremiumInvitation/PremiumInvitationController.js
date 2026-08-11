/**
Change History :
*         #CH01 : #D&A Team #24-06-2022# Added Case model parameter to add alburaq logic.
*/
({
    doInit: function (component, event, helper) {
       
        helper.showSpinner(component);
        helper.doInit(component, event, helper);
        //helper.hideSpinner(component);
    },
    handleOnload: function (component, event, helper) {
        helper.showSpinner(component);
        var accId=component.get('v.recordId');
        helper.handlecustomerName(component, event, helper, accId);
        console.log("on load form !");
        helper.hideSpinner(component);
    },
    handleOnSubmit: function (component, event, helper) {
        console.log('handleOnSubmit');
        event.preventDefault();
        console.error(component.get('v.recordTypeId'));
        var fields = event.getParam('fields');
        fields["BUA_Reason__c"] = "Pending on customer response";
        fields["Awaiting_Customer_Feedback__c"]=true;
        component.find('form').submit(fields);
        helper.showSpinner(component);
    },
    handleOnSuccess: function (component, event, helper) {
        helper.hideSpinner(component);
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "type": "success",
            "title": "Success!",
            "message": "Case has been created successfully."
        });
        toastEvent.fire();
        $A.get("e.force:closeQuickAction").fire();

        var navEvt = $A.get("e.force:navigateToSObject");
        navEvt.setParams({
            "recordId": event.getParam("response").id,
            "slideDevName": "detail"
        });
        navEvt.fire();
    },
    handleOnError: function (component, event, helper) {
        helper.hideSpinner(component);
    },
    onCancel: function (component, event, helper) {
        $A.get("e.force:closeQuickAction").fire();
    },
    caseModelIsChanged : function(component, event, helper) {
        console.error('is changed caseModelIsChanged');
        //#CH01
	
    },
    handleLoad: function (component, event, helper) {//CH01
		console.log('handleLoad  cmp---'+component.find("Subscription_Model").get("v.value"));
        let subscriptionModel = component.find("Subscription_Model").get("v.value");
        if( subscriptionModel != null && subscriptionModel == 'alburaq' ){
            component.set('v.caseModel',subscriptionModel);
        }else{
            component.set('v.caseModel','ila');
        }
	},
})