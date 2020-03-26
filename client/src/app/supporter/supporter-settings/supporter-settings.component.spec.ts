import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupporterSettingsComponent } from './supporter-settings.component';

describe('SupporterSettingsComponent', () => {
  let component: SupporterSettingsComponent;
  let fixture: ComponentFixture<SupporterSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupporterSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupporterSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
