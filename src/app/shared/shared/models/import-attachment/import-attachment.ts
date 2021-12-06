import { BaseHRMModel } from '../base-hrm';

export class ImportAttachment extends BaseHRMModel {
    //PK
    ImportMappingAttachmentID: number;
    //ID loại tài liệu
    IDAttachmentType: number;
    //Tên tài liệu
    FileName: string;
    // Từ mapping phân cách bởi ;
    MappingKeyword: string;
    // Có phải hệ thống không
    IsSystem: boolean;
    
}
