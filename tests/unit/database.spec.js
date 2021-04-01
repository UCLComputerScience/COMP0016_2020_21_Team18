const { getNode } = require("../../src/utils/database");
jest.setTimeout(20000);

describe("Database tests", () => {
    test("returns correct response for getDrugs", async () => {
        const prediction = await getNode("Cristina921","[:HAS_DRUG]-(drug:Drug)","drug");

        expect(prediction.prediction).toBe([]);
    });
})