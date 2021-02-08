const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const getPrediction = require('./utils/predict');
const { getNode } = require('./utils/database');
const returnNodeFromPrediction = require('./utils/node.factory');
const database = require('./utils/database');

app.use(express.static(path.join(__dirname, '../public')));

const getMessage = async (msg) => {
    const prediction = await getPrediction(msg);
    console.log(prediction);
    const { databaseAction, wantedNode, returnNode } = returnNodeFromPrediction(prediction.prediction);
    let data;
    switch(databaseAction) {
        case 'getNode':
            data = await getNode(
                prediction.entities.DB_personName[0][0],
                wantedNode,
                returnNode
            );

            data = data[0].map(function (x, i) {
                return [x, data[1][i]]
            });

            data.sort(compareColumn);
            function compareColumn(a, b) {
                if (a[0] === b[0]) {
                    return 0;
                }
                else {
                    return (a[0] < b[0]) ? -1 : 1;
                }
            }

            var result = data[0][0] + ": " + data[0][1];
            for(var i=1;i<data.length;i++){
                if(data[i][0]!==data[i-1][0]){
                    result += ", " + data[i][0]+": " + data[i][1];
                }
                else{
                    if(JSON.stringify(data[i][1])!==JSON.stringify(data[i-1][1])){
                        result+= " + " + data[i][1];
                    }
                }
            }
            return "This patient's relevant data is: \n" + result;
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