/* eslint-disable no-undef */
const returnNodeFromPrediction = require("../../src/utils/node.factory");

describe("Node factory spec", () => {
  it.each([
    [
      "getDrugs",
      {
        databaseAction: "getNode",
        wantedNode: "[:HAS_DRUG]-(drug:Drug)",
        returnNode: "drug",
        detailNode: "",
        entityNode: "",
      }
    ],
    [
      "getAllergies",
      {
        databaseAction: "getNode",
        wantedNode: "[:HAS_ALLERGY]-(allergy:Allergy)",
        returnNode: "allergy",
        detailNode: "",
        entityNode: "",
      }
    ],
    [
      "getCarePlan",
      {
        databaseAction: "getNode",
        wantedNode: "[:HAS_CARE_PLAN]-(careplan:CarePlan)",
        returnNode: "carePlan",
        detailNode: "",
        entityNode: "",
      }
    ],
    [
      "getProcedures",
      {
        databaseAction: "getNode",
        wantedNode: "[:HAS_PROCEDURE]-(procedure:Procedure)",
        returnNode: "procedure",
        detailNode: "",
        entityNode: "",
      },
    ],
    [
      "getConditions",
      {
        databaseAction: "getNode",
        wantedNode: "[:HAS_CONDITION]-(condition:Condition)",
        returnNode: "condition",
        detailNode: "",
        entityNode: "",
      },
    ],
    [
      "getAddress",
      {
        databaseAction: "getEncounterlessNode",
        wantedNode: "[:HAS_ADDRESS]-(address:Address)",
        returnNode: "address.address",
        detailNode: ".address",
        entityNode: "",
      }
    ],
    [
      "getPatientAddresses",
      {
        databaseAction: "getEncounterlessVal",
        wantedNode: "[:HAS_ADDRESS]-(address:Address)",
        returnNode: "address",
        detailNode: "address",
        entityNode: "DB_addressName",
      }
    ],
    [
      "getPatientDrugs",
      {
        databaseAction: "getVal",
        wantedNode: "[:HAS_DRUG]-(drug:Drug)",
        returnNode: "drug",
        detailNode: "description",
        entityNode: "DB_drugDescription",
      }
    ],
    [
      "getPatientAllergies",
      {
        databaseAction: "getVal",
        wantedNode: "[:HAS_ALLERGY]-(allergy:Allergy)",
        returnNode: "allergy",
        detailNode: "description",
        entityNode: "DB_allergyName",
      }
    ],
    [
      "getPatientCarePlan",
      {
        databaseAction: "getVal",
        wantedNode: "[:HAS_CARE_PLAN]-(careplan:CarePlan)",
        returnNode: "careplan",
        detailNode: "description",
        entityNode: "DB_carePlanName",
      }
    ],
    [
      "getCommon",
      {
        databaseAction: "getSame",
        wantedNode: "",
        returnNode: "",
        detailNode: "address",
        entityNode: "",
      },
    ],
    [
      "getPatientProcedures",
      {
        databaseAction: "getVal",
        wantedNode: "[:HAS_PROCEDURE]-(procedure:Procedure)",
        returnNode: "procedure",
        detailNode: "description",
        entityNode: "DB_procedureName",
      },
    ],
    [
      "getPatientConditions",
      {
        databaseAction: "getVal",
        wantedNode: "[:HAS_CONDITION]-(condition:Condition)",
        returnNode: "condition",
        detailNode: "description",
        entityNode: "DB_conditionName",
      },
    ],
    [
      "random",
      {
        databaseAction: "None",
        wantedNode: "None",
        returnNode: "None",
        detailNode: "",
        entityNode: "",
      },
    ],
  ])("%s should return correct values", (input, output) => {
    const expectedNode = returnNodeFromPrediction(input);
    expect(expectedNode).toStrictEqual(output);
  });
});
