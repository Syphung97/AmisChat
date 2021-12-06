import { EventEmitter, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
// tslint:disable-next-line:semicolon
import { StringeeClient, StringeeChat, StringeeCall } from "stringee-chat-js-sdk";


@Injectable({ providedIn: 'root' })
export class StringeeService {
  stringeeClient;
  stringeeChat;
  stringeeCall;

  stringeeObjectChange = new EventEmitter();

  stringeeRevokeMessage = new EventEmitter();

  // khi quản trị viên xóa thành viên
  stringeeRemoveParticipantFromServer = new EventEmitter();

  stringeeUserBeginTyping = new EventEmitter();
  stringeeUserEndTyping = new EventEmitter();


  // Call

  call;
  stringeeIncomingCall = new EventEmitter();

  stringeeAddRemoteStream = new EventEmitter();

  stringeeAddLocalStream = new EventEmitter();

  stringeeSignalingState = new EventEmitter();

  stringeeMediaState = new EventEmitter();

  stringeeError = new EventEmitter();

  stringeeMakeCall = new EventEmitter();

  stringeeAnswerCall = new EventEmitter();

  stringeeRejectCall = new EventEmitter();

  stringeeHangUpCall = new EventEmitter();

  stringeeMuteCall = new EventEmitter();

  stringeeLocalVideoEnabled = new EventEmitter();

  stringeeOtherDeviceAuthen = new EventEmitter();

  constructor() {
    this.stringeeClient = new StringeeClient();
    this.stringeeChat = new StringeeChat(this.stringeeClient);
    this.stringeeCall = new StringeeCall(this.stringeeClient);
    this.settingClientEvents(this.stringeeClient);

    this.addListener();
    this.onObjectChange(undefined);
    this.onRevokeMessage();
    this.onRemoveParticipantFromServer();
    this.onUserBeginTyping();
    this.onUserEndTyping();
  }



  connect(accessToken: string): void {
    this.stringeeClient.connect(accessToken);
    console.log("sucess");
  }

  onObjectChange(callback: any): void {
    if (callback) {
      this.stringeeChat.on('onObjectChange', callback);
    }
    else {
      this.stringeeChat.on('onObjectChange', (info) => {
        this.stringeeObjectChange.emit(info);
      });
    }

  }

  onConnect(callback): void {
    this.stringeeClient.on('connect', callback);
  }

  onAuthent(callback): void {
    this.stringeeClient.on('connect', callback);
  }
  onRevokeMessage(): void {
    this.stringeeChat.on('revokeMsgFromServer', (info) => {
      console.log('revokeMsgFromServer ' + JSON.stringify(info));
      this.stringeeRevokeMessage.emit(info);
    });
  }

  onRemoveParticipantFromServer(): void {
    this.stringeeChat.on('removeParticipantFromServer', (info) => {
      console.log('removeParticipantFromServer ' + JSON.stringify(info));
      this.stringeeRemoveParticipantFromServer.emit(info);
    });
  }

  addListener(): void {

    this.stringeeClient.on('authen', (res: any) => {
      console.log('authen', res);
    });

    this.stringeeClient.on('disconnect', () => {
      console.log('++++++++++++++ disconnected');
    });

    // this.stringeeChat.on('removeParticipantFromServer', (info) => {
    //   console.log('removeParticipantFromServer ' + JSON.stringify(info));
    // });
  }


  //#region  User
  getUsersInfo(userIds: any, callback: any): void {
    this.stringeeChat.getUsersInfo(userIds, callback);
  }


  // Hàm cập nhật thông tin một user , up date lên stringee
  updateUserInfo(data: any, callback: any): void {

    this.stringeeChat.updateUserInfo(data, callback);
  }

  getUserInfo(userIds: any, callback): void {
    this.stringeeChat.getUsersInfo(userIds, callback);
  }
  //#endregion


  //#region Conversation


  /**
   * Tạo cuộc trò chuyện
   *
   * @param {Array<string>} userIDs
   * @param {ConversationOption} options
   * @param {*} callback
   * @memberof StringeeService
   */
  createConversation(userIDs: Array<string>, options, callback: any): void {
    this.stringeeChat.createConversation(userIDs, options, callback);
  }
  /**
   * lấy thông tin conversation cụ thể
   * @param convId id
   * @param callback
   */
  getConversationById(convId: any, callback): void {
    this.stringeeChat.getConversationById(convId, callback);
  }
  /**
   * Lấy dữ liệu các cuộc trò chuyện
   *
   * @param {number} count
   * @param {boolean} isAscending
   * @param {*} callback
   * @memberof StringeeService
   */
  getLastConversation(count: number, isAscending: boolean, callback: any): void {
    this.stringeeChat.getLastConversations(count, isAscending, callback);
  }

  /**
   * Lấy dữ liệu các cuộc trò chuyện
   *
   * @param {number} count
   * @param {boolean} isAscending
   * @param {*} callback
   * @memberof StringeeService
   */
  getConversationsAfter(datetime: Date, count: number, isAscending: boolean, callback: any): void {
    this.stringeeChat.getConversationsAfter(datetime, count, isAscending, callback);
  }

  /**
   * Lấy dữ liệu các cuộc trò chuyện
   *
   * @param {number} count
   * @param {boolean} isAscending
   * @param {*} callback
   * @memberof StringeeService
   */

  getConversationsBefore(datetime: Date, count: number, isAscending: boolean, callback: any): void {
    this.stringeeChat.getConversationsAfter(datetime, count, isAscending, callback);
  }

  /**
   * Thêm người vào cuộc trò chuyện
   *
   * @param {string} convId
   * @param {*} userIds
   * @param {any} callback
   * @memberof StringeeService
   */
  addPaticipants(convId: string, userIds: any, callback: any): void {
    this.stringeeChat.addParticipants(convId, userIds, callback);
  }


  /**
   * Remove người vào cuộc trò chuyện
   *
   * @param {string} convId
   * @param {*} userIds
   * @param {any} callback
   * @memberof StringeeService
   */
  removePaticipants(convId: string, userIds: any, callback: any): void {
    this.stringeeChat.removeParticipants(convId, userIds, callback);
  }

  /**
   * Update conversation
   *
   * @param {string} convId
   * @param {*} params
   * @param {*} callback
   * @memberof StringeeService
   */
  updateConversation(convId: string, params: any, callback: any): void {
    this.stringeeChat.updateConversation(convId, params, callback);
  }

  /**
   * Xóa cuộc trò chuyện
   *
   * @param {string} convId
   * @param {*} callback
   * @memberof StringeeService
   */
  deleteConversation(convId: string, callback: any): void {
    this.stringeeChat.deleteConversation(convId, callback);
  }

  //#endregion

  //#region Message

  /**
   * Gửi tin nhắn
   *
   * @param {Message} message
   * @param {any} callback
   * @memberof StringeeService
   */
  sendMessage(message: any, callback): void {
    this.stringeeChat.sendMessage(message, callback);
  }

  /**
   * getLastMss
   *
   * @param {string} convId
   * @param {number} count
   * @param {boolean} isAscending
   * @param {*} callback
   * @memberof StringeeService
   */
  getLastMessages(convId: string, count: number, isAscending: boolean, callback: any): void {
    this.stringeeChat.getLastMessages(convId, count, isAscending, callback);
  }

  /**
   * To get a list of messages tied to a conversation from server which have sequence smaller than seq, you call:
   *
   * @param {any} convId
   * @param {any} sequence
   * @param {any} count
   * @param {any} isAscending
   * @param {any} callback
   * @memberof StringeeService
   */
  getMessagesBefore(convId, sequence, count, isAscending, callback): void {
    this.stringeeChat.getMessagesBefore(convId, sequence, count, isAscending, callback);
  }


  /**
   * xóa tin nhắn
   * @param convId
   * @param msgId
   * @param callback
   */
  deleteMessage(convId: string, msgId: string, callback: any): void {
    this.stringeeChat.deleteMessage(convId, msgId, callback);
  }
  /**
   *
   * @param convId thu hồi tin nhắn
   * @param msgId
   * @param callback
   */
  revokeMessage(convId: string, msgId: string, callback: any): void {
    this.stringeeChat.revokeMessage(convId, msgId, callback);
  }

  /**
   * cập nhật trạng thái tin nhắn là đã đọc
   * @param convId
   * @param callback
   */
  markConversationAsRead(convId, callback): void {
    this.stringeeChat.markConversationAsRead(convId, callback);
  }
  /**
   *
   * @param callback object onchange khi thu hồi tin nhắn
   */
  revokeMsgFromServer(callback): void {
    this.stringeeChat.on('revokeMsgFromServer', callback);
  }
  //#endregion

  //#region decode Token
  /**
   * @param token
   */
  decodeToken(token): string {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  }



  //#endregion

  //#region typing
  /**
   * hàm xử lí khi user ghõ tin nhắn trong cuộc trò chuyện
   * @param convId
   * @param userId
   */
  userBeginTyping(convId, userId): void {
    if (convId && userId) {
      const body = { userId, convId };
      this.stringeeChat.userBeginTyping(body, (res) => {

      });
    }
  }
  /**
   * hàm xử lí khi user dừng ghõ tin nhắn trong cuộc trò chuyện
   * @param convId
   * @param userId
   */
  userEndTyping(convId, userId): void {

    if (convId && userId) {
      const body = { userId, convId };
      this.stringeeChat.userEndTyping(body, (res) => {
      });
    }
  }

  onUserBeginTyping(): void {
    this.stringeeClient.on("userBeginTypingListener", (msg) => {


      this.stringeeUserBeginTyping.emit(msg);
    });
  }

  onUserEndTyping(): void {
    // kích hoạt sự kiện khi người dùng dừng gõ tin nhắn - xóa người dùng dừng gõ tin nhắn khỏii mảng
    this.stringeeClient.on("userEndTypingListener", (msg) => {
      this.stringeeUserEndTyping.emit(msg);
    });
  }



  //#endregion


  //#region Call

  settingClientEvents(client): void {
    client.on('incomingcall', (incomingcall) => {
      this.call = incomingcall;
      this.settingCallEvent(incomingcall);

      this.call.videoResolution = { width: 1280, height: 720 };



      this.call.ringing((res) => {
        console.log(res);
      });
      this.stringeeIncomingCall.emit(incomingcall);
      console.log('++++++++++++++ incomingcall', incomingcall);
    });
  }

  settingCallEvent(call): void {


    call.on('addremotestream', (stream) => {
      console.log('addremotestream');
      // reset srcObject to work around minor bugs in Chrome and Edge.
      // remoteVideo.srcObject = null;
      // remoteVideo.srcObject = stream;
      this.stringeeAddRemoteStream.emit(stream);
    });

    call.on('addlocalstream', (stream) => {
      console.log('addlocalstream');
      // reset srcObject to work around minor bugs in Chrome and Edge.
      // localVideo.srcObject = null;
      // localVideo.srcObject = stream;
      this.stringeeAddLocalStream.emit(stream);
    });

    call.on('error', (info) => {
      console.log('on error: ' + JSON.stringify(info));
      this.stringeeError.emit(info);
    });

    call.on('signalingstate', (state) => {
      console.log('signalingstate ', state);
      const reason = state.reason;
      this.stringeeSignalingState.emit(state);
    });


    call.on('mediastate', (state) => {
      console.log('mediastate ', state);

      this.stringeeMediaState.emit(state);
    });

    call.on('info', (info) => {
      console.log('on info:' + JSON.stringify(info));
    });

    call.on('otherdevice', (data) => {
      console.log('on otherdevice:' + JSON.stringify(data));
      if ((data.type === 'CALL_STATE' && data.code >= 200) || data.type === 'CALL_END') {
        this.stringeeOtherDeviceAuthen.emit();
      }
    });
  }


  makeCall(isVideoCall, fromNumber, toNumber, fromAlias, avatar): void {
    this.call = new StringeeCall(this.stringeeClient, fromNumber, toNumber, isVideoCall);
    this.call.custom = { avatar };
    this.call.fromAlias = fromAlias;
    this.settingCallEvent(this.call);
    console.log(this.call);
    this.call.makeCall((res) => {
      console.log('make call callback: ' + JSON.stringify(res));
      this.stringeeMakeCall.emit(res);
    });
  }

  answerCall(): void {
    this.call.answer((res) => {
      console.log('answer res', res);
      this.stringeeAnswerCall.emit(res);
    });
  }

  rejectCall(): void {
    this.call.reject((res) => {
      console.log('reject res', res);
      this.stringeeRejectCall.emit(res);
    });
  }

  hangupCall(): void {
    this.call.hangup((res) => {
      console.log('hangup res', res);
      this.stringeeHangUpCall.emit(res);
    });
  }

  upgradeToVideoCall(): void {
    this.call.upgradeToVideoCall();
  }

  switchVoiceVideoCall(): void {
    const info = { requestVideo: true };

    console.log('please using upgradeToVideoCall() method to enable/disable local video, send request enable video to "partner"');

    this.call.sendInfo(info, (res) => {
      console.log('switchVoiceVideoCall', res);
    });
  }

  mute(): void {
    const muted = !this.call.muted;
    this.call.mute(muted);
    this.stringeeMuteCall.emit(this.call.muted);
  }

  enableVideo(): void {
    let success;
    if (this.call.localVideoEnabled) {
      success = this.call.enableLocalVideo(false);
    } else {
      success = this.call.enableLocalVideo(true);
    }
    console.log('enableVideo result: ' + success);
    this.stringeeLocalVideoEnabled.emit(this.call.localVideoEnabled);
  }
  //#endregion

}
