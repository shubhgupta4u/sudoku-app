import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SudokuNumberPickerComponent } from './sudoku-number-picker.component';

describe('SudokuNumberPickerComponent', () => {
  let component: SudokuNumberPickerComponent;
  let fixture: ComponentFixture<SudokuNumberPickerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SudokuNumberPickerComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SudokuNumberPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
