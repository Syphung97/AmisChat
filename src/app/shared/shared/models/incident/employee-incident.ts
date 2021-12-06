import { BaseHRMModel } from '../base-hrm';

export class EmployeeIncident extends BaseHRMModel {

    EmployeeIncidentID: number;
    //ID sự cố',
    IncidentID: number;
    //Tên sự cố',
    IncidentName: string;
    //ID nhân viên',
    EmployeeID: number;
    //Tên nhân viên',
    EmployeeName: string;
    //Mã nhân viên',
    EmployeeCode: string;
    //ID đơn vị công tác',
    OrganizationUnitID: string;
    //đơn vị công tác',
    OrganizationUnitName: string;
    //Tên vị trí công việc',
    JobPositionID: number;
    //ID vị trí công việc',
    JobPositionName: string;
    //Mô tả sự cố',
    IncidentSummary: string;
    //ID hình thức xử lý',
    ResolutionMethodID: number;
    //Hình thức xử lý',
    ResolutionMethodName: string;
    //Giá trị bồi thường',
    CompensationValue: number;
    //Giá trị được bồi thường',
    CompensatedValue: number;
    //ID tệp đính kèm',
    AttachmentID: string;
    //Tên tệp đính kèm',
    AttachmentName: string;
    //ID trạng thái thực hiện',
    ExecutionStatusID: number;
    //Trạng thái thực hiện',
    ExecutionStatusName: string;
}
