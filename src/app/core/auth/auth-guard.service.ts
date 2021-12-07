import { Injectable, isDevMode } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { AmisTranferDataService } from '../services/amis-tranfer-data.service';
import { StringeeService } from '../services/stringee.service';
import { AvatarService } from 'src/app/core/services/users/avatar.service';

import { UserService } from '../services/users/user.service';
import { concatMap, mergeMap } from 'rxjs/operators';
import { StorageConstant } from 'src/app/shared/constant/storage-constant';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { CommonFn } from '../functions/commonFn';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  constructor(
    private userSV: UserService,
    private tranferDataSV: AmisTranferDataService,
    private stringeeService: StringeeService,
    private avatarSV: AvatarService,
    private dbService: NgxIndexedDBService
  ) {}

  canActivate(
    activeRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> | boolean | Observable<boolean> {
    return new Promise((resolve, reject) => {
      this.userSV.getUserInfo().subscribe(
        (data) => {
          if (data?.Success) {
            UserService.UserInfo = data.Data;
            this.tranferDataSV.handleAfterGetUserInfo(true);
            const userData = CommonFn.getCacheStringeeUser(true);
            if (location.hostname === 'localhost') {
              // resolve(true);
            }
            this.connectStringee()
              .pipe(
                mergeMap((rs) => {
                  if (!userData) {
                    return this.userSV.getStringeeUser();
                  } else {
                    return of(rs);
                  }
                })
              )
              .subscribe((stringeeUsers) => {
                if (!userData) {
                  // this.dbService
                  //   .clear(StorageConstant.StringeeUser)
                  //   .pipe(
                  //     concatMap((val) => {
                  //       return this.dbService.bulkAdd(
                  //         StorageConstant.StringeeUser,
                  //         stringeeUsers.Data
                  //       );
                  //     })
                  //   )
                  //   .subscribe((result) => {});
                  CommonFn.setCacheStringeeUser(stringeeUsers);
                }

                resolve(true);
              });
          } else {
            resolve(false);
          }
        },
        (error) => {
          resolve(false);
        }
      );
    });
  }

  connectStringee(): Observable<any> {
    // UserService.UserInfo.StringeeUserID = "814fb76612adf7fd0bba2668a0dcb0af"

    // UserService.UserInfo.MessengerToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImN0eSI6Ik1JU0FKU0MifQ.eyJqdGkiOiJTSzJtZ1Bncjg3TlZhTERENE90UlZacEltY3R6Ykp4c0ktMTYzMTU1NDE4MiIsImlzcyI6IlNLMm1nUGdyODdOVmFMREQ0T3RSVlpwSW1jdHpiSnhzSSIsImV4cCI6MTYzMTU1NDE4MiwidXNlcklkIjoiODE0ZmI3NjYxMmFkZjdmZDBiYmEyNjY4YTBkY2IwYWYiLCJkaXNwbGF5TmFtZSI6IlBUS2h1eWVuIDA2IiwiYXZhdGFyVXJsIjoiaHR0cDovL2FwcHMuYW1pc3BkYy5taXNhLmxvY2FsL0FQSVMvTWVzc2VuZ2VyQVBJL2FwaS9BdmF0YXIvcHVibGljP3Rva2VuPUxVQ2JHT0pSUW5aWU9oJTJCQU5RQzYlMkI0cGM4dGZBZ3kyZGVud3pNSXpocHo2WGlEZkh6Y3BIcmI1TWQwOGQlMkJjZFJOS3JlU3huVGdoRE5ySFZuUkFYeUgwRDhzdU04SW90RzV0WndZNmlKTVlNT0o1SmwzaVdLc3ZuR3BmcjhtSjJ0JmF2YXRhcklEPTdkZjhjMWFiLTBjZTAtNGUwOC04NTM4LTRmODI5NmU0NWY2NCZpc1NjYWxlPXRydWUmd2lkdGg9MTkyJmhlaWdodD0xOTI7In0.h5Mrno-LGapH17WwBAQmRavDSvo7XUOUZWgXhvV8r3U";

    return new Observable((subscribe) => {
      this.stringeeService.connect(UserService.UserInfo.MessengerToken);
      this.stringeeService.onAuthent((res) => {
        subscribe.next(res);
      });
    });
  }
  getAvatar(avatarToken, userID: any, editVersion: any = new Date()): string {
    return this.avatarSV.getAvatar(
      avatarToken,
      userID,
      editVersion,
      true,
      80,
      80
    );
  }
}
