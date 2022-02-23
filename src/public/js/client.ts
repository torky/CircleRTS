import  io, { Socket } from "socket.io-client";
import { setupChat } from "./chat";
import { setupGame } from "./game";
import * as PIXI from "pixi.js";

const app = new PIXI.Application();

const socket: Socket = io("ws://localhost:8080");
setupChat(socket);
setupGame(socket, app);
