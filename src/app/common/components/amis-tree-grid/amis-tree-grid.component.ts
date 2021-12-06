import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ChangeDetectorRef
} from '@angular/core';
import { AmisTranslationService } from 'src/common/services/amis-translation.service';
import { DxDataGridComponent, DxTreeListComponent } from 'devextreme-angular';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { AmisCommonUtils } from 'src/common/fn/common-utils';
import { GridColumn } from 'src/common/models/common/grid-columns';
import { ButtonType } from 'src/app/shared/enum/common/button-type.enum';
import { ButtonColor } from 'src/app/shared/enum/common/button-color.enum';
import dxTreeList from 'devextreme/ui/tree_list';
import { DataType } from 'src/common/models/export/data-type.enum';
import { AmisListDragDropComponent } from '../amis-list-drag-drop/amis-list-drag-drop.component';
import { GroupConfigService } from 'src/app/services/group-config/group-config.service';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '../base-component';

// import { CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'amis-tree-grid',
  templateUrl: './amis-tree-grid.component.html',
  styleUrls: ['./amis-tree-grid.component.scss']
})
export class AmisTreeGridComponent extends BaseComponent implements OnInit {
  // Danh sách các cột trong grid
  columnGrids: GridColumn[] = [];

  // Enum loại Button
  buttonType = ButtonType;
  buttonColor = ButtonColor;
  dataType = DataType;

  listColumnsGridDefault = [];

  isCustomed = false;


  isLoadIsSystem = false;

  // Từ khóa tìm kiếm cột
  keyword = '';
  // trường khóa chính build cây
  @Input()
  keyID = '';
  // trường
  @Input()
  parentID = '';
  // danh sách cột mặc định
  @Input()
  defaultColumn = '';

  // SL bản ghi của 1 page
  @Input()
  pageSize = 5;
  // set disable
  @Input()
  isDisabled = false;

  @Input()
  isSelection = false;
  @Input()
  modeSelection = 'single';

  // SL bản ghi của 1 page
  @Input()
  dataSource;

  // hiển thị đường kẻ cột
  @Input()
  showColumnLines = false;

  // hiển thị đường kẻ dòng
  @Input()
  showRowLines = false;

  // hiển thị border
  @Input()
  showBorders = false;

  // cho phép xuống dòng
  @Input()
  columnAutoWidth = false;

  // show button điều hướng
  @Input()
  showNavigationButtons = true;

  @Input()
  allowColumnResizing = true;
  @Input()
  listIDExpanded = [];
  // show thông tin
  @Input()
  showInfo = true;

  // page size lựa chọn
  @Input()
  showPageSizeSelector = true;

  // show thông tin
  @Input()
  infoText = ''; // Hiển thị {0} trên {1} ({2} kết quả)

  @Input()
  rootValue = '00000000-0000-0000-0000-000000000000';
  // không có dữ liệu
  @Input()
  noDataText = 'Danh sách trống';
  customColumns = [];
  /**
   * Danh sách cột để xử lý
   */
  @Input()
  columns;

  /**
   * Ẩn hiện dấu option action đầu dòng hay không
   */
  @Input()
  isShowMoreOption = true;

  /**
   * Có cho phép chọn một nhiều hay không
   */
  @Input()
  isSingleSelection = false;

  /**
   * Có cho phép chọn một nhiều hay không
   */
  @Input()
  isShowSelection = true;

  @Input()
  contextMenuList = [];

  columnWidth = 0;

  itemDataHover: any;

  isContextMenuVisible = false;
  /**
   * Đối tượng hiện thị popover
   */
  popoverTarget: any;

  // Lưu chỉnh sửa cột hiển thị
  @Output()
  saveConfigColumn: EventEmitter<any> = new EventEmitter<any>();
  // Lưu chỉnh sửa cột hiển thị
  @Output()
  selectItem: EventEmitter<any> = new EventEmitter<any>();

  // Lưu chỉnh sửa cột hiển thị
  @Output()
  selectItemMenu: EventEmitter<any> = new EventEmitter<any>();

  // Hủy chỉnh sửa cột hiển thị
  @Output()
  cancel: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  clickViewMoreRow: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  outputColumns: EventEmitter<any> = new EventEmitter<any>();

  // Biến lưu id grid
  @ViewChild('tree', { static: false })
  tree: DxTreeListComponent;

  @ViewChild('myDrop', { static: false })
  myDrop: NgbDropdown;

  isShowDrop = false;

  @ViewChild('customColumn', { static: false })
  customColumn: AmisListDragDropComponent;

  selectedColumns = [];

  @Input()
  layoutGridType = '';

  constructor(
    private translateService: AmisTranslationService,
    public groupConfigSV: GroupConfigService,
    private ref: ChangeDetectorRef,
  ) {
    super();
  }

  ngOnInit() {
    this.selectedColumns = this.columns.filter(i => i.IsVisible === true);
    if (this.contextMenuList.length > 0 && this.contextMenuList.length <= 2) {
      if (this.contextMenuList.length > 1) {
        this.columnWidth += this.contextMenuList.length * 8;
      }

      this.contextMenuList.forEach((element, index) => {
        if (element.width) {
          this.columnWidth += element.width;
        } else {
          this.columnWidth += 16;
        }
      });
    }
  }

  /**
   * Click vào 1 dòng trên grid
   * Created by: dthieu 04-05-2020
   */
  onRowClick(e) {
    if (
      !e.event.target.className.includes('viewmore') &&
      !e.event.target.className.includes('dx-treelist-empty-space') &&
      !e.event.target.className.includes('icon-action')
    ) {
      this.selectItem.emit(e);
    }
  }

  /**
   * Double click row
   * Created by: dthieu 04-05-2020
   */
  onRowDblClick(e) {
    this.selectItem.emit(e);
  }
  /**
   * Click vào nút đầu dòng
   * Created by: dthieu 22-05-2020
   */
  clickContextMenu(e, item, param) {
    this.clickViewMoreRow.emit({
      Target: e,
      SelectedRow: param,
      ContextMenu: item
    });
  }

  /**
   * Hủy bỏ Tìm kiếm cột
   * Created by: dthieu 05-05-2020
   */
  cancelOptionColumn(e) {}

  /**
   * Lưu lại thông tin mở rộng cột trên grid
   * Created by: vbcong 05-05-2020
   */
  saveOptionColumn(e) {
    const tmpColumns = [];
    // this.customColumns.forEach(i => i.IsVisible = true);

    this.tree.columns = this.listColumnsGridDefault;

    const defaultColumns = [this.tree.columns[0]];
    defaultColumns.push(this.tree.columns[1]);

    // Sắp xếp lại thứ tự cột của menu chọn cột. Cột nào hiện lên trước, ẩn xuống sau
    const tmpShowColumn = this.customColumns.filter(
      el => el.IsVisible === true
    ); // Các cột hiện
    const tmpHideColumn = this.customColumns.filter(
      el => el.IsVisible === false
    ); // Các cột ẩn
    tmpColumns.push(...tmpShowColumn);
    tmpColumns.push(...tmpHideColumn);
    this.selectedColumns = AmisCommonUtils.cloneDataArray(tmpShowColumn);
    this.columns = AmisCommonUtils.cloneDataArray(this.customColumns);

    // Sắp xếp lại thứ tự cột trên tree, ăn theo thứ tự của menu chọn cột
    const tmpGridColumn = [];

    tmpGridColumn.push(...defaultColumns);

    const cloneGridColumn = AmisCommonUtils.cloneDataArray(this.tree.columns);
    if (tmpColumns && tmpColumns.length > 0) {
      tmpColumns.forEach(f => {
        const tmpField = cloneGridColumn.find(
          element => element.dataField === f.FieldName
        );
        if (tmpField) {
          tmpGridColumn.push(tmpField);
        }
      });
    }
    this.tree.columns = tmpGridColumn;
    tmpColumns.forEach(f => {
      this.tree.instance.columnOption(f.FieldName, 'visible', f.IsVisible);
    });

    this.customColumns = AmisCommonUtils.cloneDataArray(tmpColumns);

    this.saveConfigColumn.emit(tmpColumns);

    this.customColumn.sortOrderColumn(this.customColumns, this.selectedColumns);
    // đóng form tùy chỉnh
    this.myDrop.close();
    this.isShowDrop = false;
    this.keyword = '';
    this.isCustomed = false;
  }

  changed() {}

  selectedRowKeysChange(e) {}

  search() {}

  setDefaultSettingColumn(e) {
    const me = this;
    const typeConfig = this.layoutGridType;
    me.isLoadIsSystem = true;
    this.groupConfigSV
      .getGridColumsConfig(typeConfig, true)
      .pipe(takeUntil(this._onDestroySub))
      .subscribe(
        res => {
          if (res && res.Success && res.Data) {
            this.outputColumns.emit(res.Data.GridFieldConfigs);
            me.customColumn.items = res.Data.GridFieldConfigs;
            me.customColumn.selectedItems = res.Data.GridFieldConfigs.filter(
              o => o.IsVisible
            );
            me.customColumn.sortOrderColumn(
              me.customColumn.items,
              me.customColumn.selectedItems
            );
            // me.selectedColumns = me.customColumn.selectedItems;
            me.ref.detectChanges();
          }
        },
        error => {}
      );
  }
  /**
   * Dữ liệu bắn ra khi check box chọn cột trên tùy chỉnh cột
   * Created by: vbcong 27-05-2020
   */
  customSettingColumn(e) {
    if (
      this.listColumnsGridDefault &&
      this.listColumnsGridDefault.length === 0
    ) {
      this.listColumnsGridDefault = this.tree.columns;
    }
    this.customColumns = e;
    this.isCustomed = true;
  }

  renderDefaultColumn(e) {}

  allowColumnReorderingChange(e) {
    console.log(e);
  }

  closeCustomColumn(e) {
    this.myDrop.close();
    this.keyword = '';
    this.isShowDrop = false;
  }
  /**
   * hàm show control contextMenu
   * @param {any} e
   * @memberof AmisTreeGridComponent
   */
  onShowContextMenu(e, param) {
    this.itemDataHover = param.data;
    this.isContextMenuVisible = false;
    const element = e.target;
    this.popoverTarget = element.parentElement;
    this.isContextMenuVisible = true;
    this.selectItemMenu.emit(this.itemDataHover);
  }
  /**
   * Sự kiện click ra ngoài dropdown
   * Created by: dthieu 06-06-2020
   */
  toggle(e){
    if (!e) {
      this.isShowDrop = false;
    }else{
      this.isShowDrop = true;
    }
  }
}
