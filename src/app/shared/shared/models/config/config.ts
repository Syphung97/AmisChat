import { BaseHRMModel } from '../base-hrm';
import { GroupFieldConfig } from '../group-field-config/group-field-config';

/**
 * Model cho config để lưu lên server
 * @export
 * @class EventForInsert
 */
export class Config extends BaseHRMModel {
    /// PK
    GroupConfigID: number;
    /// Tên nhóm
    GroupConfigName: string;
    /// ID bố cục
    LayoutConfigID: number;
    /// Tên bố cục
    LayoutConfigName: string;
    /// Mã phân hệ
    SubsystemCode: string;
    /// Tên bảng lấy dữ liệu
    TableName: string;
    /// ID Group cha bao ngoài
    GroupConfigParentID: number;
    /// Thứ tự group
    SortOrder: number;
    /// Loại group (0: Loại nhập liệu bt, 1: Loại Grid)
    GroupType: number;
    /// 
    IsVisible: boolean;
    /// Ẩn khi thêm
    IsViewWhenAdd: boolean;
    /// 1- 1 cột, 2 - 2 cột
    ColumnGroup: number;
    /// Có phải hệ thống không
    IsSystem: boolean;
    /// Danh sách thiết lập trường chi tiết
    GroupFieldConfigs: GroupFieldConfig[];

    /// Danh sách dữ liệu theo từng dòng của data
    DataGroupConfig: [];

    /// Danh sách mapping 
    //   MappingConfigs : MappingConfig[] ;
}
