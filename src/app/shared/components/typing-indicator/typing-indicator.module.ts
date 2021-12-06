import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TypingIndicatorComponent } from './typing-indicator.component';



@NgModule({
  declarations: [
    TypingIndicatorComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [TypingIndicatorComponent]
})
export class TypingIndicatorModule { }
