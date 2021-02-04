const neo4j = require('neo4j-driver');
const driver = neo4j.driver('bolt://51.140.127.105:7687/', neo4j.auth.basic('neo4j', 'Ok1gr18cRrXcjhm4byBw'));

const getNode = async (name, wantedNode, returnNode) => {
    const session = driver.session();

    try {
        const result = await session.run(
            "MATCH (patient:Patient{id:$name})-[:HAS_ENCOUNTER]-(encounter:Encounter)-" + wantedNode + " RETURN patient,encounter," + returnNode + " LIMIT 10",
            { name }
        );

        return [...new Set(result.records.map(row => row['_fields'][2].properties.description))];
    } catch (error) {
        return error;
    } finally {
        await session.close()
    }
}

module.exports = {
    getNode
}