import {
  Component,
  OnInit,
  OnChanges,
  Input,
  ViewChild,
  EventEmitter,
  Output,
  SimpleChanges
} from '@angular/core';
import { DxListComponent } from 'devextreme-angular';
import { AmisCommonUtils } from 'src/common/fn/common-utils';
import { AmisStringUtils } from 'src/common/fn/string-utils';

@Component({
  selector: 'amis-list-drag-drop',
  templateUrl: './amis-list-drag-drop.component.html',
  styleUrls: ['./amis-list-drag-drop.component.scss']
})
export class AmisListDragDropComponent implements OnInit {
  @Input()
  items = [];

  @Input()
  selectedItems = [];

  @Input()
  scrollBottom = 'scrollBottom';

  @Input()
  showSelectionControls = true;

  @Input()
  isReordering: boolean;

  @Input()
  isMax: boolean = false;
  @Output()
  saveCustomColumn: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild(DxListComponent, { static: false })
  list: DxListComponent;

  selectionModeValue = 'multiple';

  noDataText: 'Không tìm thấy dữ liệu';

  visiblePopover: boolean = false;
  // vị trí hiện tooltip
  tooltipTarget: any;
  //nội dung tooltip
  tooltipContent: string;
  cloneItems = [];
  // biến xác định có phải load dữ liệu từ mặc định không
  _isLoadIsSystem: boolean = false;
  @Input()
  get isLoadIsSystem() {
    return this._isLoadIsSystem;
  }
  set isLoadIsSystem(val) {
    this._isLoadIsSystem = val;
  }

  constructor() {
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  ngOnInit(): void {
    if (this.items.length > 0) {
      this.items.forEach(item => {
        item.CaptionSearch = AmisStringUtils.convertVNtoENToLower(item.Caption);
      });
      this.sortOrderColumn(this.items, this.selectedItems);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.sortOrderColumn(this.items, this.selectedItems);
  }
  /**
   * Sắp xếp lại thứ tự hiển thị trên grid
   * Created by: dthieu 13-05-2020
   */
  sortOrderColumn(columns, selectedItems) {
    const me = this;
    me.cloneItems = [];
    // Sắp xếp lại thứ tự cột của menu chọn cột. Cột nào hiện lên trước, ẩn xuống sau
    const tmpColumns = [];
    const hidenColumns = columns.filter(
      item =>
        selectedItems.filter(a => a.FieldName === item.FieldName).length === 0
    );
    tmpColumns.push(...selectedItems);
    tmpColumns.push(...hidenColumns);
    me.items = tmpColumns;
    me.cloneItems = AmisCommonUtils.cloneDataArray(me.items);
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
  onDragEnd(e) {
    let gap = e.fromIndex - e.toIndex;
    let data = e.fromData[e.fromIndex];
    let i = 0;
    if (gap < 0) {
      gap = gap * -1;
      while (i !== gap) {
        e.fromData[e.fromIndex + i] = e.fromData[e.fromIndex + i + 1];
        i++;
      }
    } else if (gap > 0) {
      while (i !== gap) {
        e.fromData[e.fromIndex - i] = e.fromData[e.fromIndex - i - 1];
        i++;
      }
    }
    e.fromData[e.toIndex] = data;
    const selectData = e.fromData.filter(p => p.IsVisible);
    const hiddeData = e.fromData.filter(p => !p.IsVisible);

    const dataReturn = [];
    dataReturn.push(...selectData);
    dataReturn.push(...hiddeData);
    let sortForm = 0;
    dataReturn.forEach(item => {
      item.SortOrder = sortForm;
      sortForm += 1;
    });
    this.saveCustomColumn.emit(dataReturn);
  }

  selectItem(key) {
    const selectedKeys = this.list.instance.option('selectedItemKeys');
    // const k = this.selectedItems.filter(r => !selectedKeys.includes(r));
    this.cloneItems.forEach(item => {
      if (!this._isLoadIsSystem) {
        const exitsItem = selectedKeys.filter(
          u => u.FieldName === item.FieldName
        );
        if (exitsItem.length > 0) {
          item.IsVisible = true;
        } else {
          item.IsVisible = false;
        }
      }
    });

    this.saveCustomColumn.emit(this.cloneItems);
  }
  /**
   * hàm lòa focus vào tìm kiếm
   *
   * @param {any} e
   * @memberof AmisListDragDropComponent
   */
  readySearchList(e) {
    setTimeout(() => {
      e.component._searchEditor.focus();
    }, 100);
  }


  /**
   * hàm hiện tooltip
   * created by: hgvinh 22/06/2020
   * @param e 
   * @param item 
   */
  showToolTip(e, item) {
    if (e.clientWidth >= 150) {
      console.log(e)
      this.tooltipTarget = e.parentNode
      this.tooltipContent = item.Caption;
      this.visiblePopover = true;
    }
  }
}
