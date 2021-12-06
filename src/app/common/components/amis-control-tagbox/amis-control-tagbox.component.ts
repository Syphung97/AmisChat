import { Component, OnInit, forwardRef, ViewChild, ViewContainerRef, Input, Output, EventEmitter, ElementRef, Injector } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { BaseControl } from '../base-control';
import { PopupSelectData } from 'src/app/shared/enum/popup-select-data/popup-select-data';
import { AmisDataService } from 'src/common/services/amis-data.service';
import { AmisTransferDataService } from 'src/common/services/amis-transfer-data.service';
import { AmisTranslationService } from 'src/common/services/amis-translation.service';
import { takeUntil } from 'rxjs/operators';
import { AmisCommonUtils } from 'src/common/fn/common-utils';
import CustomStore from 'devextreme/data/custom_store';
import { AmisStringUtils } from 'src/common/fn/string-utils';
import DataSource from 'devextreme/data/data_source';
import { PopupLazyLoadService } from 'src/app/services/lazy-load-modules/popup-lazy-load.service';
import { BackgroundType } from 'src/app/shared/enum/common/background-type.enum';
import { SelfServiceStatus } from 'src/app/shared/enum/self-service-status/self-service-status.enum';



@Component({
  selector: 'amis-amis-control-tagbox',
  templateUrl: './amis-control-tagbox.component.html',
  styleUrls: ['./amis-control-tagbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AmisControlTagboxComponent),
      multi: true
    }
  ],
})
export class AmisControlTagboxComponent extends BaseControl implements OnInit, ControlValueAccessor {

  @ViewChild('popupSelectData', { read: ViewContainerRef }) popupSelectData: ViewContainerRef;

  @Input()
  inputParam: any;

  @Input()
  dataPath: any; // đường dẫn đến dữ liệu trả về  

  // reload dữ liệu
  @Input() get isReloadData() {
    return this._isReloadData;
  }
  set isReloadData(val) {
    this._isReloadData = val;
  }

  @Input()
  popupWidth: string = ""; // độ rộng popup

  @Input()
  modelController: string = ""; // controller model

  @Input()
  isGetMethod: boolean = false; // đường dẫn đến dữ liệu trả

  @Input()
  layoutConfig: any; // thông tin cấu hình tên cột, trường dữ liệu để map với dữ liệu trả về khi bật popup, thêm dữ liệu


  @Input()
  groupFieldConfigs: any; // thông tin cấu hình tên cột, trường dữ liệu để map với dữ liệu trả về khi bật popup, thêm dữ liệu

  @Input()
  subSystemCode: any; // thông tin cấu hình tên cột, trường dữ liệu để map với dữ liệu trả về khi bật popup, thêm dữ liệu


  @Output() displayValueChange: EventEmitter<any> = new EventEmitter();
  @Output() isReloadDataChange: EventEmitter<any> = new EventEmitter();

  @Output()
  onItemClick: EventEmitter<any> = new EventEmitter();

  dataSource: any;

  @Input() set setDataSource(data) {
    if (data) {
      this.dataSource = data;
      this._useDataSource = true;
    }
  }

  _useDataSource: boolean = false;

  @ViewChild("selectbox", { static: false }) selectbox: ElementRef;


  @Input()
  fnsLoadData: Function;

  // Custom lại filter truyền lên
  @Input()
  filterCustomize: Function;

  // Tên trường để hiển thị
  @Input()
  displayExpr = "";

  // Tên trường để hiển thị
  @Input()
  displayField = "";

  // Tên trường lấy giá trị
  @Input()
  valueExpr = "";

  @Input()
  noDataText = "Dữ liệu không có trong danh sách";

  @Input()
  isRemoteServer: boolean = false;

  @Input() searchEnabled: boolean = true;

  @Input() controller: string = "";

  @Input() url: string = "";

  @Input() isUseFns: boolean = true;

  @Input() popupType = PopupSelectData.Base; // Loại popup là base hay là popup tùy chỉnh

  @Input() iconMore: string = "icon-optional-more"; // class icon lấy từ config

  @Input() isDynamicCombobox: boolean = false;

  @Input() isModifiable: boolean = false;

  _isShowCustomData: boolean = true;
  @Input() get isShowCustomData() {
    return this._isShowCustomData;
  }
  set isShowCustomData(val) {
    this._isShowCustomData = val;
  }

  searchArray: any;

  @Input() controlValue = [];

  _isNotOpen = true;
  _isLoaded = false;
  _firstTime: boolean = true;
  _tempSearchValue = "";
  _isReloadData: boolean = false;

  compFactory: any;
  selectedItem: any

  loadingVisible: boolean = false; // hiển thị loading

  loadingPosition: any; // vị trí hiển thị loading

  targetID: string = ""; // id gen để hiển thị loading

  //loại background
  backgroundType = BackgroundType;

  constructor(
    public httpBase: AmisDataService,
    public amisTransferDataService: AmisTransferDataService,
    public amisTranslateSV: AmisTranslationService,
    private loadPopupService: PopupLazyLoadService,
    private readonly injector: Injector,
  ) {
    super(amisTransferDataService, amisTranslateSV);
  }

  ngOnInit(): void {
    this.searchArray = [
      this.displayExpr,
      "ValueSearch"
    ]
  }

  writeValue(obj: any): void {
    this._value = obj;
    this.onChange(this.value);
    if (this._isReloadData) {
      this.valueChanged.emit(this._value);
    }
    this.initCombo();
  }

  onOpened(e) {
    if (!this.targetID) {
      this.getLoadingTargetID();
    }
    const me = this;
    me._isNotOpen = false;
    me._firstTime = false;
    if (me.isFilterServer) {
      me.isReloadData = true;
    }
    if (!me._firstTime) {
      me.initCombo();
    }
  }


  selectItem(e) {
    this.onItemClick.emit(e);
  }

  /**
   * Thay đổi giá trị input
   * created by nmduy - 07/03/2020
   */
  onValueChanged(e?) {
    const me = this;
    me.displayValue = "";
    let value = "";
    if (e) this.selectedItem = e?.component?.option('selectedItems');
    if (this.controlValue?.length) {
      for (let i = 0; i < this.controlValue.length; i++) {
        const element = this.controlValue[i];
        value += element + ";";
        let data = me.dataSource.find(e => e[`${me.valueExpr}`] == element)
        if (data) {
          me.displayValue += data[me.displayExpr] + "; ";
        }
      }
      value = value.substr(0, value.length - 1);
      me.displayValue = me.displayValue.substr(0, me.displayValue.length - 2);
    }
    me.displayValueChange.emit(me.displayValue);
    this.writeValue(value);
    if (e.event || (!e.event && e.previousValue)) { // nếu event chọn hoặc xóa dữ liệu bind sẵn lên control
      super.onValueChanged(this._value);
    }
  }

  /**
   *
   * created by nmduy - 11/05/2020
   */
  initCombo() {
    const me = this;
    if (!me._isLoaded && me._useDataSource && me._firstTime) {
      if (me._value?.length) {
        me._isLoaded = true;
        me.controlValue = me._value?.split(";");
        me._firstTime = false;
      }
    }
    if ((!me._isLoaded || !me.dataSource?.length || me._isReloadData) && !me._useDataSource) {
      me._isReloadData = false;
      if (me._firstTime) {
        if (!me.dataSource?.length) {
          this.controlValue = [];
          me.dataSource = [];
          if (me._value) {
            const values = me._value?.toString()?.split(";");
            if (me.displayValue?.length) {
              const displays = me.displayValue?.split(";");
              if (values?.length) {
                for (let i = 0; i < values.length; i++) {
                  const obj = new Object();
                  if (isNaN(values[i])) {
                    this.controlValue.push(values[i]);
                    obj[`${me.valueExpr}`] = values[i];
                  } else {
                    this.controlValue.push(parseInt(values[i]));
                    obj[`${me.valueExpr}`] = parseInt(values[i]);
                  }
                  obj[`${me.displayExpr}`] = displays[i]?.trim();
                  me.dataSource.push(obj);
                }
              }
            }
          }
        }
      } else {
        if (me.isRemoteServer) {
          if (me.isUseFns) {
            me.dataSource = new CustomStore({
              load: me.buildCallAPI,
              byKey: function (key) {
                return { id: key[me.valueExpr] };
              },
              // loadMode: "processed"
            });
          } else {
            if (me.isFilterServer) {
              if (!me._isLoaded || me.isReloadData) {
                me.loadDataPaging();
                // me.dataSource =
                //   new CustomStore({
                //     load: me.buildLoadData,
                //     byKey: function (key) {
                //       return { id: key[me.valueExpr] };
                //     },
                //     loadMode: "processed"
                //   })
              }
            } else {
              me.loadDataByURL();
            }
          }
        }
      }
    }
  }


  /**
   * Call Api để lấy về dataSource
   * created by nmduy - 11/05/2020
   */
  buildCallAPI = (loadOptions: any) => {

    const me = this;
    const filter = [];

    let stringFilter = "";
    if (!!loadOptions["searchValue"]) {
      filter.push(loadOptions["searchExpr"]);
      filter.push(loadOptions["searchOperation"]);
      filter.push(loadOptions["searchValue"]);
    }
    if (me.filterCustomize) {
      me.filterCustomize(filter);
    }
    if (filter.length) {
      // stringFilter = amis.Base64Encode(MISAUtils.Encode(filter));
    }
    if (!me._isLoaded || loadOptions["searchValue"] !== me._tempSearchValue) {
      return me
        .fnsLoadData()
        .toPromise()
        .then((data: any) => {
          let result = {
            data: []
          }
          me._isLoaded = true;
          if (data.Data) {
            result = {
              data: data.Data
            };
            me.dataSource = data.Data;
          }
          // me._tempSearchValue = loadOptions["searchValue"];

          return result;
        })
        .catch(error => {
          console.log(`Data Loading Error: ${error}`);
        });
    }
  };

  loadDataPaging() {
    const me = this;
    me.dataSource = new DataSource({
      store: new CustomStore({
        load: function (loadOptions: any) {
          const filter = [];
          const params = new Object();
          if (me.inputParam) {
            for (let itm in me.inputParam) {
              params[itm] = me.inputParam[itm];
            }
          }
          params["Columns"] = `${me.valueExpr},${me.displayExpr}`;
          params["PageSize"] = loadOptions.take || 10;
          params["PageIndex"] =
            Math.ceil(loadOptions.skip / loadOptions.take) + 1 || 1;

          let stringFilter = "";
          if (me._value) {
            let arr = [];
            arr.push(me.valueExpr, "<>", me._value);
            filter.push(arr)
          }
          if (!!loadOptions["searchValue"]) {
            if (filter.length) {
              filter.push("And")
            }
            let arr = [];
            arr.push([me.displayExpr, "contains", AmisStringUtils.convertVNtoENToLower(loadOptions["searchValue"])]);
            if (this.displayField) {
              arr.push("OR")
              arr.push(["DisplayField", "contains", AmisStringUtils.convertVNtoENToLower(loadOptions["searchValue"])]);
            }
            filter.push(arr);
          }
          if (filter.length) {
            //console.log(filter);
            stringFilter = AmisCommonUtils.Base64Encode(JSON.stringify(filter));
            params["Filterby"] = stringFilter;
          }
          if (!me._isLoaded || loadOptions["searchValue"] !== me._tempSearchValue || me.isReloadData) {
            return me.httpBase
              .getDataByURL(me.url, me.controller, params, true, true, me.isGetMethod)
              .toPromise()
              .then((data: any) => {
                let result = {
                  data: [],
                  totalCount: 0
                }
                me._tempSearchValue = loadOptions["searchValue"];
                me._isLoaded = true;
                me._firstTime = false;
                if (me._isReloadData) {
                  me._isReloadData = false;
                  me.isReloadDataChange.emit(me._isReloadData);
                }
                if (data.Data) {
                  if (me.dataPath) {
                    result.data = data.Data?.[`${me.dataPath}`];
                    result.totalCount = data.Data?.Total;
                  } else if (data.Data.PageData?.length) {
                    result.data = data.Data.PageData;
                    result.totalCount = data.Data.Total;
                  } else {
                    me.dataSource = data.Data;
                  }
                  // if (me._value) {
                  //   if (params["PageIndex"] === 1) {
                  //     if (result.data?.findIndex(e => e[me.valueExpr] === me._value) === -1) {
                  //       const obj = new Object();
                  //       obj[`${me.valueExpr}`] = me._value;
                  //       obj[`${me.displayExpr}`] = me.displayValue;
                  //       result.data?.unshift(obj);
                  //     }
                  //   }
                  // }
                }

                return result.data;
              })
              .catch(error => {
                console.log(`Data Loading Error: ${error}`);
              });
          }
        },
        byKey: function (key) {
          return { id: key[me.valueExpr] };
        },
        // loadMode: "processed"
      })
    });
  }


  /**
   * Lấy giữ liệu từ custom url
   * @param {any} url
   * @param {any} isCustom
   * created by nmduy - 11/05/2020
   */
  loadDataByURL() {
    const me = this;
    let param = null;
    this.loadingVisible = true;
    if (me.inputParam) {
      param = me.inputParam
    }
    // me.httpBase
    //   .getDataByURL(url, me.controller, param, isCustom)
    //   .subscribe(
    //     res => {
    //       if (res?.Success) {
    //         me._isLoaded = true;
    //         me.dataSource = res.Data;
    //       }
    //     }
    //   );
    if (!me._isLoaded || !me.dataSource?.length || me._isReloadData) {
      me.httpBase
        .getDataByURL(me.url, me.controller, param, true, false, this.isGetMethod)
        .subscribe(data => {
          this.loadingVisible = false;
          me._isLoaded = true;
          if (data.Data) {
            if (this.dataPath) {
              me.dataSource = data.Data?.[`${this.dataPath}`];
            } else if (data.Data.PageData?.length) {
              me.dataSource = data.Data.PageData;
            } else {
              me.dataSource = data.Data;
            }
            if (me.dataSource?.length) {
              me.dataSource.forEach(e => {
                e["ValueSearch"] = AmisStringUtils.convertVNtoENToLower(e[me.displayExpr]);
              })
            }
          } else {
            me.dataSource = [];
          }
        })
    }

  }

  /**
 * lấy thông tin cấu hình của trường dữ liệu
 * nmduy 18/05/2020
 */
  setCustomConfigInField(customConfig) {
    const me = this;

    me.iconMore = customConfig?.Icon ? customConfig.Icon : 'icon-optional-more'; // icon hiển thị bên cạnh click để hiển thị popup
    if (this._isShowCustomData) {
      me.isDynamicCombobox = customConfig?.IsDynamicCombobox ? true : false;
    }
    me.popupType = customConfig.PopupType ? customConfig.PopupType : PopupSelectData.Base;
    if (customConfig?.hasOwnProperty('IsModifiable')) {
      me.isModifiable = customConfig.IsModifiable;
    } else {
      me.isModifiable = true;
    }
    if (customConfig?.PopupWidth) {
      me.popupWidth = customConfig.PopupWidth;
    }
    if (customConfig?.SubsystemCode) {
      me.subSystemCode = customConfig.SubsystemCode;
    }

  }

  /**
* Load popup theo kiểu truyền vào
* @param {TypeView} type
* creaed by nmduy
*/
  async loadPopupByType() {
    switch (this.popupType) {
      case PopupSelectData.Base:
        this.compFactory = await this.loadPopupService.loadPopupBaseSelectData();
        break;
      default:
        break;
    }
    this.popupSelectData.clear();
    const { instance: componentInstance } = this.popupSelectData.createComponent(this.compFactory, undefined, this.injector);
    this.initPopup(componentInstance);
  }




  /**
   * Khởi tạo thông tin popup
   * nmduy 18/05/2020
   */
  async initPopup(componentInstance) {
    componentInstance.visiblePopup = true;
    componentInstance.inSelectedRecords = this.selectedItem;
    componentInstance.labelText = this.labelText;
    if (this.inputParam) componentInstance.inputParam = this.inputParam;
    if (this.popupType == PopupSelectData.Base) {
      componentInstance.isGetMethod = this.isGetMethod;
      if (this.layoutConfig) componentInstance.layoutConfig = this.layoutConfig
      if (this.subSystemCode) componentInstance.subSystemCode = this.subSystemCode
      componentInstance.isModifiable = this.isModifiable; // trường dữ liệu có cho phép thêm sửa xóa không
      componentInstance.valueExpr = this.valueExpr;
      componentInstance.displayExpr = this.displayExpr;
      componentInstance.popupWidth = this.popupWidth;
      componentInstance.isSingleSelection = false; // là kiểu chọn một hay chọn nhiều
    }
    componentInstance.outSelectedRecord.pipe(takeUntil(componentInstance._onDestroySub)).subscribe(this.onSelectData.bind(this));
    componentInstance.closePopup.pipe(takeUntil(componentInstance._onDestroySub)).subscribe(this.onClosePopup.bind(this));
  }

  /**
   * Xử lý dữ liệu bắn ra từ popup
   * nmduy 18/05/2020
   */
  onSelectData(data) {
    if (data && data.length) {
      this.dataSource = AmisCommonUtils.cloneData(data);
      this._isLoaded = true;
      let values = [];
      let value = "";
      for (let i = 0; i < data.length; i++) {
        const element = data[i];
        values.push(element[`${this.valueExpr}`]);
        value += element[`${this.valueExpr}`] + ";";
      }
      if (value?.length) value = value.substr(0, value.length - 1);
      this.controlValue = values;
      this.writeValue(value);
    }
    this.onValueChanged();
    this._isLoaded = false;
  }


  /**
   * Sự kiện đóng popup
   */
  onClosePopup(param?) {
    if (param?.IsReload) {
      this.isReloadData = param.IsReload;
    }
    if (param?.IsDeleted) {
      this.writeValue(null);
      this.displayValue = "";
    }
    if (param?.IsUpdated) {
      let updatedItem = param.UpdatedItem;
      if (updatedItem) {
        this.onUpdateCurrentItem(updatedItem)
      }
    }
  }

  /**
   * Cập nhật lại item đang được chọn
   * nmduy 11/06/2020
   */
  onUpdateCurrentItem(updatedItems) {
    const me = this;
    me.displayValue = updatedItems[0][`${me.displayExpr}`];
    me.displayValueChange.emit(me.displayValue);
    me.selectedItem = updatedItems[0];
    me.selectbox['items'] = updatedItems;
    me.value = updatedItems[0][`${me.valueExpr}`];
    me.onClickEdit();
    me.updateFieldView.emit();
  }



  /**
   * Gán lại dữ liệu cho control
   * nmduy 29/05/2020
   */
  restoreControlData(obj) {
    this.controlValue = [];
    const preValue = obj?.PreviousValue;
    const preDisValue = obj?.PreviousDisplayValue;
    if (preValue?.length && preDisValue?.length) {
      const values = preValue?.split(";");
      if (values?.length) {
        for (let i = 0; i < values.length; i++) {
          if (isNaN(values[i])) {
            this.controlValue.push(values[i]);
          } else {
            this.controlValue.push(parseInt(values[i]));
          }
        }
      }
    }
  }

  /**
  * sinh id cho đối tượng sổ xuống để hiển thị loading
  * nmduy 12/08/2020
  */
  getLoadingTargetID() {
    if (this._fieldName) {
      this.targetID = `tagbox-dropdown-${this._fieldName}`;
    } else {
      this.targetID = `tagbox-dropdown-${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}`;
    }
    this.loadingPosition = {
      at: "left bottom",
      my: "left top",
      of: `#${this.targetID}`
    }
  }
}
