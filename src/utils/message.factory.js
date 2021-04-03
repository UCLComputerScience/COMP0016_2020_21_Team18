/**
 * @file Responsible for calling database functions and forming messages from data returned by node.factory.
 * @author Jakub Mularski, Shea Magennis, Alex Hein
 * @copyright Great Ormond Street Hospital, 2020
 */

const {
  getNode,
  getVal,
  getSame,
  getEncounterlessNode,
  getEncounterlessVal,
} = require("./database");

/**
 * 
 * @param {string} databaseAction Type of query which should be executed
 * @param {string} wantedNode Node that we want to query
 * @param {string} returnNode Node that we want to return
 * @param {*} detailNode Key of node of which value should be returned
 * @param {*} entityNode LUIS entity name that should be extracted for the query
 * @param {*} [primaryName] First full name extracted from LUIS entites, empty string if none
 * @param {*} [secondaryName] Second full name extracted from LUIS entities, empty string if none
 * @param {*} [dates] Dates extracted from LUIS entities, null if none parsed, otherwise object in format {"start": "start", "end": "end"}
 * @param {*} entities List of all LUIS entities extracted from query
 */
const getMessageFromPrediction = async (
  databaseAction,
  wantedNode,
  returnNode,
  detailNode,
  entityNode,
  primaryName,
  secondaryName,
  dates,
  entities
) => {
  let data;
  switch (databaseAction) {
    case "getNode":
      data = await getNode(dates, primaryName, wantedNode, returnNode);

      if (data === "") {
        return `${primaryName} has no data related to any ${returnNode.toLowerCase()}`;
      }
      return `The ${returnNode.toLowerCase()} data for patient ${primaryName} is: ${data}`;

    case "getVal":
      data = await getVal(
        dates,
        entities[entityNode][0][0],
        wantedNode,
        returnNode,
        detailNode,
        entityNode
      );

      if (data === "") {
        return `No patient have had encounters with ${returnNode.toLowerCase()}`;
      }
      return `This patients with this ${returnNode.toLowerCase()} are: ${data}`;

    case "getEncounterlessNode":
      data = await getEncounterlessNode(
        dates,
        primaryName,
        wantedNode,
        returnNode,
        detailNode
      );

      if (data === "") {
        return `${primaryName} has no data related to any ${returnNode.toLowerCase()}`;
      }
      return `The ${returnNode.toLowerCase()} data for patient ${primaryName} is: ${data}`;

    case "getEncounterlessVal":
      data = await getEncounterlessVal(
        dates,
        entities[entityNode][0][0],
        wantedNode,
        returnNode,
        detailNode,
        entityNode
      );

      if (data === "") {
        return `No patient have had encounters with ${returnNode.toLowerCase()}`;
      }
      return `This patients with this ${returnNode.toLowerCase()} are: ${data}`;

    case "getSame":
      data = await getSame(primaryName, secondaryName);

      if (data === "") {
        return "These patient have nothing in common";
      }
      return `The matching data for the patients is: ${data}`;

    default:
      return "Couldn't understand your question.";
  }
};

module.exports = getMessageFromPrediction;
