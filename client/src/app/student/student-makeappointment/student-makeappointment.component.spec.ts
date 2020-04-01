import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentMakeappointmentComponent } from './student-makeappointment.component';

describe('StudentMakeappointmentComponent', () => {
  let component: StudentMakeappointmentComponent;
  let fixture: ComponentFixture<StudentMakeappointmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentMakeappointmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentMakeappointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
