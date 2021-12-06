import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
    selector: '[amisFirstFocus]'
})
export class AmisFirstFocusDirective implements OnInit {

    constructor(private el: ElementRef) { }

    /**
     * Tự động focus vào ô mong muốn
     * created by vhtruong - 11/03/2020
     */
    ngOnInit(): void {
        setTimeout(() => {
            const control = this.el.nativeElement;

            if (control) {
                if (control instanceof (HTMLInputElement)) {
                    control.focus();
                    return;
                }
                let lstInput = control.querySelectorAll('input');
                if (lstInput.length > 0) {
                    // tslint:disable-next-line:prefer-for-of
                    for (let i = 0; i < lstInput.length; i++) {
                        if (lstInput[i].getAttribute('type') !== "hidden") {
                            lstInput[i].focus();
                            return;
                        }
                    }
                }
                lstInput = control.querySelectorAll('textarea');
                if (lstInput.length > 0) {
                    // tslint:disable-next-line:prefer-for-of
                    for (let i = 0; i < lstInput.length; i++) {
                        if (lstInput[i].getAttribute('type') !== "hidden") {
                            lstInput[i].focus();
                            return;
                        }
                    }
                }
            }
        }, 500);
    }


}
