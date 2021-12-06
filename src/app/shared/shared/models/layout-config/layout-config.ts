import { BaseHRMModel } from "../base-hrm";
import { GroupConfig } from '../group-config/group-config';

export class LayoutConfig extends BaseHRMModel {
    /// <summary>
    /// PK
    /// </summary>
    LayoutConfigID: string;
    /// <summary>
    /// Tên bố cục
    /// </summary>
    LayoutConfigName: string;
    /// <summary>
    /// Có phải bố cục hệ thống không
    /// </summary>
    IsSystem: boolean;
    /// <summary>
    /// Mã phân hệ
    /// </summary>
    SubsystemCode: string;
    /// <summary>
    /// ID người tạo
    /// </summary>
    UserID: string;
    /// <summary>
    /// Có phải mẫu mặc định
    /// </summary>
    IsDefault: boolean;

    /// <summary>
    /// Tên bảng master
    /// </summary>
    TableName: string;

    /// <summary>
    /// Danh sách thiết lập nhóm
    /// </summary>
    ListGroupConfig: GroupConfig[] = [];

    /// <summary>
    /// Danh sách thiết lập thông tin tóm tắt
    /// </summary>
    MainInfoConfigs: any;

    MasterData: any;

    DependentDictionaries: any;

    DependentDatas: any;

    ConfigValidates: any;
}