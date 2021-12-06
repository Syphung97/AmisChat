import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupComponent } from './popup.component';
import { NzModalModule } from 'ng-zorro-antd/modal';


@NgModule({
  declarations: [
    PopupComponent
  ],
  imports: [
    CommonModule,
    NzModalModule
  ],
  exports: [PopupComponent]
})
export class PopupModule { }
