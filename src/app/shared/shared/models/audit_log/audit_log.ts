import { BaseHRMModel } from '../base-hrm'

/**
* Model cho Nhật ký chỉnh sửa
*/
export class AuditLog extends BaseHRMModel {
    AuditingLogID: number;

    ModelID

    /// ID user
    UserID: string;

    /// Id của bản ghi master

    ParentEntityID: string;

    /// Họ và tên user thực hiện thao tác

    FullName: string;

    /// Thời gian thực hiện thao tác

    LogTime: Date;

    /// 1: Thêm mới,2: Sửa,3: Xóa

    Action: number;

    /// Mô tả chi tiết hành động

    Description: string;

    /// Tên thực thể thay đổi

    ModelInfo: string;

    /// Tên phân hệ thao tác

    SubSystemName: string;

    /// Tên bảng phát sinh việc ghi log

    TableName: string;

    /// 0: BeCore,1:IOS,2: Android

    DeviceType: number;

    /// Log cấm xóa nếu =1 , ngược lại thì cho xóa

    IsSytem: boolean;

    /// Giá trị cũ

    OldValue: string;

    /// Giá trị mới

    NewValue: string;
}

