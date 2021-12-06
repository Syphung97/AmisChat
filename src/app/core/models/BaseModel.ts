import { FormMode } from "./FormMode";

export class BaseModel {
  TenantID?: string;
  CreatedDate?: Date;
  CreatedBy?: string;
  ModifiedDate?: Date;
  ModifiedBy?: string;
  EditVersion?: Date;
  State?: FormMode;
  EditVersionConvert?: number;
}
