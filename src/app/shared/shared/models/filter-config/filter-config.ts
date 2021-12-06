import { BaseHRMModel } from '../base-hrm';
import { BaseEntity } from 'src/common/models/base-entity';

/**
* Model cho field_config để lưu lên server
 * @export
* @class EventForInsert
*/
export class FilterConfig extends BaseEntity {
    // PK
FilterTemplateID: number;
// Tên bộ lọc
FilterTemplateName: string;
// Giá trị bộ lọc cá trường lọc đã chọn
FilterTemplateData: string;
// ID nhân sự lưu theo bộ lọc
UserID: string;
// bộ lọc của hệ thống
IsSystem?: boolean;
// phân hệ của bộ lọc
SubsystemCode: string;
// DictionaryKey từng filter
DictionaryKey: number;
}
