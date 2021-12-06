import { Injectable } from "@angular/core";
import { HttpService } from 'src/common/services/http.service';
import { Observable } from 'rxjs';
import { ServerResponse } from 'src/common/models/server-reponse';
import { ConfigService } from './app-config.service';
import { AppConfig } from '../models/app-config';

@Injectable({
  providedIn: "root"
})
export class AmisDataService {

  private hostApi: string = "";

  constructor(
    protected http: HttpService
  ) {
    this.hostApi = (ConfigService.settings as AppConfig).apiServer;
  }


  /**
   * Lấy dữ liệu về theo url và param
   * @param {string} url
   * @param {string} controller
   * @param {*} param
   * @param {boolean} isCustom
   * @returns {Observable<ServerResponse>}
   * @memberof AmisDataService
   * created by vhtruong - 11/05/2020
   */
  getDataByURL(
    url: string,
    controller: string,
    param: any,
    isCustom: boolean,
    isPaging: boolean = false,
    isGetMethod: boolean = false
  ): Observable<ServerResponse> {
    if (isCustom) {
      url = `${this.hostApi}${controller}/${url}?isPaging=${isPaging}`;
    }
    if (isGetMethod) {
      return this.http.get<ServerResponse>(url);
    } else {
      return this.http.post<ServerResponse>(url, param);
    }
  }


  /**
   * UpdateField
   * @param {string} url
   * @param {string} controller
   * @param {object} param
   * @returns {Observable<ServerResponse>}
   * @memberof AmisDataService
   * created by vhtruong - 14/05/2020
   */
  updateField(
    controller: string,
    param: object,
  ): Observable<ServerResponse> {
    let url = `${this.hostApi}${this.setController(controller)}/update-data`;
    return this.http.post<ServerResponse>(url, param);
  }

  /**
   * UpdateField
   * @param {string} url
   * @param {string} controller
   * @param {object} param
   * @returns {Observable<ServerResponse>}
   * @memberof AmisDataService
   * created by vhtruong - 14/05/2020
   */
  updateField2(
    controller: string,
    param: object,
  ): Observable<ServerResponse> {
    let url = `${this.hostApi}${this.setController(controller)}/update-field`;
    return this.http.post<ServerResponse>(url, param);
  }

  /**
   * Update nhiều field
   * @param {string} url
   * @param {string} controller
   * @param {object} param
   * @returns {Observable<ServerResponse>}
   * @memberof AmisDataService
   * vbcong 03/07/2020
   */
  updateMultiData(
    controller: string,
    param: object,
  ): Observable<ServerResponse> {
    const url = `${this.hostApi}${this.setController(controller)}/update-multi-data`;
    return this.http.put<ServerResponse>(url, param);
  }
  /**
   * Update nhiều field
   * @param {string} url
   * @param {string} controller
   * @param {object} param
   * @returns {Observable<ServerResponse>}
   * @memberof AmisDataService
   */
  updateMultiField(
    controller: string,
    param: Array<object>,
  ): Observable<ServerResponse> {
    let url = `${this.hostApi}${this.setController(controller)}/update-datas`;
    return this.http.post<ServerResponse>(url, param);
  }



  /**
   * Save
   * @param {string} controller
   * @param {any} data
   * @returns {Observable<ServerResponse>}
   * @memberof AmisDataService
   */
  save(controller: string, data): Observable<ServerResponse> {
    return this.http.post<ServerResponse>(`${this.hostApi}${this.setController(controller)}/save`, data);
  }

  /**
   * Save
   * @param {string} controller
   * @param {any} data
   * @returns {Observable<ServerResponse>}
   * @memberof AmisDataService
   */
  delete(controller: string, data): Observable<ServerResponse> {
    const configParams = { body: data };
    return this.http.delete<ServerResponse>(`${this.hostApi}${this.setController(controller)}/delete`, configParams);
  }


  /**
   * Lấy dữ liệu binding form thêm
   * @param {string} controller
   * @param {string} subSystemCode
   * @param {any} layOutConfigID
   * @returns {Observable<ServerResponse>}
   * @memberof AmisDataService
   */
  getDataDefaultBinding(controller: string, subSystemCode: string, layOutConfigID, id?): Observable<ServerResponse> {
    if(id){
      return this.http.get<ServerResponse>(`${this.hostApi}${this.setController(controller)}/default-data/${subSystemCode}/${layOutConfigID}?id=${id}`);
    }
    return this.http.get<ServerResponse>(`${this.hostApi}${this.setController(controller)}/default-data/${subSystemCode}/${layOutConfigID}`);
  }


  /**
   * Lấy danh sách config và dữ liệu
   * @param {string} controller
   * @param {string} subSystemCode
   * @param {any} layOutConfigID
   * @returns {Observable<ServerResponse>}
   * @memberof AmisDataService
   */
  getLauoutConfigAndData(data): Observable<ServerResponse> {
    return this.http.post<ServerResponse>(`${this.hostApi}Config/getLayoutConfigAndData`, data);
  }


  /**
   * Lấy danh sách dữ liệu theo group config
   * @param {any} data
   * @returns {Observable<ServerResponse>}
   * @memberof AmisDataService
   */
  getDataByGroupConfig(data): Observable<ServerResponse> {
    return this.http.post<ServerResponse>(`${this.hostApi}Config/getDataByGroupConfig`, data);
  }

  /**
   * Lấy danh sách theo list ID
   * @param IDs
   * @param controller 
   * Created Bt PVTHONG 10/07/2020
   */
  getListDatabyIDs(IDs, controller): Observable<ServerResponse>{
    return this.http.post<ServerResponse>(`${this.hostApi}${controller}/dataByIDs`, IDs);
  }

  /**
   * lấy controller
   * @param {string} controller
   * @returns
   * @memberof AmisDataService
   */
  setController(controller: string) {
    return controller.replace(/_/g, "");
  }


  /**
   * 
   * @param {any} data 
   * @returns {Observable<ServerResponse>} 
   * @memberof AmisDataService
   */
  getDataByGroupConfigs(data): Observable<ServerResponse> {
    return this.http.post<ServerResponse>(`${this.hostApi}Config/data-group`, data);
  }

  /**
   * Update nhiều field từ thủ tục
   * @param {string} url
   * @param {string} controller
   * @param {object} param
   * @returns {Observable<ServerResponse>}
   * @memberof AmisDataService
   */
  updateMultiFieldProcedure(
    controller: string,
    param: Array<object>,
  ): Observable<ServerResponse> {
    let url = `${this.hostApi}${this.setController(controller)}/updatedata-fromprocedure`;
    return this.http.post<ServerResponse>(url, param);
  }
}
