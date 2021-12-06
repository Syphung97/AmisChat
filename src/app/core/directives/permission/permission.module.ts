import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HidenPermissionDirective } from './hiden-permission.directive';



@NgModule({
  declarations: [
    HidenPermissionDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [HidenPermissionDirective]
})
export class PermissionModule { }
