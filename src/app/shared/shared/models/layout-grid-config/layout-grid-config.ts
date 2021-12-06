import { BaseEntity } from 'src/common/models/base-entity';
import { GridFieldConfig } from '../grid-field-config/grid-field-config';

export class LayoutGridConfig extends BaseEntity {

  LayoutGridConfigID: number;
  /// <summary>
  /// Tên layout
  /// </summary>
  LayoutGridConfigName: string;
  /// <summary>
  /// Loại config grid
  /// </summary>
  LayoutGridType: string;
  /// <summary>
  /// Có đang được sử dụng
  /// </summary>
  IsUse: boolean;
  /// <summary>
  /// Người tạo
  /// </summary>
  UserID: string;

  /// <summary>
  /// Có phải của hệ thống không
  /// </summary>
  IsSystem: boolean;

  LayoutConfigID: number;

  GroupConfigID: number;
  /// <summary>
  /// Danh sách Field config
  /// </summary>
  GridFieldConfigs: Array<GridFieldConfig>;
}
