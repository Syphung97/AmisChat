import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  IterableDiffers,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { UserService } from 'src/app/core/services/users/user.service';
import { MessageStatus } from '../enums/message-status.enum';
import { MessageType } from '../../shared/enum/message-type.enum';
import { Message } from '../models/Message';
import { CommonFn } from 'src/app/core/functions/commonFn';
import { StringeeService } from 'src/app/core/services/stringee.service';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from 'src/app/core/base.component';

@Component({
  selector: 'amis-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.less'],
})
export class MessageListComponent
  extends BaseComponent
  implements OnInit, OnChanges {
  @ViewChild('scrollable', { static: true })
  scroll!: ElementRef;

  // tslint:disable-next-line:variable-name
  _listMessage = new Array<Message>();
  @Input() set listMessage(data: Array<Message>) {
    try {
      if (data) {
        data.forEach((e) => {
          e.isLastMessage = true;
        });

        for (let index = data.length - 1; index > 0; index--) {
          if (
            data[index]?.sender == data[index - 1]?.sender &&
            data[index].type != MessageType.Notification &&
            data[index].type != MessageType.Creation &&
            !this.isDateDifferent(
              data[index - 1].createdAt,
              data[index].createdAt
            )
            && !data[index - 1].content?.metadata?.Reference
          ) {
            data[index - 1].isLastMessage = false;
          }
        }

        for (let index = data.length - 1; index > 0; index--) {
          if (
            data[index]?.sender != data[index - 1]?.sender ||
            data[index - 1].type == MessageType.Notification ||
            data[index - 1].type == MessageType.Creation ||
            this.isDateDifferent(
              data[index - 1].createdAt,
              data[index].createdAt
            ) ||
            data[index - 1].content?.metadata?.Reference
          ) {

            data[index].isFirstMessage = true;
          }
        }

        this._listMessage = data;
        setTimeout(() => {
          this.scroll.nativeElement.scrollTop = this.scroll.nativeElement.scrollHeight;
          this.isViewMoreMessage = false;
        }, 0);
      }
    } catch (error) {
      CommonFn.logger(error);
    }
  }
  // tslint:disable-next-line:variable-name
  _conv: any;
  @Input() set conv(data) {
    this._conv = data;
  }

  @Input() set messageComing(data) {
    if (
      this._listMessage[this._listMessage.length - 2] &&
      this._listMessage[this._listMessage.length - 1] &&
      this._listMessage[this._listMessage.length - 2]?.sender ==
        this._listMessage[this._listMessage.length - 1]?.sender
    ) {
      this._listMessage[this._listMessage.length - 2].isLastMessage = false;
      this._listMessage[this._listMessage.length - 1].isLastMessage = true;
    } else if (
      this._listMessage[this._listMessage.length - 2] &&
      this._listMessage[this._listMessage.length - 1] &&
      this._listMessage[this._listMessage.length - 2]?.sender !=
        this._listMessage[this._listMessage.length - 1]?.sender
    ) {
      this._listMessage[this._listMessage.length - 1].isFirstMessage = true;
      this._listMessage[this._listMessage.length - 1].isLastMessage = true;
    }
    setTimeout(() => {
      this.scroll.nativeElement.scrollTo({
        top: this.scroll.nativeElement.scrollHeight,
        behavior: 'smooth',
      });
    }, 10);
    this.cdr.detectChanges();
  }

  typingIndicatorObject: any;

  @Output() actionGenerate = new EventEmitter();

  @Output() onReachTop = new EventEmitter();

  MessageStatus = MessageStatus;

  MessageType = MessageType;

  currentUserStringeeID;

  isViewMoreMessage = false;
  constructor(
    private stringeeService: StringeeService,
    private differs: IterableDiffers,
    private cdr: ChangeDetectorRef
  ) {
    super();
  }
  ngOnChanges(changes: SimpleChanges): void {}

  ngOnInit(): void {
    this.currentUserStringeeID = UserService.UserInfo.StringeeUserID;
    this.subScriber();
  }

  subScriber(): void {
    try {
      this.stringeeService.stringeeUserBeginTyping
        .pipe(takeUntil(this._onDestroySub))
        .subscribe((data) => {
          if (data.convId == this._conv.id) {
            this.typingIndicatorObject = data;
          } else {
            this.typingIndicatorObject = null;
          }
        });

      this.stringeeService.stringeeUserEndTyping
        .pipe(takeUntil(this._onDestroySub))
        .subscribe((data) => {
          if (data.convId == this._conv.id) {
            this.typingIndicatorObject = null;
          }
        });
    } catch (error) {
      CommonFn.logger(error);
    }
  }

  /**
   * Compares two dates and sets Date on a a new day
   */
  isDateDifferent(firstDate, secondDate): boolean | undefined {
    try {
      // tslint:disable-next-line:one-variable-per-declaration
      let firstDateObj: Date, secondDateObj: Date;
      firstDateObj = new Date(firstDate);
      secondDateObj = new Date(secondDate);
      if (
        firstDateObj.getDate() === secondDateObj.getDate() &&
        firstDateObj.getMonth() === secondDateObj.getMonth() &&
        firstDateObj.getFullYear() === secondDateObj.getFullYear()
      ) {
        return false;
      }
      return true;
    } catch (error) {
      return;
    }
  }

  handleAction(e): void {
    this.actionGenerate.emit(e);
  }

  onScroll(event): void {
    const scrollheight = event.target.scrollHeight;
    const scrollTop = event.target.scrollTop;
    const height = event.target.offsetHeight;
    if (scrollTop < 150) {
      this.onReachTop.emit();
      this.isViewMoreMessage = true;
    }
  }
}
