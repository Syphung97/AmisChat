import { BaseEntity } from 'src/common/models/base-entity'

/**
* Model cho employee_accomplishment để lưu lên server
 * @export
* @class EventForInsert
*/
export class EmployeeAccomplishment extends BaseEntity {
    // Tên đợt khen thưởng
    EmployeeAccomplishmentID: number
    // ID đợt khen thưởng
    AccomplishmentID?: number
    // ID đợt khen thưởng
    AccomplishmentName?: string;
    // ID nhân viên
    EmployeeID?: number
    // Tên nhân viên
    EmployeeName: string
    // Mã nhân viên
    EmployeeCode: string
    // Đơn vị công tác
    EmployeeOrganizationUnitID: string
    // Tên đơn vị công tác
    EmployeeOrganizationUnitName: string
    // ID vị trí công việc
    EmployeeJobPositionID?: number
    // Tên vị trí công việc
    EmployeeJobPositionName: string
    // Giá trị khen thưởng
    AccomplishmentValue?: number
    // Lý do
    Reason: string
    // ID tệp đính kèm
    AttachmentID: string
    // Tên tệp đính kèm
    AttachmentName: string
    // ID trạng thái thực hiện
    ExecutionStatusID?: number
    // Trạng thái thực hiện
    ExecutionStatusName: string
}
