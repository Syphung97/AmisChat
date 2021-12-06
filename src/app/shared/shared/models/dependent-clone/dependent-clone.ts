/**
* Model cho dependent_data để lưu lên server
 * @export
* @class EventForInsert
*/
export class DependentClone{
    // PK
    DependentDataID: number
    // Mã layout
    LayoutConfigID?: number
    // Tên cột
    FieldName: string
    // Tên tên cột phụ thuộc
    SubsystemCode: string
    // 
    TableName: string
    // Config các trường liên quan
    Config: string
    // Toán tử so sánh
    Operator?: number
    // Giá trị so sánh
    Value: string
    // Có phải hệ thống không
    IsSystem?: boolean
    ListFieldDependancy: any[];
}