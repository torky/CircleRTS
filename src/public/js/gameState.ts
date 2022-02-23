import { Container } from "@pixi/display";
import { Grid } from "./grid";
import { getColorFromPlayerId, PlayerCommand } from "./playerCommand";
import { Unit, UnitState } from "./unit";
import { UnitSpawner } from "./unitSpawner";

export class GameState {
    units: Unit[];
    grid: Grid;
    playerCommands: Map<number, PlayerCommand[]>;
    unprocessedPlayerCommands: Array<PlayerCommand> = [];
    container: Container;
    currentTick: number;
    cannotSpawnRange: number;
    unitSpawners: UnitSpawner[];

    constructor(width: number, height: number, pointSize: number, container: Container){
        this.currentTick = 0;
        this.units = [];
        this.grid = new Grid(width, height, pointSize);
        this.playerCommands = new Map<number, PlayerCommand[]>();
        this.container = container;
        this.cannotSpawnRange = 60;
        this.unprocessedPlayerCommands = new Array<PlayerCommand>();
        this.unitSpawners = new Array<UnitSpawner>();
    }

    addPlayerCommand(command: PlayerCommand){
        const unitSpawner = new UnitSpawner(command, this.grid, this.currentTick, this);
        if(unitSpawner.validCommand){
            this.unitSpawners.push(unitSpawner);
            this.container.addChild(unitSpawner.sprite);
        }
    }

    createNewUnit(playerCommand: PlayerCommand){
        const x = playerCommand.x;
        const y = playerCommand.y;

        const player = playerCommand.playerId;
        let sprite = "images/UnitWhite.png";
        const newUnit = new Unit(x, y, player, this.grid, sprite);
        this.units.push(newUnit);

        let color = getColorFromPlayerId(player);

        newUnit.sprite.tint = color;
        this.container.addChild(newUnit.sprite);
    }

    update(){
        this.units.forEach((unit) => {
            unit.update();
        });
        for(let i = this.units.length - 1; i >= 0; i--){
            if(this.units[i].state === UnitState.DEAD || this.units[i].health <= 0){
                this.units[i].state = UnitState.DEAD;
                this.units[i].die();
                this.units.splice(i, 1);
            }
        }

        this.unitSpawners.forEach(spawner => {
            spawner.update(this.currentTick);
        })

        for(let i = this.unitSpawners.length - 1; i >= 0; i--){
            if(!this.unitSpawners[i].validCommand){
                this.unitSpawners.splice(i, 1);
            }
        }
    }

    updateTick(tick: number){
        this.currentTick = tick;
    }
}