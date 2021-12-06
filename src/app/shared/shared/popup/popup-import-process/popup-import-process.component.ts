import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ImportConfigService } from 'src/app/services/import-employee/import-employee.service';
import { AmisTransferDataService } from 'src/common/services/amis-transfer-data.service';
import { AmisTranslationService } from 'src/common/services/amis-translation.service';
import { TransferDataService } from 'src/app/services/base/transfer-data.service';
import { AmisDataService } from 'src/common/services/amis-data.service';
import { NotifyProcessType } from '../../enum/import-process/import-process.enum';

@Component({
  selector: 'amis-popup-import-process',
  templateUrl: './popup-import-process.component.html',
  styleUrls: ['./popup-import-process.component.scss']
})
export class PopupImportProcessComponent implements OnInit {

  @Input() set paramConfigImport(data) {
    if (data) {
      this.typeNotify = data.typeNotify >= 1 ? data.typeNotify : NotifyProcessType.IMPORT;

      this.configImport = data.configImport;
      this.fileNameClient = data.fileNameClient;
      this.countImport = data.countImport;
      this.isGetListImported = data.isGetListImported;
      this.modelName = data.modelName;
      this.updateSource = data.configImport?.CustomParam?.UpdateSource;
      
      this.iconNotify = data.iconNotify ? data.iconNotify : "icon-upload-big";
      this.title = data.title ? data.title : this.translateSV.getValueByKey("STATUS_IMPORT");
      this.contentNotify = data.contentNotify ? data.contentNotify : this.translateSV.getValueByKey("STATUS_IMPORTING");
      this.isDisplayFileName = data.isDisplayFileName == false ? false : true;
    }
  };

  //loại thông báo
  typeNotify: number;
  //tiêu đề
  title = "";
  //nội dung thông báo
  contentNotify = "";
  //icon thông báo
  iconNotify = "";
  //có hiển thị tên file hay k
  isDisplayFileName = true

  @Output()
  importSuccess: EventEmitter<any> = new EventEmitter<any>();

  // param để nhập khẩu
  configImport: any;

  //tên file import
  fileNameClient = "";

  //số lượng bản ghi nhập khẩu
  countImport = 0;

  //có lấy danh sách import sau khi thành công hay không
  isGetListImported: boolean;

  //modelName
  modelName = "";

  //danh sách ID update
  updateSource: any;

  visibleStatusImport = true;

  constructor(
    private importService: ImportConfigService,
    private amisTransferSV: AmisTransferDataService,
    private TransferDataSV: TransferDataService,
    private translateSV: AmisTranslationService,
    private amisDataSV: AmisDataService
  ) { }

  ngOnInit(): void {
    this.init();
  }

  /**
   * Khởi tạo form
   * Created by pvthong- 12/08/2020
   */
  init() {
    switch (this.typeNotify) {
      case NotifyProcessType.IMPORT:
        this.importData();
        break;
      default:
        break;
    }
  }

  /**
   * Hàm nhập khẩu ứng viên
   * Created by pvthong- 04/06/2020
   */
  importData() {
    if (!this.configImport) {
      return;
    }
    this.importService.ImportData(this.configImport).subscribe(res => {
      if (res?.Success && res?.Data) {
        if (this.isGetListImported && (res.Data?.length || this.updateSource?.length)) {
          res.Data = res.Data ? res.Data : [];
          this.updateSource = this.updateSource ? this.updateSource : [];
          this.updateSource.push(...res.Data);
          this.getListImported(this.updateSource);
        }
        else {
          setTimeout(() => {
            this.amisTransferSV.showSuccessToast(this.translateSV.getValueByKey("IMPORT_SUCCESS", { countImport: this.countImport }));
            this.TransferDataSV.outputImportSuccess({ SystemCode: this.configImport?.SubsystemCode });
            this.importSuccess.emit();
          }, 300)
        }
      }
      else {
        this.amisTransferSV.showErrorToast(this.translateSV.getValueByKey("IMPORT_ERROR"));
        this.importSuccess.emit();
      }
    }, error => {
      this.amisTransferSV.showErrorToast(this.translateSV.getValueByKey("IMPORT_ERROR"));
      this.importSuccess.emit();
    });
  }

  /**
   * Lấy danh sách sau khi import thành công
   * Created by pvthong- 10/07/2020
   */
  getListImported(IDs) {
    let listData = [];
    this.amisDataSV.getListDatabyIDs(IDs, this.modelName).subscribe(res => {
      if (res?.Success) {
        listData = res.Data;
      }
      setTimeout(() => {
        let output = {
          SystemCode: this.configImport.SubsystemCode,
          Data: listData
        }
        this.TransferDataSV.outputImportSuccess(output);
        this.amisTransferSV.showSuccessToast(this.translateSV.getValueByKey("IMPORT_SUCCESS", { countImport: this.countImport }));
        this.importSuccess.emit();
      }, 300)
    })
  }

  /**
   * Ẩn popup
   * Created by pvthong- 04/06/2020
   */
  hidePopup() {
    this.visibleStatusImport = false;
  }

}
