import { DataType } from "./data-type.enum";
import { AlignmentType } from "./alignment-type.enum";

export class ColumnHeaderConfig {
  Caption: string;
  FieldName: string;
  Width?: number;
  DataType: DataType;
  EnumName: string;
  Alignment: AlignmentType;
  IsCheck?: boolean;


  constructor(
    Caption: string,
    FieldName: string,
    dataType: DataType,
    alignment: AlignmentType

  ) {
    this.Caption = Caption;
    this.FieldName = FieldName;
    this.DataType = dataType;
    this.Alignment = alignment;
  }
}
