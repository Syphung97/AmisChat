import { Component, OnInit, Output, EventEmitter, ElementRef, HostListener } from '@angular/core';
import { Input } from '@angular/core';
import { TransferDataService } from 'src/app/services/base/transfer-data.service';
import { BaseComponent } from '../base-component';
import { takeUntil } from 'rxjs/operators';
import { AmisCommonUtils } from 'src/common/fn/common-utils';

@Component({
  selector: 'amis-switch',
  templateUrl: './amis-switch.component.html',
  styleUrls: ['./amis-switch.component.scss']
})
export class AmisSwitchComponent extends BaseComponent implements OnInit {

  //màu chữ active của list tab
  @Input() value = true;
  @Input() valueTextTrue = '';
  @Input() valueTextFalse = '';

  @Input() isDisabled = false;
  @Output() outputTabActive: EventEmitter<boolean> = new EventEmitter<boolean>();

  valueText = '';

  constructor(
    private transferData: TransferDataService,
    private el: ElementRef
  ) {
    super();
  }

  ngOnInit(): void {

  }
  /**
   * thay đổi trạng thái khi tác động lên switch control
   *
   * @memberof AmisSwitchComponent
   */
  handleSwitchButton(){
    if(this.value){
      this.valueText = this.valueTextTrue;
    }else{
      this.valueText = this.valueTextFalse;
    }
    this.outputTabActive.emit(this.value);
  }

  /**
   * resize màn hình
   * @memberof AmisTabsComponent
   * CREATED BY vbcong - 22/07/2020
   */
  @HostListener("window:resize", ["$event"])
  public handleKeyUpEvent(event: KeyboardEvent): void {
  }
}
