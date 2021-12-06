import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from 'src/app/core/models/AppConfig';
import { ServiceResponse } from 'src/app/core/models/ServerResponse';
import { AppConfigService } from 'src/app/core/services/app-config.service';
import { BaseService } from 'src/app/core/services/base.service';
import { HttpService } from 'src/app/core/services/http.service';
import { PlatformConversation } from '../models/PlatformConversation';

@Injectable({
  providedIn: 'root',
})
export class ConversationService extends BaseService<any> {
  hostApi!: string;
  url!: string;
  controller = 'Conversation';
  constructor(
    protected http: HttpService,
    protected configSV: AppConfigService<AppConfig>
  ) {
    super(http, configSV);
    this.controller = 'Conversation';
    this.getApiURL();
    this.url = this.hostApi + '/' + this.controller;
  }

  insertConversation(
    platformConv: PlatformConversation
  ): Observable<ServiceResponse> {
    return this.http.post(`${this.url}/insertConversation`, platformConv);
  }

  getPagingPlatformConversation(param): Observable<ServiceResponse> {
    return this.http.post(`${this.url}/getPagingConv`, param);
  }

  removeParticipant(convId, userId): Observable<ServiceResponse> {
    return this.http.post(
      `${this.url}/removeParticipant?userId=${userId}&convId=${convId}`
    );
  }

  addParticipant(param): Observable<ServiceResponse> {
    return this.http.post(`${this.url}/addParticipant`, param);
  }
}
