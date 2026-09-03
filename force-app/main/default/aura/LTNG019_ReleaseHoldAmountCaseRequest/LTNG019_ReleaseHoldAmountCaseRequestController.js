/**
 *	change history :
 		#CH01 - 31Aug2026	#Maksud Ali	- Populated field "Status" picklist value when case is being created.
 */  
({
	doInit: function (component, event, helper) {
        helper.doInit(component, event, helper);
    },
    handleOnload: function (component, event, helper) {
        console.log("on load form !");
    },
    handleOnSubmit: function (component, event, helper) {
        debugger;
        console.log('handleOnSubmit');
        event.preventDefault();
        //console.error(component.get('v.recordTypeId'));
        var fields = event.getParam('fields');
        //CH01 = Start
        
        var amount = component.get("v.amount");
        var date = component.get("v.selectedDate");
        
        // Amount
        if (amount === null || amount === undefined || Number(amount) <= 0) {
            return;
        }
    
        //fields["BUA_AccountsInformation__c"] = component.get("v.allAccList");
        console.log("All Fields",JSON.stringify(fields));
        const isShowAcc = component.get("v.showAllAccount");
        var accountsInformation = "";
        if(!isShowAcc){
         	accountsInformation = component.find("BUA_AccountsInformationList").get("v.value");
            accountsInformation = accountsInformation[0];
        }
        else {
            accountsInformation = component.find("BUA_AccountsInformationDetails").get("v.value");
        }
        console.log("BUA_AccountsInformation ",accountsInformation);
        
        // Future date
        if (date) {
            var today = new Date();
            today.setHours(0, 0, 0, 0);
    
            var selectedDate = new Date(date + "T00:00:00");
            selectedDate.setHours(0, 0, 0, 0);
    
            if (selectedDate <= today) {
                return;
            }
        }
        
        var selectedType = component.get("v.Type");
        if(selectedType == "Place Hold"){
        	fields["Status"] = "In Progress";    
        }

        accountsInformation = accountsInformation.replace(/,$/, '');
        
        fields["BUA_AccountsInformation__c"] = accountsInformation;
        
        fields["RHA_HoldExpiryDate__c"] = $A.localizationService.formatDate(component.find('RHA_HoldExpiryDatecustom').get('v.value'), "dd-MM-yyyy");
        fields["RHA_HoldAmount__c"] = amount;
        component.find('form').submit(fields);
        helper.showSpinner(component);
        //CH01 = End
    },
    validateDate : function(component, event, helper) {
        var selectedDate = component.get("v.selectedDate");
    
        if (!selectedDate) {
            return;
        }
    
        // Get today's date at local midnight
        var today = new Date();
        today.setHours(0, 0, 0, 0);
    
        // Convert selected date to local date
        var dateParts = selectedDate.split("-");
        var selected = new Date(
            dateParts[0],
            dateParts[1] - 1,
            dateParts[2]
        );
        selected.setHours(0, 0, 0, 0);
    
        var input = component.find("RHA_HoldExpiryDatecustom");
    
        if (selected <= today) {
            input.setCustomValidity("Please select a future date.");
        } else {
            input.setCustomValidity("");
        }
    
        input.reportValidity();
    },
    validateAmount : function(component, event, helper) {
        var amount = component.get("v.amount");
        var input = component.find("RHA_HoldAmount");

        if (amount == null || amount <= 0) {
            input.setCustomValidity("Amount must be greater than 0.");
        } else {
            input.setCustomValidity("");
        }

        input.reportValidity();
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