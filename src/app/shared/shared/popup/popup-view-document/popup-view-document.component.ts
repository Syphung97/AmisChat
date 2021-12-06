import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { BaseComponent } from 'src/common/components/base-component';
import { PrintService } from 'src/app/services/base/print.service';
import { takeUntil } from 'rxjs/operators';
import { AmisTransferDataService } from 'src/common/services/amis-transfer-data.service';
import { AmisTranslationService } from 'src/common/services/amis-translation.service';
import { DownloadService } from 'src/app/services/base/download.service';

@Component({
  selector: 'amis-popup-view-document',
  templateUrl: './popup-view-document.component.html',
  styleUrls: ['./popup-view-document.component.scss']
})
export class PopupViewDocumentComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild("iFrame") iFrame: ElementRef;

  //đường dẫn file pdf
  @Input() set src(data) {
    if (data) {
      this.isLoading = false;
      setTimeout(() => {
        this.iFrame?.nativeElement?.setAttribute("src", data);
      }, 0);
    }
  };

  @Input() title; // title popup

  @Input() isHaveFooterBtn: boolean = false; // có button ở footer không

  @Input() reportID: string = ""; // id báo cáo

  @Input() printParams: any; // tham số để gọi lên lấy dữ liệu xuất khẩu

  @Output() close = new EventEmitter(); // sự kiện đóng popup

  @Output() onExportSuccess = new EventEmitter(); // 

  visiblePopup = true; // hiển thị popup

  isLoading = true; // biến loading

  height = 720; // chiều cao popup

  constructor(
    private printSV: PrintService,
    private transferSV: AmisTransferDataService,
    private translateSV: AmisTranslationService,
    private downloadService: DownloadService
  ) { super(); }

  ngOnInit(): void {
    if (window.innerHeight < 768) {
      this.height = 600;
    }
    setTimeout(() => {
      this.isLoading = false;
    }, 5000);
  }

  /**
   * Gắn giá trị source cho iframe
   * nmduy 29/07/2020
   */
  ngAfterViewInit() {

  }

  /**
   * Xử lý cho phép scroll trên control view pdf
   * nmduy 29/07/2020
   */
  onScrollPdfView(e) {
    // e.stopPropagation();
  }


  /**
   * load xong file PDF
   * nmduy 29/07/2020
   */
  pdfLoaded() {
  }

  /**
   * hiển thị popup
   * nmduy 30/07/2020
   */
  showPopup() {

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
   * Xuất khẩu file
   * nmduy 29/07/2020
   */
  exportFile() {
    if (this.reportID) {
      let params = {
        ExportFile: "xlsx"
      }
      if (this.printParams) {
        for (var i in this.printParams) {
          if (this.printParams.hasOwnProperty(i)) {
            params[i] = this.printParams[i];
          }
        }
      }
      this.printSV.printReportData(this.reportID, params).pipe(takeUntil(this._onDestroySub)).subscribe(rep => {
        if (rep?.Success && rep?.Data) {
          this.onExportSuccess.emit();
          window.open(this.downloadService.downloadFile(rep.Data), "_blank");
        } else {
          this.transferSV.showErrorToast(this.translateSV.getValueByKey("Xuất khẩu thành công"));
        }
      }, err => {
        this.transferSV.showErrorToast(this.translateSV.getValueByKey("ERROR_HAPPENED"));
      });
    }
  }

  /**
   * In file
   * nmduy 29/07/2020
   */
  printFile() {
  }


  /**
   * hàm trả về link file
   * nmduy 30/07/2020
   */
  pdfSrc() {
  }
}
