import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarGroupComponent } from './avatar-group.component';
import { AvatarModule } from '../avatar/avatar.module';



@NgModule({
  declarations: [
    AvatarGroupComponent
  ],
  imports: [
    CommonModule,
    AvatarModule
  ],
  exports: [AvatarGroupComponent]
})
export class AvatarGroupModule { }
