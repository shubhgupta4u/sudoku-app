import { Component, Input, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Complexity, SudokuBoard, SudokuBoardGeneratorService } from '../../services/sudoku-board-generator.service';
import { GameEventNotifierService } from '../../services/game-event-notifier.service';
import { GameEvent, EventName, NewGameEventData, SetNumberEventData } from '../../models/game-event';
import { Subscription } from 'rxjs';
import { SudokuBoardCellComponent } from '../sudoku-board-cell/sudoku-board-cell.component';

@Component({
  selector: 'app-sudoku-board',
  templateUrl: './sudoku-board.component.html',
  styleUrls: ['./sudoku-board.component.scss'],
})
export class SudokuBoardComponent implements OnInit, OnDestroy {
  board: number[][] | undefined;
  gameEventSubscription: Subscription | undefined;
  gameComplexity = Complexity.Hard;

  @Input() readonly: boolean | undefined;
  @ViewChildren(SudokuBoardCellComponent) cellComponents: QueryList<SudokuBoardCellComponent>|undefined;

  constructor(private sudokuBoardGeneratorService: SudokuBoardGeneratorService,
    private gameEventNotifierService: GameEventNotifierService
  ) {
    
  }
  registerEventSubscription(){
    if (this.readonly === undefined || this.readonly === false) {
      this.gameEventSubscription = this.gameEventNotifierService.register().subscribe((event: GameEvent) => {
        if (event) {
          switch (event.name) {
            case EventName.NewGame:
              if (event.data && event.data instanceof NewGameEventData) {
                this.gameComplexity = event.data.complexity
              }
              this.board = this.sudokuBoardGeneratorService.generateSudokuBoard(this.gameComplexity);
              break;
            case EventName.SetNumber:
              const board=this.getUpdatedBoard();
              setTimeout(() => {          
                const isInvalid=this.isBoardValid(board);      
                if(!this.anyEmptyCell() && isInvalid){
                  this.gameEventNotifierService.raiseEvent(new GameEvent(EventName.GameOver));
                }
              }, 100);
              
          }
        }
      });
    }
  }
  ngOnInit() {
    this.registerEventSubscription();
    if (this.readonly !== undefined && this.readonly === true) {
      this.board = this.sudokuBoardGeneratorService.getCurrentBoard();
    }
  }
  ngOnDestroy() {
    if (this.gameEventSubscription) {
      this.gameEventSubscription.unsubscribe();
    }
  }

  anyCellSelected():boolean{
    if(this.cellComponents && this.cellComponents.length === 81 && this.cellComponents.filter(s=>s.isSelected)?.length >= 1)
      return true;
    else
      return false
  }

  anyEmptyCell():boolean{
    if(this.cellComponents && this.cellComponents.length === 81 && this.cellComponents.filter(s=>s.num === 0 && s.pickednumber === undefined)?.length >= 1)
      return true;
    else
      return false
  }

  isBoardValid(board:SudokuBoard):boolean{
    let isInvalid = false;
    if(this.cellComponents){      
      this.cellComponents.forEach((cell)=>{
        cell.isInvalid = false;
        if(cell.num ===0 && cell.pickednumber !== undefined && cell.rowIndex !==undefined && cell.colIndex !== undefined){
          if(!this.sudokuBoardGeneratorService.isValid(board,cell.rowIndex,cell.colIndex,cell.pickednumber)){
            isInvalid=true;
            cell.isInvalid = true;
          }
        }        
      });
    }    
    return !isInvalid;
  }

  private getUpdatedBoard(){
    const board: SudokuBoard = Array.from({ length: 9 }, () => Array(9).fill(0));
    if(this.cellComponents){
      this.cellComponents.forEach((cell)=>{
        if(cell.rowIndex !== undefined  && cell.colIndex !== undefined ){
          board[cell.rowIndex][cell.colIndex]=(cell.pickednumber !== undefined && cell.pickednumber >0?cell.pickednumber:(cell.num && cell.num >0?cell.num:0)); 
        }             
      });
    }
    return board;
  }
}
