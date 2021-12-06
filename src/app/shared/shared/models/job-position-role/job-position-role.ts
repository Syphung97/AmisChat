import { BaseEntity } from 'src/common/models/base-entity';

export class JobPositionRole extends BaseEntity {
    //PK
    JobPositionRoleID: number;
    //Mã vai trò vị trí
    JobPositionRoleCode: string;
    //Tên vai trò vị trí
    JobPositionRoleName:string;
    //Ghi chú
    Description:string;
    //thứ tự
    SortOrder:number;
}