import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[amisHidenPermission]',
})
export class HidenPermissionDirective implements OnInit {
  @Input() appCode;

  // tslint:disable-next-line:variable-name
  constructor(private _elementRef: ElementRef) {}

  ngOnInit(): void {
    const appCode = localStorage.getItem('Applications');
    if (!appCode?.includes(this.appCode)) {
      const el: HTMLElement = this._elementRef.nativeElement;
      if (el) {
        el.parentNode?.removeChild(el);
      }
    }
  }
}
