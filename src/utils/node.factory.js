function returnNodeFromPrediction(prediction) {
    switch(prediction) {
        case 'getProcedure':
            return {//timenode is for specifying attriubte name time is held in for nodes that don't go through encounter
                "databaseAction": "getNode",
                "wantedNode": "[:has_procedure]-(procedure:Procedure)",
                "returnNode": "procedure",
                "timeNode": ""
            }
        case 'getConditions':
            return {
                "databaseAction": "getNode",
                "wantedNode": "[:has_condition]-(condition:Condition)",
                "returnNode": "condition",
                "timeNode": ""
            }

        case 'getImmunization':
            return {
                "databaseAction": "getEncounterlessNode",
                "wantedNode": "[:has_immunization]-(immunization:Immunization)",
                "returnNode": "immunization"
            }

        case 'getObservation':
            return {
                "databaseAction": "getNode",
                "wantedNode": "[:has_observation]-(observation:Observation)",
                "returnNode": "observation",
                "timeNode": ""
            }

        case 'getPatientImmunization':
            return {
                "databaseAction": "getEncounterlessVal",
                "wantedNode": "[:has_immunization]-(immunization:Immunization)",
                "returnNode": "immunization",
                "timeNode": ".occuranceDateTime"
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
                "timeNode": ""
            }
        case 'getPatientObservation':
            return {
                "databaseAction": "getVal",
                "wantedNode": "[:has_observation]-(observation:Observation)",
                "returnNode": "observation",
                "timeNode": ""
            }

        case 'getCommon'://new
            return{
                "databaseAction": "getSame",
                "wantedNode": "",
                "returnNode": "",
                "timeNode": ""
            }
        default:
            return {
                "databaseAction": "None",
                "wantedNode": "None",
                "returnNode": "None",
                "timeNode": "null"
            }
    }
}

module.exports = returnNodeFromPrediction;