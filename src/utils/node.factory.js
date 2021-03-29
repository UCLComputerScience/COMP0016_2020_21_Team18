function returnNodeFromPrediction(prediction) {
  switch (prediction) {
    case "getProcedures":
      return {
        // timenode is for specifying attriubte name time is held in for nodes that don't go through encounter
        databaseAction: "getNode",
        wantedNode: "[:has_procedure]-(procedure:Procedure)",
        returnNode: "procedure",
        timeNode: "",
        detailNode: "",
        entityNode: "",
      };
    case "getConditions":
      return {
        databaseAction: "getNode",
        wantedNode: "[:has_condition]-(condition:Condition)",
        returnNode: "condition",
        timeNode: "",
        detailNode: "",
        entityNode: "",
      };
    case "getImmunizations":
      return {
        databaseAction: "getEncounterlessNode",
        wantedNode: "[:has_immunization]-(immunization:Immunization)",
        returnNode: "immunization",
        timeNode: ".occuranceDateTime",
        detailNode: "",
        entityNode: "",
      };
    case "getObservations":
      return {
        databaseAction: "getNode",
        wantedNode: "[:has_observation]-(observation:Observation)",
        returnNode: "observation",
        timeNode: "",
        detailNode: "",
        entityNode: "",
      };

    case "getPatientImmunizations":
      return {
        databaseAction: "getEncounterlessVal",
        wantedNode: "[:has_immunization]-(immunization:Immunization)",
        returnNode: "immunization",
        timeNode: ".occuranceDateTime",
        detailNode: "vaccineType",
        entityNode: "DB_immunizationName",
      };
    case "getPatientConditions":
      return {
        databaseAction: "getVal",
        wantedNode: "[:has_condition]-(condition:Condition)",
        returnNode: "condition",
        timeNode: "",
        detailNode: "display",
        entityNode: "DB_conditionName",
      };
    case "getPatientProcedures":
      return {
        databaseAction: "getVal",
        wantedNode: "[:has_procedure]-(procedure:Procedure)",
        returnNode: "procedure",
        timeNode: "",
        detailNode: "display",
        entityNode: "DB_procedureName",
      };
    case "getPatientObservations":
      return {
        databaseAction: "getVal",
        wantedNode: "[:has_observation]-(observation:Observation)",
        returnNode: "observation",
        timeNode: "",
        detailNode: "",
        entityNode: "DB_observationName",
      };

    case "getCommon":
      return {
        databaseAction: "getSame",
        wantedNode: "",
        returnNode: "",
        timeNode: "",
        detailNode: "",
        entityNode: "",
      };
    default:
      return {
        databaseAction: "None",
        wantedNode: "None",
        returnNode: "None",
        timeNode: "",
        detailNode: "",
        entityNode: "",
      };
  }
}

module.exports = returnNodeFromPrediction;
