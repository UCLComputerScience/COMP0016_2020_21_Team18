function returnNodeFromPrediction(prediction) {
    switch(prediction) {
        case 'getProcedure':
            return {
                "databaseAction": "getNode",
                "wantedNode": "[:has_procedure]-(procedure:Procedure)",
                "returnNode": "procedure"
            }
        case 'getConditions':
            return {
                "databaseAction": "getNode",
                "wantedNode": "[:has_condition]-(condition:Condition)",
                "returnNode": "condition"
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
                "returnNode": "observation"
            }

        case 'getPatientImmunization':
            return {
                "databaseAction": "getEncounterlessVal",
                "wantedNode": "[:has_immunization]-(immunization:Immunization)",
                "returnNode": "immunization"
            }
        case 'getPatientConditions':
            return {
                "databaseAction": "getVal",
                "wantedNode": "[:has_condition]-(condition:Condition)",
                "returnNode": "condition"
            }
        case 'getPatientProcedures':
            return {
                "databaseAction": "getVal",
                "wantedNode": "[:has_procedure]-(procedure:Procedure)",
                "returnNode": "procedure"
            }
        case 'getPatientObservation':
            return {
                "databaseAction": "getVal",
                "wantedNode": "[:has_observation]-(observation:Observation)",
                "returnNode": "observation"
            }

        case 'getCommon'://new
            return{
                "databaseAction": "getSame",
                "wantedNode": "",
                "returnNode": ""
            }
        default:
            return {
                "databaseAction": "None",
                "wantedNode": "None",
                "returnNode": "None"
            }
    }
}

module.exports = returnNodeFromPrediction;