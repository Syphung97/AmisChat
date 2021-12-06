import { BaseHRMModel } from '../base-hrm';

export class Incident extends BaseHRMModel {


    IncidentID: number;
    // Tên sự cố ;
    IncidentName: string;
    // ID loại sự cố ;
    IncidentTypeID: number
    // Tên loại sự cố ;
    IncidentTypeName: string;
    // Ngày xảy ra ;
    IncidentDate?: Date;
    // Nơi xảy ra sự cố ;
    IncidentPlace?: string;
    // ID nguyên nhân ;
    IncidentReasonID?: number
    // Nguyên nhân ;
    IncidentReasonName?: number
    // Tổng giá trị thiệt hại ;
    TotalDamage?: number
    // Mô tả sự cố ;
    IncidentSummary?: string
    // ID đơn vị liên quan ;
    OrganizationUnitID: string;
    // đơn vị liên quan ;
    OrganizationUnitName: string;
    // ID trạng thái ;
    IncidentStatusID: number;
    // trạng thái ;
    IncidentStatusName: string;
    // Danh sách nhân viên
    EmployeeIncidents: any;
    // Danh sách tệp đính kèm
    Attachments: any;
}