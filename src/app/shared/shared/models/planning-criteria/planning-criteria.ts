import { BaseEntity } from 'src/common/models/base-entity'

/**
* Model cho planning_criteria để lưu lên server
 * @export
* @class EventForInsert
*/
export class PlanningCriteria extends BaseEntity {
    // 
    PlanningCriteriaID: number
    // Tên tiêu chí
    PlanningCriteriaName: string
    // ID ví trí áp dụng
    JobPositionID?: number
    // Tên vị trí áp dụng
    JobPositionName: string
    // Áp dụng tất cả các vị trí
    ApplyAllJobPosition?: boolean
}
