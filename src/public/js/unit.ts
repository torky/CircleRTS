import { Sprite, Texture } from "@pixi/sprite";
import { Grid, GridPoint, IGridObject } from "./grid";

export enum UnitState {
    ATTACKING,
    ATTACKMOVING,
    COMMANDMOVINGPOINT,
    COMMANDMOVINGUNIT,
    DEAD,
    IDLE
}

export class Unit implements IGridObject{
    x: number;
    y: number;
    player: number;
    grid: Grid;
    state: UnitState;
    targetUnit: Unit | undefined;
    targetGridPoint: GridPoint | undefined;
    gridPoint: GridPoint;
    sprite: Sprite;
    range: number;
    scanRange: number;
    health: number;
    damage: number;
    speed: number;
    died: boolean;

    constructor(x: number, y: number, player: number, grid: Grid, spriteFile: string){
        this.x = x;
        this.y = y;
        this.player = player;
        this.grid = grid;
        this.state = UnitState.IDLE;
        this.health = 100;
        this.range = 30;
        this.damage = 1;
        this.speed = 1;
        this.scanRange = 100;
        this.gridPoint = this.grid.retrieveGridPoint(this);
        this.gridPoint.gridObject = this;
        this.sprite = Sprite.from(spriteFile);
        this.sprite.anchor.set(0.5, 0.5);
        this.died = false;
    }

    update(){
        switch(this.state){
            case UnitState.ATTACKING:
                this.attack();
                break;
            case UnitState.ATTACKMOVING:
                this.attackMove();
                break;
            case UnitState.COMMANDMOVINGPOINT:
                if(this.targetGridPoint === undefined) {
                    this.state = UnitState.IDLE;
                }else{
                    this.moveToPoint(this.targetGridPoint);
                }
                break;
            case UnitState.COMMANDMOVINGUNIT:
                this.moveToUnit();
                break;
            case UnitState.DEAD:
                this.die();
                break;
            case UnitState.IDLE:
                this.idle();
                break;
            default:
                this.state = UnitState.IDLE;
                break;
        }

        this.animate();
    }

    animate(){
        this.sprite.x = this.x;
        this.sprite.y = this.y;
    }

    distanceToGridObjectSquared(unit: IGridObject): number{
        return this.distanceToPointSquared(unit.x, unit.y);
    }

    private distanceToPointSquared(x: number, y: number): number{
        return (this.x - x) ** 2 + (this.y - y) ** 2;
    }

    private scan() : Unit | undefined{
        const visited = new Map<GridPoint, boolean>();
        const queue = new Array<GridPoint>();

        visited.set(this.gridPoint, true);
        queue.push(this.gridPoint); 
        while (queue.length > 0) {
            let visiting = queue.shift();
            if(visiting === undefined) throw new Error("Unexpected undefined item from queue");
            if(visiting !== this.gridPoint && visiting.gridObject instanceof Unit){
                const unit = visiting.gridObject as Unit
                if(unit.player !== this.player){
                    return unit;
                }
            }

            const neighboringGridPoints = this.grid.neighboringGridPoints(visiting);
            for (let j = 0; j < neighboringGridPoints.length; j++) {
                const gridPoint = neighboringGridPoints[j];
                if (visited.get(gridPoint) !== true && this.distanceToPointSquared(gridPoint.x, gridPoint.y) <= this.scanRange ** 2) {  
                    visited.set(gridPoint, true);
                    queue.push(gridPoint);
                }
            }
        }

        return;
    }

    attack(){
        //check if target unit is alive
        //switch state if not
        if(this.targetUnit === undefined || this.targetUnit.state === UnitState.DEAD){
            this.state = UnitState.IDLE;
            return;
        }
        //check if target unit is in range
        if(this.distanceToGridObjectSquared(this.targetUnit) <= this.range ** 2){
            //attack unit
            this.targetUnit.health -= this.damage;
        }else{
            //switch to moveToUnit if not
            this.state = UnitState.COMMANDMOVINGUNIT;
        }
    }

    attackMove(){
        //check if unit in scan range
        const unit = this.scan();
        //switch state to moveToUnit if so
        if(unit !== undefined){
            this.targetUnit = unit;
            this.state = UnitState.COMMANDMOVINGUNIT;
        }
        //move to point
        this.moveToPoint(this.targetGridPoint!);
    }

    moveToPoint(targetGridPoint: GridPoint){
        const distanceX = targetGridPoint.x - this.x;
        const distanceY = targetGridPoint.y - this.y;
        const deltaX = distanceX / Math.sqrt(distanceX ** 2 + distanceY ** 2) * this.speed;
        const deltaY = distanceY / Math.sqrt(distanceX ** 2 + distanceY ** 2) * this.speed;
        const newX = this.x + deltaX;
        const newY = this.y + deltaY;

        const newPoint = this.grid.retrieveGridPoint({x: newX, y: newY});
        //check if anything is blocking
        //don't move if so
        //move to point
        if(newPoint.gridObject === undefined || newPoint.gridObject === this){
            this.x = newX;
            this.y = newY;

            //update grid location
            if(this.gridPoint !== newPoint){
                this.gridPoint.reset();
                newPoint.updateGridObject(this);
                this.gridPoint = newPoint;
            }
        }
    }

    moveToUnit(){
        if(this.targetUnit === undefined || this.targetUnit.state === UnitState.DEAD){
            this.state = UnitState.IDLE;
        }else if(this.distanceToGridObjectSquared(this.targetUnit) <= this.range ** 2){
            this.state = UnitState.ATTACKING;
        }else{
            this.moveToPoint(this.targetUnit.gridPoint);
        }
    }

    die(){
        if(this.died) return;
        this.sprite.texture = Texture.from("images/DeadUnit.png");
        this.gridPoint.reset();
        this.died = true;
    }

    idle(){
        //check if unit in scan range
        const unit = this.scan();
        //switch state to moveToUnit if so
        if(unit !== undefined){
            this.targetUnit = unit;
            this.state = UnitState.COMMANDMOVINGUNIT;
        }
    }
}