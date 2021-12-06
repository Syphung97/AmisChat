import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageUploadFileComponent } from './message-upload-file.component';

describe('MessageUploadFileComponent', () => {
  let component: MessageUploadFileComponent;
  let fixture: ComponentFixture<MessageUploadFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessageUploadFileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageUploadFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
