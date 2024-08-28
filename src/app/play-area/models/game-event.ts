import { Complexity } from "../services/sudoku-board-generator.service";

type EventDataType=NewGameEventData|SetNumberEventData|EmptyCellSelectedEventData|NumberSelectedEventData|undefined;

export enum EventName {
    NewGame, 
    Exit,
    TimeOver,
    GameOver,
    PickerNumberSelected,
    BoardNumberSelected,
    SetNumber,
    NumberSelected,
    EmptyCellSelected,
    ClearSelection,
    ClearAll,
    cellClicked
  }
export class GameEvent{
    data:EventDataType;
    name:EventName|undefined
    constructor(name:EventName, data:EventDataType=undefined){
        this.name=name;
        this.data=data;
    }
}
export class NumberSelectedEventData{
    num:number|undefined;
    constructor(num:number|undefined){
        this.num=num;
    } 
}
export class BoardNumberSelectedEventData extends NumberSelectedEventData{
    rowIndex:number;
    columnIndex:number;
    constructor(num:number, rowIndex:number, columnIndex:number){
        super(num);
        this.rowIndex=rowIndex;
        this.columnIndex=columnIndex;
    } 
}
export class SetNumberEventData{
    num:number;
    rowIndex:number;
    colIndex:number;
    constructor(num:number,rowIndex:number,colIndex:number){
        this.num=num;
        this.rowIndex=rowIndex;
        this.colIndex=colIndex;
    }
}
export class EmptyCellSelectedEventData{
    rowIndex:number;
    colIndex:number;
    constructor(rowIndex:number,colIndex:number){
        this.rowIndex=rowIndex;
        this.colIndex=colIndex;
    }
}
export class NewGameEventData{
    complexity:Complexity;
    constructor(complexity:Complexity){
        this.complexity=complexity;
    }
}