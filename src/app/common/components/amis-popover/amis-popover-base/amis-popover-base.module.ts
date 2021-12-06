import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranslateModule } from '@ngx-translate/core';
import { DxPopoverModule } from "devextreme-angular";
import { AmisPopoverBaseComponent } from './amis-popover-base.component';
import { AmisIconModule } from '../../amis-icon/amis-icon.module';

@NgModule({
  declarations: [AmisPopoverBaseComponent],
  imports: [
    CommonModule,
    DxPopoverModule,
    TranslateModule,
    AmisIconModule
  ],
  exports: [AmisPopoverBaseComponent, ]
})
export class AmisPopoverModule { }
