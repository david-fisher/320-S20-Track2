import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupporterLandingComponent } from './supporter-landing.component';

describe('SupporterLandingComponent', () => {
  let component: SupporterLandingComponent;
  let fixture: ComponentFixture<SupporterLandingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupporterLandingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupporterLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
