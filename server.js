const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//format message (we import it from the utils dir)
const formatMessage = require('./public/utils/messages');

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//create a variable called botName
const botName = 'Grace Bot';

// Run when client connects
io.on('connection', socket => {
    // console.log('New WS Connection...');
    //
    // socket.emit('message', 'Welcome to Grace ChatBot');

    //listen of chatmessage
    socket.on('chatMessage', (msg) => {

        //get current user
        //const user = getCurrentUser(socket.id);

       //we first print it out in the server
       //  console.log(msg);
        //now we want to emit this back to the
        io.emit('message', msg);
    });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))