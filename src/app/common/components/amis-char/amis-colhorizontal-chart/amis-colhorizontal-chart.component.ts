import { Component, OnInit, Input, OnChanges } from "@angular/core";
import { ColhorizontalChart } from "src/common/models/chart/colhorizontal-chart";
import { AmisTranslationService } from "src/common/services/amis-translation.service";
import { TaskReportKey } from "src/app/shared/constant/task/task-report-status";
@Component({
  selector: "amis-colhorizontal-chart",
  templateUrl: "./amis-colhorizontal-chart.component.html",
  styleUrls: ["./amis-colhorizontal-chart.component.scss"]
})
export class AmisColhorizontalChartComponent implements OnInit, OnChanges {
  @Input()
  dataSource: ColhorizontalChart[] = [];
  @Input()
  argumentField: any;
  @Input()
  valueField: any;
  @Input()
  startColum: any;
  @Input()
  endColum: any;
  @Input()
  visibleLegend = false;
  @Input()
  ColumnName;
  @Input()
  ColumnLong = "";
  @Input()
  height: number;
  @Input()
  width: number;
  @Input()
  labelBottom = "Số lượng công việc";
  @Input()
  Arraylenged = [
    this.translateService.getValueByKey("TMS_REPORT_PROJECT_FINISH"),
    this.translateService.getValueByKey("TMS_REPORT_PROJECT_UNFINISH"),
    this.translateService.getValueByKey("TMS_REPORT_PROJECT_AVERAGE_FINISH"),
    this.translateService.getValueByKey("TMS_REPORT_PROJECT_AVERAGE_UNFINISH")
  ];
  averageDone = 0;
  averageUnDone = 0;
  check = 0;
  constructor(private translateService: AmisTranslationService) {}

  ngOnInit() {}
  ngOnChanges() {
    let averageDone = 0;
    let averageUnDone = 0;
    this.dataSource.forEach(e => {
      if (e.textLegend === TaskReportKey.Finish) {
        averageDone += e.data;
      } else if (e.textLegend === TaskReportKey.UnFinish) {
        averageUnDone += e.data;
      }
    });
    this.averageDone = averageDone / (this.dataSource.length / 2);
    this.averageUnDone = averageUnDone / (this.dataSource.length / 2);
  }

  customizeSeries(valueFromNamField: string) {
    // this.ColumnLong = this.ColumnLong ? this.ColumnLong : "";
    return valueFromNamField === TaskReportKey.Finish
      ? { color: "#51d561" }
      : { color: "#8DA3A6" };
  }
  // customizeText = (arg: any) => {
  //   const value = parseFloat(arg.valueText.replace(",", "."));
  //   console.log(value);
  //   // tslint:disable-next-line:radix
  //   return value % 1 != 0 ? '' : parseInt(value + "");
  // }
}
