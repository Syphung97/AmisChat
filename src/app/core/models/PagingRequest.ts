export class PagingRequest {
  /// <summary>
  /// Số bản ghi / trang
  /// </summary>
  PageSize!: number;

  /// <summary>
  /// Vị trí trang
  /// </summary>
  PageIndex!: number;

  /// <summary>
  /// Các cột cần select
  /// </summary>
  Columns!: string;

  /// <summary>
  /// String filter của grid
  /// </summary>
  Filter!: string;

  /// <summary>
  /// String sort của grid
  /// </summary>
  Sort!: string;

  /// <summary>
  /// Filter custom
  /// </summary>
  CustomFilter!: string;

  /// <summary>
  /// param custom
  /// </summary>
  CustomParam: any;

  /// <summary>
  /// Có sử dụng stored procedure hay không
  /// </summary>
  UseSp = true;

  QuickSearch: any;
}
