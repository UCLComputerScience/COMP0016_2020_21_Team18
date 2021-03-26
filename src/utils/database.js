const neo4j = require('neo4j-driver');
const driver = neo4j.driver('bolt://182.92.220.170:7687/', neo4j.auth.basic('test', 'software'));

function compareColumn(a, b) {
    if (a[0] === b[0]) {
        return 0;
    }
    else {
        return (a[0] < b[0]) ? -1 : 1;
    }
}

const getName = async(name) =>{
    const session = driver.session();
    try {
        const result = await session.run("MATCH (p:Patient{id:$name})return p", {name});

        return [...new Set(result.records.map(row => row['_fields'][0].properties.name))]
    } catch (error) {
        return error;
    } finally {
        await session.close();
    }
}

const getEncounterlessNode = async (dates, name, wantedNode, returnNode, timeFormat) => {
    const session = driver.session();

    const dateQuery = dates !== null 
        ? "AND date(left("+returnNode+timeFormat+",10))>date('"+dates['start']+"') AND date(left("+returnNode+timeFormat+",10))<date('"+dates['end']+"')"
        : "";

    try {
        const result = await session.run(
            "MATCH (p:Patient{id:$name}) " +
            "MATCH (p)-" + wantedNode  +
            dateQuery +
            "RETURN " + returnNode, { name });

        var ret = [...new Array(result.records.map(row => row['_fields'][0].properties.display))];
        return ret.join(",\n");
    } catch (error) {
        return error;
    } finally {
        await session.close()
    }
}

const getNode = async (dates, name, wantedNode, returnNode) => {
    const session = driver.session();


    try {
        var dateQuery = dates !== null 
            ? "AND date(left(e2.period_start,10))>date('" + dates['start'] + "') AND date(left(e2.period_start,10))<date('" + dates['end'] + "')"
            : "";

        const result = await session.run(
            "MATCH (p:Patient{id:$name}) " +
            "MATCH (p)-[:has_encounter]-(e:Encounter) " +
            "WHERE apoc.node.degree.in(e, 'NEXT') = 0 " +
            "MATCH (e)-[:next_encounter*0..]->(e2) " +
            "MATCH (e2)-"+wantedNode+" " +
            "WHERE "+returnNode+".display IS NOT NULL " +
            dateQuery +
            "RETURN e2," + returnNode,{name});

        var data = [...new Array(...new Array(result.records.map(row => row['_fields'][1].properties.display)),
            ...new Array(result.records.map(row => row['_fields'][0].properties.period_start)))];

        data = data[0].map(function (x, i) {
            return [x, data[1][i]]
        });

        data.sort(compareColumn);//sort

        var temp = String(data[0][1])
        var noLetter = temp.substring(0,10) + " | " + temp.substring(11,19) // date formatiing
        var ret = data[0][0] + ":\n" + noLetter;
        for(var i=1;i<data.length;i++){
            temp = String(data[i][1])
            noLetter = temp.substring(0,10) + " | " + temp.substring(11,19) //date formatting
            if(data[i][0]!==data[i-1][0]){//if new drug
                ret += "\n" + data[i][0]+":\n" + noLetter;
            }
            else{//if same drug
                if(JSON.stringify(data[i][1])!==JSON.stringify(data[i-1][1])){//if no same time/date
                    ret+= ",\n" + noLetter;
                }
            }
        }
        return ret;
    } catch (error) {
        return error;
    } finally {
        await session.close()
    }
}

const getEncounterlessVal = async (dates, code, wantedNode, returnNode, timeFormat, detailNode) => {
    const session = driver.session();

    const dateQuery = dates !== null 
        ? "AND date(left("+returnNode+timeFormat+",10))>date('"+dates['start']+"') AND date(left("+returnNode+timeFormat+",10))<date('"+dates['end']+"')"
        : "";
 
    try {
        const result = await session.run(
            "MATCH (p:Patient) " +
            "MATCH (p)-"+ wantedNode  +
            "WHERE "+returnNode+detailNode+" = '" + code + "' " + //.display not for vaccine but vaccineType REPLACE WITH GENERIC IN DEF
            dateQuery +
            "RETURN p," + returnNode,{code});

        const ret = [...new Set(result.records.map(row => row['_fields'][0].properties.name))]
        return ret.join(", ")
    } catch (error) {
        return error;
    } finally {
        await session.close()
    }
}

const getVal = async (dates, code, wantedNode, returnNode) => {
    const session = driver.session();

    const dateQuery = dates !== null 
        ? "AND date(left(e2.period_start,10))>date('" + dates['start'] + "') AND date(left(e2.period_start,10))>date('" + dates['end'] + "')"
        : "";

    try {
        const result = await session.run(
            "MATCH (p:Patient) " +
            "MATCH (p)-[:has_encounter]-(e:Encounter) " +
            "WHERE apoc.node.degree.in(e, 'next_encounter') = 0 " +
            "MATCH (e)-[:next_encounter*0..]->(e2) " +
            "MATCH (e2)-"+wantedNode+" " +
            "WHERE "+returnNode+".display = '" + code + "' " +
            dateQuery +
            "RETURN p," + returnNode,{code});

        var ret = [...new Set(result.records.map(row => row['_fields'][0].properties.name))];
        return ret.join(", ");
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
            "match (p)-[:has_encounter]-(e:Encounter)   " +
            "where apoc.node.degree.in(e, 'next_encounter') = 0   " +
            "match (e)-[:next_encounter*0..]->(e2)   " +
            "optional match (e2)-[:has_observation]->(ob:Observation)   " +
            "optional match (e2)-[:has_procedure]->(proc:Procedure)   " +
            "optional match (e2)-[:has_condition]->(c:Condition)   " +

            "match (p1:Patient { id:$otherName} )   " +
            "match (p1)-[:has_encounter]-(ea:Encounter)   " +
            "where apoc.node.degree.in(ea, 'next_encounter') = 0   " +
            "match (ea)-[:next_encounter*0..]->(eb)   " +
            "optional match (e2)-[:has_observation]->(ob1:Observation)   " +
            "optional match (e2)-[:has_procedure]->(proc1:Procedure)   " +
            "optional match (e2)-[:has_condition]->(c1:Condition)   " +

            "return distinct case when ob is not null and ob1 is not null and ob.display = ob1.display then { date:e2.date, details: ob.display}     " +
            "   else case when proc is not null and proc1 is not null and proc.display = proc1.display then { date:e2.date, details: proc.display}     " +
            "                   else case when c is not null and c1 is not null and c.display = c1.display then { date:e2.date, details: c.display}     " +
            "               end   " +
            "       end   " +
            "end as Steps ",{name,otherName});

        const sResult = await session.run(
            "match (p:Patient { id:$name} )   " +
            "optional match (p)-[:has_immunization]->(im:Immunization)   " +

            "match (p1:Patient { id:$otherName} )   " +
            "optional match (p1)-[:has_immunization]->(im1:Immunization)   " +

            "return distinct case when im is not null and im1 is not null and ob.display = ob1.display then { date:e2.date, details: im.display}     " +
            "end as Steps ",{name,otherName})

        var ret = [...new Set(result.records.map(row => row['_fields'][0])), ...new Set(sResult.records.map(row => row['_fields'][0]))];
        ret = ret.filter(row => row !== null)
        ret = [...new Set(ret.map(row => row.details))];

        return ret.join(",\n");
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
    getSame,
    getEncounterlessNode,
    getEncounterlessVal
}