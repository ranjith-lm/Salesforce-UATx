({
	doInit: function (component, event, helper) {
        helper.doInit(component, event, helper);
    },
    handleOnload: function (component, event, helper) {
        console.log("on load form !");
    },
    handleOnSubmit: function (component, event, helper) {
        console.log('handleOnSubmit');
        event.preventDefault();
        console.error(component.get('v.recordTypeId'));
        var fields = event.getParam('fields');  
        fields["RHA_HoldExpiryDate__c"] = $A.localizationService.formatDate(component.find('RHA_HoldExpiryDatecustom').get('v.value'), "dd-MM-yyyy");
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
    },
    handleLoad: function (component, event, helper) {//CH01
       var recordId=component.get('v.recordId');
       var objectInfo= event.getParam('records');
       let subscriptionModel= objectInfo[recordId].fields['Subscription_Model__pc'].value;
       let regionFlag = objectInfo[recordId].fields['Region_Flag__pc'].value;
        if(regionFlag=='Bahrain'){
            component.set('v.currency','BHD');
        }else if(regionFlag=='Jordan'){
            component.set('v.currency','JOD');
        }
        if( subscriptionModel != null && subscriptionModel == 'alburaq' ){
            component.set('v.caseModel',subscriptionModel);
        }else{
            component.set('v.caseModel','ila');
        }
	},
    onChangeType:function(component, event, helper) {
         var cType = component.find("type").get("v.value");
         component.set('v.Type',cType);
    },
    onChangeAllAcnt:function(component, event, helper) {
         var AcntVal = event.getSource().get("v.value");
        if(AcntVal){
            component.set('v.showAllAccount',false);
        }else{
             component.set('v.showAllAccount',true);
        }
    }
})