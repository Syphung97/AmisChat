import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { AmisTranslationService } from 'src/common/services/amis-translation.service';
import { BaseComponent } from 'src/common/components/base-component';
import { TransferDataService } from 'src/app/services/base/transfer-data.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'amis-paging',
  templateUrl: './paging.component.html',
  styleUrls: ['./paging.component.scss']
})
export class PagingComponent extends BaseComponent implements OnInit {

  @Input()
  pageSize = 50;

  @Input()
  isShowPaging = true;

  @Input()
  isReport = false;

  @Input()
  isPageSizeEditable: boolean = true;

  totalPage = 0;

  listFilterPageSize = [
    {
      PageSize: 15,
      Text: '15'
    },
    {
      PageSize: 25,
      Text: '25'
    },
    {
      PageSize: 50,
      Text: '50'
    },
    {
      PageSize: 100,
      Text: '100'
    }
  ];

  currentPageSize = {
    PageSize: 50,
    Text: '50'
  };

  startRowNumber = 1;
  endRowNumber = 10;

  visibleBack = true;
  visibleNext = true;

  @Input() isCustoPageSize = false;

  @Input()
  totalShowRows = 10;

  totalRows: number;

  tmpTotalRows = 0;

  // Paging Index hiện tại. Paging trên server index bắt đầu từ 1
  currentPageIndex = 1;

  @Input()
  set setTotalRow(totalRows: number) {
    if (totalRows !== null && totalRows !== undefined) {
      this.totalRows = totalRows;
      this.configPaging();
    }
  }


  // tslint:disable-next-line:no-output-on-prefix
  @Output()
  onPagingChanged: EventEmitter<any> = new EventEmitter<any>();

  @Input()
  typeReport = "";

  isGroup = false;

  constructor(
    private translateService: AmisTranslationService,
    private transferDataSV: TransferDataService) { super(); }

  ngOnInit(): void {
    // hàm gọi emit subcriber thay đổi group nhóm
    this.transferDataSV.groupByField.pipe(takeUntil(this._onDestroySub)).subscribe(res => {
      if (res?.length) {
        this.isGroup = true;
      } else {
        this.isGroup = false;
      }
    });

    let param = {
      Report: this.currentUserInfo?.UserOptions?.Report?.length ? this.currentUserInfo?.UserOptions?.Report : []
    }

    let item = param.Report?.find(x => x.Key == this.typeReport);

    if (item?.Value?.GroupGridBy?.length) {
      this.isGroup = true;
    } else {
      this.isGroup = false;
    }
  }
  /**
   * Bắn thay đổi ra ngoài grid
   * Created by: dthieu 18-05-2020
   */
  notifyPagingChanged(isPageSizeChange: boolean) {
    const param = {
      PAGE_INDEX: this.currentPageIndex,
      PAGE_SIZE: this.pageSize,
      IS_PAGESIZE_CHANGED: isPageSizeChange
    };
    this.onPagingChanged.emit(param);
  }

  /**
   * Thay đổi pagesize
   * Created by: dthieu 18-05-2020
   */
  changedSizePaging(event) {
    const item = this.listFilterPageSize.find(n => n.PageSize === event.value);
    if (item) {
      this.currentPageSize.PageSize = item.PageSize;
      this.currentPageSize.Text = item.Text;
    }
    if (event.value !== this.pageSize) {
      this.pageSize = event.value;
      this.currentPageIndex = 1;
      this.visibleBack = false;
      this.visibleNext = true;
      this.totalPage = Math.ceil(this.totalShowRows / this.pageSize);
      if (this.totalPage === 1) {
        this.visibleNext = false;
      }
      this.calculatePageNumber();
      this.notifyPagingChanged(true);
    }
  }


  calculatePageNumber() {
    if (this.totalShowRows === 0) {
      this.startRowNumber = 0;
      this.endRowNumber = 0;
      this.visibleNext = false;
      this.visibleBack = false;
    } else {
      this.startRowNumber = (this.currentPageIndex - 1) * this.pageSize + 1;
      this.endRowNumber = Math.min(this.totalShowRows, this.startRowNumber + this.pageSize - 1);
    }
  }

  backPage(e) {
    if (this.currentPageIndex == 2) {
      this.visibleBack = false;
    }
    if (this.currentPageIndex > 1) {
      this.currentPageIndex--;
      this.calculatePageNumber();
      this.notifyPagingChanged(false);
      this.visibleNext = true;
    }
    if (this.currentPageIndex == this.totalPage) {
      this.visibleNext = true;
    }
  }
  nextPage(e) {
    if (this.currentPageIndex == this.totalPage - 1) {
      this.visibleNext = false;
    }
    if (this.currentPageIndex < this.totalPage) {
      this.currentPageIndex++;
      this.calculatePageNumber();
      this.notifyPagingChanged(false);
      this.visibleBack = true;
    }
    if (this.currentPageIndex == 1) {
      this.visibleBack = false;
    }
  }

  /**
   * Khởi tạo các tham số của paging
   *
   */
  configPaging() {
    // reset page-index về 0
    this.currentPageIndex = 1;
    this.currentPageSize.PageSize = this.pageSize;
    this.totalPage = Math.ceil(this.totalRows / this.pageSize);
    if (this.totalPage > 1) {
      this.visibleNext = true;
      this.visibleBack = false;
    } else {
      this.visibleNext = false;
      this.visibleBack = false;
    }

    this.calculatePageNumber();

  }

  @Input()
  isExpandAll: boolean;
  @Output()
  expandGridGroup: EventEmitter<any> = new EventEmitter<any>();
  expandAll(isExpandAll) {
    this.expandGridGroup.emit(isExpandAll);
  }
}
