export class FieldUpdate {
    ModelName 
    /// <summary>
    /// Trường khóa chính
    /// </summary>
    FieldKey 
    /// <summary>
    /// Giá trị  trường khóa chính
    /// </summary>
    ValueKey 
    /// <summary>
    /// Danh sách các cột update
    ///  + Key: tên trường
    ///  + Value: giá trị cập nhật
    /// </summary>
    FieldNameAndValue: any;
    DataModel: any;
}