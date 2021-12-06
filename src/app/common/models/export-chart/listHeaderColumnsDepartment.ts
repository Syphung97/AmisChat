import { ColumnHeaderConfig } from "../export/column-header-config";
import { DataType } from "../export/data-type.enum";
import { AlignmentType } from "../export/alignment-type.enum";

export const HeaderColumnsDepartment: ColumnHeaderConfig[] = [
  {
    Caption: "Dự án",
    FieldName: "ProjectName",
    Width: 350,
    DataType: DataType.DefaultType,
    EnumName: "ProjectName",
    Alignment: AlignmentType.Left
  },
  {
    Caption: "Tên công việc",
    FieldName: "TaskName",
    Width: 500,
    DataType: DataType.DefaultType,
    EnumName: "TaskName",
    Alignment: AlignmentType.Left
  },
  {
    Caption: "Người thực hiện",
    FieldName: "AssigneeName",
    Width: 250,
    DataType: DataType.DefaultType,
    EnumName: "TaskName",
    Alignment: AlignmentType.Left
  },
  {
    Caption: "Tình trạng",
    FieldName: "StatusTask",
    Width: 230,
    DataType: DataType.DefaultType,
    EnumName: "TaskName",
    Alignment: AlignmentType.Left
  },
  {
    Caption: "Ngày giờ bắt đầu",
    FieldName: "StartDate",
    Width: 230,
    DataType: DataType.DefaultType,
    EnumName: "TaskName",
    Alignment: AlignmentType.Center
  },
  {
    Caption: "Hạn hoàn thành",
    FieldName: "EndDate",
    Width: 230,
    DataType: DataType.DefaultType,
    EnumName: "TaskName",
    Alignment: AlignmentType.Center
  },
  // {
  //   Caption: "Bắt đầu thực tế",
  //   FieldName: "RealStartDate",
  //   Width: 230,
  //   DataType: DataType.DefaultType,
  //   EnumName: "TaskName",
  //   Alignment: AlignmentType.Center
  // },
  {
    Caption: "Hoàn thành thực tế",
    FieldName: "FinishDate",
    Width: 230,
    DataType: DataType.DefaultType,
    EnumName: "FinishDate",
    Alignment: AlignmentType.Center
  },
  {
    Caption: "Người giao việc",
    FieldName: "OwnerName",
    Width: 230,
    DataType: DataType.DefaultType,
    EnumName: "TaskName",
    Alignment: AlignmentType.Left
  },
  {
    Caption: "Người liên quan",
    FieldName: "PeopleInvolvedName",
    Width: 500,
    DataType: DataType.DefaultType,
    EnumName: "TaskName",
    Alignment: AlignmentType.Left
  },
  {
    Caption: "Quan trọng",
    FieldName: "Important",
    Width: 150,
    DataType: DataType.DefaultType,
    EnumName: "TaskName",
    Alignment: AlignmentType.Center
  },
  {
    Caption: "Khẩn cấp",
    FieldName: "Emergency",
    Width: 150,
    DataType: DataType.DefaultType,
    EnumName: "TaskName",
    Alignment: AlignmentType.Center
  },
  {
    Caption: "Thẻ",
    FieldName: "TagsName",
    Width: 300,
    DataType: DataType.DefaultType,
    EnumName: "TaskName",
    Alignment: AlignmentType.Left
  }
];
