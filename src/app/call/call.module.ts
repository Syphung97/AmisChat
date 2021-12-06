import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncommingCallComponent } from './incomming-call/incomming-call.component';
import { IconModule } from '../shared/components/icon/icon.module';
import { AvatarModule } from '../shared/components/avatar/avatar.module';
import { OutcomingCallComponent } from './outcoming-call/outcoming-call.component';

import { OverlayModule } from '@angular/cdk/overlay';


@NgModule({
  declarations: [
    IncommingCallComponent,
    OutcomingCallComponent
  ],
  imports: [
    CommonModule,
    IconModule,
    AvatarModule,
    OverlayModule
  ],
  exports: [IncommingCallComponent, OutcomingCallComponent]
})
export class CallModule { }
