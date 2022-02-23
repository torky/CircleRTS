import { Sprite } from "@pixi/sprite";
import { IGridObject } from "./grid";

export const DefaultSpriteLife = 10.0;

export function getColorFromPlayerId(playerId: number): number{
    let color = 0xFFFFFF;
    switch(playerId){
        case 1:
            color = 0xDE3163;
            break;
        case 2:
            color = 0x6495ED;
            break;
        case 3:
            color = 0x40E0D0;
            break;
        case 4:
            color = 0x9FE2BF;
            break;
        case 5:
            color = 0xFF7F50;
            break;
        case 6:
            color = 0xFFBF00;
            break;
        case 7:
            color = 0xDFFF00;
            break;
        case 8:
            color = 0xCCCCFF;
            break;
        case 9:
            color = 0xFF0000;
            break;
        case 10:
            color = 0x0000FF;
            break;
        default:
            color = 0xFFFFFF;
            break;
    }
    return color;
}

export interface IPlayerCommand extends IGridObject {
    playerId: number;
}

export class ServerPlayerCommand implements IPlayerCommand {
    x: number;
    y: number;
    playerId: number;
    tick: number;
    constructor (x: number, y: number, id: number, tick: number) {
        this.x = Math.round(x);
        this.y = Math.round(y);
        this.playerId = id;
        this.tick = tick;
    }
}

export class LocalPlayerCommand implements IPlayerCommand {
    x: number;
    y: number;
    playerId: number;
    constructor (x: number, y: number, playerId: number) {
        this.x = Math.round(x);
        this.y = Math.round(y);
        this.playerId = playerId;
    }
}


export class PlayerCommand implements IPlayerCommand {
    x: number;
    y: number;
    spriteLife: number;
    sprite: Sprite;
    playerId: number;
    tick: number;
    
    constructor(serverPlayerCommand: IPlayerCommand, tick: number){
        this.spriteLife = 10.0;
        this.sprite = Sprite.from('images/PlayerCommand.png');
        this.x = serverPlayerCommand.x;
        this.y = serverPlayerCommand.y;
        this.playerId = serverPlayerCommand.playerId;
        this.tick = tick;
        this.sprite.x = this.x;
        this.sprite.y = this.y;
        this.sprite.anchor.set(0.5, 0.5);
    }
    
    animate(){
        if(this.spriteLife > 0){
            this.sprite.scale.set(this.spriteLife / DefaultSpriteLife);
            this.spriteLife--;
        }else if(this.spriteLife == 0) {
            this.sprite.destroy();
            this.spriteLife--;
        }
    }
}