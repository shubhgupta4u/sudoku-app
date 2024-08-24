import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { GameEventNotifierService } from '../../services/game-event-notifier.service';
import { EventName, GameEvent } from '../../models/game-event';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sudoku-board-cell',
  templateUrl: './sudoku-board-cell.component.html',
  styleUrls: ['./sudoku-board-cell.component.scss'],
})
export class SudokuBoardCellComponent  implements OnInit, OnDestroy {
  @Input() num: number|undefined;
  @Input() rowIndex: number|undefined;
  @Input() colIndex: number|undefined;
  gameEventSubscription: Subscription|undefined;
  numberPicked:boolean=false;
  pickednumber:number|undefined;

  constructor(private gameEventNotifierService: GameEventNotifierService) { 
    this.gameEventSubscription = this.gameEventNotifierService.register().subscribe((event: GameEvent) => {
      if(event){
        switch(event.name){
          case EventName.NumberPicked:
            if(event.data && (this.num === event.data || this.pickednumber === event.data)){
              this.numberPicked=true;              
            }else{
              this.numberPicked=false;
            }
            break;
          case EventName.SetNumber:
            break;
        }
      }
    });
  }

  ngOnInit() {}

  ngOnDestroy() { 
	  if (this.gameEventSubscription) {
      this.gameEventSubscription.unsubscribe();
    }
  }

  onNumberClick(){
    if(this.rowIndex == undefined){
      //number is picked
      this.gameEventNotifierService.raiseEvent(new GameEvent(EventName.NumberPicked,this.numberPicked?undefined:this.num));
    }else{
      if(this.num === 0 && this.gameEventNotifierService.getLastPickerNumber() >0){
        //number is set on board
        this.pickednumber = this.gameEventNotifierService.getLastPickerNumber()
      }
      
    }
  }
}
