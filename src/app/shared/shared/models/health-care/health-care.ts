import { BaseEntity } from 'src/common/models/base-entity'

/**
* Model cho health_care để lưu lên server
 * @export
* @class EventForInsert
*/
export class HealthCare extends BaseEntity {
    // PK Nơi đăng ký khám chữa bệnh
    HealthCareID: number
    // Tên nơi đăng ký khám chữa bệnh
    HealthCareName: string
    // Mã khám chữa bệnh
    HealthCareCode: string
    // Ghi chú
    Description: string
    // Thứ tự sắp xếp
    SortOrder?: number
    // FK - TỉnhThành phố
    ProvinceID: string
    // Tên tỉnh cấp
    ProvinceName: string
    // FK - QuậnHuyện
    DistrictID: string
    // Địa chỉ
    Address: string
    // Được sử dụng trên bảo hiểm
    IsUseInsurance?: boolean = true;
    // Được sử dụng trên bảo hiểm
    IsUse: boolean = true;
    // 
    IsSystem: boolean;
}
