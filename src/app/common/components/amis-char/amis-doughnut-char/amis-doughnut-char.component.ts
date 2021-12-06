import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { PieChartData } from 'src/app/shared/models/chart/pie-chart';
import { ChartColor } from 'src/app/shared/constant/color-panel/chart-color';
import { registerPalette, currentPalette } from 'devextreme/viz/palette';
import { DxChartComponent } from 'devextreme-angular';

declare var $: any;

@Component({
  selector: "amis-doughnut-char",
  templateUrl: "./amis-doughnut-char.component.html",
  styleUrls: ["./amis-doughnut-char.component.scss"]
})
export class AmisDoughnutCharComponent implements OnInit {

  @ViewChild("dxChart") dxChart: DxChartComponent;
  // vẽ lại biếu đồ
  @Input() set isRender(value) {
    if (value?.IsRender) {
      this.reDrawChart(false);
    }
  };

  // Biến dùng set chiều rộng cho biểu đồ
  _orginWidth: string = "auto";
  @Input() set width(value) {
    if (value) {
      this.chartSize.width = value;
      this._orginWidth = value;
    }
  }



  // Biến dùng set chiều cao cho biểu đồ
  @Input() set height(value) {
    if (value) {
      this.chartSize.height = value;
      this.legendHeight = `${parseInt(value) - 30}px`;
    }
  };

  @Input() expandWidth = ""; // chiều cao khi mode expand

  // Biến dùng để chỉnh bán kính cho biểu đồ: (0 -> 1)
  @Input()
  radius: string;

  // có phải mode xem full không
  _isExpand = false;
  @Input() set isExpand(value) {
    if (value?.IsExpand) {
      this._isExpand = true;
      if (this.expandWidth) {
        this.chartSize.width = this.expandWidth;
      }
    } else {
      if (this._orginWidth) {
        this.chartSize.width = this._orginWidth;
      } else {
        this.chartSize.width = "auto";
      }
      this._isExpand = false;
    }
  };

  // có phải mode xem chú thích không
  _isShowLegend = true;
  @Input() set isShowLegend(value) {
    this._isShowLegend = value ? true : false;
  };

  // font size cho chữ ở bên trong biểu đồ:
  @Input()
  fontSizeContent: string;

  // Mã màu cho các ô trong biểu đồ:
  @Input()
  palette = [];

  // DataSource truyền vào biểu đồ:
  @Input()
  set listDataForPieChart(data) {
    this._listDataForPieChart = data;

    if (this._listDataForPieChart?.length) {
      this.getLegendaryItems();
    }
  }
  _listDataForPieChart: Array<PieChartData>;

  // 1: Chỉ hiển thị số công việc, 2: hiện thị % hoàn thành và số công việc.
  @Input()
  styleContent;

  // Có hiển thị tên trạng thái khi hover hay không?
  @Input()
  isShowStatus = false;

  // Có hiển thị tên trạng thái khi hover hay không?
  @Input()
  argumentField = "argumentField";

  // Có hiển thị tên trạng thái khi hover hay không?
  @Input()
  valueField = "valueField";

  sumValue: any;

  @Input()
  enabledTooltip1 = true;

  isShow: boolean = true;

  legendHeight = "200px";

  // kích thước biểu đồ
  chartSize = {
    height: "",
    width: "auto"
  }

  constructor() { }

  ngOnInit() {
    var servicePortalPalette = {
      simpleSet: ChartColor,
    };
    registerPalette('servicePortalPalette', servicePortalPalette);
    currentPalette('servicePortalPalette');
    this.getLegendaryItems();
  }

  /**
   * Tính chiều rộng biểu đồ
   * nmduy 21/08/2020
   */
  calculateChartWidth() {
    // const target = document.querySelector(`#doghnut-chart-container`)
    // const width = target?.clientWidth;
    // if (width > 800) {
    //   this.width = "600";
    // } else {
    //   this.width = "auto";
    // }
  }

  /**
   * sinh ra danh sách chú thích 
   * nmduy 19/08/2020
   */
  getLegendaryItems() {
    let sum = 0;
    for (let i = 0; i < this._listDataForPieChart.length; i++) {
      const element = this._listDataForPieChart[i];
      element.colorField = ChartColor[i];
      sum += element[this.valueField];
    }
    this.sumValue = sum ? sum : this.sumValue;
  }

  /**
   * tùy chỉnh lại text hiển thị trên biểu đồ
   * nmduy 20/08/2020
   */
  customizeLabel(arg: any) {
    let percent = parseFloat(parseFloat((arg.percent * 100).toString()).toFixed(2))
    return `${arg.argumentText.trim()}: <b>${arg.valueText.replace(".", "")} (${percent}%)</b>`;
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
        this.isShow = true;
      }, 200);
    }


  }



  /**
   * custom lại tooltip hiển thị 
   * nmduy 20/08/2020
   */
  customizeTooltip(arg: any) {
    let percent = parseFloat(parseFloat((arg.percent * 100).toString()).toFixed(2));
    let _html = `<div style="padding: 7px 12px;background-color: #2a2e41;color: white; position:relative; font-family: Roboto, Helvetica, Arial, sans-serif;
   border-radius: 4px;">`;
    let div = `<div>${arg.argumentText.trim()}: <b>${arg.valueText.replace(".", "")} (${percent}%)</b></div>`
    _html += div;
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

  hoverShowTooltip(event) {
    // if (event.target.originalValue !== 0) {
    //   Calc.data = this._listDataForPieChart;
    //   Calc.index = this.palette.findIndex(n => n === event.target.getColor());
    // }
  }
}


