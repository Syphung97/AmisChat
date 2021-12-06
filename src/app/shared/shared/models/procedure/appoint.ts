import { BaseHRMModel } from '../base-hrm'

/**
* Model cho appoint để lưu lên server
 * @export
* @class EventForInsert
*/
export class Appoint extends BaseHRMModel {
    // ID
    AppointID: number
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
    JobPositionAppointID?: number
    // Tên vị trí bổ nhiệm
    JobPositionAppointName: string
    // ID quy trình bổ nhiệm
    AppointmentProcessID?: number
    // Tên quy trình bổ nhiệm
    AppointmentProcessName: string
    // ID trạng thái
    AppointStatusID?: number
    // Tên trạng thái
    AppointStatusName: string
    // Đã cập nhật hồ sơ hay chưa
    IsUpdatedProfile: boolean
    // Ngày sửa
    ModifiedDate?: Date
    // Người sửa
    ModifiedBy: string

    // Danh sách tệp đính kèm
    Attachments: any;

    JobAppoints: any;
}
