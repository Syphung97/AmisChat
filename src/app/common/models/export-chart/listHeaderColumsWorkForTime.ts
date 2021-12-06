import { ColumnHeaderConfig } from "../export/column-header-config";
import { DataType } from "../export/data-type.enum";
import { AlignmentType } from "../export/alignment-type.enum";

export const HeaderColumnsWorkForTime: ColumnHeaderConfig[] = [
  {
    Caption: "Tên công việc",
    FieldName: "TaskName",
    Width: 300,
    DataType: DataType.DefaultType,
    EnumName: "TaskName",
    Alignment: AlignmentType.Left
  },
  {
    Caption: "Người thực hiện",
    FieldName: "AssignName",
    Width: 250,
    DataType: DataType.DefaultType,
    EnumName: "AssignName",
    Alignment: AlignmentType.Left
  }
];
