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
        CookieClone: "x-deviceid=08957a92-5ea6-491a-8acc-dc563e37878b; _ga_9XEFWHNC6Z=GS1.1.1638848385.1.1.1638848453.0; _ga_X3HSST6E2Z=GS1.1.1638848386.1.1.1638848453.0; _ga_Q7T546RR39=GS1.1.1639042380.1.0.1639042383.0; _gid=GA1.2.1606050209.1639363543; x-culture=vi; x-sessionid=5cc725b4ae894b3786d5a54d9807c8ec; x-tenantid=bBtomi+oAvG96Hcgu5lXamIioSCz/chFsh3uiKngd8/A6iplZNdxOP8/neTpY6LI; _ga_6NQ98LXLDM=GS1.1.1639703977.20.0.1639703977.0; _ga=GA1.2.914578765.1638755289; x-lastapp=Messenger;/messenger/"
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

