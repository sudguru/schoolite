import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreparePhotosComponent } from './prepare-photos.component';

describe('PreparePhotosComponent', () => {
  let component: PreparePhotosComponent;
  let fixture: ComponentFixture<PreparePhotosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreparePhotosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreparePhotosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
