import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmisAvtPopoverComponent } from './amis-avt-popover.component';
import { DxPopoverModule } from 'devextreme-angular';
import { AmisButtonModule } from '../amis-button/amis-button.module';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [AmisAvtPopoverComponent],
  imports: [CommonModule, DxPopoverModule, AmisButtonModule, TranslateModule],
  exports: [AmisAvtPopoverComponent]
})
export class AmisAvtPopoverModule { }
