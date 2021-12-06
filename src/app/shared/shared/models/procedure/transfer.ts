import { BaseHRMModel } from '../base-hrm'

/**
* Model cho thuyên chuyển
 * @export
* @class EventForInsert
*/
export class Transfer extends BaseHRMModel {
    // ID
    DisplacementID: number
    // ID nhân viên
    EmployeeID?: number
    // Tên nhân viên
    EmployeeName: string
    // Mã nhân viên
    EmployeeCode: string
    // CCTC nhân viên
    EmployeeOrganizationUnitID: string
    // Tên CCTC nhân viên
    EmployeeOrganizationUnitName: string
    // Vị trí công việc
    EmployeeJobPositionID?: number
    // Tên vị trí công việc
    EmployeeJobPositionName: string
    // ID Đơn vị bổ nhiệm
    OrganizationUnitID: string
    // Tên đơn vị bổ nhiệm
    OrganizationUnitName: string
    // Vị trí bổ nhiệm
    JobPositionDisplacementID?: number
    // Tên vị trí bổ nhiệm
    JobPositionDisplacementName: string
    // ID quy trình bổ nhiệm
    DisplacementProcessID?: number
    // Tên quy trình bổ nhiệm
    DisplacementProcessName: string
    // ID trạng thái
    DisplacementStatusID?: number
    // Tên trạng thái
    DisplacementStatusName: string
    // Đã cập nhật hồ sơ hay chưa
    IsUpdatedProfile: boolean
    // Ngày sửa
    ModifiedDate?: Date
    // Người sửa
    ModifiedBy: string

    // Danh sách tệp đính kèm
    Attachments: any;

    JobDisplacements: any;
}
