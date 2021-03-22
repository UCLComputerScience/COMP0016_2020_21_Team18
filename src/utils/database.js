const util = require('util');
const neo4j = require('neo4j-driver');
const driver = neo4j.driver('bolt://51.140.127.105:7687/', neo4j.auth.basic('neo4j', 'Ok1gr18cRrXcjhm4byBw'));

const getNode = async (name, dates, wantedNode, returnNode) => {
    const session = driver.session();
    if (dates) {
        console.log(dates);
    }
    try {
        const result = await session.run(
            "MATCH (p:Patient{id:$name}) " +
            "MATCH (p)-[:HAS_ENCOUNTER]-(e:Encounter) " +
            "WHERE apoc.node.degree.in(e, 'NEXT') = 0 " +
            "MATCH (e)-[:NEXT*0..]->(e2) " +
            "MATCH (e2)-"+wantedNode+" " +
            "WHERE "+returnNode+".description IS NOT NULL " +
            "RETURN e2," + returnNode,{name});

        return [...new Set(result.records.map(row => row['_fields'][1].properties.description))];

    } catch (error) {
        return error;
    } finally {
        await session.close()
    }
}

module.exports = {
    getNode
}