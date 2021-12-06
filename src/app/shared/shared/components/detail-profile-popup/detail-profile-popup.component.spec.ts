import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailProfilePopupComponent } from './detail-profile-popup.component';

describe('DetailProfilePopupComponent', () => {
  let component: DetailProfilePopupComponent;
  let fixture: ComponentFixture<DetailProfilePopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailProfilePopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailProfilePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
