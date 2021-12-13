import { Injectable } from '@angular/core';
import { AppConfig } from '../models/AppConfig';
import { AppConfigService } from './app-config.service';
import { BaseService } from './base.service';
import { HttpService } from './http.service';
import { UserService } from './users/user.service';

@Injectable({
  providedIn: 'root'
})
export class ImageService extends BaseService<any>  {
  hostApi!: string;
  url!: string;
  controller = "Image";
  constructor(
    protected http: HttpService,
    protected configSV: AppConfigService<AppConfig>,
  ) {
    super(http, configSV);
    this.controller = "Image";
    this.getApiURL();
    this.url = this.hostApi + "/" + this.controller;
  }

  // tslint:disable-next-line:max-line-length
  getImage(storageType, fileName = "", path = "", isScale = true, height = -1, width = -1, imageType = "", temp = false, preview = false): string {
    const tenantID = UserService.UserInfo.TenantID;
    const tenantCode = UserService.UserInfo.TenantCode;
    // return `${this.url}?storageType=${storageType}&fileName=${fileName}&path=${path}&isScale=${isScale}&height=${height}&width=${width}&imageType=${imageType}&temp=${temp}&preview=${preview}`;
    return `${AppConfigService.settings.cdnDomain}/APIS/MessengerAPI/api/Image/${tenantCode}.jpg?storageType=${storageType}&fileName=${fileName}&path=${path}&isScale=${isScale}&height=${height}&width=${width}&imageType=${imageType}&temp=${temp}&preview=${preview}`;
  }
}
