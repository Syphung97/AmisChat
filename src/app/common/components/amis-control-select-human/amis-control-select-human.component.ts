import { Component, OnInit, forwardRef, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { BaseControl } from '../base-control';
import CustomStore from 'devextreme/data/custom_store';
import { AmisDataService } from 'src/common/services/amis-data.service';
import { AmisCommonUtils } from 'src/common/fn/common-utils';
import { AmisTransferDataService } from 'src/common/services/amis-transfer-data.service';
import { AmisTranslationService } from 'src/common/services/amis-translation.service';
import { AvatarService } from 'src/app/services/user/avatar.service';
import { DxSelectBoxComponent } from 'devextreme-angular';
import { AmisStringUtils } from 'src/common/fn/string-utils';
import DataSource from 'devextreme/data/data_source';
import { FormMode } from 'src/common/enum/form-mode.enum';
import { SelfServiceStatus } from 'src/app/shared/enum/self-service-status/self-service-status.enum';

@Component({
  selector: 'amis-amis-control-select-human',
  templateUrl: './amis-control-select-human.component.html',
  styleUrls: ['./amis-control-select-human.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AmisControlSelectHumanComponent),
      multi: true
    }
  ],
})
export class AmisControlSelectHumanComponent extends BaseControl implements OnInit, ControlValueAccessor {


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
  // reload dữ liệu

  @Input()
  modelController: string = ""; // controller model

  @Input()
  isGetMethod: boolean = false; // có phải dùng phương thức GET để lấy dữ liệu không

  @Input()
  groupFieldConfigs: any; // thông tin cấu hình tên cột, trường dữ liệu để map với dữ liệu trả về khi bật popup, thêm dữ liệu

  @Output() displayValueChange: EventEmitter<any> = new EventEmitter();
  @Output() isReloadDataChange: EventEmitter<any> = new EventEmitter();

  @Output()
  onItemClick: EventEmitter<any> = new EventEmitter();


  @Input()
  dataSource: any;

  _useDataSource: boolean = false;

  @ViewChild("selectbox", { static: false }) selectbox: DxSelectBoxComponent;


  @Input()
  fnsLoadData: Function;

  // Custom lại filter truyền lên
  @Input()
  filterCustomize: Function;

  // Tên trường để hiển thị
  @Input()
  displayExpr = "";

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

  @Input() formMode: FormMode;

  @Input() isUseFns: boolean = true;


  @Input() isModifiable: boolean = false;

  _isNotOpen = true;
  _isLoaded = false;
  _firstTime: boolean = true;
  _isLoadDone = false;
  _tempSearchValue = "";
  _isReloadData: boolean = false;

  isDisableUpdate = false;

  compFactory: any;
  selectedItem: any

  dataReturn = [];

  constructor(
    public httpBase: AmisDataService,
    private avatarSV: AvatarService,
    public amisTransferDataService: AmisTransferDataService,
    public amisTranslateSV: AmisTranslationService,
  ) {
    super(amisTransferDataService, amisTranslateSV);
    this.initLoadDataPaging();
  }

  ngOnInit(): void {
    if (!!this.isDisableUpdate) {
      if (!!this.data?.Value) {
        this._readonly = true;
      }
    }
    if (this.inputParam) {
      this.inputParam["Columns"] = 'EmployeeID,JobPositionName,OrganizationUnitName,FullName,OfficeEmail,EmployeeCode,UserID,EditVersion';
    }

  }
  /**
   * hàm load data paging
   *
   * @memberof AmisControlSelectHumanComponent
   * vbcong 10/-6/2020
   */
  initLoadDataPaging() {
    const me = this;
    me.dataSource = new DataSource({
      store: new CustomStore({
        // loadMode: 'raw',
        load: loadOptions => {
          const filter = [];
          const params = new Object();
          if (me.inputParam) {
            for (let itm in me.inputParam) {
              params[itm] = me.inputParam[itm];
            }
          }

          params["PageSize"] = loadOptions.take || 10;
          params["PageIndex"] =
            Math.ceil(loadOptions.skip / loadOptions.take) + 1 || 1;

          let stringFilter = "";
          if (!!loadOptions["searchValue"]) {
            if (filter.length) {
              filter.push("And")
            }
            const listSearchExr: any = me.selectbox.searchExpr;
            if (listSearchExr?.length > 0) {
              const defaultFil = [];
              defaultFil.push(1, '<>', 1);
              filter.push(defaultFil);
              listSearchExr.forEach(item => {
                const arr = [];
                arr.push(item, "contains", loadOptions["searchValue"]);
                // arr.push(item, "contains", AmisStringUtils.convertVNtoENToLower(loadOptions["searchValue"]));
                filter.push("or");
                filter.push(arr);
              });
            }
          }
          if (filter.length) {
            stringFilter = AmisCommonUtils.Base64Encode(JSON.stringify(filter));
            params["Filterby"] = stringFilter;
          }
          // if(loadOptions["searchValue"] !== me._tempSearchValue){
          //   this.dataReturn = [];
          // }
          if (!me._isLoaded || (loadOptions["searchValue"] !== me._tempSearchValue && typeof me._tempSearchValue !== 'undefined')) {
            return me.httpBase
              .getDataByURL(me.url, me.controller, params, true, true, me.isGetMethod)
              .toPromise()
              .then((data: any) => {
                let result = {
                  data: [],
                  totalCount: 0
                };
                me._isLoadDone = true;
                me._tempSearchValue = loadOptions["searchValue"];
                me._isLoaded = false;
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
                // if(!isNaN(loadOptions.skip) && !isNaN(loadOptions.take)){
                //   const lengthData = loadOptions.skip + loadOptions.take;
                //   if(lengthData < result.totalCount){
                //     me._isLoaded = false;
                //   }
                // }
                if (result.data?.length > 0) {
                  result.data.forEach(item => {
                    const date = new Date(item.EditVersion);
                    const time = date.getTime();
                    item.Avatar = me.avatarSV.getAvatarDefault(item.UserID, time);
                  });
                }
                // this.dataReturn.push(...result.data);
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

  /**
* lấy thông tin cấu hình của trường dữ liệu
* vbcong 18/05/2020
*/
  setCustomConfigInField(customConfig) {
    const me = this;
    if (customConfig?.IsModifiable) me.isModifiable = true;
    if (customConfig?.GroupFieldConfigs) me.groupFieldConfigs = customConfig.GroupFieldConfigs;
    if (customConfig?.ModelController) me.modelController = customConfig.ModelController;
    if (customConfig?.IsDisableUpdate) me.isDisableUpdate = customConfig.IsDisableUpdate;

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
    const me = this;
    const objPopSele = document.querySelector('.dx-selectbox-popup-wrapper .dx-overlay-content');
    if (objPopSele) {
      objPopSele.classList.add('pop-select-human');
    }
    me._isNotOpen = false;
    if (me.isFilterServer) {
      me.isReloadData = true;
    }
    if (me._firstTime) {
      me.initLoadDataPaging();
      me._firstTime = false;
    }
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
   * created by vbcong - 07/03/2020
   */
  onValueChanged(e?) {
    if (e) { this.selectedItem = e?.component["_options"]?.['selectedItem'] };
    const me = this;
    let dataBinding = null;
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
    if (me._isLoadDone) {
      if (this.listFieldChanged?.length) {
        this.listFieldChanged.forEach(e => {
          if (e.IsUseNotFieldSetValue) {
            // to do
          } else {
            e.Value = dataBinding ? dataBinding[e.FieldSetValue] : null;
            e.ValueText = dataBinding ? dataBinding[e.FieldSetValueText] : null;
          }
        });
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
   * created by vbcong - 11/05/2020
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
          me._useDataSource = true;
          me._firstTime = false;
        }
      }
    }
  }


  /**
   * Call Api để lấy về dataSource
   * @memberof AmisControlComboboxComponent
   * created by vbcong - 11/05/2020
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
        });
    }
  }

  /**
   * Lấy giữ liệu từ custom url
   * @param {any} url
   * @param {any} isCustom
   * @memberof AmisControlComboboxComponent
   * created by vbcong - 11/05/2020
   */
  loadDataByURL() {
    const me = this;
    let param = null;
    if (me.inputParam) {
      param = me.inputParam;
    }
    if (!me._isLoaded || !me.dataSource?.length || me._isReloadData) {

      me.httpBase
        .getDataByURL(me.url, me.controller, param, true, false, this.isGetMethod)
        .subscribe(data => {
          me._isLoaded = true;
          me._isLoadDone = true;
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
                e["ValueSearch"] = AmisStringUtils.convertVNtoENToLower(e[me.displayExpr]);
                const date = new Date(e.EditVersion);
                const time = date.getTime();
                e.Avatar = me.avatarSV.getAvatarDefault(e.UserID, time);
              });
            }
          } else {
            me.dataSource = [];
          }
          // me._tempSearchValue = loadOptions["searchValue"];

        });
    }
  }

  /**
   * Xử lý dữ liệu bắn ra từ popup
   * vbcong 18/05/2020
   */
  onSelectData(data) {
    if (data && data.length) {
      this.dataSource = AmisCommonUtils.cloneData(data);
      this._isLoaded = true;
      this.writeValue(data[0][`${this.valueExpr}`]);
      this.selectedItem = data[0];
    }
    this.onValueChanged();
    this._isLoaded = false;
  }

}
