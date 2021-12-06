import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpParams
} from "@angular/common/http";
import { Observable } from "rxjs";
export interface IRequestOptions {
  headers?: HttpHeaders;
  observe?: "body";
  params?: HttpParams | {};
  reportProgress?: boolean;
  responseType?: "json";
  withCredentials?: boolean;
  body?: any;
}

@Injectable({
  providedIn: "root"
})
export class HttpService {
  constructor(private http: HttpClient) { }

  /**
   * GET Request
   * @param endpoint
   * @param options
   * Create by: PTĐạt 22.11.2019
   */
  public get<T>(
    endpoint: string,
    options?: IRequestOptions
  ): Observable<T> {
    return this.http.get<T>(endpoint, options);
  }

  /**
   * POST Request
   * @param endpoint
   * @param options
   * Create by: PTĐạt 22.11.2019
   */
  public post<T>(
    endpoint: string,
    params?: {},
    options?: IRequestOptions
  ): Observable<T> {
    return this.http.post<T>(endpoint, params, options);
  }

  /**
   * POST Request
   * @param endpoint
   * @param options
   * Create by: PTĐạt 22.11.2019
   */
  public put<T>(
    endpoint: string,
    params?: {},
    options?: IRequestOptions
  ): Observable<T> {
    return this.http.put<T>(endpoint, params, options);
  }

  /**
   * DELETE Request
   * @param endpoint
   * @param options
   * Create by: PTĐạt 22.11.2019
   */
  public delete<T>(
    endpoint: string,
    options?: IRequestOptions
  ): Observable<T> {
    return this.http.delete<T>(endpoint, options);
  }
}
