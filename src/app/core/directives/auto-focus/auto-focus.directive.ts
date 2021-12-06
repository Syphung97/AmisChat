import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[amisAutoFocus]'
})
export class AutoFocusDirective implements OnInit {

  private focus = true;
  @Input() set autofocus(condition: boolean) {
    this.focus = condition !== false;
  }

  constructor(private el: ElementRef) { }


  ngOnInit(): void {
    if (this.focus) {

      window.setTimeout(() => {
        this.el.nativeElement.focus();
      },500);
    }
  }

}
