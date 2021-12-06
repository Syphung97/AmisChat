import { Component, OnInit, forwardRef, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { BaseControl } from '../base-control';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { AmisTransferDataService } from 'src/common/services/amis-transfer-data.service';
import { AmisTranslationService } from 'src/common/services/amis-translation.service';
import { DxAutocompleteComponent } from 'devextreme-angular';
import { AmisDataService } from 'src/common/services/amis-data.service';
import { AmisStringUtils } from 'src/common/fn/string-utils';
import CustomStore from 'devextreme/data/custom_store';
import { AmisCommonUtils } from 'src/common/fn/common-utils';
import DataSource from 'devextreme/data/data_source';
import { SelfServiceStatus } from 'src/app/shared/enum/self-service-status/self-service-status.enum';


@Component({
  selector: 'amis-amis-control-autocomplete',
  templateUrl: './amis-control-autocomplete.component.html',
  styleUrls: ['./amis-control-autocomplete.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AmisControlAutocompleteComponent),
      multi: true
    }
  ],
})
export class AmisControlAutocompleteComponent extends BaseControl implements OnInit, ControlValueAccessor {
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
  popupWidth: string = ""; // độ rộng popup
  @Input()
  modelController: string = ""; // controller model

  @Input()
  isGetMethod: boolean = false; // có phải dùng phương thức GET để lấy dữ liệu không

  @Input()
  layoutConfig: any; // 

  // Tên trường để hiển thị
  @Input()
  displayExpr = "";

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

  @ViewChild("selectbox") selectbox: DxAutocompleteComponent;


  @Input()
  fnsLoadData: Function;

  // Custom lại filter truyền lên
  @Input()
  filterCustomize: Function;

  @Input()
  noDataText = "Dữ liệu không có trong danh sách";

  @Input()
  isRemoteServer: boolean = false;

  @Input() searchEnabled: boolean = true;

  @Input() controller: string = "";

  @Input() url: string = "";

  @Input() isUseFns: boolean = true;

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

  timeoutObj;

  searchValue: string = "";

  constructor(
    public httpBase: AmisDataService,
    public amisTransferDataService: AmisTransferDataService,
    public amisTranslateSV: AmisTranslationService) {
    super(amisTransferDataService, amisTranslateSV);
  }

  ngOnInit(): void {
    this.getLoadingTargetID();
    this.searchArray = [
      this.displayExpr,
      "ValueSearch"
    ];
    this.initCombo();
    this.loadDataPaging();
  }

  writeValue(obj: any): void {
    this._value = obj;
    this.onChange(this.value);
  }

  onOpened(e) {
    const me = this;
    const objPopSele = document.querySelector('.dx-selectbox-popup-wrapper .dx-overlay-content');
    if (objPopSele) {
      objPopSele.classList.add('amis-pop-combobox-normal');
    }
    me._isNotOpen = false;
    me._firstTime = false;
    if (me.isFilterServer) {
      me.isReloadData = true;
    }
    if (!me._firstTime) {
      // this.loadDataPaging();
    }

  }


  /**
 * Xử lý lúc khởi tạo
 * @param {any} e 
 * @memberof AmisControlComboboxComponent
 */
  onInitialized(e) {
    // e.component.registerKeyHandler("downArrow", function (ee) {
    //   if (!(e.component.option('opened'))) {
    //     e.component.open();
    //     ee.preventDefault();
    //   } else {
    //     return true;
    //   }
    // })
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
            me.dataSource = [];
            me.dataSource.push(me._value);
          }
        } else {
          if (!me._useDataSource) {
            const obj = new Object();
            me.dataSource = [];
            me.dataSource.push(me._value);
          }
        }
      }
    }
  }

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
    param = this.handleParam();
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
          } else {
            me.dataSource = [];
          }
        })
    }
  }

  /**
   * Xử lý tham số lấy dữ liệu
   * nmduy 11/09/2020
   */
  handleParam() {
    let param = null;
    if (this.inputParam) {
      const properties = Object.keys(this.inputParam);
      if (properties?.length) {
        properties.forEach(element => {
          if (element != "GroupConfigs") {
            if (element != "PageIndex" && element != "PageSize") {
              param[`${element}`] = this.inputParam[`${element}`]
            }
          }
        });
      }
    }


    return param;
  }


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
          params["Columns"] = `${me.displayExpr}`;
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
            filter.push(arr);
          }
          if (filter.length) {
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
                  }
                }

                return result.data;
              })
              .catch(error => {
                console.log(`Data Loading Error: ${error}`);
              });
          }
        },
        loadMode: 'processed'
      }),
      pageSize: 10
    });
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
}
