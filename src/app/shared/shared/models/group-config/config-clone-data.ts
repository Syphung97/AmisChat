
/**
 * Object trong trường ConfigCloneDataMaster trong GroupConfig
 * 
 * @export
 * @class ConfigCloneDataByMaster
 */
export class ConfigCloneDataByMaster {
    // Tên trường trong con
    FieldName: string;
    // Có sử dụng property trên master object hay sử dụng group field config
    IsUsePropertyInMaster: boolean;
    // Tên trường trên object cha để lấy value
    FieldCloneValue: string;
    // Tên trường trên object cha để lấy value text ( đối với các trường combobox )
    FieldCloneValueText: string;
    // Danh sách property sẽ thay đổi
    PropertyChange: any;
}

