import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupporterAvailabilityComponent } from './supporter-availability.component';

describe('SupporterAvailabilityComponent', () => {
  let component: SupporterAvailabilityComponent;
  let fixture: ComponentFixture<SupporterAvailabilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupporterAvailabilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupporterAvailabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
