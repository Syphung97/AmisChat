import { Injectable } from "@angular/core";
import { BaseEntity } from "../models/base-entity";
import { Observable } from "rxjs";
import { ServerResponse } from "../models/server-reponse";
import { HttpService } from "./http.service";
import { ConfigService } from "./app-config.service";
import { AppConfig } from "../models/app-config";
import { FieldUpdate } from '../models/common/field-update';


export class AMISBaseService<T extends BaseEntity> {

  protected hostApi;


  constructor(
    protected http: HttpService,
    protected controller: string,
    protected config: ConfigService<AppConfig>
  ) {
    this.hostApi = (ConfigService.settings as AppConfig).apiServer;
   }


  /**
   * Lấy về chuỗi url
   * @returns
   * @memberof BaseService
   */
  getApiURL() {
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
  save(data: T, opt?: object): Observable<ServerResponse> {
    return this.http.post<ServerResponse>(`${this.getApiURL()}/save`, data);
  }

  /**
   * Title: Lấy dữ liệu theo ID
   * Created by: PTĐạt 22-11-2019
   */
  getByID(id: number): Observable<ServerResponse> {
    return this.http.get<ServerResponse>(`${this.getApiURL()}/getByID/${id}`);
  }


  /**
   * Lấy thông tin master and detail
   * @param {number} id 
   * @returns {Observable<ServerResponse>} 
   * @memberof AMISBaseService
   * created by vhtruong - 09/07/2020
   */
  getByIDAndDetail(id): Observable<ServerResponse> {
    return this.http.get<ServerResponse>(`${this.getApiURL()}/form-data/${id}`);
  }

  /**
   * Title: Xóa dữ liệu
   * Created by: PTĐạt 22-11-2019
   * modified nmduy 14/03/2020
   */
  delete(data: Array<T>): Observable<ServerResponse> {
    const uri = `${this.getApiURL()}/delete`;
    const configParams = { body: data };
    return this.http.delete<ServerResponse>(uri, configParams);
  }

  /**
   * Title: Xóa dữ liệu theo id
   * Created by: dtnam1 14/07/2020
   */
  deleteDataByID(id: string): Observable<ServerResponse> {
    const uri = `${this.getApiURL()}/deleteDataByID/${id}`;
    return this.http.delete<ServerResponse>(uri);
  }

  /**
   * Title: Xóa dữ liệu theo id
   * Created by: dtnam1 14/07/2020
   */
  deleteDataByListID(id: Array<string>): Observable<ServerResponse> {
    const uri = `${this.getApiURL()}/deleteDataByListID`;
    const listID = { body: id };
    return this.http.delete<ServerResponse>(uri, listID);
  }

  /**
   * Title: Lưu dữ liệu
   * Created by: PTĐạt 22-11-2019
   */
  saveList(data: Array<T>, opt?: object): Observable<ServerResponse> {
    return this.http.post<ServerResponse>(`${this.getApiURL()}/save-list`, data);
  }  

  /**
   * Title: Lấy tất cả dữ liệu
   * Created by: PTĐạt 22-11-2019
   * Edit by: LCLIEM 28/11/2019: Thêm option filter và sort. Khi truyền lên đều phải mã hóa base64
   * filter có dạng: [["FullName","=","a"],"and",["Email","contains","b"]]
   * sort có dạng: [{"selector": "JobPositionName", "desc": "false"}]
   */
  getAll = (filter?, sort?): Observable<ServerResponse> => {
    const bodyData = {
      Filter: filter || "",
      Sort: sort || ""
    };
    return this.http.post<ServerResponse>(`${this.getApiURL()}/getAll`, bodyData);
  }

  /**
   * Title: Cập nhật dữ liệu theo trường
   * Created by: NMDUY 13/03/20
   */
  updateField(data: FieldUpdate): Observable<ServerResponse> {
    return this.http.post<ServerResponse>(`${this.getApiURL()}/update-field`, data);
  }

}
