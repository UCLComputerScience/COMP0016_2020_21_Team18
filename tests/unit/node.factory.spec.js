/* eslint-disable no-undef */
const returnNodeFromPrediction = require("../../src/utils/node.factory");

describe("Node factory spec", () => {
  it.each([
    [
      "getProcedures",
      {
        databaseAction: "getNode",
        wantedNode: "[:has_procedure]-(procedure:Procedure)",
        returnNode: "procedure",
        timeNode: "",
        detailNode: "",
        entityNode: "",
      },
    ],
    [
      "getConditions",
      {
        databaseAction: "getNode",
        wantedNode: "[:has_condition]-(condition:Condition)",
        returnNode: "condition",
        timeNode: "",
        detailNode: "",
        entityNode: "",
      },
    ],
    [
      "getCommon",
      {
        databaseAction: "getSame",
        wantedNode: "",
        returnNode: "",
        timeNode: "",
        detailNode: "",
        entityNode: "",
      },
    ],
    [
      "getPatientObservations",
      {
        databaseAction: "getVal",
        wantedNode: "[:has_observation]-(observation:Observation)",
        returnNode: "observation",
        timeNode: "",
        detailNode: "",
        entityNode: "DB_observationName",
      },
    ],
    [
      "getPatientProcedures",
      {
        databaseAction: "getVal",
        wantedNode: "[:has_procedure]-(procedure:Procedure)",
        returnNode: "procedure",
        timeNode: "",
        detailNode: "display",
        entityNode: "DB_procedureName",
      },
    ],
    [
      "getPatientConditions",
      {
        databaseAction: "getVal",
        wantedNode: "[:has_condition]-(condition:Condition)",
        returnNode: "condition",
        timeNode: "",
        detailNode: "display",
        entityNode: "DB_conditionName",
      },
    ],
    [
      "getPatientImmunizations",
      {
        databaseAction: "getEncounterlessVal",
        wantedNode: "[:has_immunization]-(immunization:Immunization)",
        returnNode: "immunization",
        timeNode: ".occuranceDateTime",
        detailNode: "vaccineType",
        entityNode: "DB_immunizationName",
      },
    ],
    [
      "getObservations",
      {
        databaseAction: "getNode",
        wantedNode: "[:has_observation]-(observation:Observation)",
        returnNode: "observation",
        timeNode: "",
        detailNode: "",
        entityNode: "",
      },
    ],
    [
      "getImmunizations",
      {
        databaseAction: "getEncounterlessNode",
        wantedNode: "[:has_immunization]-(immunization:Immunization)",
        returnNode: "immunization",
        timeNode: ".occuranceDateTime",
        detailNode: "",
        entityNode: "",
      },
    ],
    [
      "random",
      {
        databaseAction: "None",
        wantedNode: "None",
        returnNode: "None",
        timeNode: "",
        detailNode: "",
        entityNode: "",
      },
    ],
  ])("%s should return correct values", (input, output) => {
    const expectedNode = returnNodeFromPrediction(input);
    expect(expectedNode).toStrictEqual(output);
  });
});
