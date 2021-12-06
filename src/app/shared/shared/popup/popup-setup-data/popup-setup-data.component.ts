import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { AmisCommonUtils } from 'src/common/fn/common-utils';
import { DxListComponent, DxScrollViewComponent } from 'devextreme-angular';
import { AmisStringUtils } from 'src/common/fn/string-utils';
import { BaseComponent } from 'src/common/components/base-component';
import { takeUntil } from 'rxjs/operators';
import { PickList } from '../../models/pick-list/pick-list';
import { ButtonType } from '../../enum/common/button-type.enum';
import { AmisTranslationService } from 'src/common/services/amis-translation.service';
import { FormMode } from 'src/common/enum/form-mode.enum';
import { PickListService } from 'src/app/services/pick-list/pick-list.service';
import { AmisTransferDataService } from 'src/common/services/amis-transfer-data.service';

declare var $: any;


@Component({
  selector: 'amis-popup-setup-data',
  templateUrl: './popup-setup-data.component.html',
  styleUrls: ['./popup-setup-data.component.scss']
})
export class PopupSetupDataComponent extends BaseComponent implements OnInit {

  @ViewChild("dxScrollView", { static: false }) dxScrollView: DxScrollViewComponent;

  @Input()
  set inputParam(value) {
    if (value) {
      this.extractInputParam(value);
    }
  }

  // label trường dữ liệu
  @Input() labelText: string = "";

  // tên trường dữ liệu
  @Input() fieldName: string = "";

  // tên trường dữ liệu
  @Input() subSystemCode: string = "";

  // tên trường dữ liệu
  @Input() tableName: string = "";

  // các trường
  @Input()
  set inSelectedRecords(value) {
    if (value) {
      this.inSelectedItem = value;
    }
  };

  @Input() visiblePopup: boolean = false;

  // Danh sách bản ghi được chọn
  @Output() outSelectedRecord: EventEmitter<any> = new EventEmitter<any>();
  // Đóng popup
  @Output() closePopup: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild(DxListComponent, { static: false })
  list: DxListComponent;

  inSelectedItem: any;

  visiblePopover: boolean = false;

  tooltipContent: string = "";

  listHeight: number = 400;

  offsetY = "0 100px";


  popupNotifyContent: string = "";

  popupNotifyTitle: string = "";

  visibleNotify: boolean = false; // hiển thị popup cảnh báo

  tooltipTarget: any; //target hiển thị tooltip

  fieldLabel: string = "";

  searchName: string = "";

  isReloadData: boolean = false;

  selectedItems = []; // danh sách thằng đagn được chọn IsUse = true;

  dataSource = [];

  dataSourceClone = [];

  listDataChange = [];  // danh sách dữ liệu thay đổi, thêm mới đẩy lên server

  isFilter: boolean = false;

  isLoading: boolean = true;

  isShowValidateError: boolean = true; // có phải đang focus vào nút xóa không

  maxID: number = 0;

  isDeletedItem: boolean = false; // bản ghi được chọn có phải bị xóa rồi không
  isUpdatedItem: boolean = false; // bản ghi được chọn có phải bị cập nhật rồi không
  updatedItem: any; // bản ghi được chọn có phải bị xóa rồi không

  /**
* Các thông tin của form popup xóa
*/
  popupDelete = {
    TitlePopupDelete: "",
    VisiblePopupDelete: false,
    ContentPopupDelete: "",
    ItemDelete: null
  }

  buttonType = ButtonType;
  // tham số lấy dữ liệu
  requestParams = {
    PageIndex: 1,
    Filterby: "",
    Orderby: "",
    Columns: "ID,PickListID,PickListValue,Description,SortOrder,PickListType,IsSystem,IsUse"
  };

  constructor(
    private transferData: AmisTransferDataService,
    private amisTranslateSV: AmisTranslationService,
    private pickListService: PickListService
  ) {
    super();
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  ngOnInit(): void {
    this.resizeGrid();
    this.getData();
  }

  onDragStart(e) {
    e.itemData = e.fromData[e.fromIndex];
  }

  onAdd(e) {
    e.toData.splice(e.toIndex, 0, e.itemData);
  }

  onRemove(e) {
    e.fromData.splice(e.fromIndex, 1);
  }

  //hàm sắp xếp lại
  onDragEnd(e, a) {
    const fromIndex = e.fromIndex;
    const toIndex = e.toIndex;
    if (fromIndex > toIndex || fromIndex < toIndex) {
      let gap = fromIndex - toIndex;
      let data = e.fromData[fromIndex];
      let i = 0;
      if (gap < 0) {
        gap = gap * -1;
        while (i !== gap) {
          e.fromData[fromIndex + i] = e.fromData[fromIndex + i + 1];
          i++;
        }
      } else if (gap > 0) {
        while (i !== gap) {
          e.fromData[fromIndex - i] = e.fromData[fromIndex - i - 1];
          i++;
        }
      }
      e.fromData[toIndex] = data;
      this.dataSourceClone = AmisCommonUtils.cloneDataArray(this.dataSource);
      const startChangeIndex = fromIndex < toIndex ? fromIndex : toIndex; //index bắt đầu bị thay đổi sort order
      this.reIndexSortOrder(startChangeIndex);
    }
  }

  /**
   * Đánh lại sort order 
   * nmduy 04/06/2020
   */
  reIndexSortOrder(startChangeIndex) {
    for (let i = startChangeIndex; i < this.dataSource.length; i++) {
      this.dataSource[i].SortOrder = i + 1; // đánh lại sort order mảng dữ liệu 
      this.dataSourceClone[i].SortOrder = i + 1; // đánh lại sort order mảng dữ liệu 
      let item = this.listDataChange.find(item => item.ID == this.dataSource[i].ID);
      if (item) {
        item.SortOrder = this.dataSource[i].SortOrder;
      } else {
        this.dataSource[i].State = this.dataSource[i].State == FormMode.Insert ? FormMode.Insert : FormMode.Update;
        this.listDataChange.push(this.dataSource[i]);
      }
    }
  }

  /**
* Gọi service lấy dữ liệu
* Created By nmduy 18/05/2020
*/
  getData() {
    const me = this;
    me.pickListService.getAllPickList(this.requestParams).pipe(takeUntil(me._onDestroySub)).subscribe(res => {
      if (res.Success && res.Data) {
        this.isLoading = false;
        if (res.Data.PageData) {
          this.dataSource = res.Data.PageData;
        } else {
          this.dataSource = res.Data;
        }
        this.handleData();
      }
    });
    setTimeout(() => {
      this.isLoading = false;
    }, 5000);
  };


  /**
   * Xử lý dữ liệu trả về
   * nmduy 03/06/2020
   */
  handleData() {
    this.dataSource.forEach(item => {
      if (item.IsUse) this.selectedItems.push(item);
      if (!item.IsSystem) {
        item.PreviousValue = item.PickListValue;
        item.OriginValue = item.PickListValue;
      }
      this.maxID = item.ID > this.maxID ? item.ID : this.maxID;
    });
    this.dataSourceClone = AmisCommonUtils.cloneDataArray(this.dataSource);
  }


  /**
   * Tích chọn sử dụng, không sử dụng bản ghi
   * nmduy 04/06/2020
   */
  selectItem(key) {
    var isUse = true;
    if (key.addedItems?.length) {
      var changeItem = key.addedItems[0];
      this.selectedItems.push(changeItem);
    } else if (key.removedItems?.length) {
      isUse = false;
      var changeItem = key.removedItems[0];
      this.selectedItems = this.selectedItems.filter(item => item.ID != changeItem.ID);
    }
    const item = this.listDataChange.find(item => item.ID == changeItem.ID);
    if (item) {
      item.IsUse = isUse;
    } else { // nếu chưa có trong danh sách dữ liệu thay đổi thì 
      changeItem.IsUse = isUse;
      changeItem.State = changeItem.State == FormMode.Insert ? FormMode.Insert : FormMode.Update;
      this.listDataChange.push(changeItem);
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
          if (element != "GroupConfigs") {
            if (element != "PageIndex" && element != "PageSize") {
              this.requestParams[`${element}`] = inputParam[`${element}`]
            }
          }
        });
      }
    }
    if (this.inputParam?.GroupFieldConfig) {
      var groupFieldConfig = this.inputParam.GroupFieldConfig
      this.fieldLabel = groupFieldConfig?.Tooltip ? groupFieldConfig?.Tooltip.toLowerCase() : groupFieldConfig?.Caption.toLowerCase();
    } else {
      this.fieldLabel = this.labelText.toLowerCase();
    }
  }


  /**
 * bắt sự kiện thay đổi giá trị ô text box
 * nmduy 15/04/2020
 */
  changeTextBoxValue(e) {
    if (e && e.event && e.event.type == "dxclick") {
      this.dataSource = AmisCommonUtils.cloneDataArray(this.dataSourceClone);
      this.isFilter = false;
      this.onSelectRow();
    }
  }


  /**
  * bắt sự kiện keyup ô tìm kiếm
  * nmduy 15/04/2020
  */
  onKeyupSearchBox(e) {
    var inputVal = $(e.element)?.find("input")?.val();
    this.searchName = inputVal;
    if (inputVal.trim()) {
      this.isFilter = true;
      inputVal = AmisStringUtils.convertVNtoENToLower(inputVal.trim());
    } else {
      this.isFilter = false;
    }
    this.dataSource = this.dataSourceClone.filter(item => AmisStringUtils.convertVNtoENToLower(item?.PickListValue).includes(inputVal))
    this.onSelectRow();
  }


  /**
   * Lựa chọn các bản ghi ở trạng thái chọn
   * nmduy 05/06/2020
   */
  onSelectRow() {
    setTimeout(() => {
      this.dataSource.forEach(element => {
        if (element.IsUse) this.list.instance.selectItem(element);
      });
    }, 100);
  }


  /**
   * Lưu thiết lập
   * nmduy 03/06/2020
   */
  saveDataSetup(e) {
    if (this.beforeSave()) {
      var params = {
        SubsystemCode: this.subSystemCode,
        TableName: this.tableName,
        PickListType: this.fieldName,
        PickLists: JSON.stringify(this.listDataChange)
      }
      this.pickListService.saveListPickList(params).pipe(takeUntil(this._onDestroySub)).subscribe(res => {
        if (res?.Success) {
          if (res.ValidateInfo?.length) {
            let message = res.ValidateInfo[0].ErrorMessage;
            this.showNotifyPopup(message, this.amisTranslateSV.getValueByKey("ERROR_HAPPENED"));
          } else {
            this.transferData.showSuccessToast(this.amisTranslateSV.getValueByKey("SAVE_SUCCESS"));
            if (res.Data?.length) {
              this.isReloadData = false;
              this.getNewestInsertData(res.Data);
            } else {
              this.isReloadData = true;
              this.checkUpdatedItem();
              this.onClosePopup();
            }
          }
        } else {
          this.transferData.showErrorToast();
        }
      });
    }
  }

  /**
   * Lấy giá trị mới nhất
   * nmduy 06/09/2020
   */
  getNewestInsertData(data) {
    let newItem = [];
    if (data?.length) {
      var maxID = -1;
      data.map(function (obj) {
        if (obj.ID > maxID && obj.IsUse) maxID = obj.ID;
      });
      const item = data.find(item => item.ID == maxID);
      if (item) {
        newItem.push(item);
      }
    }
    if (newItem?.length) {
      this.outSelectedRecord.emit(newItem);
    }
    this.onClosePopup();
  }

  /**
   * Kiểm tra dữ liệu có được cập nhật lại hay không
   * nmduy 11/06/2020 
   */
  checkUpdatedItem() {
    if (this.inSelectedItem) {
      for (let i = 0; i < this.listDataChange.length; i++) {
        const element = this.listDataChange[i];
        if (element.PickListID == this.inSelectedItem.PickListID && element.State == FormMode.Update) {
          this.isUpdatedItem = true;
          this.updatedItem = element;
        }
      }
    }
  }

  /**
   * Kiểm tra dữ liệu bị xóa có phải bản ghi đang được chọn hay không
   * nmduy 11/06/2020
   */
  checkDeletedItem(deletedItem) {
    if (!this.isDeletedItem) {
      if (this.inSelectedItem) {
        if (deletedItem.PickListID == this.inSelectedItem.PickListID) {
          this.isDeletedItem = true;
        }
      }
    }
  }


  /** 
   * validate dữ liệu trước khi lưu
   * nmduy 04/06/2020
   */
  beforeSave() {
    this.isShowValidateError = false;
    var isValid = true;
    var firstErrorIndex = -1; // tọa độ thằng lỗi đầu tiên để scroll đến
    var firstEmptyInsertState = -1; // index thằng insert đầu tiên bị trống, để đánh lại index
    if (this.dataSource.length != this.dataSourceClone.length) {
      this.dataSource = AmisCommonUtils.cloneDataArray(this.dataSourceClone);
    }
    for (let index = 0; index < this.listDataChange.length; index++) {
      const element = this.listDataChange[index];
      if (!element.PickListValue?.trim()) {
        var errorIndex = this.dataSource.findIndex(item => item.ID == element.ID); // tìm index thằng lỗi
        if (errorIndex >= 0) {
          if (element.State == FormMode.Update) {
            this.dataSource[errorIndex].IsError = true;
            if (firstErrorIndex == -1) {
              firstErrorIndex = errorIndex;
            }
            // lấy tọa độ thằng đầu tiên
          } else if (element.State == FormMode.Insert) {
            if (firstEmptyInsertState == -1) {
              firstEmptyInsertState = errorIndex; // lấy tọa độ thằng đầu tiên
            }
          }
        }
      }
    }
    if (firstErrorIndex >= 0) {
      isValid = false;
      setTimeout(() => {
        this.dxScrollView.instance.scrollTo(firstErrorIndex * 44); // 44 là chiều cao 1 dòng
        var dxTextBox = this.list['element'].nativeElement.querySelectorAll("input.dx-texteditor-input");
        if (dxTextBox?.length) {
          dxTextBox[firstErrorIndex].focus();
          this.showTooltip(dxTextBox[firstErrorIndex], this.amisTranslateSV.getValueByKey("CAN_NOT_EMPTY"));
        }
      }, 0);
    } else if (firstEmptyInsertState >= 0) {
      this.dataSource = this.dataSource.filter(item => item.PickListValue?.trim());
      this.dataSourceClone = this.dataSourceClone.filter(item => item.PickListValue?.trim());
      this.listDataChange = this.listDataChange.filter(item => item.PickListValue?.trim());
      this.reIndexSortOrder(firstEmptyInsertState);
    }
    return isValid;
  }


  /**
   * Thêm dòng
   * nmduy 03/06/2020
   */
  addRow() {
    this.isShowValidateError = false;
    let newItem = new PickList(); // thêm dòng mới vào danh sách
    this.maxID += 1;
    newItem.ID = this.maxID;
    newItem.IsUse = true;
    newItem.State = FormMode.Insert;
    newItem.PickListType = this.fieldName;
    newItem.SubsystemCode = this.subSystemCode;
    newItem.SortOrder = this.dataSourceClone.length + 1; // đánh sort order bằng độ dài mảng + 1;
    this.selectedItems.push(newItem);
    this.dataSource.push(newItem);
    this.dataSourceClone.push(newItem);
    this.onSelectRow();
    const scrollHeight = this.dxScrollView.instance.scrollHeight();
    setTimeout(() => {
      this.dxScrollView.instance.scrollTo(scrollHeight);
      var dxTextBox = this.list['element'].nativeElement.querySelectorAll("input.dx-texteditor-input");
      if (dxTextBox?.length) {
        dxTextBox[dxTextBox.length - 1].focus();
      }
    }, 0);
  }



  /**
   * Đóng popup
   * nmduy 03/06/2020
   */
  onClosePopup() {
    this.visiblePopup = false;
    this.isShowValidateError = false;
    let param = {
      IsReload: this.isReloadData,
      IsDeleted: this.isDeletedItem,
      IsUpdated: this.isUpdatedItem,
      UpdatedItem: [this.updatedItem]
    }
    this.closePopup.emit(param);
  }

  /**
   * Hàm focus out tên trường
   * nmduy 04/06/2020
   */
  onFocusOutTextbox(e, data) {
    if (data.PreviousValue?.trim() != data.PickListValue?.trim()) { //nếu thay đổi dữ liệu      
      const item = this.dataSourceClone.find(item => item.ID == data.ID);
      if (item) {
        data.PickListValue = data.PickListValue?.trim();
        item.PickListValue = data.PickListValue; // cập nhật cho thằng clone
        const itemInListChange = this.listDataChange.find(item => item.ID == data.ID);
        if (itemInListChange) {
          itemInListChange.PickListValue = data.PickListValue;
        } else {
          data.State = data.State == FormMode.Insert ? FormMode.Insert : FormMode.Update;
          this.listDataChange.push(data); // thêm vào mảng danh sách dữ liệu thay đổi
        }
      }
    }
    setTimeout(() => {
      if (this.isShowValidateError) {
        if (!data.PickListValue?.trim()) {
          if (data.State == FormMode.Update) {
            data.IsError = true;
            this.showTooltip(e.element, this.amisTranslateSV.getValueByKey("CAN_NOT_EMPTY"));
          }
        } else {
          this.checkDuplicateData(e, data);
        }
      }
      this.isShowValidateError = true;
    }, 100);
    data.PreviousValue = data.PickListValue;
  }


  /**
   * Kiểm tra trùng dữ liệu
   * nmduy 10/06/2020
   */
  checkDuplicateData(e, data) {
    for (let i = 0; i < this.dataSource.length; i++) {
      const element = this.dataSource[i];
      if (data.ID != element.ID) {
        if (data.PickListValue?.trim() == element.PickListValue?.trim()) {
          // nếu thằng focus out có giá trị bằng 1 thằng khác
          data.IsError = true;
          element.IsError = true;
          this.showTooltip(e.element, this.amisTranslateSV.getValueByKey("CAN_NOT_DUPLICATE"));
        }
      }
    }
  }

  /**
   * keyup ô text box nhập giá trị của trường dữ liệu
   * nmduy 07/06/2020
   */
  onKeyupTextbox(e, data) {
    if (data.PickListValue?.trim()) {
      const item = this.dataSource.find(function (item) {
        if (item.PickListValue?.trim() == data.PickListValue?.trim() && item.ID != data.ID) {
          return true;
        }
      });
      if (item) {
        item.IsError = false;
        data.IsError = false;
      }
    }
    this.isShowValidateError = true;
    data.IsError = false;
    this.visiblePopover = false;
  }


  /**
  * Xóa 1 bản ghi
  * nmduy 25/11/2019
  * @param item : item cần xóa
  */
  deleteItem(item) {
    this.isShowValidateError = false;
    const me = this;
    if (item.State == FormMode.Insert) { // nếu xóa bản ghi vừa thêm thì remove luôn khỏi danh sách
      this.removeItemFromDataSource(item);
    } else {
      if (item) { // hiện popup cảnh báo xóa
        item.State = FormMode.Delete;
        me.popupDelete.VisiblePopupDelete = true;
        me.popupDelete.ItemDelete = item;
        me.popupDelete.TitlePopupDelete = this.amisTranslateSV.getValueByKey("POPUP_SELECT_DATA_DELETE_DATA", { FieldName: this.fieldLabel });
        me.popupDelete.ContentPopupDelete = this.amisTranslateSV.getValueByKey("POPUP_SELECT_DATA_DELETE_DATA_CONFIRM", { FieldName: this.fieldLabel, FieldValue: item.OriginValue });;
      }
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
    me.pickListService.delete(listDeleteItem).pipe(takeUntil(me._onDestroySub)).subscribe(res => {
      if (res?.Success) {
        if (res.ValidateInfo?.length) {
          let message = this.amisTranslateSV.getValueByKey("POPUP_SETUP_DATA_VALUE_IN_USE", { Value: me.popupDelete.ItemDelete?.PickListValue ? me.popupDelete.ItemDelete?.PickListValue : "" }) + res.ValidateInfo[0].ErrorMessage;
          this.showNotifyPopup(message, (this.amisTranslateSV.getValueByKey("DATA_IN_USE")));
        } else {
          this.checkDeletedItem(me.popupDelete.ItemDelete);
          this.transferData.showSuccessToast(this.amisTranslateSV.getValueByKey("DELETE_SUCCESS"));
          this.removeItemFromDataSource(me.popupDelete.ItemDelete);
          this.isReloadData = true;
          // this.onClosePopup();
        }
      } else {
        this.transferData.showErrorToast(this.amisTranslateSV.getValueByKey("ERROR_HAPPENED"));
      }
    });
  }

  /**
   * Remove 1 phần tử khỏi mảng
   * nmduy 04/06/2020
   */
  removeItemFromDataSource(deletedItem) {
    this.dataSource = this.dataSource.filter(item => item.ID != deletedItem.ID);
    this.dataSourceClone = this.dataSourceClone.filter(item => item.ID != deletedItem.ID);
    this.listDataChange = this.listDataChange.filter(item => item.ID != deletedItem.ID);
    this.reIndexSortOrder(deletedItem.SortOrder - 1);
  }

  /**
   * Không select khi chọn ra ngoài check box
   * nmduy 09/06/2020
   */
  onListContentReady(e) {
    $(".dx-item-content").on("click", function (e) {
      e.stopPropagation();
    });
    $(".dx-list-reorder-handle-container").on("click", function (e) {
      e.stopPropagation();
    });
  }

  /**
  * Hiển thị popup cảnh báo không được thay đổi dữ liệu hệ thống
  * nmduy 29/05/2020
  */
  showNotifyPopup(message, title?) {
    this.visibleNotify = true;
    this.popupNotifyTitle = title ? title : this.amisTranslateSV.getValueByKey("ERROR_HAPPENED");
    this.popupNotifyContent = message;
  }

  /**
   * Hiển thị tooltip
   */
  showTooltip(target, message) {
    this.tooltipTarget = target;
    this.tooltipContent = message;
    this.visiblePopover = true;
  }

  /**
  * set chiều cao grid
  * Created by nmduy 19/05/2020
  */
  resizeGrid() {
    if (window.innerHeight < 768) {
      this.offsetY = "0 50px"
      this.listHeight = 250;
    }
  }
}
