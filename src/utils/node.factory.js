function returnNodeFromPrediction(prediction) {
    switch(prediction) {
        case 'getProcedures':
            return {//timenode is for specifying attriubte name time is held in for nodes that don't go through encounter
                "databaseAction": "getNode",
                "wantedNode": "[:has_procedure]-(procedure:Procedure)",
                "returnNode": "procedure",
                "timeNode": "",
                "detailNode": ""
            }
        case 'getConditions':
            return {
                "databaseAction": "getNode",
                "wantedNode": "[:has_condition]-(condition:Condition)",
                "returnNode": "condition",
                "timeNode": "",
                "detailNode": ""
            }
        case 'getDrugs':
            return {
                "databaseAction": "getNode",
                "wantedNode": "[:has_drug]-(drug:Drug)",
                "returnNode": "drug",
                "timeNode": "",
                "detailNode": ""
            }
        case 'getImmunizations':
            return {
                "databaseAction": "getEncounterlessNode",
                "wantedNode": "[:has_immunization]-(immunization:Immunization)",
                "returnNode": "immunization",
                "timeNode": ".occuranceDateTime",
                "detailNode": ""
            }
        case 'getObservation':
            return {
                "databaseAction": "getNode",
                "wantedNode": "[:has_observation]-(observation:Observation)",
                "returnNode": "observation",
                "timeNode": "",
                "detailNode": ""
            }

        case 'getPatientImmunization':
            return {
                "databaseAction": "getEncounterlessVal",
                "wantedNode": "[:has_immunization]-(immunization:Immunization)",
                "returnNode": "immunization",
                "timeNode": ".occuranceDateTime",
                "detailNode": ".display"
            }
        case 'getPatientConditions':
            return {
                "databaseAction": "getVal",
                "wantedNode": "[:has_condition]-(condition:Condition)",
                "returnNode": "condition",
                "timeNode": ""
            }
        case 'getPatientProcedures':
            return {
                "databaseAction": "getVal",
                "wantedNode": "[:has_procedure]-(procedure:Procedure)",
                "returnNode": "procedure",
                "timeNode": "",
                "detailNode": ""
            }
        case 'getPatientObservation':
            return {
                "databaseAction": "getVal",
                "wantedNode": "[:has_observation]-(observation:Observation)",
                "returnNode": "observation",
                "timeNode": "",
                "detailNode": ""
            }

        case 'getCommon'://new
            return{
                "databaseAction": "getSame",
                "wantedNode": "",
                "returnNode": "",
                "timeNode": "",
                "detailNode": ""
            }
        default:
            return {
                "databaseAction": "None",
                "wantedNode": "None",
                "returnNode": "None",
                "timeNode": "",
                "detailNode": ""
            }
    }
}

module.exports = returnNodeFromPrediction;