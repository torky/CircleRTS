import { NetworkManager } from "./networkManager";
import { InteractionEvent } from "@pixi/interaction";
import { EventEmitter } from "@pixi/utils";
import { LocalPlayerCommand } from "./playerCommand";

export class InputManager {
    networkManager: NetworkManager;
    stage: EventEmitter;
    constructor(playerCommandManager: NetworkManager, stage: EventEmitter){
        this.networkManager = playerCommandManager;
        this.stage = stage;
    }

    setupInputHandling(){
        this.stage.on("pointerup", (ev: InteractionEvent) => {
            console.log(ev);
            const x = ev.data.global.x;
            const y = ev.data.global.y;
            if(this.networkManager.playerId === undefined) throw new Error(`PlayerId undefined! Expected a defined playerId.`)
            const localPlayerCommand = new LocalPlayerCommand(x, y, this.networkManager.playerId);
            this.networkManager.sendLocalPlayerCommand(localPlayerCommand);
        });

        this.stage.on("keyup", (ev: KeyboardEvent) => {
            console.log(ev);
            if(ev.key === "KeyP") {
                this.networkManager.sendPauseResume();
            }
        });
    }
}