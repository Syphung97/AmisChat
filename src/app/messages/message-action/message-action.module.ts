import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageActionComponent } from './message-action.component';



@NgModule({
  declarations: [
    MessageActionComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [MessageActionComponent]
})
export class MessageActionModule { }
