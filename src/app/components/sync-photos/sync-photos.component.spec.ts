import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SyncPhotosComponent } from './sync-photos.component';

describe('SyncPhotosComponent', () => {
  let component: SyncPhotosComponent;
  let fixture: ComponentFixture<SyncPhotosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SyncPhotosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SyncPhotosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
