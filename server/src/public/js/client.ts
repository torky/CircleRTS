import  io, { Socket } from "socket.io-client";

const socket: Socket = io("ws://localhost:8080");

var messages = document.getElementById('messages');
var form = document.getElementById("form");
var input = document.getElementById("input") as HTMLInputElement;

form!.addEventListener("submit", function(e) {
  e.preventDefault();
  if (input.value) {
    socket.emit("chat message", input.value);
    input.value = "";
  }
});

socket.on('chat message', function(msg) {
  var item = document.createElement('li');
  item.textContent = msg;
  messages!.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});