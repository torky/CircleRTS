import io, { Socket } from "socket.io-client";

const socket: Socket = io("ws://localhost:3000");

var form = document.getElementById("form");
var input = document.getElementById("input") as HTMLInputElement;

form.addEventListener("submit", function(e) {
  e.preventDefault();
  if (input.value) {
    socket.emit("chat message", input.value);
    input.value = "";
  }
});