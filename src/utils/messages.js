const returnNodeFromPrediction = require("./node.factory");
const getMessageFromPrediction = require("./message.factory");
const { getPrediction, parseDate, parseNames } = require("./predict");

const getMessages = async (msg) => {
  const prediction = await getPrediction(msg);
  const results = [];
  prediction.predictions.forEach(async (predictionValue) => {
    const {
      databaseAction,
      wantedNode,
      returnNode,
      timeNode,
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
        timeNode,
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
