import { BaseHRMModel } from '../base-hrm';

/**
 * Model cho employee để lưu lên server
 * @export
 * @class EventForInsert
 */
export class TerminationReason extends BaseHRMModel {
  // ID
  TerminationReasonID: number
  // Lý do nghỉ việc
  TerminationReasonName: string
  // Nhóm lý do
  TerminationReasonTypeID?: number
  // Tên nhóm lý do
  TerminationReasonTypeName: string
  // ngày sửa
  ModifiedDate?: Date
  // người sửa
  ModifiedBy: string
}