import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentRatesupporterComponent } from './student-ratesupporter.component';

describe('StudentRatesupporterComponent', () => {
  let component: StudentRatesupporterComponent;
  let fixture: ComponentFixture<StudentRatesupporterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentRatesupporterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentRatesupporterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
