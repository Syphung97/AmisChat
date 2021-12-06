import { Component, OnInit, Input, Output, EventEmitter, HostListener, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'amis-dropdown',
  templateUrl: './amis-dropdown.component.html',
  styleUrls: ['./amis-dropdown.component.scss']
})
export class AmisDropdownComponent implements OnInit {

  // Biến ẩn hiện Popover
  @Input() isShowDropdown = false;

  // Biến ẩn hiện Popover
  @Input() isNoWrap = false;

  // Danh sách hiển thị trong Popover
  @Input() listItem = [];

  // Key
  @Input() key = '';

  // trường hiện thị
  @Input() display = '';

  // Đối tượng được chọn
  @Input() selectedItem: any;

  // Sự kiện khi chọn item
  @Output() eventSelectItem = new EventEmitter<any>();

  @ViewChild('dropdown', {
    static: true
  })
  dropdowRef: ElementRef;

  @HostListener('document:click', ['$event'])
  clickout(event){
    if (this.dropdowRef.nativeElement.contains(event.target)){
      this.isShowDropdown = !this.isShowDropdown;
    }else{
      this.isShowDropdown = true;
    }
  }
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
    this.isShowDropdown = false;
    this.eventSelectItem.emit(item);
  }
}
