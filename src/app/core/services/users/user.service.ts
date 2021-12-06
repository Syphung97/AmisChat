import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../../models/AppConfig';
import { ServiceResponse } from '../../models/ServerResponse';
import { AppConfigService } from '../app-config.service';
import { BaseService } from '../base.service';
import { HttpService } from '../http.service';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService<any> {
  public static UserInfo: any;
  public static UserOnline: any;

  constructor(
    protected http: HttpService,
    protected config: AppConfigService<AppConfig>
  ) {
    super(http, config);
    this.controller = "StringeeUser";
    this.getApiURL();
  }

  /**
   * Laasy us
   *
   * @returns {Observable<ServiceResponse>}
   * @memberof UserService
   */
  getUserInfo(): Observable<ServiceResponse> {
    return this.http.get(`${this.hostApi}/${this.controller}/userinfo`) as Observable<ServiceResponse>;
  }

  /**
   * Lấy user tạo danh bạ
   *
   * @returns {Observable<ServiceResponse>}
   * @memberof UserService
   */
  getUserFromSystem(param: any): Observable<ServiceResponse> {
    return this.http.post(`${this.hostApi}/${this.controller}/getUserFromSystem`, param) as Observable<ServiceResponse>;
  }

  /**
   * Lấy user online
   * @returns {Observable<ServiceResponse>}
   * @memberof UserService
   */
  getUserOnline(): Observable<ServiceResponse> {
    return this.http.get(`${this.hostApi}/${this.controller}/userOnline`) as Observable<ServiceResponse>;
  }

  getStringeeUser(): Observable<ServiceResponse> {
    return this.http.get(`${this.hostApi}/${this.controller}/GetAllStringeeUser`) as Observable<ServiceResponse>;
  }
}
