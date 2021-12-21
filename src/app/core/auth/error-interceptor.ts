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
        // CookieClone: "x-deviceid=0eb1aaad-787c-4cc7-aa1c-c525e36ef819; LastSessionID=ev0kmqpjk2s32uxxdyob4s10; _gcl_au=1.1.462656809.1639239254; _ga_VM6H96BJ61=GS1.1.1639243768.3.0.1639243768.0; _ga_5CLG9BK8TN=GS1.1.1639824781.1.0.1639824785.56; _gid=GA1.2.268305751.1639962809; x-culture=vi; _ga_9XEFWHNC6Z=GS1.1.1639987825.17.0.1639987825.0; _ga_X3HSST6E2Z=GS1.1.1639987825.17.0.1639987825.0; x-sessionid=1cd5246c94194387b4ef2837ab269368; x-tenantid=bBtomi+oAvG96Hcgu5lXamIioSCz/chFsh3uiKngd8/A6iplZNdxOP8/neTpY6LI; _ga=GA1.1.101776522.1612099456; _ga_6NQ98LXLDM=GS1.1.1640048612.56.0.1640048800.0; x-lastapp=Messenger;/messenger/"
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

