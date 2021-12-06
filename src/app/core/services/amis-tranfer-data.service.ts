import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AmisTranferDataService {
  @Output() afterGetUserInfo = new EventEmitter();

  @Output() afterDeleteConversation = new EventEmitter();

  @Output() onBlurContent = new EventEmitter();

  @Output() onSendFile = new EventEmitter();

  @Output() onNewMessage = new EventEmitter();

  @Output() onNewCall = new EventEmitter();

  constructor() { }


  /**
   * Xử lí sau khi get user info
   *
   * @param {boolean} isSuccess
   * @memberof AmisTranferDataService
   */
  handleAfterGetUserInfo(isSuccess: boolean): void {
    this.afterGetUserInfo.emit(isSuccess);
  }

  handleDeleteConversation(): void {
    this.afterDeleteConversation.emit();
  }

  blueContent(): void {
    this.onBlurContent.emit();
  }

  sendFile(data): void {
    this.onSendFile.emit(data);
  }
  newMessameCome(data): void {
    this.onNewMessage.emit(data);
  }

  newCallCome(data): void {
    this.onNewCall.emit(data);
  }


}