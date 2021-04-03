/**
 * @file Pipeline responsible for recognizing user intent and forming messages (single or multiple, multiple user intents are also supported)
 * @author Jakub Mularski, Shea Magennis, Alex Hein
 * @copyright Great Ormond Street Hospital, 2020
 */

const returnNodeFromPrediction = require("./node.factory");
const getMessageFromPrediction = require("./message.factory");
const { getPrediction, parseDate, parseNames } = require("./predict");

/**
 * Pipeline function receiving user message as input and returning list of responses to user queries.
 * @param {string} msg Message that user sent
 * @returns {string[]} List of responses to user queries
 */
const getMessages = async (msg) => {
  const prediction = await getPrediction(msg);
  const results = [];
  prediction.predictions.forEach(async (predictionValue) => {
    const {
      databaseAction,
      wantedNode,
      returnNode,
      detailNode,
      entityNode,
    } = returnNodeFromPrediction(predictionValue);

    const names = parseNames(prediction.entities);
    const dates = parseDate(prediction.entities);
    results.push(
      await getMessageFromPrediction(
        databaseAction,
        wantedNode,
        returnNode,
        detailNode,
        entityNode,
        names.length > 0 ? names[0] : "",
        names.length > 1 ? names[1] : "",
        dates,
        prediction.entities
      )
    );
  });

  return results;
};

module.exports = getMessages;
