import { BaseHRMModel } from '../base-hrm'

/**
* Model cho Nhật ký chỉnh sửa
*/
export class AuditingLogObject extends BaseHRMModel {

    /// Thông tin tham chiếu

    Reference: string;


    /// Nội dung ghi log

    Message: string


    /// Hành động

    ActionType: number;


    /// Tên hành động

    Action: string;


    /// ID người tạo hành động

    UserID: string;


    /// Username của người tạo ra hành động

    UserName: string

    CreatedDate: Date;

    CreatedBy: string


    /// ID của model thao tác

    ModelID: string


    /// Tên model thao tác

    ModelName: string;


    /// Tên bảng phát sinh việc ghi log

    TableName: string;


    /// Dữ liệu log

    RawData: object
}

