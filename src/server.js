const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const { getPrediction, parseDate } = require("./utils/predict");
const { getNode } = require("./utils/database");
const { getName } = require("./utils/database");
const { getSame } = require("./utils/database");
const { getEncounterlessNode } = require("./utils/database");
const { getEncounterlessVal } = require("./utils/database");
const returnNodeFromPrediction = require("./utils/node.factory");
const database = require("./utils/database");

app.use(express.static(path.join(__dirname, "../public")));

const getMessage = async (msg) => {
  const prediction = await getPrediction(msg);
  const results = [];
  for (const predictionValue of prediction.predictions) {
    const { databaseAction, wantedNode, returnNode, timeNode, detailNode } = returnNodeFromPrediction(
      predictionValue
    );

    console.log(predictionValue, databaseAction, wantedNode, returnNode);

    let data, name;
    switch (databaseAction) {
      case "getNode":
        data = await getNode(
          "datetimeV2" in prediction.entities ? parseDate(prediction.entities.datetimeV2) : null,
          prediction.entities.DB_personName[0][0],
          wantedNode,
          returnNode
        );

        //name = await getName(prediction.entities.DB_personName[0][0]);
        if (data === "") {
          results.push(name + " has no data related to any " + returnNode.toLowerCase());
        }

        results.push("The " + returnNode.toLowerCase() + " data for patient " + prediction.entities.DB_personName[0][0] + " is:\n" + data);
        break;

      case "getEncounterlessNode":
        data = await getEncounterlessNode(
          "datetimeV2" in prediction.entities ? parseDate(prediction.entities.datetimeV2) : null,
          prediction.entities.DB_personName[0][0],
          wantedNode,
          returnNode,
          timeNode
        );

        if (data === "") {
          results.push(prediction.entities.DB_personName[0][0] + " has no data related to any " + returnNode.toLowerCase());
        }

        results.push("The " + returnNode.toLowerCase() + " data for patient " + name + " is:\n" + data);
        break;
      case "getEncounterlessVal":
        data = await getEncounterlessVal(
          "datetimeV2" in prediction.entities ? parseDate(prediction.entities.datetimeV2) : null,
          prediction.entities.DB_drugDescription[0][0],
          wantedNode,
          returnNode,
          timeNode,
          detailNode
        );

        if (data === "") {
          results.push("No patient have had encounters with " + returnNode.toLowerCase());
        }

        results.push("This patients with this " + returnNode.toLowerCase() + " are: \n" + data);
        break;
      case "getSame":
        data = await getSame(
          prediction.entities.DB_personName[0][0],
          prediction.entities.DB_personName[1][0]
        );

        if (data === "") {
          results.push("These patient have nothing in common");
        }

        results.push("The matching data for the patients is:\n" + data);
        break;
      default:
        results.push("Couldn't understand your question.");
        break;
    }
  }

  console.log(results);
  return results;
};

io.on("connection", (socket) => {
  socket.on("chatMessage", async (msg) => {
    io.emit("message", { message: msg, server: false });
    const responses = await getMessage(msg);
    responses.forEach((response) => {
      console.log(response);
      io.emit("message", { message: response, server: true });
    });
  });
});

const PORT = 3001 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
