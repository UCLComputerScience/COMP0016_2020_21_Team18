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
const { getSame } = require('./utils/database');
const { getEncounterlessNode } = require('./utils/database');
const { getEncounterlessVal } = require('./utils/database');
const returnNodeFromPrediction = require('./utils/node.factory');
const database = require('./utils/database');

app.use(express.static(path.join(__dirname, '../public')));

const getMessage = async (msg) => {
    const prediction = await getPrediction(msg);
    console.log(prediction);
    const { databaseAction, wantedNode, returnNode, timeNode } = returnNodeFromPrediction(prediction.prediction);
    let data;
    let name;
    console.log(databaseAction);
    switch(databaseAction) {
        case 'getNode':
            data = await getNode(
                prediction.entities.datetimeV2[0]["values"][0]["start"],//ADD ERROR CHECKING - SET TO UNDEFINED/NULL/ETC
                prediction.entities.DB_personName[0][0],
                wantedNode,
                returnNode
            );
            name = await getName(
                prediction.entities.DB_personName[0][0]
            );
            if (data===""){return name + " has no data related to any "+returnNode.toLowerCase();}
            return "The " + returnNode.toLowerCase()+ " data for patient " + name + " is:\n" +data;
            break

        case 'getEncounterlessNode':
            data = await getEncounterlessNode(
                prediction.entities.datetimeV2[0]["values"][0]["start"],
                prediction.entities.DB_personName[0][0],
                wantedNode,
                returnNode,
                timeNode
            );
            //The patients with this returnNode are:
            if (data===""){return name + " has no data related to any "+returnNode.toLowerCase();}
            return "The " + returnNode.toLowerCase()+ " data for patient " + name + " is:\n" +data;
            break
        /*
        case 'getVal':
            data = await getVal(
                prediction.entities.datetimeV2[0]["values"][0]["start"],
                prediction.entities.DB_drugDescription[0][0],//for drug only, change general in luis?
                wantedNode,
                returnNode
            );
            //The patients with this returnNode are:
            if (data===""){return "No patient have had encounters with "+returnNode.toLowerCase();}
            return "This patients with this "+ returnNode.toLowerCase()+ " are: \n" + data;
            break*/

        case 'getEncounterlessVal':
            data = await getEncounterlessVal(
                prediction.entities.datetimeV2[0]["values"][0]["start"],
                prediction.entities.DB_drugDescription[0][0],//for drug only, change general in luis?
                wantedNode,
                returnNode,
                timeNode
            );
            //The patients with this returnNode are:
            if (data===""){return "No patient have had encounters with "+returnNode.toLowerCase();}
            return "This patients with this "+ returnNode.toLowerCase()+ " are: \n" + data;
            break

        case 'getSame':
            //console.log(prediction.entities.DB_personName[0][0])
            //console.log(prediction.entities.DB_personName[1][0])
            data = await getSame(
                prediction.entities.DB_personName[0][0],
                prediction.entities.DB_personName[1][0]
            );
            if (data===""){return "These patient have nothing in common";}
            return "The matching data for the patients is:\n" +data;
            break
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