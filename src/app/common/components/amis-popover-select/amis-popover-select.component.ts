import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'amis-amis-popover-select',
  templateUrl: './amis-popover-select.component.html',
  styleUrls: ['./amis-popover-select.component.scss']
})
export class AmisPopoverSelectComponent implements OnInit {

  // Biến ẩn hiện Popover
  @Input() visiblePopover = false;

  // Danh sách hiển thị trong Popover
  @Input() listItem = [];

  // Key
  @Input() key = "";

  // Danh sách hiển thị trong Popover
  @Input() display = "";

  // Đối tượng được chọn
  @Input() selectedItem: any;

  // Sự kiện khi chọn item
  @Output() eventSelectItem = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }


  /**
   * Sự kiện chọn 1 item trong danh sách
   * @param {any} item
   * @memberof AmisPopoverSelectComponent
   * CREATED BY NMDUC - 21/04/2020
   */
  onSelectItem(item) {
    this.selectedItem = item;
    this.visiblePopover = false;
    this.eventSelectItem.emit(item);
  }
}
