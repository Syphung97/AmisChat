import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { AppConfig } from '../models/AppConfig';
import { BaseModel } from '../models/BaseModel';
import { ServiceResponse } from '../models/ServerResponse';
import { AppConfigService } from './app-config.service';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class BaseService<T extends BaseModel> {

  protected hostApi;
  protected controller!: string;
  constructor(
    protected http: HttpService,
    protected config: AppConfigService<AppConfig>
  ) {
    this.hostApi = AppConfigService.settings.apiServer;
   }

  getApiURL(): string {
    const lastCharacter = this.hostApi.substr(this.hostApi.length - 1);
    if (lastCharacter === "/") {
      return `${this.hostApi}${this.controller}`;
    }
    return `${this.hostApi}/${this.controller}`;
  }


  /**
   * Title: Lưu dữ liệu
   * Created by: PTĐạt 22-11-2019
   */
  save(data: T, opt?: object): Observable<ServiceResponse> {
    return this.http.post<ServiceResponse>(`${this.getApiURL()}/save`, data);
  }

  /**
   * Title: Lấy dữ liệu theo ID
   * Created by: PTĐạt 22-11-2019
   */
  getByID(id: number): Observable<ServiceResponse> {
    return this.http.get<ServiceResponse>(`${this.getApiURL()}/getByID/${id}`);
  }

  /**
   * Title: Xóa dữ liệu
   * Created by: PTĐạt 22-11-2019
   * modified nmduy 14/03/2020
   */
  delete(data: Array<T>): Observable<ServiceResponse> {
    const uri = `${this.getApiURL()}/delete`;
    const configParams = { body: data };
    return this.http.delete<ServiceResponse>(uri, configParams);
  }

  /**
   * Title: Lưu dữ liệu
   * Created by: PTĐạt 22-11-2019
   */
  saveList(data: Array<T>, opt?: object): Observable<ServiceResponse> {
    return this.http.post<ServiceResponse>(`${this.getApiURL()}/save-list`, data);
  }

  /**
   * Title: Lấy tất cả dữ liệu
   * Created by: PTĐạt 22-11-2019
   * Edit by: LCLIEM 28/11/2019: Thêm option filter và sort. Khi truyền lên đều phải mã hóa base64
   * filter có dạng: [["FullName","=","a"],"and",["Email","contains","b"]]
   * sort có dạng: [{"selector": "JobPositionName", "desc": "false"}]
   */
  getAll = (filter?, sort?): Observable<ServiceResponse> => {
    const bodyData = {
      Filter: filter || "",
      Sort: sort || ""
    };
    return this.http.post<ServiceResponse>(`${this.getApiURL()}/getAll`, bodyData);
  }

  /**
   * Title: Cập nhật dữ liệu theo trường
   * Created by: NMDUY 13/03/20
   */
  updateField(data: any): Observable<ServiceResponse> {
    return this.http.post<ServiceResponse>(`${this.getApiURL()}/update-field`, data);
  }
}
