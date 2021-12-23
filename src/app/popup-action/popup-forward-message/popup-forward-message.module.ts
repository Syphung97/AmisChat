import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupForwardMessageComponent } from './popup-forward-message.component';
import { PopupModule } from 'src/app/shared/components/popup/popup.module';
import { TranslateModule } from '@ngx-translate/core';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule } from '@angular/forms';
import { AvatarModule } from 'src/app/shared/components/avatar/avatar.module';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { AvatarGroupModule } from 'src/app/shared/components/avatar-group/avatar-group.module';
import { NameConvModule } from 'src/app/core/pipes/name-conv/name-conv.module';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';


@NgModule({
  declarations: [
    PopupForwardMessageComponent
  ],
  imports: [
    CommonModule,
    PopupModule,
    TranslateModule,
    NzInputModule,
    FormsModule,
    AvatarModule,
    NzMessageModule,
    AvatarGroupModule,
    NameConvModule,
    NzSkeletonModule],
  exports: [PopupForwardMessageComponent]
})
export class PopupForwardMessageModule { }
