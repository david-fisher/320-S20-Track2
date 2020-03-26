import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyappointmentsComponent } from './myappointments.component';

describe('MyappointmentsComponent', () => {
  let component: MyappointmentsComponent;
  let fixture: ComponentFixture<MyappointmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyappointmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyappointmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
