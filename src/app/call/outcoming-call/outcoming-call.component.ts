import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { UserService } from 'src/app/core/services/users/user.service';
import { CallState } from '../enum/call-state.enum';
import { StringeeService } from 'src/app/core/services/stringee.service';
import { interval } from 'rxjs';
import { map } from 'rxjs/operators';
@Component({
  selector: 'amis-outcoming-call',
  templateUrl: './outcoming-call.component.html',
  styleUrls: ['./outcoming-call.component.less'],
})
export class OutcomingCallComponent implements OnInit, OnDestroy {
  @ViewChild('localVideo', { static: true }) localVideo;

  @ViewChild('remoteVideo', { static: true }) remoteVideo;

  // tslint:disable-next-line:variable-name
  _callee;
  // tslint:disable-next-line:variable-name
  _caller;
  // tslint:disable-next-line:variable-name
  _conv;
  @Input() set conv(data) {
    if (data) {
      this._conv = data;
    }
  }

  // tslint:disable-next-line:variable-name
  _inComingCallObject: any;
  @Input() set inComingCallObject(data) {
    if (data) {
      this._inComingCallObject = data;
      this.counterTimeTick += 1000;
      const id = data.toNumber;
      this.stringeeSV.getUserInfo([id], (status, code, message, users) => {
        this._caller = users[0];
      });

      this.stringeeSV.getUserInfo(
        [data.fromNumber],
        (status, code, message, users) => {
          console.log('callee' + JSON.stringify(users));

          this._callee = users[0];
        }
      );
    }
  }

  // tslint:disable-next-line:variable-name
  _signalingstate;
  @Input() set signalingstate(data) {
    if (data) {
      this._signalingstate = data;
      console.log('_signalingstate');

      console.log(data);
    }
  }

  // tslint:disable-next-line:variable-name
  _localStream;
  @Input() set localStream(data) {
    if (data) {
      this._localStream = data;
      console.log('local stream');
      setTimeout(() => {
        const video = document.getElementById('localVideo') as HTMLVideoElement;
        video.srcObject = data;
        video.muted = true;
        // this.localVideo.nativeElement.srcObject = data;
      }, 500);
    }
  }
  // tslint:disable-next-line:variable-name
  _remoteStream;
  @Input() set remoteStream(data) {
    if (data) {
      this._remoteStream = data;
      console.log('remote stream');
      setTimeout(() => {
        const video = document.getElementById(
          'remoteVideo'
        ) as HTMLVideoElement;
        video.srcObject = data;
        video.muted = false;
        // this.remoteVideo.nativeElement.srcObject = data;
      }, 500);
    }
  }

  @Input() isVideoCall;

  callState = CallState;

  isDisableVoice = false;

  @Output() disableVoice = new EventEmitter();

  @Output() disableVideo = new EventEmitter();

  @Output() onCancleCall = new EventEmitter();

  counterTimeTick = 0;
  constructor(private overlay: Overlay, private stringeeSV: StringeeService) {}

  ngOnInit(): void {
    this.getCallee();
  }

  ngOnDestroy(): void {}

  getCallee(): void {
    try {
      if (!this._conv.isGroup) {
        if (!this._inComingCallObject) {
          const participants = this._conv.participants;
          this._callee = participants?.find(
            (e) => e.userId != UserService.UserInfo.StringeeUserID
          );
          this._caller = participants?.find(
            (e) => e.userId == UserService.UserInfo.StringeeUserID
          );
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  cancleCall(): void {
    this.onCancleCall.emit();
  }

  enableVideoCall(): void {
    this.disableVideo.emit();
  }

  mute(): void {
    this.disableVoice.emit();
    this.isDisableVoice = !this.isDisableVoice;
  }

  attach(e): void {
    console.log(e);
  }
}
