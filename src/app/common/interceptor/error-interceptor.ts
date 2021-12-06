import { Injectable } from "@angular/core";
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { AmisCommonUtils } from "src/common/fn/common-utils";
import { EnvironmentKey } from "src/app/shared/constant/environment/environment-key";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            switch (err.status) {
                case 401:

                    // Xử lý trong môi trường Dev và Local
                    if (AmisCommonUtils.CheckEnvironment(EnvironmentKey.Dev) || AmisCommonUtils.CheckEnvironment(EnvironmentKey.Local)) {
                    }

                    // Xử lý chung unauthorization
                    location.href = "/logout";
                    break;
                case 402:
                    location.href = "/logout";
                    break;
                case 403:
                    location.href = "/logout";
                    break;
                case 404:
                    break;
            }
            // const error = err.error ? err.error.message : err.statusText;
            return throwError(err);
        }));
    }
}

