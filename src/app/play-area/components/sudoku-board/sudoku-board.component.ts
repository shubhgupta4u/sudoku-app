import { Component, OnDestroy, OnInit } from '@angular/core';
import { Complexity, SudokuBoardGeneratorService } from '../../services/sudoku-board-generator.service';
import { GameEventNotifierService } from '../../services/game-event-notifier.service';
import { GameEvent,EventName } from '../../models/game-event';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-sudoku-board',
  templateUrl: './sudoku-board.component.html',
  styleUrls: ['./sudoku-board.component.scss'],
})
export class SudokuBoardComponent implements OnInit, OnDestroy {
  board: number[][]|undefined;
  gameEventSubscription: Subscription|undefined;
  gameComplexity=Complexity.Hard;

  sampleNumbers = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
  ];  
  constructor(private sudokuBoardGeneratorService: SudokuBoardGeneratorService,
    private gameEventNotifierService: GameEventNotifierService
  ) {
    this.gameEventSubscription = this.gameEventNotifierService.register().subscribe((event: GameEvent) => {
      if(event){
        switch(event.name){
          case EventName.NewGame:
            if(event.data){
              this.gameComplexity = event.data
            }
            this.board = this.sudokuBoardGeneratorService.generateSudokuBoard(this.gameComplexity);
            break;
          case EventName.RestartGame:
            this.board = this.sudokuBoardGeneratorService.generateSudokuBoard(this.gameComplexity);
            break;
        }
      }
    });    
  }
  ngOnInit() {
	  
  }
  ngOnDestroy() { 
	  if (this.gameEventSubscription) {
      this.gameEventSubscription.unsubscribe();
    }
  }
  
}
