import { BaseEntity } from 'src/common/models/base-entity';

export class JobLevel extends BaseEntity {
    //PK
    JobLevelID: number;
    /// Tên cấp bậc
    JobLevelName: string;
    /// Ghi chú
    Description: string;
    /// Thứ tự
    SortOrder: string;
    
}