import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { takeUntil } from 'rxjs/operators';
import { CallError } from 'src/app/call/enum/call-error.enum';
import { CallState } from 'src/app/call/enum/call-state.enum';
import { BaseComponent } from 'src/app/core/base.component';
import { AmisTranferDataService } from 'src/app/core/services/amis-tranfer-data.service';
import { AmisTranslationService } from 'src/app/core/services/amis-translation-service.service';
import { StringeeService } from 'src/app/core/services/stringee.service';
import { UserService } from 'src/app/core/services/users/user.service';
import { CommonAnimation } from 'src/app/shared/animations/animation';
import { StringeeObjectChange } from 'src/app/shared/enum/stringee-object-change.enum';

@Component({
  selector: 'amis-conversation-header',
  templateUrl: './conversation-header.component.html',
  styleUrls: ['./conversation-header.component.scss'],
  animations: [CommonAnimation.showItem],
})
export class ConversationHeaderComponent
  extends BaseComponent
  implements OnInit {
  // tslint:disable-next-line:variable-name
  _conversation: any;

  isVisibleInCommingCall = false;

  isVisibleOutComingCall = false;

  isCallVideo;

  inComingCallObject;

  localStream;

  remoteStream;

  signalingState;

  isLoading: any;

  @Input() set conversation(data: any) {
    this._conversation = data;
  }

  @Input() messageSV: any;
  constructor(
    private stringeeService: StringeeService,
    private stringeeCallService: StringeeService,
    private translateSV: AmisTranslationService,
    private tranferSV: AmisTranferDataService
  ) {
    super();
  }

  ngOnInit(): void {
    this.subScribeCallEvent();
  }

  handleRealTimeUpdate(data: any): void {
    if (data.objectType == StringeeObjectChange.ConvChange) {
      this.conversation = data.objectChanges[0];
    }
  }

  getConversationById(): void {
    this.stringeeService.getConversationById(
      this._conversation.id,
      (status, code, message, conv) => {
        conv.status = this._conversation.status;
        this._conversation.name = conv.name;
      }
    );
  }

  subScribeCallEvent(): void {
    this.stringeeCallService.stringeeError
      .pipe(takeUntil(this._onDestroySub))
      .subscribe((data) => {
        this.refreshCall();
      });
    this.stringeeCallService.stringeeIncomingCall
      .pipe(takeUntil(this._onDestroySub))
      .subscribe((data) => {
        this.inComingCallObject = data;
        this.isVisibleInCommingCall = true;
        this.isCallVideo = data.isVideoCall;
        this.tranferSV.newCallCome(true);
      });

    this.stringeeCallService.stringeeAddRemoteStream
      .pipe(takeUntil(this._onDestroySub))
      .subscribe((data) => {
        this.remoteStream = data;
      });

    this.stringeeCallService.stringeeAddLocalStream
      .pipe(takeUntil(this._onDestroySub))
      .subscribe((data) => {
        this.localStream = data;
      });

    // make call
    this.stringeeCallService.stringeeMakeCall
      .pipe(takeUntil(this._onDestroySub))
      .subscribe((data) => {
        this.messageSV.remove(this.isLoading.messageId);
        if (data.r == CallError.SUCCESS) {
          this.isVisibleOutComingCall = true;
        } else {
          this.refreshCall();

          this.translateSV.getValueByKey(data.message).subscribe((d) => {
            this.messageSV.error(d);
          });
        }
      });

    // Reject
    this.stringeeCallService.stringeeRejectCall
      .pipe(takeUntil(this._onDestroySub))
      .subscribe((data) => {
        this.refreshCall();
      });

    // Hangup
    this.stringeeCallService.stringeeHangUpCall
      .pipe(takeUntil(this._onDestroySub))
      .subscribe((data) => {
        if (data.r == CallError.SUCCESS) {
          this.refreshCall();
        }
      });

    // Answer
    this.stringeeCallService.stringeeAnswerCall
      .pipe(takeUntil(this._onDestroySub))
      .subscribe((data) => {
        if (data.r == CallError.SUCCESS) {
          this.isVisibleInCommingCall = false;
          this.isVisibleOutComingCall = true;
        }
      });

    this.stringeeCallService.stringeeSignalingState
      .pipe(takeUntil(this._onDestroySub))
      .subscribe((data) => {
        this.signalingState = data;
        if (data.code == CallState.RINGING) {
          this.tranferSV.newCallCome(false);
        }
        if (data.code == CallState.ANSWERED) {
          this.tranferSV.newCallCome(false);
        }
        if (data.code == CallState.ENDED || data.code == CallState.BUSY) {
          this.refreshCall();
        }
      });
    this.stringeeCallService.stringeeOtherDeviceAuthen
      .pipe(takeUntil(this._onDestroySub))
      .subscribe(() => {
        this.refreshCall();
      });

    this.stringeeCallService.stringeeMediaState
      .pipe(takeUntil(this._onDestroySub))
      .subscribe((data) => {
        // Disconnect
        if (data.code == 2) {
          this.stringeeCallService.hangupCall();
        }
      });
  }

  refreshCall(): void {
    this.localStream = null;
    this.remoteStream = null;
    this.inComingCallObject = null;
    this.isVisibleInCommingCall = false;
    this.isVisibleOutComingCall = false;
    this.tranferSV.newCallCome(false);
  }

  makeCall(isCallVideo): void {
    this.isLoading = this.messageSV.loading('Đang gọi');
    this.isCallVideo = isCallVideo;
    // this.isVisibleOutComingCall = true;

    const participants = this._conversation.participants;

    const caller = participants?.find(
      (e) => e.userId == UserService.UserInfo.StringeeUserID
    );
    const callee = participants?.find(
      (e) => e.userId != UserService.UserInfo.StringeeUserID
    );

    this.stringeeCallService.makeCall(
      isCallVideo,
      caller.userId,
      callee.userId,
      caller.name,
      caller.avatar
    );
  }

  handleCallAnswer(isAnswer): void {
    // Answer
    if (isAnswer) {
      this.stringeeCallService.answerCall();
    }
    // Reject
    else {
      this.stringeeCallService.rejectCall();
    }
    this.tranferSV.newCallCome(false);
  }

  hangUpCall(): void {
    this.stringeeCallService.hangupCall();
  }

  enableVideoCall(): void {
    this.stringeeService.enableVideo();
  }

  mute(): void {
    this.stringeeService.mute();
  }
}
