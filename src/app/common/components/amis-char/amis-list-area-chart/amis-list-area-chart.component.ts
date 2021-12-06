import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: "amis-amis-list-area-chart",
  templateUrl: "./amis-list-area-chart.component.html",
  styleUrls: ["./amis-list-area-chart.component.scss"]
})
export class AmisListAreaChartComponent implements OnInit {
  @Input()
  argumentField = "name";
  @Input()
  dataSource = [];
  @Input()
  valueAxis;
  @Input()
  height = 50;
  constructor() {}

  ngOnInit() {
  }
}
