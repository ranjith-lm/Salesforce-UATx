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
    loadAccountList : function(component) {
        
        console.log("Record ID ",component.get("v.recordId"));
        var action = component.get('c.loadAccountList');
        action.setParams(
        {
			customerId: component.get("v.recordId")
        });
        
        action.setCallback(this, function (actionResult) {
            var status = actionResult.getState();
            
            let data = actionResult.getReturnValue();
            console.log("status account record list ",data);
            console.log("status account ",status);
            
            const accountList = [];
            accountList.push({
                label : 'None',
                value : 'none'
            });
            if (data.isSuccess && status === "SUCCESS") {
                if(data){
                    for(let i = 0; i < data.responseData.accounts.length; i++){
                        accountList.push({
                            label : data.responseData.accounts[i].productName + ' - ' +  data.responseData.accounts[i].customerId,
                            value : data.responseData.accounts[i].customerId + ';' +  data.responseData.accounts[i].id
                        });
                    }
                    console.log("accountList ",accountList);
                    component.set("v.accountList",accountList);
                }
            }
            else {
            	component.set("v.accountList",accountList);
                if(data.errorData){
                	//code 	"ACCO-0002	message	"No account found."
                	let toastParams = {
                        mode: "sticky",
                        title: "Error",
                        message: data.errorData.code + " - " + data.errorData.message, // Default error message
                        type: "error"
                    };
                    
                    // Fire error toast
                    let toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams(toastParams);
                    toastEvent.fire();
                }
            }
        });
        
        $A.enqueueAction(action);
    },
    getAccountTransaction : function(component,customer,accountId){
      	console.log('customer ',customer);
        console.log('accountId ',accountId);
        
        //const todaysDate = new Date();
        //const jsonToDate = this.getFormattedDate(todaysDate);
        
        //todaysDate.setMonth(todaysDate.getMonth() -1);
        //const jsonFromDate = this.getFormattedDate(todaysDate); //one months old 
        
        let toSelectedDate = component.get("v.selectedDateTo");
        let fromSelectedDate = component.get("v.selectedDateFrom");
        console.log("toSelectedDate ",toSelectedDate);
        console.log("fromSelectedDate ",fromSelectedDate);
        
        var searchParametersJson = {
            "id": accountId,
            "offSet": 0,
            "pageSize": 50,
            "fromDate": fromSelectedDate,
            "toDate": toSelectedDate,
            "debitCreditIndicator" : "ALL"
        };
        var action = component.get('c.loadAccountTransactions');
        action.setParams(
        {
			customerId: customer,
            searchParametersJson: JSON.stringify(searchParametersJson)
        });
        
        action.setCallback(this, function (actionResult) {
            debugger;
            var status = actionResult.getState();
            let data = actionResult.getReturnValue();
            console.log("status transaction record list ",data);
            console.log("status transaction ",status);
            if(status == 'SUCCESS'){
                const transData = [];
                for(let i = 0; i < data.responseData.transactions.length; i++){
                    const tranData = data.responseData.transactions[i];
                    let dt = tranData.transactionDate;
                    if(dt.includes('T')){
                        dt = dt.split('T')[0];
                    }
                    transData.push({
                        id: tranData.id,
                        reference: tranData.reference,
                        transactionType: tranData.transactionType,
                        originalAmount: tranData.originalAmount,
                        transactionDate: dt,
                        transactionDescription1 : tranData.transactionDescription1
                    })
                }
                
                //sorting transaction by reference no.
                transData.sort((a, b) =>
                  a.reference.toLowerCase().localeCompare(b.reference.toLowerCase())
                );
                
                component.set("v.transactionData",transData);
                component.set("v.selectedRows", []);
            }
        });
        $A.enqueueAction(action);
    },
    initDateFields: function(component){
    	
        const todaysDate = new Date();
        const jsonToDate = this.getFormattedDate(todaysDate);
        component.set("v.selectedDateTo",jsonToDate);
        
        todaysDate.setMonth(todaysDate.getMonth() - 1);
        const jsonFromDate = this.getFormattedDate(todaysDate);
        component.set("v.selectedDateFrom",jsonFromDate);
	},
    getFormattedDate: function(dtObj){
        const year = dtObj.getFullYear();
        const month = String(dtObj.getMonth() + 1).padStart(2, '0');
        const day = String(dtObj.getDate()).padStart(2, '0');
        
        return `${year}-${month}-${day}`;
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