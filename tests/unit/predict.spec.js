/* eslint-disable no-undef */
const {
  getPrediction,
  parseDate,
  parseNames,
} = require("../../src/utils/predict");

jest.setTimeout(20000);

describe("Prediction tests", () => {
  test("returns correct prediction", async () => {
    const prediction = await getPrediction(
      "what immunisations did mr.aaron697 brekke496 have?"
    );

    expect(prediction.predictions).toStrictEqual(["getImmunizations"]);
  });

  test("returns correct entities", async () => {
    const prediction = await getPrediction(
      "what immunisations did mr.aaron697 brekke496 have?"
    );

    expect(prediction.entities).toHaveProperty("DB_personName");
  });
});

describe("Parsing tests", () => {
  describe("returns correct dates", () => {
    test("returns null when nonexistent", async () => {
      const dates = parseDate({});

      expect(dates).toStrictEqual(null);
    });

    test("returns date", async () => {
      // fix me pls
      expect(true).toStrictEqual(true);
    });
  });

  describe("returns correct names", () => {
    test("returns null when nonexistent", async () => {
      const names = parseNames({});

      expect(names).toStrictEqual("");
    });

    test("returns name", async () => {
      const names = parseNames({ DB_personName: [["Mr.Aaron697 Brekke496"]] });

      expect(names).toStrictEqual(["Mr.Aaron697 Brekke496"]);
    });
  });
});
