export class ColumnMapping {
  // Trường dữ liệu trong database
  DatabaseField: string;
  // Caption trường dữ liệu trong database
  DatabaseFieldCaption: string;
  // Tên trường hiển thị
  DisplayField: string;
  // Số thứ tự trên file excel
  ImportFieldIndex: number;
  // Caption cột dữ liệu trên file excel
  ImportFieldCaption: string;
  IsRequired: boolean;
  objectBinding: HeaderExcel;
  IsDuplicate: boolean;
  Caption: string;
  FieldName: string;
  //kiểu dữ liệu
  DataType: number;
  //type control
  TypeControl: number;
  HasConfigColor: boolean;
  ColorConfig: any = {}
}

export class HeaderExcel {
  Caption: string;
  ColBegin: number;
  ColEnd: number;
  Field: string;
  Index: number;
  Width: number;
}
