const { getNode } = require('../src/utils/database');
jest.setTimeout(20000);

describe("Database tests", () => {
    test("returns correct variables", async () => {
        const data = await getNode("Cristina921","[:HAS_DRUG]-(drug:Drug)","drug");

        expect(data).toStrictEqual([
            "amLODIPine 2.5 MG Oral Tablet", 
            "Hydrochlorothiazide 25 MG Oral Tablet", 
            "Trinessa 28 Day Pack", 
            "lisinopril 10 MG Oral Tablet"
        ]);
    })
})