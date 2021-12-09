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
        CookieClone: "_gcl_au=1.1.1276300600.1638755306; _fbp=fb.1.1638755306673.203189888; __zlcmid=17PkX7TiezIWL9k; x-culture=vi; x-deviceid=589cd60c-64ce-42e9-a92f-b52ddf9efcf2; _gid=GA1.2.954015992.1638859337; _ga_6NQ98LXLDM=GS1.1.1638926699.1.1.1638926724.0; _ga=GA1.2.1623295409.1638755307; _gat_gtag_UA_34323757_8=1; x-sessionid=1eaa64ae7bbe475998ea12339c7be13d; x-lastapp=Messenger;/messenger; x-tenantid=iJnd53nRQa8qGk9fASGYiJySa5Q5CgOjtWlhbvLHxoCxbeSwsSM7kQqcRgysq+GT; TS01937fdc=010fb97404b120500d13767af54f308ccbcff1eebfa5a351d301a6b64695170e85140390bd9ac31dc60b691212bf34b17494120266cd3cffe4f82a3c714a1def6d6c68d7b80a52370ffb987d4c9cbaf7fe552497a40896df5dda5c73802fae1b408e9cb55e5735fec73bb76a26ad69b0cc7f4e181962283ff33c879c21e346f0fc14660f5a22da799f989928f4cfa8640a7247b3f6"
      }
    });
    return next.handle(request).pipe(catchError(err => {
      switch (err.status) {
        // case 401:
        //   // Xử lý chung unauthorization
        //   location.href = "/logout";
        //   break;
        // case 402:
        //   location.href = "/logout";
        //   break;
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

