/**
 * @file Factory responsible for creating queries based on LUIS user intents predictions
 * @author Jakub Mularski, Shea Magennis, Alex Hein
 * @copyright Great Ormond Street Hospital, 2020
 */

/**
 * Based on LUIS prediction returns an object containing all data necessary to form Neo4J query that contains the response.
 * @param {string} prediction Name of entity predicted by LUIS for user query
 * @returns {object} Object needed to form a response
 */
function returnNodeFromPrediction(prediction) {
  switch (prediction) {
    case "getDrugs":
      return {
        databaseAction: "getNode",
        wantedNode: "[:HAS_DRUG]-(drug:Drug)",
        returnNode: "drug",
        timeNode: "",
        detailNode: "",
        entityNode: "",
      };
    case "getAllergies":
      return {
        databaseAction: "getNode",
        wantedNode: "[:HAS_ALLERGY]-(allergy:Allergy)",
        returnNode: "allergy",
        timeNode: "",
        detailNode: "",
        entityNode: "",
      };
    case "getCarePlan":
      return {
        databaseAction: "getNode",
        wantedNode: "[:HAS_CARE_PLAN]-(careplan:CarePlan)",
        returnNode: "carePlan",
        timeNode: "",
        detailNode: "",
        entityNode: "",
      };
    case "getProcedures":
      return {
        databaseAction: "getNode",
        wantedNode: "[:HAS_PROCEDURE]-(procedure:Procedure)",
        returnNode: "procedure",
        timeNode: "",
        detailNode: "",
        entityNode: "",
      };
    case "getConditions":
      return {
        databaseAction: "getNode",
        wantedNode: "[:HAS_CONDITION]-(condition:Condition)",
        returnNode: "condition",
        timeNode: "",
        detailNode: "",
        entityNode: "",
      };
    case "getAddresses":
      return {
        databaseAction: "getEncounterlessNode",
        wantedNode: "[:HAS_ADDRESS]-(address:Address)",
        returnNode: "address",
        timeNode: ".occuranceDateTime",
        detailNode: ".address",
        entityNode: "",
      };
    case "getObservations":
      return {
        databaseAction: "getNode",
        wantedNode: "[:HAS_OBSERVATION]-(observation:Observation)",
        returnNode: "observation",
        timeNode: "",
        detailNode: "",
        entityNode: "",
      };

    case "getPatientAddresses":
      return {
        databaseAction: "getEncounterlessVal",
        wantedNode: "[:HAS_ADDRESS]-(address:Address)",
        returnNode: "address",
        timeNode: ".occuranceDateTime",
        detailNode: "address",
        entityNode: "DB_addressName",
      };
    case "getPatientConditions":
      return {
        databaseAction: "getVal",
        wantedNode: "[:HAS_CONDITION]-(condition:Condition)",
        returnNode: "condition",
        timeNode: "",
        detailNode: "description",
        entityNode: "DB_conditionName",
      };
    case "getPatientDrugs":
      return {
        databaseAction: "getVal",
        wantedNode: "[:HAS_DRUG]-(drug:Drugs)",
        returnNode: "drug",
        timeNode: "",
        detailNode: "description",
        entityNode: "DB_drugName",
      };
    case "getPatientAllergies":
      return {
        databaseAction: "getVal",
        wantedNode: "[:HAS_ALLERGY]-(allergy:Allergy)",
        returnNode: "allergy",
        timeNode: "",
        detailNode: "description",
        entityNode: "DB_allergyName",
      };
    case "getPatientCarePlan":
      return {
        databaseAction: "getVal",
        wantedNode: "[:HAS_CARE_PLAN]-(careplan:CarePlan)",
        returnNode: "careplan",
        timeNode: "",
        detailNode: "description",
        entityNode: "DB_CarePlanName",
      };
    case "getPatientProcedures":
      return {
        databaseAction: "getVal",
        wantedNode: "[:HAS_PROCEDURE]-(procedure:Procedure)",
        returnNode: "procedure",
        timeNode: "",
        detailNode: "description",
        entityNode: "DB_procedureName",
      };
    case "getPatientObservations":
      return {
        databaseAction: "getVal",
        wantedNode: "[:HAS_OBSERVATION]-(observation:Observation)",
        returnNode: "observation",
        timeNode: "",
        detailNode: "",
        entityNode: "DB_observationName",
      };

    case "getCommon"://
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
