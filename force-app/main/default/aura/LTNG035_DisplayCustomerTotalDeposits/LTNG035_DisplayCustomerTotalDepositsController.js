({
    myAction : function(component, event, helper) {

    },
    showPopup : function(component, event, helper) {
        console.log('showPopup function c');
        helper.CustomerDepositDetailsViaApi(component, event, helper);
    },
    
    openProductsOffers: function (component, event, helper) {
        // Always set to true to show the modal
        component.set('v.showLWCComponent', true);

        // Use a small timeout to ensure the LWC is rendered
        setTimeout(function () {
            // Call the LWC's openModal method directly
            var lwcComponent = component.find("lwcComponent");
            if (lwcComponent) {
                lwcComponent.openModal();
            }
        }, 100);
    },
})