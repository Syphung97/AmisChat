import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';

import { registerLocaleData } from '@angular/common';
import vi from '@angular/common/locales/vi';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppInitializerProvider } from './core/services/app-initializer.service';
import { OverlayModule } from '@angular/cdk/overlay';
import { ErrorInterceptor } from './core/auth/error-interceptor';
import { AppConfigService } from './core/services/app-config.service';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { DBConfig, NgxIndexedDBModule } from 'ngx-indexed-db';
import { StorageConstant } from './shared/constant/storage-constant';
registerLocaleData(vi);

export function initializeApp(appConfig: AppConfigService<any>): any {
  return () => appConfig.load();
}

// tslint:disable-next-line:typedef
export function HttpLoaderFactory(httpClient: HttpClient) {
  if (window["localize"]) {
    return new TranslateHttpLoader(httpClient, window["localize"], "");
  } else {
    return new TranslateHttpLoader(httpClient, "./assets/i18n/", `.json`);
  }
}

const dbConfig: DBConfig  = {
  name: 'AMIS_Messenger',
  version: 1,
  objectStoresMeta: [{
    store: StorageConstant.StringeeUser,
    storeConfig: { keyPath: 'StringeeUserID', autoIncrement: false },
    storeSchema: [
      { name: 'UserID', keypath: 'UserID', options: { unique: false } },
      { name: 'StringeeUserID', keypath: 'StringeeUserID', options: { unique: false } },
      { name: 'DisplayName', keypath: 'DisplayName', options: { unique: false } },
      { name: 'JobPositionName', keypath: 'JobPositionName', options: { unique: false } },
      { name: 'OrganizationUnitName', keypath: 'OrganizationUnitName', options: { unique: false } },
      { name: 'AvatarUrl', keypath: 'AvatarUrl', options: { unique: false } },
      { name: 'IsRegisterStringee', keypath: 'IsRegisterStringee', options: { unique: false } },
      { name: 'TenantID', keypath: 'TenantID', options: { unique: false } },
    ]
  }]
};


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    HttpClientModule,
    OverlayModule,
    NgxIndexedDBModule.forRoot(dbConfig),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
    })
  ],
  providers: [AppInitializerProvider, {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true
  },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AppConfigService],
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
