import { Component, OnInit, forwardRef, Input, Output, ElementRef, ViewChild, EventEmitter, HostListener, Injector, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { BaseControl } from '../base-control';
import { AmisDataService } from 'src/common/services/amis-data.service';
import { PopupSelectData } from 'src/app/shared/enum/popup-select-data/popup-select-data';
import { takeUntil } from 'rxjs/operators';
import { AmisCommonUtils } from 'src/common/fn/common-utils';
import { AmisTransferDataService } from 'src/common/services/amis-transfer-data.service';
import { AmisTranslationService } from 'src/common/services/amis-translation.service';
import { AmisStringUtils } from 'src/common/fn/string-utils';
import { DxTreeViewComponent } from 'devextreme-angular';
import { SelfServiceStatus } from 'src/app/shared/enum/self-service-status/self-service-status.enum';

@Component({
  selector: 'amis-amis-control-treeboxtag',
  templateUrl: './amis-control-treeboxtag.component.html',
  styleUrls: ['./amis-control-treeboxtag.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AmisControlTreeBoxTagComponent),
      multi: true
    }
  ],
})
export class AmisControlTreeBoxTagComponent extends BaseControl implements OnInit, ControlValueAccessor {

  @ViewChild('popupSelectData', { read: ViewContainerRef }) popupSelectData: ViewContainerRef;


  @ViewChild('treeview', { static: false })
  treeview: DxTreeViewComponent;

  @ViewChild('input')
  input: ElementRef;

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
  // max width của pop mở cơ cấu.
  @Input()
  maxWidthPop = '392px';

  searchArray: any;

  treeBoxValueOrga: string[];

  _isNotOpen = true;
  _isLoaded = false;
  _firstTime: boolean = true;
  _tempSearchValue = "";
  _isReloadData: boolean = false;

  isOpenTree = false;
  selectionMode = 'multiple';
  checkBoxMode = 'normal';

  compFactory: any;
  selectedItem = [];

  @ViewChild('control', {
    static: true
  })
  controlTree: ElementRef;

  @ViewChild('treetag', {
    static: true
  })
  treetagRef: ElementRef;

  // Vị trí popover
  positionOver = { 'at': 'top left', 'my': 'bottom left', 'offset': '0 10' };

  targetTree: any;
  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (!event.target.classList.contains('dx-checkbox-icon')
      && !this.treeview?.instance.element().contains(event.target)) {
      if (this.treetagRef?.nativeElement.contains(event.target)) {
        this.isOpenTree = !this.isOpenTree;
      } else {
        this.isOpenTree = false;
      }
    }
  }

  // đang focus hay không
  isFocus = false;

  constructor(
    public httpBase: AmisDataService,
    public amisTransferDataService: AmisTransferDataService,
    public amisTranslateSV: AmisTranslationService,
    private changeDetect: ChangeDetectorRef,
    private readonly injector: Injector,
  ) {
    super(amisTransferDataService, amisTranslateSV);
  }

  ngOnInit(): void {
    this.treeBoxValueOrga = [];
    this.searchArray = [
      this.displayExpr,
      "ValueSearch"
    ];
    this.value = this.treeBoxValueOrga.join(';');
  }

  writeValue(obj: any): void {
    this._value = obj;
    this.onChange(this.value);
    if (this._isReloadData) {
      this.valueChanged.emit(this._value);
    }
    this.initComboTree();
  }
  /**
   * show pop tree
   *
   * @memberof AmisControlTreeBoxTagComponent
   */
  showPopTree(e) {
    if (e?.target) {
      if (!e.target.classList.contains('icon-close-small')) {
        // this.isOpenTree = !this.isOpenTree;
      }
    }
    if (this._isNotOpen) {
      this.onOpened();
    }
    this.input?.nativeElement?.focus();
  }

  onOpened() {
    const me = this;
    me._isNotOpen = false;
    me._firstTime = false;
    if (!me._firstTime) {
      me.initComboTree();
    }
  }

  /**
   * xóa trên phần tag
   *
   * @param {any} item
   * @memberof AmisControlTreeBoxTagComponent
   */
  removeItemSelect(item) {
    if (item) {
      AmisCommonUtils.RemoveItem(this.selectedItem, item);
      if (!!item.OrganizationUnitID) {
        AmisCommonUtils.RemoveItem(this.treeBoxValueOrga, item.OrganizationUnitID);
      }
    }
    this.treeview.instance.unselectItem(item);
  }
  /**
   * hàm đồng bộ giữa tag và tree
   *
   * @memberof AmisControlTreeBoxTagComponent
   * vbcong 30/06/2020
   */
  syncTreetag() {
    if (this._value) {
      const listID = this._value.split(';');
      this.treeBoxValueOrga = listID;
    }
    this.treeview.instance.unselectAll();
    if (this.treeBoxValueOrga) {
      this.treeBoxValueOrga.forEach(ite => {
        this.treeview.instance.selectItem(ite);
      });
    }
  }
  /**
   * Thay đổi giá trị input
   * created by vbcong - 07/03/2020
   */
  onValueChanged(e?) {
    const nodes = e.component.getNodes();
    this.selectedItem = this.getSelectedItemsKeys(nodes);

    const me = this;
    let dataBinding = null;
    let listDisValueOrga = [];
    if (this.selectedItem) {
      this.treeBoxValueOrga = this.selectedItem.map(p => p.OrganizationUnitID);
      listDisValueOrga = this.selectedItem.map(p => p.OrganizationUnitName);
      dataBinding = AmisCommonUtils.cloneData(this.selectedItem);
      me.displayValue = listDisValueOrga.join('; ');
      me.value = this.treeBoxValueOrga.join(';');
      me.displayValueChange.emit(me.displayValue);
    }
    if (me._isLoaded) {
      if (this.listFieldChanged?.length) {
        this.listFieldChanged.forEach(e => {
          if (e.IsUseNotFieldSetValue) {
            // to do
          } else {
            e.Value = dataBinding ? this.treeBoxValueOrga.join(';') : null;
            e.ValueText = listDisValueOrga.length > 0 ? listDisValueOrga.join('; ') : null;
          }
        });
        this.valueChangedWithFieldAndValue.emit(this.listFieldChanged);
      }
      super.onValueChanged(this._value);
    }
    this.changeDetect.detectChanges();
  }

  /**
  * Hàm lấy ra danh sách các item dc chọn
  * @memberof PopupAddApplicationComponent
  * created by vbcong - 21/02/2020
  */
  getSelectedItemsKeys(items) {
    let result = [];
    const me = this;
    items.forEach(item => {
      if (item.selected) {
        result.push(item.itemData);
      }
      if (item.items.length > 0 && !item.selected) {
        result = result.concat(me.getSelectedItemsKeys(item.items));
      }
    });
    return result;
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
        if (!me.dataSource?.length) {
          if (me._value && me.displayValue) {
            const listID = me._value.split(';');
            // this.treeBoxValueOrga = listID;
            const listName = me.displayValue.split(';');
            me.dataSource = [];
            me.selectedItem = [];
            if (listID.length > 0 && listName.length > 0) {
              for (let index = 0; index < listID.length; index++) {
                const obj = new Object();
                obj[`${me.valueExpr}`] = listID[index];
                obj[`${me.displayExpr}`] = listName[index].trim();
                me.dataSource.push(obj);
                me.selectedItem.push(obj);
              }
            }

          }
        } else {
          me._useDataSource = true;
          me._firstTime = false;
        }
      } else {
        if (me.isRemoteServer) {
          me.loadDataByURL();
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
    if (me.inputParam) {
      param = me.inputParam;
    }
    if (!me._isLoaded || !me.dataSource?.length || me._isReloadData) {

      me.httpBase
        .getDataByURL(me.url, me.controller, param, true, false, this.isGetMethod)
        .subscribe(data => {
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
          setTimeout(() => {
            this.syncTreetag();
          }, 100);
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
    if (customConfig?.PopupWidth) me.popupWidth = customConfig.PopupWidth;
    if (customConfig?.ModelController) me.modelController = customConfig.ModelController;
    if (customConfig?.LayoutConfig) this.layoutConfig = customConfig.LayoutConfig;
    if (customConfig?.GroupConfig) this.groupConfig = customConfig.GroupConfig;
    if (customConfig?.MaxWidthPop) this.maxWidthPop = customConfig.MaxWidthPop;

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
  /**
  * Thiết lập data hiển thị cho cây cơ cấu tổ chức
  * vbcong - 21/02/2020
  */
  dataBoundTreeView(e) {
    const treeView = e.component;
    if (this.controlTree?.nativeElement) {
      const objTreeTag = this.controlTree.nativeElement.querySelector('.tree-tag-element');
      if (!!objTreeTag) {
        this.treetagRef = new ElementRef(objTreeTag);
        this.targetTree = this.treetagRef.nativeElement;
        this.changeDetect.detectChanges();
      }
    }
    const dataSource = treeView.getDataSource();
    if (dataSource && dataSource.items().length > 0) {
      const listSouceOrg = dataSource.items();
      const root = listSouceOrg.filter(item => item.ParentID === '00000000-0000-0000-0000-000000000000');
      if (root.length > 0) {
        treeView.expandItem(root);
      }
      // Lấy danh sách id tổ chức được chọn trên tab box
      const organizationUnitIDs = this.treeBoxValueOrga;
      if (organizationUnitIDs && organizationUnitIDs.length) {
        // khác rỗng thì for để chọn dừng id trên treeview
        organizationUnitIDs.forEach(id => {
          const itemSelectOrga = listSouceOrg.filter(et => {
            return et.OrganizationUnitID === id;
          });
          if (itemSelectOrga != null && itemSelectOrga.length > 0) {
            treeView.selectItem(itemSelectOrga);
          }
        });
      } else {
        // k có phòng ban nào đc chọn thì bỏ chọn tất cả
        treeView.unselectAll();
      }
    }
  }

  /**
   * bắt sk keydown
   * dtnam1 25/8/2020
   */
  onKeyDownFn(e) {
    if (e.keyCode == 9) {
      this.isOpenTree = false;
    }
    this.onKeyDown.emit(e);
  }
}
