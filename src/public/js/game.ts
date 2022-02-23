import { Application } from "@pixi/app";
import { Container } from "@pixi/display";
import { Rectangle } from "@pixi/math";
import { Sprite } from "@pixi/sprite";
import { Socket } from "socket.io-client";
import { GameState } from "./gameState";
import { InputManager } from "./inputManager";
import { NetworkManager } from "./networkManager";

const pointSize = 20;
const gameWidth = 1000;
const gameHeight = 1000;

export async function setupGame(socket: Socket, app: Application){
    console.log("Setting up game...");

    document.body.prepend(app.view);

    app.view.oncontextmenu = function(e) { e.preventDefault(); e.stopPropagation(); }
    app.view.onselect = function(e) { e.preventDefault(); e.stopPropagation(); }

    const container = new Container();
    container.x = 0;
    container.y = 0;
    container.width = gameWidth;
    container.height = gameHeight;
    
    console.log("Creating background...");
    const background = Sprite.from("assets/background.jpg");
    container.addChild(background);
    console.log("Background created!");
    
    app.stage.addChild(container);

    console.log("Setting up game state...");
    const gameState = new GameState(container.width, container.height, pointSize, container);
    console.log("Game state setup!");

    console.log("Connecting to server...");
    const networkManager = new NetworkManager(socket, gameState);
    await networkManager.setup();
    console.log(`Connected to server as player ${networkManager.playerId}!`);

    console.log("Setting up input...");
    container.interactive = true;
    container.hitArea = new Rectangle(0, 0, container.width, container.height);
    const inputManager = new InputManager(networkManager, container);
    inputManager.setupInputHandling();
    console.log("Input setup!");
    console.log("Game setup!");
}