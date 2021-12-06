import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'amis-popup-forward-message',
  templateUrl: './popup-forward-message.component.html',
  styleUrls: ['./popup-forward-message.component.scss']
})
export class PopupForwardMessageComponent implements OnInit {

  constructor() { }

  @Input() isVisible = true;

  ngOnInit(): void {
  }

}
