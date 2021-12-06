import { Component, OnInit, forwardRef, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { BaseControl } from '../base-control';
import { AmisDataService } from 'src/common/services/amis-data.service';
import { AmisTransferDataService } from 'src/common/services/amis-transfer-data.service';
import { AmisTranslationService } from 'src/common/services/amis-translation.service';
import { DxCheckBoxComponent } from 'devextreme-angular';

@Component({
  selector: 'amis-amis-control-checkbox',
  templateUrl: './amis-control-checkbox.component.html',
  styleUrls: ['./amis-control-checkbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AmisControlCheckboxComponent),
      multi: true
    }
  ]
})
export class AmisControlCheckboxComponent extends BaseControl implements OnInit, ControlValueAccessor {

  @ViewChild('input') input: DxCheckBoxComponent;
  
  constructor(
    public httpBase: AmisDataService,
    public amisTransferDataService: AmisTransferDataService,
    public amisTranslateSV: AmisTranslationService,
  ) {
    super(amisTransferDataService, amisTranslateSV);
  }

  ngOnInit(): void {
  }

  /**
   * Thay đổi giá trị input
   * created by vhtruong - 07/03/2020
   */
  onValueChanged(e) {
    if(e.event){
      super.onValueChanged(this._value);
    }
  }

}
