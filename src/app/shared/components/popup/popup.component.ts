import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'amis-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {

  @Input() isVisible = true;

  @Input() style!: object;

  @Input() title!: string;

  @Input() width!: string;


  @Output() onCancel = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  // tslint:disable-next-line:typedef
  cancel(e: any): void {
    this.onCancel.emit(false);
    this.isVisible = false;
  }
}
