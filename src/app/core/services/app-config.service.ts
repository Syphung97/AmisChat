import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AppConfig } from '../models/AppConfig';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService<T extends AppConfig> {
  public static settings: AppConfig;
  constructor(
    private httpClient: HttpClient
  ) { }

  load(): any {
    let jsonFile = `/messenger/assets/config/config.${environment.name}.json`;
    if (environment.name === "dev") {
      jsonFile = `/assets/config/config.${environment.name}.json`;
    }

    return new Promise<void>((resolve, reject) => {
      // tslint:disable-next-line:no-string-literal
      if (window["config"]) {
        // tslint:disable-next-line:no-string-literal
        AppConfigService.settings = window["config"];
        resolve();
      }
      else {
        this.httpClient.get(jsonFile).toPromise().then(response => {
          AppConfigService.settings = response as AppConfig;
          resolve();
        }).catch((response: any) => {
          reject(`Could not load file '${jsonFile}': ${JSON.stringify(response)}`);
        });
      }

    });
  }
}
