import { BaseHRMModel } from '../base-hrm'

/**
* Model cho dependen_dictionary để lưu lên server
 * @export
* @class EventForInsert
*/
export class DependenDictionary extends BaseHRMModel
{
// PK
DependentDictionaryID:  number 
// Mã layout
LayoutConfigID?:  number 
// Tên bảng
TableName:  string 
// Tên cột
FieldName:  string 
// 
SourceField:  string 
// Tên tên cột phụ thuộc
DependentField:  string 
// Có phải hệ thống không
IsSystem:  string 
}
