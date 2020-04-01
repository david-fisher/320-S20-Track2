import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentFindsupportersComponent } from './student-findsupporters.component';

describe('StudentFindsupportersComponent', () => {
  let component: StudentFindsupportersComponent;
  let fixture: ComponentFixture<StudentFindsupportersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentFindsupportersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentFindsupportersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
