import { BaseHRMModel } from '../base-hrm'

/**
* Model cho job_appoint để lưu lên server
 * @export
* @class EventForInsert
*/
export class JobTransfer extends BaseHRMModel{
    // 
    JobDisplacementID: number
    // Tên công việc
    JobDisplacementName: string
    // ID bổ nhiệm
    DisplacementID?: number
    // ID người thực hiện
    ImplementerID?: number
    // Tên người thực hiện
    ImplementerName: string
    // Hạn hoàn thành
    EndDate?: Date
    // ID trạng thái
    JobDisplacementStatusID?: number
    // Tên trạng thái
    JobDisplacementStatusName: string
    // Mô tả
    Description: string
    // Ngày sửa
    ModifiedDate?: Date
    // Người sửa
    ModifiedBy: string
    SortOrder: number
}
