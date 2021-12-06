import { BaseHRMModel } from '../base-hrm';

/**
 * Model cho employee để lưu lên server
 * @export
 * @class EventForInsert
 */
export class Users extends BaseHRMModel {
  // ID pk mã nhân viên
  UserID: string;
  // Họ và tên nhân viên
  UserName: string;
  // misa iD định danh người dùng
  MISAID: string;
  // Họ nhân viên
  FirstName: string;
  // Tên nhân viên
  LastName: string;
  // Tên đầy đủ
  FullName: string;
  // Email
  Email: string;
  // Số điện thoại
  Mobile: string;
  // ID cơ cấu tổ chức FK
  OrganizationUnitID: string;
  // Tên CCTC
  OrganizationUnitName: string;
  // trạng thái của nhân viên  (1: chưa kích hoạt , 2: chờ xác nhận, 3: đang hoạt động, 4:Ngừng kích hoạt , 5: đã xóa )
  Status?: number;
  // avatar của người dung ( tên file lưu trên misastorage )
  Avatar: string;
  // Màu background avatar của người dùng ( nếu không có avatar sẽ sử dụng màu này để hiển thị )
  AvatarColor: string;
  // Ngày sinh
  Birthday?: Date;
  // Giới tính: 0 - nữ, 1 - nam
  Gender?: number;
  // Địa chỉ
  Address: string;
  // Tùy chỉnh của User
  UserOptions: any;
  // Danh ngôn
  Quotations: any;
  //TenantCode
  TenantCode: string;
  TenantID: string;
  // Vai trò trong app
  RoleCode?: string;
}
export interface IUsers {
  // ID pk mã nhân viên
  UserID: string;
  // Họ và tên nhân viên
  UserName: string;
  // misa iD định danh người dùng
  MISAID: string;
  // Họ nhân viên
  FirstName: string;
  // Tên nhân viên
  LastName: string;
  // Tên đầy đủ
  FullName: string;
  // Email
  Email: string;
  // Số điện thoại
  Mobile: string;
  // ID cơ cấu tổ chức FK
  OrganizationUnitID: string;
  // Tên CCTC
  OrganizationUnitName: string;
  // trạng thái của nhân viên  (1: chưa kích hoạt , 2: chờ xác nhận, 3: đang hoạt động, 4:Ngừng kích hoạt , 5: đã xóa )
  Status?: number;
  // avatar của người dung ( tên file lưu trên misastorage )
  Avatar: string;
  // Màu background avatar của người dùng ( nếu không có avatar sẽ sử dụng màu này để hiển thị )
  AvatarColor: string;
  // Ngày sinh
  Birthday?: Date;
  // Giới tính: 0 - nữ, 1 - nam
  Gender?: number;
  // Địa chỉ
  Address: string;
  // Tùy chỉnh của User
  UserOptions: any;
  // Danh ngôn
  Quotations: any;
  // TenantCode
  TenantCode: string;
  TenantID: string;
  // Vai trò trong app
  RoleCode?: string;
}
