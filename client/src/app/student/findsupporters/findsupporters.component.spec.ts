import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FindsupportersComponent } from './findsupporters.component';

describe('FindsupportersComponent', () => {
  let component: FindsupportersComponent;
  let fixture: ComponentFixture<FindsupportersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindsupportersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindsupportersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
