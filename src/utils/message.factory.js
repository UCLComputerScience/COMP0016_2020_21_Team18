const {
  getNode,
  getVal,
  getSame,
  getEncounterlessNode,
  getEncounterlessVal,
} = require("./database");

const getMessageFromPrediction = async (
  databaseAction,
  wantedNode,
  returnNode,
  timeNode,
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
        timeNode,
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
        timeNode
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
        timeNode,
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
