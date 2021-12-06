import { Component, ElementRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import { BaseComponent } from 'src/app/core/base.component';
import { UserService } from 'src/app/core/services/users/user.service';
import { ActivatedRoute } from '@angular/router';
import { CommonFn } from 'src/app/core/functions/commonFn';
import { AttachmentService } from 'src/app/shared/services/attachment.service';
import { FileType } from 'src/app/messages/message-composer/message-upload-file/file-type';
import { UploadTypeEnum } from 'src/app/shared/enum/upload-type.enum';
import { DownloadService } from 'src/app/core/services/download.service';
import { AmisTranferDataService } from 'src/app/core/services/amis-tranfer-data.service';
import { takeUntil } from 'rxjs/operators';
import { PagingRequest } from 'src/app/core/models/PagingRequest';
import { ImageService } from 'src/app/core/services/image.service';
import { NzImageService } from 'ng-zorro-antd/image';
import { MessageType } from 'src/app/shared/enum/message-type.enum';

@Component({
  selector: 'amis-conversation-sider',
  templateUrl: './conversation-sider.component.html',
  styleUrls: ['./conversation-sider.component.less']
})
export class ConversationSiderComponent extends BaseComponent implements OnInit {

  @ViewChild("scrollable", { static: true })
  scroll!: ElementRef;

  // tslint:disable-next-line:variable-name
  _conversation: any;
  isVisible!: boolean;
  conversationId!: string;
  currentUser: any;
  // popup đổi tên nhóm
  @Input() isPopupRenameGroup!: boolean;
  // popup xóa cuộc trò chuyện
  @Input() isPopupDeleteChat!: boolean;

  // popup thêm thành viên
  @Input() isPopupAddMember!: boolean;

  // thành viên trong hội thoại
  @Input() isPopupMember!: boolean;

  // rời nhóm
  @Input() isLeaveGroup!: boolean;

  switchValue = true;


  @Input() set conversation(data: any) {
    if (data) {
      this._conversation = data;
      setTimeout(() => {
        this.scroll?.nativeElement.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }, 300);

      this.listAttachment = new Array<any>();
      this.listImage = new Array<any>();
      this.getAttachment();
      this.getPagingImage();
    }
  }
  visible = false;

  listAttachment = new Array<any>();

  listImage = new Array<any>();

  openMap: { [name: string]: boolean } = {
    file: false,
    image: false,
  };

  impagePagingRequest!: PagingRequest;

  filePagingRequest!: PagingRequest;

  totalImage!: number;

  totalAttachment!: number;

  timeoutLoadMore: any;

  constructor(
    private activeRouter: ActivatedRoute,
    private attachmentSV: AttachmentService,
    private downloadSV: DownloadService,
    private tranferSV: AmisTranferDataService,
    private imageSV: ImageService,
    private nzImageService: NzImageService
  ) {
    super();
  }


  ngOnInit(): void {
    this.currentUser = UserService.UserInfo.StringeeUserID;
    this.subScribeParam();
  }

  openHandler(value: string): void {
    for (const key in this.openMap) {
      if (key !== value) {
        this.openMap[key] = false;
      }
    }
  }

  change(value: boolean): void {

  }

  /**
   * nếu là new thì clear dữ liệu sider
   * dvquang2 03/06/2021
   */
  subScribeParam(): void {
    try {
      this.activeRouter.params.subscribe(params => {
        if (params.id === "new") {
          this.clearSider();
        }
      });
      this.tranferSV.onSendFile.pipe(takeUntil(this._onDestroySub)).subscribe((data) => {
        if (data == MessageType.File) {
          this.getAttachment();
        }
        else if (data == MessageType.Photo) {
          this.getPagingImage();
        }
      });
    } catch (error) {
      CommonFn.logger(error);
    }
  }

  clearSider(): void {
    this._conversation = null;
  }
  /**
   * xóa cuộc trò chuyện
   * dvquang2 21/05/2021
   */
  openDeleteConversation(conversation: any): void {
    this.isPopupDeleteChat = true;
    this.conversation = conversation;

  }
  /**
   * show popup đổi tên nhóm
   * @param conversation
   * dvquang2 24/05/2021
   */
  openPopupRenameGroup(): void {
    this.isPopupRenameGroup = true;
  }

  onchangeVisiablePopupRename(isPopupRenameGroup: any): void {
    this.isPopupRenameGroup = isPopupRenameGroup;
  }

  openPopupMember(): void {
    this.isPopupMember = true;
  }

  onchangeVisiablePopupDelete(isPopupDeleteChat: any): void {
    this.isPopupDeleteChat = isPopupDeleteChat;
  }

  onchangeVisiablePopupAdd(isPopupAddMember: any): void {
    this.isPopupAddMember = isPopupAddMember;
  }
  openPopupLeaveGroup(): void {
    this.isLeaveGroup = true;
  }

  openPopupAddMember(): void {
    this.isPopupAddMember = true;

  }


  onchangeVisiablePopupMember(isPopupMember: any): void {
    this.isPopupMember = isPopupMember;
  }

  /**
   * mở popup rời nhóm
   * dvquang2 28/05/2021
   * @param conversation
   */
  LeaveGroup(conversation: any): void {
    this.isLeaveGroup = true;

  }

  onchangeVisiablePopupLeaveGroup(isPopupLeaveGroup: any): void {
    this.isLeaveGroup = isPopupLeaveGroup;
  }

  getAttachment(): void {

    this.filePagingRequest = new PagingRequest();
    this.filePagingRequest.PageIndex = 1;
    this.filePagingRequest.PageSize = 20;
    this.filePagingRequest.CustomParam = {
      Conv_ID: this._conversation.id,
      Type: UploadTypeEnum.MessengerFileAttachment
    };
    this.attachmentSV.getPagingAttachment(this.filePagingRequest).subscribe(data => {
      if (data?.Success) {

        this.handleFile(data);
        this.totalAttachment = data.Data.Total;

        this.listAttachment = data?.Data.PageData;
      }
    });
  }

  getPagingImage(): void {
    this.impagePagingRequest = new PagingRequest();
    this.impagePagingRequest.PageIndex = 1;
    this.impagePagingRequest.PageSize = 30;
    this.impagePagingRequest.CustomParam = {
      Conv_ID: this._conversation.id,
      Type: UploadTypeEnum.MessengerImageAttachment
    };
    this.attachmentSV.getPagingAttachment(this.impagePagingRequest).subscribe(data => {
      if (data?.Success) {
        this.handleImage(data);
        this.listImage = data.Data.PageData;
        this.totalImage = data.Data.Total;
      }
    });
  }

  getMoreImage(): void {
    this.impagePagingRequest.PageIndex++;
    this.attachmentSV.getPagingAttachment(this.impagePagingRequest).subscribe(data => {
      if (data?.Success) {
        this.handleImage(data);
        this.listImage.push(...data.Data.PageData);
      }
    });
  }

  getMoreAttachment(): void {
    this.filePagingRequest.PageIndex++;
    this.attachmentSV.getPagingAttachment(this.filePagingRequest).subscribe(data => {
      if (data?.Success) {
        this.handleFile(data);
        this.listAttachment.push(...data.Data.PageData);
      }
    });
  }

  handleImage(data): void {
    data.Data.PageData?.forEach(e => {
      e.PreviewUrl = this.imageSV.getImage(UploadTypeEnum.MessengerImageAttachment, e.FileID, "", true, 120, 120);
    });
  }

  handleFile(data): void {
    data?.Data.PageData.forEach(file => {
      FileType.forEach(type => {
        if (type.Value.includes(file.AttachmentExtension)) {
          file.Type = type.Key;
        }
      });
      file.Type = file.Type ?? "file-other";
    });
  }

  preview(i): void {
    const images = this.listImage.map(e => {
      return {
        src: this.imageSV.getImage(UploadTypeEnum.MessengerImageAttachment, e.FileID, "", true)

      };
    });

    const imagesSorted = new Array<any>();
    for (let index = 0; index < images.length; index++) {
      if (index >= i) {

        imagesSorted.push(images[index]);
      }
    }
    for (let index = 0; index < images.length; index++) {
      if (index < i) {

        imagesSorted.push(images[index]);
      }
    }

    this.nzImageService.preview(imagesSorted, { nzZoom: 1.5, nzRotate: 0, });
  }

  onScroll(event): void {
    const scrollheight = event.target.scrollHeight;
    const scrollTop = event.target.scrollTop;
    const height = event.target.offsetHeight;
    clearTimeout(this.timeoutLoadMore);
    if ((scrollTop == scrollheight - height)) {
      this.timeoutLoadMore = setTimeout(() => {
        if (this.listImage.length < this.totalImage && this.openMap.image) {
          this.getMoreImage();
        }
        else if (this.listAttachment.length < this.totalAttachment && this.openMap.file) {
          this.getMoreAttachment();
        }
      }, 500);
    }
  }

  downloadFile(item): void {
    this.downloadSV.getTokenFile(item.FileID, UploadTypeEnum.MessengerFileAttachment, false).subscribe(data => {
      item.UrlDownload = this.downloadSV.downloadFile(data.Data);
      window.open(item.UrlDownload, '_blank');
    });
  }
}
