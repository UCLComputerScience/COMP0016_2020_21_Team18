const axios = require("axios");

const getPrediction = async (text) => {
  const predictionKey = "5f068b567c6a4381a9ec95cdf932c252";
  const queryParams = {
    "show-all-intents": true,
    verbose: true,
    query: text,
    "subscription-key": predictionKey,
  };

  const URI =
    "https://westus.api.cognitive.microsoft.com/luis/prediction/v3.0/apps/2c7e50ec-9035-4b8f-987f-8c1d99dd7589/slots/production/predict";

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

const parseDate = (entities) => {
  if ("datetimeV2" in entities) {
    const datesParsed = entities.datetimeV2.values();
    for (const date of datesParsed) {
      return date.values[0].resolution[0];
    }
  }

  return null;
};

const parseNames = (entities) =>
  "DB_personName" in entities
    ? entities.DB_personName.map((name) => name[0])
    : "";

module.exports = {
  getPrediction,
  parseDate,
  parseNames,
};
