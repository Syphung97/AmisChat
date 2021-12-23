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
        CookieClone: "x-deviceid=08957a92-5ea6-491a-8acc-dc563e37878b; _ga_Q7T546RR39=GS1.1.1639042380.1.0.1639042383.0; x-culture=vi; _gid=GA1.2.1772912856.1640134339; _ga_X3HSST6E2Z=GS1.1.1640169639.5.0.1640169639.0; _ga_9XEFWHNC6Z=GS1.1.1640169638.5.1.1640169655.0; x-sessionid=a9ccbf84f5fd4acdbe9fdb6f84449c1f; x-tenantid=bBtomi+oAvG96Hcgu5lXamIioSCz/chFsh3uiKngd8/A6iplZNdxOP8/neTpY6LI; _ga=GA1.1.914578765.1638755289; _ga_6NQ98LXLDM=GS1.1.1640219589.23.1.1640219622.0; x-lastapp=Messenger;/messenger/"
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

