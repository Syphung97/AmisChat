import { ColumnHeaderConfig } from "../export/column-header-config";
import { DataType } from "../export/data-type.enum";
import { AlignmentType } from "../export/alignment-type.enum";

export const HeaderColumns: ColumnHeaderConfig[] = [
  {
    Caption: "Tên công việc",
    FieldName: "TaskName",
    Width: 400,
    DataType: DataType.DefaultType,
    EnumName: "TaskName",
    Alignment: AlignmentType.Left
  },
  {
    Caption: "Người thực hiện",
    FieldName: "AssigneeName",
    Width: 250,
    DataType: DataType.DefaultType,
    EnumName: "AssigneeName",
    Alignment: AlignmentType.Left
  },
  {
    Caption: "Hạn hoàn thành",
    FieldName: "EndDate",
    Width: 250,
    DataType: DataType.DefaultType,
    EnumName: "EndDate",
    Alignment: AlignmentType.Center
  },
  {
    Caption: "Quan trọng",
    FieldName: "Important",
    Width: 150,
    DataType: DataType.DefaultType,
    EnumName: "Important",
    Alignment: AlignmentType.Center
  },
  {
    Caption: "Khẩn cấp",
    FieldName: "Emergency",
    Width: 150,
    DataType: DataType.DefaultType,
    EnumName: "Emergency",
    Alignment: AlignmentType.Center
  },
  {
    Caption: "Eisenhower",
    FieldName: "Eisenhower",
    Width: 300,
    DataType: DataType.DefaultType,
    EnumName: "Eisenhower",
    Alignment: AlignmentType.Left
  },
  {
    Caption: "Người giao việc",
    FieldName: "OwnerName",
    Width: 300,
    DataType: DataType.DefaultType,
    EnumName: "OwnerName",
    Alignment: AlignmentType.Left
  },
  {
    Caption: "Người liên quan",
    FieldName: "PeopleInvolvedName",
    Width: 500,
    DataType: DataType.DefaultType,
    EnumName: "PeopleInvolvedName",
    Alignment: AlignmentType.Left
  }
];
