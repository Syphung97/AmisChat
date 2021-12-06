import { BaseHRMModel } from '../base-hrm'

/**
* Model cho accomplishment để lưu lên server
 * @export
* @class EventForInsert
*/
export class Accomplishment extends BaseHRMModel {
    // ID
    AccomplishmentID: number
    // Tên đợt khen thưởng
    AccomplishmentName: string
    // ID Đơn vị áp dụng
    OrganizationUnitID: string
    // Tên đơn vị áp dụng
    OrganizationUnitName: string
    // Ngày khen thưởng
    AccomplishmentDate?: Date
    // ID Loại quyết định
    DecisionTypeID: string
    // Tên loại quyết định
    DecisionTypeName: string
    // Số quyết định
    DecisionNo: string
    // Ngày quyết định
    DecisionDate?: Date
    // ID người quyết định
    DecisionSignerID?: number
    // Tên người quyết định
    DecisionSignerName: string
    // ID Chức danh người quyết định
    DecisionSignerTitleID?: number
    // Tên chức danh người quyết định
    DecisionSignerTitleName: string
    // ID hình thức khen thưởng
    AccomplishmentTypeID?: number
    // Tên hình thức khen thưởng
    AccomplishmentTypeName: string
    // Tổng giá trị
    AccomplishmentTotalValue?: number
    // ID đối tượng khen thưởng
    AccomplishmentObjectID?: number
    // Tên đối tượng khen thưởng
    AccomplishmentObjectName: string
    // ID cấp khen thưởng
    AccomplishmentLevelID?: number
    // Tên cấp khen thưởng
    AccomplishmentLevelName: string
    // Căn cứ
    Basis: string
    // Lý do
    Reason: string
    // ID trạng thái
    ExecutionStatusID?: number
    // Tên trạng thái
    ExecutionStatusName: string

    // Danh sách nhân viên
    EmployeeAccomplishments: any;

    // Danh sách tệp đính kèm
    Attachments: any;
}

