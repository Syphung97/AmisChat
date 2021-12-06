import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { AppConfigService } from '../app-config.service';
import { HttpService } from '../http.service';
import { config } from 'rxjs';
import { AppConfig } from '../../models/AppConfig';
import { UserService } from './user.service';
@Injectable({
  providedIn: 'root'
})
export class AvatarService extends BaseService<any> {

  hostApi!: string;
  url!: string;

  constructor(
    protected http: HttpService,
    protected configSV: AppConfigService<AppConfig>,
  ) {
    super(http, configSV);
    this.controller = "Avatar";
    this.getApiURL();
    this.url = this.hostApi + "/" + this.controller;
  }


  getAvatar(tokenAvatar, userID, editVersion = new Date(), isScale = true, height = 192, width = 192): string {
    let date;
    if (editVersion) {
      date = new Date(editVersion).getTime();
    }
    else {
      date = null;
    }
    const tenantID = UserService.UserInfo.TenantID;
    const tenantCode = UserService.UserInfo.TenantCode;
    // return `${this.url}/public?token=${tokenAvatar}&avatarID=${userID}&v=${date}&isScale=${isScale}&width=${width}&height=${height}`;
    return `${AppConfigService.settings.cdnDomain}/APIS/PlatformAPI/api/Avatar/${tenantID}/${tenantCode}.jpg?&avatarID=${userID}&v=${date}&isScale=${isScale}&width=${width}&height=${height}`;
  }

  /**
   * lấy avatar theo userid kích thước default
   * pvthong
   * @param {any} userID id người cần lấy ảnh
   * @param {any} height độ cao
   * @param {any} width độ rộng
   * @returns
   * @memberof AvatarService
   */
  getAvatarDefault(userID): string {
    return `${this.url}?avatarID=${userID}`;
  }
}
