import { Component, OnInit, forwardRef, Input, Output, ElementRef, ViewChild, EventEmitter, Injector, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { BaseControl } from '../base-control';
import CustomStore from 'devextreme/data/custom_store';
import { AmisDataService } from 'src/common/services/amis-data.service';
import { PopupSelectData } from 'src/app/shared/enum/popup-select-data/popup-select-data';
import { takeUntil } from 'rxjs/operators';
import { AmisCommonUtils } from 'src/common/fn/common-utils';
import { AmisTransferDataService } from 'src/common/services/amis-transfer-data.service';
import { AmisTranslationService } from 'src/common/services/amis-translation.service';
import { AmisStringUtils } from 'src/common/fn/string-utils';
import { DxDropDownBoxComponent } from 'devextreme-angular';
import { SelfServiceStatus } from 'src/app/shared/enum/self-service-status/self-service-status.enum';

@Component({
  selector: 'amis-amis-control-treebox',
  templateUrl: './amis-control-treebox.component.html',
  styleUrls: ['./amis-control-treebox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AmisControlTreeBoxComponent),
      multi: true
    }
  ],
})
export class AmisControlTreeBoxComponent extends BaseControl implements OnInit, ControlValueAccessor {

  @ViewChild('popupSelectData', { read: ViewContainerRef }) popupSelectData: ViewContainerRef;

  @ViewChild('dropdown', { static: false })
  dropdown: DxDropDownBoxComponent;
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
  groupFieldConfigs: any; // thông tin cấu hình tên cột, trường dữ liệu để map với dữ liệu trả về khi bật popup, thêm dữ liệu
  @Input()
  groupConfig: any; // thông tin cấu hình tên cột, trường dữ liệu để map với dữ liệu trả về khi bật popup, thêm dữ liệu

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

  @Input() isShowCustomMore: boolean = true;

  @Input() isModifiable: boolean = false;

  @Input() layoutConfig: any;

  searchArray: any;

  treeBoxValueOrga: string[];

  _isNotOpen = true;
  _isLoaded = false;
  _firstTime: boolean = true;
  _tempSearchValue = "";
  _isReloadData: boolean = false;


  IsCustomReloadValue = false;

  selectionMode = 'single';
  checkBoxMode = 'none';

  compFactory: any;
  selectedItem: any

  loadingVisible: boolean = false; // hiển thị loading

  loadingPosition: any; // vị trí hiển thị loading

  targetID: string = ""; // id gen để hiển thị loading

  constructor(
    public httpBase: AmisDataService,
    public amisTransferDataService: AmisTransferDataService,
    public amisTranslateSV: AmisTranslationService,
    private readonly injector: Injector,
    private cdr: ChangeDetectorRef
  ) {
    super(amisTransferDataService, amisTranslateSV);
  }

  ngOnInit(): void {
    this.treeBoxValueOrga = [];
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
    this.initComboTree();
  }

  onOpened(e) {
    if (!this.targetID) {
      this.getLoadingTargetID();
    }
    const me = this;
    const popTree = document.querySelector('.dx-overlay-wrapper.dx-dropdowneditor-overlay.dx-popup-wrapper .dx-overlay-content.dx-popup-normal');
    if (popTree) {
      popTree.classList.add('pop-select-tree-box');
      const searchPopTree: HTMLInputElement = popTree.querySelector('.dx-treeview-search input.dx-texteditor-input');
      if (searchPopTree) {
        searchPopTree.focus();
      }
    }
    me._isNotOpen = false;
    me._firstTime = false;
    if (!me._firstTime) {
      me.initComboTree();
    }
  }
  /**
   * sự kiện click chọn một bản ghi
   *
   * @param {any} e
   * @memberof AmisControlComboboxComponent
   */
  selectItem(e) {
    this.dropdown.instance.close();
    this.treeBoxValueOrga = e.itemData[this.valueExpr];
    this.displayValue = e.itemData[this.displayExpr];
    this.value = this.treeBoxValueOrga;
    this.data.Value = this.value;
    this.data.ValueText = this.displayValue;
    this.onItemClick.emit(e);
  }
  /**
   * load xong tree
   *
   * @param {any} e
   * @memberof AmisControlTreeBoxComponent
   */
  readyTreeBox(e) {
    const popTree = document.querySelector('.dx-dropdowneditor-overlay .dx-overlay-content.pop-select-tree-box');
    if (popTree) {
      const searchPopTree: HTMLInputElement = popTree.querySelector('.dx-treeview-search input.dx-texteditor-input');
      searchPopTree.focus();
    }
  }
  /**
   * hàm thay đổi giá trị tìm kiếm
   *
   * @param {any} e
   * @memberof AmisControlTreeBoxComponent
   */
  changedValueSearch(e) {
    e.component._getOptionValue().value = e.component._getOptionValue().value.trim();
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
      const data = me.dataSource?.find(e => e[`${me.valueExpr}`] === me._value)
      if (data) {
        dataBinding = AmisCommonUtils.cloneData(data);
        me.displayValue = data[me.displayExpr];
        me.displayValueChange.emit(me.displayValue);
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
        });
        this.valueChangedWithFieldAndValue.emit(this.listFieldChanged);
      }
      super.onValueChanged(this._value);
      this.cdr.detectChanges();
    }
  }
  /**
   * remove đổi giá trị combo
   *
   * @param {any} e
   * @memberof AmisControlTreeBoxComponent
   */
  removeOrgaSelect(e) {
    if (!e.value) {
      this._value = null;
      super.onValueChanged(this._value);
    }
  }

  /**
   *
   * @memberof AmisControlComboboxComponent
   * created by vbcong - 11/05/2020
   */
  initComboTree() {
    const me = this;
    if ((!me._isLoaded || !me.dataSource?.length || me._isReloadData) && !me._useDataSource) {
      if (me._firstTime) {
        if (!me.dataSource?.length || me.IsCustomReloadValue) {
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
      } else {
        if (me.isRemoteServer) {
          if (me.isUseFns) {
            me.dataSource = new CustomStore({
              load: me.buildCallAPI,
              byKey: function (key) {
                return { id: key[me.valueExpr] };
              }
            });
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
    if (me.inputParam) {
      param = me.inputParam;
    }
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
                e["ValueSearch"] = AmisStringUtils.convertVNtoENToLower(e[me.displayExpr]);
              })
            }
          } else {
            me.dataSource = [];
          }
          me.dataSource = this.buildTreeDataListOrganizaiton(me.dataSource);
          // me._tempSearchValue = loadOptions["searchValue"];

        });
    }

  }
  /**
   * hàm build danh sách dữ liệu sử dụng cho cây cơ cấu tổ chức
   * @param {any} data
   * @memberof RecruitmentListComponent
   * vbcong 27/02/2020
   */
  buildTreeDataListOrganizaiton(listData) {
    if (listData && listData.length > 0) {
      const listAllParent = this.findAllParent(listData);
      if (listAllParent && listAllParent.length > 0) {
        const parentID = listAllParent[0].OrganizationUnitID;
        this.treeBoxValueOrga.push(parentID);
        listAllParent.forEach(el => {
          const temp = listData.find(x => x.MISACode === el.MISACode);
          if (temp) {
            temp.ParentID = null;
          }
        });
      }
    }
    return listData;
  }
  /**
   * Tìm tất cả các node tổng
   * vbcong 05/05/2020
   * @param listData : misaCode của đơn vị bất kỳ
   */
  findAllParent(listData) {
    const listParent = [];
    listData.forEach(item => {
      if (item.MISACode && item.MISACode.length > 8) {
        const listCode = item.MISACode.split('/');
        listCode.splice(listCode.length - 2, 1);
        const miCoParent = listCode.join('/');
        const itemPar = listData.find(x => x.MISACode === miCoParent);
        if (!itemPar) {
          item.IsExpanded = true;
          listParent.push(item);
        }
      } else {
        item.IsExpanded = true;
        listParent.push(item);
      }
    });
    return listParent;
  }

  /**
 * lấy thông tin cấu hình của trường dữ liệu
 * vbcong 18/05/2020
 */
  setCustomConfigInField(customConfig) {
    const me = this;

    if (customConfig?.Icon) me.iconMore = customConfig.Icon; // icon hiển thị bên cạnh click để hiển thị popup
    if (customConfig?.IsDynamicCombobox) me.isDynamicCombobox = true;
    if (customConfig?.PopupType) me.popupType = customConfig.PopupType;
    if (customConfig?.IsModifiable) me.isModifiable = true;
    if (customConfig?.IsCustomReloadValue) me.IsCustomReloadValue = customConfig.IsCustomReloadValue;
    if (customConfig?.PopupWidth) me.popupWidth = customConfig.PopupWidth;
    if (customConfig?.ModelController) me.modelController = customConfig.ModelController;
    if (customConfig?.LayoutConfig) this.layoutConfig = customConfig.LayoutConfig;
    if (customConfig?.GroupConfig) this.groupConfig = customConfig.GroupConfig;

  }

  /**
* Load popup theo kiểu truyền vào
* @param {TypeView} type
* creaed by nmduy
*/
  async loadPopupByType() {
    this.popupSelectData.clear();
    const { instance: componentInstance } = this.popupSelectData.createComponent(this.compFactory, undefined, this.injector);
    this.initPopup(componentInstance);
  }

  /**
   * Khởi tạo thông tin popup
   * nmduy 18/05/2020
   */
  async initPopup(componentInstance) {
    componentInstance.inSelectedRecord = []; // các bản ghi đã được chọn
    componentInstance.url = this.url;
    componentInstance.isGetMethod = this.isGetMethod;
    componentInstance.controller = this.controller;
    componentInstance.labelText = this.labelText;
    if (this.inputParam) componentInstance.inputParam = this.inputParam;
    if (this.layoutConfig) componentInstance.layoutConfig = this.layoutConfig
    if (this.groupConfig) componentInstance.groupConfig = this.groupConfig; // thông tin cột, các trường dữ liệu map với dữ liệu trả về
    componentInstance.isModifiable = this.isModifiable; // trường dữ liệu có cho phép thêm sửa xóa không
    componentInstance.valueExpr = this.valueExpr;
    componentInstance.displayExpr = this.displayExpr;
    componentInstance.inSelectedRecords = this.selectedItem;
    componentInstance.popupWidth = this.popupWidth;
    componentInstance.modelController = this.modelController ? this.modelController : "PickList";
    componentInstance.isSingleSelection = true; // là kiểu chọn một hay chọn nhiều
    componentInstance.visiblePopup = true;
    componentInstance.outSelectedRecord.pipe(takeUntil(componentInstance._onDestroySub)).subscribe(this.onSelectData.bind(this));
    componentInstance.closePopup.pipe(takeUntil(componentInstance._onDestroySub)).subscribe(this.onClosePopup.bind(this));
  }

  /**
   * Sự kiện đóng popup
   */
  onClosePopup(isReload) {
    this.isReloadData = isReload;
  }

  /**
   * Xử lý dữ liệu bắn ra từ popup
   * nmduy 18/05/2020
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

  /**
   * sinh id cho đối tượng sổ xuống để hiển thị loading
   * nmduy 12/08/2020
   */
  getLoadingTargetID() {
    if (this._fieldName) {
      this.targetID = `treebox-dropdown-${this._fieldName}`;
    } else {
      this.targetID = `treebox-dropdown-${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}`;
    }
    this.loadingPosition = {
      at: "left bottom",
      my: "left top",
      of: `#${this.targetID}`
    }
  }

}
