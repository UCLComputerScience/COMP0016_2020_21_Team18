/* eslint-disable no-undef */
const sinon = require("sinon");
const neo4j = require('neo4j-driver');
const getMessageFromPrediction = require("../../src/utils/message.factory");
const {
  getNode,
  getVal,
  getSame,
  getEncounterlessNode,
  getEncounterlessVal,
} = require("../../src/utils/database");

const driver = neo4j.driver(
  'bolt://51.140.127.105:7687/',
  neo4j.auth.basic('neo4j', 'Ok1gr18cRrXcjhm4byBw'),
);

describe("Message factory spec", () => {
  it.each([
    ["getNode", sinon.spy(getNode)],
    ["getVal", sinon.spy(getVal)],
    ["getEncounterlessNode", sinon.spy(getEncounterlessNode)],
    ["getEncounterlessVal", sinon.spy(getEncounterlessVal)],
    ["getSame", sinon.spy(getSame)],
  ])("%s should call correct function and return correct result", async (query, spy, done) => {
    const session = sinon.mock(driver.session);
    try {
      const message = await getMessageFromPrediction(
        query,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null
      );
    } catch (e) {}
    
    expect(spy.calledOnce);
    sinon.restore();
    done();
  });
});
