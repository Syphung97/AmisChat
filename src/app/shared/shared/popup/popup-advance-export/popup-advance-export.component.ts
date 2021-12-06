import { Component, OnInit, Output, EventEmitter, Input, ViewChild, SimpleChanges } from '@angular/core';
import { AmisStringUtils } from 'src/common/fn/string-utils';
import { AmisCommonUtils } from 'src/common/fn/common-utils';
import { DxListComponent } from 'devextreme-angular';
import { ButtonType } from '../../enum/common/button-type.enum';
import { ButtonColor } from '../../enum/common/button-color.enum';
import { FileTypeEnum } from 'src/common/models/export/file-type.enum';

@Component({
  selector: 'amis-popup-advance-export',
  templateUrl: './popup-advance-export.component.html',
  styleUrls: ['./popup-advance-export.component.scss']
})
export class PopupAdvanceExportComponent implements OnInit {

  @Input()
  visiblePopup = false;
  title = 'Xuất khẩu nâng cao';

  // Output hủy
  @Output()
  outputCancel: EventEmitter<any> = new EventEmitter<any>();

  @Input()
  items = [];

  @Input()
  selectedItems = [];

  @Input()
  scrollBottom = 'scrollBottom';

  @Input()
  isReordering: boolean;

  @Input()
  isMax: boolean = false;

  @Output()
  afterExport: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild(DxListComponent, { static: false })
  list: DxListComponent;

  selectionModeValue = 'multiple';

  listSelectedItems = [];

  checkExcel = true;

  offsetY = "0 100px";
  height = 610;
  noDataText: 'Không tìm thấy dữ liệu';

  buttonType = ButtonType;
  buttonColor = ButtonColor;

  visiblePopover: boolean = false;
  // vị trí hiện tooltip
  tooltipTarget: any;
  //nội dung tooltip
  tooltipContent: string;
  cloneItems = [];
  // biến xác định có phải load dữ liệu từ mặc định không
  _isLoadIsSystem: boolean = false;

  chooseTotal = false;
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
    this.resizeGrid();
    this.setPosition()
    if (this.items.length > 0) {
      this.items.forEach(item => {
        item.CaptionSearch = AmisStringUtils.convertVNtoENToLower(item.Caption);
      });
      this.sortOrderColumn(this.items, this.selectedItems);
    }
    if (this.selectedItems?.length == this.items?.length) {
      this.chooseTotal = true;
    }
    this.listSelectedItems = AmisCommonUtils.cloneDataArray(this.selectedItems);
  }


  /**
   * Set lại vị trí popup
   *
   * @memberof PopupAdvanceExportComponent
   * created: PTSY 7/8/2020
   */
  setPosition() {
    if(window.innerHeight < 800) {
      this.offsetY = '0 50'
    }
    else {
      this.offsetY = '0 100'
    }
  }

  // ngOnChanges(changes: SimpleChanges) {
  //   this.sortOrderColumn(this.items, this.selectedItems);
  // }
  /**
   * Sắp xếp lại thứ tự hiển thị trên grid
   * Created by ltanh1 24/06/2020
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
    this.cloneItems = AmisCommonUtils.cloneDataArray(e.fromData);

  }

  selectItem(key) {
    const selectedKeys = this.list.instance.option('selectedItemKeys');
    this.listSelectedItems = AmisCommonUtils.cloneDataArray(selectedKeys);

    if (selectedKeys?.length == this.cloneItems?.length) {
      this.chooseTotal = true;
    } else {
      this.chooseTotal = false;
    }
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
  }


  /**
   * hàm lòa focus vào tìm kiếm
   * Created by ltanh1 24/06/2020
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
   * Created by ltanh1 24/06/2020
   * @param e
   * @param item
   */
  showToolTip(e, item) {
    if (e.target.clientWidth >= 150) {
      this.tooltipTarget = e.target;
      this.tooltipContent = item.Caption;
      this.visiblePopover = true;
    }
  }

  /**
   * Xử lý đóng popup
   * Created by ltanh1 26/05/2020
   */
  cancel() {
    this.outputCancel.emit(false);
  }

  /**
   * đóng popup
   * Created by ltanh1 26/05/2020
   */
  closePopup() {
    this.cancel();
  }

  /**
   * Xuất khẩu
   * Created by ltanh1 24/06/2020
   */
  save() {
    const param = {
      isExcel: this.checkExcel,
      selectData: this.cloneItems.filter(item => item.IsVisible)
    };
    this.afterExport.emit(param);
    this.closePopup();
  }

  /**
   * Hàm xử lý chuyển loại xuất khẩu
   * Created by ltanh1 25/06/2020
   */
  changeTypeExport(type) {
    if (type === FileTypeEnum.Excel) {
      this.checkExcel = true;
    } else {
      this.checkExcel = false;
    }
  }

  /**
   * Hàm xử lý click vào ô check box chọn tất cả cột
   * Created by ltanh1 30/06/2020
   */
  chooseTotalEvent() {
    if (this.chooseTotal) {
      this.chooseTotal = false;
      this.list.instance.unselectAll();
    } else {
      this.chooseTotal = true;
      this.list.instance.selectAll();
    }
  }

  /**
* set chiều cao grid
* Created by nmduy 19/05/2020
*/
  resizeGrid() {
    if (window.innerHeight < 768) {
      this.offsetY = "0 50px"
      this.height = 515;
    }
  }
}
