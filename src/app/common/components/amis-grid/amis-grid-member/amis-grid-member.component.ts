import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';

@Component({
  selector: 'amis-grid-member',
  templateUrl: './amis-grid-member.component.html',
  styleUrls: ['./amis-grid-member.component.scss']
})
export class AmisGridMemberComponent implements OnInit {
  //Data truyền vào grid
  @Input() dataSource; 

  //Truyền vào dataField mong muốn hiển thị tại grid (bao gồm tên field, độ rộng, caption)
  @Input() dataField;

  //Kẻ border theo cột
  @Input() showColumnLines: boolean = false;

  //Kẻ border theo dòng
  @Input() showRowLines: boolean = false;

  //Trạng thái hiển thị scrollbar trong grid (có mãi mãi hay không)
  @Input() showScollbar: boolean = false;

  //Có cho background của bản ghi lẻ hay không?
  @Input() isDisplayBackGroundOdd: boolean = false;

  //Có sự kiện ô checkbox để lựa chọn hay không?
  @Input() isSelectionMode: boolean = false;

  //Tổng số bản ghi để truyền vào paging:
  @Input() totalRecord: number = 0;

  //Truyền vào trang hiện tại
  @Input() currentPageIndex = 1;

  //Truyền vào số lượng bản ghi trong 1 trang
  @Input() currentPageSize = 8;


  //Số lượng bản ghi được chọn trong ô checkbox: 
  countSelected = 0;

  //Data đang được chọn ở ô checkbox
  selectedList = [];

  //Gọi lại service khi paging:
  @Output() callServiceEmitter = new EventEmitter();

  //ViewChild của grid
  @ViewChild("grid", { static: false })
  grid: DxDataGridComponent;

  //Đã clear bỏ chọn hay không? (nếu isSelectionMode = true)
  isClearSelect: boolean = false;

  timeOutPaging: any; //(nếu isSelectionMode = true)

  ngOnInit() {
  }
  constructor() { }

  onPagingChanged(e) {
    if (e) {
      this.isClearSelect = true;
      this.currentPageIndex = e.PAGE_INDEX;
      this.currentPageSize = e.PAGE_SIZE;
      if (this.timeOutPaging) {
        clearTimeout(this.timeOutPaging);
      }

      this.timeOutPaging = setTimeout(() => {
        //Gọi lại service để truyền lại tham số pageIndex
        const paramPaging = [this.currentPageIndex, this.currentPageSize];
        this.callServiceEmitter.emit(paramPaging);
        // this.getUserActive();
      }, 200)
    }
  }

  /**
* Bỏ chọn tất cả
* createdby npnam 17/04/2019
*/
  unSelectedAll(e) {
    this.grid.instance.clearSelection();
    this.selectedList = [];
    this.countSelected = 0;
  }

  /**
   * Sự kiện khi thao tác với ô checkbox lựa chọn member
   * createdby npnam 17/04/2019
   */
  selectRow(e) {
    //Nếu có sự kiện cho chọn ô checkbox
    if(this.isSelectionMode){
      if (!this.isClearSelect) {
        if (e) {
          let listID = this.selectedList.map(e => e.UserID);
          if (e.currentSelectedRowKeys.length != 0) {
            e.currentSelectedRowKeys.forEach(element => {
              if (listID.indexOf(element.UserID) < 0) {
                this.selectedList.push(element);
                this.countSelected = this.selectedList.length;
              }
            });
          }
          if (e.currentDeselectedRowKeys.length != 0) {
            let deleteID = e.currentDeselectedRowKeys.map(e => e.UserID);
            this.selectedList.forEach(ele => {
              if (deleteID.indexOf(ele.UserID) > -1) {
                this.selectedList = this.selectedList.filter(e => e.UserID != ele.UserID);
                this.countSelected = this.selectedList.length;
              }
            });
          }
        }
      }
    }
  }


  /**
* Sự kiện chọn ô người dùng
* CreatedBy NPNAM(18/04/2020)
*/
  selectedRowKeysChange(e) {

  }
  

  /**
* css cho row của grid
* CreatedBy NPNAM(18/04/2020)
*/
  onRowPrepared(e) {
    if (this.isDisplayBackGroundOdd && e.rowType === 'data' && e.rowIndex % 2 === 1) {
      e.rowElement.style.backgroundColor = '#f5f5f5';
    }
  }

    /**
  * Sự kiện gõ phím enter để search
  * CreatedBy NPNAM(18/04/2020)
  */
  onEnterKeySearch(event) {
    this.currentPageIndex = 1;
    let param = {
      PAGE_INDEX: this.currentPageIndex,
      PAGE_SIZE: this.currentPageSize,
      IS_PAGESIZE_CHANGED: false
    };
    this.onPagingChanged(param);
  }

}
