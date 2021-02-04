const chatForm = document.getElementById('chat-form')

// this stores the chat-messages in a variable so that on the line:
//chatMessages.scrollTop = chatMessages.scrollHeight; we can use that attribute to go down
const chatMessages = document.querySelector('.chat-messages');

const socket = io();

socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    //this is so that everytime we get a message, we scroll down to the latest meessage
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

//Message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const msg = e.target.elements.msg.value;

    //emitting a message to the server
    socket.emit('chatMessage', msg);

    //clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

function outputMessage(message) {
    const div = document.createElement('div');
    message.server ? div.classList.add('bot-message') : div.classList.add('message');
    const para = document.createElement('p');
    para.classList.add('text');
    para.innerText = message.message;
    div.appendChild(para);
    document.querySelector('.chat-messages').appendChild(div);
}
