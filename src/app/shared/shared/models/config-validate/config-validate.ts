/**
* Model cho config_validate để lưu lên server
 * @export
* @class EventForInsert
*/
export class ConfigValidate {
    // PK
    ConfigValidateID: number
    // Mã layout
    LayoutConfigID?: number
    // Tên tên cột phụ thuộc
    SubsystemCode: string
    // 
    TableName: string
    // Field thay đổi thì kiếm tra
    FieldSource: string
    // Field dùng để so sánh
    FieldValidate: string
    // Toán tử so sánh
    Operator?: number
    // Có phải hệ thống không
    IsSystem?: boolean
}
