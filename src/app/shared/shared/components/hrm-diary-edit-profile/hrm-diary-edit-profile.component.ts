import { Component, OnInit, Input, Output, EventEmitter, ViewChildren, ViewChild } from '@angular/core';
import { FormMode } from 'src/common/enum/form-mode.enum';
import { TransferDataService } from 'src/app/services/base/transfer-data.service';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { PagingRequest } from '../../models/grid-field-config/paging-request';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from 'src/common/components/base-component';
import { ActionAuditType } from '../../enum/auditing-log/action-type.enum';
import * as moment from 'moment';
import { DxScrollViewComponent } from 'devextreme-angular';
import { AmisTranslationService } from 'src/common/services/amis-translation.service';
import { DateRange } from '../../enum/auditing-log/date-range';
import { LayoutGridType } from '../../constant/layout-grid-type/layout-grid-type';
import { AmisDateUtils } from 'src/common/fn/date-utils';
import { AmisTransferDataService } from 'src/common/services/amis-transfer-data.service';

@Component({
  selector: 'amis-hrm-diary-edit-profile',
  templateUrl: './hrm-diary-edit-profile.component.html',
  styleUrls: ['./hrm-diary-edit-profile.component.scss']
})
export class HrmDiaryEditProfileComponent extends BaseComponent implements OnInit {

  @Input() visibleDiaryProfile = false;

  @Input() employee;

  @Input() title = this.translateService.getValueByKey("PROFILE_INFO_HISTORY_EDIT");

  //lấy danh sách có paging hay k
  @Input() isGetAll = true;

  @Input() set position(data) {
    if (data) {
      this.positionId = data;
      this.getPos(data);
      return;
    }
    this.positionLoad = {
      left: "0px",
      top: "0px",
      bottom: "0px",
      right: "0px",
    }
  };

  @ViewChild("scrollContent", { static: false }) scrollContent: DxScrollViewComponent;
  @ViewChildren('contentLogs') contentLogs: any;
  // object lấy position
  positionLoad = {
    left: "0px",
    top: "0px",
    bottom: "0px",
    right: "0px",
  }
  //ID vị trí hiển thị
  positionId = ""

  textLoading = "";

  isLoading = false;

  @Output() cancel: EventEmitter<any> = new EventEmitter<any>();

  //danh sách lựa chọn khoảng thời gian
  listData = [
    {
      Key: DateRange.Other,
      IntervalText: this.translateService.getValueByKey("SELECT_DATE_ALLTIME")
    },
    {
      Key: DateRange.ThisWeek,
      IntervalText: this.translateService.getValueByKey("SELECT_DATE_THIS_WEEK")
    },
    {
      Key: DateRange.ThisMonth,
      IntervalText: this.translateService.getValueByKey("SELECT_DATE_THIS_MONTH")
    },
    {
      Key: DateRange.ThisYear,
      IntervalText: this.translateService.getValueByKey("SELECT_DATE_THIS_YEAR")
    }
  ];

  filter = "";

  actionAuditType = ActionAuditType;
  //item lựa chọn
  currentDataKey = DateRange.Other;

  auditLogs: any = [
    
  ];

  groupAuditLog: any = [];

  //data nhật ký chỉnh sửa



  //
  formMode = FormMode;

  //tổng số bản ghi
  totalAuditLogs = 0
  //pagesize
  currentPageSize = 100;
  //page index
  currentPageIndex = 0;
  //kiểm tra scroll lăn xuống cuối
  checkReachedBottom = 0;

  constructor(
    private transferDataSV: TransferDataService,
    private amisTransferSV: AmisTransferDataService,
    private employeeSV: EmployeeService,
    private translateService: AmisTranslationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.transferDataSV.isBigSidebar.subscribe(res => {
      const interval = setInterval(() => {
        this.getPos(this.positionId);
      }, 0);
      setTimeout(() => {
        clearInterval(interval);
      }, 350);
    });

    this.getPagingAudit();

  }



  /**
   * Lấy tham số paging
   * Created by: dthieu 04-08-2020
   */
  getParamPaging() {
    const param = new PagingRequest();
    param.CustomParam = {
      ModelID: this.employee?.EmployeeID,
      SubsytemCode: LayoutGridType.Employee,
      FromDate: this.fromDate,
      ToDate: this.toDate,
      IsGetAll: this.isGetAll,
      IsGetReference: true
    };
    param.PageSize = this.currentPageSize;
    param.PageIndex = this.currentPageIndex;
    // param.Filter = this.filter;
    // param.QuickSearch = this.quickSearch;

    return param;
  }

  /**
   * Lấy danh sách phân trang audit
   * Created by: dthieu 04-08-2020
   */
  getPagingAudit() {
    this.isLoading = true;
    this.amisTransferSV.showLoading("", "id-hrm-diary");
    const paramPaging = this.getParamPaging();
    this.employeeSV.getAuditingLogPaging(paramPaging).pipe(takeUntil(this._onDestroySub)).subscribe(response => {
      if (response?.Success && response?.Data) {
        this.amisTransferSV.hideLoading();
        this.isLoading = false;
        if (this.isGetAll) {
          this.auditLogs = response.Data?.Data;
        }
        else {
          if(!this.auditLogs?.length){{
            this.auditLogs = [];
          }}
          this.auditLogs.push(...response.Data?.Data);
          this.totalAuditLogs = response.Data?.Total;
        }
        this.auditLogs.forEach(element => {
          element.ID = AmisDateUtils.formatDate(element.CreatedDate);
          element.IsShow = false;
        });

        const arrayLog = this.auditLogs.reduce((r, a) => {
          r[a.ID] = r[a.ID] || [];
          r[a.ID].push(a);
          return r;
        }, Object.create(null));

        this.groupAuditLog = [];

        const ary = Object.keys(arrayLog).map((key) => [key, arrayLog[key]]);
        let object: any = {};
        ary.forEach(element => {
          object.Date = element[0];
          object.Log = element[1];
          this.groupAuditLog.push(object);
          object = {};
        });
      } else {
        this.amisTransferSV.hideLoading();
        this.amisTransferSV.showErrorToast(this.translateService.getValueByKey('ERROR_HAPPENED'));
        this.isLoading = false;
      }
    }, err => {
      this.amisTransferSV.hideLoading();
      this.isLoading = false;
    });
  }

  /**
   * Quay lại
   * Created by PVTHONG 31/07/2020
   */
  onBack() {
    this.visibleDiaryProfile = false;
    this.cancel.emit(true);
  }

  /**
   * Lấy vị trí của ID truyền vào
   * Created by PVTHONG 31/07/2020
   */
  getPos(data) {
    let obj: any = {};
    const pos = document.querySelector(`#${data}`)?.getBoundingClientRect();
    if (pos) {
      obj["left"] = `${pos.left}px`;
      obj["top"] = `${pos.top}px`;
      obj["right"] = `${pos.right - (pos.width + pos.left)}px`;
      obj["bottom"] = `${pos.bottom - (pos.height + pos.top)}px`;
    }
    this.positionLoad = obj;
  }

  isShow = false;
  expandContentLog(data, item, e) {
    item.IsShow = data;
  }


  ngModelfilterValue = "";

  //thời gian setTimeout
  timeSearch: any;

  //filter
  quickSearch: any = {
    Columns: [],
    SearchValue: ""
  };
  /**
  * Search vị trí công việc
  * Created by: pvthong 15-05-2020
  */
  onSearchControl(e) {
    let searchText = e.element.querySelector('.dx-texteditor-input').value;
    searchText = searchText.trim();
    if (this.quickSearch.SearchValue === searchText) {
      return;
    }
    this.quickSearch.SearchValue = searchText;
    // this.getJobRolePositionPaging();
  }

  /**
  * Search vị trí công việc
  * Created by: pvthong 23-05-2020
  */
  onKeyupSearchBox(e) {
    clearTimeout(this.timeSearch);
    this.timeSearch = setTimeout(() => {
      let searchText = e.element.querySelector('.dx-texteditor-input').value;
      this.ngModelfilterValue = searchText;
      this.quickSearch.SearchValue = searchText.trim();
      // this.getJobRolePositionPaging();
    }, 300)
  }

  fromDate = null;
  toDate = null;
  onValueChanged(e) {
    const me = this;
    if (e) {
      switch (e.value) {
        case DateRange.ThisWeek:
          this.fromDate = moment().startOf("week").add(1).startOf("day").format("YYYY-MM-DD 00:00:00");
          this.toDate = moment().endOf("week").add(1).startOf("day").format("YYYY-MM-DD 23:59:59");
          break;

        case DateRange.ThisMonth:
          this.fromDate = moment().startOf("month").startOf("day").format("YYYY-MM-DD 00:00:00");
          this.toDate = moment().endOf("month").startOf("day").format("YYYY-MM-DD 23:59:59");
          break;

        case DateRange.ThisYear:
          this.fromDate = moment().startOf("year").startOf("day").format("YYYY-MM-DD 00:00:00");
          this.toDate = moment().endOf("year").startOf("day").format("YYYY-MM-DD 23:59:59");
          break;

        case DateRange.Other:
          this.fromDate = null;
          this.toDate = null;
          break;

        default:
          break;
      }

      this.currentPageIndex = 0;
      this.scrollContent.instance.scrollTo(0);
      this.auditLogs = [];
      this.getPagingAudit();
    }
  }

  /**
   * scroll lấy dữ liệu
   * Created By PVTHONG 09/05/2020
   */
  scrollEmployee(e) {
    if (e.reachedBottom) {
      this.checkReachedBottom++;
    }

    if (!this.isGetAll && this.checkReachedBottom == 2 && e.reachedBottom && this.totalAuditLogs > this.auditLogs.length) {
      this.currentPageIndex++;
      this.checkReachedBottom = 0;
      this.getPagingAudit();
    }
  }
}
