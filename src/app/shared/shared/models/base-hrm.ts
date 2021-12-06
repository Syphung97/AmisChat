import { BaseEntity } from 'src/common/models/base-entity';
import { FieldConfig } from './field-config/field-config';
import { GroupConfig } from './group-config/group-config';
import { ModelDetailConfig } from './model-detail-config';

export class BaseHRMModel extends BaseEntity{
        /// <summary>
        /// Thông tin danh sách config
        /// </summary>
        FieldConfigs: FieldConfig[] = [];

        GroupConfigs: GroupConfig[] = [];
        /// <summary>
        /// Trường lưu giá trị mặc định
        /// </summary>
        CustomField: string;
        /// <summary>
        /// Trường parse giá trị custom
        /// </summary>
        CustomFieldParse: string;

        IsDelete: boolean;

        ValidateMethod: string[];
    
        IsErrorCustom: boolean = false;
    
        ErrorMessage: string = "";

        ModelDetailConfigs: ModelDetailConfig[] = [];

        CustomData: any = {};

}