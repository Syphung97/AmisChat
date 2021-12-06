import { BaseHRMModel } from '../base-hrm'

/**
* Model cho job_appoint để lưu lên server
 * @export
* @class EventForInsert
*/
export class JobTermination extends BaseHRMModel {
    // 
    JobTerminationID: number
    // Tên công việc
    JobterminationName: string
    // ID thủ tục nghỉ việc
    TerminationID?: number
    // ID người thực hiện
    ImplementerID?: number
    // Tên người thực hiện
    ImplementerName: string
    // Hạn hoàn thành
    EndDate?: Date
    // ID trạng thái
    JobTerminationStatusID?: number
    // Tên trạng thái
    JobTerminationStatusName: string
    // Mô tả
    Description: string
    // 
    SortOrder?: number
    // Ngày sửa
    ModifiedDate?: Date
    // Người sửa
    ModifiedBy: string
}
