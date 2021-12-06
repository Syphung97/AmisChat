import { BaseHRMModel } from '../base-hrm';
import { DataType } from 'src/common/models/export/data-type.enum';
import { TypeControl } from '../../enum/common/type-control.enum';

export class GroupFieldConfig extends BaseHRMModel {
    /// <summary>
    /// PK
    /// </summary>
    GroupFieldConfigID: number;
    /// <summary>
    /// ID bố cục
    /// </summary>
    LayoutConfigID: number;
    /// <summary>
    /// ID nhóm config
    /// </summary>
    GroupConfigID: number;
    /// <summary>
    /// 
    /// </summary>
    SubsystemCode: string;
    /// <summary>
    /// Thứ tự dòng
    /// </summary>
    RowIndex: number;
    /// <summary>
    /// Thứ tự cột
    /// </summary>
    ColumnIndex: number;
    /// <summary>
    /// Tên cột trong DB
    /// </summary>
    FieldName: string;
    /// <summary>
    /// Tên trường hiển thị
    /// </summary>
    DisplayField: string;
    /// <summary>
    /// Tên hiện thị
    /// </summary>
    Caption: string;
    /// <summary>
    /// Loại dữ liệu
    /// </summary>
    DataType: DataType;
    /// <summary>
    /// Loại control hiển thị
    /// </summary>
    TypeControl: TypeControl;
    /// <summary>
    /// Trường bắt buộc nhập
    /// </summary>
    IsRequire: boolean;
    /// <summary>
    /// Có hiển thị không
    /// </summary>
    IsVisible: boolean;
    /// <summary>
    /// Có cho phép nhập hay không
    /// </summary>
    IsReadOnly: boolean;
    /// <summary>
    /// Ghi chú
    /// </summary>
    Tooltip: string;
    /// <summary>
    /// Hiển thị tooltip
    /// </summary>
    IsShowTooltip: boolean;
    /// <summary>
    /// 
    /// </summary>
    IsSystem: boolean;
    /// <summary>
    /// 
    /// </summary>
    CustomConfig: string;
    /// <summary>
    /// Trường check trung dữ liệu
    /// </summary>
    IsUnique: boolean;
    /// <summary>
    /// Giá trị mặc định
    /// </summary>
    DefaultValue: string;
    /// <summary>
    /// Có phải trường mặc định không
    /// </summary>
    IsCustom: boolean;

    ID: any;
    /// <summary>
    /// Giá trị của field
    /// </summary>
    Value: any;

    /// <summary>
    /// Giá trị của field text
    /// </summary>
    ValueText: any;

    /// <summary>
    /// Tên bảng lưu dữ liệu
    /// </summary>
    TableName: string;

    FieldNameSource: string;

    DisplayFieldSource: string;

    DataFieldSource: string;

    Controller: string = "";

    Url: string = "";

    Param: Object;

    IsGetMethod: boolean = false;

    FnsLoadData: Function;

    IsUseFunc: boolean = false;

    IsRemoteServer: boolean = true;

    DataSource: any;

    // đường dẫn trỏ đến dữ liệu trả về
    DataPath: string;

    GroupFieldConfigs: any; // thông tin cột với các trường dữ liệu để map dữ liệu trả về hiển thị trên grid

    GroupConfig: any; // thông tin cột với các trường dữ liệu để map dữ liệu trả về hiển thị trên grid

    IsModifiable: boolean = false; // trường dữ liệu có cho phép sửa không

    IsDynamicCombobox: boolean = false; // trường có phải dạng control chọn từ grid

    // Giá trị nhỏ nhất
    MinValue: any;

    // Giá trị lớn nhất
    MaxValue: any;

    // Độ dài kí tự ít nhất
    MinLength: number;

    // Độ dài kí tự lớn nhất
    MaxLength: number;

    IsUse: boolean;

    CurrencyCode: string;

    IsReloadData: boolean;

    DataCustomConfig: any;

    IsShowError: boolean;

    GroupFieldConfigDependent: any;

    // Trường readonly custom
    IsReadOnlyCustom: boolean;

    ControlValue: any;

    SortOrder: number;

    // Dữ liệu đã bị thay đổi do ng dùng tự thay đổi hay chưa
    IsChanged: boolean;

    // config quyền
    PermissionConfig: string;

    // config quyền
    PermissionConfigObject: any;

    // trường dữ liệu được phép sửa bên app nhân viên không
    TypeEditField: number;

    // giá trị gốc của trường dữ liệu 
    OldValue: any;
}