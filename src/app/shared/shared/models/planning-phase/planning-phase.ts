import { BaseEntity } from 'src/common/models/base-entity'
import { EmployeePlanningPhase } from './employee-planning-phase/employee-planning-phase'
import { Attachment } from '../attachment/attachment'

/**
* Model cho planning_phase để lưu lên server
 * @export
* @class EventForInsert
*/
export class PlanningPhase extends BaseEntity {
    // PK
    PlanningPhaseID: number
    // Tên đợt quy hoạch
    PlanningPhaseName: string
    // ID đơn vị áp dụng
    OrganizationUnitID: string
    // Tên đơn vị áp dụng
    OrganizationUnitName: string
    // Kỳ
    Period: string
    // Năm
    Year?: number
    // ID trạng thái
    PlanningPhaseStatusID?: number
    // Trạng thái
    PlanningPhaseStatusName: string
    //Danh sách nhân viên
    EmployeePlannings: EmployeePlanningPhase[];
    //Tài liệu đính kèm
    Attachments: Attachment[];
}
