/**
 * Trạng thái của người dùng trong hệ thống
 * Created by ltanh1 08/06/2020
 */
export enum UserStatus {
  // Chưa kích hoạt
  NotActive = 1,
  // Chờ xác nhận
  Waiting = 2,
  // Đang hoạt động
  Active = 3,
  // Ngừng hoạt động
  Inactive = 4,
  // Đã xóa
  IsDeleted = 5
}
