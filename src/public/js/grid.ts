export interface IGridObject{
    x: number;
    y: number;
}

export class GridPoint{
    x: number;
    y: number;
    row: number;
    column: number;
    gridObject: IGridObject | undefined;
    
    constructor(x: number, y: number, row: number, column: number){
        this.x = x;
        this.y = y;
        this.row = row;
        this.column = column;
        this.gridObject = undefined;
    }

    updateGridObject(gridObject: IGridObject){
        this.gridObject = gridObject;
    }

    reset(){
        this.gridObject = undefined;
    }

    isEmpty(): boolean {
        return this.gridObject === undefined;
    }
}

export class Grid {
    width: number;
    height: number;
    pointSize: number;
    gridPoints: GridPoint[][];
    gridPointMap: Map<string, GridPoint>;
    columns: number;
    rows: number;
    constructor(width: number, height: number, pointSize: number){
        this.width = width;
        this.height = height;
        this.pointSize = pointSize;
        const gridPointsColumns = Math.round(width/pointSize);
        const gridPointsRows = Math.round(height/pointSize);
        this.columns = gridPointsColumns;
        this.rows = gridPointsRows;
        this.gridPointMap = new Map<string, GridPoint>();
        this.gridPoints = new Array<Array<GridPoint>>();
        for(let i = 0; i < gridPointsRows; i++){
            this.gridPoints.push(new Array<GridPoint>());
            for(let j = 0; j < gridPointsColumns; j++){
                const x = j * pointSize + pointSize/2;
                const y = i * pointSize + pointSize/2;
                const gridPoint = new GridPoint(x, y, i, j);
                const gridPointKey = this.generateGridPointKey(x, y);
                this.gridPoints[i][j] = gridPoint;
                this.gridPointMap.set(gridPointKey, gridPoint)
            }
        }
    }

    neighboringGridPoints(gridPoint: GridPoint): GridPoint[]{
        const left = gridPoint.column - 1;
        const right = gridPoint.column + 1;
        const up = gridPoint.row - 1;
        const down = gridPoint.row + 1;
        const neighbors = Array<GridPoint>();

        if(left >= 0 && left < this.columns){
            neighbors.push(this.gridPoints[gridPoint.row][left]);
        }
        if(right >= 0 && right < this.columns){
            neighbors.push(this.gridPoints[gridPoint.row][right]);
        }
        if(up >= 0 && up < this.rows){
            neighbors.push(this.gridPoints[up][gridPoint.column]);
        }
        if(down >= 0 && down < this.rows){
            neighbors.push(this.gridPoints[down][gridPoint.column]);
        }

        return neighbors;
    }

    generateGridPointKey(x:number, y: number): string {
        const xKey = Math.floor(x/this.pointSize) * this.pointSize + this.pointSize/2;
        const yKey = Math.floor(y/this.pointSize) * this.pointSize + this.pointSize/2;
        return xKey.toString() + "," + yKey.toString();
    }

    retrieveGridPoint(gridObject: IGridObject): GridPoint {
        const gridPointKey = this.generateGridPointKey(gridObject.x, gridObject.y);
        const point = this.gridPointMap.get(gridPointKey);
        return point!;
    }
}