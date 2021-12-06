import { OnDestroy, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { FormMode } from 'src/common/enum/form-mode.enum';
import { AmisCommonUtils } from 'src/common/fn/common-utils';
import { BaseFormComponent } from 'src/common/components/base-component-form';

export class BaseCustomFormComponent extends BaseFormComponent implements OnDestroy, OnInit {

  // tham số đầu vào
  @Input() set inputData(value) {
    if (value) {
      this.getInputParam(value);
    }
  }

  // vị trí hiển thị form
  @Input() formPosition: string = "";

  // form mode cua thang cha
  @Input() masterFormMode: FormMode;

  // Sau khi gọi api lưu thành công
  @Output() afterSaveSuccess: EventEmitter<any> = new EventEmitter();

  // Sau khi hủy bỏ
  @Output() afterCancel: EventEmitter<any> = new EventEmitter();

  // Sau khi Đóng form
  @Output() afterClose: EventEmitter<any> = new EventEmitter();

  // Sau khi xóa dữ liệu
  @Output() afterDeleteSuccess: EventEmitter<any> = new EventEmitter();

  // Subsystem code thực hiện hành động
  subSystemActionCode: any;

  // PermissionCode thực hiện hành động
  permissionActionCode: any;

  // Custom quyền truyền vào
  permissionObject: any;

  // Có bỏ qua check quyền hay không
  isIgnorePermission: boolean = false;

  // OBject truyền vào form sau khi submit
  objectAfterSubmit: any;

  // OBject truyền vào form sau khi submit
  isReloadData: boolean = false;

  // hiển thị form
  visibleForm: boolean = true;

  // form mode
  formMode: FormMode;

  // Form mode submit
  formModeSubmit: FormMode;

  // Object truyền vào khi submit
  objectSubmit: any;

  // Tiêu đề form
  formTitle: string = "";

  // Object Master
  objectMaster: any;

  // COntroller sử dụng
  controller: string;

  // Giá trị của master
  masterValue: any;

  // field liên kết với master
  masterField: string;

  // Khóa chính của object
  primaryKey: string

  // Loại show
  typeShow = {
    IsEditable: false,
    IsViewOnly: false,
    IsViewEditable: false
  };

  // custom config danh sách các trường dữ liệu ăn theo họ và tên
  customConfig = {};

  groupBox: any = {};

  // chỉ cho phép xem ở form xem
  isViewOnly: boolean = false;

  // form có thay đổi data hay k
  isDataChange: boolean = false;

  constructor() { super(); }

  ngOnInit(): void {
  }


  /**
   * Đóng form
   * @memberof BaseCustomFormComponent
   * created by vhtruong - 08/07/2020
   */
  closeForm() {
    this.afterClose.emit(this.isReloadData);
  }


  //#region Nhận param và binding dữu liệu mở form

  /**
   * Xử lý danh sách param truyền vào
   * @param {any} data 
   * @memberof BaseCustomFormComponent
   * created by vhtruong - 08/07/2020
   */
  getInputParam(data) {
    this.isViewOnly = data?.IsViewOnly ? true : false;
    if (data.FormMode) {
      this.formMode = data.FormMode;
      this.handleFormView(data);
    }
  }


  /**
   * Binding dữ liệu lúc vào form
   * @memberof BaseCustomFormComponent
   * created by vhtruong - 08/07/2020
   */
  handleFormView(data) {
    // Override
  }

  //#endregion

  //#region submit và validate

  /**
   * Submit form
   * @memberof BaseCustomFormComponent
   * created by vhtruong - 08/07/2020
   */
  submitForm(formModeSubmit) {
    this.formModeSubmit = formModeSubmit;
    this.objectSubmit = AmisCommonUtils.cloneData({ IsSubmit: true });
  }


  /**
   * Sau khi validate
   * @memberof BaseCustomFormComponent
   * created by vhtruong - 08/07/2020
   */
  afterValidate(e) {
    if (e?.length) {
      return;
    }
    this.saveData();
  }


  /**
   * Lưu dữ liệu
   * @memberof BaseCustomFormComponent
   * created by vhtruong - 08/07/2020
   */
  saveData() {
    this.groupBox.GroupFieldConfigs.forEach(element => {
      this.objectMaster[`${element.FieldName}`] = element.Value;
      if (element.DisplayField) {
        this.objectMaster[`${element.DisplayField}`] = element.ValueText;
      }
    });
    this.afterSaveSuccess.emit({
      FormModeSubmit: this.formModeSubmit,
      Data: AmisCommonUtils.cloneData(this.objectMaster)
    })
    if (this.formModeSubmit === FormMode.SaveAndInsert) {
      this.setConfig();
      this.objectAfterSubmit = AmisCommonUtils.cloneData({ IsFocusFirstItem: true });
    }
  }


  /**
   * Gán dữ liệu từ group config vào object
   * @memberof BaseCustomFormComponent
   * created by vhtruong - 13/07/2020
   */
  setDataToOject() {
    this.groupBox.GroupFieldConfigs.forEach(element => {
      this.objectMaster[`${element.FieldName}`] = element.Value;
      if (element.DisplayField) {
        this.objectMaster[`${element.DisplayField}`] = element.ValueText;
      }
    });
  }


  /**
   * Setgroup config
   * @memberof BaseCustomFormComponent
   * created by vhtruong - 13/07/2020
   */
  setConfig() {
    // Override
  }


  /**
   * Ấn sửa ở form xem chi tiết
   * @memberof BaseCustomFormComponent
   * created by vhtruong - 08/07/2020
   */
  edit() {
    this.formMode = FormMode.Update;
    this.typeShow = {
      IsEditable: false,
      IsViewOnly: false,
      IsViewEditable: false
    };
    this.objectAfterSubmit = AmisCommonUtils.cloneData({ IsFocusFirstItem: true });
    this.afterChangeFormToEdit();
  }


  /**
   * hàm muốn chạy sau khi đổi form mode sang sửa
   * @memberof BaseCustomFormComponent
   * created by vhtruong - 14/07/2020
   */
  afterChangeFormToEdit() {
    // OVerride
  }

  //#endregion
}

