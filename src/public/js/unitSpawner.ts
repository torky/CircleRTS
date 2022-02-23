import { Sprite } from "@pixi/sprite";
import { GameState } from "./gameState";
import { Grid, IGridObject } from "./grid";
import { PlayerCommand } from "./playerCommand";

export class UnitSpawner implements IGridObject{
    x: number = - 100000;
    y: number = - 100000;
    grid: Grid | undefined;
    sprite: Sprite;
    startTick: number;
    endTick: number | undefined;
    validCommand: boolean;
    gameState: GameState | undefined;
    playerCommand: PlayerCommand | undefined;
    static tickLife = 50;

    constructor(playerCommand: PlayerCommand, grid: Grid, currentTick: number, gameState: GameState){
        this.startTick = playerCommand.tick;
        const tickTime = UnitSpawner.tickLife + this.startTick - currentTick;
        this.sprite = Sprite.from("images/UnitSpawner.png");
        if(tickTime >= 0){
            this.x = playerCommand.x;
            this.y = playerCommand.y;
            this.grid = grid;
            this.sprite.anchor.set(0.5, 0.5);
            this.sprite.x = this.x;
            this.sprite.y = this.y;
            this.validCommand = true;
            this.gameState = gameState;
            this.playerCommand = playerCommand;
        }else{
            this.validCommand = false;
            this.end();
        }
    }

    update(tick: number){
        if(this.validCommand){
            if(tick == this.startTick + UnitSpawner.tickLife){
                this.spawn();
                this.end();
            }
        }
    }

    animate(){
        if(this.sprite === undefined) throw new Error("Animating unit spawner without a sprite!");
        this.sprite.x = this.x;
        this.sprite.y = this.y;
    }

    spawn(){
        if(this.grid === undefined) throw new Error("Spawning without a grid!");
        if(this.playerCommand === undefined) throw new Error("No player command given to spawn a unit spawner!");
        if(this.gameState === undefined) throw new Error("Undefined GameState!");
        if(this.grid.retrieveGridPoint(this.playerCommand).isEmpty()){
            this.gameState.createNewUnit(this.playerCommand);
            this.sprite.destroy();
        }
    }

    end(){
        this.validCommand = false;
    }
}