import { ColumnHeaderConfig } from "../export/column-header-config";
import { DataType } from "../export/data-type.enum";
import { AlignmentType } from "../export/alignment-type.enum";

export const HeaderColumnsByUser: ColumnHeaderConfig[] = [
  {
    Caption: "Người thực hiện",
    FieldName: "AssigneeName",
    Width: 250,
    DataType: DataType.DefaultType,
    EnumName: "AssigneeName",
    Alignment: AlignmentType.Left
  },
  {
    Caption: "Tên công việc",
    FieldName: "TaskName",
    Width: 450,
    DataType: DataType.DefaultType,
    EnumName: "TaskName",
    Alignment: AlignmentType.Left
  },
  {
    Caption: "Tình trạng",
    FieldName: "TaskStatus",
    Width: 200,
    DataType: DataType.DefaultType,
    EnumName: "TaskName",
    Alignment: AlignmentType.Left
  },
  {
    Caption: "Ngày giờ bắt đầu",
    FieldName: "StartDate",
    Width: 230,
    DataType: DataType.DefaultType,
    EnumName: "StartDate",
    Alignment: AlignmentType.Center
  },
  {
    Caption: "Hạn hoàn thành",
    FieldName: "EndDate",
    Width: 250,
    DataType: DataType.DefaultType,
    EnumName: "EndDate",
    Alignment: AlignmentType.Center
  },
  // {
  //   Caption: "Bắt đầu thực tế",
  //   FieldName: "RealStartDate",
  //   Width: 250,
  //   DataType: DataType.DefaultType,
  //   EnumName: "TaskName",
  //   Alignment: AlignmentType.Center
  // },
  {
    Caption: "Hoàn thành thực tế",
    FieldName: "FinishDate",
    Width: 250,
    DataType: DataType.DefaultType,
    EnumName: "FinishDate",
    Alignment: AlignmentType.Center
  }
];
