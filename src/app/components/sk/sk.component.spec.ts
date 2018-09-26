import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkComponent } from './sk.component';

describe('SkComponent', () => {
  let component: SkComponent;
  let fixture: ComponentFixture<SkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
