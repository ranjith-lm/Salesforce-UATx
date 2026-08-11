({
    doInit : function(component, event, helper) {
        component.set("v.accountOld", JSON.parse(JSON.stringify(component.get("v.account"))));
        helper.init(component);
    },
    
    onEditClick : function(component, event, helper) { 
        component.set('v.mode', 'edit');
	},
    
    onCancelClick : function(component, event, helper) {
        component.set('v.account', JSON.parse(JSON.stringify(component.get('v.accountOld'))));
        component.set('v.mode', 'view');
	},
    
    onSaveClick : function(component, event, helper) {
        var account = component.get("v.account");
        var customerId = component.get('v.customerId');
        var caseId = component.get('v.caseId');
        helper.save(component, account, customerId, caseId);
    }
})