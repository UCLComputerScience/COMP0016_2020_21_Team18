/* eslint-disable no-undef */
const getMessages = require("../../src/utils/messages");

describe("Message function spec", () => {
  it.each([
    ["What drugs does Cristina921 take?", "The drug data for patient Cristina921 is:·
    0.4 ML Enoxaparin sodium 100 MG/ML Prefilled Syringe:
    2020-03-12 | 08:07:41,
    Acetaminophen 500 MG Oral Tablet:
    2020-03-12 | 08:07:41,
    Errin 28 Day Pack:
    2015-06-05 | 06:38:41,
    2014-06-10 | 06:38:41,
    Etonogestrel 68 MG Drug Implant:
    2018-02-24 | 06:38:41,
    2017-02-22 | 06:38:41,
    Hydrochlorothiazide 25 MG Oral Tablet:
    2019-11-20 | 06:38:41,
    2018-11-14 | 06:38:41,
    2016-04-13 | 06:38:41,
    2017-11-08 | 06:38:41,
    2010-09-29 | 06:38:41,
    2014-10-22 | 06:38:41,
    2011-10-05 | 06:38:41,
    2016-11-02 | 06:38:41,
    2019-11-20 | 06:38:41,
    2015-10-28 | 06:38:41,
    2012-10-10 | 06:38:41,
    2009-10-23 | 06:38:41,
    2015-04-29 | 06:38:41,
    2013-10-16 | 06:38:41,
    2015-04-24 | 06:38:41,
    Jolivette 28 Day Pack:
    2011-06-26 | 06:38:41,
    2012-06-20 | 06:38:41,
    Loratadine 5 MG Chewable Tablet:
    1992-06-19 | 06:38:41,
    NDA020800 0.3 ML Epinephrine 1 MG/ML Auto-Injector:
    1992-06-19 | 06:38:41,
    NuvaRing 0.12/0.015 MG per 24HR 21 Day Vaginal Ring:
    2020-02-14 | 06:38:41,
    Penicillin V Potassium 500 MG Oral Tablet:
    2015-04-24 | 06:38:41,
    2015-05-07 | 06:38:41,
    Seasonique 91 Day Pack:
    2010-07-01 | 06:38:41,
    2011-06-26 | 06:38:41,
    Trinessa 28 Day Pack:
    2014-06-10 | 06:38:41,
    2013-06-15 | 06:38:41,
    amLODIPine 2.5 MG Oral Tablet:
    2015-04-24 | 06:38:41,
    2009-12-22 | 06:38:41,
    lisinopril 10 MG Oral Tablet:
    2015-04-29 | 06:38:41,
    2009-09-23 | 06:38:41"],
  ])("%s should return correct result", async (query, result, done) => {
    const messageResult = await getMessages(query);
    expect(messageResult).toEqual(result);
    done();
  });
});
