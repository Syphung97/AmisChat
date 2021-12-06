import { Injectable } from "@angular/core";
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from "@angular/common/http";
import { Observable } from "rxjs";
import { AmisCommonUtils } from "../fn/common-utils";
import { tap } from "rxjs/operators";
import { EnvironmentKey } from "src/app/shared/constant/environment/environment-key";
import { ServerResponse } from "../models/server-reponse";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        request = request.clone({
            setHeaders: {
                CookieClone: "_gcl_au=1.1.1276300600.1638755306; _ga=GA1.2.1623295409.1638755307; _gid=GA1.2.468083109.1638755307; _fbp=fb.1.1638755306673.203189888; __zlcmid=17PkX7TiezIWL9k; x-culture=vi; x-deviceid=589cd60c-64ce-42e9-a92f-b52ddf9efcf2; x-sessionid=8c79fb6d3c7b4d3bae38c034c4d6e478; x-tenantid=iJnd53nRQa8qGk9fASGYiJySa5Q5CgOjtWlhbvLHxoCxbeSwsSM7kQqcRgysq+GT; x-lastapp=Messenger;/messenger; TS01937fdc=010fb97404827750840844b18e218ee03967515fa2ba49a7e745c9b452689a24b6e2ded41d13d5863cd4a82b1e84861d69437c4ddd3b8ea38d3353443cc04ebf7d5969a801f06e9941b7ed0d809ec5ee1be5656a1ec54aabcd98e2a8fbbab3735158a26f43396000fa924489281168d3eac5bba690e7b5e50db6ae11bd1af3acf333e97fef"
            }
        });

        // Xử lý trong môi trường Dev và Local
        if (AmisCommonUtils.CheckEnvironment(EnvironmentKey.Dev) || AmisCommonUtils.CheckEnvironment(EnvironmentKey.Local)) {

        }
        return next.handle(request).pipe(
            tap((response: HttpEvent<any>) => {
                if (!response.hasOwnProperty("body")) {
                    return response;
                }
                if (response["body"] instanceof (ServerResponse)) {
                    const bodyResponse = response["body"] as ServerResponse;
                    if (!bodyResponse.Success) {
                        // Xử lý hiển thị lỗi
                        if (bodyResponse.SubCode == 401 || bodyResponse.SubCode == 403) {
                            location.href = "/logout";
                        }
                    }
                }
                return response;
            }));
    }
}





