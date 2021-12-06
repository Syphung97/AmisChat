import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormMode } from 'src/common/enum/form-mode.enum';
import { ButtonColor } from '../../enum/common/button-color.enum';
import { TransferDataService } from 'src/app/services/base/transfer-data.service';
import { GridSelectionType } from '../../enum/common/grid-selection-type.enum';
import { AmisDataService } from 'src/common/services/amis-data.service';
import { BaseComponent } from 'src/common/components/base-component';
import { takeUntil } from 'rxjs/operators';
import { AmisPagingGridComponent } from 'src/common/components/amis-grid/amis-paging-grid/amis-paging-grid.component';
import { AmisTranslationService } from 'src/common/services/amis-translation.service';
import { ConfigService } from 'src/app/services/config/config.serice';
import { AmisCommonUtils } from 'src/common/fn/common-utils';
import { GroupType } from '../../enum/group-config/group-type.enum';
import { AmisTransferDataService } from 'src/common/services/amis-transfer-data.service';


declare const $: any;

@Component({
  selector: 'amis-popup-base-select-data',
  templateUrl: './popup-base-select-data.component.html',
  styleUrls: ['./popup-base-select-data.component.scss']
})
export class PopupBaseSelectDataComponent extends BaseComponent implements OnInit {

  // // Ẩn hiện popup
  // @Input() modelController: string = "";
  // // url
  // @Input() url = "";
  // // controller gọi lấy dữ liệu
  // @Input() controller = "";

  // Biến lưu id grid
  @ViewChild('pagingGrid', { static: false })
  pagingGrid: AmisPagingGridComponent;

  // Biến lưu id grid
  @ViewChild('searchTextBox', { static: false })
  searchTextBox: ElementRef;

  // Ẩn hiện popup
  @Input() visiblePopup = false;
  // Ẩn hiện popup
  @Input() isGetMethod: boolean = false;
  // có cho phép thêm sửa dữ liệu hay không
  @Input() isModifiable: boolean = true;
  // controller gọi lấy dữ liệu
  @Input() isSingleSelection: boolean = true;
  // Tên trường lấy giá trị
  @Input() valueExpr;
  // Tên trường để hiển thị
  @Input() displayExpr;
  // label trường dữ liệu
  @Input() labelText: string = "";
  // label trường dữ liệu
  @Input() popupWidth: string = "";

  // label trường dữ liệu
  @Input() tableName: string = "";


  _subSystemCode: string = "";
  // subsystem code để lấy layout config
  @Input() set subSystemCode(value) {
    if (value) {
      this._subSystemCode = value;
      this.getLayoutConfig();
    }
  }

  //group config
  @Input()
  set groupConfig(value) {
    if (value) {
      this.processGroupConfigData(value);
    }
  }

  // tham số truyền vào lấy dữ liệu
  @Input()
  set inputParam(value) {
    if (value) {
      this.extractInputParam(value);
    }
  }
  // các trường
  @Input()
  set inSelectedRecords(value) {
    if (value) {
      this.getInSelectedRecords(value);
    }
  };

  // Danh sách bản ghi được chọn
  @Output() outSelectedRecord: EventEmitter<any> = new EventEmitter<any>();
  // Đóng popup
  @Output() closePopup: EventEmitter<any> = new EventEmitter<any>();
  timeSearch: any;
  inSelectedItem: any; //danh sách bản ghi đc chọn
  // chiều cao popup
  height: string = "auto";
  // title popup
  title = "";
  // chiều cao grid
  gridHeight: number;
  // kiểu grid là chọn 1 hay nhiều
  SelectionType = GridSelectionType;

  //Nếu service trả về tất cả dữ liệu
  isGetAllData: boolean = false;

  fieldName: string = "";

  visibleNotify: boolean = false; // hiển thị popup cảnh báo

  // Form mode của popup
  formMode = FormMode.Insert;

  // Groupconfig
  _groupConfig: any; // group config
  _groupFieldConfigs: any; // group field config

  // tham số lấy dữ liệu
  requestParams = {
    PageIndex: 1,
    PageSize: 10,
    Filterby: "",
    Orderby: "",
    Columns: ""
  };

  FormMode = FormMode;

  isLoadGrid: boolean = false;

  offsetY = "0 100px";

  columns = [];

  visiblePopupAdd: boolean = false;

  titlePopup: string = "";

  searchName: string = "";

  // dữ liệu đổ lên grid
  dataSource = [];

  // dữ liệu đổ lên grid
  orgDataSource: any = [];

  //số lượng các record đc chọn
  countRecord: number = 0;

  //tên bản ghi được chọn
  dataValue: string = "";

  //Tổng số lượng data
  totalRecord: number = 0;

  //danh sách record đc chọn
  selectedData = [];

  //danh sách các trường dữ liệu dùng để tìm kiếm
  searchFields = [];

  buttonColor = ButtonColor;

  popupNotifyContent: string = "";
  popupNotifyTitle: string = "";

  /**
 * Các thông tin của form popup xóa
 */
  popupDelete = {
    TitlePopupDelete: "",
    VisiblePopupDelete: false,
    ContentPopupDelete: "",
    ItemDelete: null
  }

  isReloadData: boolean = false;
  isDeletedItem: boolean = false; // bản ghi được chọn có phải bị xóa rồi không
  isUpdatedItem: boolean = false; // bản ghi được chọn có phải bị cập nhật rồi không
  outUpdatedItems = []; // các bản ghi đc cập nhật đẩy ra ngoài
  updatedItems = []; // các bản ghi được thực hiện thay đổi dữ liệu

  currentItem; //pick list được chọn để sửa

  listOption = [
    {
      Key: FormMode.Update,
      Text: "Sửa",
      Icon: 'icon-edit',
      Enable: "IsSystem"
    },
    {
      Key: FormMode.Delete,
      Text: "Xóa",
      Icon: 'icon-delete-red',
      Enable: "IsSystem"
    }
  ]

  constructor(
    private amisTranslateSV: AmisTranslationService,
    private transferData: TransferDataService,
    private amisTransferData: AmisTransferDataService,
    public httpBase: AmisDataService,
    private configService: ConfigService

  ) {
    super();
  }

  ngOnInit(): void {
    this.resizeGrid();
    this.getData();
  }

  /**
   * Lấy config từ db
   * nmduy 05/06/2020
   */
  getLayoutConfig() {
    if (this._subSystemCode) {
      let param = {
        SubsystemCode: this._subSystemCode,
        LayoutConfigID: 0
      }
      const me = this;
      me.configService.getLayoutConfig(param).pipe(takeUntil(me._onDestroySub)).subscribe(res => {
        if (res?.Success) {
          if (res.Data && res.Data.ListGroupConfig?.length) {
            this._groupConfig = res.Data.ListGroupConfig[0];
            this.processGroupConfigData(this._groupConfig);
          }
        }
      })
    }
  }

  /**
   * Xử lý dữ liệu bind lên grid
   * nmduy 06/06/2020
   */
  processGroupConfigData(groupConfig) {
    this._groupConfig = groupConfig;
    this._groupFieldConfigs = groupConfig.GroupFieldConfigs;
    this.getPopupTitle();
    this.getGridColumn(); // lấy thông tin các cột trên grid
    this.getSearchNames(); // lấy các trường để tìm kiếm
  }



  /**
   * Lấy grid column để gen ra grid
   * nmduy 06/06/2020
   */
  getGridColumn() {
    if (this._groupFieldConfigs?.length) {
      this.columns = AmisCommonUtils.cloneDataArray(this._groupFieldConfigs);
      this.columns.forEach(element => {
        if (element.DisplayField && element.DisplayField != element.FieldName) {
          element.FieldName = element.DisplayField;
        }
        if (element.CustomConfig) {
          const obj = JSON.parse(element.CustomConfig);
          if (obj.GridConfigs) {
            for (let itm in obj.GridConfigs) {
              element[itm] = obj.GridConfigs[itm];
            }
          }
        }
      });
      this.isLoadGrid = true;
    }
  }

  /**
   * Lấy danh sách dữ liệu truyền vào
   * nmduy 28/05/2020
   */
  getInSelectedRecords(value) {
    this.selectedData = [];
    if (this.isSingleSelection) {
      if (value) {
        this.inSelectedItem = [value];
        this.selectedData.push(value);
      }
    } else {
      if (value?.length) {
        this.inSelectedItem = value;
        this.selectedData = value;
      }
    }
  }


  /**
   * Lấy tham số truyền vào để lấy dữ liệu
   * nmduy 22/05/2020
   */
  extractInputParam(inputParam) {
    if (inputParam) {
      const properties = Object.keys(inputParam);
      if (properties?.length) {
        properties.forEach(element => {
          if (element != "PageIndex" && element != "PageSize") {
            this.requestParams[`${element}`] = inputParam[`${element}`]
          }
        });
      }
    }
  }

  /**
   * Lấy tên hiển thị lên popup
   * nmduy 18/05/2020
   */
  getPopupTitle() {
    this.fieldName = this._groupConfig?.GroupConfigName ? this._groupConfig?.GroupConfigName : this.labelText;
    this.title = this.amisTranslateSV.getValueByKey("POPUP_SELECT_DATA_SELECT_DATA", { FieldName: this.fieldName });
  }

  /**
  * Gọi service lấy dữ liệu
  * Created By nmduy 18/05/2020
  */
  getData(param?) {
    const me = this;
    me.handleParamFilter();
    if (param) {
      me.requestParams.PageIndex = param.PageIndex;
    }
    me.httpBase.getDataByURL('data', 'Dictionary', this.requestParams, true, true, this.isGetMethod).pipe(takeUntil(me._onDestroySub)).subscribe(res => {
      if (res.Success && res.Data) {
        if (res.Data.PageData) {
          this.dataSource = res.Data.PageData;
          this.totalRecord = res.Data.Total;
        } else {
          this.dataSource = res.Data;
          this.orgDataSource = res.Data;
          this.isGetAllData = true;
        }
        this.selectedData = AmisCommonUtils.cloneDataArray(this.selectedData);
      }
    });
  };

  /**
   * bắt sự kiện thay đổi giá trị ô text box
   * nmduy 15/04/2020
   */
  changeTextBoxValue(e) {
    if (e && e.event && e.event.type == "dxclick") {
      if (this.isGetAllData) {
        this.filterData();
      } else {
        this.requestParams.PageIndex = 1;
        this.getData();
      }
    }
  }

  /**
  * bắt sự kiện keyup ô tìm kiếm
  * nmduy 15/04/2020
  */
  onKeyupSearchBox(e) {
    const input = this.searchTextBox?.nativeElement?.querySelector("input");
    if (this.isGetAllData) {
      var inputVal = input?.value;
      this.searchName = inputVal.trim();
      this.filterData();
    } else {
      clearTimeout(this.timeSearch);
      this.timeSearch = setTimeout(() => {
        var inputVal = input?.value;
        if (inputVal) inputVal = inputVal.trim();
        if (inputVal != this.searchName) {
          this.searchName = inputVal;
          this.requestParams.PageIndex = 1;
          this.getData();
        }
      }, 500);
    }
  }


  /**
   * Lấy ra danh sách các trường tìm kiếm trên grid
   * nmduy 22/05/2020
   * 
   */
  getSearchNames() {
    if (this._groupConfig.GroupFieldConfigs?.length) {
      let groupFieldConfigs = this._groupConfig.GroupFieldConfigs;
      for (let i = 0; i < groupFieldConfigs.length; i++) {
        const element = groupFieldConfigs[i];
        this.searchFields.push(element.FieldName);
      }
    }
  }


  /**
   * search offline
   * nmduy 22/05/2020
   */
  filterData() {
    var me = this;
    this.dataSource = this.orgDataSource.filter(function (item) {
      for (let i = 0; i < me.searchFields.length; i++) {
        const element = me.searchFields[i];
        if (item[`${element}`]?.toLowerCase().includes(me.searchName?.toLowerCase())) {
          return true;
        }
      }
      return false;
    });
    this.selectRows();
  }

  /**
   * Xử lý điều kiện filter
   * nmduy 19/05/2020
   */
  handleParamFilter() {
    this.requestParams.Filterby = ""
    if (this.searchName && this.searchName.trim()) {
      const searchName = this.searchName.trim();
      var filterCondition = "[";
      if (this.searchFields.length) {
        for (let index = 0; index < this.searchFields.length; index++) {
          const element = this.searchFields[index];
          filterCondition += `["${element}","contains","${searchName}"]`;
          if (index < this.searchFields.length - 1) filterCondition += `,"OR",`;
        }
        filterCondition += "]";
        this.requestParams.Filterby = AmisCommonUtils.Base64Encode(filterCondition);
      }
    }
  }

  /**
 * select phần tử trong grid
 * created by nmduy  - 12/05/2020
 */
  chooseRecord(data) {
    if (data) {
      if (this.isSingleSelection) {
        this.selectedData = data.selectedRowsData;
      } else {
        let listID = this.selectedData.map(e => e[`${this.valueExpr}`]);
        if (data.currentSelectedRowKeys.length != 0) {
          data.currentSelectedRowKeys.forEach(element => {
            if (listID.indexOf(element[`${this.valueExpr}`]) < 0) {
              this.selectedData.push(element);
            }
          });
        }
        if (data.currentDeselectedRowKeys.length != 0) {
          let deleteID = data.currentDeselectedRowKeys.map(e => e[`${this.valueExpr}`]);
          this.selectedData.forEach(ele => {
            if (deleteID.indexOf(ele[`${this.valueExpr}`]) > -1) {
              this.selectedData = this.selectedData.filter(e => e[`${this.valueExpr}`] != ele[`${this.valueExpr}`]);
            }
          });
        }
        this.countRecord = this.selectedData.length;
      }
    }

  }

  /**
 * Bỏ chọn bản ghi
 * Created by: nmduy  13-05-2020
 */
  removeSelectedRecord() {
    this.selectedData = [];
  }

  /**
   * Thêm dữ liệu từ form thêm nhanh
   */
  onDataChange(item) {
    if (item) {
      if (this.isSingleSelection) {
        this.selectedData = [];
      }
      else {
        this.selectedData = this.selectedData.filter(e => e[`${this.valueExpr}`] != item[`${this.valueExpr}`]);
      }
      this.selectedData.push(item);
      if (this.formMode == FormMode.Update) {
        var index = this.updatedItems.findIndex(e => e[`${this.valueExpr}`] == item[`${this.valueExpr}`]); // cập nhật danh sách 
        if (index > -1) {
          this.updatedItems[index] = AmisCommonUtils.cloneData(item);
        } else {
          this.updatedItems.push(item);
        }
      }
      this.isReloadData = true;
    }

    this.visiblePopupAdd = false;
    this.getData();
  }

  /**
   * Hiển thị popup thêm
   * nmduy 18/05/2020
   */
  showPopupAdd() {
    this._groupConfig.GroupType = GroupType.Field;
    this.titlePopup = this.amisTranslateSV.getValueByKey("POPUP_SELECT_DATA_ADD_DATA", { FieldName: this.fieldName });
    this.formMode = FormMode.Insert;
    this.currentItem = new Object();
    this.visiblePopupAdd = true;
  }

  /**
   * hiển thị popup sửa dữ liệu
   * nmduy 23/05/2020
   */
  showPopupEdit() {
    this._groupConfig.GroupType = GroupType.Field;
    this.titlePopup = this.amisTranslateSV.getValueByKey("POPUP_SELECT_DATA_EDIT_DATA", { FieldName: this.fieldName });
    this.formMode = FormMode.Update;
    this.visiblePopupAdd = true;
    this.pagingGrid.isContextMenuVisible = false;
  }


  /**
   * Xác nhận chọn dữ liệu bắn ra ngoài
   * nmduy 18/05/2020
   */
  onSelectData() {
    this.outSelectedRecord.emit(this.selectedData);
    // this.checkUpdatedItem();
    // if (this.isUpdatedItem) { // nếu cập nhật bản ghi đang được chọn
    //   this.onClosePopup();
    // }
    this.visiblePopup = false;
  }

  /**
* Kiểm tra dữ liệu danh sách dữ liệu vào có được cập nhật lại hay không
* nmduy 11/06/2020 
*/
  checkUpdatedItem() {
    if (this.isSingleSelection && this.selectedData.length == 1) {
      const element = this.selectedData[0];
      const updated = this.updatedItems.find(e => e[`${this.valueExpr}`] == element[`${this.valueExpr}`]);
      if (updated) { // nếu bản ghi được chọn nằm trong dach sách dữ liệu 
        this.isUpdatedItem = true;
        this.outUpdatedItems = this.selectedData;
      }
    }
  }


  /**
* click ba chấm trên grid
* Created By PVTHONG 13/05/2020
*/
  viewMoreRow(data) {
    if (data.ContextMenu) {
      this.currentItem = data.SelectedRow.key;
      this.selectOption(data.ContextMenu.Key);
    }
  }


  /**
  * lựa chọn trên grid
  * Created By PVTHONG 13/05/2020
  */
  selectOption(key) {
    switch (key) {
      case FormMode.Update:
        this.showPopupEdit();
        break;
      case FormMode.Delete:
        this.deleteItem();
      default:
        break;
    }
  }


  /**
   * Hiển thị popup cảnh báo không được thay đổi dữ liệu hệ thống
   * nmduy 29/05/2020
   */
  showNotifyPopup(message, title?) {
    this.popupNotifyTitle = title ? title : this.amisTranslateSV.getValueByKey("ERROR_HAPPENED");
    this.popupNotifyContent = message;
    this.visibleNotify = true;
  }


  /**
  * Đóng popup
  * nmduy 18/05/2020
  */
  onClosePopup() {
    this.visiblePopup = false;
    let param = {
      IsReload: this.isReloadData,
      IsDeleted: this.isDeletedItem,
      IsUpdated: this.isUpdatedItem,
      UpdatedItem: this.outUpdatedItems
    }
    this.closePopup.emit(param);
  }


  /**
* set chiều cao grid
* Created by nmduy 19/05/2020
*/
  resizeGrid() {
    if (window.innerHeight < 768) {
      this.offsetY = "0 50px"
      this.gridHeight = 300;
    }
  }

  /**
   * Hàm chọn dữ liệu
   * nmduy 29/05/2020
   */
  selectRows() {
    if (!this.selectedData?.length) {
      this.selectedData = [];
      this.selectedData.push(this.dataSource[0]);
    }
    this.pagingGrid.selectItemsOnGrid(this.selectedData);
  }



  //#region xóa

  /**
   * Xóa 1 bản ghi
   * nmduy 25/11/2019
   * @param item : item cần xóa
   */
  deleteItem() {
    const me = this;
    if (this.currentItem) {
      this.currentItem.State = FormMode.Delete;
      me.popupDelete.VisiblePopupDelete = true;
      me.popupDelete.ItemDelete = this.currentItem;
      me.popupDelete.TitlePopupDelete = this.amisTranslateSV.getValueByKey("POPUP_SELECT_DATA_DELETE_DATA", { FieldName: this.fieldName });
      me.popupDelete.ContentPopupDelete = this.amisTranslateSV.getValueByKey("POPUP_SELECT_DATA_DELETE_DATA_CONFIRM", { FieldName: this.fieldName, FieldValue: this.currentItem[`${this.displayExpr}`] });;
    }
  }

  /**
   * Sự kiện hủy popup Xóa
   * nmduy 17/12/2019
   * @param e
   */
  cancelPopupDelete(e) {
    const me = this;
    me.popupDelete.VisiblePopupDelete = false;
  }

  /**
   * Sự kiện xác nhận xóa
   * nmduy 17/12/2019
   * @param e
   */
  confirmPopupDelete(e) {
    const me = this;
    me.popupDelete.VisiblePopupDelete = false;
    var listDeleteItem = [];
    listDeleteItem.push(me.popupDelete.ItemDelete);
    me.httpBase.delete(this._subSystemCode, listDeleteItem).pipe(takeUntil(me._onDestroySub)).subscribe(res => {
      if (res?.Success) {
        if (res.ValidateInfo?.length) {
          this.showNotifyPopup(res.ValidateInfo[0].ErrorMessage, "Dữ liệu đã được sử dụng");
        } else {
          this.amisTransferData.showSuccessToast(this.amisTranslateSV.getValueByKey("DELETE_SUCCESS"));
          this.afterDeleteData();
        }
      } else {
        this.amisTransferData.showErrorToast();
      }
    });
  }

  /**
 * Kiểm tra dữ liệu bị xóa có phải bản ghi đang được chọn hay không
 * nmduy 11/06/2020
 */
  checkDeletedItem(deletedItem) {
    const me = this;
    if (!me.isDeletedItem) {
      if (me.inSelectedItem?.length) {
        const item = me.inSelectedItem.find(i => i[`${me.valueExpr}`] == deletedItem[`${me.valueExpr}`])
        if (item) {
          me.isDeletedItem = true;
        }
      }
    }
  }

  /**
   * Xử lý sau khi xóa dữ liệu thành công
   * nmduy 06/06/2020
   */
  afterDeleteData() {
    const me = this;
    this.isReloadData = true;
    this.selectedData = this.selectedData.filter(i => i[`${me.valueExpr}`] != me.popupDelete.ItemDelete[`${me.valueExpr}`]);
    this.checkDeletedItem(me.popupDelete.ItemDelete);
    this.requestParams.PageIndex = 1;
    this.getData();
  }

  //#endregion

  /**
    * Xử lý chức năng context menu trên từng màn hình danh sách
    * Created by: dthieu 02-06-2020
    */
  contextMenuExecuteAction(e) {
    const key = e.Key;
    this.currentItem = e.Data;
    this.selectOption(key);
  }
}
