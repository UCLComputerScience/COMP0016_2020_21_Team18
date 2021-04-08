/**
 * @file Contains all functions related to LUIS - getting predictions, parsing names and dates
 * @author Jakub Mularski, Shea Magennis, Alex Hein
 * @copyright Great Ormond Street Hospital, 2020
 */

const axios = require('axios');

/**
 * Gets predictions based on user queries
 * @param {string} text Message inputted by user
 * @returns {object} Returns object with two keys: prediction - user intent predicted by LUIS, entities - all entities found in user query
 */
const getPrediction = async (text) => {
  const predictionKey = process.env.LUIS_KEY;
  const queryParams = {
    'show-all-intents': true,
    verbose: true,
    query: text,
    'subscription-key': predictionKey,
  };

  const URI = process.env.LUIS_ENDPOINT;

  const response = await axios.get(URI, {
    params: queryParams,
  });
  const { data } = response;

  const multiplePredictions = Object.entries(data.prediction.intents)
    .filter((prediction) => prediction[1].score > 0.15)
    .map((prediction) => prediction[0]);

  return {
    predictions: multiplePredictions,
    entities: data.prediction.entities,
  };
};

/**
 * Parses user query entities to extract dates.
 * @param {string} entities Entities found in user query
 * @param {object} [dates] Dates extracted from LUIS entities, null if none parsed, otherwise object in format {"start": "start", "end": "end"}
 */
const parseDate = (entities) => {
  if ('datetimeV2' in entities) {
    const datesParsed = entities.datetimeV2.values();
    for (const date of datesParsed) {
      return date.values[0].resolution[0];
    }
  }

  return null;
};

/**
 * Parses user query entities to extract names.
 * @param {string} entities Entities found in user query
 * @returns {string[]} Names extracted from LUIS entities, empty string if none parsed
 */
const parseNames = (entities) => ('DB_personName' in entities
  ? entities.DB_personName.map((name) => name[0])
  : '');

module.exports = {
  getPrediction,
  parseDate,
  parseNames,
};
