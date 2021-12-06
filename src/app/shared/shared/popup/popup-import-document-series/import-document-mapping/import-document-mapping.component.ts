import { Component, OnInit, Input, Output, EventEmitter, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { BaseComponent } from 'src/common/components/base-component';
import { AmisTranslationService } from 'src/common/services/amis-translation.service';
import { AmisTransferDataService } from 'src/common/services/amis-transfer-data.service';
import { TypeSeparate } from 'src/app/shared/enum/import-document/type-separate.enum';
import { ImportAttachmentService } from 'src/app/services/import-attachment/import-attachment.service';
import { AmisCommonUtils } from 'src/common/fn/common-utils';
import { AmisStringUtils } from 'src/common/fn/string-utils';
import { UserOptionService } from 'src/app/services/user-option/user-option.service';

@Component({
  selector: 'amis-import-document-mapping',
  templateUrl: './import-document-mapping.component.html',
  styleUrls: ['./import-document-mapping.component.scss']
})
export class ImportDocumentMappingComponent extends BaseComponent implements OnInit {

  // hiển thị popup
  @Input() visiblePopup;

  // title pop
  @Input()
  title = this.translateSV.getValueByKey("IMPORT_ATTACHMENT_TITLE");

  // title pop
  @Input() set inputTypeSeparate(data) {
    this.isUnderlined = data == TypeSeparate.Underscore ? true : false;
  };

  //Loại phân cách tài liệu
  @Output() typeSeparate: EventEmitter<any> = new EventEmitter<any>();

  @Output() outputCancel: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChildren("input") input: QueryList<ElementRef>;

  //value tìm kiếm
  filterValue: string;

  //danh sách cột dữ liệu mapping
  listMappingKeyword = [];
  // listMappingKeywordClone = [];

  //kiểm tra dữ liệu thiết lập tự động
  isNodataSetting = false;

  //Phân cách mã nhân viên và Mã tài liệu bằng dấu gạch dưới
  isUnderlined = true;

  //ẩn hiện thông báo
  visibleNotify: boolean = false;
  // nội dung xóa trong popup vị trí công việc
  contentNotify = "";

  //thời gian setTimeout
  timeSearch: any;

  //tooltip tài liệu
  attachDescription = this.translateSV.getValueByKey("IMPORT_ATTACHMENT_DESCRIPTION");
  //thong bao loi
  textError: any;

  //hiện tooltip
  visiblePopover: boolean = false;
  // vị trí hiện tooltip
  tooltipTarget: any;
  //nội dung tooltip
  tooltipContent: string;

  constructor(
    private importAttachmentSV: ImportAttachmentService,
    private translateSV: AmisTranslationService,
    private amisTransferSV: AmisTransferDataService,
    private userOptionSV: UserOptionService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.getImportMapping();
  }

  /**
   * Lấy danh sách mapping
   * Created by PVTHONG 04/08/2020
   */
  getImportMapping() {
    this.importAttachmentSV.getImportMapping().subscribe(res => {
      if (res?.Success) {
        this.listMappingKeyword = res.Data;
      }
    });
  }

  /**
   * Thêm dòng
   * Created by PVTHONG 04/08/2020
   */
  addRow() {
    this.listMappingKeyword.push({
      FileName: "",
      MappingKeyword: ""
    });
    // this.filterValue = "";
    // this.listMappingKeywordClone = AmisCommonUtils.cloneDataArray(this.listMappingKeyword);

    setTimeout(() => {
      this.input.last.nativeElement.focus();
    });
  }

  /**
   * Xóa dòng
   * Created by PVTHONG 04/08/2020
   */
  removeItem(index) {
    if (index > 0) {
      this.listMappingKeyword.splice(index, 1);
    }
    this.checkDuplicate();
  }

  /**
   * hàm xử lí khi thay đổi giá trị search
   * Created by PVTHONG 04/08/2020
   */
  onSearchControl(e) {
    clearTimeout(this.timeSearch);
    this.timeSearch = setTimeout(() => {
      let searchText = e.element.querySelector('.dx-texteditor-input').value;
      this.filterValue = searchText;
      searchText = AmisStringUtils.convertVNtoENToLower(searchText).trim();
      this.listMappingKeyword.forEach(element => {
        let caption = AmisStringUtils.convertVNtoENToLower(element.FileName);
        if (caption.indexOf(searchText) > -1) {
          element.isDisplay = true;
        }
        else {
          element.isDisplay = false;
        }
      });
    }, 400)

  }

  /**
   * hàm xử lí khi thay đổi giá trị search
    * @param e
   */
  onValueChangedSearch(e) {
    let searchText = e.element.querySelector('.dx-texteditor-input').value;
    this.filterValue = searchText;
    searchText = AmisStringUtils.convertVNtoENToLower(searchText).trim();
    this.listMappingKeyword.forEach(element => {
      let caption = AmisStringUtils.convertVNtoENToLower(element.FileName);
      if (caption.indexOf(searchText) > -1) {
        element.isDisplay = true;
      }
      else {
        element.isDisplay = false;
      }
    });

  }

  /**
   * bắt keyup
   * Created By PVTHONG 06/08/2020
   */
  keyupInput(item) {
    if (!item?.checked) {
      item.MappingKeyword = AmisCommonUtils.cloneData(item.FileName);
    }
  }
  /**
   * focus out
   * Created By PVTHONG 06/08/2020
   */
  focusOut(item) {
    if (item?.FileName?.trim()) {
      item.checked = true;
    }
    this.checkDuplicate();
  }

  /**
   * check duplicate
   * Created By PVTHONG 06/08/2020
   */
  checkDuplicate() {
    this.textError = "";
    this.listMappingKeyword.forEach((element, index) => {
      let check = this.listMappingKeyword.filter(x => x.FileName.toUpperCase() == element.FileName.toUpperCase() && x.FileName?.trim() != "");
      if (check.length > 1) {
        check.forEach(element => {
          element.Duplicate = true;
        });
        let temp = this.textError?.replaceAll(" ", "")?.split(',');
        if (!temp?.includes(element.FileName?.replaceAll(" ", ""))) {
          this.textError += this.textError?.length ? ", " + element.FileName : element.FileName;
        }
      }
      else {
        element.Duplicate = false;
      }
    });
  }

  //#region popup Notify

  /**
   * Xử lý đóng popup
   */
  cancelPopupNotify() {
    this.visibleNotify = false;
  }

  /**
   * hiện popup thông báo
   * @param message nội dung thông báo
   */
  showPopupNotify(message) {
    this.visibleNotify = true;
    this.contentNotify = message;
  }

  //#endregion

  /**
   * Hàm thay đổi lựa chọn Cập nhập hay bỏ qua
   * Created by PVTHONG 04/08/2020
   */
  changeCheck(isCheck) {
    if (!isCheck) {
      this.isUnderlined = !this.isUnderlined;
    }
  }

  /**
   * Hàm lưu thiết lập cột
   * Created by PVTHONG 04/08/2020
   * @memberof PopupImportComponent
   */
  saveMapping() {
    this.amisTransferSV.showLoading("", "scroll-mapping-loading");
    //lưu cấu trúc tên tệp
    let FileStructure = {
      TypeSeparate: this.isUnderlined ? TypeSeparate.Underscore : TypeSeparate.Dash
    }
   
    const userOp = this.userOptionSV.saveUserOption(FileStructure).subscribe(res => {
      if (res?.Success) {
       // 
      }
    });

    this.unSubscribles.push(userOp);

    this.listMappingKeyword = this.listMappingKeyword.filter(x => x.FileName?.trim() != "");
    var checkDuplicate = false;
    this.listMappingKeyword.forEach((element, index) => {
      if (element.ImportMappingAttachmentID) {
        element.State = this.formModeEntity.Update;
      }
      else {
        let check = this.listMappingKeyword.filter(x => x.FileName.toUpperCase() == element.FileName.toUpperCase());
        if (check.length > 1) {
          this.amisTransferSV.hideLoading();
          this.visibleNotify = true;
          this.showPopupNotify(this.translateSV.getValueByKey("IMPORT_ATTACHMENT_ERROR_DUPLICATE", { fileName: this.textError }));

          checkDuplicate = true;
        }
        element.State = this.formModeEntity.Insert;
      }
    });
    if (checkDuplicate) {
      return;
    }
    this.importAttachmentSV.saveMapipngKeyword(this.listMappingKeyword).subscribe(res => {
      if (res?.Success) {
        if (res.ValidateInfo?.length) {
          let duplicate = res.ValidateInfo.find(x => x.Code == "Duplicate");
          if (duplicate) {
            this.visibleNotify = true;
            this.showPopupNotify(this.translateSV.getValueByKey("IMPORT_ATTACHMENT_ERROR_DUPLICATE", { fileName: this.textError }));
            this.amisTransferSV.hideLoading();
            return;
          }
        }
        this.amisTransferSV.hideLoading();
        this.amisTransferSV.showSuccessToast(this.translateSV.getValueByKey("IMPORT_EDIT_AUTO_MAPPING_SUCCESS"));
        this.typeSeparate.emit(this.isUnderlined ? TypeSeparate.Underscore : TypeSeparate.Dash);
        this.closePopup();
      }
      else {
        this.amisTransferSV.hideLoading();
        if (res.ValidateInfo?.length) {
          let duplicate = res.ValidateInfo.find(x => x.Code == "Duplicate");
          if (duplicate) {
            this.visibleNotify = true;
            this.showPopupNotify(this.translateSV.getValueByKey("IMPORT_ATTACHMENT_ERROR_DUPLICATE"));
          }
        }
        else {
          this.amisTransferSV.showErrorToast();
        }
      }
    }, err => {
      this.amisTransferSV.hideLoading();
      this.amisTransferSV.showErrorToast();
    })
  }

  /**
   * Xử lý đóng popup
   */
  closePopup() {
    this.visiblePopup = false;
    setTimeout(() => {
      this.outputCancel.emit(true);
    }, 100)
  }

  /**
   *  hiện ToolTip
   * Created By PVTHONG 07/08/2020
   */
  showToolTip(e, item) {
    if (e && item) {
      this.tooltipTarget = e.target;
      this.tooltipContent = item;
      this.visiblePopover = true;
    }

  }

  /**
   *  ẩn ToolTip
   * Created By PVTHONG 07/08/2020
   */
  hideToolTip() {
    this.visiblePopover = false;
  }
}
