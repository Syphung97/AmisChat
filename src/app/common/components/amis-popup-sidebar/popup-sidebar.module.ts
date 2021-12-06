import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupSidebarComponent } from './popup-sidebar.component';

@NgModule({
  exports: [PopupSidebarComponent],
  declarations: [PopupSidebarComponent],
  imports: [
    CommonModule
  ]
})
export class AmisPopupSidebarModule { }
