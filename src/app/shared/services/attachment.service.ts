import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from 'src/app/core/models/AppConfig';
import { ServiceResponse } from 'src/app/core/models/ServerResponse';
import { AppConfigService } from 'src/app/core/services/app-config.service';
import { BaseService } from 'src/app/core/services/base.service';
import { HttpService } from 'src/app/core/services/http.service';
import { UploadTypeEnum } from '../enum/upload-type.enum';

@Injectable({
  providedIn: 'root'
})
export class AttachmentService extends BaseService<any> {

  hostApi!: string;
  url!: string;
  constructor(
    protected http: HttpService,
    protected configSV: AppConfigService<AppConfig>,
  ) {
    super(http, configSV);
    this.controller = "Attachment";
    this.getApiURL();
    this.url = this.hostApi + "/" + this.controller;
  }

  /**
   *
   * Upload attachment
   *
   * @param {any} listAttachment
   * @param {any} convID
   * @returns {Observable<ServiceResponse>}
   * @memberof AttachmentService
   */
  uploadAttachment(listAttachment, convID, storageType = UploadTypeEnum.MessengerFileAttachment): Observable<ServiceResponse> {
    return this.http.post(`${this.url}/${convID}/${storageType}`, listAttachment);
  }

  getAttachmentInConv(convID): Observable<ServiceResponse> {
    return this.http.get(`${this.url}/getInConv/${convID}`);
  }

  getPagingAttachment(pagingRequest): Observable<ServiceResponse> {
    return this.http.post(`${this.url}/image/paging`, pagingRequest);
  }
}
