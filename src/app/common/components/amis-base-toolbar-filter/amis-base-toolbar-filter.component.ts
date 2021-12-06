import {
  Component,
  OnInit,
  Output,
  ViewChild,
  EventEmitter,
  Input,
} from '@angular/core';
import { BaseComponent } from 'src/common/components/base-component';
import { FieldConfigService } from 'src/app/services/field-config/field-config.service';
import { ConfigService } from 'src/app/services/config/config.serice';
import { FilterConfigService } from 'src/app/services/filter-config/filter-config.service';
import { ButtonType } from 'src/app/shared/enum/common/button-type.enum';
import { ButtonColor } from 'src/app/shared/enum/common/button-color.enum';
import { AmisTranslationService } from 'src/common/services/amis-translation.service';
import { AmisTransferDataService } from 'src/common/services/amis-transfer-data.service';
import { TypeControl } from 'src/app/shared/enum/common/type-control.enum';
import { AmisCommonUtils } from 'src/common/fn/common-utils';
import { AmisNumberUtils } from 'src/common/fn/number-utils';
import { convertVNtoENToLower } from 'src/common/fn/convert-VNtoEn';
import { TransferDataService } from 'src/app/services/base/transfer-data.service';
import { takeUntil } from 'rxjs/operators';
import { FilterConfig } from 'src/app/shared/models/filter-config/filter-config';
import { FormMode } from 'src/common/enum/form-mode.enum';
import * as moment from 'moment';
import { DxTextBoxComponent } from 'devextreme-angular';
import { DataType } from 'src/common/models/export/data-type.enum';
import { ContextMenu } from 'src/app/shared/enum/context-menu/context-menu.enum';
import { Period } from 'src/common/enum/period.enum';
import { UserOptionService } from 'src/app/services/user-option/user-option.service';
import { TypeFilter } from 'src/common/enum/field-config.enum';
import { FieldConfigBetween, FieldConfigTime, FieldConfigEqual, FieldConfigGetDate } from 'src/app/shared/constant/field-config/field-config';
import { SubSystemCode } from 'src/app/shared/constant/sub-system-code/sub-system-code';

@Component({
  selector: 'amis-base-toolbar-filter',
  templateUrl: './amis-base-toolbar-filter.component.html',
  styleUrls: ['./amis-base-toolbar-filter.component.scss']
})
export class AmisBaseToolbarFilterComponent extends BaseComponent
  implements OnInit {
  // danh sách các trường lọc
  listFilter = [];
  listFilterDefault = [];
  buttonType = ButtonType;
  buttonColor = ButtonColor;
  // danh sách các trường lọc tìm kiếm
  listFilterSearch = [];
  listFilterConfig = [];

  //thời gian setTimeout
  timeSearch: any;
  // bộ lọc mặc định
  objFilterConfig: FilterConfig;
  objFilterAdd: FilterConfig;

  typeControl = TypeControl;
  dataType = DataType;

  isHiddenChoose = true;

  isShowCustomMore = false;
  // subsystem code đầu vào bắt buộc để thực hiện load và lưu bộ lọc
  @Input()
  subSystemCode = '';
  // subsystem code đầu vào bắt buộc để thực hiện load và lưu bộ lọc
  @Input()
  localZileFilterAll = '';

  filterData: any;
  isGetFilterSelect = false;

  // hàm trả về sụ kiện thay đổi dạng hiển thị danh sách nhân viên
  @Output()
  closeEvent: EventEmitter<any> = new EventEmitter<any>();
  // hàm trả về các tham số filter bộ lọc
  @Output()
  filterChange: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  showBoxFilter: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('txbName')
  textBoxName: DxTextBoxComponent;

  // @ViewChild('dropdown', {
  //   static: true
  // })
  // dropdowRef: ElementRef;
  searchText = '';
  listType = [];
  listTypeFilter = [];
  visiblePopupSaveFilter = false;
  // chọn bộ lọc khác với mặc định
  isSelectFilter = false;
  // đã áp dụng bộ lọc
  isApplyFilter = false;
  // là lưu mới bộ lọc
  isAdd = false;
  // mở popup xóa
  isShowPopDelete = false;
  titleDelete = '';
  contentDelete = '';
  // biến xác định có trường lọc không
  isHasFilterColumn = false;

  isNullName = false;

  // bộ lọc cất đi

  listTemplateFilter = [];

  noDataText = '';

  calendarOptions = {
    maxZoomLevel: 'decade',
    minZoomLevel: 'century'
  };

  // Danh sách chức năng viewMore menu trên toolbar cạnh thanh search
  viewMoreMenuList = [
    {
      Key: ContextMenu.SaveAndAdd,
      Text: this.translateSV.getValueByKey('FILTER_ADD_NEW'),
      Icon: 'icon-save-as-new',
      Class: ''
    }
  ];

  /**
   * message lỗi
   */
  errorMessageFrom: string = "";

  errorMessageTo: string = "";
  _isErrorFromDate = false;
  _isErrorToDate = false;
  isDisableApply = true;
  //gán trường ẩn button để k bị đè
  isDisableApplyImpotant = true;
  constructor(
    private fieldConfigSV: FieldConfigService,
    private transferData: TransferDataService,
    private translateSV: AmisTranslationService,
    private amisTransferSV: AmisTransferDataService,
    private filterConfigsv: FilterConfigService,
    private configSV: ConfigService,
    private userOptionSv: UserOptionService,
  ) {
    super();
  }
  ngOnInit(): void {
    this.listFilterConfig = [];
    const objFilter = {
      FilterTemplateID: 0,
      FilterTemplateName: this.translateSV.getValueByKey(
        this.localZileFilterAll
      )
    };
    this.noDataText = this.translateSV.getValueByKey('NO_DATA');
    const objAll = this.listFilterConfig.filter(item => {
      return item.FilterTemplateID === 0;
    });
    if (objAll.length === 0) {
      this.listFilterConfig.unshift(objFilter);
    }
    this.objFilterConfig = this.listFilterConfig[0];
    // lấy danh sách bộ lọc đã lưu
    this.getListFilterConfig();
    this.listType = this.fieldConfigSV.listTypeFilter;
    // lấy danh sách cột lọc
    this.loadListFieldFilter();
    // khai báo subcriber hàm remove
    this.transferData.removeFilter
      .pipe(takeUntil(this._onDestroySub))
      .subscribe(data => {
        setTimeout(() => {
          this.removeFilterItem(data);
        });
      });

    //Nhận filterdata từ toolbar
    const unSubrFilterToolbar = this.transferData.filterToolbar
      .pipe(takeUntil(this._onDestroySub))
      .subscribe(data => {
        this.selectFilterConfig(data);
      });
    this.unSubscribles.push(unSubrFilterToolbar);
    //Nhận filterdata từ toolbar
    const unSubrFilterGrid = this.transferData.filterGrid
      .pipe(takeUntil(this._onDestroySub))
      .subscribe(data => {
        this.bindingDataFilter(data);
      });
    this.unSubscribles.push(unSubrFilterGrid);
  }
  /**
   *hàm cấu hình popup thêm bộ lọc
   *
   * @memberof HrmProfileToolbarFilterComponent
   * vbcong 18/05/2020
   */
  readyPopsave(e) {
    e.component.registerKeyHandler('enter', item => {
      this.saveFilter();
    });
  }

  /**
   * lấy danh sách bộ lọc của người dùng
   *
   * @memberof HrmProfileToolbarFilterComponent
   * vbcong 18/05/2020
   */
  getListFilterConfig() {
    this.filterConfigsv.getListFilterConfig(this.subSystemCode).subscribe(res => {
      if (res && res.Success) {
        this.listFilterConfig = res.Data;
        const objFilter = {
          FilterTemplateID: 0,
          FilterTemplateName: this.translateSV.getValueByKey(
            this.localZileFilterAll
          )
        };
        //Bỏ những bộ lọc đã xóa
        let listfilterSubSystemCode = this.currentUserInfo.UserOptions?.Filter?.find(x => x.Type?.toUpperCase() == this.subSystemCode.toUpperCase());
        listfilterSubSystemCode?.Value?.forEach(element => {
          let temp = this.listFilterConfig.find(x => x.DictionaryKey == element.DictionaryKey && this.currentUserInfo?.UserID == element.UserID);
          if (temp) {
            AmisCommonUtils.RemoveItem(
              this.listFilterConfig,
              temp
            );
          }
        });

        const objAll = this.listFilterConfig.filter(item => {
          return item.FilterTemplateID === 0;
        });
        if (objAll.length === 0) {
          this.listFilterConfig.unshift(objFilter);
        }
        this.objFilterConfig = this.listFilterConfig[0];
      }
    });
  }
  /**
   * lấy danh sách các tiêu chí lọc
   *
   * @memberof HrmProfileToolbarFilterComponent
   * vbcong 14/05/2020
   */
  loadListFieldFilter() {
    const typeConfig = 3;
    this.configSV
      .getFieldConfigDefault(this.subSystemCode, typeConfig)
      .subscribe(res => {
        if (res && res.Success) {
          this.listFilter = res.Data;
          this.listFilterDefault = AmisCommonUtils.cloneDataArray(
            this.listFilter
          );

          if (this.currentUserInfo.UserOptions?.FilterSelected?.length) {
            let filterEmployee = this.currentUserInfo.UserOptions.FilterSelected?.find(x => x.Type?.toUpperCase() == this.subSystemCode.toUpperCase());
            let filterSelected = filterEmployee?.Value.find(x => x.UserID == this.currentUserInfo.UserID);
            if (filterSelected) {
              this.objFilterConfig = this.listFilterConfig.find(x => x.FilterTemplateID == filterSelected.FilterTemplateID);
              if (this.objFilterConfig) {
                this.bindingDataFilter(this.objFilterConfig);
                setTimeout(() => {
                  this.isDisableApplyImpotant = false;
                }, 500)
                if (this.listFilterSearch && this.listFilterSearch.length > 0) {
                  this.isHasFilterColumn = true;
                } else {
                  this.isHasFilterColumn = false;
                }
                return;
              } else {
                this.objFilterConfig = this.listFilterConfig[0];
              }
            }
          }
          else {
            this.objFilterConfig = this.listFilterConfig[0];
          }
          this.onSearchControl(null);
          setTimeout(() => {
            this.isDisableApplyImpotant = false;
          }, 500)
        }
      });
  }
  /**
   * hàm đóng box
   *
   * @memberof HrmProfileToolbarFilterComponent
   */
  closeBox() {
    this.closeEvent.emit(true);
    this.showBoxFilter.emit(false);
  }
  /**
   * hàm chọn bộ lọc của
   *
   * @param {any} item
   * @memberof HrmProfileToolbarComponent
   * vbcong 05/04/2020
   */
  selectFilterConfig(item) {
    this.isDisableApplyImpotant = true;
    this.bindingDataFilter(item);
    this.applyFilter();

    //lưu useroption
    this.saveUserOptionFilter();
    this.isDisableApply = true;
    setTimeout(() => {
      this.isDisableApplyImpotant = false;
    }, 200)
  }
  /**
   * biding dữ liệu bộ lọc
   * pvthong 21/09/2020
   */
  bindingDataFilter(item) {
    this.isDisableApply = true;
    this.isHiddenChoose = true;
    this.objFilterConfig = item;
    let param = {
      ListFilterConfig: this.listFilterConfig,
      ObjFilterConfig: item
    }
    this.transferData.ChangeListToolbarFilter(param);
    this.isApplyFilter = false;
    this.listFilter = AmisCommonUtils.cloneDataArray(this.listFilterDefault);
    this.listFilterSearch = AmisCommonUtils.cloneDataArray(
      this.listFilterDefault
    );
    if (this.objFilterConfig.FilterTemplateID !== 0) {
      this.isSelectFilter = true;
    } else {
      this.isSelectFilter = false;
    }
    if (item.FilterTemplateData) {
      const dataFilter = AmisCommonUtils.Decode(item.FilterTemplateData);
      this.bindingDataFilterValue(dataFilter);
    }
  }

  /**
   * Lưu useroption filter
   * pvthong 21/09/2020
   */
  saveUserOptionFilter(objAdd?) {
    let paramFilter = {
      FilterSelected: this.currentUserInfo.UserOptions?.FilterSelected ? this.currentUserInfo.UserOptions?.FilterSelected : []
    }
    let indexFilterEmployee = paramFilter.FilterSelected.findIndex(x => x.Type?.toUpperCase() == this.subSystemCode.toUpperCase());
    let index = paramFilter.FilterSelected[indexFilterEmployee]?.Value.findIndex(x => x.UserID == this.currentUserInfo.UserID);

    let itemSelected = {
      FilterTemplateID: objAdd ? objAdd.FilterTemplateID : this.objFilterConfig?.FilterTemplateID,
      FilterTemplateData: objAdd ? objAdd.FilterTemplateData : this.objFilterConfig?.FilterTemplateData,
      UserID: this.currentUserInfo?.UserID
    }
    if (indexFilterEmployee >= 0) {
      if (index >= 0) {
        paramFilter.FilterSelected[indexFilterEmployee].Value[index] = itemSelected;
      }
      else {
        paramFilter.FilterSelected[indexFilterEmployee].Value.push(itemSelected);
      }
    }
    else {
      let itemInfo = {
        Type: this.subSystemCode,
        Value: [itemSelected]
      }
      paramFilter.FilterSelected.push(itemInfo);
    }
    this.currentUserInfo.UserOptions.FilterSelected = paramFilter.FilterSelected;
    this.userOptionSv.saveUserOption(paramFilter).subscribe(res => {
      if (res?.Success) {
        // 
      }
    });
  }

  /**
   * map dữ liệu hiển thị value bộ lọc
   *
   * @param {any} listData
   * @memberof HrmProfileToolbarFilterComponent
   */
  bindingDataFilterValue(listData) {
    if (listData && listData.length > 0) {
      listData.forEach(item => {
        this.listFilterSearch.forEach(ite => {
          if (ite.FieldName === item.FieldName) {
            ite.Value = item.FilterValue;
            ite.ValueText = item.FilterValueShow;
            ite.TypeID = item.TypeFilter;
            ite.IsActiveFilter = true;
            if (ite.TypeID === 'isnullorempty' || ite.TypeID === 'hasvalue' || FieldConfigGetDate?.includes(ite.TypeID)) {
              ite.IsHiddenFieldValue = true;
            }
            else {
              ite.IsHiddenFieldValue = false;
            }
            this.enabelFilterItem(ite, true);
            // const dataSource = {};
            // dataSource[ite.FieldNameSource]
          }
        });
      });
    }
  }
  /**
   * hàm search tiêu chí bộ lọc
   *
   * @memberof HrmProfileToolbarFilterComponent
   */
  onSearchControl(e) {
    clearTimeout(this.timeSearch);
    this.timeSearch = setTimeout(() => {
      if (e) {
        let textValue = e.value;
        this.searchText = textValue;

      } else {
        this.listFilterSearch = AmisCommonUtils.cloneDataArray(this.listFilter);
      }
      if (this.listFilterSearch && this.listFilterSearch.length > 0) {
        this.isHasFilterColumn = true;
      } else {
        this.isHasFilterColumn = false;
      }
    }, 200)

  }

  /**
   * hàm search tiêu chí bộ lọc
   * Created by: pvthong 23-09-2020
   */
  onSearchValueChanged(e) {
    if (this.searchText) {
      let textValue = this.searchText.trim();
      textValue = convertVNtoENToLower(textValue);
      const listFilterClone = AmisCommonUtils.cloneDataArray(this.listFilter);
      this.listFilterSearch = listFilterClone.filter(item =>
        convertVNtoENToLower(item.Caption).includes(textValue)
      );
    }
    else {
      this.listFilterSearch = AmisCommonUtils.cloneDataArray(this.listFilter);
    }
    if (this.listFilterSearch && this.listFilterSearch.length > 0) {
      this.isHasFilterColumn = true;
    } else {
      this.isHasFilterColumn = false;
    }
  }
  /**
   * xử lý focus vào nhập giá trị tiêu chí lọc
   *
   * @param {any} item
   * @memberof HrmProfileToolbarFilterComponent
   * vbcong 26/05/2020
   */
  readyItemFilter(e) {
    if (e && e.component && !this.isDisableApplyImpotant) {
      e.component.focus();
      e.element.classList.add('dx-state-focused');
    }
  }
  /**
   * mở lọc thêm tiêu chí
   *
   * @param {any} item
   * @memberof HrmProfileToolbarFilterComponent
   * vbcong 08/05/2020
   */
  enabelFilterItem(item, isBinding = false) {
    if (!this.isDisableApplyImpotant) {
      this.isDisableApply = false;
    }
    this.isApplyFilter = false;
    item.ListTypeFilter = this.listType.filter(ite => {
      return ite.TypeControl.includes(item.TypeControl) === true;
    });
    if (!isBinding) {
      if (item.ListTypeFilter && item.ListTypeFilter.length > 0 && !isBinding) {
        item.TypeID = item.ListTypeFilter[0].Type;
      }
      item.IsActiveFilter = !item.IsActiveFilter;
      item.Value = null;
      item.ValueText = null;
    }
    this.listFilter.forEach(ite => {
      if (ite.GroupFieldConfigID === item.GroupFieldConfigID) {
        ite.Value = item.Value;
        ite.ValueText = item.ValueText;
        ite.ListTypeFilter = item.ListTypeFilter;
        ite.TypeID = item.TypeID;
        ite.IsActiveFilter = item.IsActiveFilter;
      }
    });
    const indexItem = this.listFilter.findIndex(
      p => p.GroupFieldConfigID === item.GroupFieldConfigID
    );
    if (indexItem >= this.listFilter.length - 3) {
      const divList = document.querySelector('.list-item-filter');
      const indexScroll = divList.scrollTop + 100;
      setTimeout(() => {
        divList.scrollTo(0, indexScroll);
      }, 100);
    }
    if (item.TypeID === 'isnullorempty' || item.TypeID === 'hasvalue' || FieldConfigGetDate?.includes(item.TypeID)) {
      item.IsHiddenFieldValue = true;
    } else {
      item.IsHiddenFieldValue = false;
    }
  }
  /**
   * bỏ lọc
   *
   * @memberof HrmProfileToolbarFilterComponent
   * vbcong 14/05/2020
   */
  removeFilter() {
    this.isApplyFilter = false;
    this.listFilter.forEach(item => {
      item.IsActiveFilter = false;
      item.Value = null;
      item.ValueText = null;
    });
    this.listFilterSearch = AmisCommonUtils.cloneDataArray(this.listFilter);
    this.objFilterConfig =
      this.listFilterConfig && this.listFilterConfig.length > 0
        ? this.listFilterConfig[0]
        : new FilterConfig();
    const paramFilter = this.buildValueFilter();
    this.filterChange.emit(paramFilter);
    let param = {
      ListFilterConfig: this.listFilterConfig,
      ObjFilterConfig: null
    }
    this.transferData.ChangeListToolbarFilter(param);
    this.saveUserOptionFilter();
  }

  /**
   * bỏ lọc
   *
   * @memberof HrmProfileToolbarFilterComponent
   * vbcong 14/05/2020
   */
  removeFilterItem(data) {
    this.isApplyFilter = false;
    const itemData = data.Data;
    const isRemoveAll = data.IsAll;
    this.objFilterConfig = this.listFilterConfig[0];
    this.listFilterSearch.forEach(item => {
      if (isRemoveAll) {
        item.IsActiveFilter = false;
        item.Value = null;
        item.ValueText = null;
      } else {
        if (itemData[3] === item.GroupFieldConfigID) {
          item.IsActiveFilter = false;
          item.Value = null;
          item.ValueText = null;
        }
      }
    });
    this.listFilter.forEach(item => {
      if (isRemoveAll) {
        item.IsActiveFilter = false;
        item.Value = null;
        item.ValueText = null;
      } else {
        if (itemData[3] === item.GroupFieldConfigID) {
          item.IsActiveFilter = false;
          item.Value = null;
          item.ValueText = null;
        }
      }
    });
    this.applyFilter();
  }
  /**
   * áp dụng bộ lọc
   *
   * @memberof HrmProfileToolbarFilterComponent
   * vbcong 14/05/2020
   */
  applyFilter(isLoad = true) {
    this.isDisableApply = true;
    const paramFilter = this.buildValueFilter();
    paramFilter.IsLoad = isLoad;
    this.filterChange.emit(paramFilter);
    if (paramFilter.paramShow && paramFilter.paramShow.length > 0) {
      this.isApplyFilter = true;
    }
  }

  /**
   * chonj filter
   *
   * @param {any} item
   * @param {any} e
   * @memberof HrmProfileToolbarFilterComponent
   */
  /**
   * chonj filter
   *
   * @param {any} item
   * @param {any} e
   * @memberof HrmProfileToolbarFilterComponent
   */
  slelectType(item, e) {
    if (e && e.itemData) {
      if (!this.isDisableApplyImpotant) {
        this.isDisableApply = false;
      }
      let isApply = false;
      if (item.TypeID === 'isnullorempty' || item.TypeID === 'hasvalue' || FieldConfigGetDate?.includes(item.TypeID)) {
        item.Value = null;
        item.ValueText = null;
        isApply = true;
        item.IsHiddenFieldValue = true;
      } else {

        if (item.Value) {
          if (!item.Value?.FromDate && !item.Value?.ToDate && FieldConfigBetween?.includes(item.TypeID)) {
            item.Value = {
              FromDate: null,
              ToDate: null
            }
          }
          else if ((item.Value?.FromDate || item.Value?.ToDate || item.Value?.IsGetDate) && !FieldConfigBetween?.includes(item.TypeID)) {
            item.Value = null;
          }
          else {
            isApply = true;
          }
        }
        if (item.TypeID == "between" && !item.Value) {
          item.Value = {
            FromDate: null,
            ToDate: null
          }
        }
        item.IsHiddenFieldValue = false;
      }
      item.TypeName = e.itemData.TypeName;
      this.listFilter.forEach(ite => {
        if (ite.GroupFieldConfigID === item.GroupFieldConfigID) {
          ite.TypeName = item.TypeName;
          ite.TypeID = item.TypeID;
          ite.Value = item.Value;
          ite.ValueText = item.ValueText;
        }
      });
      this.isApplyFilter = false;
      if (isApply) {
        this.applyFilter(true);
      }
    }
  }
  /**
   * thay đổi giá trị lọc theo control
   *
   * @memberof HrmProfileToolbarFilterComponent
   * vbcong 19/05/2020
   */
  changeValueFilter(item) {
    if (isNaN(item.Value) && item.TypeControl != TypeControl.Date && item.TypeControl != TypeControl.DateTime && item.TypeControl != TypeControl.MonthYear) {
      item.Value = item.Value.trim();
    }
    this.listFilter.forEach(ite => {
      if (ite.GroupFieldConfigID === item.GroupFieldConfigID) {
        ite.Value = item.Value;
      }
    });
    this.valueTextChanger();
  }
  valueTextChanger() {
    if (!this.isDisableApplyImpotant) {
      this.isDisableApply = false;
    }
    this.isApplyFilter = false;
  }
  /**
   * hàm xử lý chọn value trả lại
   *
   * @param {any} item
   * @memberof HrmProfileToolbarFilterComponent
   */
  changerValueSelect(item) {
    this.listFilter.forEach(ite => {
      if (ite.GroupFieldConfigID === item.GroupFieldConfigID) {
        ite.Value = item.Value;
        ite.ValueText = item.ValueText;
      }
    });
    this.valueTextChanger();
    // this.isApplyFilter = false;
  }

  /**
   * build lọc giá trị truyền lên tìm kiếm
   *
   * @memberof HrmProfileToolbarFilterComponent
   */
  buildValueFilter() {
    const listParam = [];
    const listParamShow = [];
    this.listTemplateFilter = [];
    const start = [1, '=', 1];
    listParam.push(start);
    //biến check có phải trong khoảng thời gian hay k
    let isBetweenTime = false;
    //biến check có phải case lấy time k
    let isGetDate = false;
    this.listFilter.forEach(item => {
      if (item.IsActiveFilter) {
        let valueFil = '';
        let valueShow = '';
        let valueShowEnd = '';
        if (FieldConfigBetween?.includes(item.TypeID)) {
          isBetweenTime = true;
        }
        else {
          isBetweenTime = false;
        }
        if (FieldConfigTime?.includes(item.TypeID)) {
          isGetDate = true;
        }
        else {
          isGetDate = false;
        }
        if (
          item.Value ||
          item.TypeID === 'isnullorempty' ||
          item.TypeID === 'hasvalue' || isGetDate
        ) {
          const operater = 'AND';
          listParam.push(operater);
          switch (item.TypeControl) {
            case this.typeControl.Date:
              if (item.Value?.IsGetDate) {
                let valueTime = this.caseDate(item.TypeID);
                valueShow = valueTime?.valueShow;
                valueShowEnd = valueTime?.valueShowEnd;
              }
              else {
                if (item.TypeID == "between") {
                  valueShow = item.Value.FromDate ? moment(new Date(item.Value.FromDate), 'YYYY/MM/DD').format('DD/MM/YYYY') : "";
                  valueShowEnd = item.Value.ToDate ? moment(new Date(item.Value.ToDate), 'YYYY/MM/DD').format('DD/MM/YYYY') : "";
                }
                else if (isGetDate) {
                  let valueTime = this.caseDate(item.TypeID);
                  valueShow = valueTime?.valueShow;
                  valueShowEnd = valueTime?.valueShowEnd;
                  valueFil = valueTime?.valueShow ? moment(new Date(valueTime?.valueShow), 'DD/MM/YYYY').format('YYYY/MM/DD') : null;
                }
                else {
                  valueShow = item.Value
                    ? moment(item.Value, 'YYYY/MM/DD').format('DD/MM/YYYY')
                    : null;
                  valueFil = item.Value;
                }

              }

              break;
            case this.typeControl.Combobox:
            case this.typeControl.SelectHuman:
            case this.typeControl.TreeBox:
            case this.typeControl.MultiCombobox:
            case this.typeControl.TreeBoxMulti:
            case this.typeControl.ComboTree:
              valueShow = item.ValueText;
              valueFil = item.Value;
              break;
            case this.typeControl.Number:
            case this.typeControl.AutoNumber:
            case this.typeControl.Year:
              valueShow = item.Value;
              valueFil = item.Value;
              break;
            // case this.typeControl.Year:
            //   const dateValue = new Date(item.Value);
            //   if (dateValue instanceof Date && !isNaN(dateValue.valueOf())) {
            //     item.Value = dateValue;
            //     valueShow = dateValue.getFullYear().toString();
            //     valueFil = item.Value;
            //   }
            //   break;
            case this.typeControl.Currency:
              valueShow = AmisNumberUtils.currenctFormatVN(item.Value);
              valueFil = item.Value;
              break;
            case this.typeControl.Decimal:
            case this.typeControl.Percent:
              valueShow = AmisNumberUtils.formatDecimalNumber(item.Value);
              valueFil = item.Value;
              break;
            default:
              if (!!item.Value && !!item.Value.trim()) {
                valueShow = item.Value.trim();
                valueFil = convertVNtoENToLower(item.Value.trim());
              }
              break;
          }
          const operateDate = ['=', '<', '>', '<>', '>=', '<='];
          if (
            item.TypeControl === this.typeControl.Date &&
            operateDate.includes(item.TypeID)
          ) {
            const dateFir = new Date(valueFil);
            const dateBef = new Date(valueFil);
            dateFir.setHours(0, 0, 0, 0);
            dateBef.setHours(24, 0, 0, 0);
            let paramFir = [item.FieldName, '>=', dateFir];
            let paramBef = [item.FieldName, '<', dateBef];
            const operaterbet = 'AND';
            const operaterOr = 'OR';
            switch (item.TypeID) {
              case '>':
                paramBef = [item.FieldName, '>=', dateBef];
                listParam.push(paramBef);
                break;
              case '<':
                paramFir = [item.FieldName, '<', dateFir];
                listParam.push(paramFir);
                break;
              case '=':
                paramFir = [item.FieldName, '>=', dateFir];
                listParam.push(paramFir);
                listParam.push(operaterbet);
                listParam.push(paramBef);
                break;
              case '<>':
                paramFir = [item.FieldName, '<', dateFir];
                paramBef = [item.FieldName, '>=', dateBef];
                listParam.push(paramFir);
                listParam.push(operaterOr);
                listParam.push(paramBef);
                listParam.push(operaterOr);
                listParam.push([item.FieldName, 'isnull']);
                break;
              case '<=':
                const paramFam = [item.FieldName, '<', dateFir];
                listParam.push(paramFam);
                listParam.push(operaterOr);
                listParam.push('(');
                listParam.push(paramFir);
                listParam.push(operaterbet);
                listParam.push(paramBef);
                listParam.push(')');
                break;
              case '>=':
                const paramFin = [item.FieldName, '>=', dateBef];
                listParam.push(paramFin);
                listParam.push(operaterOr);
                listParam.push('(');
                listParam.push(paramFir);
                listParam.push(operaterbet);
                listParam.push(paramBef);
                listParam.push(')');
                break;
              default:
                break;
            }
          } else {
            let param = [];
            if (
              item.TypeControl == TypeControl.Date ||
              item.TypeControl == TypeControl.DateTime
            ) {
              if (item.TypeID === 'isnullorempty') {
                item.TypeID = 'isnull';
                param = [item.FieldName, item.TypeID];
              } else if (item.TypeID === 'hasvalue') {
                item.TypeID = 'notnull';
                param = [item.FieldName, item.TypeID];
              } else {
                param = [item.FieldName, item.TypeID, valueFil];
              }
            } else {
              param = [item.FieldName, item.TypeID, valueFil];
            }
            if (FieldConfigTime?.includes(item.TypeID)) {
              let paramStart = AmisCommonUtils.cloneData(param);
              let paramEnd = AmisCommonUtils.cloneData(param);
              paramStart[1] = ">=";
              paramStart[2] = new Date(new Date(moment(valueShow, 'DD/MM/YYYY').format('YYYY/MM/DD')).setHours(0, 0, 0, 0));
              paramEnd[1] = "<=";
              paramEnd[2] = new Date(new Date(moment(valueShowEnd, 'DD/MM/YYYY').format('YYYY/MM/DD')).setHours(23, 59, 59, 59));
              listParam.push(paramStart);
              listParam.push("AND");
              listParam.push(paramEnd);
            }
            else {
              if (item.TypeControl == TypeControl.Combobox || item.TypeControl == TypeControl.MultiCombobox) {
                if (param[1] == "<>") {
                  param[1] = "NOTIN";
                }
                else if (param[1] == "=") {
                  param[1] = "IN";
                }
              }
              else if (FieldConfigEqual.includes(item.TypeID)) {
                param[1] = "="
              }
              listParam.push(param);
            }
          }
          const objFilter = {
            Caption: item.Caption,
            FieldName: item.FieldName,
            TypeControl: item.TypeControl,
            TypeFilter: item.TypeID,
            FilterValue: item.Value,
            FilterValueShow: valueShow
          };
          this.listTemplateFilter.push(objFilter);
        }
        let typeName = item.TypeName;
        let typeSelect;
        if (!typeName) {
          typeSelect = item.ListTypeFilter.filter(it => {
            return item.TypeID === it.Type;
          });
          if (typeSelect && typeSelect.length > 0) {
            typeName = typeSelect[0].TypeName;
          }
        }
        const ParamShow = [
          item.Caption,
          typeName,
          valueShow,
          item.GroupFieldConfigID,
          item.TypeID,
          valueShowEnd,
          isBetweenTime
        ];
        listParamShow.push(ParamShow);
      }
    });
    const paramReturn = {
      paramFilter: AmisCommonUtils.Base64Encode(
        AmisCommonUtils.Encode(listParam)
      ),
      paramShow: listParamShow,
      IsLoad: true
    };
    return paramReturn;
  }

  /**
   * switch case lấy khoảng thời gian
   * Create by: pvthong:16.09.2020
   */
  caseDate(key) {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    let data = {
      valueShow: null,
      valueShowEnd: null
    }
    switch (key) {
      case Period.ToDay:
      case TypeFilter.ToDay:
        data.valueShow = moment(moment().startOf('day').toDate(), 'YYYY/MM/DD').format('DD/MM/YYYY');
        data.valueShowEnd = moment(moment().startOf('day').toDate(), 'YYYY/MM/DD').format('DD/MM/YYYY');
        break;
      case Period.ThisWeek:
      case TypeFilter.ThisWeek:
        data.valueShow = moment(moment().startOf('isoWeek').startOf('day').toDate(), 'YYYY/MM/DD').format('DD/MM/YYYY');
        data.valueShowEnd = moment(moment().endOf('isoWeek').startOf('day').toDate(), 'YYYY/MM/DD').format('DD/MM/YYYY');
        break;
      case Period.ThisMonth:
      case TypeFilter.ThisMonth:
        data.valueShow = moment(new Date(currentYear, currentMonth, 1), 'YYYY/MM/DD').format('DD/MM/YYYY');
        data.valueShowEnd = moment(new Date(currentYear, currentMonth, this.getTotalDays(currentYear, currentMonth)), 'YYYY/MM/DD').format('DD/MM/YYYY');
        break;
      case Period.FullYear:
      case TypeFilter.ThisYear:
        data.valueShow = moment(new Date(currentYear, 0, 1), 'YYYY/MM/DD').format('DD/MM/YYYY');
        data.valueShowEnd = moment(new Date(currentYear, 11, 31), 'YYYY/MM/DD').format('DD/MM/YYYY');
        break;
      case Period.Yesterday:
      case TypeFilter.Yesterday:
        data.valueShow = moment(moment().add(-1, "day").toDate(), 'YYYY/MM/DD').format('DD/MM/YYYY');
        data.valueShowEnd = moment(moment().add(-1, "day").toDate(), 'YYYY/MM/DD').format('DD/MM/YYYY');
        break;
      case Period.PrevWeek:
      case TypeFilter.PrevWeek:
        data.valueShow = moment(moment().startOf('week').startOf('day').subtract(1, 'week').toDate(), 'YYYY/MM/DD').format('DD/MM/YYYY');
        data.valueShowEnd = moment(moment().endOf('week').startOf('day').subtract(1, 'week').toDate(), 'YYYY/MM/DD').format('DD/MM/YYYY');
        break;
        break;
      case Period.PrevMonth:
      case TypeFilter.PrevMonth:
        data.valueShow = moment(moment().startOf('month').startOf('day').subtract(1, 'month').toDate(), 'YYYY/MM/DD').format('DD/MM/YYYY');
        data.valueShowEnd = moment(moment().endOf('month').startOf('day').subtract(1, 'month').toDate(), 'YYYY/MM/DD').format('DD/MM/YYYY');
        break;
      case Period.PrevYear:
      case TypeFilter.PrevYear:
        data.valueShow = moment(new Date(currentYear - 1, 0, 1), 'YYYY/MM/DD').format('DD/MM/YYYY');
        data.valueShowEnd = moment(new Date(currentYear - 1, 11, 31), 'YYYY/MM/DD').format('DD/MM/YYYY');
        break;
      case Period.Tomorrow:
      case TypeFilter.Tomorrow:
        data.valueShow = moment(moment().add(1, "day").toDate(), 'YYYY/MM/DD').format('DD/MM/YYYY');
        data.valueShowEnd = moment(moment().add(1, "day").toDate(), 'YYYY/MM/DD').format('DD/MM/YYYY');
        break;
      case Period.NextWeek:
      case TypeFilter.NextWeek:
        data.valueShow = moment(moment().add(1, 'weeks').startOf('isoWeek').startOf('day').toDate(), 'YYYY/MM/DD').format('DD/MM/YYYY');
        data.valueShowEnd = moment(moment().add(1, 'weeks').endOf('isoWeek').startOf('day').toDate(), 'YYYY/MM/DD').format('DD/MM/YYYY');
        break;
      case Period.NextMonth:
      case TypeFilter.NextMonth:
        if (currentMonth == 11) {
          data.valueShow = moment(new Date(currentYear + 1, 0, 1), 'YYYY/MM/DD').format('DD/MM/YYYY');
          data.valueShowEnd = moment(new Date(currentYear + 1, 0, 31), 'YYYY/MM/DD').format('DD/MM/YYYY');
        }
        else {
          data.valueShow = moment(new Date(currentYear, currentMonth + 1, 1), 'YYYY/MM/DD').format('DD/MM/YYYY');
          data.valueShowEnd = moment(new Date(currentYear, currentMonth + 1, this.getTotalDays(currentYear, currentMonth + 1)), 'YYYY/MM/DD').format('DD/MM/YYYY');
        }
        break;
      case Period.NextYear:
      case TypeFilter.NextYear:
        data.valueShow = moment(new Date(currentYear + 1, 0, 1), 'YYYY/MM/DD').format('DD/MM/YYYY');
        data.valueShowEnd = moment(new Date(currentYear + 1, 11, 31), 'YYYY/MM/DD').format('DD/MM/YYYY');
        break;
      default:
        data = null;
        break;
    }

    return data;
  }

  /**
   * Hàm lấy về tổng số ngày của tháng
   * @param year : Năm
   * @param month : tháng (Bắt đầu từ 0)
   * Create by: dthieu:02.05.2020
   */
  getTotalDays(year: number, month: number) {
    switch (month) {
      case 1:
        if (year % 400 === 0 || (year % 4 == 0 && year % 100 !== 0)) {
          return 29;
        } else {
          return 28;
        }
      case 0:
      case 2:
      case 4:
      case 6:
      case 7:
      case 9:
      case 11:
        return 31;
      default:
        return 30;
    }
  }

  /**
   * áp dụng bộ lọc
   *
   * @memberof HrmProfileToolbarFilterComponent
   * vbcong 14/05/2020
   */
  saveFilterBox(isAdd) {
    this.isDisableApply = true;
    this.isAdd = isAdd;
    if (isAdd) {
      this.objFilterAdd = new FilterConfig();
      this.visiblePopupSaveFilter = true;
    } else {
      this.objFilterAdd = AmisCommonUtils.cloneData(this.objFilterConfig);
      this.saveFilter();
    }
  }

  /**
   * Hàm xử lí khi ấn vào menu dropdowm viewmore ở toolbar
   * created by: hgvinh 13/07/2020
   */
  onItemViewMoreClick(item, boolean) {
    this.saveFilterBox(boolean);
  }
  /**
   * sửa tên bộ lọc
   *
   * @memberof HrmProfileToolbarFilterComponent
   */
  editNameFilterConfig() {
    this.visiblePopupSaveFilter = true;
    this.isAdd = false;
    this.objFilterAdd = AmisCommonUtils.cloneData(this.objFilterConfig);
  }

  /**
   * hủy bọ lưu bộ lọc
   *
   * @param {any} e
   * @memberof HrmProfileToolbarFilterComponent
   */
  cancelSaveFilter(e) {
    this.visiblePopupSaveFilter = false;
    this.objFilterAdd = new FilterConfig();
  }
  /**
   * lưu bộ lọc
   * nvcuong1
   * @memberof PopoverQuickSearchComponent
   */
  saveFilter() {
    if (!!this.objFilterAdd.FilterTemplateName) {
      this.objFilterAdd.FilterTemplateData = JSON.stringify(
        this.listTemplateFilter
      );
      if (!this.objFilterAdd.UserID) {
        this.objFilterAdd.State = FormMode.Insert;
      } else {
        this.objFilterAdd.State = FormMode.Update;
      }
      this.objFilterAdd.SubsystemCode = this.subSystemCode;
      this.saveFilterConfig(this.objFilterAdd);
    } else {
      this.isNullName = true;
      this.textBoxName.instance.focus();
    }
  }
  /**
   * thay đổi tên bộ lọc
   *
   * @memberof HrmProfileToolbarFilterComponent
   */
  changerNameFilter() {
    this.isNullName = false;
  }
  /**
   * mở popup thêm bộ lọc
   *
   * @param {any} e
   * @memberof HrmProfileToolbarFilterComponent
   */
  showPopupAdd(e) {
    this.textBoxName.instance.focus();
  }
  /**
   * lưu dữ liệu
   *
   * @param {any} useroption
   * @memberof HrmProfileToolbarFilterComponent
   */
  saveFilterConfig(filterConfig) {
    const me = this;
    me.filterConfigsv.save(filterConfig).subscribe(res => {
      if (res && res.Success) {
        if (res.Data?.FilterTemplateID) {
          this.objFilterAdd = res.Data;
        }
        this.saveUserOptionFilter(this.objFilterAdd);
        this.isApplyFilter = false;
        this.visiblePopupSaveFilter = false;
        if (res.Data) {
          if (!this.isAdd) {
            this.amisTransferSV.showSuccessToast(this.translateSV.getValueByKey('TOOLBAR_FITER_SAVE_SUCCESS'));
            const index = this.listFilterConfig.findIndex(p => {
              return p.FilterTemplateID === this.objFilterAdd.FilterTemplateID;
            });
            this.listFilterConfig.splice(index, 1);
          } else {
            this.amisTransferSV.showSuccessToast(this.translateSV.getValueByKey('TOOLBAR_FITER_ADD_SUCCESS'));
          }
          this.listFilterConfig.push(res.Data);
          this.objFilterConfig = res.Data;
          this.isSelectFilter = true;
          let param = {
            ListFilterConfig: this.listFilterConfig,
            ObjFilterConfig: this.objFilterConfig,
            SubSystemCode: this.subSystemCode
          }
          this.transferData.ChangeListToolbarFilter(param);
        }
      } else {
        this.amisTransferSV.showErrorToast(this.translateSV.getValueByKey('ERROR_HAPPENED'));
      }
    });
  }
  /**
   * xóa bộ lọc của người dùng
   *
   * @memberof HrmProfileToolbarFilterComponent
   * vbcong 18/05/2020
   */
  removeFilterConfig() {
    this.isShowPopDelete = true;
    this.titleDelete = this.translateSV.getValueByKey(
      'FILTER_EMPLOYEE_DELETE_TITLE'
    );
    // tslint:disable-next-line:max-line-length
    this.contentDelete = this.translateSV.getValueByKey(
      'FILTER_EMPLOYEE_DELETE_CONFIRM',
      { FieldName: this.objFilterConfig.FilterTemplateName }
    );
  }
  /**
   * đóng popup xóa cơ cấu tổ chức
   *
   * @param {any} e
   * @memberof ListOrganizationUnitComponent
   */
  closePopupDelete(e) {
    this.isShowPopDelete = false;
  }
  /**
   * xác nhận xóa cơ cấu tổ chức
   *
   * @param {any} e
   * @memberof ListOrganizationUnitComponent
   */
  deleteFilterTem() {
    //lưu useroption
    if (this.objFilterConfig?.DictionaryKey) {
      let param = {
        Filter: this.currentUserInfo.UserOptions?.Filter ? this.currentUserInfo.UserOptions?.Filter : []
      }
      let index = param.Filter.findIndex(x => x.Type?.toUpperCase() == this.subSystemCode.toUpperCase());

      let itemDelete = {
        FilterTemplateID: this.objFilterConfig?.FilterTemplateID,
        UserID: this.currentUserInfo?.UserID,
        DictionaryKey: this.objFilterConfig?.DictionaryKey
      }
      if (index != -1) {
        param[index]?.Value.push(itemDelete);
      }
      else {
        let itemInfo = {
          Type: this.subSystemCode,
          Value: [itemDelete]
        }
        param.Filter.push(itemInfo);
      }
      this.userOptionSv.saveUserOption(param).subscribe(res => {
        if (res?.Success) {
          // 
        }
      });
    }

    const listDataDe = [];
    listDataDe.push(this.objFilterConfig);
    if (this.objFilterConfig?.UserID) {
      this.filterConfigsv.delete(listDataDe).subscribe(res => {
        if (res && res.Success) {
          AmisCommonUtils.RemoveItem(
            this.listFilterConfig,
            this.objFilterConfig
          );
        }
        this.isShowPopDelete = false;
        this.isSelectFilter = false;
        this.isApplyFilter = false;
        this.removeFilter();
      });
    }
    else {
      AmisCommonUtils.RemoveItem(
        this.listFilterConfig,
        this.objFilterConfig
      );
      this.isShowPopDelete = false;
      this.isSelectFilter = false;
      this.isApplyFilter = false;
      this.removeFilter();
    }
  }

  /**
   * Validate từ ngày
   *Created by pvthong 17/09/2020
   */
  fromdate_valueChanged(item) {
    if (item.FromDate && item.ToDate) {
      if (item.ToDate.getTime() < item.FromDate.getTime()) {
        this._isErrorFromDate = true;
        this.errorMessageFrom = this.translateSV.getValueByKey("FROM_DATE_MUST_BE_SMALLER_THAN_TO_DATE");
      }
      else {
        this._isErrorFromDate = false;
        this._isErrorToDate = false;
      }
    }
  }

  /**
   * Validate đến ngày
   *Created by pvthong 17/09/2020
   */
  todate_valueChanged(item) {
    if (item.FromDate && item.ToDate) {
      if (item.ToDate.getTime() < item.FromDate.getTime()) {
        this._isErrorToDate = true;
        this.errorMessageTo = this.translateSV.getValueByKey("TO_DATE_MUST_BE_BIGGER_THAN_FROM_DATE");
      }
      else {
        this._isErrorFromDate = false;
        this._isErrorToDate = false;
      }
    }
  }
}

