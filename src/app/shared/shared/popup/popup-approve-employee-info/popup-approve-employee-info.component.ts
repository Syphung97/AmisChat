import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'amis-popup-approve-employee-info',
  templateUrl: './popup-approve-employee-info.component.html',
  styleUrls: ['./popup-approve-employee-info.component.scss']
})
export class PopupApproveEmployeeInfoComponent implements OnInit {

  @Input() title = "";

  offsetY = "0 100px"

  listGroupConfigs = {

  }

  constructor() { }

  ngOnInit(): void {
  }


  closePopup() {

  }

}
