import { Injectable } from "@angular/core";
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

declare var APCore: any;


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor() { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    request = request.clone({
      setHeaders: {
        CookieClone: "_gcl_au=1.1.1276300600.1638755306; _fbp=fb.1.1638755306673.203189888; __zlcmid=17PkX7TiezIWL9k; x-deviceid=589cd60c-64ce-42e9-a92f-b52ddf9efcf2; _ga_6NQ98LXLDM=GS1.1.1638926699.1.1.1638926724.0; _ga_CY2G5JR16N=GS1.1.1639024715.1.0.1639024721.0; _ga_9XEFWHNC6Z=GS1.1.1639042268.1.1.1639042341.0; _ga_X3HSST6E2Z=GS1.1.1639042268.1.1.1639042342.0; _ga_Q7T546RR39=GS1.1.1639099086.3.0.1639099087.0; x-culture=vi; _ga=GA1.2.1623295409.1638755307; _gid=GA1.2.472692168.1639357464; _gat_gtag_UA_34323757_8=1; x-sessionid=74bbb19376e44ba2872e775331278308; x-tenantid=iJnd53nRQa8qGk9fASGYiJySa5Q5CgOjtWlhbvLHxoCxbeSwsSM7kQqcRgysq+GT; x-lastapp=Messenger;/messenger; TS01937fdc=010fb97404705816afb6ce861117f49b7b9ac93e5a81208d1c27d34aeaaf7f4417174aa8d08d691a7c1570080aa7588260f3b4736411b5d25bc4354c9924675467ae5e9242ba52abf24c421bbf8bc18405772a7424010f8701b5e135990a4c876d1cc2afaacbdc401e752b9f9275a4a171f238528f940575a19d24c609d12f117cd2e14ff1"
      }
    });
    return next.handle(request).pipe(catchError(err => {
      switch (err.status) {
        case 401:
          // xử lý chung unauthorization
          location.href = "/logout";
          break;
        case 402:
          location.href = "/logout";
          break;
        case 403: {
          APCore.Fn.show403();
          break;
        }
        case 404: {
          APCore.Fn.show404();
          break;
        }
      }
      // const error = err.error ? err.error.message : err.statusText;
      return throwError(err);
    }));
  }
}

