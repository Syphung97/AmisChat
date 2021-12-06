/**
* Model cho mapping_config để lưu lên server
 * @export
* @class EventForInsert
*/
export class MappingConfig {
    // PK
    MappingConfigID: number
    // Mã phân hệ
    SubsystemCode: string
    // Tên bảng Master
    MasterTable: string
    // Tên cột ID master
    MasterField: string
    // tên bảng detail
    DetailTable: string
    // Tên cột detail
    DetailField: string
}
