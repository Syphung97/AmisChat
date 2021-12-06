import { Component, OnInit, ViewChild, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { BaseComponent } from 'src/common/components/base-component';
import { AmisTransferDataService } from 'src/common/services/amis-transfer-data.service';
import { AmisTranslationService } from 'src/common/services/amis-translation.service';
import { DownloadService } from 'src/app/services/base/download.service';
import { TypeControl } from '../../enum/common/type-control.enum';
import { UploadTypeEnum } from '../../enum/uploadType/upload-type.enum';
import { TransferDataService } from 'src/app/services/base/transfer-data.service';
declare var $: any;
@Component({
  selector: 'amis-popup-preview-multiple-attachment',
  templateUrl: './popup-preview-multiple-attachment.component.html',
  styleUrls: ['./popup-preview-multiple-attachment.component.scss']
})
export class PopupPreviewMultipleAttachmentComponent extends BaseComponent implements OnInit {

  @ViewChild("iFrame") iFrame: ElementRef;

  @ViewChild("img") img: ElementRef;

  @Input() set selectedRowItem(data) {
    if (data) {
      this._selectedRowItem = data;


      this.index = this._dataSources.findIndex(e => {
        return e.AttachmentID == data.AttachmentID;
      })
      this.setSrc(data);
    }
  };

  // Danh sách data truyền vào
  @Input() set dataSources(data) {
    this._dataSources = data.filter(e => e.AllowPreview);
    if (this._dataSources.length == 0) {

      this.closePopup();
    }
    else {
      if (this.index != -1) {

        this._selectedRowItem = this._dataSources[this.index];
        this.setSrc(this._selectedRowItem);
      }
    }
  };

  @Input() title; // title popup



  @Output() close = new EventEmitter(); // sự kiện đóng popup

  @Output() deleteItem = new EventEmitter();
  visiblePopup = true; // hiển thị popup

  isLoading = true; // biến loading

  height = 720; // chiều cao popup
  // Danh sách data
  _dataSources = [];
  // Item được click preview
  _selectedRowItem;
  //Index của item trong danh sách
  index = -1;

  previewType = "PDF";

  constructor(
    private transferSV: AmisTransferDataService,
    private translateSV: AmisTranslationService,
    private downloadService: DownloadService,
    private amisTransferSV: TransferDataService
  ) {
    super();
  }

  ngOnInit(): void {
    this.initData();
    if (window.innerHeight < 800) {
      this.height = 600
    }
  }

  initData() {


  }

  /**
   * Đóng popup
   * nmduy 29/07/2020
   */
  closePopup() {
    this.iFrame?.nativeElement?.setAttribute("src", null);
    this.close.emit(true)
  }

  /**
   * Download attachment
   *
   * @memberof PopupPreviewMultipleAttachmentComponent
   * CREATED: PTSY 10/8/2020
   */
  downloadAttachment() {
    const isTemp = this._selectedRowItem.FileID ? true : false;
    this.downloadService.getTokenFile(this._selectedRowItem.AttachmentID, UploadTypeEnum.EmployeeAttachment, isTemp).subscribe(res => {
      if (res && res.Success && res.Data) {
        window.open(this.downloadService.downloadFile(res.Data), '_blank');
      } else {
        this.amisTransferSV.showErrorToast(this.translateSV.getValueByKey("TOAST_DOWNLOAD_RECORD_FAIL"));
      }
    }, error => {
      this.amisTransferSV.showErrorToast(this.translateSV.getValueByKey("ERROR_HAPPENED"));
    });
  }

  /**
   * Bind src cho frame
   *
   * @param {any} item
   * @memberof PopupPreviewMultipleAttachmentComponent
   * CREATED: PTSY 10/8/2020
   */
  setSrc(item) {
    const id = item.AttachmentID;
    this.title = item.AttachmentName;
    const isTemp = item.FileID ? true : false;
    this.isLoading = true;
    this.iFrame?.nativeElement?.setAttribute("src", null);
    if(item.AttachmentExtension == ".pdf") {
      this.previewType = "PDF"
    }
    else {
      this.previewType = "IMG"
    }
    this.downloadService.getTokenFile(id, UploadTypeEnum.EmployeeAttachment, isTemp).subscribe(res => {
      if (res && res.Success && res.Data) {

        const urlPreview = this.downloadService.previewFile(res.Data);
        setTimeout(() => {
          if(item.AttachmentExtension == ".pdf") {
            this.iFrame?.nativeElement?.setAttribute("src", urlPreview);
          }
          else {
            this.img?.nativeElement?.setAttribute("src", urlPreview);
          }
          this.isLoading = false;
        }, 300);

      } else {
        this.amisTransferSV.showErrorToast(this.translateSV.getValueByKey("ERROR_HAPPENED"));
      }
    }, error => {
      this.amisTransferSV.showErrorToast(this.translateSV.getValueByKey("ERROR_HAPPENED"));
    });
  }

  /**
   * Xóa attachment
   *
   * @memberof PopupPreviewMultipleAttachmentComponent
   * CREATED: PTSY 10/8/2020
   */

  deleteAttachment() {
    this.deleteItem.emit(this._selectedRowItem);

    this.index = 0;


  }
  /**
   * Sự kiện bấm next
   *
   * @memberof PopupPreviewMultipleAttachmentComponent
   * CREATED: PTSY 10/8/2020
   */
  next() {
    if (this.index < 0) this.index = 0;
    this.index++;
    this.setSrc(this._dataSources[this.index]);
    this._selectedRowItem = this._dataSources[this.index];
  }

  /**
   * Sự kiện bấm back
   *
   * @memberof PopupPreviewMultipleAttachmentComponent
   * CREATED: PTSY 10/8/2020
   */
  back() {
    this.index--;
    this.setSrc(this._dataSources[this.index]);
    this._selectedRowItem = this._dataSources[this.index];
  }
  /**
   * Đóng popup
   * nmduy 29/07/2020
   */
  showPopup() {

  }

}
