import { Injectable } from '@angular/core';
export type SudokuBoard = number[][];
export enum Complexity {
  Easy =55, 
  Medium=45, 
  Hard=35,
  Master=25
}

@Injectable({
  providedIn: 'root'
})
export class SudokuBoardGeneratorService {

  private result:SudokuBoard|undefined;
  private board:SudokuBoard|undefined;
  constructor() { }

  // Generates a valid Sudoku board
  public generateSudokuBoard(complexity: Complexity): SudokuBoard {
    const board: SudokuBoard = Array.from({ length: 9 }, () => Array(9).fill(0));

    // Fill the board
    this.fillBoard(board);
    this.result = JSON.parse(JSON.stringify(board));
    console.log(this.result );
    const clues:number = +complexity;

    // Remove some numbers to create a puzzle
    this.removeNumbers(board,  81 - clues); 
    this.board = JSON.parse(JSON.stringify(board));
    return board;
  }

  // Check if a number can be placed in a given cell
  isValid(board: SudokuBoard, row: number, col: number, num: number): boolean {
    for (let i = 0; i < 9; i++) {
      if ((i !=col && board[row][i] === num) || (i !=row && board[i][col] === num)) {
        return false;
      }
    }

    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;

    for (let i = startRow; i < startRow + 3; i++) {
      for (let j = startCol; j < startCol + 3; j++) {
        if (i !=row && j!=col && board[i][j] === num) {
          return false;
        }
      }
    }

    return true;
  }

  public getSolution():SudokuBoard|undefined{
    return this.result;
  }

  public getCurrentBoard():SudokuBoard|undefined{
    return this.board;
  }

  // Fill the board using backtracking
  private fillBoard(board: SudokuBoard): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          const numbers = this.shuffleArray(Array.from({ length: 9 }, (_, i) => i + 1));
          for (const num of numbers) {
            if (this.isValid(board, row, col, num)) {
              board[row][col] = num;
              if (this.fillBoard(board)) {
                return true;
              }
              board[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  // Shuffle array using Fisher-Yates algorithm
  private shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Remove some numbers to create a puzzle
  private removeNumbers(board: SudokuBoard, count: number): void {
    let removed = 0;
    while (removed < count) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);
      if (board[row][col] !== 0) {
        const val = board[row][col];
        board[row][col] = 0;
        if(this.hasNonZeroCellRow(board,col) && this.hasNonZeroCellColumn(board,row)){
          removed++;
        }else{          
          board[row][col]=val;
          console.log(val,row,col,board[row][col]);
        }        
      }
    }
  }

  private hasNonZeroCellColumn(board: SudokuBoard, rowIndex:number){
    for(let colIndex=0;colIndex<9;colIndex++){
      if(board[rowIndex][colIndex] >0) return true;
    } 
    console.log('hasNonZeroCellColumn', rowIndex);
    return false;
  }

  private hasNonZeroCellRow(board: SudokuBoard,colIndex:number){
    for(let rowIndex=0;rowIndex<9;rowIndex++){
      if(board[rowIndex][colIndex] >0) return true;
    }
    console.log('hasNonZeroCellRow', colIndex);
    return false;
  }

  // Display the board (for debugging purposes)
  private displayBoard(board: SudokuBoard): void {
    for (const row of board) {
      console.log(row.map(num => (num === 0 ? '.' : num.toString())).join(' '));
    }
  }

}
