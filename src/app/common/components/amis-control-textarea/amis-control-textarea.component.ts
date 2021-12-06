import { Component, OnInit, forwardRef, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl } from '@angular/forms';
import { BaseControl } from '../base-control';
import { AmisDataService } from 'src/common/services/amis-data.service';
import { AmisTransferDataService } from 'src/common/services/amis-transfer-data.service';
import { AmisTranslationService } from 'src/common/services/amis-translation.service';
import { DxTextAreaComponent } from 'devextreme-angular';

@Component({
  selector: 'amis-amis-control-textarea',
  templateUrl: './amis-control-textarea.component.html',
  styleUrls: ['./amis-control-textarea.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AmisControlTextareaComponent),
      multi: true
    }
  ]
})
export class AmisControlTextareaComponent extends BaseControl implements OnInit, ControlValueAccessor {

  @ViewChild('input') input: DxTextAreaComponent;

  constructor(
    public httpBase: AmisDataService,
    public amisTransferDataService: AmisTransferDataService,
    public amisTranslateSV: AmisTranslationService
  ) {
    super(amisTransferDataService, amisTranslateSV);
  }

  visiblePopup: boolean = false;

  ngOnInit(): void {
  }

  /**
   * Lấy giá trị bắn ra từ popup
   * nmduy 23/07/2020
   */
  onGetValue(value) {
    this.value = value;
  }

  onValueChanged(e) {
    if (e.event) {
      super.onValueChanged();
    }
  }

}
