import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../models/AppConfig';
import { ServiceResponse } from '../models/ServerResponse';
import { AppConfigService } from './app-config.service';
import { BaseService } from './base.service';
import { HttpService } from './http.service';


@Injectable({
  providedIn: 'root'
})
export class OrganizationUnitService extends BaseService<any>{
  hostApi!: string;
  url!: string;
  controller = "StringeeUser";
  constructor(
    protected http: HttpService,
    protected config: AppConfigService<AppConfig>
  ) {
    super(http, config);
    this.controller = "StringeeUser";
    this.getApiURL();
  }

  getAllOrg(): Observable<ServiceResponse> {
    return this.http.get("getAllOrg") as Observable<ServiceResponse>;
  }
}
