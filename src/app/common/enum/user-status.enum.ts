export enum UserStatusEnum {
  /// <summary>
  /// Chưa kích hoạt
  /// </summary>
  NotActive = 1,

  /// <summary>
  /// Chờ xác nhận
  /// </summary>
  Waiting = 2,

  /// <summary>
  /// Đang hoạt động
  /// </summary>
  Active = 3,

  //Ngừng hoạt động
  Inactive = 4,

  //Đã bị xóa
  IsDeleted = 5
}