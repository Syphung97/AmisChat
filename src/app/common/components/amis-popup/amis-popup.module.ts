import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AmisPopupNotifyComponent } from "./amis-popup-notify/amis-popup-notify.component";
import { DxPopupModule, DxScrollViewModule } from "devextreme-angular";
import { AmisButtonModule } from "../amis-button/amis-button.module";
import { AmisPopupBaseComponent } from "./amis-popup-base/amis-popup-base.component";
import { AmisPopupDeleteComponent } from './amis-popup-delete/amis-popup-delete.component';
import { TranslateModule } from '@ngx-translate/core';
import { AmisIconModule } from '../amis-icon/amis-icon.module';
import { AmisNoSanitizeModule } from 'src/common/pipes/amis-no-sanitize/amis-no-santinize.module';


@NgModule({
  declarations: [AmisPopupNotifyComponent, AmisPopupBaseComponent, AmisPopupDeleteComponent],
  imports: [
    CommonModule,
    DxPopupModule,
    AmisButtonModule,
    TranslateModule,
    DxScrollViewModule,
    AmisIconModule,
    AmisNoSanitizeModule
  ],
  exports: [
    AmisPopupNotifyComponent,
    AmisPopupBaseComponent,
    AmisPopupDeleteComponent
  ]
})
export class AmisPopupModule { }
