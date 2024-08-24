import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayAreaRoutingModule } from './play-area-routing.module';
import { SudokuBoardComponent } from './components/sudoku-board/sudoku-board.component';
import { IonicModule } from '@ionic/angular';
import { PlayZoneComponent } from './components/play-zone/play-zone.component';
import { SudokuBoardCellComponent } from './components/sudoku-board-cell/sudoku-board-cell.component';
import { SudokuNumberPickerComponent } from './components/sudoku-number-picker/sudoku-number-picker.component';
import { PlayingRulesComponent } from './components/playing-rules/playing-rules.component';

@NgModule({
  declarations: [SudokuBoardComponent, PlayZoneComponent, SudokuBoardCellComponent, SudokuNumberPickerComponent, PlayingRulesComponent],
  imports: [
    IonicModule,
    CommonModule,
    PlayAreaRoutingModule
  ]
})
export class PlayAreaModule { }
