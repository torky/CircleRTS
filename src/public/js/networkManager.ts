import { Socket } from "socket.io-client";
import { GameState } from "./gameState";
import { IPlayerCommand, LocalPlayerCommand, PlayerCommand } from "./playerCommand";

export const commandKeyBase = "command";

interface IServerTick {
    tick: number;
    commands: IPlayerCommand[];
}

export class NetworkManager{
    socket: Socket;
    gameState: GameState;
    playerId: number | undefined;
    constructor(socket: Socket, gameState: GameState){
        this.socket = socket;
        this.gameState = gameState;
    }

    sendLocalPlayerCommand(localPlayerCommand: LocalPlayerCommand){
        this.socket.emit("localplayercommand", localPlayerCommand);
    }

    sendPauseResume() {
        this.socket.emit("pauseresume", { playerId: this.playerId });
    }

    sendTick(tick: number){
        this.socket.emit("tick", { playerId: this.playerId, tick });
    }

    getPlayerId() {
        return new Promise<number>((resolve) => {
            this.socket.on("playersetup", (playerId: number) => {
                resolve(playerId);
            });
        });
    }

    async setup() {
        this.socket.emit("playersetup");

        this.playerId = await this.getPlayerId();

        this.socket.on("servertick", (ev: IServerTick) => {
            const tick = ev.tick;
            for(const command of ev.commands){
                const playerCommand = new PlayerCommand(command, tick);
                this.gameState.addPlayerCommand(playerCommand);
            }
        });
    }
}