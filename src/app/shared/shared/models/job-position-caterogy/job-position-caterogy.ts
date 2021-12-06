import { BaseEntity } from 'src/common/models/base-entity';

export class JobPositionCategory extends BaseEntity {
    //PK
    JobPositionCategoryID: number;
    //Tên nhóm vị trí
    JobPositionCategoryName: string;
    //Ghi chú
    Description:string;
    //thứ tự
    SortOrder:number;
}