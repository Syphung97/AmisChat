import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AppConfig } from '../models/AppConfig';
import { AppConfigService } from './app-config.service';
import { BaseService } from './base.service';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class DownloadService extends BaseService<any> {
  hostApi!: string;
  url!: string;
  controller = "Download";
  constructor(
    protected http: HttpService,
    protected configSV: AppConfigService<AppConfig>,
  ) {
    super(http, configSV);
    this.controller = "Download";
    this.getApiURL();
    this.url = this.hostApi + "/" + this.controller;
  }

  /**
   * Hàm xử lí việc lấy file về để hiển thị
   * @param {File} file
   * @returns {Observable<any>}
   * @memberof DownloadService
   */
  dowloadFileHandle(fileName, uploadType): Observable<any> {
    return this.http.get(`${this.url}/base64/${fileName}/${uploadType}`).pipe(
      tap(data => {
        return data;
      }), catchError(
        error => of(error)
      )
    );
  }

  /**
   * Trả về link handle lấy ra ảnh hiển thị
   * @param {any} fileName
   * @param {any} uploadType
   * @returns
   * @memberof DownloadService
   * CREATED BY: DNCuong(02/12/2019)
   */
  makeApiDownloadHandle(fileName, uploadType, isTemp): string {

    return `${this.url}/file/${uploadType}/${fileName}?temp=${isTemp}`;
  }

  /**
   * Trả về link handle lấy ra ảnh hiển thị trong temp
   * @param {any} fileName
   * @param {any} uploadType
   * @returns
   * @memberof DownloadService
   * CREATED BY: vhtruong ( 03/02/2020 )
   */
  makeApiDownloadTempFileHandle(fileName, uploadType): string {
    return `${this.url}/file/${uploadType}/${fileName}?temp=true`;
  }

  /**
   * Trả về Token file download
   * @param {any} fileName
   * @param {any} uploadType
   * @returns
   * @memberof DownloadService
   * CREATED BY: PVTHONG(05/12/2019)
   */
  getTokenFile(fileName, uploadType, temp = false): Observable<any> {
    return this.http.get(`${this.url}/${uploadType}/${fileName}?temp=${temp}`).pipe(
      tap(data => {
        return data;
      }), catchError(
        error => of(error)
      )
    );
  }

  /**
   * Trả về link file download xuống trình duyệt
   * @param {any} fileName
   * @param {any} uploadType
   * @returns
   * @memberof DownloadService
   * CREATED BY: PVTHONG(04/12/2019)
   */
  downloadFile(token): string {
    return `${this.url}/${token}`;
  }
}
