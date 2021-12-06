export enum StatusEnum {
  Inactive = 1,
  NotActive = 2,
  Waiting = 3,
  Active = 4
}
// optional: Record type annotation guaranties that
// all the values from the enum are presented in the mapping
export const StatusLabelMapping: Record<StatusEnum, string> = {
  [StatusEnum.Inactive]: "Ngừng kích hoạt",
  [StatusEnum.NotActive]: "Không hoạt động",
  [StatusEnum.Waiting]: "Chờ kích hoạt",
  [StatusEnum.Active]: "Đang hoạt động",
}
