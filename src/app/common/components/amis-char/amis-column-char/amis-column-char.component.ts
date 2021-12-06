import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { AmisCommonUtils } from 'src/common/fn/common-utils';
import { DxChartComponent } from 'devextreme-angular';
import { TransferDataService } from 'src/app/services/base/transfer-data.service';
import { ChartType } from 'src/app/shared/enum/chart-type/chart-type';

@Component({
  selector: "amis-column-char",
  templateUrl: "./amis-column-char.component.html",
  styleUrls: ["./amis-column-char.component.scss"]
})
export class AmisColumnCharComponent implements OnInit {

  chartType = ChartType;

  @ViewChild("dxChart") dxChart: DxChartComponent;

  /**
   * Component dùng biểu đồ chung cho việc báo cáo (báo cáo công việc phòng ban)
   * CREATED BY NPNAM - 24/03/2020
   * @memberof AmisColumnCharComponent
   */

  //Truyền data cho dữ liệu biểu đồ:

  dataChart = [];
  @Input()
  set dataSource(data) {
    if (data) {
      this.dataChart = AmisCommonUtils.cloneDeepData(data);
    }
  }

  //Chiều cao của biểu đồ
  @Input()
  height;

  // vẽ lại biếu đồ
  @Input() set isRender(value) {
    if (value?.IsRender) {
      this.reDrawChart(false);
    }
  };

  // title biểu đồ
  @Input()
  valueAxisTitle;

  //Mã màu cho biểu đồ:
  @Input()
  palette;

  //Độ rộng của cột trong biểu đồ:
  @Input()
  barGroupWidth;

  //Truyền vào trường dữ liệu là tên của cột (trường nào trong dataSource)
  @Input()
  fieldColumnName: string;

  //Truyền vào field để hiển thị ra biểu đồ:
  @Input()
  listFieldInput: FieldStackedBarChart[];

  //Truyền vào chú thích biểu đồ (legend)
  @Input()
  listDataLegend = [];

  @Input()
  width;

  @Input()
  displayCol = 15;

  @Input()
  scrollMinCol = 15;

  @Input()
  customTooltip = true;

  @Input()
  type: ChartType = ChartType.Bar;

  maxValueAxis = 0;

  chartHeight;

  isShow: boolean = true;

  isHaveData: boolean = false;

  constructor(
    private transferDataSV: TransferDataService
  ) { }

  ngOnInit() {
    this.handleChartData();
    this.handlerSameValueData();
    this.transferDataSV.isBigSidebar.subscribe(res => {
      this.reDrawChart();
    });
    this.chartHeight = this.type == ChartType.Spline ? this.height - 30 : this.height;
  }

  /**
   * Vẽ lại biểu đồ khi co dãn sidebar
   * nmduy 19/08/2020
   */
  reDrawChart(isRerender = true) {
    if (isRerender) {
      setTimeout(() => {
        this.dxChart?.instance?.render({
          force: true, // forces redrawing
          animate: true // redraws the widget with animation
        });
      }, 200);
    } else {
      this.isShow = false;
      setTimeout(() => {
        this.chartHeight = this.type == ChartType.Spline ? this.height - 30 : this.height;
        this.isShow = true;
      }, 200);
    }
  }

  /**
   * Tùy chỉnh lại text trên cột giá trị 
   * nmduy 22/08/2020
   */
  customizeTextValueAxisLabel(arg: any) {
    if (arg.value < 10000) {
      return arg.value;
    } else {
      return `${arg.value / 1000}N`;
    }
  }


  /**
   * customize text hiển thị khi hover label
   * nmduy 19/08/2020
   */
  customizeHint(arg: any) {
    switch (arg.value) {
      case "T1":
        return "Tháng 1"
      case "T2":
        return "Tháng 2"
      case "T3":
        return "Tháng 3"
      case "T4":
        return "Tháng 4"
      case "T5":
        return "Tháng 5"
      case "T6":
        return "Tháng 6"
      case "T7":
        return "Tháng 7"
      case "T8":
        return "Tháng 8"
      case "T9":
        return "Tháng 9"
      case "T10":
        return "Tháng 10"
      case "T11":
        return "Tháng 11"
      case "T12":
        return "Tháng 12"
      default:
        break;
    }

  }


  /**
   * customize tooltip
   * nvhung3 27/07/2020
   */
  customizeTooltip(arg: any) {
    // tslint:disable-next-line:one-variable-per-declaration
    const items = arg.valueText.split("\n"),
      poins = arg.points;
    // tslint:disable-next-line:variable-name
    let _html = `<div style="padding: 7px 12px;background-color: #2a2e41;color: white; position:relative; font-family: Roboto, Helvetica, Arial, sans-serif;
    border-radius: 4px;">`;
    if (items?.length > 1) {
      items.forEach((item, index) => {
        {
          const indexOf = item.indexOf(":");
          const text = item.substring(0, indexOf);
          const val = item.substring(indexOf + 2);
          const color = poins[index].point.getColor();
          let div;
          div = `<div class="dis-flex dis-justify-content-between"><div>${text}:</div> <div class="ml-1 bold">${val}</div></div>`
          _html += div;
        }
      });
    } else if (items?.length == 1) {
      const indexOf = items[0].indexOf(":");
      let div = `${arg.argument}: <span class="bold">${items[0].substring(indexOf + 2)}</span>`;
      _html += div;
    }
    _html += `<div class="arrow-down"
    style="width: 0;
     height: 0;
     border-left: 10px solid transparent;
     border-right: 10px solid transparent;
     border-top: 10px solid #2a2e41;
     border-radius: 2px;
     position:absolute;
     top: 100%;
     left: 50%;
     margin-left: -10px">
  </div> </div>`;
    return { html: _html };
  }
  /**
   * Sự kiện hover để xem tool tip tổng số công viện
   * NPNAM - 7/4/2020
   */
  hoverShowTooltip(event) {
    if (event.target.originalValue != 0) {
      let point = event.target;
      point.showTooltip();
      if (!point.isHovered()) {
        point.hideTooltip();
      }
    }
  }
  // customizeTooltip = (info: any) => {
  //   return {
  //     html: "<div><div class='tooltip-header'>" +
  //       123 + "</div>" +
  //       "<div class='tooltip-body'><div class='series-name'>" +
  //       456 +
  //       ": </div><div class='value-text'>" +
  //       info.value + "</div></div></div>"
  //   };
  // }

  /**
   * Hàm sử lý data bị trùng
   * nvhung3 27/07/2020
   */
  handlerSameValueData() {
    const start = 2; // file trung nhau bắt đầu đánh dấu từ số 2
    let index = start;
    // tslint:disable-next-line:prefer-for-of
    if (this.dataChart?.length) {
      let max = 0;
      for (let i = 1; i < this.dataChart.length; i++) {
        if (this.dataChart[i][this.fieldColumnName] === this.dataChart[i - 1][this.fieldColumnName]) {
          this.dataChart[i][this.fieldColumnName] += ` (${index})`;
          index++;
        } else {
          index = start;
        }
      }
    }
  }

  /**
   * Lấy giá trị tối đa cột giá trị
   * nmduy 20/08/2020
   */
  handleChartData() {
    if (this.dataChart?.length) {
      let max = 0;
      this.dataChart.forEach(element => {
        for (let i = 0; i < this.listFieldInput.length; i++) {
          const fieldInput = this.listFieldInput[i].valueField;
          max = element[fieldInput] > max ? element[fieldInput] : max;
          if (!this.isHaveData) {
            this.isHaveData = element[fieldInput] > 0 ? true : false;
          }
        }
      });
      this.maxValueAxis = max < 5 ? max + 1 : (max += Math.ceil(max / 5));
    }
  }

  /**
  * Xử lý text hiển thị label
  * nmduy 20/08/2020
  */
  customizeTextLabel(arg: any) {
    if (!arg.value) {
      return "";
    } else {
      return `<b>${arg.value}</b>`;
    }
  }
}



export class FieldStackedBarChart {
  valueField: string;
  nameValue: string;
  color: string;
}
export class ReportDepartment {
  projectName: string;
  hoanthanh: number;
  trehan: number;
  choduyet: number;
  chuahoanthanh: number;
  quahan: number;
}
