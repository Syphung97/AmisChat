import { BaseEntity } from 'src/common/models/base-entity';

export class GridFieldConfig extends BaseEntity {
  LayoutGridFieldConfigID: number;

  LayoutGridConfigID: number;

  FieldName: string;

  Caption: string;

  Tooltip: string;

  DataType: number;

  IsVisible: boolean;

  Width: number;

  MinWidth: number;

  IsFlex: boolean;

  SortOrder: number;

  IsSystem: boolean;
}
