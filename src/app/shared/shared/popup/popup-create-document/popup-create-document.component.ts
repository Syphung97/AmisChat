import { Component, OnInit, EventEmitter, Output, Input, ViewChild } from '@angular/core';
import { ButtonType } from '../../enum/common/button-type.enum';
import { ButtonColor } from '../../enum/common/button-color.enum';
import { TemplateService } from 'src/app/services/template/template.service';
import { ContextMenu } from '../../enum/context-menu/context-menu.enum';
import { DocumentDownloadType } from '../../enum/document-download-type/document-download-type.enum';
import { DocumentType } from '../../enum/document-download-type/document-type.enum';
import { AmisTranslationService } from 'src/common/services/amis-translation.service';
import { AmisCommonUtils } from 'src/common/fn/common-utils';
import { BaseComponent } from 'src/common/components/base-component';
import { TransferDataService } from 'src/app/services/base/transfer-data.service';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { MergeConfig } from '../../models/template/merge-config';
import { DownloadService } from 'src/app/services/base/download.service';
import { TemplateTypeService } from 'src/app/services/template-type/template-type.service';
import { EmployeeContractService } from 'src/app/services/employee-contract/employee-contract.service';
import { EmployeeContractAppendixService } from 'src/app/services/employee-contract/employee-contract-appendix.service';
import { AmisPagingGridComponent } from 'src/common/components/amis-grid/amis-paging-grid/amis-paging-grid.component';
import { HRMPermissionUtils } from '../../function/permission-utils';
import { PermissionCode } from '../../constant/permission-code/permission-code';

@Component({
  selector: 'amis-popup-create-document',
  templateUrl: './popup-create-document.component.html',
  styleUrls: ['./popup-create-document.component.scss']
})
export class PopupCreateDocumentComponent extends BaseComponent implements OnInit {

  @Output() onClosePopup = new EventEmitter();

  @Output() onCreateDocumentSuccess = new EventEmitter();

  @Output() onOpenFormCreateDocument = new EventEmitter();

  @Output() onOpenPopupImport = new EventEmitter();
  @Output() onSelect = new EventEmitter();

  _profileHasMadeDocument;
  @Input() set profileHasMadeDocument(data) {
    this._profileHasMadeDocument = data;
  }

  @Input() documentType: string = "";

  _documentType = DocumentType;

  _visiblePopup = true;

  _buttonColor = ButtonColor;

  _buttonType = ButtonType;

  _searchValue = "";

  _dataSelectBox = [
    {
      displayExpr: "Tất cả mẫu",
      valueExpr: "0"
    },
    {
      displayExpr: "Hồ sơ",
      valueExpr: "1"
    }
  ]

  _valueSelectBox = "0"

  _gridFieldConfig = [
    {
      FieldName: "TemplateName",
      Caption: "Tên mẫu",
      Tooltip: "Tên mẫu",
      IsVisible: true
    },
    {
      FieldName: "TemplateTypeName",
      Caption: "Loại mẫu",
      Tooltip: "Loại mẫu",
      IsVisible: true
    }
  ]

  // Danh sách chức năng viewMore menu trên toolbar cạnh thanh search
  viewMoreMenuList = [
    {
      Key: ContextMenu.CreateDocument,
      Text: this.translateSV.getValueByKey('HRM_SETTING_DOCUMENT_SAMPLE_NEW_SAMPLE'),
      Icon: 'icon-edit-underline',
      Class: ''
    }
  ];

  _pageIndex = 1;
  _pageSize = 15;

  _filter = window.btoa(`[["Type","=","1"]]`);
  paramPaging = {
    PageIndex: this._pageIndex,
    PageSize: this._pageSize,
    Filter: this._filter,
    QuickSearch: {
      Columns: ["TemplateName", "TemplateTypeName"],
      SearchValue: this._searchValue
    }
  }

  _templateData = [];

  _totalRecord;

  _isLoading = true;

  _contextMenuOption = [{

    Key: ContextMenu.ViewDocument,
    Text: "",
    Icon: 'icon-eye',
    Class: ''

  }]

  priorities = [
    {
      Value: true,
      Name: "Tách mỗi văn bản thành một tệp "
    },
    {
      Value: false,
      Name: "Gộp tất cả văn bản thành một tệp"
    }
  ]

  _formatDocument = [

    {
      Display: this.translateSV.getValueByKey("DOCUMENT_DOC03"),
      Value: DocumentDownloadType.DOC03,
      Format: ".doc"
    },
    {
      Display: this.translateSV.getValueByKey("DOCUMENT_DOC07"),
      Value: DocumentDownloadType.DOC07,
      Format: ".docx"
    },
    {
      Display: this.translateSV.getValueByKey("DOCUMENT_ODT"),
      Value: DocumentDownloadType.ODT,
      Format: ".odt"
    },
    {
      Display: this.translateSV.getValueByKey("DOCUMENT_RTF"),
      Value: DocumentDownloadType.RTF,
      Format: ".rtf"
    },
    {
      Display: this.translateSV.getValueByKey("DOCUMENT_PDF"),
      Value: DocumentDownloadType.PDF,
      Format: ".pdf"
    },

  ]
  _formatDocumentSelected = 2;

  _isDisableDownload = true;

  _selectedQuantity = 0;

  _listSelectedRecord = [];
  @Input() set listSelectedRecord(data) {
    if (data) {
      this._listSelectedRecord.push(data);
    }
  }

  _templatePreview;

  _radioGroupSelected = true;

  timeoutSearching;

  visiblePopupPreview = false;

  _filePreviewAPI;

  offsetConfig;
  @ViewChild('pagingGrid', { static: false })
  pagingGrid: AmisPagingGridComponent;

  //#region custom
  @Input() typePopup = "Default";
  //#endregion
  constructor(
    private templateSV: TemplateService,
    private translateSV: AmisTranslationService,
    private tranferSV: TransferDataService,
    private employeeSV: EmployeeService,
    private downloadSV: DownloadService,
    private templateTypeSV: TemplateTypeService,
    private contractSV: EmployeeContractService,
    private contractAppendixSV: EmployeeContractAppendixService
  ) {
    super();
  }

  ngOnInit(): void {
    this._isLoading = true;
    if (this.documentType == this._documentType.Contract) {
      this._filter = window.btoa(`[["TemplateTypeID","=","2"], "AND", ["Type", "=", "1"]]`);
    }
    else if (this.documentType == this._documentType.AppendixContract) {
      this._filter = window.btoa(`[["TemplateTypeID","=","3"], "AND", ["Type", "=", "1"]]`);
    }
    else if (this.documentType == this._documentType.Email) {
      this._filter = window.btoa(`[["Type","=","2"]]`);
    }
    else {
      this._filter = window.btoa(`[["Type","=","1"], "AND", [["TemplateTypeID","=","1"],"OR",["TemplateTypeName","isnullorempty","null"]]]`)
      this.loadTemplateType();
    }
    this.updateParamRequest();
    this.loadTemplate();

    if (window.innerHeight <= 800) {
      this.offsetConfig = "0 5";
    } else {
      this.offsetConfig = "0 100";
    }
  }

  /**
   * Lấy dữ liệu loại mẫu
   *
   * @memberof PopupCreateDocumentComponent
   * CREATE: PTSY 7/2020
   */

  loadTemplateType() {
    this.templateTypeSV.getAllTemplate().subscribe(data => {
      if (data?.Success) {
        data?.Data.filter(x => !x.IsSystem)?.forEach(e => {
          const obj = {
            displayExpr: e.PickListValue,
            valueExpr: e.PickListID
          }
          this._dataSelectBox.push(obj);
        })
      }
    })
  }

  /**
   * Cập nhật param
   *
   * @memberof PopupCreateDocumentComponent
   * CREATE: PTSY 7/2020
   */
  updateParamRequest() {
    this.paramPaging.PageIndex = this._pageIndex;
    this.paramPaging.PageSize = this._pageSize;
    this.paramPaging.Filter = this._filter;
    this.paramPaging.QuickSearch.SearchValue = this._searchValue;
  }

  /**
   * Lấy dữ liệu template
   *
   * @memberof PopupCreateDocumentComponent
   * CREATE: PTSY 7/2020
   */
  loadTemplate() {

    this.templateSV.getTemplatePaging(this.paramPaging).subscribe(data => {
      if (data?.Success) {
        this._templateData = data.Data.PageData;
        this._listSelectedRecord = AmisCommonUtils.cloneDataArray(this._listSelectedRecord);
        if (data.Data?.Total !== this._totalRecord) {

          this._totalRecord = data.Data.Total;
        }
        this._isLoading = false;
      }
    });


  }

  /**
   * Đóng popup
   *
   * @memberof PopupCreateDocumentComponent
   * CREATE: PTSY 7/2020
   */
  closePopup() {
    this.onClosePopup.emit(false);
  }

  /**
   * sự kiện thay đổi select box
   *
   * @param {any} event
   * @memberof PopupCreateDocumentComponent
   * CREATE: PTSY 7/2020
   */
  onValueChangedTextBox(event) {
    if (!event.value) {

      clearTimeout(this.timeoutSearching);
      this.timeoutSearching = setTimeout(() => {

        this._pageIndex = 1;
        this._searchValue = event.value?.trim();
        this.updateParamRequest();
        this.loadTemplate();
      }, 500);
    }
  }

  /**
   * Tìm kiếm mẫu
   * @param {any} event
   * @memberof PopupCreateDocumentComponent
   * CREATED: PTSY 7/2020
   */
  onSearchTextBox(event) {
    clearTimeout(this.timeoutSearching);
    this.timeoutSearching = setTimeout(() => {

      this._pageIndex = 1;
      this._searchValue = event.event.target.value.trim();
      this.updateParamRequest();
      this.loadTemplate();
    }, 500);
  }

  /**
   * Chọn lọc theo combo
   *
   * @param {any} event
   * @memberof PopupCreateDocumentComponent
   * CREATED: PTSY 7/2020
   */
  onValueChangedSelectBox(event) {
    this._pageIndex = 1;
    if (this._valueSelectBox == "1") {
      this._filter = window.btoa(`[[["TemplateTypeID","=","1"]],"AND",["Type","=","1"]]`)
    }
    else if (this._valueSelectBox > "1") {
      this._filter = window.btoa(`[["TemplateTypeID","!=","1"], "AND",["Type","=","1"], "AND", ["TemplateTypeID","=","${this._valueSelectBox}"]]`)
    }
    else this._filter = window.btoa(`[["Type","=","1"], "AND", [["TemplateTypeID","=","1"],"OR",["TemplateTypeName","isnullorempty","null"]]]`);

    this.updateParamRequest();
    this.loadTemplate();
  }

  onValueChangedDocType(event) {

  }

  onKeyupSearchBox($event) {

  }

  /**
   * Sự kiện click view document
   *
   * @param {any} event
   * @memberof PopupCreateDocumentComponent
   * CREATED: PTSY 7/2020
   */
  contextMenuExecuteAction(event) {
    this.visiblePopupPreview = true;
    const data = event?.SelectedRow?.data;
    this._templatePreview = data;
    if (data) {

      setTimeout(() => {

        const templateID = data.TemplateID;
        if (this.documentType == this._documentType.Contract) {
          const contractID = this._profileHasMadeDocument[0].ContractID;
          this._filePreviewAPI = this.contractSV.previewEmployeeDocument(templateID, contractID);
        }
        else if (this.documentType == this._documentType.AppendixContract) {
          const contractID = this._profileHasMadeDocument[0].ContractAppendixID;
          this._filePreviewAPI = this.contractAppendixSV.previewEmployeeDocument(templateID, contractID)
        }
        else {
          const employeeID = this._profileHasMadeDocument[0].EmployeeID;
          this._filePreviewAPI = this.employeeSV.previewEmployeeDocument(templateID, employeeID);
        }
      }, 300);

    }
  }

  /**
   * Chọn bản ghi trên grid
   *
   * @param {any} data
   * @memberof PopupCreateDocumentComponent
   * CREATED: PTSY 7/2020
   */
  chooseRecord(data) {
    this._selectedQuantity = data.selectedRowsData.length;
    this._listSelectedRecord = AmisCommonUtils.cloneDataArray(data.selectedRowsData);
    if (this._listSelectedRecord.length > 0) {
      this._isDisableDownload = false;
    }
    else {
      this._isDisableDownload = true;

    }
  }

  /**
   * Lất dữ liệu mẫu
   *
   * @param {any} event
   * @memberof PopupCreateDocumentComponent
   * CREATED: PTSY 7/2020
   */
  getTemplateChangePaging(event) {
    this._pageIndex = event.PageIndex;
    this._pageSize = event.PageSize;
    this.updateParamRequest();
    this.loadTemplate();
  }

  /**
   * Mở form tạo mới
   *
   * @memberof PopupCreateDocumentComponent
   * CREATED: PTSY 7/2020
   */
  opendFormCreate() {
    if (!HRMPermissionUtils.checkPermissionUser(this.subSystemCodeEntity.TemplateDocument, PermissionCode.Insert)) {
      this.tranferSV.showWarningToast(this.translateSV.getValueByKey("VALIDATION_NOT_PERMISSION"));
      return;
    }
    this.onOpenFormCreateDocument.emit(true);
  }

  /**
   * Sự kiện tải xuống
   *
   * @memberof PopupCreateDocumentComponent
   * CREATED: PTSY 7/2020
   */
  downloadDocument() {
    const mergeConfig = new MergeConfig();

    mergeConfig.FileType = this._formatDocument.find(v => v.Value === this._formatDocumentSelected).Format;
    mergeConfig.IsSeparate = this._radioGroupSelected;
    mergeConfig.TemplateIDs = this._listSelectedRecord.map(v => v.TemplateID).join(";");
    mergeConfig.ZipName = "Hello world";


    if (this.documentType == this._documentType.Contract) {
      mergeConfig.IDs = this._profileHasMadeDocument.map(v => v.ContractID).join(";");
      this.contractSV.getTokenDownloadDocument(mergeConfig).subscribe(data => {
        if (data?.Success) {
          this.onCreateDocumentSuccess.emit();
          this.closePopup();
          const token = data?.Data;
          window.open(this.downloadSV.downloadFile(token), "_blank");
        }
      })
    }
    else if (this.documentType == this._documentType.AppendixContract) {
      mergeConfig.IDs = this._profileHasMadeDocument.map(v => v.ContractAppendixID).join(";");
      this.contractAppendixSV.getTokenDownloadDocument(mergeConfig).subscribe(data => {
        if (data?.Success) {
          this.onCreateDocumentSuccess.emit();
          this.closePopup();
          const token = data?.Data;
          window.open(this.downloadSV.downloadFile(token), "_blank");
        }
      })
    }
    else {
      mergeConfig.IDs = this._profileHasMadeDocument.map(v => v.EmployeeID).join(";");
      this.employeeSV.getTokenDownloadDocument(mergeConfig).subscribe(data => {
        if (data?.Success) {
          this.onCreateDocumentSuccess.emit();
          this.closePopup();
          const token = data?.Data;
          window.open(this.downloadSV.downloadFile(token), "_blank");
        }
      })
    }

  }

  /**
   * Mở form upload
   *
   * @memberof PopupCreateDocumentComponent
   * CREATED: PTSY 7/2020
   */
  openUploadTemplate() {
    this.onOpenPopupImport.emit(true);
  }

  /**
   *
   *
   * @memberof PopupCreateDocumentComponent
   */
  onSelectFunc() {
    this.onSelect.emit(this._listSelectedRecord);
    this.closePopup();
  }
}
