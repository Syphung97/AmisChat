import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { AppConfig } from "../models/app-config";
import { HRMAppConfig } from 'src/app/shared/models/config/hrm-app-config';

@Injectable({
  providedIn: "root"
})
export class ConfigService<T extends AppConfig> {

  public static settings: HRMAppConfig;

  constructor(protected http: HttpClient) {
  }

  /**
   * Lấy file config
   * Created by: PTĐạt 06-03-2020
   */
  load() {
    const jsonFile = `assets/config/config.${environment.name}.json`;
    return new Promise<void>((resolve, reject) => {
      this.http.get(jsonFile).toPromise().then((response: any) => {
        ConfigService.settings = response as HRMAppConfig;
        resolve();
      }).catch((response: any) => {
        reject(`Could not load file '${jsonFile}': ${JSON.stringify(response)}`);
      });
    });
  }

}
