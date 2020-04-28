import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupporterAppointmentsComponent } from './supporter-appointments.component';

describe('SupporterAppointmentsComponent', () => {
  let component: SupporterAppointmentsComponent;
  let fixture: ComponentFixture<SupporterAppointmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupporterAppointmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupporterAppointmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
