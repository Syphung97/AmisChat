import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnderConstructionDirective } from './under-construction.directive';
import { CheckPermissionDirective } from './check-permission.directive';
import { HidePermissionDirective } from './hide-permission.directive';
import { CheckPermissionObjectDirective } from './check-permission-object.directive';



@NgModule({
  declarations: [
    UnderConstructionDirective,
    CheckPermissionDirective,
    HidePermissionDirective,
    CheckPermissionObjectDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    UnderConstructionDirective,
    CheckPermissionDirective,
    HidePermissionDirective,
    CheckPermissionObjectDirective
  ]
})
export class ShareDirectiveModule {}
