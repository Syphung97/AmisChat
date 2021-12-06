import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupImportProcessComponent } from './popup-import-process.component';
import { TranslateModule } from '@ngx-translate/core';
import { AmisIconModule } from 'src/common/components/amis-icon/amis-icon.module';


@NgModule({
  declarations: [PopupImportProcessComponent],
  imports: [
    CommonModule,
    TranslateModule,
    AmisIconModule
  ],
  exports: [PopupImportProcessComponent]
})
export class PopupImportProcessModule { }
