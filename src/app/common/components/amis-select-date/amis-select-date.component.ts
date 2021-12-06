import {
  Component,
  OnInit,
  Output,
  Input,
  EventEmitter,
  ViewChild,
  ChangeDetectorRef,
  ElementRef,
  HostListener,
  Directive
} from "@angular/core";
import * as moment from "moment";
import { ButtonType } from "src/app/shared/enum/button.enum";
import { AmisTranslationService } from "src/common/services/amis-translation.service";
import { TmsDashboardReportListTaskComponent } from "src/app/components/tms-dashboard/tms-dashboard-report/tms-dashboard-report-list-task/tms-dashboard-report-list-task.component";
import { DxTextBoxComponent } from "devextreme-angular";
declare var $: any;
@Component({
  selector: "amis-select-date",
  templateUrl: "./amis-select-date.component.html",
  styleUrls: ["./amis-select-date.component.scss"]
})
export class AmisSelectDateComponent implements OnInit {
  // @Input() isCloseoutside = false;
  buttonType = ButtonType;
  //#region Property

  /**
   * Giá trị mặc định của combo Thời gian. Mặc định là Năm nay
   * Mặc định là 7 ngày gần đây UPDATED BY NPNAM 25/03/2020
   * LCLIEM 15/2/2020
   */
  currentInterval = {
    Key: DateRange.SevenDayNearby,
    Text: this.translateService.getValueByKey("TMS_SELECT_DATE_SEVEN_DAY_AGO")
  };
  // this.translateService.getValueByKey(
  //   "TMS_TASK_VIEW_CONTENT_IMPORTANT"
  // )
  isChangeDate = false;

  isFocusFromDateToDate: boolean = true;

  // Hiển thị lịch từ ngày trong bộ lọc
  isShowCalenderDateFrom = false;

  // Hiển thị lịch đến ngày trong bộ lọc
  isShowCalenderDateTo = false;

  /**
   * Giá trị từ ngày
   */
  fromDate;

  /**
   * Giá trị đến ngày
   */
  toDate;

  startDate: Date = new Date(
    moment(new Date().setDate(new Date().getDate() - 6)).format(
      "YYYY-MM-DD 00:00:00"
    )
  );
  startDateText = "";
  endDate: Date = new Date(moment(new Date()).format("YYYY-MM-DD 23:59:59"));
  endDateText = "";
  count = 0;
  isResetBool: boolean = true;
  //Input set lại giá trị mặc định
  @Input()
  set isReset(data) {
    if (data && this.currentInterval.Key != DateRange.SevenDayNearby) {
      this.currentInterval = {
        Key: DateRange.SevenDayNearby,
        Text: this.translateService.getValueByKey("TMS_SELECT_DATE_SEVEN_DAY_AGO")
      };
      if (this.visible) {
        this.isResetBool = false;
      }
      this.visible = true;
      // me.currentInterval.Text = item.IntervalText;
      // const tmpValue = me.caseDateRange(item.Key);
      // this.startDate = new Date(moment(new Date(tmpValue.FromDate)).format("YYYY-MM-DD 00:00:00"));
      // this.endDate = new Date(moment(new Date(tmpValue.ToDate)).format("YYYY-MM-DD 23:59:59"));
      // const dateFilter = [tmpValue.FromDate, tmpValue.ToDate];
      // me.dateFilter.emit(dateFilter);
      // //set giá trị về 7 ngày mặc định
      // const today = new Date();
      // this.startDate = new Date(moment(today.setDate(today.getDate() - 6)).format("YYYY-MM-DD 00:00:00"));
      // this.endDate = new Date(moment(today).format("YYYY-MM-DD 23:59:59"));
      // this.fromDate = new Date(moment(today.setDate(today.getDate() + 1)).subtract(1, "weeks").subtract().format("YYYY-MM-DD 00:00:00"));
      // this.toDate = moment(today).format("YYYY-MM-DD 23:59:59");
    }
  }

  //Input set giá trị margin-right cho calendar
  @Input()
  calendarMarginRight = "27px";

  @ViewChild("focus", { static: false })
  focus;

  //Xác định xem popover nào đang được target
  @Input()
  targetPopover: any;
  // Bắn lên component cha khi có sự kiện thay đổi mốc thời gian filter
  @Output()
  dateFilter: EventEmitter<Date[]> = new EventEmitter();

  /**
   * Danh sách các option chọn thời gian
   * LCLIEM 15/2/2020
   */
  listIntervalTypeCustomType = [
    {
      Key: DateRange.SevenDayNearby,
      IntervalText: this.translateService.getValueByKey("TMS_SELECT_DATE_SEVEN_DAY_AGO")
    },
    {
      Key: DateRange.ThirtyDayNearby,
      IntervalText: this.translateService.getValueByKey("TMS_SELECT_DATE_THIRTY_DAY_AGO")
    },
    {
      Key: DateRange.ThisWeek,
      IntervalText: this.translateService.getValueByKey("TMS_SELECT_DATE_THIS_WEEK")
    },
    {
      Key: DateRange.LastWeek,
      IntervalText: this.translateService.getValueByKey("TMS_SELECT_DATE_LAST_WEEK")
    },
    {
      Key: DateRange.ThisMonth,
      IntervalText: this.translateService.getValueByKey("TMS_SELECT_DATE_THIS_MONTH")
    },
    {
      Key: DateRange.LastMonth,
      IntervalText: this.translateService.getValueByKey("TMS_SELECT_DATE_LAST_MONTH")
    },
    {
      Key: DateRange.ThisQuarter,
      IntervalText: this.translateService.getValueByKey("TMS_SELECT_DATE_THIS_SEMESTER")
    },
    {
      Key: DateRange.LastQuarter,
      IntervalText: this.translateService.getValueByKey("TMS_SELECT_DATE_LAST_SEMESTER")
    },
    {
      Key: DateRange.ThisYear,
      IntervalText: this.translateService.getValueByKey("TMS_SELECT_DATE_THIS_YEAR")
    },
    {
      Key: DateRange.LastYear,
      IntervalText: this.translateService.getValueByKey("TMS_SELECT_DATE_LAST_YEAR")
    },
    {
      Key: DateRange.Other,
      IntervalText: this.translateService.getValueByKey("TMS_SELECT_DATE_OPTIONAL")
    }
  ];
  listIntervalTypeCustomTypeOptional = [
    {
      Key: DateRange.SevenDayNearby,
      IntervalText: this.translateService.getValueByKey("TMS_SELECT_DATE_SEVEN_DAY_AGO")
    },
    {
      Key: DateRange.ThirtyDayNearby,
      IntervalText: this.translateService.getValueByKey("TMS_SELECT_DATE_THIRTY_DAY_AGO")
    },
    {
      Key: DateRange.ThisWeek,
      IntervalText: this.translateService.getValueByKey("TMS_SELECT_DATE_THIS_WEEK")
    },
    {
      Key: DateRange.LastWeek,
      IntervalText: this.translateService.getValueByKey("TMS_SELECT_DATE_LAST_WEEK")
    },
    {
      Key: DateRange.ThisMonth,
      IntervalText: this.translateService.getValueByKey("TMS_SELECT_DATE_THIS_MONTH")
    },
    {
      Key: DateRange.LastMonth,
      IntervalText: this.translateService.getValueByKey("TMS_SELECT_DATE_LAST_MONTH")
    },
    {
      Key: DateRange.ThisQuarter,
      IntervalText: this.translateService.getValueByKey("TMS_SELECT_DATE_THIS_SEMESTER")
    },
    {
      Key: DateRange.LastQuarter,
      IntervalText: this.translateService.getValueByKey("TMS_SELECT_DATE_LAST_SEMESTER")
    },
    {
      Key: DateRange.ThisYear,
      IntervalText: this.translateService.getValueByKey("TMS_SELECT_DATE_THIS_YEAR")
    },
    {
      Key: DateRange.LastYear,
      IntervalText: this.translateService.getValueByKey("TMS_SELECT_DATE_LAST_YEAR")
    }
  ];
  validMessage = "";

  // Xác định xem ngưởi dùng đã bấm tùy chọn hay chưa
  visible = true;

  //Hiển thị popover khi người dùng đã bấm tùy chọn và muốn chọn 1 số option: tháng này, năm nay...
  visibleOptionFilter = false;

  // View Child từ ngày đến ngày để bắt sư kiện focus
  @ViewChild("inputFromDate", { static: false })
  inputFromDate: DxTextBoxComponent;
  @ViewChild("inputToDate", { static: false })
  inputToDate: DxTextBoxComponent;

  //#endregion

  //#region LifeCircle

  constructor(
    private amisTranslationSV: AmisTranslationService,
    private changeDetect: ChangeDetectorRef,
    private translateService: AmisTranslationService
  ) {}

  ngOnInit() {
    this.amisTranslationSV.initLanguage();
    this.initSelectedDate();
    const today = new Date();
    this.fromDate = new Date(
      moment(new Date().setDate(new Date().getDate() + 1))
        .subtract(1, "weeks")
        .subtract()
        .format("YYYY-MM-DD 00:00:00")
    );
    this.toDate = moment(today).format("YYYY-MM-DD 23:59:59");
    const thisSevenDayNearBy = this.listIntervalTypeCustomType.find(
      x => x.Key === DateRange.SevenDayNearby
    );
    if (thisSevenDayNearBy) {
      // Mặc định 7 ngày gần đây
      this.onSelectInterval(thisSevenDayNearBy);
    } else {
      this.onSelectInterval(this.listIntervalTypeCustomType[0]);
    }
  }

  /**
   * Hiển thị danh sách tùy chọn tháng này,.. khi người dùng đã bấm vào tùy chọn
   * NPNAM 4/4/2020
   */
  showFilterDate(e) {
    if (e && e.currentTarget) {
      this.targetPopover = e.currentTarget;
    }
    this.visibleOptionFilter = !this.visibleOptionFilter;
    this.isShowCalenderDateFrom = false;
    this.isShowCalenderDateTo = false;
    this.isFocusFromDateToDate = true;
  }

  /**
   * Sự kiện khi bấm vào nút tùy chọn sẽ lấy ra ngày trước đó đã lựa chọn (tháng này...)
   *  NPNAM 6/4/2020
   * @param item
   */
  initSelectedDate() {
    const dayFromDate = this.convertDayToString(this.startDate.getDate());
    const monthFromDate = this.convertMonthToString(this.startDate.getMonth());
    this.startDateText = `${dayFromDate}${monthFromDate}${this.startDate.getFullYear()}`;

    const dayToDate = this.convertDayToString(this.endDate.getDate());
    const monthToDate = this.convertMonthToString(this.endDate.getMonth());
    this.endDateText = `${dayToDate}${monthToDate}${this.endDate.getFullYear()}`;
    this.isFocusFromDateToDate = true;
  }

  //#endregion

  //#region Function

  /**
   * Sự kiện thay đổi combo thời gian báo cáo
   * LCLIEM 18/2/2020
   * UPDATED BY NPNAM 1/4/2020
   * @param item
   */
  @Output()
  isResetEmitter: EventEmitter<boolean> = new EventEmitter();
  onSelectInterval(event) {
    if (this.isResetBool) {
      const item = this.listIntervalTypeCustomType.find(
        k => k.Key === event.value
      );
      const me = this;
      if (item) {
        if (item.Key === DateRange.Other) {
          this.visible = false;
          this.initSelectedDate();
          me.currentInterval.Key = item.Key;
          me.currentInterval.Text = item.IntervalText;
          this.isShowCalenderDateFrom = true;
          this.isFocusFromDateToDate = false;
          setTimeout(() => {
            this.inputFromDate.instance.focus();
            // Đã bôi đen được; Kiểm tra lỗi sau
            // if (this.inputFromDate.element &&
            //   this.inputFromDate.element.nativeElement &&
            //   this.inputFromDate.element.nativeElement.querySelector(".dx-texteditor-input")) {
            //   this.inputFromDate.element.nativeElement.querySelector(".dx-texteditor-input").select();
            // }
          }, 100);
        } else {
          me.currentInterval.Key = item.Key;
          me.currentInterval.Text = item.IntervalText;
          const tmpValue = me.caseDateRange(item.Key);
          this.startDate = new Date(
            moment(new Date(tmpValue.FromDate)).format("YYYY-MM-DD 00:00:00")
          );
          this.endDate = new Date(
            moment(new Date(tmpValue.ToDate)).format("YYYY-MM-DD 23:59:59")
          );
          const dateFilter = [tmpValue.FromDate, tmpValue.ToDate];
          me.dateFilter.emit(dateFilter);
          // this.isFocusFromDateToDate = false;
        }
        this.isFocusFromDateToDate = false;
      }
      this.isResetEmitter.emit(this.isResetBool);
      // this.count++;
    }
    this.isResetBool = true;
  }

  /**
   * Xử lý khi chọn thời gian sẽ thay đổi Từ ngày, Đến ngày tương ứng
   * LCLIEM 18/2/2020
   * UPDATED BY NPNAM 1/4/2020
   */
  caseDateRange(intervalValue) {
    const me = this;
    const today = new Date();
    const tmpFullDate = {
      Interval: DateRange.Other,
      FromDate: me.fromDate,
      ToDate: me.toDate
    };
    switch (intervalValue) {
      case DateRange.ThisMonth:
        tmpFullDate.Interval = DateRange.ThisMonth;
        tmpFullDate.FromDate = moment()
          .startOf("month")
          .startOf("day")
          .format("YYYY-MM-DD 00:00:00");
        tmpFullDate.ToDate = moment()
          .endOf("month")
          .startOf("day")
          .format("YYYY-MM-DD 23:59:59");
        break;
      case DateRange.LastMonth:
        tmpFullDate.Interval = DateRange.LastMonth;
        tmpFullDate.FromDate = moment(today)
          .subtract(1, "months")
          .startOf("month")
          .startOf("day")
          .format("YYYY-MM-DD 00:00:00");
        tmpFullDate.ToDate = moment(today)
          .subtract(1, "months")
          .endOf("month")
          .startOf("day")
          .format("YYYY-MM-DD 23:59:59");
        break;
      case DateRange.ThisQuarter:
        tmpFullDate.Interval = DateRange.ThisQuarter;
        tmpFullDate.FromDate = moment()
          .startOf("quarter")
          .startOf("day")
          .format("YYYY-MM-DD 00:00:00");
        tmpFullDate.ToDate = moment()
          .endOf("quarter")
          .startOf("day")
          .format("YYYY-MM-DD 23:59:59");
        break;
      case DateRange.LastQuarter:
        tmpFullDate.Interval = DateRange.LastQuarter;
        tmpFullDate.FromDate = moment(today)
          .subtract(1, "quarters")
          .startOf("quarter")
          .startOf("day")
          .format("YYYY-MM-DD 00:00:00");
        tmpFullDate.ToDate = moment(today)
          .subtract(1, "quarters")
          .endOf("quarter")
          .startOf("day")
          .format("YYYY-MM-DD 23:59:59");
        break;
      case DateRange.ThisYear:
        tmpFullDate.Interval = DateRange.ThisYear;
        tmpFullDate.FromDate = moment()
          .startOf("year")
          .startOf("day")
          .format("YYYY-MM-DD 00:00:00");
        tmpFullDate.ToDate = moment()
          .endOf("year")
          .startOf("day")
          .format("YYYY-MM-DD 23:59:59");
        break;
      case DateRange.LastYear:
        tmpFullDate.Interval = DateRange.LastYear;
        tmpFullDate.FromDate = moment(today)
          .subtract(1, "years")
          .startOf("year")
          .startOf("day")
          .format("YYYY-MM-DD 00:00:00");
        tmpFullDate.ToDate = moment(today)
          .subtract(1, "years")
          .endOf("year")
          .startOf("day")
          .format("YYYY-MM-DD 23:59:59");
        break;
      case DateRange.ThisWeek:
        tmpFullDate.Interval = DateRange.ThisWeek;
        tmpFullDate.FromDate = moment(today)
          .startOf("isoWeek")
          .format("YYYY-MM-DD 00:00:00");
        tmpFullDate.ToDate = moment(today)
          .endOf("isoWeek")
          .format("YYYY-MM-DD 23:59:59");
        break;
      case DateRange.LastWeek:
        tmpFullDate.Interval = DateRange.LastWeek;
        tmpFullDate.FromDate = moment(today)
          .subtract(1, "weeks")
          .startOf("isoWeek")
          .format("YYYY-MM-DD 00:00:00");
        tmpFullDate.ToDate = moment(today)
          .subtract(1, "weeks")
          .endOf("isoWeek")
          .format("YYYY-MM-DD 23:59:59");
        break;
      case DateRange.SevenDayNearby:
        tmpFullDate.Interval = DateRange.SevenDayNearby;
        tmpFullDate.FromDate = moment(
          new Date().setDate(new Date().getDate() - 6)
        ).format("YYYY-MM-DD 00:00:00");
        tmpFullDate.ToDate = moment(today).format("YYYY-MM-DD 23:59:59");
        break;
      case DateRange.ThirtyDayNearby:
        tmpFullDate.Interval = DateRange.ThirtyDayNearby;
        tmpFullDate.FromDate = moment(
          new Date().setDate(new Date().getDate() - 29)
        ).format("YYYY-MM-DD 00:00:00");
        tmpFullDate.ToDate = moment(today).format("YYYY-MM-DD 23:59:59");
        break;
      default:
        break;
    }
    return tmpFullDate;
  }

  /**
   * Thay đổi giá trị Từ ngày hoặc Đến ngày
   * LCLIEM 18/2/2020
   */
  // changeDateSelection() {
  //   const me = this;
  //   let checkExist: boolean = false;
  //   me.listIntervalTypeCustomType.forEach(e => {
  //     if (!checkExist) {
  //       let tmpFullDate = me.caseDateRange(e.Key);
  //       if (tmpFullDate) {
  //         if (new Date(tmpFullDate.FromDate).getTime() == new Date(me.fromDate).getTime() && new Date(tmpFullDate.ToDate).getTime() == new Date(me.toDate).getTime()) {
  //           me.currentInterval.Key = tmpFullDate.Interval;
  //           me.currentInterval.Text = e.IntervalText;
  //           checkExist = true;
  //         }
  //         else {
  //           me.currentInterval.Key = DateRange.Other;
  //           me.currentInterval.Text = "Tùy chọn";
  //         }
  //       }
  //     }
  //   });
  //   if (me.fromDate && me.toDate) {
  //     me.valueChanged.emit(
  //       {
  //         Interval: me.currentInterval.Key,
  //         FromDate: moment(me.fromDate).format("YYYY-MM-DD 00:00:00"),
  //         ToDate: moment(me.toDate).format("YYYY-MM-DD 23:59:59")
  //       }
  //     );
  //   }
  //   this.isCallService = true;
  //   const dateFilter = [me.fromDate, me.toDate, me.currentInterval.Text, this.isCallService];
  //   me.dateFilter.emit(dateFilter);
  // }

  /**
   * valid chuỗi string xem có phải date ko?
   * NPNAM 3/4/2020
   */
  CheckValidDate(str) {
    if (str && str.length === 8 && +str >= 0) {
      return true;
    }
    return false;
  }

  /**
   * Hiển thị calendar từ ngày trong bộ lọc:
   * NPNAM 2/4/2020
   */
  showChooseCalendarDateFrom() {
    this.isShowCalenderDateFrom = true;
    this.isShowCalenderDateTo = false;
    this.isFocusFromDateToDate = true;
    // this.inputFromDate.instance.focus();
  }

  //Sự kiện focus out ra khỏi ô từ ngày
  focusOutFromDateReport(event) {
    this.startDateText = "";
    this.isShowCalenderDateFrom = false;
    this.isFocusFromDateToDate = false;
  }

  /**
   * Sự kiện người dùng lựa chọn 1 số option: tháng này, tháng trước.. khi đã bấm tùy chọn
   * NPNAM 4/4/2020
   */
  choosingOptionFilterDate(keyFilter: number) {
    // Ẩn đi phần tùy chọn
    this.validMessage = "";
    this.visible = true;
    this.visibleOptionFilter = false;
    const me = this;
    const item = this.listIntervalTypeCustomType.find(k => k.Key === keyFilter);
    if (item) {
      me.currentInterval.Key = item.Key;
      me.currentInterval.Text = item.IntervalText;
      const tmpValue = me.caseDateRange(item.Key);
      this.startDate = new Date(
        moment(new Date(tmpValue.FromDate)).format("YYYY-MM-DD 00:00:00")
      );
      this.endDate = new Date(
        moment(new Date(tmpValue.ToDate)).format("YYYY-MM-DD 00:00:00")
      );
      const dateFilter = [tmpValue.FromDate, tmpValue.ToDate];
      me.dateFilter.emit(dateFilter);
    }
    this.startDateText = "";
    this.endDateText = "";
    this.isShowCalenderDateFrom = false;
    this.isShowCalenderDateTo = false;
    this.isFocusFromDateToDate = true;
  }

  /**
   * Hiển thị calendar từ ngày trong bộ lọc:
   * NPNAM 2/4/2020
   */
  showChooseCalendarDateTo() {
    this.isShowCalenderDateTo = true;
    this.isShowCalenderDateFrom = false;
    this.isFocusFromDateToDate = true;
    // this.inputToDate.instance.focus();
  }
  /**
   * Thay đổi ngày bắt đầu khi chọn trong calendar
   * created by NPNAM - 04/03/2020
   */
  changeEndDateOnPicker(event) {
    // this.hideInvalid();
    if (event) {
      if (this.endDate) {
        const day = this.convertDayToString(this.endDate.getDate());
        const month = this.convertMonthToString(this.endDate.getMonth());
        this.endDateText = `${day}${month}${this.endDate.getFullYear()}`;
      }
    } else {
      this.endDateText = "";
    }
    this.isShowCalenderDateTo = false;
    this.isFocusFromDateToDate = false;
  }
  enterFromDate(event) {
    if (event) {
      if (!event.value) {
        return;
      }
      // Nếu có giá trị và valid nó là kiểu date
      if (
        event.value &&
        this.CheckValidDateString(event.value.split("/").join(""))
      ) {
        if (this.startDateText.length !== 0) {
          // Đổi thành object
          const convertObjectStartDate = this.converStringToObjectDate(
            this.startDateText
          );
          if (convertObjectStartDate) {
            this.startDateText = event.value.split("/").join("");
            this.fromDate = new Date(
              moment(convertObjectStartDate).format("YYYY-MM-DD 00:00:00")
            );
            this.toDate = new Date(
              moment(this.endDate).format("YYYY-MM-DD 23:59:59")
            );
            this.startDate = this.fromDate;
            this.endDate = this.toDate;
            if (!this.validDateFilter(this.fromDate, this.toDate)) {
              this.validMessage = this.translateService.getValueByKey("TMS_SELECT_DATE_VALID_COMPARE_DATE");
            } else {
              const dateFilter = [this.fromDate, this.toDate];
              this.dateFilter.emit(dateFilter);
              this.validMessage = "";
            }
          } else {
            this.validMessage = this.translateService.getValueByKey("TMS_SELECT_DATE_VALID_DATA_DATE");
          }
        }
      } else {
        this.validMessage = this.translateService.getValueByKey("TMS_SELECT_DATE_VALID_DATA_DATE");
      }
      this.isFocusFromDateToDate = false;
      this.focus.instance.focus();
    }
    if ((this.isShowCalenderDateFrom == true)) {
      this.isShowCalenderDateFrom = false;
    }
    if ((this.isShowCalenderDateTo == true)) {
      this.isShowCalenderDateTo = false;
    }
    this.changeDetect.detectChanges();
  }
  /**
   * Sự kiện click vào ô textbox để chọn ngày sẽ filter luôn (toDate)
   * NPNAM - 4/6/2020
   */
  enterToDate(event) {
    if (event) {
      if (!event.value) {
        return;
      }
      // Nếu có giá trị và valid nó là kiểu date
      if (
        event.value &&
        this.CheckValidDateString(event.value.split("/").join(""))
      ) {
        if (this.endDateText.length !== 0) {
          // Đổi thành object
          const convertObjectEndDate = this.converStringToObjectDate(
            this.endDateText
          );
          if (convertObjectEndDate) {
            this.endDateText = event.value.split("/").join("");
            this.fromDate = new Date(
              moment(this.startDate).format("YYYY-MM-DD 00:00:00")
            );
            this.toDate = new Date(
              moment(convertObjectEndDate).format("YYYY-MM-DD 23:59:59")
            );
            this.startDate = this.fromDate;
            this.endDate = this.toDate;
            if (!this.validDateFilter(this.fromDate, this.toDate)) {
              this.validMessage = this.translateService.getValueByKey("TMS_SELECT_DATE_VALID_COMPARE_DATE");
            } else {
              const dateFilter = [this.fromDate, this.toDate];
              this.dateFilter.emit(dateFilter);
              this.validMessage = "";
            }
          } else {
            this.validMessage = this.translateService.getValueByKey("TMS_SELECT_DATE_VALID_DATA_DATE");
          }
        }
      } else {
        this.validMessage = this.translateService.getValueByKey("TMS_SELECT_DATE_VALID_DATA_DATE");
      }
      this.isFocusFromDateToDate = false;
      this.focus.instance.focus();
    }
    if ((this.isShowCalenderDateFrom == true)) {
      this.isShowCalenderDateFrom = false;
    }
    if ((this.isShowCalenderDateTo == true)) {
      this.isShowCalenderDateTo = false;
    }
    this.changeDetect.detectChanges();
  }
  /**
   * Thay đổi ngày bắt đầu khi chọn trong calendar của ngày bắt đầu
   * created by NPNAM - 04/03/2020
   */
  changeStartDateOnPickerFromDate(event) {
    const day = this.convertDayToString(this.startDate.getDate());
    const month = this.convertMonthToString(this.startDate.getMonth());
    this.startDateText = `${day}${month}${this.startDate.getFullYear()}`;
    if ((this.isShowCalenderDateFrom == true)) {
      this.isShowCalenderDateFrom = false;
    }
    if ((this.isShowCalenderDateTo == true)) {
      this.isShowCalenderDateTo = false;
    }
  }
  /**
   * Thay đổi ngày bắt đầu khi chọn trong calendar của ngày kêt thúc
   * created by NPNAM - 04/04/2020
   */
  changeEndDateOnPickerToDate(event) {
    const day = this.convertDayToString(this.endDate.getDate());
    const month = this.convertMonthToString(this.endDate.getMonth());
    this.endDateText = `${day}${month}${this.endDate.getFullYear()}`;
    if ((this.isShowCalenderDateFrom == true)) {
      this.isShowCalenderDateFrom = false;
    }
    if ((this.isShowCalenderDateTo == true)) {
      this.isShowCalenderDateTo = false;
    }
  }

  /**
   * Chuyển string thành objet date
   * NPNAM - 4/6/2020
   */
  converStringToObjectDate(str) {
    str = str.replace("/", "");
    const yaerStr = str.substring(4, 8);
    if (yaerStr) {
      const year = +yaerStr;
      if (year >= 0) {
        const monthStr = str.substring(2, 4);
        if (monthStr) {
          const month = +monthStr;
          if (month > 0 && month <= 12) {
            const dayStr = str.substring(0, 2);
            if (dayStr) {
              const day = +dayStr;
              if (day > 0 && day <= 31) {
                if (month === 2) {
                  if (year % 4 !== 0) {
                    if (day >= 29) {
                      return null;
                    }
                  } else {
                    if (day > 29) {
                      return null;
                    }
                  }
                } else if (
                  month === 4 ||
                  month === 6 ||
                  month === 9 ||
                  month === 11
                ) {
                  if (day >= 31) {
                    return null;
                  }
                }
                return new Date(year, month - 1, day, 0, 0);
              }
            }
          }
        }
      }
    }
    return null;
  }
  /**
   * Chuyển tháng sang string
   * @param {number} month
   * @returns
   * created by npnam 3/4/2020
   */
  convertMonthToString(month: number) {
    let res = "";
    if (month <= 8) {
      res = "0" + (month + 1);
    } else {
      res = (month + 1).toString();
    }
    return res;
  }
  /**
   * Chuyển ngày sang string
   * @param {number} day
   * @returns
   * created by npnam 3/4/2020
   */
  convertDayToString(day: number) {
    let res = "";
    if (day <= 9) {
      res = "0" + day;
    } else {
      res = day.toString();
    }
    return res;
  }

  /**
   * Hàm valid
   * created by npnam 3/4/2020
   */
  validDateFilter(fromDate: Date, toDate: Date) {
    if (fromDate.getTime() > toDate.getTime()) {
      return false;
    }
    return true;
  }

  /**
   * Kiểm tra chuỗi string date hợp lệ hay không
   * @param {any} str
   * @returns
   * @memberof TmsRangedateComponent
   * created by NPNAM - 06/04/2020
   */
  CheckValidDateString(str) {
    if (str && str.length === 8 && +str >= 0) {
      return true;
    }
    return false;
  }

  // }
  //#endregion
  //Bắt sự kiện focusout thì ẩn lịch
  @HostListener("document: click", ["$event"])
  public handleClickEvent(event): void {
    if (
      !event.target.closest(".custom-calendar") &&
      !event.target.closest(".control-select-date") &&
      !event.target.closest(".dx-button-text") &&
      !event.target.closest(".dx-calendar-cell")
    ) {
      this.isShowCalenderDateFrom = false;
      this.isShowCalenderDateTo = false;
      this.isFocusFromDateToDate = false;
    }
  }
  language: string = "";
  //Hiển thị thứ 2: TH 2 => T2
  onDisplayCalendar(e) {
    if (!this.language || this.language == "vi") {
      var me = this;
      setTimeout(() => {
        var weekdays = $(e.element).find(".dx-calendar-body .dx-calendar-views-wrapper table thead th");
        $.each(weekdays, function (index, data) {
          data.innerHTML = data.innerHTML.replace("Th ", "T");
        });
        var navigatorText = $(e.element).find(".dx-widget.dx-calendar-navigator .dx-calendar-caption-button span");
        $.each(navigatorText, function (index, data) {
          const rs = data.innerHTML.toLowerCase().split(" ");
          var customText = "";
          if (rs.length == 4) {
            customText += me.translateService.getValueByKey("MONTH");
            customText += " " + rs[1] + ", ";
            customText += rs[3];
            data.innerHTML = customText;
          }
        });

      }, 0);
    }
  }
}
export enum DateRange {
  Other = 1,
  ThisWeek = 2,
  LastWeek = 3,
  ThisMonth = 4,
  LastMonth = 5,
  SevenDayNearby = 6,
  ThirtyDayNearby = 7,
  ThisQuarter = 8,
  LastQuarter = 9,
  ThisYear = 10,
  LastYear = 11
}
