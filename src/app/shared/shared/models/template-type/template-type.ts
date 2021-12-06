import { BaseHRMModel } from '../base-hrm';

export class TemplateType extends BaseHRMModel {
  public  TemplateTypeID: number;
  /// <summary>
  /// Tên loại mẫu
  /// </summary>
  public  TemplateTypeName: string;
  /// <summary>
  /// Có phải hệ thống
  /// </summary>
  public IsSystem:  boolean;
  /// <summary>
  /// Ghi chú
  /// </summary>
  public  Description: string
  /// <summary>
  ///
  /// </summary>
  public  DictionaryKey: number;
}
