import { BaseEntity } from 'src/common/models/base-entity';

export class PickList extends BaseEntity {
    ID: number
    // ID danh mục
    PickListID: number
    // Loại danh mục
    PickListType: string
    // Giá trị danh mục
    PickListValue: string = "";
    // Phân hệ
    SubsystemCode: string = "";
    // Ghi chú
    Description: string
    // thứ tự sắp xếp
    SortOrder?: number
    // thứ tự sắp xếp
    IsUse?: boolean;
    // 
    IsSystem?: boolean = false;
    // Giá trị trước đó
    PreviousValue: string = "";
    // Giá trị gốc
    OriginValue: string = "";
}
