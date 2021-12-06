export class OrganizationUnit {
  // ID
  OrganizationUnitID: string;
  // Mã
  OrganizationUnitCode: string;
  // Tên
  OrganizationUnitName: string;
  // tên dể search
  OrganizationUnitNameSearch: string;
  // Cấp tổ chức
  OrganizationUnitTypeID: number;
  MISACode: string;
  // ID cha
  ParentID: string;
  ParentName: string;
  // Địa chỉ
  Address: string;
  // Số lượng nhân viên
  QuantityEmployee: number;
  // Có con hay không?
  IsParent: boolean;
  // Số đăng ký kinh doanh
  BusinessRegistrationCode: string;
  // Ngày cấp
  DateOfIssue: Date;
  // Nơi cấp
  PlaceOfIssue: string;
  // Nhiệm vụ chính
  MainTask: string;
  // Hạch toán theo : Phụ thuộc - Độc lập
  CreatingBussinessType: number;
  // Có phải sản xuất
  IsProduce: boolean;
  // Có phải hỗ trợ
  IsSupport: boolean;
  // Có phải kinh doanh
  IsBusiness: boolean;
  //Ngừng kích hoạt?
  Inactive: boolean;
  //Tên cấp tổ chức
  OrganizationUnitTypeName: string;
  //Lưu lại giá trị cũ
  OldData: string;
  //Trạng thái thêm sửa
  State: number;
  //Có cập nhật trạng thái của nhánh con không?
  IsUpdateStatusChild: boolean;
  DictionaryKey: number;
  constructor() {
    this.IsUpdateStatusChild = false;
  }
}

//Cấp tổ chức
export class OrganizationUnitType {
  //ID
  OrganizationUnitTypeID: number;
  //Tên
  OrganizationUnitTypeName: string;
  //Thứ tự
  SortOrder: number;
  //Có phải mặc định hệ thống
  IsSystem: boolean;
  //Giá trị cũ
  OldName: string;
  // Cấp độ của cấp tổ chức
  Level: number;
  // Phân biệt cấp tổ chức ngầm định mang đi
  DictionaryKey: number;
}
