import { Component, OnInit, Input } from "@angular/core";
import { AreaChart } from "src/common/models/chart/area-chart";

@Component({
  selector: "amis-area-chart",
  templateUrl: "./amis-area-chart.component.html",
  styleUrls: ["./amis-area-chart.component.scss"]
})
export class AmisAreaChartComponent implements OnInit {
  @Input()
  argumentField;
  @Input()
  dataSource = [];
  @Input()
  width;
  @Input()
  height;
  constructor() {}

  ngOnInit() {}
  // hàm conver lại số lượng công việc
  customizeText = (arg: any) => {
    const value = parseFloat(arg.valueText.replace(",", "."));
    console.log(value);
    // tslint:disable-next-line:radix
    return value % 1 !== 0 ? '' : parseInt(value + "");
  }
}
