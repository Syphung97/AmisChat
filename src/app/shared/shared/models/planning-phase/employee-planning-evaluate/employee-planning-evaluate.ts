import { BaseEntity } from 'src/common/models/base-entity'

/**
* Model cho employee_planning_evaluate để lưu lên server
 * @export
* @class EventForInsert
*/
export class EmployeePlanningEvaluate extends BaseEntity {
    // PK
    EmployeePlanningEvaluateID: number
    // ID nhân viên đợt quy hoạch
    EmployeePlanningPhaseID?: number
    // ID tiêu chí quy hoạch
    PlanningCriteriaID?: number
    // Tên tiêu chí quy hoạch
    PlanningCriteriaName: string
    // Nhận xét
    Comment: string
    // ID kết quả đánh giá
    ResultEvaluationID?: number
    // Kết quả đánh giá
    ResultEvaluationName: string
}
