import * as _ from "lodash";
import * as moment from "moment";
import { addMonths, subDays, addDays } from 'date-fns';

export class AmisDateUtils {


  /**
   * Kiểm tra một object có phải kiểu date hay không
   */
  public static isDate(date) {
    return _.isDate(date);
  }


  /**
   * Kiểm tra nhỏ hơn ngày
   * created by vhtruong - 24/06/2020
   */
  public static validateBeforeDate(val, maxDate: Date) {
    if (val) {
      if (moment(new Date(val)).isBefore(moment(new Date(maxDate)), 'days')) {
        return true;
      }
    }
    return false;
  }


  /**
   * Kiểm tra lớn hơn ngày
   * created by vhtruong - 24/06/2020
   */
  public static validateAfterDate(val, minDate: Date) {
    if (val) {
      if (moment(new Date(val)).isAfter(moment(new Date(minDate)), 'days')) {
        return true;
      }
    }
    return false;
  }

  /**
   * Validate min date ( truyền vào date )
   * created by vhtruong - 09/03/2020
   */
  public static validateMinDate(val, minDate: Date) {
    if (val) {
      if (moment(new Date(val)).isSameOrAfter(moment(new Date(minDate)), 'days')) {
        return true;
      }
    }
    return false;
  }

  /**
   * Validate max date ( truyền vào date )
   * created by vhtruong - 09/03/2020
   */
  public static validateMaxDate(val, maxDate: Date) {
    if (val) {
      if (moment(new Date(val)).isSameOrBefore(moment(new Date(maxDate)), 'days')) {
        return true;
      }
    }
    return false;
  }

  /**
   * Validate nhỏ hơn ngày hiện tại
   * created by vhtruong - 09/03/2020
   */
  public static validateBeforeCurrentDate(val) {
    if (val) {
      if (moment(new Date(val)).isBefore(moment(new Date()), 'days')) {
        return true;
      }
    }
    return false;
  }

  /**
   * Validate nhỏ hơn hoặc bằng ngày hiện tại
   * created by vhtruong - 09/03/2020
   */
  public static validateSameOrBeforeCurrentDate(val) {
    if (val) {
      if (moment(new Date(val)).isSameOrBefore(moment(new Date()), 'days')) {
        return true;
      }
    }
    return false;
  }

  /**
   * Validate lớn hơn ngày hiện tại
   * created by vhtruong - 09/03/2020
   */
  public static validateAfterCurrentDate(val) {
    if (val) {
      if (moment(new Date(val)).isAfter(moment(new Date()), 'days')) {
        return true;
      }
    }
    return false;
  }

  /**
   * Validate lớn hơn hoặc bằng ngày hiện tại
   * created by vhtruong - 09/03/2020
   */
  public static validateSameOrAfterCurrentDate(val) {
    if (val) {
      if (moment(new Date(val)).isSameOrAfter(moment(new Date()), 'days')) {
        return true;
      }
    }
    return false;
  }

  /**
   * Hàm kiểm tra ngày  = ngày hiện tại
   * @static
   * @param {any} val
   * @returns
   * @memberof AmisDateUtils
   * DNCuong(30/03/2020)
   */
  public static validateSameDay(val) {
    if (val) {
      if (moment(new Date(val)).isSame(moment(new Date()), 'days')) {
        return true;
      }
    }
    return false;
  }

  // lấy thứ 2 cùng tuần với ngày truyền vào
  public static getMonday(d: any) {
    d = new Date(d);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // kiểm tra nếu là chủ nhật
    return new Date(d.setDate(diff));
  }
  // lấy chủ nhật cùng tuần với ngày truyền vào
  public static getSunday(d: any) {
    d = new Date(d);
    const day = d.getDay();
    const diff = d.getDate() - day + 7; // kiểm tra nếu là chủ nhật
    return new Date(d.setDate(diff));
  }
  /**
   * Hàm xử lý lấy startDate
   * CreatedBy: PDXuan(21/10/2019)
   * @param {Date} date
   */
  public static getSelectedFirstDate(date: Date) {
    return new Date(`${date.getMonth() +
      1}/${date.getDate()}/${date.getFullYear()} 00:00:00 AM`);
  }

  /**
   * Hàm lấy endDate
   * @param {Date} date
   * @returns
   */
  public static getSelectedEndDate(date: Date) {
    return new Date(`${date.getMonth() +
      1}/${date.getDate()}/${date.getFullYear()} 11:59:00 PM`);
  }
  /**
   * Hàm tạo một ngày mới từ ngày truyền vào
   * nvcuong1
   * @param {Date} date ngày truyền vào
   * @param {number} dayValue index ngày trong tuần
   * @returns ngày mới
   */
  public static buildDate(date: Date, dayValue: number) {
    if (date) {
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate() + dayValue;
      return new Date(year, month, day);
    }
    return null;
  }
  /**
   * hàm lấy ngày đầu trong tab tháng
   * param: date = ngày bất kì của tháng đó
   * Create by: nvcuong1:22.10.2019
   */
  public static getFirstDateOfMonthCalendar(date: Date): Date {

    // khởi tạo biến trả về ngày có dateIndex = 1
    const firstDateOfMonth: Date = new Date(
      date.getFullYear(),
      date.getMonth(), 1, 0, 0, 0, 0);

    // lấy số ngày của tháng trước xuất hiện trong tab tháng
    const numberDaysOfPreviousMonth =
      firstDateOfMonth.getDay() === 0 ? 6 : firstDateOfMonth.getDay() - 1;

    // lấy ngày đầu hiện ra giao diện
    const firstDateOfMonthCalendar: Date = subDays(firstDateOfMonth, numberDaysOfPreviousMonth);
    firstDateOfMonthCalendar.setHours(0, 0, 0, 0);
    return firstDateOfMonthCalendar;
  }

  /**
   * hàm lấy ngày cuối cùng trong tab tháng
   * param: date = ngày bất kì của tháng đó
   * Create by: nvcuong1:22.10.2019
   */
  public static getLastDateOfMonthCalendar(date: Date): Date {

    // khởi tạo biến trả về ngày có dateIndex = 1
    const firstDateOfMonth: Date = new Date(
      date.getFullYear(),
      date.getMonth(), 1, 0, 0, 0, 0);

    // Ngày đầu tiên của tháng sau
    const firstDateOfNextMonth: Date = addMonths(firstDateOfMonth, 1);

    // Ngày cuối cùng của tháng hiện tại = ngày đầu tiên tháng sau - 1
    const lastDateOfMonth: Date = subDays(firstDateOfNextMonth, 1);

    // Số ngày của tháng sau cần hiện thị trên giao diện
    const numberDaysOfNextMonth =
      lastDateOfMonth.getDay() === 0 ? 0 : 7 - lastDateOfMonth.getDay();

    // lấy ngày cuối cùng ra giao diện
    const lastDateOfMonthCalendar: Date = addDays(lastDateOfMonth, numberDaysOfNextMonth);
    lastDateOfMonthCalendar.setHours(23, 59, 59, 999);
    return lastDateOfMonthCalendar;
  }
  /**
   * hàm so sánh ngày A có > ngày B?
   * Create by: nvcuong1:22.10.2019
   */
  public static commpareLaterDate(dateA, dateB) {
    const a = new Date(dateA).getTime();
    const b = new Date(dateB).getTime();
    return a > b;
  }

  // hàm format date dd/MM/yyyy
  public static formatDate(sdate: string) {
    if (sdate || sdate !== undefined) {
      const date: Date = new Date(sdate);
      return `${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}/${
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1
        }/${date.getFullYear()}`;
    }
    return null;
  }
  // hàm format date dd/MM/yyyy (hh:mm)
  public static formatDateHour(sdate: string) {
    const date: Date = new Date(sdate);
    return `${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}/${
      date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1
      }/${date.getFullYear()} (${
      date.getHours() < 10 ? "0" + date.getHours() : date.getHours()
      }:${date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()})`;
  }

  /**
   * Hàm kiểm tra ngày  = ngày hiện tại
   * @static
   * @param {any} val
   * @returns
   * @memberof AmisDateUtils
   * DNCuong(30/03/2020)
   */
  public static compareSameDates(date1, date2) {
    if (date1 && date2) {
      if (moment(new Date(date1)).isSame(moment(new Date(date2)), 'days')) {
        return true;
      }
    }
    return false;
  }


}

/**
 * hàm lấy ra index của ngày, dùng để phân biệt các ngày trong năm
 * created by nvcuong1
 * @export
 * @param {Date} date ngày truyền vào
 * @returns {string} id dựa theo ngày đó
 */
export function getDateIndex(date: Date): string {
  return `${date.getDate()}${date.getMonth()}${date.getFullYear()}`;
}
