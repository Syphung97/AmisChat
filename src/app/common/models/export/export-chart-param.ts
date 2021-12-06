import { ColumnHeaderConfig } from "./column-header-config";
import { FileTypeEnum } from "./file-type.enum";
import { ChartTypeEnum } from './chart-type.enum';
import { DataType } from './data-type.enum';
import { ExportData } from './export-data';

// chi tiết xem trong ExportData.cs trong backend
export class ExportChartParam {
  ChartType: ChartTypeEnum;
  Data: ChartData[];
  ExportType: FileTypeEnum;
  Title: string;
  FileName: string;
  SubTitle: string[];
  DataType: DataType;
  CustomTitleTargetName: string;
  TitleColumnData: string;
  TitleColumnText: string;
  ExportDatas: ExportData[];
  SheetName: string;
  TitleColumnPercent: string;
  IsShowSummary: boolean;
  ShowColumnPercent: boolean;

  constructor() {}
}

export class ChartData{
  Text: string;
  Count: number;
  Percent: number;
  TotalCount: number;
  MultiData: ChartData[];

  constructor() { }
}
