import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentInfoComponent } from './content-info.component';
import { AvatarModule } from '../avatar/avatar.module';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { PermissionModule } from 'src/app/core/directives/permission/permission.module';
import { NzButtonModule } from 'ng-zorro-antd/button';



@NgModule({
  declarations: [
    ContentInfoComponent
  ],
  imports: [
    CommonModule,
    AvatarModule,
    PermissionModule,
    NzButtonModule
  ],
  exports: [
    ContentInfoComponent
  ]
})
export class ContentInfoModule { }
