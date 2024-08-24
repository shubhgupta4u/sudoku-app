import { TestBed } from '@angular/core/testing';

import { SudokuBoardGeneratorService } from './sudoku-board-generator.service';

describe('SudokuBoardGeneratorService', () => {
  let service: SudokuBoardGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SudokuBoardGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
