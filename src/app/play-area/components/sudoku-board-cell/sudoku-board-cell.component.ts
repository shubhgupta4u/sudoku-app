import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { GameEventNotifierService } from '../../services/game-event-notifier.service';
import { BoardNumberSelectedEventData, EmptyCellSelectedEventData, EventName, GameEvent, NumberSelectedEventData, SetNumberEventData } from '../../models/game-event';
import { Subscription } from 'rxjs';
import { SudokuBoardGeneratorService } from '../../services/sudoku-board-generator.service';

@Component({
  selector: 'app-sudoku-board-cell',
  templateUrl: './sudoku-board-cell.component.html',
  styleUrls: ['./sudoku-board-cell.component.scss'],
})
export class SudokuBoardCellComponent implements OnInit, OnDestroy {
  @Input() num: number | undefined;
  @Input() readonly: boolean | undefined;
  @Input() rowIndex: number | undefined;
  @Input() colIndex: number | undefined;
  gameEventSubscription: Subscription | undefined;
  numberPicked: boolean = false;
  @Input() pickednumber: number | undefined;
  isSelected: boolean = false;
  isInvalid: boolean = false;

  constructor(private gameEventNotifierService: GameEventNotifierService,
    private sudokuBoardGeneratorService: SudokuBoardGeneratorService
  ) {

  }

  private clearCellState() {
    this.isSelected = false;
    this.numberPicked = false;
    this.isInvalid = false;
  }

  ngOnInit() {
    if (this.readonly === undefined || this.readonly === false) {
      this.gameEventSubscription = this.gameEventNotifierService.register().subscribe((event: GameEvent) => {
        if (event) {
          switch (event.name) {
            case EventName.GameOver:
            case EventName.TimeOver:
              this.numberPicked = false;
              this.readonly = true;
              break;
            case EventName.NewGame:
              this.readonly = false;
              this.pickednumber = undefined;
              this.clearCellState();
              break;
            case EventName.ClearAll:
              if (this.insideBoard() && !this.readonly) {
                this.pickednumber = undefined;
                this.clearCellState();
              }
              break;
            case EventName.ClearSelection:
              if (this.isSelected && !this.readonly) {
                this.pickednumber = undefined;
                this.clearCellState();
              }
              break;
            case EventName.EmptyCellSelected:
              this.isSelected = false;
              this.numberPicked = false;
              if (event.data && event.data instanceof EmptyCellSelectedEventData && this.rowIndex == event.data.rowIndex && this.colIndex == event.data.colIndex) {
                this.numberPicked = true;
              }
              break;
            case EventName.BoardNumberSelected:
            case EventName.PickerNumberSelected:
              this.isSelected = false;
              this.numberPicked = false;
              if (event.data && (event.data instanceof NumberSelectedEventData || event.data instanceof BoardNumberSelectedEventData)) {
                if (event.data.num !== undefined && event.data.num > 0
                  && (this.num === event.data.num || this.pickednumber === event.data.num)
                  && (EventName.PickerNumberSelected == event.name || (EventName.BoardNumberSelected == event.name && this.insideBoard()))
                ) {
                  this.numberPicked = true;
                  //Mark isSelected flag of currently selected board white cell
                  if (event.data instanceof BoardNumberSelectedEventData && EventName.BoardNumberSelected == event.name
                    && (this.num === undefined || this.num === 0)
                    && this.insideBoard() && this.rowIndex == event.data.rowIndex && this.colIndex === event.data.columnIndex) {
                    this.isSelected = true;
                  }
                }
              }
              break;
            case EventName.SetNumber:
              this.clearCellState();
              if (event.data && event.data instanceof SetNumberEventData) {
                if (this.insideBoard() && this.rowIndex === event.data.rowIndex && this.colIndex === event.data.colIndex
                  && event.data.num > 0 && this.num === 0 && (this.pickednumber === undefined || this.pickednumber === 0)) {
                  this.pickednumber = event.data.num;
                  this.numberPicked = true;
                  this.isSelected = true;
                }
                else if (this.num === event.data.num || this.pickednumber === event.data.num) {
                  this.numberPicked = true;
                }
              }
              break;
          }
        }
      });
    }
    else if (this.insideBoard() && this.rowIndex !== undefined && this.colIndex !== undefined && this.num === 0) {
      const result = this.sudokuBoardGeneratorService.getSolution();
      if (result !== undefined) {
        this.pickednumber = result[this.rowIndex][this.colIndex];
      }
    }
  }

  ngOnDestroy() {
    if (this.gameEventSubscription) {
      this.gameEventSubscription.unsubscribe();
    }
  }

  onNumberClick() {
    this.playClickSound();
    if (this.readonly === undefined || this.readonly === false) {
      if (this.insidePicker() && this.num !== undefined) {
        const lastSelectedEmptyCell = this.gameEventNotifierService.getLastSelectedEmptyCell();
        if (lastSelectedEmptyCell !== undefined) {
          //number is selected inside picker
          this.gameEventNotifierService.raiseEvent(new GameEvent(EventName.SetNumber, new SetNumberEventData(this.num, lastSelectedEmptyCell.rowIndex, lastSelectedEmptyCell.colIndex)));
          this.gameEventNotifierService.raiseEvent(new GameEvent(EventName.PickerNumberSelected, new NumberSelectedEventData(this.num)));
        } else {
          this.gameEventNotifierService.raiseEvent(new GameEvent(EventName.PickerNumberSelected, new NumberSelectedEventData(this.numberPicked ? undefined : this.num)));
        }
      } else if (this.rowIndex !== undefined && this.colIndex !== undefined) {
        if ((this.num !== undefined && this.num > 0) || (this.pickednumber !== undefined && this.pickednumber > 0)) {
          //number is selected inside board
          this.gameEventNotifierService.raiseEvent(new GameEvent(EventName.PickerNumberSelected, new NumberSelectedEventData(undefined)));
          this.gameEventNotifierService.raiseEvent(new GameEvent(EventName.BoardNumberSelected, new BoardNumberSelectedEventData(((this.num !== undefined && this.num > 0) ? this.num : this.pickednumber) as any, this.rowIndex, this.colIndex)));
        } else if (this.num === 0 && (this.pickednumber === 0 || this.pickednumber === undefined) && this.gameEventNotifierService.getLastPickerNumber() > 0) {
          //number is set on board
          const pickednumber = this.gameEventNotifierService.getLastPickerNumber();
          this.gameEventNotifierService.raiseEvent(new GameEvent(EventName.SetNumber, new SetNumberEventData(pickednumber, this.rowIndex, this.colIndex)));
        } else if (this.pickednumber === 0 || this.pickednumber === undefined) {
          //empty cell is selected on board
          this.gameEventNotifierService.raiseEvent(new GameEvent(EventName.EmptyCellSelected, new EmptyCellSelectedEventData(this.rowIndex, this.colIndex)));
        }
      }
    }
  }
  playClickSound() {
    const audio = document.getElementById('click-sound') as HTMLAudioElement;
    if (audio) {
      audio.play();
    }
  }
  insideBoard(): boolean {
    return this.rowIndex !== undefined;
  }
  
  insidePicker(): boolean {
    return this.rowIndex === undefined;
  }
}
