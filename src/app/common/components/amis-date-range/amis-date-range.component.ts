import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';
import { AmisTranslationService } from 'src/common/services/amis-translation.service';
import { Period, DateRange, PeriodStatistic, ReportPeriod } from 'src/common/enum/period.enum';
import { BaseControl } from '../base-control';
import { AmisTransferDataService } from 'src/common/services/amis-transfer-data.service';

@Component({
  selector: 'amis-amis-date-range',
  templateUrl: './amis-date-range.component.html',
  styleUrls: ['./amis-date-range.component.scss']
})
export class AmisDateRangeComponent extends BaseControl implements OnInit {

  @Input()
  widthPeriod: number = 120;

  /**
   * width của combo kỳ báo cáo
   */
  @Input()
  width: string = "270px";

  /**
   * width của combo Từ ngày
   */
  @Input()
  widthFromDate: string = "270px";

  /**
   * widthLabel của combo Từ ngày
   */
  @Input()
  widthLabelFromDate: string = "70px"

  /**
   * width của combo Đến ngày
   */
  @Input()
  widthToDate: string = "270px";

  @Input()
  periodControlMargin: string = '8px';

  @Input()
  fromdateControlMargin: string = '8px';

  @Input()
  todateControlMargin: string = '8px';

  // Danh sách thời gian truyền vào dạng mảng object
  @Input()
  statisticTypeOption = [
    { PeriodID: Period.ThisMonth, PeriodName: this.translateSV.getValueByKey('PERIOD_THIS_MONTH') },
    { PeriodID: Period.M1, PeriodName: this.translateSV.getValueByKey('PERIOD_M1') },
    { PeriodID: Period.M2, PeriodName: this.translateSV.getValueByKey('PERIOD_M2') },
    { PeriodID: Period.M3, PeriodName: this.translateSV.getValueByKey('PERIOD_M3') },
    { PeriodID: Period.M4, PeriodName: this.translateSV.getValueByKey('PERIOD_M4') },
    { PeriodID: Period.M5, PeriodName: this.translateSV.getValueByKey('PERIOD_M5') },
    { PeriodID: Period.M6, PeriodName: this.translateSV.getValueByKey('PERIOD_M6') },
    { PeriodID: Period.M7, PeriodName: this.translateSV.getValueByKey('PERIOD_M7') },
    { PeriodID: Period.M8, PeriodName: this.translateSV.getValueByKey('PERIOD_M8') },
    { PeriodID: Period.M9, PeriodName: this.translateSV.getValueByKey('PERIOD_M9') },
    { PeriodID: Period.M10, PeriodName: this.translateSV.getValueByKey('PERIOD_M10') },
    { PeriodID: Period.M11, PeriodName: this.translateSV.getValueByKey('PERIOD_M11') },
    { PeriodID: Period.M12, PeriodName: this.translateSV.getValueByKey('PERIOD_M12') },
    { PeriodID: Period.ThisWeek, PeriodName: this.translateSV.getValueByKey('PERIOD_THIS_WEEK') },
    { PeriodID: Period.ThisQuarter, PeriodName: this.translateSV.getValueByKey('PERIOD_THIS_QUARTER') },
    { PeriodID: Period.FirstHalfYear, PeriodName: this.translateSV.getValueByKey('PERIOD_FIRST_HALF_YEAR') },
    { PeriodID: Period.SecondHalfYear, PeriodName: this.translateSV.getValueByKey('PERIOD_SECOND_HALF_YEAR') },
    { PeriodID: Period.FullYear, PeriodName: this.translateSV.getValueByKey('PERIOD_FULL_YEAR') },
    { PeriodID: Period.ToDay, PeriodName: this.translateSV.getValueByKey('PERIOD_TODAY') },
    { PeriodID: Period.Custom, PeriodName: this.translateSV.getValueByKey('PERIOD_CUSTOM') },


  ];

  // Gía trị ngầm định của combo chọn thời gian báo báo 
  @Input()
  currentPeriodReport = Period.ThisMonth;

  // Gía trị thời gian báo báo 
  @Input() set inputPeriodReport(data) {
    if (data) {
      this.currentPeriodReport = data.Period;
      this.value.Period = data.Period;
      this.value.FromDate = data.FromDate;
      this.value.ToDate = data.ToDate;
    }
  }

  /**
   * Giá trị của daterange
   * Create by: dthieu:27.04.2020
   */
  value: any = {
    Period: this.currentPeriodReport,
    FromDate: this.getDateRangeByPeriod(this.currentPeriodReport).FromDate,
    ToDate: this.getDateRangeByPeriod(this.currentPeriodReport).ToDate
  };

  /**
   * Giá trị kỳ báo cáo
   */
  period: number;

  /**
   * Gía trị từ ngày
   */
  fromDate: any = "";

  /**
   * Giá trị đến ngày
   */
  toDate: any = "";

  /**
   * Giá trị text kỳ báo cáo
   */
  periodText: string = "";

  /**
   * Kiểm tra xem ngày tháng hợp lệ không
   */
  validateRange: boolean = true;

  /**
   * message lỗi
   */
  errorMessage: string = "";

  errorMessageFrom: string = "";

  errorMessageTo: string = "";

  errorMessagePeriod: string = this.translateSV.getValueByKey('REQUIRE_DATA_CONTENT');

  /**
   * Event xử lý thay đổi ngày tháng
   */
  @Output()
  changeTime: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  activeButtonApply: EventEmitter<any> = new EventEmitter<any>();

  isGetForecastAble: boolean = false;

  /**
   * Title: Label width của control
   * Created by: dthieu 04/10/2020
   */
  @Input()
  periodLabelWidth: string = '100px';

  @Input()
  fromdateLabelWidth: string = '100px';

  @Input()
  todateLabelWidth: string = '100px';

  /**
   * Text hiển thị kỳ quá khứ
   * dthieu 24/9/2020
   */
  previosText: string = this.translateSV.transform("PrevMonth");

  constructor(
    public amisTransferSV: AmisTransferDataService,
    public translateSV: AmisTranslationService,
  ) {
    super(amisTransferSV, translateSV);
  }

  ngOnInit() {
    const me = this;
    if (me.value.Period > 0) {
      const dateRange = me.getDateRangeByPeriod(this.currentPeriodReport);
      if (this.currentPeriodReport != Period.Custom) {
        me.value.Period = this.currentPeriodReport;
        me.value.FromDate = dateRange.FromDate;
        me.value.ToDate = dateRange.ToDate;
        me.fromDate = me.value.FromDate;
        me.toDate = me.value.ToDate;
      }
    }
  }

  /**
   * Bắt event thay đổi giá trị của combo
   * @param e
   */
  valuePeriodChanged(e) {
    const me = this;
    const vVal = e.itemData.PeriodID * 1;
    const dateRange = me.getDateRangeByPeriod(vVal);
    me.value.Period = dateRange.Period;
    me.value.FromDate = dateRange.FromDate;
    me.value.ToDate = dateRange.ToDate;

    this._isErrorFromDate = false;
    this._isErrorToDate = false;

    // bắn sự kiện để biết có sự thay đổi tham số để kích hoạt button áp dụng
    this.activeButtonApply.emit(true);

  }

  /**
   * Lấy giá trị ngầm định cho control
   * Created by: dthieu 20-08-2020
   */
  getDefaultFromSidebarReport(period) {
    const me = this;
    const dateRange = me.getDateRangeByPeriod(period);
    me.value.Period = dateRange.Period;
    me.value.FromDate = dateRange.FromDate;
    me.value.ToDate = dateRange.ToDate;
  }

  /**
   * Lấy về daterange theo kỳ báo cáo
   * @param period : Kỳ báo cáo
   */
  getDateRangeByPeriod(period: number) {
    const me = this;
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const oData = { FromDate: null, ToDate: null, Period: period };
    switch (period) {
      case Period.M1:
        oData.FromDate = new Date(currentYear, 0, 1);
        oData.ToDate = new Date(currentYear, 0, 31);
        break;
      case Period.M2:
        oData.FromDate = new Date(currentYear, 1, 1);
        if (
          currentYear % 400 === 0 ||
          (currentYear % 4 == 0 && currentYear % 100 !== 0)
        ) {
          oData.ToDate = new Date(currentYear, 1, 29);
        } else {
          oData.ToDate = new Date(currentYear, 1, 28);
        }
        break;
      case Period.M3:
        oData.FromDate = new Date(currentYear, 2, 1);
        oData.ToDate = new Date(currentYear, 2, 31);
        break;
      case Period.M4:
        oData.FromDate = new Date(currentYear, 3, 1);
        oData.ToDate = new Date(currentYear, 3, 30);
        break;
      case Period.M5:
        oData.FromDate = new Date(currentYear, 4, 1);
        oData.ToDate = new Date(currentYear, 4, 31);
        break;
      case Period.M6:
        oData.FromDate = new Date(currentYear, 5, 1);
        oData.ToDate = new Date(currentYear, 5, 30);
        break;
      case Period.M7:
        oData.FromDate = new Date(currentYear, 6, 1);
        oData.ToDate = new Date(currentYear, 6, 31);
        break;
      case Period.M8:
        oData.FromDate = new Date(currentYear, 7, 1);
        oData.ToDate = new Date(currentYear, 7, 31);
        break;
      case Period.M9:
        oData.FromDate = new Date(currentYear, 8, 1);
        oData.ToDate = new Date(currentYear, 8, 30);
        break;
      case Period.M10:
        oData.FromDate = new Date(currentYear, 9, 1);
        oData.ToDate = new Date(currentYear, 9, 31);
        break;
      case Period.M11:
        oData.FromDate = new Date(currentYear, 10, 1);
        oData.ToDate = new Date(currentYear, 10, 30);
        break;
      case Period.M12:
        oData.FromDate = new Date(currentYear, 11, 1);
        oData.ToDate = new Date(currentYear, 11, 31);
        break;
      case Period.ThisMonth:
        oData.FromDate = new Date(currentYear, currentMonth, 1);
        oData.ToDate = new Date(currentYear, currentMonth, me.getTotalDays(currentYear, currentMonth));
        break;
      case Period.NextMonth:
        if (currentMonth == 11) {
          oData.FromDate = new Date(currentYear + 1, 0, 1);
          oData.ToDate = new Date(currentYear + 1, 0, 31);
        }
        else {
          oData.FromDate = new Date(currentYear, currentMonth + 1, 1);
          oData.ToDate = new Date(currentYear, currentMonth + 1, me.getTotalDays(currentYear, currentMonth + 1));
        }

        break;
      case Period.FirstQuarter:
        oData.FromDate = new Date(currentYear, 0, 1);
        oData.ToDate = new Date(currentYear, 2, 31);
        break;
      case Period.SecondQuarter:
        oData.FromDate = new Date(currentYear, 3, 1);
        oData.ToDate = new Date(currentYear, 5, 30);
        break;
      case Period.ThirdQuarter:
        oData.FromDate = new Date(currentYear, 6, 1);
        oData.ToDate = new Date(currentYear, 8, 30);
        break;
      case Period.FourthQuarter:
        oData.FromDate = new Date(currentYear, 9, 1);
        oData.ToDate = new Date(currentYear, 11, 31);
        break;
      case Period.FirstHalfYear:
        oData.FromDate = new Date(currentYear, 0, 1);
        oData.ToDate = new Date(currentYear, 5, 30);
        break;
      case Period.SecondHalfYear:
        oData.FromDate = new Date(currentYear, 6, 1);
        oData.ToDate = new Date(currentYear, 11, 31);
        break;
      case Period.FullYear:
        oData.FromDate = new Date(currentYear, 0, 1);
        oData.ToDate = new Date(currentYear, 11, 31);
        break;
      case Period.PrevYear:
        oData.FromDate = new Date(currentYear - 1, 0, 1);
        oData.ToDate = new Date(currentYear - 1, 11, 31);
        break;
      case Period.NextYear:
        oData.FromDate = new Date(currentYear + 1, 0, 1);
        oData.ToDate = new Date(currentYear + 1, 11, 31);
        break;
      case Period.ThisQuarter:
        if (currentMonth >= 0 && currentMonth <= 2) {
          oData.FromDate = new Date(currentYear, 0, 1);
          oData.ToDate = new Date(currentYear, 2, 31);
        }
        else if (currentMonth >= 3 && currentMonth <= 5) {
          oData.FromDate = new Date(currentYear, 3, 1);
          oData.ToDate = new Date(currentYear, 5, 30);
        }
        else if (currentMonth >= 6 && currentMonth <= 8) {
          oData.FromDate = new Date(currentYear, 6, 1);
          oData.ToDate = new Date(currentYear, 8, 30);
        }
        else {
          oData.FromDate = new Date(currentYear, 9, 1);
          oData.ToDate = new Date(currentYear, 11, 31);
        }
        break;
      case Period.PrevQuarter:
        if (currentMonth >= 0 && currentMonth <= 2) {
          oData.FromDate = new Date(currentYear - 1, 9, 1);
          oData.ToDate = new Date(currentYear - 1, 11, 31);
        }
        else if (currentMonth >= 3 && currentMonth <= 5) {
          oData.FromDate = new Date(currentYear, 0, 1);
          oData.ToDate = new Date(currentYear, 2, 31);
        }
        else if (currentMonth >= 6 && currentMonth <= 8) {
          oData.FromDate = new Date(currentYear, 3, 1);
          oData.ToDate = new Date(currentYear, 5, 30);
        }
        else {
          oData.FromDate = new Date(currentYear, 6, 1);
          oData.ToDate = new Date(currentYear, 8, 30);
        }
        break;
      case Period.NextQuarter:
        if (currentMonth >= 0 && currentMonth <= 2) {
          oData.FromDate = new Date(currentYear, 3, 1);
          oData.ToDate = new Date(currentYear, 5, 30);
        }
        else if (currentMonth >= 3 && currentMonth <= 5) {
          oData.FromDate = new Date(currentYear, 6, 1);
          oData.ToDate = new Date(currentYear, 8, 30);
        }
        else if (currentMonth >= 6 && currentMonth <= 8) {
          oData.FromDate = new Date(currentYear, 9, 1);
          oData.ToDate = new Date(currentYear, 11, 31);
        }
        else {
          oData.FromDate = new Date(currentYear + 1, 0, 1);
          oData.ToDate = new Date(currentYear + 1, 2, 31);
        }
        break;

      case Period.ToDay:
        oData.FromDate = moment().startOf('day').toDate();
        oData.ToDate = moment().toDate();
        break;

      case Period.ThisWeek:
        oData.FromDate = moment().startOf('isoWeek').startOf('day').toDate();
        oData.ToDate = moment().endOf('isoWeek').startOf('day').toDate();
        break;
      case Period.NextWeek:
        oData.FromDate = moment().add(1, 'weeks').startOf('isoWeek').startOf('day').toDate();
        oData.ToDate = moment().add(1, 'weeks').endOf('isoWeek').startOf('day').toDate();
        break;

      case Period.Custom:
        oData.FromDate = me.fromDate;
        oData.ToDate = me.toDate;
        break;
    }
    // me.previosText = me.setDisplayPreviosText(oData.FromDate,oData.ToDate);
    return oData;
  }

  /**
   * Hàm lấy về tổng số ngày của tháng
   * @param year : Năm
   * @param month : tháng (Bắt đầu từ 0)
   * Create by: dthieu:02.05.2020
   */
  getTotalDays(year: number, month: number) {
    switch (month) {
      case 1:
        if (year % 400 === 0 || (year % 4 == 0 && year % 100 !== 0)) {
          return 29;
        } else {
          return 28;
        }
      case 0:
      case 2:
      case 4:
      case 6:
      case 7:
      case 9:
      case 11:
        return 31;
      default:
        return 30;
    }
  }

  /**
   * Event thay đổi giá trị from date
   * @param e
   * Create by: dthieu:02.05.2020
   */
  _isErrorFromDate = false;
  _isErrorToDate = false;

  fromdate_valueChanged(e) {
    const me = this;
    me.value.Period = Period.Custom;
    if (!e) {
      me.value.Period = Period.Custom;
      me.period = Period.Custom;
      me.value.FromDate = "";
      me.fromDate = "";
      me.errorMessageFrom = me.translateSV.getValueByKey("FROM_DATE_IS_NOT_EMPTY");
      // bắn sự kiện để biết có sự thay đổi tham số để kích hoạt button áp dụng
      this.activeButtonApply.emit(false);
      me._isErrorFromDate = true;
    } else {
      const time = e.getTime();

      if (!me.fromDate || time !== new Date(me.fromDate).getTime()) {
        let temp = 0;
        if (me.value.ToDate) {
          temp = time - new Date(me.value.ToDate).getTime();
        }
        else if (me.toDate) {
          temp = time - new Date(me.toDate).getTime();
        }
        else if (!me.value.ToDate && !me.toDate) {
          temp = 1;
        }
        if (temp > 0) {
          if (temp == 1) {
            me.errorMessageFrom = me.translateSV.getValueByKey("FROM_DATE_IS_NOT_EMPTY");
            // bắn sự kiện để biết có sự thay đổi tham số để kích hoạt button áp dụng
            this.activeButtonApply.emit(false);
          }
          else {
            me.errorMessageFrom = me.translateSV.getValueByKey("FROM_DATE_MUST_BE_SMALLER_THAN_TO_DATE");
            // bắn sự kiện để biết có sự thay đổi tham số để kích hoạt button áp dụng
            this.activeButtonApply.emit(false);
          }
          me._isErrorFromDate = true;
        }
        else {
          me.errorMessageFrom = "";
          me._isErrorFromDate = false;
          me._isErrorToDate = false;
          // bắn sự kiện để biết có sự thay đổi tham số để kích hoạt button áp dụng
          this.activeButtonApply.emit(true);
        }
        me.fromDate = new Date(e);
      }
    }
  }

  /**
   * Event thay đổi giá trị to date
   * @param e
   * Create by: dthieu:02.05.2020
   */
  todate_valueChanged(e) {
    const me = this;
    me.value.Period = Period.Custom;
    if (!e) {
      me.value.Period = Period.Custom;
      me.period = Period.Custom;
      me.value.ToDate = "";
      me.toDate = "";
      me.errorMessageTo = me.translateSV.getValueByKey("TO_DATE_IS_NOT_EMPTY");
      // bắn sự kiện để biết có sự thay đổi tham số để kích hoạt button áp dụng
      this.activeButtonApply.emit(false);
      me._isErrorToDate = true;
    } else {
      var time = e.getTime();

      if (!me.toDate || time !== new Date(me.toDate).getTime()) {
        let temp = 0;
        if (me.value.FromDate) {
          temp = time - new Date(me.value.FromDate).getTime();
        }
        else if (me.fromDate) {
          temp = time - new Date(me.fromDate).getTime();
        }
        else if (!me.value.FromDate && !me.fromDate) {
          temp = -1;
        }
        if (temp < 0) {
          if (temp == -1) {
            me.errorMessageTo = me.translateSV.getValueByKey("TO_DATE_IS_NOT_EMPTY");
            // bắn sự kiện để biết có sự thay đổi tham số để kích hoạt button áp dụng
            this.activeButtonApply.emit(false);
          }
          else {
            me.errorMessageTo = me.translateSV.getValueByKey("TO_DATE_MUST_BE_BIGGER_THAN_FROM_DATE");
            // bắn sự kiện để biết có sự thay đổi tham số để kích hoạt button áp dụng
            this.activeButtonApply.emit(false);
          }
          me._isErrorToDate = true;
        }
        else {
          me.errorMessageTo = "";
          me._isErrorToDate = false;
          me._isErrorFromDate = false;
          // bắn sự kiện để biết có sự thay đổi tham số để kích hoạt button áp dụng
          this.activeButtonApply.emit(true);
        }
        me.toDate = new Date(e);
      }
    }
  }

  /**
   * Kiểm tra xem có tồn tại kỳ báo cáo không
   * Create by: dthieu:02.05.2020
   */
  checkExistsPeriod() {

  }

  /**
   * Set giá trị hiển thị cho text kỳ quá khứ
   * dthieu 24/9/2020
   */
  setDisplayPreviosText(fromDate, toDate) {
    const me = this,
      firstDayOfFirstHalfYear = `${fromDate.getFullYear()}-01-01`,
      lastDayOfFirstHalfYear = `${fromDate.getFullYear()}-06-30`,
      firstDayOfSecondHalfYear = `${fromDate.getFullYear()}-07-01`,
      lastDayOfSecondHalfYear = `${fromDate.getFullYear()}-12-31`,
      timeFromDate = fromDate.getTime(),
      timeToDate = toDate.getTime();
    if (fromDate && toDate) {
      // Tròn tuần
      if (timeFromDate == moment(fromDate).startOf('W').toDate().getTime() && timeToDate == moment(fromDate).endOf('W').startOf('D').toDate().getTime()) {
        me.isGetForecastAble = false;
        return me.translateSV.transform("PrevWeek");
      }
      // Tròn tháng từ 1 đến 12
      else if (timeFromDate == moment(fromDate).startOf('M').toDate().getTime() && timeToDate == moment(fromDate).endOf('M').startOf('D').toDate().getTime()) {
        me.isGetForecastAble = true;
        return me.translateSV.transform("PrevMonth");
      }
      // Tròn quý
      else if (timeFromDate == moment(fromDate).startOf('Q').toDate().getTime() && timeToDate == moment(fromDate).endOf('Q').startOf('D').toDate().getTime()) {
        me.isGetForecastAble = true;
        return me.translateSV.transform("PrevQuarter");
      }
      // Tròn 6 tháng
      else if ((timeFromDate == moment(firstDayOfFirstHalfYear).startOf('D').toDate().getTime() && timeToDate == moment(lastDayOfFirstHalfYear).startOf('D').toDate().getTime())
        || (timeFromDate == moment(firstDayOfSecondHalfYear).startOf('D').toDate().getTime() && timeToDate == moment(lastDayOfSecondHalfYear).startOf('D').toDate().getTime())) {
        me.isGetForecastAble = true;
        return me.translateSV.transform("PrevSixMonth");
      }
      // Tròn năm
      else if (timeFromDate == moment(firstDayOfFirstHalfYear).startOf('D').toDate().getTime() && timeToDate == moment(lastDayOfSecondHalfYear).startOf('D').toDate().getTime()) {
        me.isGetForecastAble = true;
        return me.translateSV.transform("PrevYear");
      }
      else {
        me.isGetForecastAble = false;
        return "-";
      }
    }
    else {
      me.isGetForecastAble = false;
      return "-";
    }
  }

  changeComboboxPeriod(e) {
    console.log(e);
  }
}
