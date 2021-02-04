const { getNode } = require('../src/utils/database');
const { Neo4jError } = require('neo4j-driver');
jest.setTimeout(20000);

describe("Database tests", () => {
    test("returns correct variables", async () => {
        const data = await getNode("Cristina921","[:HAS_DRUG]-(drug:Drug)","drug");
        
        //fix
        expect(data).toStrictEqual([]);
    })

    test("returns error for wrong command", async () => {
        //finish
        //expect(getNode("Cristina921", "test", "test")).toThrow(Neo4jError)
    })
})