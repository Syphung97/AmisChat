import { BaseEntity } from 'src/common/models/base-entity';

export class PayrollItem extends BaseEntity {
    /// PK
    PayrollItemID: number;
    /// Mã khoản lương
    PayrollItemCode: string;
    /// Tên khoản lương
    PayrollItemName: string;
    /// Loại khoản lương (1: thu nhập, 2- Khấu trừ, 3 - Giảm trừ)
    PayrollItemType: number;
    /// 1 - không chịu thuế, 0 - Chịu thuế
    IsExempt: boolean;
    /// 0 - Tính theo hệ số, Tính theo số tiền, 2 - Tính theo phần trăm 
    CalculateBy: number;
    /// giá trị
    Value: number;
    /// ghi chú
    Description: string;
    /// hệ thống
    IsSystem: boolean;
    /// Mã danh mục hệ thống
    DictionaryKey: number;
    /// thứ tự
    SortOrder: number;
    /// 1- Phụ cấp, 0 - Không phải phụ cấp
    IsAllowance: boolean;
    /// Giảm trừ khi tính thuế (0- Không giảm trừ khi tính thuế, 1 - Giảm trừ khi tính thuế
    IsDeduction: boolean;
    /// Loại thu nhập( 0 - Chịu thuế lũy tiến, 1- Chịu thuế toàn phần, 2 - Không chịu thuế
    IncomeType: number;
    /// Thuế xuất( Chỉ xuất hiện khi là chịu thuế thu nhập toàn phần)
    TaxRate: number;
    /// Nhóm thu nhập
    PayrollItemCategoryID: number;
    /// Tên nhóm
    PayrollItemCategoryName: string;
    /// Công thức/Số tiền
    Formula: string;
    /// Công thức/Số tiền theo dạng function
    FormulaFunction: string;
}
