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
        CookieClone: "_gcl_au=1.1.1276300600.1638755306; _ga=GA1.2.1623295409.1638755307; _fbp=fb.1.1638755306673.203189888; __zlcmid=17PkX7TiezIWL9k; x-culture=vi; x-deviceid=589cd60c-64ce-42e9-a92f-b52ddf9efcf2; x-sessionid=8c79fb6d3c7b4d3bae38c034c4d6e478; x-tenantid=iJnd53nRQa8qGk9fASGYiJySa5Q5CgOjtWlhbvLHxoCxbeSwsSM7kQqcRgysq+GT; x-lastapp=Messenger;/messenger; __cf_bm=ICQ_mUkAoZSypHvRtuEy8ecSOmfXOD6oXJA1_QRLEyE-1638859338-0-AXVMK0/YmDeogkpuZH+zA6Oy48nDOFFkSjYULPvvBBPpnfm+KJpzaNOEl7araTMu23spOpBxOaTpqmkXpIbe98CCiSlBGzDIPC1LwXkCOjb2lNqGDNL+QMCP+pkjsWVy8A==; _gid=GA1.2.954015992.1638859337; TS01937fdc=010fb9740495125e0a014ade5e5733564c9c70c8639655244b181d0e14bb698e3a87fc6a3f5681dfae2b877e76f923abb94790d409324da1e40e4a97a0693959583629af8f781c2aa05c1c05aec7206ed70861c66225936b82194e7afe063275140360cb142b4721574e089ecf29fd162d32fa8b9b4b2d9c7c50bfa74854aef703202577ef; _gat_gtag_UA_34323757_8=1"
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

