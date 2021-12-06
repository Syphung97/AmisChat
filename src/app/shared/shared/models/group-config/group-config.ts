import { BaseEntity } from 'src/common/models/base-entity';
import { GroupFieldConfig } from '../group-field-config/group-field-config';
import { LayoutGridConfig } from '../layout-grid-config/layout-grid-config';
import { MappingConfig } from '../mapping-config/mapping-config';
/**
* Model cho group_config để lưu lên server
 * @export
* @class EventForInsert
*/
export class GroupConfig extends BaseEntity {
    // PK
    GroupConfigID: number;
    // Tên nhóm
    GroupConfigName: string;
    // ID bố cục
    LayoutConfigID?: number;
    // Tên bố cục
    LayoutConfigName: string;
    // Mã phân hệ
    SubsystemCode: string;
    // Tên bảng lấy dữ liệu
    TableName: string;
    // ID Group cha bao ngoài
    GroupConfigParentID?: number;
    // Thứ tự group
    SortOrder?: number;
    // Loại group (1: Loại nhập liệu bt, 2: Loại Grid)
    GroupType?: number = 1;
    //
    IsVisible?: boolean = true;
    // Ẩn khi thêm
    IsViewWhenAdd?: boolean;
    // 1- 1 cột, 2 - 2 cột
    ColumnGroup?: number = 2;
    // Có phải hệ thống không
    IsSystem?: boolean;

    IsChild?: boolean = false;
    // Danh sách Field Config
    GroupFieldConfigs: GroupFieldConfig[] = [];

    DataGroupConfig: any;
    UpdatedDataGroupConfig: any;

    IsExpand: boolean = true;

    IsShowExpand: boolean = false;

    MappingConfigs: MappingConfig[] = [];

    ColOne: GroupFieldConfig[] = [];
    ColTwo: GroupFieldConfig[] = [];
    ListGroupConfigChild: GroupConfig[] = [];
    LayoutGridConfig: LayoutGridConfig;
    LayoutGridFieldConfigs: GroupFieldConfig[] = [];

    IsNotUseDefaultFromDataGrid: boolean = false;

    // Nếu là dạng grid thì màn hình thêm là dạng form hay popup
    IsTypeForm: boolean = false;

    ListFormula: any[];

    // Không set cha con
    IsNotSetChild: boolean;

    // Không set cha con
    CustomConfig: string;

    ConfigSortOrder: string;

    SubsystemCodeGroup: string;

    ConfigCloneDataMaster: string;

    FieldID: string;

    IsNotAddable: boolean; // không cho phép thêm

    // Object Custom Config sau khi parse
    CustomConfigObject: any;

    // Mã của group config
    GroupConfigCode: string;

    // Tab dọc
    IsVerticalTab: boolean;

    // config quyền
    PermissionConfig: string;

    // config quyền
    PermissionConfigObject: any;

    // CÓ hiển thị chú thích hay không
    IsShowTooltip: boolean;

    // Nội dung chú thích
    Tooltip: string;
    // trường xác định xem group này có được phép sửa không (groupType = 2)
    // (sử dụng cho tính năng tự cập nhật hồ sơ) (1: Cho phép sửa, 2: không cho phép sửa 3: không cho phép thiết sửa hay không)
    TypeEditGroup: number;

    // Đã load dữ liệu hay chưa
    IsLoadedData: boolean;
    // Có trường dữ liệu bị từ chối
    IsHaveRejectData: boolean;
}
