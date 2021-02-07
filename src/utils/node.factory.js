function returnNodeFromPrediction(prediction) {
    switch(prediction) {
        case 'getDrugs':
            return {
                "databaseAction": "getNode",
                "wantedNode": "[:HAS_DRUG]-(drug:Drug)",
                "returnNode": "drug"
            }
        case 'getConditions':
            return {
                "databaseAction": "getNode",
                "wantedNode": "[:HAS_CONDITION]-(condition:Condition)",
                "returnNode": "condition"
            }
        case 'getCarePlan':
            return {
                "databaseAction": "getNode",
                "wantedNode": "[:HAS_CARE_PLAN]-(carePlan:CarePlan)",
                "returnNode": "carePlan"
            }
        case 'getAllergies':
            return {
                "databaseAction": "getNode",
                "wantedNode": "[:HAS_ALLERGY]-(allergy:Allergy)",
                "returnNode": "allergy"
            }
        case 'getProcedures':
            return {
                "databaseAction": "getNode",
                "wantedNode": "[:HAS_PROCEDURE]-(procedure:Procedure)",
                "returnNode": "procedure"
            }
        case 'getObservation':
            return {
                "databaseAction": "getNode",
                "wantedNode": "[:HAS_OBSERVATION]-(observation:Observation)",
                "returnNode": "procedure"
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