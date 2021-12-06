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
export class UploadService extends BaseService<any> {

  // public static fileAccept = '.doc, .xls, .ppt, .docx, .xlsx, .pptx, .odt, .ods, .odp, .pdf, .rtf, .xmind, .mmap, .zip, .7z, .rar, .png, .jpg, .jpeg, .gif, .html, .htm, .dwg, .dwf, .edb, .e2k';
  public static fileAccept = AppConfigService.settings.fileExtension;
  hostApi!: string;
  url!: string;
  controller = "Upload";
  constructor(
    protected http: HttpService,
    protected configSV: AppConfigService<AppConfig>,
  ) {
    super(http, configSV);
    this.controller = "Upload";
    this.getApiURL();
    this.url = this.hostApi + "/" + this.controller;
  }

  /**
   * Thêm vào thu mục tạm
   *
   * @param {File} file
   * @param {any} uploadType
   * @returns {Observable<any>}
   * @memberof UploadService
   */
  uploadFileTemp(file: File, uploadType): Observable<any> {
    const formData = new FormData();
    formData.append("file", file, file.name);
    const uri = `${this.url}/${uploadType}?temp=1`;
    const req = this.http.post(uri, formData);
    return req;
  }

  /**
   * Upload nhiều vào thư mục tạm
   *
   * @param {Array<File>} files
   * @param {any} uploadType
   * @returns {Observable<any>}
   * @memberof UploadService
   */
  uploadMultipleFileTemp(files: Array<File>, uploadType): Observable<any> {
    const formData = new FormData();
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      formData.append("files", file, file.name);
    }
    const uri = `${this.url}/${uploadType}?temp=1`;
    const req = this.http.post(uri, formData);
    return req;
  }

  /**
   * hàm upload vào mục tạm
   * cre nvcuong1 (12/2/2020)
   * @param {FormData} formData
   * @returns {Observable<any>}
   * @memberof UploadService
   */
  uploadMultiFileToTemp(files: Array<File>, uploadType): Observable<any> {
    const formData = new FormData();
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      formData.append("files", file, file.name);
    }
    const uri = `${this.url}/uploadWithConvertToPDF/${uploadType}?temp=1`;
    const req = this.http.post(uri, formData);
    return req;
  }

  /**
   * Hàm xử lý upload file -> MISA storage
   * CreatedBy: PDXuan(02/12/2019)
   * @param {File} file
   * @param {any} uploadType
   * @returns {Observable<any>}
   * @memberof UploadService
   */
  //   uploadFileHandle(file: File, uploadType): Observable<any> {
  //     const formData = new FormData();
  //     formData.append("file", file, file.name);
  //     return this.http.post(this.url + "/" + uploadType, formData).pipe(
  //       tap(data => {
  //         return data;
  //       }),
  //       catchError(error => of(error))
  //     );
  //   }
  uploadFileHandle(file: File, uploadType): Observable<any> {
    const formData = new FormData();
    formData.append("file", file, file.name);
    const uri = `${this.url}/${uploadType}`;
    const req = this.http.post(uri, formData);
    return req;
  }

  /**
   * Hàm xử lý upload nhiều
   * CreatedBy: PVTHONG(14/03/2020)
   * @param {File} file
   * @param {any} uploadType
   * @param {boolean} temp
   * @returns {Observable<any>}
   * @memberof UploadService
   * ModifiedBy: dtnam1(14/08/2020) - thêm param temp
   */
  uploadFileHandleMultiple(files: Array<File>, uploadType, temp = false): Observable<any> {
    const formData = new FormData();
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      formData.append("files", file, file.name);
    }
    return this.http.post(`${this.url}/${uploadType}?temp=${temp}`, formData).pipe(
      tap(data => {
        return data;
      }),
      catchError(error => of(error))
    );
  }



  /**
   * Lấy url upload
   *
   * @param {number} uploadType
   * @param {boolean} temp
   * @returns
   * @memberof UploadService
   */
  makeAPIUpload(uploadType: number, temp: boolean): string {
    return `${this.url}/${uploadType}?temp=${temp}`;
  }
}
