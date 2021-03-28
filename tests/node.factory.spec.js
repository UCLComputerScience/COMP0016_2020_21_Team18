const returnNodeFromPrediction = require('../src/utils/node.factory');

describe("Node factory spec", () => {
    it.each([
        [
            "getProcedures",
            {
                "databaseAction": "getNode",
                "wantedNode": "[:has_procedure]-(procedure:Procedure)",
                "returnNode": "procedure",
                "timeNode": "",
                "detailNode": ""
            }
        ],
        [
            "getConditions",
            {
                "databaseAction": "getNode",
                "wantedNode": "[:has_condition]-(condition:Condition)",
                "returnNode": "condition",
                "timeNode": "",
                "detailNode": ""
            }
        ],
        [
            "getCommon",
            {
                "databaseAction": "getSame",
                "wantedNode": "",
                "returnNode": "",
                "timeNode": "",
                "detailNode": ""
            }
        ],
        [
            "getPatientObservation",
            {
                "databaseAction": "getVal",
                "wantedNode": "[:has_observation]-(observation:Observation)",
                "returnNode": "observation",
                "timeNode": "",
                "detailNode": ""
            }
        ],
        [
            "getPatientProcedures",
            {
                "databaseAction": "getVal",
                "wantedNode": "[:has_procedure]-(procedure:Procedure)",
                "returnNode": "procedure",
                "timeNode": "",
                "detailNode": ""
            }
        ],
        [
            "getPatientConditions",
            {
                "databaseAction": "getVal",
                "wantedNode": "[:has_condition]-(condition:Condition)",
                "returnNode": "condition",
                "timeNode": ""
            }
        ],
        [
            "getPatientImmunization",
            {
                "databaseAction": "getEncounterlessVal",
                "wantedNode": "[:has_immunization]-(immunization:Immunization)",
                "returnNode": "immunization",
                "timeNode": ".occuranceDateTime",
                "detailNode": ".display"
            }
        ],
        [
            "getObservation",
            {
                "databaseAction": "getNode",
                "wantedNode": "[:has_observation]-(observation:Observation)",
                "returnNode": "observation",
                "timeNode": "",
                "detailNode": ""
            }
        ],
        [
            "getImmunizations",
            {
                "databaseAction": "getEncounterlessNode",
                "wantedNode": "[:has_immunization]-(immunization:Immunization)",
                "returnNode": "immunization",
                "timeNode": ".occuranceDateTime",
                "detailNode": ""
            }
        ],
        [
            "random",
            {
                "databaseAction": "None",
                "wantedNode": "None",
                "returnNode": "None",
                "timeNode": "",
                "detailNode": ""
            }
        ]
    ])("%i should return correct values", (input, output) => {
        const expectedNode = returnNodeFromPrediction(input);
        expect(expectedNode).toStrictEqual(output);
    })
})