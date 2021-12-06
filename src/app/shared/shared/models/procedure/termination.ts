import { BaseHRMModel } from '../base-hrm'

/**
* Model cho appoint để lưu lên server
 * @export
* @class EventForInsert
*/
export class Termination extends BaseHRMModel {
    // ID
    TerminationID: number;
    TerminationName: string;
    // ID nhân viên
    EmployeeID?: number;
    // Tên nhân viên
    EmployeeName: string;
    // Mã nhân viên
    EmployeeCode: string;
    // CCTC nhân viên
    EmployeeOrganizationUnitID: string;
    // Tên CCTC nhân viên
    EmployeeOrganizationUnitName: string;
    // Vị trí công việc
    EmployeeJobPositionID?: number;
    // Tên vị trí công việc
    EmployeeJobPositionName: string;
    // ID lý do nghỉ việc
    TerminationReasonID: string;
    // Tên lý do nghỉ việc
    TerminationReasonName: string;
    // Ngày nghỉ việc
    TerminationDate?: number;
    // ID quy trình
    ProceduresID?: number;
    // Tên quy trình
    ProceduresName: string;
    // ID trạng thái
    TerminationStatusID?: number;
    // Tên trạng thái
    TerminationStatusName: string;

    // Đã cập nhật hồ sơ hay chưa
    IsUpdatedProfile: boolean

    // Danh sách tệp đính kèm
    Attachments: any;

    JobTerminations: any;
}
