import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SudokuBoardCellComponent } from './sudoku-board-cell.component';

describe('SudokuBoardCellComponent', () => {
  let component: SudokuBoardCellComponent;
  let fixture: ComponentFixture<SudokuBoardCellComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SudokuBoardCellComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SudokuBoardCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
