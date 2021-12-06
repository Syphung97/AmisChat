import { Component, OnInit, Input } from '@angular/core';
import { SquareChart } from 'src/common/models/chart/square-chart';

@Component({
  selector: "amis-square-chart",
  templateUrl: "./amis-square-chart.component.html",
  styleUrls: ["./amis-square-chart.component.scss"]
})
export class AmisSquareChartComponent implements OnInit {
  @Input()
  dataSource: SquareChart = new SquareChart();
  @Input()
  width;
  @Input()
  height;
  constructor() {
  }

  ngOnInit() {}
}
