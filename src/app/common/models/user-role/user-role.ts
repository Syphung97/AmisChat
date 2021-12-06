/**
 * Model cho user_roles để lưu lên server
 * @export
 * @class EventForInsert
 */
export class UserRoles {
  //
  UserRoleID: number;
  // ID của nhân viên
  UserID: string;
  // ID role của ứng dụng được phép ứng dụng
  RoleID: string;
  // Ứng dụng được phép truy cập
  AppCode: string;
  // Cơ cấu tổ chức được phép truy cập
  OrganizationUnitID: string;
  // Tên role
  RoleName: string;
  // Tên của các vai trò
  RolesName: string;
  // Danh sách các vai trò trong ứng dụng
  ListRoleName: Array<string>;
  // Danh sách tổ chức có quyền
  ListOrganizationUnitIDs: Array<string>;
}
