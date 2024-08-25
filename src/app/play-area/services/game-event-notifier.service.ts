import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { EmptyCellSelectedEventData, EventName, GameEvent, NumberSelectedEventData } from '../models/game-event';

@Injectable({
  providedIn: 'root'
})
export class GameEventNotifierService {

  private subject = new Subject<GameEvent>();
  private lastPicketNumber:NumberSelectedEventData|undefined;
  private lastSelectedEmptyCell:EmptyCellSelectedEventData|undefined;

  constructor() { }

  raiseEvent(event:GameEvent){
    if(event.name === EventName.PickerNumberSelected && event.data instanceof NumberSelectedEventData){
      this.lastPicketNumber=event.data;
      this.clearLastSelectedEmptyCell();
    }else if(event.name === EventName.EmptyCellSelected && event.data instanceof EmptyCellSelectedEventData){
      this.lastSelectedEmptyCell=event.data;
      this.clearLastPickerNumber();
    }
    this.subject.next(event);
  }
  register(){
    return this.subject;
  }
  getLastPickerNumber():number{
    return this.lastPicketNumber !== undefined && this.lastPicketNumber.num!==undefined?this.lastPicketNumber.num:0;
  }
  getLastSelectedEmptyCell():EmptyCellSelectedEventData|undefined{
    return this.lastSelectedEmptyCell;
  }
  clearLastPickerNumber(){
    this.lastPicketNumber = undefined;
  }
  clearLastSelectedEmptyCell(){
    this.lastSelectedEmptyCell = undefined;
  }
}
