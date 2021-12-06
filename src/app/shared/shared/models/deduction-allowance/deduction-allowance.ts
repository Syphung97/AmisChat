import { BaseEntity } from 'src/common/models/base-entity';

export class DeductionAllowance extends BaseEntity {
    //PK
    DeductionAllowanceID: number;
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
    /// Giảm trừ khi tính thuế (0- Không giảm trừ khi tính thuế, 1 - Giảm trừ khi tính thuế
    IsDeduction: boolean;
    /// Thuế xuất( Chỉ xuất hiện khi là chịu thuế thu nhập toàn phần)
    TaxRate: number;
    /// Định mức
    Formula: string;
    /// Công thức/Số tiền
    FormulaFunction: string;
    /// ID nhân viên
    EmployeeID: number;
}