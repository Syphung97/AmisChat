import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonFn } from 'src/app/core/functions/commonFn';
import { StringeeService } from 'src/app/core/services/stringee.service';
import { RouterModule, Routes, Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/core/services/users/user.service';
import {
  MessageContent,
  MessageData,
} from 'src/app/shared/models/stringee-model/MessageContent';
import { MessageType } from 'src/app/shared/enum/message-type.enum';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AppConfigService } from 'src/app/core/services/app-config.service';
import { StickerMap } from '../constants/sticker-maping';
import { FileType } from './message-upload-file/file-type';
import { DownloadService } from 'src/app/core/services/download.service';
import { UploadTypeEnum } from 'src/app/shared/enum/upload-type.enum';
import { AttachmentService } from 'src/app/shared/services/attachment.service';
import { LodashUtils } from 'src/app/core/functions/lodash-util';
import { NzImageService } from 'ng-zorro-antd/image';
import { UploadService } from 'src/app/core/services/upload.service';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from 'src/app/core/base.component';
import { AmisTranslationService } from 'src/app/core/services/amis-translation-service.service';
import { MessageAction } from '../models/MessageAction';
import { MentionFn } from 'src/app/core/functions/mentionFn';

declare var stickerBoxAQ: any;
declare var $: any;

@Component({
  selector: 'amis-message-composer',
  templateUrl: './message-composer.component.html',
  styleUrls: ['./message-composer.component.less'],
})
export class MessageComposerComponent extends BaseComponent implements OnInit {
  @ViewChild('emojiContainer', { static: false })
  emojiContainer!: ElementRef;

  @ViewChild('composer', { static: false })
  composer!: ElementRef;

  messageType = MessageType;

  inputValue = '';

  selectedEmoji: any;

  emojiToggled = false;

  currentStringeeUser: any;

  usersTyping = []; // mảng lưu user đang typing

  usersIdTyping = []; // mảng lưu id user đang typing

  timeoutTyping: any;

  selectedSticker: any;

  // Upload file
  isVisibleUploadfile = false;

  listFileUpload = new Array<any>();

  listImageUpload = new Array<any>();

  idMessageLoading: any;

  isVisibleUploadImage: any;

  visibleMentionPopover = false;

  listParticipant = new Array();

  listParticipantMention = new Array();

  @Output() onSendMessage = new EventEmitter();

  // tslint:disable-next-line:variable-name
  _conv!: any;
  @Input() set conv(data) {
    if (data) {

      if (data?.id != this._conv?.id) {
        this.resetComposer();
      }
      this._conv = data;
      this.getListParticipant(data);
    }
  }

  // tslint:disable-next-line:variable-name
  _replyObject?: MessageAction;
  @Input() set replyObject(data) {
    if (data) {
      this.getReplyName(data);
      this._replyObject = data;

      this.autoFocusInput();
    }
  }

  fallback =
    'data:image/png;base64,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';
  constructor(
    private route: ActivatedRoute,
    private stringeeService: StringeeService,
    private nzMessage: NzMessageService,
    private downloadSV: DownloadService,
    private attachmentSV: AttachmentService,
    private uploadSV: UploadService,
    private translateSV: AmisTranslationService,
    private activatedRoute: ActivatedRoute
  ) {
    super();
  }

  ngOnInit(): void {
    // lấy ra StringeeUserId để check typing
    this.currentStringeeUser = UserService.UserInfo.StringeeUserID;
  }

  onSelect(value: string): void { }

  /**
   * Toggle Emoji
   *
   * @memberof MessageComposerComponent
   */
  toggleEmoji(): void {
    this.emojiToggled = !this.emojiToggled;
    this.autoFocusInput();
  }

  /**
   * Add emoji to the input when user clicks on emoji
   * @param
   */
  addEmoji(event): void {
    try {
      this.selectedEmoji = event;
      // const curPos = MentionFn.getCurrentPosition(this.composer.nativeElement);
      // MentionFn.insertTextToPosition(this.composer.nativeElement, curPos, event.emoji.native);
      this.inputValue += event.emoji.native;
      this.composer.nativeElement.innerText += event.emoji.native;
      this.autoFocusInput();
      this.moveCursorToEnd();

      this.emojiToggled = false;
    } catch (error) {
      CommonFn.logger(error);
    }
  }

  @HostListener('window:click', ['$event'])
  handleClickOutsideIconContainer(event: MouseEvent): void {
    if (event['path']) {
      event['path'].forEach((element) => {
        if (element.classList?.contains('arena-chat')) {
          this.emojiToggled = false;
        }
      });
    }
  }

  inputHandler(e): void {
    this.emojiToggled = false;
    this.handleMention(e);
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();

      const idUrl = this.route.snapshot.paramMap.get('id');
      this.stringeeService.userEndTyping(idUrl, this.currentStringeeUser);
      this.sendMessage();
    }
    else {
      if (e.ctrlKey || e.shiftKey || e.keyCode < 48) {
      } else if (e) {
        if (this.composer.nativeElement.innerText?.trim().length >= 1000) {
          e.preventDefault();
          this.nzMessage.info('Độ dài không vượt quá 1000 kí tự');
          return;
        }
      }

      this.checkUserTyping();
    }

    if (this._conv.unreadCount) {
      this.markConversationAsRead(this._conv.id);
    }
  }

  sendMessage(): void {
    try {
      if (
        this.composer.nativeElement.innerText?.trim() ||
        this.listFileUpload.length ||
        this.listImageUpload.length
      ) {
        if (!this.listFileUpload.length && !this.listImageUpload.length) {
          this.sendText();
        } else if (this.listFileUpload.length) {
          if (this.composer.nativeElement.innerText?.trim()) {
            this.sendText();
          }
          this.sendFile();
        } else if (this.listImageUpload.length) {
          if (this.composer.nativeElement.innerText?.trim()) {
            this.sendText();
          }
          this.sendImage();
        }
        this.resetComposer();
      }
    } catch (error) {
      console.log(error);
    }
  }

  resetComposer(): void {
    this.listFileUpload = new Array<any>();
    this.listImageUpload = new Array<any>();
    this.listParticipant = new Array<any>();
    this.composer.nativeElement.innerText = '';
    this._replyObject = undefined;
  }

  sendText(): void {
    const messageContent = new MessageContent();
    messageContent.type = MessageType.Text;
    messageContent.message = new MessageData();
    messageContent.message.metadata = {
      Reference: this._replyObject?.payload,
    };
    messageContent.message.content = this.composer.nativeElement.innerText.replace(
      /\s+$/,
      ''
    );
    this.onSendMessage.emit(messageContent);
  }

  sendSticker(): void {
    const messageContent = new MessageContent();
    messageContent.type = MessageType.Sticker;
    messageContent.message = new MessageData();

    // messageContent.message.content = this.selectedSticker.data;
    messageContent.message.sticker = {
      name: this.selectedSticker.name,
      category: this.selectedSticker.cate,
    };

    messageContent.message.metadata = {
      MessageType: MessageType.Sticker,
      Reference: this._replyObject?.payload,
      // cate: this.selectedSticker.cate,
      // name: this.selectedSticker.name,
      // emotion: AppConfigService.settings.stickerCDN + this.selectedSticker.cate + "/" + StickerMap[this.selectedSticker.name]
    };
    this.onSendMessage.emit(messageContent);
    this.autoFocusInput();
  }

  moveCursorToEnd(): void {
    let range;
    let selection;
    if (document.createRange) {
      // Firefox, Chrome, Opera, Safari, IE 9+
      range = document.createRange(); // Create a range (a range is a like the selection but invisible)
      range.selectNodeContents(this.composer.nativeElement); // Select the entire contents of the element with the range
      range.collapse(false); // collapse the range to the end point. false means collapse to end rather than the start
      selection = window.getSelection(); // get the selection object (allows you to change selection)
      selection.removeAllRanges(); // remove any selections already made
      selection.addRange(range); // make the range you have just created the visible selection
    }
  }

  autoFocusInput(): void {
    setTimeout(() => {
      this.composer.nativeElement.focus();
    }, 500);
  }

  checkUserTyping(): void {
    clearTimeout(this.timeoutTyping);

    const idUrl = this.route.snapshot.paramMap.get('id');

    this.stringeeService.userBeginTyping(idUrl, this.currentStringeeUser);

    this.timeoutTyping = setTimeout(() => {
      this.stringeeService.userEndTyping(idUrl, this.currentStringeeUser);
    }, 300);
  }

  showSticker(event): void {
    const me = this;
    this.emojiToggled = false;
    if (stickerBoxAQ) {
      const target = $(event.target);
      stickerBoxAQ.showBox(target, (data, name, cate) => {
        this.selectedSticker = {
          data,
          name,
          cate,
        };

        this.sendSticker();
      });
    }
  }

  removeWhiteSpace(e): void {
    if (e.key === 'Enter' && !e.shiftKey) {
      this.composer.nativeElement.innerText = this.composer.nativeElement.innerText?.trim();
      // this.moveCursorToEnd();
    }
    if (e && (e.ctrlKey || e.metaKey)) {
      const arr = e.target.innerHTML?.split('<img src="data:image/');
      if (arr && arr.length > 1) {
        // xóa ảnh vừa thêm vào content
        e.target.innerHTML = arr[0];

        // nếu là paste ảnh
        const arrTempBase64 = arr[1]?.split('" alt="">');
        if (arrTempBase64 && arrTempBase64.length > 1) {
          const imageItem = arrTempBase64[0];
          e.target.innerHTML += arrTempBase64[1];
          this.moveCursorToEnd();
          if (
            !imageItem.includes('http://') ||
            !imageItem.includes('https://')
          ) {
            const image = 'data:image/' + arrTempBase64[0];
            const uploadedImage = this.dataBase64toFile(
              image,
              `${this.generateGuid()}.png`
            );

            if (
              uploadedImage.size / 1024 / 1024 <=
              AppConfigService.settings.maxSizeFile
            ) {
              // tslint:disable-next-line:max-line-length
              this.uploadSV
                .uploadMultiFileToTemp(
                  [uploadedImage],
                  UploadTypeEnum.MessengerImageAttachment
                )
                .pipe(takeUntil(this._onDestroySub))
                .subscribe(
                  (res) => {
                    if (res && res.Success) {
                      this.handleAfterUploadImage(res);
                    } else {
                      this.nzMessage.error(res.UserMessage);
                    }
                  },
                  (error) => {
                    // this.listLoadingImg = [];
                    // this.transferSV.showErrorToast(
                    //   this.translateSV.getValueByKey('UPLOAD_IMAGE_FAILED')
                    // );
                  }
                );
            } else {
              this.translateSV
                .getValueByKey('OVER_FILE_SIZE')
                .subscribe((data) => {
                  this.nzMessage.error(data);
                });
            }
          }
        }
      }
    }
  }

  markConversationAsRead(conversationId: any): void {
    this.stringeeService.markConversationAsRead(conversationId, (res) => {
      console.log('chuyển trạng thái đã đọc cho: ' + conversationId + res);
    });
  }

  onPaste(e): void {
    try {
      if (
        e.clipboardData.getData('Text').length +
        this.composer.nativeElement.innerText?.trim().length >=
        1000
      ) {
        this.translateSV
          .getValueByKey('OVER_MAX_LENGTH_MESSAGE')
          .subscribe((data) => {
            this.nzMessage.info(data);
          });

        e.preventDefault();
        return;
      }
    } catch (error) {
      CommonFn.logger(error);
    }
  }

  //#region Upload

  generateGuid(): any {
    // tslint:disable-next-line:one-variable-per-declaration
    let result, i, j;
    result = '';
    for (j = 0; j < 32; j++) {
      if (j == 8 || j == 12 || j == 16 || j == 20) result = result + '-';
      i = Math.floor(Math.random() * 16).toString(16);
      result = result + i;
    }
    return result;
  }

  dataBase64toFile(dataurl, filename): File {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  showControlUpload(): void {
    this.isVisibleUploadfile = true;
  }

  hideControlUpload(): void {
    this.isVisibleUploadfile = false;
  }

  handleAfterUpload(e): void {
    this.isVisibleUploadfile = false;
    this.nzMessage.success('Upload thành công');

    if (!this.listFileUpload?.length) {
      this.listFileUpload = e.Data;
    } else {
      this.listFileUpload.push(...e.Data);
    }
    this.listFileUpload.forEach((file) => {
      FileType.forEach((type) => {
        if (type.Value.includes(file.FileType)) {
          file.Type = type.Key;
        }
      });
      file.Type = file.Type ?? 'file-other';
    });
  }

  handleAfterUploadImage(e): void {
    this.nzMessage.success('Upload thành công');

    e.Data.forEach((d) => {
      d.PreviewUrl = this.downloadSV.makeApiDownloadTempFileHandle(
        d.FileID,
        UploadTypeEnum.MessengerImageAttachment
      );
    });
    if (!this.listImageUpload?.length) {
      this.listImageUpload = e.Data;
    } else {
      this.listImageUpload.push(...e.Data);
    }
  }

  sendFile(): void {
    const messageContent = new MessageContent();
    messageContent.type = MessageType.File;
    messageContent.message = new MessageData();

    messageContent.message.metadata = {
      MessageType: MessageType.File,
      ListFile: this.listFileUpload,
      Reference: this._replyObject?.payload,
    };
    this.idMessageLoading = this.nzMessage.loading('Đang gửi');
    this.attachmentSV
      .uploadAttachment(this.listFileUpload, this._conv.id)
      .subscribe((data) => {
        this.nzMessage.remove(this.idMessageLoading.messageId);
        if (data.Success) {
          this.onSendMessage.emit(messageContent);
          this.autoFocusInput();
        }
      });
  }

  sendImage(): void {
    const messageContent = new MessageContent();
    messageContent.type = MessageType.Photo;
    messageContent.message = new MessageData();

    messageContent.message.metadata = {
      MessageType: MessageType.Photo,
      ListFile: this.listImageUpload,
      Reference: this._replyObject?.payload,
    };
    this.idMessageLoading = this.nzMessage.loading('Đang gửi');
    this.attachmentSV
      .uploadAttachment(
        this.listImageUpload,
        this._conv.id,
        UploadTypeEnum.MessengerImageAttachment
      )
      .subscribe((data) => {
        this.nzMessage.remove(this.idMessageLoading.messageId);
        if (data.Success) {
          this.onSendMessage.emit(messageContent);
          this.autoFocusInput();
        }
      });
  }

  removeAttachment(i, isImage = false): void {
    if (isImage) {
      this.listImageUpload.splice(i, 1);
    } else {
      this.listFileUpload.splice(i, 1);
    }
  }

  showUploadImage(): void {
    this.isVisibleUploadImage = LodashUtils.cloneDeepData({ isvisible: true });
  }

  handleFocusInput(): void {
    stickerBoxAQ?.hideBox();
  }

  cancelReply(): void {
    this._replyObject = undefined;
  }

  getReplyName(data): void {
    data.payload.senderName = CommonFn.getUserByStringeeID(
      data.payload.sender
    )?.DisplayName;
  }

  getListParticipant(data): void {
    data?.participants.forEach(e => {
      this.listParticipant.push(CommonFn.getUserByStringeeID(e.userId));
    });
    if (this.listParticipant.length) {

      this.listParticipant[0].IsActive = true;
    }
  }

  handleMention(e): void {
    if (e.key === '@') {
      this.visibleMentionPopover = true;
    }
    else {
      this.visibleMentionPopover = false;
    }

  }

  handleSelectParticipant(item, i): void {
    this.listParticipant.forEach(e => e.IsActive = false);
    this.listParticipant[i].IsActive = true;
    this.insertMention();
  }


  insertMention(): void {
    const mentionSelected = this.listParticipant.find(e => e.IsActive == true);

    this.processHTMLMention(mentionSelected.DisplayName, this.composer.nativeElement);

    this.listParticipant.forEach(e => e.IsActive = false);
    this.listParticipant[0].IsActive = true;
    this.visibleMentionPopover = false;
  }

  processHTMLMention(text: string, target: HTMLElement): void {
    const curPos = MentionFn.getCurrentPosition(target);

    const focusElement = MentionFn.getFocusElement();

    if (focusElement.isEqualNode(target)) {
      focusElement.innerHTML = MentionFn.createTag(text, false);

      const nextSpan = document.createElement("span");
      nextSpan.innerText = " ";
      focusElement.appendChild(nextSpan);
      MentionFn.setCaretPosition(focusElement, curPos + text.length + 1);
    }

  }
  //#endregion
}
