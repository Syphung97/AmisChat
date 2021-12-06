import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
    selector: '[amisFirstFocusInvalid]'
})
export class AmisFirstFocusInvalidDirective {

    constructor(private el: ElementRef) { }

    /**
     * Tự động focus vào ô lỗi đầu tiên với sự kiện submit
     * created by vhtruong - 11/03/2020
     */
    @HostListener('submit')
    onFormSubmit() {
        setTimeout(() => {
            const invalidControl = this.el.nativeElement.querySelector('.border-error');

            if (invalidControl) {
                if (invalidControl instanceof (HTMLInputElement)) {
                    invalidControl.focus();
                    return;
                }
                const lstInput = invalidControl.querySelectorAll('input');
                if (lstInput.length > 0) {
                    for (let i = 0; i < lstInput.length; i++) {
                        if (lstInput[i].getAttribute('type') !== "hidden") {
                            lstInput[i].focus();
                            return;
                        }
                    }
                }
            }
        }, 0);
    }
}
