import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MentionControlComponent } from './mention-control/mention-control.component';
import { MentionControlDirective } from './mention-control.directive';



@NgModule({
  declarations: [
    MentionControlComponent,
    MentionControlDirective
  ],
  imports: [
    CommonModule
  ]
})
export class MentionControlModule { }
