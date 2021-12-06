import { Injectable } from "@angular/core";
import * as localforage from "localforage";
import { AppCode } from 'src/app/shared/appCode';

@Injectable({
  providedIn: "root"
})
export class AmisCacheService {

  store = localforage.createInstance({
    name: `AMIS_${AppCode}`
  });

  constructor() {
  }


  /**
   * Set Cache
   * @param {string} code 
   * @param {any} data 
   * @memberof AmisCacheService
   * created by vhtruong - 16/06/2020
   */
  setCache(key: string, data) {
    return this.store.setItem(key, data);
  }


  /**
   * Get cache
   * @param {string} code 
   * @returns 
   * @memberof AmisCacheService
   * created by vhtruong - 16/06/2020
   */
  getCache(key: string) {
    return this.store.getItem(key);
  }


  /**
   * Xóa cache
   * @param {string} code 
   * @memberof AmisCacheService
   * created by vhtruong - 16/06/2020
   */
  removeCache(key: string) {
    return this.store.removeItem(key);
  }


  /**
   * Xóa toàn bộ cache
   * @memberof AmisCacheService
   * created by vhtruong - 16/06/2020
   */
  clearAlLCache() {
    return this.store.clear();
  }

}