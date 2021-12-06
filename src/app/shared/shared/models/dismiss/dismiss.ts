import { BaseHRMModel } from '../base-hrm'

/**
* Model cho accomplishment để lưu lên server
 * @export
* @class EventForInsert
*/
export class Dismiss extends BaseHRMModel {
    
    // ID
    DismissID: number
    // ID nhân viên
    EmployeeID: number
    // Tên nhân viên
    EmployeeName: string
    // Mã nhân viên
    EmployeeCode: string
    // ID đơn vị công tác cũ
    EmployeeOrganizationUnitID?: number
    //id vị trí công việc cũ
    EmployeeJobPositionID?: number
    // Tên đơn vị công tác cũ
    EmployeeOrganizationUnitName: string
    // tên vị trí công việc cũ
    EmployeeJobPositionName: string
    // đơn vị công tác mới
    OrganizationUnitID?: string
    // tên đơn vị công tác mới
    OrganizationUnitName: string
    // id vị trí công việc mới
    JobPositionAppointID: number
    // tên vị trí công việc mới
    JobPositionAppointName: string
    // id qui trình
    ProceduresID: number
    // tên quy trình
    ProceduresName: string
    // ID trạng thái miễn nhiệm
    DismissStatusID: number
    // Tên trạng thái miễn nhiệm
    DismissStatusName: string

    // Danh sách công việc
    JobDismisses: any;
    // Danh sách tệp đính kèm
    Attachments: any;
}

