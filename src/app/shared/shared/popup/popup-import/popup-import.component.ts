import { Component, OnInit, Input, Output, EventEmitter, ViewChildren, ViewChild, ElementRef } from '@angular/core';
import { FileTypeEnum } from 'src/common/models/export/file-type.enum';
import { ToastModel } from 'src/common/models/base/toast';
import { PopupMultiScreen } from 'src/app/shared/enum/import-employee/import-employee.enum';
import { UploadService } from 'src/app/services/base/upload.service';
import { ButtonType } from 'src/app/shared/enum/common/button-type.enum';
import { ButtonColor } from 'src/app/shared/enum/common/button-color.enum';
import { ImportConfigService } from 'src/app/services/import-employee/import-employee.service';
import { DownloadService } from 'src/app/services/base/download.service';
import { AmisTransferDataService } from 'src/common/services/amis-transfer-data.service';
import { AmisCommonUtils } from 'src/common/fn/common-utils';
import { UploadTypeEnum } from '../../enum/uploadType/upload-type.enum';
import { AmisStringUtils } from 'src/common/fn/string-utils';
import { FormMode } from 'src/common/enum/form-mode.enum';
import { AmisTranslationService } from 'src/common/services/amis-translation.service';
import { Import } from '../../models/import/import';
import { TypeControl } from '../../enum/common/type-control.enum';
import { ColumnMapping, HeaderExcel } from '../../models/import/import-column-mapping';
import { ImportFilterValidate } from '../../enum/import/import-filter-validate/import-filer-validate.enum';
import { BaseComponent } from 'src/common/components/base-component';
import { DataType } from '../../enum/common/data-type.enum';

@Component({
  selector: 'amis-popup-import',
  templateUrl: './popup-import.component.html',
  styleUrls: ['./popup-import.component.scss']
})
export class PopupImportComponent extends BaseComponent implements OnInit {


  //#region special properties
  @Input()
  visiblePopupImport: boolean;

  /**
   * Event xử lý sự kiện khi click vào button
   */
  @Input() systemCode = "";
  @Input() applicationCode = "Employee";
  @Input() titleNotifyMapping = "";
  @Input() modelName = "";
  //có lấy danh sách import sau khi thành công hay không
  @Input() isGetListImported = false;

  //có nhập khẩu hay không hay chỉ lấy danh sách
  @Input() isImportData = true;

  //dataSource check trùng
  @Input() dataCheckDuplicate = [];

  //colums của dataSource check trùng
  @Input() columsCheckDuplicate = [];

  //formMode của popup
  @Input() formMode = FormMode.Insert;

  //ID cha của data
  @Input() masterID = 0;
  @Input() masterName = "";

  //Tên khóa chính
  @Input() keyFieldName = "";

  //có hiện thị note cập nhật hay k
  @Input() isShowNoteCustom = true;

  //Biến lưu bỏ qua hay cập nhập ứng viên  false:bỏ qua
  @Input() isPassOrUpdate = true;

  @Output()
  closePopup: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  importSuccess: EventEmitter<any> = new EventEmitter<any>();

  @ViewChildren("selectColum")
  selectColum: any;


  @ViewChild("configColums", { static: false })
  configColums: ElementRef;
  //#endregion special properties

  @ViewChild("selectTitle") selectTitle;
  //#region properties
  // Type button
  buttonType: any = ButtonType;

  // Màu sắc button
  buttonColor: any = ButtonColor;

  showPopupImport = PopupMultiScreen.FirstPage;
  // Enum trạng thái màn hình nhập khẩu danh sách ứng viên
  popupMultiScreen: any;
  // Trạng thái hiển thị icon excel
  choosedFile = false;
  // Trạng thái import file
  isImportFileCan: boolean = false;
  // Biến lưu file nhập khẩu danh sách người dùng
  fileImportUpload: File;
  //Biến lưu kích cỡ file CV
  fileSize: any;
  //Biến lưu tên file
  fileNameImport: any;

  //
  importFileValue: any;

  //Biến lưu trạng thái tải file lên
  isImportFile: boolean = false;

  //Đọc file excel
  //Biến đọc file excel ra json
  storeData: any;
  worksheet: any;
  //danh sách hồ sơ nhập khẩu khi kiểm tra dữ liệu
  objectJson: any;
  //danh sách hồ sơ nhập khẩu khi kiểm tra dữ liệu
  // objectJsonClone: any;
  //danh sách hồ sơ nhập khẩu paging khi kiểm tra dữ liệu
  objectJsonPaging: [];

  fileExtension: FileTypeEnum //định dạng file ăn theo icon
  FileTypeEnum = FileTypeEnum;

  //danh sách Sheet
  sheetName: Array<string>;
  //giá trị sheet chọn mặc định
  selectedSheet = {
    Index: 0,
    Name: ""
  };
  //Dòng tiêu đề
  titleLine: number = null;
  //Danh sách tiêu đề excel
  listHeader: Array<HeaderExcel>;
  firstOpen: boolean = true;
  //Hiển thị mặc định vào chọn cột
  listBindingHeader = {}
  //Danh sách mapping cột
  listColumnMapping: Array<ColumnMapping>;
  //Danh sách mapping cột clone
  listColumnMappingClone: Array<ColumnMapping>;
  //Danh sách binding dữ liệu
  listHeaderObject = [];

  //danh sách column configs
  ImportColumnConfigs = []

  //danh sách cột dữ liệu mapping vs excel
  listMappingKeyword = [];

  //Kiểm tra mapping cột
  validateMapping: boolean = true;


  validLine: number = 0;
  inValidLine: number = 0;

  //Config theo back end
  //danh sách sheet name
  listSheetName: any;
  //tên file excel server trả về(ID);
  fileName: string;
  //tên file excel
  fileNameClient = "";

  //Thông báo
  toast = new ToastModel();
  //Biến kiểm tra hiển thị thông báo thành công - Thất bại Service
  visibleToast: boolean = false;

  //Nội dung thông báo thành công - Thất bại Service
  message: string = "";

  //Thành công hay thất bại
  typeToast: string = "success";

  //Biến lưu trang thái đọc file
  readfile: boolean = false;

  //kiểm tra ở form import hay thiết lập từ điển ghép cột
  isImport = true;

  //title popup;
  title = this.translateSV.getValueByKey("IMPORT");

  //thông báo cập nhật mapping
  notifyMapping = "";

  //ngmpdel tìm kiếm
  ngModelfilterValue: string;
  ngModelColummMatching: string;

  // Cho phép loadidng
  isLoading = false;

  isSelectTitleValid = true;

  textLoading: string = "";
  positionLoad: string = "";

  //trang
  currentPageIndex = 1;
  //số lượng/trang
  currentPageSize = 15;
  //tổng dòng dữ liệu nhập khẩu
  totalImport = 0;
  //kiểm tra dữ liệu mapping step 2
  isNodataMapping = false;

  //kiểm tra dữ liệu thiết lập tự động
  isNodataSetting = false;

  //có quá dung lượng cho phép hay không
  isOverCapacity = false;

  //filter kết quả nhập khẩu
  filterValidate = ImportFilterValidate.ALL;

  //enum kết quả nhập khẩu
  importFilterValidate = ImportFilterValidate;

  visiblePopover = false;
  tooltipTarget: any; //target hiển thị tooltip

  //có phải trạng thái nhập khẩu thông tin file hay đang nhập khẩu
  statusPopupImport = true;

  width = 1000;
  height = 592;

  //visible hiển thị tiến trình nhập khẩu
  visiblePopupProcess = true;

  //danh sách dữ liệu nhập khẩu cần thêm
  pushDataImport = [];

  //dữ liệu check trùng truyền lên backend
  customParamCheck: any;

  //#endregion properties



  constructor(
    private importService: ImportConfigService,
    private downloadSV: DownloadService,
    private uploadSV: UploadService,
    private amisTransferSV: AmisTransferDataService,
    private translateSV: AmisTranslationService,
  ) {
    super();
    this.popupMultiScreen = PopupMultiScreen;
  }

  ngOnInit(): void {
    this.notifyMapping = this.translateSV.getValueByKey('IMPORT_TAB2_NOTE', { SystemCode: this.translateSV.getValueByKey("IMPORT_" + this.systemCode.toUpperCase()) });
  }
  //#region function

  /**
   * khi đóng popup emit ra để component cha biết
   *
   * @memberof PopupImportComponent
   */
  popupHidden() {
    this.visiblePopupImport = false;
    setTimeout(() => {
      this.closePopup.emit();
    }, 500);

  }
  /**
   * khi đóng popup emit ra để component cha biết
   *
   * @memberof PopupImportComponent
   */
  closePopupProcess() {
    this.visiblePopupProcess = false;
    setTimeout(() => {
      this.closePopup.emit();
    }, 500);

  }

  /**
   * Bắt sự kiện Thay đổi file input
   * Created by pvthong- 04/06/2020
   * @memberof PopupImportComponent
   */
  onFileChange(e) {
    //Kiểm tra có tồn tại file hay không?
    if (!e || !e.target || !e.target.files || e.target.files.length === 0) {
      return;
    }

    let sizeFiles = 0;
    for (let index = 0; index < e.target.files.length; index++) {
      sizeFiles += e.target.files[index].size;
    }
    sizeFiles = sizeFiles / 1024 / 1024;
    if (sizeFiles > 10) {
      this.amisTransferSV.showErrorToast(
        this.translateSV.getValueByKey("TOAST_UPLOAD_ERROR_MAX_SIZE")
      );
      return;
    }

    this.isLoading = true;
    this.fileImportUpload = e.currentTarget.files[0];
    this.fileNameClient = e.currentTarget.files[0].name;

    this.fileNameImport = this.fileImportUpload.name;
    this.readfile = false;
    let exArr = ['xlsx', 'xls', 'ods', 'csv'];
    let extendsion = this.fileImportUpload.name.slice(this.fileImportUpload.name.lastIndexOf('.') + 1);
    if (exArr.indexOf(extendsion) < 0) {
      this.isLoading = false;
      this.amisTransferSV.showErrorToast(this.translateSV.getValueByKey("IMPORT_ERROR_FILE"));
      return;
    }
    this.isImportFile = true;
    let sizeKB = this.fileImportUpload.size / 1024;
    if (sizeKB < 1024) {
      this.fileSize = sizeKB.toFixed(2) + " KB";
      this.isOverCapacity = false;
    }
    else {
      this.fileSize = (sizeKB / 1024).toFixed(2) + " MB";
      if (sizeKB / 1024 > 3) {
        this.isOverCapacity = true;
        this.isLoading = false;
        return;
      }
      else {
        this.isOverCapacity = false;
      }
    }

    this.isImportFile = true;

    this.importService.GetInfoFileExcel(this.fileImportUpload, this.systemCode).subscribe(res => {
      if (res && res.Success) {
        this.isLoading = false;
        this.listSheetName = res.Data.Sheets;
        this.selectedSheet = res.Data.Sheets[0];
        this.fileName = res.Data.FileName;
        this.titleLine = res.Data.TitleLine;
        this.readfile = true;
        this.isSelectTitleValid = true;
      }
      else {
        this.isLoading = false;
        this.readfile = false;
        this.amisTransferSV.showErrorToast();
      }
    }, error => {
      this.isLoading = false;
      this.readfile = false;
      this.amisTransferSV.showErrorToast();
    });

  }
  /**
   * Bắt sự kiện Thay đổi file input
   * Created by pvthong- 04/06/2020
   * @memberof PopupImportComponent
   */
  onFileChangeStep3(e) {
    //Kiểm tra có tồn tại file hay không?
    if (!e || !e.target || !e.target.files || e.target.files.length === 0) {
      return;
    }

    this.isLoading = true;
    this.fileImportUpload = e.currentTarget.files[0];

    //kiểm tra file hợp lệ hay k
    let exArr = ['xlsx', 'xls', 'ods', 'csv'];
    let extendsion = this.fileImportUpload.name.slice(this.fileImportUpload.name.lastIndexOf('.') + 1);
    if (exArr.indexOf(extendsion) < 0) {
      this.isLoading = false;
      this.amisTransferSV.showErrorToast(this.translateSV.getValueByKey("IMPORT_ERROR_FILE"));
      return;
    }
    //kiểm tra độ lớn của file
    let sizeKB = this.fileImportUpload.size / 1024;
    if (sizeKB < 1024) {
      this.fileSize = sizeKB.toFixed(2) + " KB";
      this.isOverCapacity = false;
    }
    else {
      this.fileSize = (sizeKB / 1024).toFixed(2) + " MB";
      if (sizeKB / 1024 > 3) {
        this.isOverCapacity = true;
        this.amisTransferSV.showErrorToast("OVER_CAPACITY");
        return;
      }
      else {
        this.isOverCapacity = false;
      }
    }
    //kiểm tra file có trùng file cũ hay k
    if (this.fileNameClient != e.currentTarget.files[0].name) {
      this.showPopupImport = this.popupMultiScreen.FirstPage;
      this.onFileChange(e);
      return;
    }


    this.fileNameImport = this.fileImportUpload.name;

    this.isImportFile = true;
    this.uploadSV.uploadFileHandle(this.fileImportUpload, UploadTypeEnum.ImportType).subscribe(res => {
      if (res?.Success && res.Data) {
        // console.log(res);
      }
    });
    this.importService.GetInfoFileExcel(this.fileImportUpload, this.systemCode).subscribe(res => {
      if (res && res.Success) {
        this.fileName = res.Data.FileName;
        this.readfile = true;
        this.filterValidate = ImportFilterValidate.ALL;
        this.getValidateData();
      }
      else {
        this.isLoading = false;
        this.readfile = false;
        this.amisTransferSV.showErrorToast();
      }
    }, error => {
      this.isLoading = false;
      this.readfile = false;
      this.amisTransferSV.showErrorToast();
    });

  }

  /**
   * set
   * Created by pvthong- 04/06/2020
   * @memberof PopupImportComponent
   */
  setIconByFileExtension(extension) {
    if (extension == 'xlsx') {
      this.fileExtension = FileTypeEnum.XLSX;
    } else if (extension == 'xls') {
      this.fileExtension = FileTypeEnum.XLS;
    } else if (extension == 'csv') {
      this.fileExtension = FileTypeEnum.CSV;
    } else if (extension == 'ods') {
      this.fileExtension = FileTypeEnum.ODS;
    }
  }

  /**
   * Hàm lấy danh sashc header
   * Created by pvthong- 04/06/2020
   * @memberof PopupImportComponent
   */
  customWorkSheet(headers) {

    this.listHeader = [];
    if (headers) {
      this.listHeader = headers;
    }

  }


  /**
   * Hàm chọn các cột
   * Created by pvthong- 04/06/2020
   * @memberof PopupImportComponent
   */
  getAndCustomColumn() {
    const configImport = {
      SheetIndex: this.selectedSheet.Index,
      HeaderIndex: this.titleLine,
      SubsystemCode: this.systemCode,
      FileName: this.fileName,
      ApplicationCode: this.applicationCode,
      CustomParam: {
        LayoutConfigID: 0
      }
    }
    this.importService.GetColumnMapping(configImport).subscribe(res => {
      if (res?.Success && res?.Data?.Data) {
        this.isLoading = false;
        this.ImportColumnConfigs = res.Data.Data.ImportColumnConfigs;
        this.listHeaderObject = res.Data.Data.ColumnMappings;
        if (!this.listHeaderObject.length) {
          this.isNodataMapping = true;
          this.validateMapping = false;
          return;
        }
        this.listHeader = res.Data.Data.Headers;
        this.listColumnMapping = AmisCommonUtils.cloneDataArray(res.Data.Data.ImportColumnConfigs);
        this.listColumnMapping.forEach(element => {
          element.FieldName = element.DisplayField ? element.DisplayField : element.DatabaseField;
          // element.Caption = element.DatabaseFieldCaption;
          switch (element.DataType) {
            case DataType.DateType:
            case DataType.DateTimeType:
              element.TypeControl = TypeControl.Date;
              break;
            case DataType.ComboboxType:
              element.TypeControl = TypeControl.Combobox;
              break;
            case DataType.NumberType:
              element.TypeControl = TypeControl.Number;
              break;

            case DataType.CurrencyType:
              element.TypeControl = TypeControl.Currency;
              break;
            case DataType.HyperLinkType:
              element.TypeControl = TypeControl.Hyperlink;
              break;
            case TypeControl.Checkbox:
              element.TypeControl = DataType.CheckBoxType;
              break;

            case DataType.PercentType:
              element.TypeControl = TypeControl.Percent;
              break;
            case DataType.YearType:
              element.TypeControl = TypeControl.Year;
              break;
            case DataType.MonthYearType:
              element.TypeControl = TypeControl.MonthYear;
              break;
            case DataType.SortOrderType:
              element.TypeControl = TypeControl.Year;
              break;
          }
        });
        this.listColumnMappingClone = AmisCommonUtils.cloneDataArray(this.listColumnMapping);

        if (this.listColumnMappingClone?.length) {
          let index = new ColumnMapping();
          index.FieldName = "Index";
          index.Caption = this.translateSV.getValueByKey("IMPORT_ROW_RESULT");
          this.listColumnMappingClone.unshift(AmisCommonUtils.cloneData(index));
          index.FieldName = "Result";
          index.Caption = this.translateSV.getValueByKey("IMPORT_CHECK_RESULT");
          this.listColumnMappingClone.push(AmisCommonUtils.cloneData(index));
          index.FieldName = "ErrorMessage";
          index.Caption = this.translateSV.getValueByKey("IMPORT_EXPLAIN_RESULT");
          this.listColumnMappingClone.push(AmisCommonUtils.cloneData(index));
        }
        let row = 0;
        this.listHeaderObject.forEach(e => {
          e.isDisplay = true;
          row++;
          if (row % 2 == 0) {
            e.isBgRow = true;
          }
          else {
            e.isBgRow = false;
          }
          //gán required, MappingKeyword
          let columnObj = this.ImportColumnConfigs.find(element => element.DatabaseField == e.DatabaseField);
          if (columnObj) {
            e.IsRequired = columnObj.IsRequired;
          }

          //gán data selectbox
          if (e.ImportFieldIndex != -1) {
            let headerMapp = this.listHeader.find(h => h.Index == e.ImportFieldIndex);
            if (headerMapp) {
              e.objectBinding = headerMapp;
            }
          } else {
            let emptyCol = new HeaderExcel();
            emptyCol.Caption = "";
            e.objectBinding = emptyCol;
          }
        });
        this.validateDuplicateColums();
      }
      else {
        this.isLoading = false;
        this.amisTransferSV.showErrorToast();
        this.isNodataMapping = true;
        this.validateMapping = false;
      }
    });
  }

  /**
   * Thây đổi giá trị mapping
   * Created by pvthong- 04/06/2020
   * @memberof PopupImportComponent
   */
  valueChangeMapping(item) {
    if (!item.objectBinding) {
      let emptyCol = new HeaderExcel();
      emptyCol.Caption = "";
      let temp = this.listHeaderObject.find(x => x.DatabaseField === item.DatabaseField);
      if (temp) {
        temp.objectBinding = emptyCol;
      }
    }
    else {
      let index = this.listHeaderObject.findIndex(x => x.DatabaseField === item.DatabaseField);
      if (index >= 0) {
        this.listHeaderObject[index].objectBinding = item.objectBinding;
      }
    }
    this.validateDuplicateColums();
  }

  /**
   * Hàm validate các cột
   * Created by pvthong- 04/06/2020
   * @memberof PopupImportComponent
   */
  validateDuplicateColums() {

    //Lấy ra các cột trùng nhau
    var dupColumn = this.listHeaderObject.filter((s => v => s.has(v.objectBinding.Caption) || !s.add(v.objectBinding.Caption))(new Set))
    if (dupColumn.length > 0) {
      //Check Validate các cột trùng nhau
      var objectDup = dupColumn.map(e => e.objectBinding);
      this.listHeaderObject.forEach(element => {
        if (objectDup.indexOf(element.objectBinding) > -1 && element.objectBinding.Caption) {
          element.IsDuplicate = true;
        } else {
          element.IsDuplicate = false;
        }
      });
    } else {
      this.listHeaderObject.forEach(e => {
        e.IsDuplicate = false;
      });
    }
    //validate các cột để trống
    this.listHeaderObject.forEach(element => {
      if (element?.objectBinding?.Caption == "") {
        element.IsDuplicate = false;
        if (element.IsRequired) {
          element.IsDuplicate = true;
        }
      }
    });

    var check = 0
    this.listHeaderObject.forEach(e => {
      if (e.IsDuplicate) {
        check++;
      }
    })
    this.validateMapping = (check > 0) ? false : true;
  }

  /**
   * Hàm validate data
   * Created by pvthong- 04/06/2020
   * @memberof PopupImportComponent
   */
  getValidateData() {
    //custom lại các cột mapping
    if (this.listHeaderObject) {
      this.listHeaderObject.forEach(element => {
        // var columnBind = this.listHeaderObject.find(e => e.DatabaseField == element.DatabaseField);
        if (element?.objectBinding?.Caption?.trim() != "") {
          element.ImportFieldCaption = element.objectBinding.Caption;
          element.ImportFieldIndex = element.objectBinding.Index;
        } else {
          element.ImportFieldCaption = "";
          element.ImportFieldIndex = -1;
        }
      });
    }
    this.customParamCheck = {};
    this.columsCheckDuplicate.forEach(colCheck => {
      if (colCheck.isCheckDuplicate) {
        this.dataCheckDuplicate?.forEach(dataCheck => {
          this.customParamCheck[dataCheck[colCheck.FieldName]] = dataCheck[this.keyFieldName] ? dataCheck[this.keyFieldName] : null;
        });

      }
    });

    const configImportValidate = {
      ImportType: this.isPassOrUpdate ? 0 : 1,
      SheetIndex: this.selectedSheet.Index,
      HeaderIndex: this.titleLine,
      SubsystemCode: this.systemCode,
      EntityTypeName: this.modelName,
      FileName: this.fileName,
      ApplicationCode: this.applicationCode,
      ColumnMappings: this.listHeaderObject,
      CustomParam: {
        LayoutConfigID: 0,
        DataSources: this.customParamCheck,
        MasterID: this.masterID ? this.masterID : null,
        MasterName: this.masterName ? this.masterName : null,
        IsImport: (this.isImportData || this.formMode == FormMode.Update) ? true : false
      }
    }

    //Validate theo các cột mapping lại
    this.importService.GetDataValidate(configImportValidate).subscribe(res => {
      if (res && res.Success) {
        this.isLoading = false;
        const data = res.Data.Data;
        this.totalImport = res.Data.Total;
        this.validLine = res.Data.Success;
        this.inValidLine = res.Data.Error;
        this.showPopupImport = PopupMultiScreen.ThirdPage;
        if (data) {
          this.objectJson = [];
          data.forEach(e => {
            let objectImport = new Import();
            objectImport.Success = e.Success;
            objectImport.ErrorMessage = e.ErrorMessage;
            if (!objectImport.Success) {
              objectImport.Result = this.translateSV.getValueByKey("IMPORT_INVALID_TEXT");
            }
            else {
              objectImport.Result = this.translateSV.getValueByKey("IMPORT_VALID_TEXT");
            }
            let listFieldError = [];
            e.DataRows.forEach(element => {

              const property = element.DatabaseField;
              let pair = {};
              if (element.DisplayField) {
                pair[element.DatabaseField] = element.CellValue;
                pair[element.DisplayField] = element.DisplayValue;
              }
              else {
                pair[element.DatabaseField] = element.DisplayValue;
              }
              let temp = this.listColumnMappingClone.find(x => x.DatabaseField == element.DatabaseField);
              if (temp) {
                switch (element.DataType) {
                  case DataType.DateType:
                  case DataType.DateTimeType:
                    temp.TypeControl = TypeControl.Date;
                    pair[property] = element.CellValue;
                    break;
                  case DataType.ComboboxType:
                    temp.TypeControl = TypeControl.Combobox;
                    break;
                  case DataType.NumberType:
                    temp.TypeControl = TypeControl.Number;
                    break;

                  case DataType.CurrencyType:
                    temp.TypeControl = TypeControl.Currency;
                    break;
                  case DataType.HyperLinkType:
                    temp.TypeControl = TypeControl.Hyperlink;
                    break;
                  case TypeControl.Checkbox:
                    temp.TypeControl = DataType.CheckBoxType;
                    break;

                  case DataType.PercentType:
                    temp.TypeControl = TypeControl.Percent;
                    break;
                  case DataType.YearType:
                    temp.TypeControl = TypeControl.Year;
                    break;
                  case DataType.MonthYearType:
                    temp.TypeControl = TypeControl.MonthYear;
                    break;
                  case DataType.SortOrderType:
                    temp.TypeControl = TypeControl.Year;
                    break;
                }
              }


              if (!element.Success) {
                listFieldError.push(element.DatabaseField);
              }
              objectImport = { ...objectImport, ...pair };
            });
            objectImport.listFieldError = listFieldError;
            objectImport.Index = this.objectJson.length + 1;
            this.objectJson.push(objectImport);
          });

          if (!this.isImportData || this.formMode == FormMode.Update) {
            this.pushDataImport = AmisCommonUtils.cloneData(this.objectJson.filter(x => x.Success));
            this.dataCheckDuplicate?.forEach((data, index) => {
              this.columsCheckDuplicate.forEach(col => {
                if (col.isCheckDuplicate) {
                  let temp = this.objectJson.find(x => x[col.FieldName] === data[col.FieldName] && x.Success);
                  if (this.isPassOrUpdate && temp) {
                    //cập nhật thông tin trùng
                    if (this.dataCheckDuplicate[index][this.keyFieldName]) {
                      temp[this.keyFieldName] = this.dataCheckDuplicate[index][this.keyFieldName];
                    }
                    this.dataCheckDuplicate[index] = temp;
                    let indexPush = this.pushDataImport.findIndex(x => x[col.FieldName] === data[col.FieldName]);
                    this.pushDataImport.splice(indexPush, 1);
                  }

                }
              });

            });
          }

          // this.objectJsonClone = AmisCommonUtils.cloneData(this.objectJson);

          this.listColumnMappingClone.forEach(u => {
            if (u.FieldName == 'Result') {
              u.HasConfigColor = true;
              u.ColorConfig = {};
              u.ColorConfig.Key = u.FieldName;
              u.ColorConfig.Value = {
                true: 'active-status',
                false: 'delete-status',
              };
            }
            else {
              u.HasConfigColor = false;
              u.ColorConfig = {};
            }

          });
        }

      }
      else {
        this.isLoading = false;
        this.showPopupImport = PopupMultiScreen.ThirdPage;
        this.amisTransferSV.showErrorToast();
      }
    }, error => {
      this.isLoading = false;
      this.showPopupImport = PopupMultiScreen.ThirdPage;
      this.amisTransferSV.showErrorToast();
    });

  }

  /**
   * Hàm nhập khẩu ứng viên
   * Created by pvthong- 04/06/2020
   * @memberof PopupImportComponent
   */
  importData() {
    const configImport = {
      ImportType: this.isPassOrUpdate ? 1 : 0,
      SheetIndex: this.selectedSheet.Index,
      HeaderIndex: this.titleLine,
      SubsystemCode: this.systemCode,
      EntityTypeName: this.modelName,
      FileName: this.fileName,
      ApplicationCode: this.applicationCode,
      ColumnMappings: this.listColumnMapping,
      CustomParam: {
        LayoutConfigID: 0,
        MasterID: this.masterID ? this.masterID : null,
        MasterName: this.masterName ? this.masterName : null,
        UpdateSource: null
      }
      // Param: param.ImportCandidateType ? param : null
    }

    //trạng thái đang nhập khẩu
    let isGetDataImport = false;
    if (this.isGetListImported || this.formMode == FormMode.View || this.formMode == FormMode.Update) {
      isGetDataImport = true;
    }
    let param = {
      configImport: configImport,
      fileNameClient: this.fileNameClient,
      countImport: this.validLine,
      isGetListImported: isGetDataImport,
      modelName: this.modelName
    }
    if (!this.isImportData) {
      if (this.totalImport > this.currentPageSize) {
        let paramPage = {
          FileName: this.fileName,
          Skip: 1,
          Take: 9999
        }

        this.getImportValidate(paramPage);
      }
      let tempDataSource = this.dataCheckDuplicate?.length ? AmisCommonUtils.cloneDataArray(this.dataCheckDuplicate) : [];
      if (this.formMode == FormMode.Insert) {
        tempDataSource.push(...this.pushDataImport);
      }
      tempDataSource.forEach(element => {
        if (element[this.keyFieldName]) {
          element.State = FormMode.Update;
        }
        else {
          element.State = FormMode.Insert;
        }
      });
      this.importSuccess.emit(tempDataSource);
      if (this.formMode == FormMode.Update || this.formMode == FormMode.View) {
        let updateSource = tempDataSource.filter(x => x.State == FormMode.Update)?.map(x => x[this.keyFieldName]);
        param.configImport.CustomParam.UpdateSource = updateSource ? updateSource : null;
        this.amisTransferSV.StatusImport(param);
      }

    }
    else {
      this.amisTransferSV.StatusImport(param);
    }
    this.visiblePopupImport = false;
    this.closePopup.emit();

  }

  /**
   * Hàm tải xuống tệp kết quả
   * Created by pvthong- 04/06/2020
   * @memberof PopupImportComponent
   */
  downloadFileResult() {
    let fileToken = "Temp_" + this.fileName;
    this.downloadSV.getTokenFileImport(fileToken, UploadTypeEnum.ImportType).subscribe(res => {
      if (res && res.Success && res.Data) {
        window.open(this.downloadSV.downloadFile(res.Data), '_blank');
      } else {
        this.amisTransferSV.showErrorToast();
      }
    }, error => {
      this.amisTransferSV.showErrorToast();
    });
  }

  /**
   * Hàm tải xuống tệp mẫu
   * Created by pvthong- 04/06/2020
   * @memberof PopupImportComponent
   */
  downloadFileModel() {
    this.importService.GetFileTempImport(this.systemCode, 0).subscribe(res => {
      if (res && res.Success) {
        window.open(this.downloadSV.downloadFile(res.Data), '_blank');
      }
      else {
        this.amisTransferSV.showErrorToast();
      }
    }, error => {
      this.amisTransferSV.showErrorToast();
    });

  }

  /**
   * Hàm click nút tiếp tục
   * Created by pvthong- 04/06/2020
   * @memberof PopupImportComponent
   */
  onContinue() {
    if (this.showPopupImport == PopupMultiScreen.ThirdPage) {
      this.importData();
    }
    else if (this.showPopupImport == PopupMultiScreen.SecondPage) {
      //this.customColums();
      this.isLoading = true;
      this.inValidLine = 0;
      this.validLine = 0;
      this.filterValidate = this.importFilterValidate.ALL;
      this.getValidateData();
    }
    else if (this.showPopupImport == PopupMultiScreen.FirstPage) {
      this.onChangeTitleLine();
      if (!this.isSelectTitleValid) {
        this.selectTitle.instance.focus();
        return;
      }
      this.ngModelfilterValue = "";
      this.showPopupImport = PopupMultiScreen.SecondPage;
      this.isLoading = true;
      this.isNodataMapping = false;
      this.getAndCustomColumn();
    }
  }

  /**
   * bắt sk value trong number box 'Dòng tiêu đề' thay đổi
   */
  onChangeTitleLine() {
    if (!this.titleLine) {
      this.isSelectTitleValid = false;
    } else this.isSelectTitleValid = true;
  }

  /**
   * bắt sk value trong number box 'Dòng tiêu đề' thay đổi
   */
  onKeyupTitleLine(e) {
    if (!e || !e.element) {
      return;
    }
    this.titleLine = e.element.querySelector('.dx-texteditor-input')?.value;
    if (!this.titleLine) {
      this.isSelectTitleValid = false;
    } else this.isSelectTitleValid = true;
  }

  /**
   * Hàm click nút quay lại
   * Created by pvthong- 04/06/2020
   * @memberof PopupImportComponent
   */
  onBack() {
    if (this.showPopupImport == PopupMultiScreen.SecondPage) {
      this.showPopupImport = PopupMultiScreen.FirstPage;
      this.validateMapping = true;
    }
    if (this.showPopupImport == PopupMultiScreen.ThirdPage) {
      this.ngModelfilterValue = "";
      this.isNodataMapping = false;
      this.showPopupImport = PopupMultiScreen.SecondPage;
    }
    if (this.showPopupImport == PopupMultiScreen.FourthPage) {
      this.showPopupImport = PopupMultiScreen.ThirdPage;

    }
  }

  /**
   * Hàm thay đổi lựa chọn Cập nhập hay bỏ qua
   * Created by pvthong- 04/06/2020
   * @memberof PopupImportComponent
   */
  changeCheckPass(isCheck) {
    if (!isCheck) {
      this.isPassOrUpdate = !this.isPassOrUpdate;
    }
  }

  /**
   * Mở thiết lập từ điển cột
   * Created by pvthong- 04/06/2020
   * @memberof PopupImportComponent
   */
  openColumnMatching() {
    this.title = this.translateSV.getValueByKey("IMPORT_SETTING_AUTO_MAPPING");
    this.ngModelColummMatching = "";
    this.isNodataSetting = false;
    this.importService.getImportMapping(this.systemCode).subscribe(res => {
      this.listMappingKeyword = res.Data;
      //đếm để tô màu row
      let row = 0;
      this.listMappingKeyword.forEach(element => {
        element.isDisplay = true;
        row++;
        if (row % 2 == 0) {
          element.isBgRow = true;
        }
        else {
          element.isBgRow = false;
        }
      });
    });
    setTimeout(() => {
      this.isImport = false;
    })
  }

  /**
   * đóng thiết lập từ điển cột
   * Created by pvthong- 04/06/2020
   * @memberof PopupImportComponent
   */
  closeColumnMatching() {
    this.title = this.translateSV.getValueByKey("IMPORT");
    setTimeout(() => {
      this.isImport = true;
    })
  }

  /**
   * lưu thiết lập từ điển cột
   * Created by pvthong- 04/06/2020
   * @memberof PopupImportComponent
   */
  saveColumnMatching() {
    this.title = this.translateSV.getValueByKey("IMPORT");
    this.listMappingKeyword.forEach(element => {
      element.State = FormMode.Update;
    });
    this.importService.saveImportMapping(this.systemCode, this.listMappingKeyword).subscribe(res => {
      if (res?.Success) {
        this.isImport = true;
        this.amisTransferSV.showSuccessToast(this.translateSV.getValueByKey("IMPORT_EDIT_AUTO_MAPPING_SUCCESS"));
      }
      else {
        this.amisTransferSV.showErrorToast();
      }
    }, err => {
      this.amisTransferSV.showErrorToast();
    });
  }

  /**
   * Search từ điển cột trên phần mềm
   * Created by: pvthong 05-06-2020
   */
  onSearchControl(e) {
    let searchText = e.element.querySelector('.dx-texteditor-input').value;
    searchText = AmisStringUtils.convertVNtoENToLower(searchText);
    //đếm để tô màu row
    let row = 0;
    this.listHeaderObject.forEach(element => {
      let caption = AmisStringUtils.convertVNtoENToLower(element.DatabaseFieldCaption);
      if (caption.indexOf(searchText) > -1) {
        element.isDisplay = true;
        row++;
        if (row % 2 == 0) {
          element.isBgRow = true;
        }
        else {
          element.isBgRow = false;
        }
      }
      else {
        element.isDisplay = false;
      }
    });
    let listHeader = this.listHeaderObject.filter(x => x.isDisplay);
    if (listHeader.length > 0) {
      this.isNodataMapping = false;
    }
    else {
      this.isNodataMapping = true;
    }
  }

  /**
   * Search từ điển cột trên phần mềm
   * Created by: pvthong 05-06-2020
   */
  onKeyupSearchBox(e) {
    let searchText = e.element.querySelector('.dx-texteditor-input').value;
    this.ngModelfilterValue = AmisCommonUtils.cloneData(searchText);
    searchText = AmisStringUtils.convertVNtoENToLower(searchText);
    //đếm để tô màu row
    let row = 0;
    this.listHeaderObject.forEach(element => {
      let caption = AmisStringUtils.convertVNtoENToLower(element.DatabaseFieldCaption);
      if (caption.indexOf(searchText) > -1) {
        element.isDisplay = true;
        row++;
        if (row % 2 == 0) {
          element.isBgRow = true;
        }
        else {
          element.isBgRow = false;
        }
      }
      else {
        element.isDisplay = false;
      }
    });
    let listHeader = this.listHeaderObject.filter(x => x.isDisplay);
    if (listHeader.length > 0) {
      this.isNodataMapping = false;
    }
    else {
      this.isNodataMapping = true;
    }
  }

  /**
   * Search từ điển cột trên phần mềm
   * Created by: pvthong 05-06-2020
   */
  onChangeColumnMapping(e) {
    let searchText = e.element.querySelector('.dx-texteditor-input').value;
    searchText = AmisStringUtils.convertVNtoENToLower(searchText);
    //đếm để tô màu row
    let row = 0;
    this.listMappingKeyword.forEach(element => {
      let caption = AmisStringUtils.convertVNtoENToLower(element.Caption);
      if (caption.indexOf(searchText) > -1) {
        element.isDisplay = true;
        row++;
        if (row % 2 == 0) {
          element.isBgRow = true;
        }
        else {
          element.isBgRow = false;
        }
      }
      else {
        element.isDisplay = false;
      }
    });
    let listMapping = this.listMappingKeyword.filter(x => x.isDisplay);
    if (listMapping.length > 0) {
      this.isNodataSetting = false;
    }
    else {
      this.isNodataSetting = true;
    }
  }

  /**
   * Search từ điển cột trên phần mềm
   * Created by: pvthong 05-06-2020
   */
  onKeyupColumnMapping(e) {
    let searchText = e.element.querySelector('.dx-texteditor-input').value;
    this.ngModelColummMatching = AmisCommonUtils.cloneData(searchText);
    searchText = AmisStringUtils.convertVNtoENToLower(searchText);
    //đếm để tô màu row
    let row = 0;
    this.listMappingKeyword.forEach(element => {
      let caption = AmisStringUtils.convertVNtoENToLower(element.Caption);
      if (caption.indexOf(searchText) > -1) {
        element.isDisplay = true;
        row++;
        if (row % 2 == 0) {
          element.isBgRow = true;
        }
        else {
          element.isBgRow = false;
        }
      }
      else {
        element.isDisplay = false;
      }
    });
    let listMapping = this.listMappingKeyword.filter(x => x.isDisplay);
    if (listMapping.length > 0) {
      this.isNodataSetting = false;
    }
    else {
      this.isNodataSetting = true;
    }
  }

  /**
   * Paging
   * Created by: pvthong 12-06-2020
   */
  getImportValidate(param) {
    this.isLoading = true;
    this.importService.GetDataValidatePagging(this.systemCode, param).subscribe(res => {
      if (res?.Success) {
        this.isLoading = false;
        let data = res.Data;
        if (this.filterValidate == ImportFilterValidate.ALL) {
          this.totalImport = this.validLine + this.inValidLine;
        }
        else if (this.filterValidate == ImportFilterValidate.VALID) {
          this.totalImport = this.validLine;
        }
        else if (this.filterValidate == ImportFilterValidate.INVALID) {
          this.totalImport = this.inValidLine;
        }
        if (data) {
          this.objectJson = [];
          data.forEach(e => {
            let objectImport = new Import();
            objectImport.Success = e.Success;
            objectImport.ErrorMessage = e.ErrorMessage;
            if (!objectImport.Success) {
              objectImport.Result = this.translateSV.getValueByKey("IMPORT_INVALID_TEXT");
            }
            else {
              objectImport.Result = this.translateSV.getValueByKey("IMPORT_VALID_TEXT");
            }
            let listFieldError = [];
            e.DataRows.forEach(element => {

              const property = element.DatabaseField;
              let pair = {};
              if (element.DisplayField) {
                pair[element.DatabaseField] = element.CellValue;
                pair[element.DisplayField] = element.DisplayValue;
              }
              else {
                pair[element.DatabaseField] = element.DisplayValue;
              }
              let temp = this.listColumnMappingClone.find(x => x.DatabaseField == element.DatabaseField);
              if (temp) {
                switch (element.DataType) {
                  case DataType.DateType:
                  case DataType.DateTimeType:
                    temp.TypeControl = TypeControl.Date;
                    pair[property] = element.CellValue;
                    break;
                  case DataType.NumberType:
                    temp.TypeControl = TypeControl.Number;
                    break;

                  case DataType.CurrencyType:
                    temp.TypeControl = TypeControl.Currency;
                    break;
                  case DataType.HyperLinkType:
                    temp.TypeControl = TypeControl.Hyperlink;
                    break;
                  case TypeControl.Checkbox:
                    temp.TypeControl = DataType.CheckBoxType;
                    break;

                  case DataType.PercentType:
                    temp.TypeControl = TypeControl.Percent;
                    break;
                  case DataType.YearType:
                    temp.TypeControl = TypeControl.Year;
                    break;
                  case DataType.MonthYearType:
                    temp.TypeControl = TypeControl.MonthYear;
                    break;
                  case DataType.SortOrderType:
                    temp.TypeControl = TypeControl.Year;
                    break;
                }
              }
              if (!element.Success) {
                listFieldError.push(element.DatabaseField);
              }
              objectImport = { ...objectImport, ...pair };
            });
            objectImport.listFieldError = listFieldError;
            objectImport.Index = this.objectJson.length + 1 + (this.currentPageIndex - 1) * this.currentPageSize;
            this.objectJson.push(objectImport);
          });

          // this.objectJsonClone = AmisCommonUtils.cloneData(this.objectJson);
        }
      }
      else {
        this.isLoading = false;
        this.amisTransferSV.showErrorToast();
      }
    }, err => {
      this.isLoading = false;
      this.amisTransferSV.showErrorToast();
    })
  }

  /**
   * Paging
   * Created by: pvthong 12-06-2020
   */
  getImportPaging(event) {
    if (!event) {
      return;
    }
    this.currentPageIndex = event.PageIndex;
    this.currentPageSize = event.PageSize;

    let param = {};
    switch (this.filterValidate) {
      case ImportFilterValidate.ALL:
        param = {
          FileName: this.fileName,
          Skip: (this.currentPageIndex - 1)*this.currentPageSize,
          Take: this.currentPageSize
        };
        break;
      case ImportFilterValidate.VALID:
        param = {
          FileName: this.fileName,
          Skip: (this.currentPageIndex - 1)*this.currentPageSize,
          Take: this.currentPageSize,
          Success: true
        };
        break;
      case ImportFilterValidate.INVALID:
        param = {
          FileName: this.fileName,
          Skip: (this.currentPageIndex - 1)*this.currentPageSize,
          Take: this.currentPageSize,
          Success: false
        };
        break;
    }

    this.getImportValidate(param);
  }

  /**
   * Paging
   * Created by: pvthong 12-06-2020
   */
  filterValidateImport(enumFilter) {
    if (this.filterValidate == enumFilter) {
      return;
    }
    this.filterValidate = enumFilter;
    let param = {};
    switch (enumFilter) {
      case ImportFilterValidate.ALL:
        param = {
          FileName: this.fileName,
          Skip: (this.currentPageIndex - 1) * this.currentPageSize,
          Take: this.currentPageSize
        };
        break;
      case ImportFilterValidate.VALID:
        param = {
          FileName: this.fileName,
          Skip: (this.currentPageIndex - 1) * this.currentPageSize,
          Take: this.currentPageSize,
          Success: true
        };
        break;
      case ImportFilterValidate.INVALID:
        param = {
          FileName: this.fileName,
          Skip: (this.currentPageIndex - 1) * this.currentPageSize,
          Take: this.currentPageSize,
          Success: false
        };
        break;
    }

    this.getImportValidate(param);
  }


  //#endregion function

}
