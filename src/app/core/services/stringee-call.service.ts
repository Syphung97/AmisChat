import { Injectable, Output, EventEmitter } from '@angular/core';
import { StringeeClient, StringeeCall } from "stringee-chat-js-sdk";
@Injectable({
  providedIn: 'root'
})
export class StringeeCallService {
  stringeeClient;

  call;

  @Output() stringeeIncomingCall = new EventEmitter();

  @Output() stringeeAddRemoteStream = new EventEmitter();

  @Output() stringeeAddLocalStream = new EventEmitter();

  @Output() stringeeSignalingState = new EventEmitter();

  @Output() stringeeMediaState = new EventEmitter();

  @Output() stringeeError = new EventEmitter();

  @Output() stringeeMakeCall = new EventEmitter();

  @Output() stringeeAnswerCall = new EventEmitter();

  @Output() stringeeRejectCall = new EventEmitter();

  @Output() stringeeHangUpCall = new EventEmitter();

  @Output() stringeeMuteCall = new EventEmitter();

  @Output() stringeeLocalVideoEnabled = new EventEmitter();

  constructor() {
    this.stringeeClient = new StringeeClient();
    this.settingClientEvents(this.stringeeClient);
  }

  settingClientEvents(client): void {
    client.on('incomingcall', (incomingcall) => {
      this.call = incomingcall;
      this.settingCallEvent(incomingcall);

      // call.videoResolution = {width: 1280, height: 720};



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
      }
    });
  }


  makeCall(isVideoCall, fromNumber, toNumber, fromAlias, avatar): void {
    this.call = new StringeeCall(this.stringeeClient, fromNumber, toNumber, isVideoCall);
    this.call.custom = { avatar };
    this.call.fromAlias = fromAlias;
    this.settingCallEvent(this.call);

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
}
