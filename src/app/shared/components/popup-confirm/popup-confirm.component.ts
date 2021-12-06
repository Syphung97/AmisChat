import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'amis-popup-confirm',
  templateUrl: './popup-confirm.component.html',
  styleUrls: ['./popup-confirm.component.scss']
})
export class PopupConfirmComponent implements OnInit {

  @Input() isVisible = true;

  @Input() style!: object;

  @Input() title!: string;

  @Input() width!: string;

  @Output() onCancel = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  cancel(e: any): void {
    this.onCancel.emit(e);
    this.isVisible = false;
  }
  close(): void {
    this.isVisible = false;
  }
}
