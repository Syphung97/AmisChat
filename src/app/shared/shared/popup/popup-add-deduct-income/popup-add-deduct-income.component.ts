import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { ButtonType } from '../../enum/common/button-type.enum';
import { ButtonColor } from '../../enum/common/button-color.enum';
import { DataType } from 'src/common/models/export/data-type.enum';
import { TypeControl } from '../../enum/common/type-control.enum';
import { GroupConfigUtils } from '../../function/group-control-utils';
import { TypeShowControl } from 'src/common/models/base/typeShow';
import { AmisCommonUtils } from 'src/common/fn/common-utils';
import { Allowance } from '../../models/allowance/allowance';
import { PayrollItemService } from 'src/app/services/payroll-Item/payroll-Item.service';
import { Params } from 'src/common/models/common/params';

@Component({
  selector: 'amis-popup-add-deduct-income',
  templateUrl: './popup-add-deduct-income.component.html',
  styleUrls: ['./popup-add-deduct-income.component.scss']
})
export class PopupAddDeductIncomeComponent implements OnInit {

  //visible popup
  @Input() visiblePopup = false;

  //title pop
  @Input() title = "Thêm khoản thu nhập thường xuyên";

  //type popup 1:Thêm khoản thu nhập thường xuyên   2:Thêm khấu trừ thường xuyên
  @Input() typePopup: number = 1;

  //output hủy
  @Output() outputCancel: EventEmitter<any> = new EventEmitter<any>();

  //output lưu popup
  @Output() outputSave: EventEmitter<any> = new EventEmitter<any>();

  buttonType = ButtonType;
  buttonColor = ButtonColor;

  //trang
  currentPageIndex = 1;
  //số lượng/trang
  currentPageSize = 50;

  //submit thông tin
  isSubmit: boolean = false;

  //type control
  typeShow: TypeShowControl = {
    IsEditable: false,
    IsViewOnly: false,
    IsViewEditable: true
  };

  //
  currentAllowance = new Allowance();

  //list data
  listData = [];

  //list GroupConfigs
  listGroupConfigs = [];

  currentList: any = [{
    // GroupConfigName: this.translateSV.getValueByKey("ADD_JOB_ROLE_DETAIL_ROLE"),
    GroupType: 1,
    ColumnGroup: 1,
    IsVisible: true,
    IsChild: false,
    IsExpand: true,
    GroupFieldConfigs: []
  }];

  //
  GroupFieldConfigs:any = [{
    FieldName: "PayrollItemName",
    Caption: "Tên khoản thu nhập",
    DataType: DataType.DefaultType,
    TypeControl: TypeControl.Combobox,
    // SubsystemCode: "JobRole",
    // ID: this.currentJobRole.JobPositionRoleID,
    // TableName: "job_position_role",
    IsRemoteServer : true,
    Controller: "PayrollItem",
    Url : "paging",
    Param : {
      PageIndex: 1,
      PageSize: 100
    },
    FieldNameSource : "PayrollItemID",
    DisplayFieldSource : "PayrollItemName",
    IsRequire: true,
    IsReadOnly: false,
    // IsUnique: true,
    ColumnIndex: 1,
    ValidateMethod: [],
    Value: ""
  },
  {
    FieldName: "IncomeType",
    Caption: "Chịu thuế",
    DataType: DataType.DefaultType,
    TypeControl: TypeControl.OneRow,
    IsReadOnly: true,
    ColumnIndex: 1,
    ValidateMethod: [],
    Value: "Thuế lũy tiến",
    Type:94
  },
  {
    FieldName: "IsDeduction",
    Caption: "Giảm trừ khi tính thuế",
    DataType: DataType.DefaultType,
    TypeControl: TypeControl.Checkbox,
    IsReadOnly: true,
    ColumnIndex: 1,
    ValidateMethod: [],
    Value: false,
    Type:95
  },
  {
    FieldName: "Formula",
    Caption: "Định mức",
    DataType: DataType.DefaultType,
    TypeControl: TypeControl.OneRow,
    IsReadOnly: false,
    ColumnIndex: 1,
    ValidateMethod: [],
    Value: ""
  },
  {
    FieldName: "FormulaFunction",
    Caption: "Số tiền / công thức",
    DataType: DataType.UnitPriceType,
    TypeControl: TypeControl.OneRow,
    IsReadOnly: false,
    ColumnIndex: 1,
    ValidateMethod: [],
    Value: ""
  },
  {
    FieldName: "PayInPeriod",
    Caption: "Kỳ lương",
    DataType: DataType.DefaultType,
    TypeControl: TypeControl.OneRow,
    IsReadOnly: false,
    ColumnIndex: 1,
    ValidateMethod: [],
    Value: ""
  },
  {
    FieldName: "Description",
    Caption: "Ghi chú",
    DataType: DataType.DefaultType,
    TypeControl: TypeControl.MultiRow,
    IsReadOnly: false,
    ColumnIndex: 1,
    ValidateMethod: [],
    Value: "",
    Type:95
  }]
  

  constructor(
    private payrollItemSV: PayrollItemService
  ) { }

  ngOnInit(): void {
    this.inItpopup();
    // this.listGroupConfigs = GroupConfigUtils.GetData(this.currentList);
    this.getListPayrollItem();
    
  }

  /**
   * Lấy danh sách các loại khoản lương
   * Created by PVTHONG 22/05/2020
   */
  getListPayrollItem(){
    let param = this.getParamForPaging();
    this.payrollItemSV.getPayrollItemPaging(param).subscribe(res => {
      if (res?.Success && res.Data) {
        this.listData = res.Data.PageData;
      }
    })
  }

  /**
   * param phân trang
   * Created By PVTHONG 09/05/2020
   */
  getParamForPaging() {
    const param: Params = new Params();
    param.PageIndex = this.currentPageIndex;
    param.PageSize = this.currentPageSize;
    param.Filter = "";
    param.Sort = "";
    return param;
  }

  /**
   * Khởi tạo popup
   * Created by PVTHONG 22/05/2020
   */
  inItpopup(){
    this.currentAllowance.IncomeType = 1;
    this.currentAllowance.IncomeTypeName = "Thuế lũy tiến";
    this.currentAllowance.IsDeduction = false;
    // this.GroupFieldConfigs.forEach(element => {
    //   if( !element.Type || element.Type == this.typePopup){
    //     this.currentList[0].GroupFieldConfigs.push(element);
    //   }
    // });
  }

  /**
   * Đóng popup
   * Created by PVTHONG 22/05/2020
   */
  cancel() {
    this.outputCancel.emit(true);
  }

  /**
   * Lưu thông tin popup
   * Created by PVTHONG 22/05/2020
   */
  save() {
    if(this.currentAllowance.PayrollItemName){
    }
    this.visiblePopup = false;
    this.outputSave.emit(this.currentAllowance);
    // this.listGroupConfigs[0].GroupFieldConfigs.forEach(element => {
    //   this.currentAllowance[element.FieldName] = element.Value;
    // });
    // this.isSubmit = AmisCommonUtils.cloneData({ IsSubmit: true });
  }

  /**
   * đóng popup
   * Created by PVTHONG 22/05/2020
   */
  closePopup(){
    this.cancel();
  }

  /**
   * Hàm nhận giá trị sau khi validate từ form
   * created by pvthong - 11/05/2020
   */
  afterValidated(event) {
    if (event?.length) {
      console.log("có lỗi xảy ra");
      return;
    }
    this.listGroupConfigs[0].GroupFieldConfigs.forEach(element => {
      this.currentAllowance[element.FieldName] = element.Value;
    });
    this.outputSave.emit(this.currentAllowance)
  }

}
