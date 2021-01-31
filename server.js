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

const getNode = async (name,wantedNode,returnNode) => {
    const session = driver.session();
    console.log(name);
    try {
        const result = await session.run(
<<<<<<< HEAD
            "MATCH (patient:Patient{id:$name})-[:HAS_ENCOUNTER]-(encounter:Encounter)-[:HAS_DRUG]-(drug:Drug) RETURN patient,encounter,drug LIMIT 10",
            { name }
        )
<<<<<<< HEAD
        
=======

>>>>>>> new neo4j access (worked for pitch demo)
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
=======
            "MATCH (patient:Patient{id:$name})-[:HAS_ENCOUNTER]-(encounter:Encounter)-"+wantedNode+" RETURN patient,encounter,"+returnNode+" LIMIT 10",
>>>>>>> feat(server): new queries added
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
    let data;
    console.log(prediction);
    switch(prediction.prediction) {
        case 'getDrugs':
            data = await getNode(prediction.entities.DB_personName[0][0],"[:HAS_DRUG]-(drug:Drug)","drug");
            return "This patient took: \n" + data.join(", ");
        case 'getConditions':
            data = await getNode(prediction.entities.DB_personName[0][0],"[:HAS_CONDITION]-(condition:Condition)","condition");
            return "This patient has: \n" + data.join(", ");
        case 'getCarePlan':
            data = await getNode(prediction.entities.DB_personName[0][0],"[:HAS_CARE_PLAN]-(carePlan:CarePlan)","carePlan");
            return "This patient has: \n" + data.join(", ");
        case 'getAllergies':
            data = await getNode(prediction.entities.DB_personName[0][0],"[:HAS_ALLERGY]-(allergy:Allergy)","allergy");
            return "This patient has: \n" + data.join(", ");
        case 'getProcedures':
            data = await getNode(prediction.entities.DB_personName[0][0],"[:HAS_PROCEDURE]-(procedure:Procedure)","procedure");
            return "This patient has: \n" + data.join(", ");
        case 'getObservation':
            data = await getNode(prediction.entities.DB_personName[0][0],"[:HAS_OBSERVATION]-(observation:Observation)","observation");
            return "This patient has: \n" + data.join(", ");
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