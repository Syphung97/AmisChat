import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import * as moment from 'moment';
/**
 * Chọn 2 ngày 
 * 
 * @export
 * @class RangedateComponent
 * @implements {OnInit}
 * created by vhtruong 19/08/2019
 */
@Component({
  selector: 'amis-rangedate',
  templateUrl: './amis-rangedate.component.html',
  styleUrls: ['./amis-rangedate.component.scss']
})

export class AmisRangedateComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    this.showFromDate = this.fromDate
    this.showToDate = this.toDate
  }

  @Output() FDateChange: EventEmitter<Date> = new EventEmitter<Date>()
  @Input() set FDate(value) {
    this.fromDate = value
  }

  @Output() TDateChange: EventEmitter<Date> = new EventEmitter<Date>()
  @Input() set TDate(value) {
    this.toDate = value
  }

  fromDate: Date = new Date()
  toDate: Date = new Date()
  showFromDate: Date
  showToDate: Date
  isShowPopup: boolean = false
  value: string = ""

  /**
   * Mở popup chọn ngày
   * 
   * @memberof RangedateComponent
   * created by vhtruong 19/08/2019
   */
  showPopup() {
    this.isShowPopup = true
  }

  /**
   * Sự kiện khi chọn 1 trong 2 nagỳ
   * 
   * @memberof RangedateComponent
   * created by vhtruong 19/08/2019
   */
  valueChangedDate() {
    if (moment(this.fromDate).isSameOrBefore(moment(this.toDate))) {
      this.showFromDate = this.fromDate
      this.showToDate = this.toDate
    }
    else {
      this.showFromDate = this.toDate
      this.showToDate = this.fromDate
    }
  }

  /**
   * Đồng ý với lựa chọn và đóng popup
   * 
   * @memberof RangedateComponent
   * created by vhtruong 19/08/2019
   */
  apply() {
    if (this.showFromDate && this.showToDate) {
      this.value = this.convertDateToString(this.showFromDate) + " - " + this.convertDateToString(this.showToDate)
    }
    else {
      if (this.showFromDate) {
        this.value = this.convertDateToString(this.showFromDate)
      }
      if (this.showToDate) {
        this.value = this.convertDateToString(this.showToDate)
      }
    }
    this.FDateChange.emit(this.showFromDate)
    this.TDateChange.emit(this.showToDate)
    this.isShowPopup = false
  }

  /**
   * Chuyển từ object ngày sang string dd/mm/yyyy
   * 
   * @param {Date} date 
   * @returns 
   * @memberof RangedateComponent
   * created by vhtruong 19/08/2019
   */
  convertDateToString(date: Date) {
    let res: string = ""
    if (date) {
      res = this.convertDayToString(date.getDate()) + "/" + this.convertMonthToString(date.getMonth()) + "/" + date.getFullYear()
    }
    return res
  }

  /**
   * Chuyển tháng sang string
   * 
   * @param {number} month 
   * @returns 
   * @memberof RangedateComponent
   * created by vhtruong 19/08/2019
   */
  convertMonthToString(month: number) {
    let res: string = ""
    if (month <= 8) {
      res = "0" + (month + 1)
    }
    else {
      res = (month + 1).toString()
    }
    return res
  }

  /**
   * Chuyển ngày sang string
   * 
   * @param {number} day 
   * @returns 
   * @memberof RangedateComponent
   * created by vhtruong 19/08/2019
   */
  convertDayToString(day: number) {
    let res: string = ""
    if (day <= 9) {
      res = "0" + day
    }
    else {
      res = (day).toString()
    }
    return res
  }

}
