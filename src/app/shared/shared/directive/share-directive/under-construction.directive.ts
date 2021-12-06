import { Directive, HostListener } from '@angular/core';
import { AmisTransferDataService } from 'src/common/services/amis-transfer-data.service';

/**
 * derective hiện thông báo chức năng đang thi công
 * cre nvcuong1 18/11/2019
 * @export
 * @class UnderConstructionDirective
 */
@Directive({
  selector: "[appUnderConstruction]"
})
export class UnderConstructionDirective {
  @HostListener("click", ["$event"])
  onClick($event: UIEvent) {
    this.click($event);
  }

  constructor(
    private transferDataSV: AmisTransferDataService
  ) { }

  /**
   * xử lý click vào item được gán derective
   * @param {any} e
   * @memberof UnderConstructionDirective
   */
  click(e): void {
    this.transferDataSV.showWarningToast("Tính năng đang phát triển");
  }
}
