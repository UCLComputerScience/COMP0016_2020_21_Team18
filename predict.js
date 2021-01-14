const axios = require('axios');

const getPrediction = async (text) => {
    const predictionKey = "83edc74752354c77890f0ddbb9d36631";
    
    const queryParams = {
        "show-all-intents": true,
        "verbose":  true,
        "query": text,
        "subscription-key": predictionKey
    }

    const URI = `https://westeurope.api.cognitive.microsoft.com/luis/prediction/v3.0/apps/5fd996bf-0bfa-42e5-b7cc-bcc343592f1b/slots/production/predict`;

    const response = await axios.get(URI, {
        params: queryParams,
    });
    const data = response.data;

    return { 
        "prediction": data.prediction.topIntent,
        "entities": data.prediction.entities
    };
}

module.exports = getPrediction;