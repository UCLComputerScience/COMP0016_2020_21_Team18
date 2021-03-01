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

const getSame = async (name, otherName) => {
    const session = driver.session();
    try {
        const result = await session.run(
            "match (p:Patient { id:$name} )   " +
            "match (p)-[:HAS_ENCOUNTER]-(e:Encounter)   " +
            "where apoc.node.degree.in(e, 'NEXT') = 0   " +
            "match (e)-[:NEXT*0..]->(e2)   " +
            "optional match (e2)-[:HAS_CARE_PLAN]->(cp:CarePlan)   " +
            "optional match (e2)-[:HAS_PROCEDURE]->(proc:Procedure)   " +
            "optional match (e2)-[:HAS_DRUG]->(d:Drug)   " +
            "optional match (e2)-[:HAS_CONDITION]->(c:Condition)   " +
            "optional match (e2)-[:HAS_ALLERGY]->(a:Allergy)" +

            "match (p1:Patient { id:$otherName} )   " +
            "match (p1)-[:HAS_ENCOUNTER]-(ea:Encounter)   " +
            "where apoc.node.degree.in(ea, 'NEXT') = 0   " +
            "match (ea)-[:NEXT*0..]->(eb)   " +
            "optional match (eb)-[:HAS_CARE_PLAN]->(cp1:CarePlan)   " +
            "optional match (eb)-[:HAS_PROCEDURE]->(proc1:Procedure)   " +
            "optional match (eb)-[:HAS_DRUG]->(d1:Drug)   " +
            "optional match (eb)-[:HAS_CONDITION]->(c1:Condition)   " +
            "optional match (eb)-[:HAS_ALLERGY]->(a1:Allergy)   " +

            "return distinct case when cp is not null and cp1 is not null and cp.description = cp1.description then { date:e2.date, details: cp.description}     " +
            "   else case when proc is not null and proc1 is not null and proc.description = proc1.description then { date:e2.date, details: proc.description}     " +
            "              else case when d is not null and d1 is not null and d.description = d1.description then {date:e2.date, details:d.description}     " +
            "                   else case when c is not null and c1 is not null and c.description = c1.description then { date:e2.date, details: c.description}     " +
            "                         else case when a is not null and a1 is not null and a.description = a1.description then { date:e2.date, details: a.description}    " +
            "                   end   " +
            "               end   " +
            "           end   " +
            "       end   " +
            "end as Steps ",{name,otherName})
        //var ret = [...new Set(result.records.map(row => row['_fields'][0].properties.details))]
        //ret.filter(n => n)
        var ret = [...new Set(result.records.map(row => row['_fields'][0]))]
        ret = ret.filter(row => row !== null)
        //console.log(ret)
        ret = [...new Set(ret.map(row => row.details))]
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
    getName,
    getSame
}