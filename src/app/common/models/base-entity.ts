import { FormMode } from "../enum/form-mode.enum";

export class BaseEntity {
    TenantID?: string;
    CreatedDate?: Date;
    CreatedBy?: string;
    ModifiedDate?: Date;
    ModifiedBy?: string;
    EditVersion?: Date;
    State?: FormMode;
    EditVersionConvert?: number;
    PassWarningCode?: string[];
}
