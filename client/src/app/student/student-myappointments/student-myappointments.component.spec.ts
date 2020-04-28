import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentMyappointmentsComponent } from './student-myappointments.component';

describe('StudentMyappointmentsComponent', () => {
  let component: StudentMyappointmentsComponent;
  let fixture: ComponentFixture<StudentMyappointmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentMyappointmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentMyappointmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
