import { BaseHRMModel } from '../base-hrm'

/**
* Model cho job_appoint để lưu lên server
 * @export
* @class EventForInsert
*/
export class JobAppoint extends BaseHRMModel {
    // 
    JobAppointID: number
    // Tên công việc
    JobAppointName: string
    // ID bổ nhiệm
    AppointID?: number
    // ID người thực hiện
    ImplementerID?: number
    // Tên người thực hiện
    ImplementerName: string
    // Hạn hoàn thành
    EndDate?: Date
    // ID trạng thái
    JobAppointStatusID?: number
    // Tên trạng thái
    JobAppointStatusName: string
    // Mô tả
    Description: string
    // Ngày sửa
    ModifiedDate?: Date
    // Người sửa
    ModifiedBy: string

    SortOrder: number
}
