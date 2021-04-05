const sinon = require('sinon');
const neo4j = require('neo4j-driver');
const { getNode } = require("../../src/utils/database");
const { mock } = require('sinon');
jest.setTimeout(20000);

const driver = neo4j.driver(
    'bolt://51.140.127.105:7687/',
    neo4j.auth.basic('neo4j', 'Ok1gr18cRrXcjhm4byBw'),
);

describe("Database tests", () => {

    test("calls correct function with right arguments and returns correct value for getNode", async () => {
        const expectedArgs = [
            "MATCH (p:Patient{firstName:$name})"
            + "MATCH (p)-[:HAS_ENCOUNTER]-(e:Encounter)"
            + "WHERE apoc.node.degree.in(e, 'NEXT') = 0"
            + "MATCH (e)-[:NEXT*0..]->(e2)"
            + "MATCH (e2)-"
            + "[:HAS_DRUG]-(drug:Drug)"
            + "WHERE drug.description IS NOT NULL RETURN e2,drug",
            { "name": "Cristina921" }
        ];
        const expectedResults = [];
        const session = sinon.mock(driver.session());
        session.expects('run').once().withArgs(...expectedArgs).resolves(expectedResults);

        const result = await getNode("Cristina921","[:HAS_DRUG]-(drug:Drug)","drug");

        expect(result).toBe("No matches found for that query");
        mock.verify();
        sinon.restore();
    });
})