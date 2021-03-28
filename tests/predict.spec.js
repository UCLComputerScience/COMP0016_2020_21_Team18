const { getPrediction } = require("../src/utils/predict");
jest.setTimeout(20000);

describe("Prediction tests", () => {
    test("returns correct prediction", async () => {
        const prediction = await getPrediction("what immunisations did mr.aaron697 brekke496 have?");
        console.log(prediction);
        expect(prediction.predictions).toStrictEqual(["getImmunizations"]);
    });

    test("returns correct entities", async () => {
        const prediction = await getPrediction("what immunisations did mr.aaron697 brekke496 have?");

        expect(prediction.entities).toHaveProperty("DB_personName");
    });
})