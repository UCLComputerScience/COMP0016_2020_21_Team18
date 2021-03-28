const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const returnNodeFromPrediction = require('./utils/node.factory');
const { getPrediction, parseDate } = require("./utils/predict");
const { getNode, getVal, getSame, getEncounterlessNode, getEncounterlessVal } = require("./utils/database");

app.use(express.static(path.join(__dirname, "../public")));

const getMessage = async (msg) => {
  const prediction = await getPrediction(msg);
  const results = [];
  for (const predictionValue of prediction.predictions) {
    const { databaseAction, wantedNode, returnNode, timeNode, detailNode, entityNode } = returnNodeFromPrediction(
      predictionValue
    );

    console.log(databaseAction, wantedNode, returnNode, timeNode, detailNode, entityNode);

    let data;
    const name = 'DB_personName' in prediction.entities ? prediction.entities.DB_personName[0][0] : '';
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
        } else {
          results.push("The " + returnNode.toLowerCase() + " data for patient " + name + " is: " + data);
        }

        break;

      case "getVal":
        data = await getVal(
          "datetimeV2" in prediction.entities ? parseDate(prediction.entities.datetimeV2) : null,
          prediction.entities[entityNode][0][0],
          wantedNode,
          returnNode,
          timeNode,
          detailNode,
          entityNode
        );
    
        if (data === "") {
          results.push("No patient have had encounters with " + returnNode.toLowerCase());
        } else {
          results.push("This patients with this " + returnNode.toLowerCase() + " are: " + data);
        }
    
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
          results.push(name + " has no data related to any " + returnNode.toLowerCase());
        } else {
          results.push("The " + returnNode.toLowerCase() + " data for patient " + name + " is: " + data);
        }

        break;
    
      case "getEncounterlessVal":
        data = await getEncounterlessVal(
          "datetimeV2" in prediction.entities ? parseDate(prediction.entities.datetimeV2) : null,
          prediction.entities[entityNode][0][0],
          wantedNode,
          returnNode,
          timeNode,
          detailNode,
          entityNode
        );

        if (data === "") {
          results.push("No patient have had encounters with " + returnNode.toLowerCase());
        } else {
          results.push("This patients with this " + returnNode.toLowerCase() + " are: " + data);
        }

        break;

      case "getSame":
        data = await getSame(
          prediction.entities.DB_personName[0][0],
          prediction.entities.DB_personName[1][0]
        );

        if (data === "") {
          results.push("These patient have nothing in common");
        } else {
          results.push("The matching data for the patients is: " + data);
        }

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
