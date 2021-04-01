/* eslint-disable no-undef */
const sinon = require("sinon");
const getMessageFromPrediction = require("../../src/utils/message.factory");
const {
  getNode,
  getVal,
  getSame,
  getEncounterlessNode,
  getEncounterlessVal,
} = require("../../src/utils/database");

describe("Message factory spec", () => {
  it.each([
    ["getNode", sinon.spy(getNode)],
    ["getVal", sinon.spy(getVal)],
    ["getEncounterlessNode", sinon.spy(getEncounterlessNode)],
    ["getEncounterlessVal", sinon.spy(getEncounterlessVal)],
    ["getSame", sinon.spy(getSame)],
  ])("%s should call correct function", async (query, spy, done) => {
    try {
      await getMessageFromPrediction(
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
    done();
  });
});
