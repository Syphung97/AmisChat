import { AppCode } from 'src/app/shared/appCode';

export class SessionStorageUtils {

  /**
   * Đọc thông tin lưu trong sessionStorage
   * @param key : Key lưu trữ
   * Create by: dthieu:30.6.2020
   */
  public static get(key: string) {
    if (this.checkBrowserSupport()) {
      key = this.getKey(key);
      return window.sessionStorage.getItem(key);
    }
    return null;
  }

  /**
   * Lưu value vào trong sessionStorage
   * @param key : Key lưu trữ
   * Create by: dthieu:30.6.2020
   */
  public static set(key: string, value: any) {
    if (this.checkBrowserSupport()) {
      key = this.getKey(key);
      return window.sessionStorage.setItem(key, value);
    }
    return null;
  }

  /**
   * Xóa key lưu trong sessionStorage
   * @param key : Key lưu trữ
   * Create by: dthieu:30.6.2020
   */
  public static remove(key: string) {
    if (this.checkBrowserSupport()) {
      key = this.getKey(key);
      if (window.sessionStorage.getItem(key)) {
        window.sessionStorage.removeItem(key);
      }
    }
  }

  /**
   * Xóa hết thông tin lưu trong localstorage
   * Create by: dthieu:30.6.2020
   */
  public static removeAll() {
    if (this.checkBrowserSupport()) {
      window.sessionStorage.clear();
    }
  }

  /**
   * Kiểm tra trình duyệt có hỗ trợ  localstorage hay không
   * Create by: dthieu:30.6.2020
   */
  public static checkBrowserSupport() {
    if (typeof Storage !== "undefined") {
      return true;
    }
    console.log("Sorry! No web storage support!");
    return false;
  }

  /**
   * Lấy key theo app
   * created by vhtruong - 12/06/2020
   */
  public static getKey(key: string) {
    if (key) {
      return `AMIS_${AppCode}_${key}`;
    }
  }

  /**
   * reset lại gt theo key trong sessionStorage
   * @param key : Key lưu trữ
   * Create by: dtnam1:30.6.2020
   */
  public static reset(value: any, key: string) {
    this.remove(key);
    if (typeof (value) !== "string"){
      value = JSON.stringify(value);
    }
    this.set(key, value);
  }
}
