import { BaseEntity } from 'src/common/models/base-entity';

export class Attachment extends BaseEntity {
    //PK
    ID: number;
    //ID tệp
    AttachmentID: string;
    //Tên tệp
    AttachmentName: string;
    //ID loại tài liệu
    AttachmentTypeID: string;
    //Tên loại tài liệu
    AttachmentTypeName: string;
    //ID bản ghi đính kèm
    MasterID:number;
    //Độ dài file
    AttachmentFileSize?: string;
    //Định dạng file
    AttachmentExtension: string;
    //Mô tả
    Description?: string;
    //Cho phép nhân viên download tệp
    IsAllowToDownload?: boolean;

    MasterType: string;
    //enum upload
    FileTypeStorage:number
    //loại phân cách tên tài liệu
    TypeSeparate: number;
}
