import { BaseHRMModel } from '../base-hrm';

/**
 * Model cho employee để lưu lên server
 * @export
 * @class EventForInsert
 */
export class UserOption extends BaseHRMModel {
  // PK
  UserOptionID: number;
  // ID user
  UserID: string;
  // Tên option
  OptionKey: string;
  // Giá trị option
  OptionValue: string;
  // Hiển thị danh ngôn không
  OptionValueType: number;
}
export interface IUserOption {
  // PK
  UserOptionID: number;
  // ID user
  UserID: string;
  // Tên option
  OptionKey: string;
  // Giá trị option
  OptionValue: string;
  // Hiển thị danh ngôn không
  OptionValueType: number;
}
