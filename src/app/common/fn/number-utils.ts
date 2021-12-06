import * as _ from 'lodash';

export class AmisNumberUtils {
  public static Trim(value: any, whitespace?: string) {
    return _.trim(value, whitespace);
  }

  /**
   * Validate nhỏ hơn
   * created by vhtruong - 22/05/2020
   */
  public static validateMinNumber(val, minNumber: Number) {
    if (val) {
      if (val > minNumber) {
        return true;
      }
    }
    return false;
  }

  /**
   * Validate lớn hơn
   * created by vhtruong - 22/05/2020
   */
  public static validateMaxNumber(val, maxNumber: Number) {
    if (val) {
      if (val < maxNumber) {
        return true;
      }
    }
    return false;
  }
  /**
   * format số thực
   * created by vbcong - 25/05/2020
   */
  public static formatDecimalNumber(val) {
    if (val) {
      return val.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    }
    return false;
  }
  /**
   * format số thực
   * created by vbcong - 25/05/2020
   */
  public static currenctFormatVN(val) {
    if (val) {
      return val.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    }
    return false;
  }
  /**
   * format tiền tệ
   * created by vbcong - 25/05/2020
   */
  public static currenctFormatUS(val) {
    if (val) {
      return `$ ${val.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`;
    }
    return false;
  }
}
