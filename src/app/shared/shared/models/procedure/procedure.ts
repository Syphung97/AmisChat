import { JobProcedure } from './job-procedure'
import { BaseEntity } from 'src/common/models/base-entity'

/**
* Model cho appoint để lưu lên server
 * @export
* @class EventForInsert
*/
export class Procedures extends BaseEntity {
    // ID
    ProceduresID: number
    // Tên quy trình thủ tục
    ProceduresName: string
    // ID loại quy trình thủ tục
    ProceduresTypeID?: number
    // Tên loại quy trình thủ tục
    ProceduresTypeName: string
    // Mô tả
    Description: string

    JobProcedures: JobProcedure[];
}
