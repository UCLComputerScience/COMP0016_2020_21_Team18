const neo4j = require('neo4j-driver');
const driver = neo4j.driver('bolt://51.140.127.105:7687/', neo4j.auth.basic('neo4j', 'Ok1gr18cRrXcjhm4byBw'));

const getName = async(name) =>{
    const session = driver.session();
    try{
        const result = await session.run(
        "Match (p:Patient{id:$name})return p", {name})

        return[...new Set(result.records.map(row => row['_fields'][0].properties.firstName))]

} catch (error) {
    return error;
} finally {
    await session.close()
}
}

const getNode = async (name, wantedNode, returnNode) => {
    const session = driver.session();

    try {
        const result = await session.run(
            //"MATCH (patient:Patient{id:$name})-[:HAS_ENCOUNTER]-(encounter:Encounter)-" + wantedNode + " RETURN patient,encounter," + returnNode + " LIMIT 10",
            //{ name });
            "MATCH (p:Patient{id:$name}) " +
            "MATCH (p)-[:HAS_ENCOUNTER]-(e:Encounter) " +
            "WHERE apoc.node.degree.in(e, 'NEXT') = 0 " +
            "MATCH (e)-[:NEXT*0..]->(e2) " +
            "MATCH (e2)-"+wantedNode+" " +
            "WHERE "+returnNode+".description IS NOT NULL " +
            "RETURN e2," + returnNode,{name});
        //console.log("values: " + (result.records.map(row => row['_fields'][2].properties.description)));
        //return [...new Set(result.records.map(row => row['_fields'][2].properties.description))];
        //console.log("values: " + (result.records.map(row => row['_fields'][1].properties.description)));
        var data = [...new Array(...new Array(result.records.map(row => row['_fields'][1].properties.description)),
            ...new Array(result.records.map(row => row['_fields'][0].properties.date)))]
        data = data[0].map(function (x, i) {
            return [x, data[1][i]]
        });

        data.sort(compareColumn);
        function compareColumn(a, b) {
            if (a[0] === b[0]) {
                return 0;
            }
            else {
                return (a[0] < b[0]) ? -1 : 1;
            }
        }

        var temp = String(data[0][1])
        var noLetter = temp.substring(0,10) + " | " + temp.substring(11,19)
        var ret = data[0][0] + ":\n" + noLetter;
        for(var i=1;i<data.length;i++){
            temp= String(data[i][1])
            noLetter = temp.substring(0,10) + " | " + temp.substring(11,19)
            if(data[i][0]!==data[i-1][0]){
                ret += "\n" + data[i][0]+":\n" + noLetter;
            }
            else{
                if(JSON.stringify(data[i][1])!==JSON.stringify(data[i-1][1])){
                    var temp= String(data[i][1])
                    ret+= ",\n" + noLetter;
                }
            }
        }
        return ret
            //...new Set(result.records.map(row => row['_fields'][0].properties.date))];

    } catch (error) {
        return error;
    } finally {
        await session.close()
    }
}

//new funct
const getVal = async (code, wantedNode, returnNode) => {
    const session = driver.session();

    try {
        const result = await session.run(
            "MATCH (p:Patient) " +
            "MATCH (p)-[:HAS_ENCOUNTER]-(e:Encounter) " +
            "WHERE apoc.node.degree.in(e, 'NEXT') = 0 " +
            "MATCH (e)-[:NEXT*0..]->(e2) " +
            "MATCH (e2)-"+wantedNode+" " +
            "WHERE "+returnNode+".code = '" + code + "' " +
            "RETURN p," + returnNode,{code});
        var ret = [...new Set(result.records.map(row => row['_fields'][0].properties.description))]
        return ret.join(", ")

    } catch (error) {
        return error;
    } finally {
        await session.close()
    }
}

const getSame = async (code,codeTwo) => {
    const session = driver.session();
    try {
        const result = await session.run(
            ""
        var ret = [...new Set(result.records.map(row => row['_fields'][0].properties.firstName))]
        return ret.join(", ")

    } catch (error) {
        return error;
    } finally {
        await session.close()
    }
}

module.exports = {
    getNode,
    getVal,
    getName
    //,getSame
}