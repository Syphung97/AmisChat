import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AmisButtonComponent } from "./amis-button.component";
import { BaseModule } from '../base/base.module';
import { TranslateModule } from '@ngx-translate/core';
import { DxMenuModule, DxPopoverModule } from 'devextreme-angular';
import { ShareDirectiveModule } from 'src/app/shared/directive/share-directive/share-directive.module';

@NgModule({
  declarations: [AmisButtonComponent],
  imports: [
    CommonModule,
    BaseModule,
    TranslateModule,
    DxMenuModule,
    ShareDirectiveModule,
    DxPopoverModule
  ],
  exports: [AmisButtonComponent]
})
export class AmisButtonModule { }
