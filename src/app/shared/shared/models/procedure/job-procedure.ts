import { BaseEntity } from 'src/common/models/base-entity'

/**
* Model cho job_procedure để lưu lên server
 * @export
* @class EventForInsert
*/
export class JobProcedure extends BaseEntity {
    // 
    JobProcedureID: number
    // Tên công việc
    JobProcedureName: string
    // ID quy trình thủ tục
    ProcedureID?: number
    // ID người thực hiện
    ImplementerID?: number
    // Tên người thực hiện
    ImplementerName: string
    // Mô tả
    Description: string

    SortOrder: number;

}
