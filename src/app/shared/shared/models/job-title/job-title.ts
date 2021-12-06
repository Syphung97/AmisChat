import { BaseEntity } from 'src/common/models/base-entity';

export class JobTitle extends BaseEntity {
    //PK
    JobTitleID: number;
    /// Tên cấp bậc
    JobTitleName: string;
    /// Ghi chú
    Description: string;
    /// Thứ tự
    SortOrder: string;
    
}