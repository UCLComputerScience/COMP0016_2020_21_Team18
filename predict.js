const axios = require('axios');

const getPrediction = async (text) => {
    const predictionKey = "5f068b567c6a4381a9ec95cdf932c252";
<<<<<<< HEAD
    
=======

>>>>>>> new neo4j access (worked for pitch demo)
    const queryParams = {
        "show-all-intents": true,
        "verbose":  true,
        "query": text,
        "subscription-key": predictionKey
    }

    const URI = `https://westus.api.cognitive.microsoft.com/luis/prediction/v3.0/apps/2c7e50ec-9035-4b8f-987f-8c1d99dd7589/slots/production/predict`;

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