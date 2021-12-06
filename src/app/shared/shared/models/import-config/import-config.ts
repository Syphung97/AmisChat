import { BaseHRMModel } from '../base-hrm';
import { ColumnMapping } from '../import/import-column-mapping';

// Cấu hình nhập khẩu
export class ImportConfig extends BaseHRMModel{ 
    // Loại nhập khẩu
    ImportType: number;
    // Sheet thao tác
    SheetIndex: number;
    // Dòng tiêu đề
    HeaderIndex: number;
    // Phân hệ nhập khẩu
    SubsystemCode: string;
    // Danh sách column mapping
    ColumnMappings: ColumnMapping[];
    // Tên entity
    EntityTypeName: string;
    // Dữ liệu truyền thêm param theo từng nghiệp vụ
    Param: any;
    // Tên file sau khi upload data
    FileName: string;
    ApplicationCode: string;
}