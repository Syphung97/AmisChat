import { Injectable } from "@angular/core";
import { HttpService } from 'src/common/services/http.service';
import { Observable } from 'rxjs';
import { ServerResponse } from 'src/common/models/server-reponse';
import { AMISBaseService } from './amis-base.service';
import { ConfigService } from './app-config.service';
import { AppConfig } from '../models/app-config';

@Injectable({
  providedIn: "root"
})
export class EmployeeService {

  url = this.getApiURL();
  protected hostApi;

  constructor(
    protected http: HttpService,
    protected controller: string,
    protected config: ConfigService<AppConfig>
  ) {
    this.hostApi = (ConfigService.settings as AppConfig).apiServer;
    this.controller = "Avatar";
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
   * Lấy avatar người dùng
   * Created by: dthieu 14-05-2020
   */
  getAvatar(userID, isScale = true, height = 64, width = 64) {
    return `${this.url}?avatarID=${userID}&isScale=${isScale}&height=${height}&width=${width}`;
  }

}
