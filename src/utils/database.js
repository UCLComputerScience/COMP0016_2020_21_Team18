/* eslint-disable no-underscore-dangle */

const neo4j = require("neo4j-driver");

const driver = neo4j.driver(
  "bolt://182.92.220.170:7687/",
  neo4j.auth.basic("test", "software")
);

const compareColumn = (a, b) => {
  if (a[0] === b[0]) {
    return 0;
  }

  return a[0] < b[0] ? -1 : 1;
};

const getEncounterlessNode = async (
  dates,
  name,
  wantedNode,
  returnNode,
  timeFormat
) => {
  const session = driver.session();

  const dateQuery =
    dates !== null
      ? `AND date(left(${returnNode}${timeFormat},10))>date('${dates.start}') AND date(left(${returnNode}${timeFormat},10))<date('${dates.end}')`
      : "";

  try {
    const result = await session.run(
      `${
        "MATCH (p:Patient{name:$name}) " + "MATCH (p)-"
      }${wantedNode}${dateQuery}RETURN ${returnNode}`,
      { name }
    );

    const ret = new Set(
      result.records.map((row) => row._fields[0].properties.vaccineType)
    );
    return `${Array.from(ret).join(",")}\n`;
  } catch (error) {
    console.log(error);
    return "No matches found for this query";
  } finally {
    await session.close();
  }
};

const getNode = async (dates, name, wantedNode, returnNode) => {
  const session = driver.session();

  try {
    const dateQuery =
      dates !== null
        ? `AND date(left(e2.period_start,10))>date('${dates.start}') AND date(left(e2.period_start,10))<date('${dates.end}')`
        : "";

    const result = await session.run(
      `${
        "MATCH (p:Patient{name:$name}) " +
        "MATCH (p)-[:has_encounter]-(e:Encounter) " +
        "WHERE apoc.node.degree.in(e, 'next_encounter') = 0 " +
        "MATCH (e)-[:next_encounter*0..]->(e2) " +
        "MATCH (e2)-"
      }${wantedNode} ` +
        `WHERE ${returnNode}.display IS NOT NULL ${dateQuery}RETURN e2,${returnNode}`,
      { name }
    );

    let data = Array.from(
      new Set([
        result.records.map((row) => row._fields[1].properties.display),
        result.records.map((row) => row._fields[0].properties.period_start),
      ])
    );

    data = data[0].map((x, i) => [x, data[1][i]]);

    data.sort(compareColumn); // sort

    const unique = [];
    const uniqueDates = [];
    const ret = data.map((row) => {
      const temp = String(row[1]);
      const noLetter = `${temp.substring(0, 10)} | ${temp.substring(11, 19)}`; // date formatting

      if (unique.includes(row[0])) {
        if (!uniqueDates.includes(temp)) {
          // if no same time/date
          uniqueDates.push(temp);
          return `\n${noLetter}`;
        }
      } else {
        unique.push(row[0]);
        return `\n${row[0]}:\n${noLetter}`;
      }

      return null;
    });

    return ret;
  } catch (error) {
    console.log(error);
    return "No matches found for this query";
  } finally {
    await session.close();
  }
};

const getEncounterlessVal = async (
  dates,
  code,
  wantedNode,
  returnNode,
  timeFormat,
  detailNode
) => {
  const session = driver.session();

  const dateQuery =
    dates !== null
      ? `AND date(left(${returnNode}${timeFormat},10))>date('${dates.start}') AND date(left(${returnNode}${timeFormat},10))<date('${dates.end}')`
      : "";

  try {
    const result = await session.run(
      `${
        "MATCH (p:Patient) " + "MATCH (p)-"
      }${wantedNode}WHERE ${returnNode}.${detailNode} = '${code}' ${
        // .display not for vaccine but vaccineType REPLACE WITH GENERIC IN DEF
        dateQuery
      }RETURN p,${returnNode}`,
      { code }
    );

    const ret = [
      ...new Set(result.records.map((row) => row._fields[0].properties.name)),
    ];
    return ret.join(", ");
  } catch (error) {
    console.log(error);
    return "No matches found for this query";
  } finally {
    await session.close();
  }
};

const getVal = async (dates, code, wantedNode, returnNode) => {
  const session = driver.session();

  const dateQuery =
    dates !== null
      ? `AND date(left(e2.period_start,10))>date('${dates.start}') AND date(left(e2.period_start,10))<date('${dates.end}')`
      : "";

  try {
    const result = await session.run(
      `${
        "MATCH (p:Patient) " +
        "MATCH (p)-[:has_encounter]-(e:Encounter) " +
        "WHERE apoc.node.degree.in(e, 'next_encounter') = 0 " +
        "MATCH (e)-[:next_encounter*0..]->(e2) " +
        "MATCH (e2)-"
      }${wantedNode} ` +
        `WHERE ${returnNode}.display = '${code}' ${dateQuery}RETURN p,${returnNode}`
    );

    const ret = [
      ...new Set(result.records.map((row) => row._fields[0].properties.name)),
    ];
    return ret.join(", ");
  } catch (error) {
    console.log(error);
    return "No matches found for this query";
  } finally {
    await session.close();
  }
};

const getSame = async (name, otherName) => {
  const session = driver.session();
  try {
    const result = await session.run(
      "match (p:Patient { name:$name} )   " +
        "match (p)-[:has_encounter]-(e:Encounter)   " +
        "where apoc.node.degree.in(e, 'next_encounter') = 0   " +
        "match (e)-[:next_encounter*0..]->(e2)   " +
        "optional match (e2)-[:has_observation]->(ob:Observation)   " +
        "optional match (e2)-[:has_procedure]->(proc:Procedure)   " +
        "optional match (e2)-[:has_condition]->(c:Condition)   " +
        "match (p1:Patient { name:$otherName} )   " +
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
        "end as Steps ",
      { name, otherName }
    );

    const sResult = await session.run(
      "match (p:Patient { name:$name} )   " +
        "optional match (p)-[:has_immunization]->(im:Immunization)   " +
        "match (p1:Patient { name:$otherName} )   " +
        "optional match (p1)-[:has_immunization]->(im1:Immunization)   " +
        "return distinct case when im is not null and im1 is not null and ob.display = ob1.display then { date:e2.date, details: im.display}     " +
        "end as Steps ",
      { name, otherName }
    );

    let ret = [
      ...new Set(result.records.map((row) => row._fields[0])),
      ...new Set(sResult.records.map((row) => row._fields[0])),
    ];
    ret = ret.filter((row) => row !== null);
    ret = [...new Set(ret.map((row) => row.details))];

    return ret.join(",\n");
  } catch (error) {
    console.log(error);
    return "No matches found for this query";
  } finally {
    await session.close();
  }
};

module.exports = {
  getNode,
  getVal,
  getSame,
  getEncounterlessNode,
  getEncounterlessVal,
};
