import { BaseHRMModel } from '../base-hrm'

/**
* Model cho field_config để lưu lên server
 * @export
* @class EventForInsert
*/
export class FieldConfig extends BaseHRMModel {
    // PK
    FieldConfigID: number
    // Mã phân hệ
    SubsystemCode: string
    // Tên phân hệ
    SubsystemName: string
    // Tên cột trong DB
    FieldName: string
    // Tên trường hiển thị
    DisplayField: string
    // Tên hiện thị
    Caption: string
    // Loại dữ liệu
    DataType?: number
    // Loại control hiển thị
    TypeControl?: number
    // Trường bắt buộc nhập
    IsRequire?: boolean
    // Có hiển thị không
    IsVisible?: boolean
    // Có cho phép nhập hay không
    IsReadOnly?: boolean
    // Ghi chú
    Tooltip: string
    // Hiển thị tooltip
    IsShowTooltip?: boolean
    // Trường check trung dữ liệu
    IsUnique?: boolean
    // 
    CustomConfig: any
    // 
    IsSystem?: boolean
    // Giá trị mặc định
    DefaultValue: any

    // Có hợp lệ hay không
    isValid: boolean;
    
    ColumnIndex: number;

    ID: any;
    /// <summary>
    /// Giá trị của field
    /// </summary>
    Value: string;

    /// <summary>
    /// Giá trị của field text
    /// </summary>
    ValueText: string;
    /// <summary>
    /// Có phải trường mặc định không
    /// </summary>
    IsCustom: string;

}
