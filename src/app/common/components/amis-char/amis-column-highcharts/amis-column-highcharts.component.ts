import { Component, OnInit, Input } from "@angular/core";
// import * as Highcharts from "highcharts";
import { AmisTranslationService } from "src/common/services/amis-translation.service";
import { MultipleChart } from "src/common/models/chart/MultipleChart";

@Component({
  selector: "amis-amis-column-highcharts",
  templateUrl: "./amis-column-highcharts.component.html",
  styleUrls: ["./amis-column-highcharts.component.scss"]
})
export class AmisColumnHighchartsComponent implements OnInit {
  // có sử dụng chú thích mặc định hay không.
  @Input()
  set setDataChart(data) {
    if (data) {
      this.dataSource = data;
    }
  }
  dataSource = [
    // { AssigneeName: "Anh Nguyễn Mạnh Đức NEW", FinishDate: 2, UnFinishDate: 1 },
    // { AssigneeName: "Dư ngọc Cường", FinishDate: 2, UnFinishDate: 4 }
  ];
  // có sử dụng chú thích mặc định hay không.
  @Input()
  legend: any = false;
  // chiều cao của biểu đồ
  @Input()
  set setheight(data) {
    if (data) {
      this.height = data;
    }
  }
  height: any = 360;
  // tên hiển thị bên trái
  @Input()
  set setArgumentField(data) {
    if (data) {
      this.argumentField = data;
    }
  }
  argumentField: any = "AssigneeName";
  // config các data hiển thị ở trên biểu đò
  @Input()
  set setConfigDataChart(data) {
    if (data) {
      this.configDataChart = data;
    }
  }
  //  tên cột dọc của biểu đồ
  @Input()
  labelBottom = "Số lượng công việc";
  // chú thích của biểu đồ
  @Input()
  Arraylenged: MultipleChart[];
  configDataChart: MultipleChart[] = [
    // { valueField: "FinishDate", color: "#51d561" },
    // { valueField: "UnFinishDate", color: "#8DA3A6" }
  ];

  constructor(private translateService: AmisTranslationService) {}

  pointClick(e: any) {
    const point = e.target;
    if (point.isSelected()) {
      point.clearSelection();
    } else {
      point.select();
    }
  }
  ngOnInit() {}
  customizeLabel(poin) {
    // console.log(1);
    if (poin.value === 0) {
      return "";
    } else {
      return poin.value;
    }
  }
}
