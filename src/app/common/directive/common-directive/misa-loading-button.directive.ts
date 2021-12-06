import { Directive, HostListener, ElementRef, Renderer2, Input, OnChanges } from '@angular/core';

/**
 * Directive loading MISA button
 * @export
 * @class MisaLoadingButtonDirective
 * CREATED BY: DNCuong(10/01/2019)
 */
@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[misaLoadingButton]'
})
export class MisaLoadingButtonDirective implements OnChanges {

    @Input() finishCall: boolean;
    @Input() startCall: boolean;

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
    ) { }

    ngOnChanges() {

        const loading = this.el.nativeElement.querySelector(".misa-button-loading");
        if (loading) {
            this.renderer.removeClass(this.el.nativeElement, "misa-button-loading");
            this.renderer.removeClass(this.el.nativeElement.parentElement, "disabled-misa-button");

            // this.el.nativeElement.innerHTML = "";
            loading.parentNode.removeChild(loading);

        }
        // Nếu lần chỗ gọi directive này set bắt đầu gọi thì sẽ gọi loading

        if (this.startCall) {
            this.click();
        }
    }

    /**
     * xử lý click vào item được gán derective
     * @param {any} e
     * @memberof UnderConstructionDirective
     * cre nvcuong1 18/11/2019
     */
    click(): void {

        const misaEl = this.renderer.createElement("div");
        this.renderer.addClass(misaEl, "misa-button-loading");
        misaEl.innerHTML = `
        <svg class="spinner" viewBox="25 25 50 50">
          <circle class="path" cx="50" cy="50" r="20" fill="none" stroke- width="2" stroke-miterlimit="10" />
        </svg>
        `;

        this.renderer.appendChild(this.el.nativeElement, misaEl);
        this.renderer.addClass(this.el.nativeElement.parentElement, "disabled-misa-button");
    }

    @HostListener("click", ["$event"])
    onClick($event: UIEvent) {
    }
}
