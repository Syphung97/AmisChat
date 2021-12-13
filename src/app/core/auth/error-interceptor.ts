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
        CookieClone: "initialTrafficSource=utmccn=(not set); _ga_QEZY3PSJPE=GS1.1.1627382025.3.0.1627382025.0; _ga_VM6H96BJ61=GS1.1.1627699033.4.1.1627699287.0; _ga_6NQ98LXLDM=GS1.1.1627880634.7.0.1627880634.0; _ga=GA1.2.1957242333.1602950337; x-culture=vi; _gid=GA1.2.1413275351.1639186512; _gat_gtag_UA_34323757_8=1; x-deviceid=f0978891-4c24-4e6c-8292-6f7fb55d2f3b; x-sessionid=c2828dcffdce4510b4f86175e5ff29e6; x-lastapp=Messenger;/messenger; x-tenantid=iJnd53nRQa8qGk9fASGYiJySa5Q5CgOjtWlhbvLHxoCxbeSwsSM7kQqcRgysq+GT; TS01937fdc=010fb974048d79c3c35464a5afad357c3800bd30017b86de4597f030be76d46e6898f612ab691e3cf5231e1d6834db4de8ec185e17cb07f02739ecbedbcf1e5cf73ee7fe66b729c156af3317bbe21464f7910d9318d8781d3ae7a013550b0a5fe28d0d509d9b749bfe5577442e504c350374b6e6545390bd6236e340d25527d9f4c56d1b24"
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

