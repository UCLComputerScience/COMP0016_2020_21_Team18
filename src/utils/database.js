/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
/**
 * @file Handles database queries and responses within the project
 * @author Jakub Mularski, Shea Magennis, Alex Hein
 * @copyright Great Ormond Street Hospital, 2020
 */

const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
  process.env.NEO4J_HOST,
  neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD),
);

const compareColumn = (a, b) => {
  if (a[0] === b[0]) {
    return 0;
  }

  return a[0] < b[0] ? -1 : 1;
};

/**
 * Query not using Encounter node to return a result
 * @param {object} [dates] Dates extracted from LUIS entities, null if none parsed, otherwise object in format {"start": "start", "end": "end"}
 * @param {string} name First name extracted from LUIS entity (DB_personName)
 * @param {string} wantedNode Node that we want to query
 * @param {string} returnNode Node that we want to return
 * @param {string} detailNode Key of node that contains value we want to return
 * @returns {string} String containing list of descriptions of returned elements separated by commas, or "No matches found for this query" if none found
 */
const getEncounterlessNode = async (
  dates,
  name,
  wantedNode,
  returnNode,
  detailNode,
) => {
  const session = driver.session();

  const dateQuery = dates !== null
    ? `AND date(left(e2.date,10))>date('${dates.start}') AND date(left(e2.end,10))<date('${dates.end}')`
    : '';

  try {
    const result = await session.run(
      `MATCH (p:Patient{firstName:$name}) MATCH (p)-${wantedNode} ${dateQuery} RETURN ${returnNode}`,
      { name },
    );
    const ret = new Set(
        //(row) => row._fields[0].properties
      result.records.map( (row) => row._fields[0]),
    );

    return `${Array.from(ret).join(',')}\n`;
  } catch (error) {
    return 'No matches found for this query';
  } finally {
    await session.close();
  }
};

/**
 * Query returning a wanted node using Encounter node as a middle-node.
 * @param {object} [dates] Dates extracted from LUIS entities, null if none parsed, otherwise object in format {"start": "start", "end": "end"}
 * @param {string} name First name extracted from LUIS entity (DB_personName)
 * @param {string} wantedNode Node that we want to query
 * @param {string} returnNode Node that we want to return
 * @returns {string} String containing list of descriptions of returned events and dates those events happened, or "No matches found for this query" if none found
 */
const getNode = async (dates, name, wantedNode, returnNode) => {
  const session = driver.session();
  console.log(name);
  try {
    const dateQuery = dates !== null
      ? `AND date(left(e2.date,10))>date('${dates.start}') AND date(left(e2.end,10))<date('${dates.end}')`
      : '';

    const result = await session.run(
      `${
        'MATCH (p:Patient{firstName:$name}) '
        + 'MATCH (p)-[:HAS_ENCOUNTER]-(e:Encounter) '
        + "WHERE apoc.node.degree.in(e, 'NEXT') = 0 "
        + 'MATCH (e)-[:NEXT*0..]->(e2) '
        + 'MATCH (e2)-'
      }${wantedNode} `
        + `WHERE ${returnNode}.description IS NOT NULL ${dateQuery}RETURN e2,${returnNode}`,
      { name },
    );

    let data = Array.from(
      new Set([
        result.records.map((row) => row._fields[1].properties.description),
        result.records.map((row) => row._fields[0].properties.date),
      ]),
    );

    data = data[0].map((x, i) => [x, data[1][i]]);

    data.sort(compareColumn); // sort

    const unique = [];
    const uniqueDates = [];
    let ret = data.map((row) => {
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

      return '';
    });

    ret = ret.filter((row) => row !== null);

    return ret;
  } catch (error) {
    return 'No matches found for this query';
  } finally {
    await session.close();
  }
};

/**
 * Query returning a wanted value without using Encounter node.
 * @param {object} [dates] Dates extracted from LUIS entities, null if none parsed, otherwise object in format {"start": "start", "end": "end"}
 * @param {string} code Various codes obtained from LUIS entities
 * @param {string} wantedNode Node containing value that we want to query
 * @param {string} returnNode Node containing value that we want to return
 * @param {string} detailNode Key of node that contains value we want to return
 * @returns {string} Returns list of wanted elements separated by commas, or "No matches found for this query" if none found
 */
const getEncounterlessVal = async (
  dates,
  code,
  wantedNode,
  returnNode,
  detailNode,
) => {
  const session = driver.session();

  try {
    const result = await session.run(
      `MATCH (p:Patient) MATCH (p)-${wantedNode} WHERE ${returnNode}.${detailNode} = '${code}' RETURN p,${returnNode}`,
      { code },
    );
    console.log(result)
    const ret = [
      ...new Set(result.records.map((row) => row._fields[0].properties.firstName)),
    ];

    return ret.join(', ');
  } catch (error) {
    return 'No matches found for this query';
  } finally {
    await session.close();
  }
};

/**
 * Query returning description of node ("name" key of node) using Encounter node.
 * @param {object} [dates] Dates extracted from LUIS entities, null if none parsed, otherwise object in format {"start": "start", "end": "end"}
 * @param {string} code Various codes obtained from LUIS entities
 * @param {string} wantedNode Node containing value that we want to query
 * @param {string} returnNode Node containing value that we want to return
 * @returns {string} Returns list of wanted values separated by commas, or "No matches found for this query" if none found
 */
const getVal = async (dates, code, wantedNode, returnNode) => {
  const session = driver.session();

  const dateQuery = dates !== null
    ? `AND date(left(e2.date,10))>date('${dates.start}') AND date(left(e2.date,10))<date('${dates.end}')`
    : '';

  try {
    const result = await session.run(
      `${
        'MATCH (p:Patient) '
        + 'MATCH (p)-[:HAS_ENCOUNTER]-(e:Encounter) '
        + "WHERE apoc.node.degree.in(e, 'NEXT') = 0 "
        + 'MATCH (e)-[:NEXT*0..]->(e2) '
        + 'MATCH (e2)-'
      }${wantedNode} `
        + `WHERE ${returnNode}.description = '${code}' ${dateQuery}RETURN p,${returnNode}`,
    );
    console.log(result)
    const ret = [
      ...new Set(result.records.map((row) => row._fields[0].properties.firstName)),
    ];
    return ret.join(', ');
  } catch (error) {
    return 'No matches found for this query';
  } finally {
    await session.close();
  }
};

/**
 * Query returning similarities between two nodes
 * @param {object} name Name extracted from LUIS entities ("DB_personName" key)
 * @param {string} otherName Another name extracted from LUIS entities ("DB_personName" key)
 * @returns {string} String containing list of similarities between two patients, "No matches found for this query" if none found.
 */
const getSame = async (name, otherName, detailNode) => {
  const session = driver.session();
  try {
    const result = await session.run(
      'match (p:Patient { firstName:$name} )   '
        + 'match (p)-[:HAS_ENCOUNTER]-(e:Encounter)   '
        + "where apoc.node.degree.in(e, 'NEXT') = 0   "
        + 'match (e)-[:NEXT*0..]->(e2)   '
        + 'match (e2)-[r]-(s)  '

        + 'match (p1:Patient { firstName:$otherName} )   '
        + 'match (p1)-[:HAS_ENCOUNTER]-(ea:Encounter)   '
        + "where apoc.node.degree.in(ea, 'NEXT') = 0   "
        + 'match (ea)-[:NEXT*0..]->(eb)   '
        + 'match (eb)-[a]-(b) '
        + 'where b.description = s.description '
        + 'return distinct { date:e2.date, details: b.description} ',
      { name, otherName },
    );

    const sResult = await session.run(//change this to general case
      'match (p:Patient { firstName:$name} )   '
        + 'match (p)-[r]-(s)  '
        + 'match (p1:Patient { firstName:$otherName} )   '
        + 'match (p1)-[a]-(b)  '
        + 'WHERE s.'+detailNode+' = b.'+detailNode
        + ' return distinct { det:p.firstName, details: b.'+detailNode +'}',
      { name, otherName },
    );

    let ret = [
      ...new Set(result.records.map((row) => row._fields[0])),
      ...new Set(sResult.records.map((row) => row._fields[0])),
    ];

    ret = ret.filter((row) => row !== null);
    ret = [...new Set(ret.map((row) => row.details))];

    return ret.join(',\n');
  } catch (error) {
    return 'No matches found for this query';
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
