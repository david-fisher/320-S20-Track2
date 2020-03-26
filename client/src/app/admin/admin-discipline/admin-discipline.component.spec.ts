import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDisciplineComponent } from './admin-discipline.component';

describe('AdminDisciplineComponent', () => {
  let component: AdminDisciplineComponent;
  let fixture: ComponentFixture<AdminDisciplineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminDisciplineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDisciplineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
