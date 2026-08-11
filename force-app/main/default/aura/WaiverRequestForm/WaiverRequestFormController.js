({
	init : function(component, event, helper) {
		
	},
    handleOnSubmit: function (component, event, helper) {
        const file = component.get("v.waiverFile");
        
        helper.showSpinner(component);
        event.preventDefault();
        helper.saveWaiverWithFile(component,event);
        /*
        //Below code would only execute when a file is attach for uploading.
        if(file){
        	const maxSize = 25 * 1024 * 1024; // 25 MB
            const fileReader = new FileReader();
            fileReader.onload = function(){
                const base64 = fileReader.result.split(',')[1];
                helper.saveWaiverWithFile(component,event,base64);
            }
            fileReader.readAsDataURL(file);
        }
        else {
            helper.saveWaiverWithFile(component,event,"");
        }*/
    },
    handleOnSuccess: function (component, event, helper) {
    	helper.hideSpinner(component);
        
        //navigating the newly created record.
        var navEvt = $A.get("e.force:navigateToSObject");
        
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "mode" : "dismissible",
            "type" : "success",
            "title" : "Success!",
            "message" : "Waiver Case has been created successfully."
        });
        toastEvent.fire();
        
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
    handleFileChange: function(component, event){
        const file = event.getSource().get("v.files")[0];
        component.set("v.fileSizeError","");
        component.set("v.isDisabled",false);
        const maxSize = 25 * 1024 * 1024; // 25 MB
        if (file.size > maxSize) {
        	component.set("v.fileSizeError","File size cannot be more than 25 MB.");
            component.set("v.isDisabled",true);
        }
        else {
            component.set("v.waiverFile",file);
        	component.set("v.waiverFileName",file.name);
        }
    },
    handleUploadFinished : function(component, event, helper) {
    	const uploadedFiles = event.getParam("files");
        console.log("Uploaded file(s): ", uploadedFiles);
        component.set("v.contentDocumentId",uploadedFiles[0].documentId);
        var docIds = component.get("v.documentIdList");
        docIds.push(uploadedFiles[0].documentId);
        component.set("v.documentIdList",docIds);
        helper.validateFileSize(component, event, uploadedFiles[0].name);
    }
})