import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { EventName, GameEvent } from '../models/game-event';

@Injectable({
  providedIn: 'root'
})
export class GameEventNotifierService {

  private subject = new Subject<GameEvent>();
  private lastPicketNumber:number|undefined;

  constructor() { }

  raiseEvent(event:GameEvent){
    if(event.name === EventName.NumberPicked){
      this.lastPicketNumber=event.data;
    }
    this.subject.next(event);
  }
  register(){
    return this.subject;
  }
  getLastPickerNumber():number{
    return this.lastPicketNumber === undefined?0:this.lastPicketNumber;
  }
}
