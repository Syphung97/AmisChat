import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListComponent } from './user-list.component';
import { AvatarModule } from 'src/app/shared/components/avatar/avatar.module';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { AvatarGroupModule } from 'src/app/shared/components/avatar-group/avatar-group.module';
import { NameConvModule } from 'src/app/core/pipes/name-conv/name-conv.module';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { ContentInfoModule } from 'src/app/shared/components/content-info/content-info.module';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [
    UserListComponent
  ],
  imports: [
    CommonModule,
    AvatarModule,
    NzSkeletonModule,
    AvatarGroupModule,
    NameConvModule,
    NzPopoverModule,
    ContentInfoModule,
    TranslateModule
  ],
  exports: [UserListComponent]
})
export class UserListModule {
  public static component = { Component: UserListComponent };
}
