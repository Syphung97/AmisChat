/**
 * Model cho report_config để lưu lên server
 * @export
 * @class EventForInsert
 */
export class ReportConfig {
  // ID của báo cáo
  ID: number;
  // Mã phân hệ
  SubsystemCode: string;
  // Tên phân hệ
  SubsystemName: string;
  // Mã báo cáo
  ReportID: string;
  // Tên báo cáo
  ReportTitle: string;
  // Loại xuất báo cáo
  ReportType: string;
  // Loại xuất báo cáo
  ReportFileName: string;
  // API lấy dữ liệu
  APIConfig: any;
  // Param default lấy dữ liệu
  DefaultParam: any;
  // config cần custom thêm
  CustomConfig: any;
  // Tên store lấy dữ liệu
  StoreName: string;
  // Có hiển thị trên toolbar không
  IsShowMenu?: boolean;
  //
  SortOrder: number;
}
