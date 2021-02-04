const returnNodeFromPrediction = require('../src/utils/node.factory');

describe("Node factory spec", () => {
    it.each([
        [
            "getDrugs",
            {
                "databaseAction": "getNode",
                "wantedNode": "[:HAS_DRUG]-(drug:Drug)",
                "returnNode": "drug"
            }
        ],
        [
            "getConditions",
            {
                "databaseAction": "getNode",
                "wantedNode": "[:HAS_CONDITION]-(condition:Condition)",
                "returnNode": "condition"
            }
        ],
        [
            "getCarePlan",
            {
                "databaseAction": "getNode",
                "wantedNode": "[:HAS_CARE_PLAN]-(carePlan:CarePlan)",
                "returnNode": "carePlan"
            }
        ],
        [
            "getAllergies",
            {
                "databaseAction": "getNode",
                "wantedNode": "[:HAS_ALLERGY]-(allergy:Allergy)",
                "returnNode": "allergy"
            }
        ],
        [
            "getProcedures",
            {
                "databaseAction": "getNode",
                "wantedNode": "[:HAS_PROCEDURE]-(procedure:Procedure)",
                "returnNode": "procedure"
            }
        ],
        [
            "getObservation",
            {
                "databaseAction": "getNode",
                "wantedNode": "[:HAS_OBSERVATION]-(observation:Observation)",
                "returnNode": "procedure"
            }
        ]
    ])("%i should return correct values", (input, output) => {
        const expectedNode = returnNodeFromPrediction(input);
        expect(expectedNode).toStrictEqual(output);
    })
})