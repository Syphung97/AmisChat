import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'amis-hrm-form-components',
  templateUrl: './hrm-form-components.component.html',
  styleUrls: ['./hrm-form-components.component.scss']
})
export class HrmFormComponentsComponent implements OnInit {

  @Input() cls: string;

  constructor() { }

  ngOnInit(): void {
  }

}
