import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sudoku-number-picker',
  templateUrl: './sudoku-number-picker.component.html',
  styleUrls: ['./sudoku-number-picker.component.scss'],
})
export class SudokuNumberPickerComponent  implements OnInit {
  numbers: number[]=[1,2,3,4,5,6,7,8,9];
  
  constructor() { }

  ngOnInit() {}

}
