import { BaseEntity } from 'src/common/models/base-entity'
import { EmployeePlanningEvaluate } from '../employee-planning-evaluate/employee-planning-evaluate'

/**
* Model cho employee_planning_phase để lưu lên server
 * @export
* @class EventForInsert
*/
export class EmployeePlanningPhase extends BaseEntity {
    // PK
    EmployeePlanningPhaseID: number
    // ID nhân viên
    EmployeeID?: number
    // Mã nhân viên
    EmployeeCode: string
    // Họ và tên
    EmployeeName: string
    // CCTC nhân viên
    EmployeeOrganizationUnitID: string
    // Tên CCTC nhân viên
    EmployeeOrganizationUnitName: string
    // Vị trí công việc
    EmployeeJobPositionID?: number
    // Tên vị trí công việc
    EmployeeJobPositionName: string
    // Vị trí quy hoạch
    JobPositionPhaseID?: number
    // Tên vị trí quy hoạch
    JobPositionPhaseName: string
    // ID loại quy hoạch
    PlanningTypeID?: number
    // Tên loại quy hoạch
    PlanningTypeName: string
    // ID đợt quy hoạch
    PlanningPhaseID?: number
    // Tên đợt quy hoạch
    PlanningPhaseName: string
    // ID trạng thái quy hoạch
    PlanningStatusID?: number
    // Trạng thái quy hoạch
    PlanningStatusName: string
    // Nhận xét
    Comment: string
    // ID Tệp đính kèm
    AttachmentID: string
    // Tên tệp đính kèm
    AttachmentName: string

    EmployeePlanningEvaluates: EmployeePlanningEvaluate[]; // danh sách đánh giá nhân viên 

}
