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
        CookieClone: "_gcl_au=1.1.1276300600.1638755306; _fbp=fb.1.1638755306673.203189888; __zlcmid=17PkX7TiezIWL9k; x-deviceid=589cd60c-64ce-42e9-a92f-b52ddf9efcf2; _ga_6NQ98LXLDM=GS1.1.1638926699.1.1.1638926724.0; _ga_CY2G5JR16N=GS1.1.1639024715.1.0.1639024721.0; _ga_9XEFWHNC6Z=GS1.1.1639042268.1.1.1639042341.0; _ga_X3HSST6E2Z=GS1.1.1639042268.1.1.1639042342.0; _ga_Q7T546RR39=GS1.1.1639099086.3.0.1639099087.0; x-culture=vi; _ga=GA1.2.1623295409.1638755307; _gid=GA1.2.472692168.1639357464; x-sessionid=bb03e65e042544e8a44df859802b9259; x-lastapp=Messenger;/messenger; x-tenantid=iJnd53nRQa8qGk9fASGYiJySa5Q5CgOjtWlhbvLHxoCxbeSwsSM7kQqcRgysq+GT; TS01937fdc=010fb97404be1c61d32c8438918c9892051549389d0f879fd83e22d77b53a3c27e503d3bb13e351e0dc60bcb20a9a08de1f13486ac3844f823dc94d698e64917240779838cab702198110cf1f99c7e488e9fe85360eb173b0858854f9e7f4fd10b582a6f2db89b9b6127c0710175214d80718e54af1402cf4b9cb115d94945ecb504bbe65e"
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

