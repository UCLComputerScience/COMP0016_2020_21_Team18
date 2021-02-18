const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const getPrediction = require('./utils/predict');
const { getNode } = require('./utils/database');
const { getVal } = require('./utils/database');
const { getName } = require('./utils/database');
const returnNodeFromPrediction = require('./utils/node.factory');
const database = require('./utils/database');

app.use(express.static(path.join(__dirname, '../public')));

const getMessage = async (msg) => {
    const prediction = await getPrediction(msg);
    console.log(prediction);
    const { databaseAction, wantedNode, returnNode } = returnNodeFromPrediction(prediction.prediction);
    let data;
    let name;

    switch(databaseAction) {
        case 'getNode':
            data = await getNode(
                prediction.entities.DB_personName[0][0],
                wantedNode,
                returnNode
            );
            name = await getName(
                prediction.entities.DB_personName[0][0]
            );
            return "The " + returnNode.toLowerCase()+ " data for patient " + name + " is:\n" +data;
            break
        case 'getVal':
            data = await getVal(
                prediction.entities.DB_personName[0][0],
                wantedNode,
                returnNode
            );
            //The patients with this returnNode are:
            return "This patients with this "+ returnNode.toLowerCase()+ " are: \n" + data;
        default:
            return "Couldn't understand your question."
    }
}

io.on('connection', socket => {
    socket.on('chatMessage', async (msg) => {
        io.emit('message', {'message': msg, 'server': false});
        const response = await getMessage(msg);
        io.emit('message', {'message': response, 'server': true});
    });
});

const PORT = 3001 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))