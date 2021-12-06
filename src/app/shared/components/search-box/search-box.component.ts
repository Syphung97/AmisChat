import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AmisTranslationService } from 'src/app/core/services/amis-translation-service.service';

@Component({
  selector: 'amis-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.less']
})
export class SearchBoxComponent implements OnInit {

  @Input() delayTime = 500;
  @Input() class = "";

  @Input() set value(data) {
    if (data != null && data != undefined) {

      this.valueSearch = data;
    }
  }
  isFocus = false;
  @Output() onSearch = new EventEmitter();

  @Output() onFocus = new EventEmitter();

  timeOutSearch: any;

  timeOutFocus: any;

  valueSearch!: string;

  constructor(
    private translateSV: AmisTranslationService
  ) { }

  ngOnInit(): void {
  }


  /**
   * Sử lí sự kiến search
   *
   * @memberof SearchBoxComponent
   * PTSY 5/5/2021
   */
  handleSearchAction(e: any): void {
    clearTimeout(this.timeOutSearch);

    this.timeOutSearch = setTimeout(() => {
      // this.valueSearch = e.target.value;
      this.onSearch.emit(this.valueSearch);

    }, this.delayTime);
  }

  onfocus(): void {
    this.isFocus = true;
    clearTimeout(this.timeOutFocus);

    this.timeOutFocus = setTimeout(() => {
      // this.valueSearch = e.target.value;
      this.onFocus.emit(this.isFocus);

    }, this.delayTime);

  }

  onblur(): void {
    this.isFocus = false;
    clearTimeout(this.timeOutFocus);

    this.timeOutFocus = setTimeout(() => {
      // this.valueSearch = e.target.value;
      this.onFocus.emit(this.isFocus);

    }, this.delayTime);
  }

}
