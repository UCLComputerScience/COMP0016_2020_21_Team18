const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const neo4j = require('neo4j-driver');
const getPrediction = require('./predict');

const driver = neo4j.driver('bolt://51.140.127.105:7687/', neo4j.auth.basic('neo4j', 'Ok1gr18cRrXcjhm4byBw'));

const formatMessage = require('./public/utils/messages');

app.use(express.static(path.join(__dirname, 'public')));

const botName = 'Grace Bot';

const getDrugs = async (name) => {
    const session = driver.session();
    console.log(name);
    try {
        const result = await session.run(
            "MATCH (patient:Patient{id:$name})-[:HAS_ENCOUNTER]-(encounter:Encounter)-[:HAS_DRUG]-(drug:Drug) RETURN patient,encounter,drug LIMIT 10",
            { name }
        )

        console.log(result.records[0]['_fields'][2].properties.description);
        return [...new Set(result.records.map(row => row['_fields'][2].properties.description))];
    } finally {
        await session.close()
    }
}

const getConditions = async (name,wantedNode) => {
    const session = driver.session();
    console.log(name);
    try {
        const result = await session.run(
            "MATCH (patient:Patient{id:$name})-[:HAS_ENCOUNTER]-(encounter:Encounter)-"+wantedNode+" RETURN patient,encounter,drug LIMIT 10",
            { name }
        )

        console.log(result.records[0]['_fields'][2].properties.description);
        return [...new Set(result.records.map(row => row['_fields'][2].properties.description))];
    } finally {
        await session.close()
    }
}

const getMessage = async (msg) => {
    const prediction = await getPrediction(msg);
    switch(prediction.prediction) {
        case 'getDrugs':
            const data = await getDrugs(prediction.entities.DB_personName[0][0]);
            return "This patient took: " + data.join(", ");
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

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))