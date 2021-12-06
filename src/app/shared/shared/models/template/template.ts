import { BaseHRMModel } from '../base-hrm';

/**
 * Model cho employee để lưu lên server
 * @export
 * @class EventForInsert
 */
export class Template extends BaseHRMModel {
    //PK
    TemplateID: number;
    //Tên mẫu
    TemplateName:string;
    //ID loại mẫu
    TemplateTypeID:number;
    //ID tên mẫu
    TemplateTypeName: string;
    //Ghi chú
    Description: string;
    //Loại file
    Extention: string;
    //Cho phép tải mẫu xuống hay không
    AllowDownload: boolean;
    //UserID của người chỉnh sửa cuối
    UserIDModifiedLast: string;
    //Họ và tên người chỉnh sửa cuối cùng
    FullNameModifiedLast: string;
    // Nội dung
    Content: string;
    //FK
    AttachmentID: string;
    //Tên file
    AttachmentName: string;

    AttachmentFileSize: number

    Type?: number;

    Title: string;

}
