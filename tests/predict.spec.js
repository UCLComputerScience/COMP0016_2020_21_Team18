const getPrediction = require("../src/utils/predict");
jest.setTimeout(20000);

describe("Prediction tests", () => {
    test("returns correct prediction", async () => {
        const prediction = await getPrediction("What drugs did Christina921 take?");

        expect(prediction.prediction).toBe("getDrugs");
    });

    test("returns correct entities", async () => {
        const prediction = await getPrediction("What drugs did Cristina921 take?");

        expect(prediction.entities).toHaveProperty("DB_personName");
    });
})