/* eslint-disable no-undef */

const chatForm = document.getElementById("chat-form");

// this stores the chat-messages in a variable so that on the line:
// chatMessages.scrollTop = chatMessages.scrollHeight; we can use that attribute to go down
const chatMessages = document.querySelector(".chat-messages");

const socket = io();

function outputMessage(message) {
  const div = document.createElement("div");
  
  if (message.server) {
    div.classList.add("bot-message");
  } else {
    div.classList.add("message");
  }

  const para = document.createElement("p");
  para.classList.add("text");
  para.innerText = message.message.replace(/[,]{2,}/i, ',');
  div.appendChild(para);
  document.querySelector(".chat-messages").appendChild(div);
}

// Message submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const msg = e.target.elements.msg.value;

  // emitting a message to the server
  socket.emit("chatMessage", msg);

  // clear input
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

socket.on("message", (message) => {
  outputMessage(message);

  // this is so that everytime we get a message, we scroll down to the latest meessage
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    navigator.serviceWorker
      .register("/js/serviceWorker.js")
      .then(res => console.log("service worker registered"))
      .catch(err => console.log("service worker not registered", err))
  })
}