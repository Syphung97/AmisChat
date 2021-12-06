import { Component, OnInit, forwardRef, Input, Output, ElementRef, ViewChild, EventEmitter, Injector, ViewContainerRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { BaseControl } from '../base-control';
import CustomStore from 'devextreme/data/custom_store';
import { AmisDataService } from 'src/common/services/amis-data.service';
import { PopupSelectData } from 'src/app/shared/enum/popup-select-data/popup-select-data';
import { takeUntil } from 'rxjs/operators';
import { AmisCommonUtils } from 'src/common/fn/common-utils';
import { AmisTransferDataService } from 'src/common/services/amis-transfer-data.service';
import { AmisTranslationService } from 'src/common/services/amis-translation.service';
import DataSource from 'devextreme/data/data_source';
import { AmisStringUtils } from 'src/common/fn/string-utils';
import { DxSelectBoxComponent } from 'devextreme-angular';
import { PopupLazyLoadService } from 'src/app/services/lazy-load-modules/popup-lazy-load.service';
import { SelfServiceStatus } from 'src/app/shared/enum/self-service-status/self-service-status.enum';
import { PickListService } from 'src/app/services/pick-list/pick-list.service';
import { FormMode } from 'src/common/enum/form-mode.enum';


@Component({
  selector: 'amis-amis-control-combobox',
  templateUrl: './amis-control-combobox.component.html',
  styleUrls: ['./amis-control-combobox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AmisControlComboboxComponent),
      multi: true
    }
  ],
})
export class AmisControlComboboxComponent extends BaseControl implements OnInit, ControlValueAccessor {

  @ViewChild('popupSelectData', { read: ViewContainerRef }) popupSelectData: ViewContainerRef;

  @Input()
  inputParam: any;

  @Input()
  dataPath: any; // đường dẫn đến dữ liệu trả về

  @Input() get isReloadData() {
    return this._isReloadData;
  }
  set isReloadData(val) {
    this._isReloadData = val;
  }

  _isShowCustomData: boolean = true;
  @Input() get isShowCustomData() {
    return this._isShowCustomData;
  }
  set isShowCustomData(val) {
    this._isShowCustomData = val;
  }

  // reload dữ liệu

  @Input()
  popupWidth: string = ""; // độ rộng popup
  @Input()
  modelController: string = ""; // controller model

  @Input()
  isGetMethod: boolean = false; // có phải dùng phương thức GET để lấy dữ liệu không

  @Input()
  layoutConfig: any; // 

  @Input()
  groupFieldConfigs: any; // 

  @Input()
  subSystemCode: any; // 
  @Input()
  tableName: any; // 

  @Input()
  fieldName: any; // 

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

  @ViewChild("selectbox") selectbox: DxSelectBoxComponent;


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

  @Input() acceptCustomValue = false;

  _noDataText = this.amisTranslateSV.getValueByKey("CONTROL_COMBOBOX_NODATA_TEXT");
  _quickAddText = `<div style="color: #2566e9;">${this.amisTranslateSV.getValueByKey("CONTROL_COMBOBOX_QUICK_ADD_TEXT")}</div>`;
  @Input()
  set noDataText(value) {
    this._noDataText = value;
  }
  get noDataText() {
    if (this.acceptCustomValue) {
      return this._quickAddText;
    }
    return this._noDataText;
  }

  @Input()
  isRemoteServer: boolean = false;

  @Input() searchEnabled: boolean = true;

  @Input() controller: string = "";

  @Input() url: string = "";

  @Input() isUseFns: boolean = true;

  @Input() popupType = PopupSelectData.Base; // Loại popup là base hay là popup tùy chỉnh

  @Input() iconMore: string = "icon-optional-more"; // class icon lấy từ config

  @Input() isDynamicCombobox: boolean = false;

  @Input() isShowCustomMore: boolean = true;

  @Input() isModifiable: boolean = true;


  searchArray: any;

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

  constructor(
    public httpBase: AmisDataService,
    public amisTransferDataService: AmisTransferDataService,
    public amisTranslateSV: AmisTranslationService,
    private loadPopupService: PopupLazyLoadService,
    private readonly injector: Injector,
    private picklistSV: PickListService
  ) {
    super(amisTransferDataService, amisTranslateSV);
  }

  ngOnInit(): void {
    this.acceptCustomValue = this.popupType === PopupSelectData.SetupData && this._isShowCustomData ? true : false;
    if (this.isFilterServer) {
      this.loadDataPaging();
    }
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
    const objPopSele = document.querySelector('.dx-selectbox-popup-wrapper .dx-overlay-content');
    if (objPopSele) {
      objPopSele.classList.add('amis-pop-combobox-normal');
    }
    me._isNotOpen = false;
    if (me.isFilterServer) {
      me.isReloadData = true;
    }
    if (me._firstTime || me._isReloadData) {
      me.loadData();
      me._firstTime = false;
    }
  }


  /**
   * Xử lý lúc khởi tạo
   * @param {any} e 
   * @memberof AmisControlComboboxComponent
   */
  onInitialized(e) {
    e.component.registerKeyHandler("downArrow", function (ee) {
      if (!(e.component.option('opened'))) {
        e.component.open();
        ee.preventDefault();
      } else {
        return true;
      }
    })
  }

  /**
   * sự kiện click chọn một bản ghi
   *
   * @param {any} e
   * @memberof AmisControlComboboxComponent
   */
  selectItem(e) {
    this.onItemClick.emit(e);
  }

  /**
   * Thay đổi giá trị input
   * created by vhtruong - 07/03/2020
   */
  onValueChanged(e?) {
    if (e) { this.selectedItem = e?.component["_options"]?.['selectedItem'] };
    const me = this;
    let dataBinding = null;
    if (!this.value) { // cập nhật lại value text khi xóa value
      me.displayValue = null;
      me.displayValueChange.emit(me.displayValue);
      if (me.dataSource?.length) {
        const data = me.dataSource?.find(e => e[`${me.valueExpr}`] === null);
        if (data) {
          data[me.displayExpr] = null;
        }
      }
    }
    if (this.selectedItem) {
      dataBinding = AmisCommonUtils.cloneData(this.selectedItem);
      me.displayValue = this.selectedItem[me.displayExpr];
      me.displayValueChange.emit(me.displayValue);
    } else {
      if (AmisCommonUtils.IsArray(me.dataSource)) {
        const data = me.dataSource?.find(e => e[`${me.valueExpr}`] === me._value)
        if (data) {
          dataBinding = AmisCommonUtils.cloneData(data);
          me.displayValue = data[me.displayExpr];
          me.displayValueChange.emit(me.displayValue);
        }
      }
    }
    if (me._isLoaded) {
      if (this.listFieldChanged?.length) {
        this.listFieldChanged.forEach(e => {
          if (e.IsUseNotFieldSetValue) {
            // to do
          } else {
            e.Value = dataBinding ? dataBinding[e.FieldSetValue] : null;
            e.ValueText = dataBinding ? dataBinding[e.FieldSetValueText] : null;
          }
        })
        this.valueChangedWithFieldAndValue.emit(this.listFieldChanged);
      }
    }
    if (e.event || (!e.event && e.previousValue)) { // nếu event chọn hoặc xóa dữ liệu bind sẵn lên control
      super.onValueChanged(this._value);
    }
  }

  /**
   *
   * @memberof AmisControlComboboxComponent
   * created by vhtruong - 11/05/2020
   */
  initCombo() {
    const me = this;
    if ((!me._isLoaded || !me.dataSource?.length || me._isReloadData) && !me._useDataSource) {
      if (me._firstTime) {
        if (!me.dataSource?.length) {
          if (me._value) {
            const obj = new Object();
            obj[`${me.valueExpr}`] = me._value;
            obj[`${me.displayExpr}`] = me.displayValue;
            me.dataSource = [];
            me.dataSource.push(obj);
          }
        } else {
          if (!me._useDataSource) {
            const obj = new Object();
            obj[`${me.valueExpr}`] = me._value;
            obj[`${me.displayExpr}`] = me.displayValue;
            me.dataSource = [];
            me.dataSource.push(obj);
          }
        }
      }
    }
  }


  /**
   * Load dữ liệu
   * @memberof AmisControlComboboxComponent
   */
  loadData() {
    const me = this;
    if (me._firstTime || me._isReloadData) {
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
            me.loadDataPaging();
            // me.dataSource =
            //   new CustomStore({
            //     load: me.buildLoadData,
            //     byKey: function (key) {
            //       return { id: key[me.valueExpr] };
            //     },
            //     loadMode: "processed"
            //   })

          } else {
            me.loadDataByURL();
          }
        }
      }
    }
  }


  /**
   * Call Api để lấy về dataSource
   * @memberof AmisControlComboboxComponent
   * created by vhtruong - 11/05/2020
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
          me._firstTime = false;
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
            stringFilter = AmisCommonUtils.Base64Encode(JSON.stringify(filter));
            params["Filterby"] = stringFilter;
          }
          if (true) {
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
                  }
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
        loadMode: 'processed'
      }),
      pageSize: 10
    });
  }

  buildLoadData = (loadOptions: any) => {
    const me = this;
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
      arr.push(me.displayExpr, "contains", AmisStringUtils.convertVNtoENToLower(loadOptions["searchValue"]));
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
    if (!me._isLoaded || loadOptions["searchValue"] !== me._tempSearchValue) {
      return me.httpBase
        .getDataByURL(me.url, me.controller, params, true, true, this.isGetMethod)
        .toPromise()
        .then((data: any) => {
          let result = {
            data: [],
            totalCount: 0
          }
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
            if (me._value) {
              if (params["PageIndex"] === 1) {
                if (result.data?.findIndex(e => e[me.valueExpr] === me._value) === -1) {
                  const obj = new Object();
                  obj[`${me.valueExpr}`] = me._value;
                  obj[`${me.displayExpr}`] = me.displayValue;
                  result.data?.unshift(obj);
                }
              }
            }
          }

          return result.data;
        })
        .catch(error => {
          console.log(`Data Loading Error: ${error}`);
        });
    }
  };


  /**
   * Lấy giữ liệu từ custom url
   * @param {any} url
   * @param {any} isCustom
   * @memberof AmisControlComboboxComponent
   * created by vhtruong - 11/05/2020
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
          me._firstTime = false;
          if (me._isReloadData) {
            me._isReloadData = false;
            me.isReloadDataChange.emit(me._isReloadData);
          }
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
                e["ValueSearch"] = e[me.displayExpr] ? AmisStringUtils.convertVNtoENToLower(e[me.displayExpr]) : "";
              })
            }
          } else {
            me.dataSource = [];
          }
          // me._tempSearchValue = loadOptions["searchValue"];

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
    if (customConfig?.SelfService_Status == SelfServiceStatus.Reject) {
      this._isShowTooltip = true;
      this._tooltipContent = customConfig?.SelfService_Reason ? customConfig?.SelfService_Reason : this.amisTranslateSV.getValueByKey("EMPLOYEE_SELFSERVICE_REJECT");
      this.labelColor = "#fe7f01";
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
      case PopupSelectData.SetupData:
        this.compFactory = await this.loadPopupService.loadPopupSetupData();
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
    componentInstance.fieldName = this.fieldName;
    componentInstance.subSystemCode = this.subSystemCode
    componentInstance.tableName = this.tableName
    if (this.inputParam) componentInstance.inputParam = this.inputParam;
    if (this.popupType == PopupSelectData.Base) {
      componentInstance.isGetMethod = this.isGetMethod;
      if (this.layoutConfig) componentInstance.layoutConfig = this.layoutConfig
      componentInstance.isModifiable = this.isModifiable; // trường dữ liệu có cho phép thêm sửa xóa không
      componentInstance.valueExpr = this.valueExpr;
      componentInstance.displayExpr = this.displayExpr;
      componentInstance.popupWidth = this.popupWidth;
      componentInstance.isSingleSelection = true; // là kiểu chọn một hay chọn nhiều
    }
    componentInstance.outSelectedRecord.pipe(takeUntil(componentInstance._onDestroySub)).subscribe(this.onSelectData.bind(this));
    componentInstance.closePopup.pipe(takeUntil(componentInstance._onDestroySub)).subscribe(this.onClosePopup.bind(this));
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
      this.dataSource = [];
    }
    if (param?.IsUpdated) {
      let updatedItem = param.UpdatedItem;
      if (updatedItem) {
        this.onUpdateCurrentItem(updatedItem)
      }
    }
    let selectbox: any = this.selectbox;
    selectbox?.instance?._refresh();
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
    me.previousValue = me._value;
    me.previousDisplayValue = me.displayValue;
    me.updateFieldView.emit();
  }

  /**
   * Xử lý dữ liệu bắn ra từ popup
   * nmduy 18/05/2020
   */
  onSelectData(data) {
    if (data && data.length) {
      this.dataSource = AmisCommonUtils.cloneData(data);
      this.selectbox['items'] = data;
      this._isLoaded = true;
      this.writeValue(data[0][`${this.valueExpr}`]);
      this.selectedItem = data[0];
    }
    this.onValueChanged();
    this.selectbox.instance.repaint();
    this._isLoaded = false;
  }


  /**
   * sinh id cho đối tượng sổ xuống để hiển thị loading
   * nmduy 12/08/2020
   */
  getLoadingTargetID() {
    if (this._fieldName) {
      this.targetID = `combobox-dropdown-${this._fieldName}`;
    } else {
      this.targetID = `combobox-dropdown-${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}`;
    }
    this.loadingPosition = {
      at: "left bottom",
      my: "left top",
      of: `#${this.targetID}`
    }
  }


  /**
   * So sánh 2 giá trị
   * @param {any} value1 
   * @param {any} value2 
   * @memberof AmisControlComboboxComponent
   */
  compareValue(value1, value2) {
    if (value1 === value2) {
      return true;
    }
    if ((value1 === null && value2 === undefined) || (value1 == undefined && value2 === null)) {
      return true;
    }
    return false;
  }

  /**
   * check có phải nhấn enter ko
   * dtnam1 19/9/2020
   * @param e 
   */
  isEnterKey = false;
  timeout;
  checkEnterKey(e) {
    this.isEnterKey = e?.event?.keyCode == 13 ? true : false;
    // clearTimeout(this.timeout);
    // this.timeout = setTimeout(() => {
    //   if (!e?.text?.trim()) {
    //     if (this.acceptCustomValue){
    //       this.acceptCustomValue = false;
    //       let selectbox: any = this.selectbox;
    //       selectbox?.instance?._refresh();
    //     }
    //     return;
    //   }
    //   else {
    //     if (!this.acceptCustomValue) {
    //       this.acceptCustomValue = true;
    //       let selectbox: any = this.selectbox;
    //       selectbox?.instance?._refresh();
    //     }
    //   }
    // }, 250);
  }
  /**
   * thêm nhanh giá trị combobox
   * dtnam1 19/9/2020
   * @param e 
   */
  onCustomItemCreating(e) {
    if (e?.text?.trim() && !this.dataSource.find(x => x.PickListValue === e.text) && this.isEnterKey) {
      let params: any = {
        SubsystemCode: this.subSystemCode,
        TableName: this.tableName,
        PickListType: this.fieldName,
        PickLists: JSON.stringify(
          [{
            "PickListValue": e.text.trim(),
            "SubsystemCode": this.subSystemCode,
            "IsSystem": false,
            "PreviousValue": e.text.trim(),
            "OriginValue": "",
            "IsUse": true,
            "State": FormMode.Insert,
            "PickListType": this.fieldName,
            "SortOrder": this.dataSource.length + 1,
            "IsError": false
          }]
        )
      }
      // if(this.isFilterServer){
      //   params.IsQuickAdd = true;
      // }
      this.picklistSV.saveListPickList(params).subscribe(res => {
        if (res?.Success && res.Data) {
          this.amisTransferDataService.showSuccessToast(this.amisTranslateSV.getValueByKey("ADD_SUCCESS"));
          let data = res.Data[0];
          this.dataSource.push({
            PickListID: data.PickListID,
            PickListValue: data.PickListValue,
            ValueSearch: AmisStringUtils.convertVNtoENToLower(data.PickListValue)
          });
          this.value = AmisCommonUtils.cloneData(data.PickListID);
        }
        else if (res?.ValidateInfo[0]?.ErrorMessage) {
          this.amisTransferDataService.showErrorToast(res.ValidateInfo[0].ErrorMessage);
        }
        else {
          this.amisTransferDataService.showErrorToast(this.amisTranslateSV.getValueByKey("ADD_ERROR"));
        }
      }, error => {
        this.amisTransferDataService.showErrorToast(this.amisTranslateSV.getValueByKey("ERROR_HAPPENED"));
      })
    }
  }
}
