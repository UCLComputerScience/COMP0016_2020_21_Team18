const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const { getPrediction, parseDate } = require('./utils/predict');
const { getNode } = require('./utils/database');
const returnNodeFromPrediction = require('./utils/node.factory');
const database = require('./utils/database');

app.use(express.static(path.join(__dirname, '../public')));

const getMessage = async (msg) => {
    const prediction = await getPrediction(msg);
    const results = [];
    for (const predictionValue of prediction.predictions) {
        const { databaseAction, wantedNode, returnNode } = returnNodeFromPrediction(predictionValue);
        console.log(predictionValue, databaseAction, wantedNode, returnNode)
        let data;
        switch(databaseAction) {
            case 'getNode':
                data = await getNode(
                    prediction.entities.DB_personName[0][0],
                    "datetimeV2" in prediction.entities ? parseDate(prediction.entities.datetimeV2) : null,
                    wantedNode,
                    returnNode
                );
                results.push("This patient's relevant data is: \n" + data.join(", "));
                break;
            default:
                results.push("Couldn't understand your question.");
                break;
        }
    };
    console.log(results);
    return results;
}

io.on('connection', socket => {
    socket.on('chatMessage', async (msg) => {
        io.emit('message', {'message': msg, 'server': false});
        const responses = await getMessage(msg);
        responses.forEach(response => {
            console.log(response);
            io.emit('message', {'message': response, 'server': true});
        })
    });
});

const PORT = 3001 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))