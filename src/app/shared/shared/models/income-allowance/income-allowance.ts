import { BaseEntity } from 'src/common/models/base-entity';

export class IncomeAllowance extends BaseEntity {
    //PK
    IncomeAllowanceID: number;
    //ID khoản lương
    PayrollItemID: string;
    //ID mã khoản lương
    PayrollItemCode: string;
    /// Tên khoản lương
    PayrollItemName: string;
    /// Loại khoản lương (1: thu nhập, 2- Khấu trừ, 3 - Giảm trừ)
    PayrollItemType: number;
    /// ID vị trí công việc
    JobPositionID: number;
    /// Kỳ trả lương
    PayInPeriod: number;
    /// Ghi chú
    Description: string;
    /// Mã danh mục hệ thống
    DictionaryKey: number;
    /// thứ tự
    SortOrder: number;
    /// 1- Phụ cấp, 0 - Không phải phụ cấp
    IsAllowance: boolean;
    /// Loại thu nhập( 0 - Chịu thuế lũy tiến, 1- Chịu thuế toàn phần, 2 - Không chịu thuế
    IncomeTypeID: number;
    //Loại chịu thuế
    IncomeTypeName: string;
    /// Định mức
    Formula: string;
    /// Công thức/Số tiền
    FormulaFunction: string;
    /// ID nhân viên
    EmployeeID: number;
}