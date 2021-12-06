import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'amis-amis-form-grid',
  templateUrl: './amis-form-grid.component.html',
  styleUrls: ['./amis-form-grid.component.scss']
})
export class AmisFormGridComponent implements OnInit {


  @Input() isHaveData: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
