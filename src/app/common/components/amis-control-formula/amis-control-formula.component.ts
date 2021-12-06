import { Component, OnInit, forwardRef, ViewChild, ElementRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseControl } from '../base-control';
import { AmisDataService } from 'src/common/services/amis-data.service';
import { AmisTransferDataService } from 'src/common/services/amis-transfer-data.service';
import { AmisTranslationService } from 'src/common/services/amis-translation.service';
import { AmisCommonUtils } from 'src/common/fn/common-utils';

@Component({
  selector: 'amis-amis-control-formula',
  templateUrl: './amis-control-formula.component.html',
  styleUrls: ['./amis-control-formula.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AmisControlFormulaComponent),
      multi: true
    }
  ]
})
export class AmisControlFormulaComponent extends BaseControl implements OnInit {

  @ViewChild('input') input: ElementRef;

  // Hiển thị popup thêm sửa công thức
  isShowPopup: boolean = false;

  // Giá trị công thức
  valueFx: string;

  // Danh sách công thức
  listFx = [{
    Text: "+ Cộng",
    Value: "+"
  },
  {
    Text: "- Trừ",
    Value: "-"
  },
  {
    Text: "* Nhân",
    Value: "*"
  },
  {
    Text: "% Chia",
    Value: "%"
  },
  {
    Text: "( Mở ngoặc",
    Value: "("
  },
  {
    Text: ") Đóng ngoặc",
    Value: ")"
  }]

  // Công thức hợp lệ
  isValidFx: boolean = false;

  // Lỗi công thức
  isErrorFx: boolean = false;

  isSubmitFx: boolean = false;

  // Thông báo lỗi công thức
  errorMessageFx: string = "";

  constructor(
    public httpBase: AmisDataService,
    public amisTransferDataService: AmisTransferDataService,
    public amisTranslateSV: AmisTranslationService
  ) {
    super(amisTransferDataService, amisTranslateSV);
  }

  ngOnInit(): void {
  }


  /**
   * Hiển thị popup thêm sửa công thức
   * @memberof AmisControlFormulaComponent
   * created by vhtruong - 23/05/2020
   */
  showPopup() {
    this.valueFx = AmisCommonUtils.cloneData(this._value);
    this.isShowPopup = true;
  }

  /**
   * Ẩn popup thêm sửa công thức
   * @memberof AmisControlFormulaComponent
   * created by vhtruong - 23/05/2020
   */
  hidePopup() {
    this.isShowPopup = false;
  }


  /**
   * Thêm một công thức toán học vào công thức
   * @param {any} item 
   * @memberof AmisControlFormulaComponent
   * created by vhtruong - 23/05/2020
   */
  addFx(item) {
    if (this.valueFx) {
      this.valueFx += ` ${item.Value} `;
    } else {
      this.valueFx = `${item.Value} `
    }
  }


  /**
   * Xóa công thức
   * @memberof AmisControlFormulaComponent
   * created by vhtruong - 23/05/2020
   */
  deleteAllFx() {
    this.valueFx = "";
  }


  /**
   * Kiểm tra công thức
   * @memberof AmisControlFormulaComponent
   * created by vhtruong - 23/05/2020
   */
  testFx() {

  }


  /**
   * Validate tính hợp lệ của công thức
   * @memberof AmisControlFormulaComponent
   * created by vhtruong - 23/05/2020
   */
  validateFx() {
    return true;
  }


  /**
   * Lưu công thức
   * @memberof AmisControlFormulaComponent
   * created by vhtruong - 23/05/2020
   */
  saveFX() {
    if (this.validateFx()) {
      if (this.valueFx) {
        // this.isSubmitFx = true;
        // this.isErrorFx = true;
        // this.errorMessageFx = "abc";
        this.writeValue(this.valueFx);
        this.isShowPopup = false;
      }
    }
  }

}
