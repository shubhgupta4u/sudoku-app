
export enum EventName {
    NewGame, 
    RestartGame, 
    Exit,
    TimeOver,
    GameOver,
    NumberPicked,
    SetNumber
  }
export class GameEvent{
    data:any
    name:EventName|undefined
    constructor(name:EventName, data:any=undefined){
        this.name=name;
        this.data=data;
    }
}