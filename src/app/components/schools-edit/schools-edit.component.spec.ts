import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolsEditComponent } from './schools-edit.component';

describe('SchoolsEditComponent', () => {
  let component: SchoolsEditComponent;
  let fixture: ComponentFixture<SchoolsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchoolsEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoolsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
