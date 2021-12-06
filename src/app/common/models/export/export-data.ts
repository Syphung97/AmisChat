import { ColumnHeaderConfig } from "./column-header-config";
import { FileTypeEnum } from "./file-type.enum";
import { TitleParamConfig, TitleParamConfigNew } from "./titleParamConfig";

export class ExportData {
  Title: string;
  Subtitle: string;
  ExportFileType: FileTypeEnum;
  HeaderColumns: ColumnHeaderConfig[];
  APIPath: string;
  Param: object;
  Method: any;
  FileName: string;
  Data: any;
  ShowSummary?: boolean;
  TitleParam?: any;
  SummaryData?: any;
  TotalColunmsMergeSummary?: number;
  TotalRowsMergeSummary?: number;
  StartColunmMergeIndex?: number;
  IndexHeaderRow?: any;
  IsAutoFitColumn?: any;
  SheetName?: any;
  GroupConfigs: any[];
  constructor() {}
}
