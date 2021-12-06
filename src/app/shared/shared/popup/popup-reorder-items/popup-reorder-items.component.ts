import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { DxListComponent } from 'devextreme-angular';
import { BaseComponent } from 'src/common/components/base-component';


@Component({
  selector: 'amis-popup-reorder-items',
  templateUrl: './popup-reorder-items.component.html',
  styleUrls: ['./popup-reorder-items.component.scss']
})
export class PopupReorderItemsComponent extends BaseComponent implements OnInit {

  @Input() set items(value) {
    if (value?.length) {
      this.dataSource = value;
    }
  };

  @Input()
  visiblePopup: boolean = false;

  @Input()
  title: string = "";

  @Input()
  displayExpr: string = "";

  @Output()
  closePopup: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  afterSort: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild(DxListComponent, { static: false })
  list: DxListComponent;

  listHeight: number = 400;

  offsetY = "0 100px"; // vị trí hiển thị popup

  isLoading: boolean = true;

  dataSource = [];

  visiblePopover: boolean = false;
  // vị trí hiện tooltip
  tooltipTarget: any;
  //nội dung tooltip
  tooltipContent: string;

  lowestIndexChange: number = 0;

  constructor() {
    super();
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  ngOnInit(): void {
    this.resizeGrid();
    setTimeout(() => {
      this.isLoading = false;
    }, 300);
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
    this.lowestIndexChange = e.fromIndex > this.lowestIndexChange ? this.lowestIndexChange : e.fromIndex;
    this.lowestIndexChange = e.toIndex > this.lowestIndexChange ? this.lowestIndexChange : e.toIndex;
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
  }

  /**
   * hàm hiện tooltip
   * created by: hgvinh 22/06/2020
   * @param e 
   * @param item 
   */
  showToolTip(e, item) {
    if (e.clientWidth >= 150) {
      this.tooltipTarget = e.parentNode
      this.tooltipContent = item.Caption;
      this.visiblePopover = true;
    }
  }

  /**
   * Click thực hiện lưu
   * nmduy 17/07/2020
   */
  save() {
    this.visiblePopup = false;
    let maxSortOrder = this.dataSource[this.lowestIndexChange - 1]?.SortOrder ? this.dataSource[this.lowestIndexChange - 1]?.SortOrder : 0;
    for (let i = this.lowestIndexChange; i < this.dataSource.length; i++) {
      const element = this.dataSource[i];
      element.SortOrder = maxSortOrder + 1;
      maxSortOrder += 1;
    }
    const data = {
      LowestIndexChange: this.lowestIndexChange,
      DataSource: this.dataSource
    };
    this.afterSort.emit(data);
  }

  /**
   * đóng popup
   * nmduy 17/07/2020
   */
  onClosePopup() {
    this.visiblePopup = false;
    this.closePopup.emit();
  }

  /**
 * set chiều cao grid
 * Created by nmduy 19/05/2020
 */
  resizeGrid() {
    if (window.innerHeight < 768) {
      this.offsetY = "0 50px"
      this.listHeight = 250;
    }
  }

}
