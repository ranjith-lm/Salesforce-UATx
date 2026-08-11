({
    doInit: function(component, event, helper) {
        component.set("v.columns", [
            {
                label: "Case Number",
                fieldName: "caseLink",
                type: "url",
                typeAttributes: {
                    label: { fieldName: "CaseNumber" },
                    target: "_blank"
                }
            },
            { label: "Status", fieldName: "Status", type: "text" },
            { label: "Sub Status", fieldName: "Sub_Status__c", type: "text" },
            {
                label: "Date/Time Opened",
                fieldName: "CreatedDate",
                type: "date",
                sortable: true,
                typeAttributes: {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit"
                }
            },
            {
                label: "Date/Time Closed",
                fieldName: "ClosedDate",
                type: "date",
                sortable: true,
                typeAttributes: {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit"
                }
            }
        ]);

        helper.configureSection(component);
        helper.fetchCases(component);
    },

    handleRecordUpdated: function(component, event, helper) {
        const changeType = event.getParams().changeType;

        if (changeType === "LOADED") {
            helper.configureSection(component);
        }

        if (changeType === "CHANGED") {
            helper.configureSection(component);
            helper.fetchCases(component);
        }

        if (changeType === "ERROR") {
            console.error(
                "Error loading the current Case Sub Type."
            );
        }
    },
    toggleCases: function(component, event, helper) {
        const showAll = !component.get("v.showAll");
        component.set("v.showAll", showAll);
        helper.updateDisplayedCases(component);
    }
});