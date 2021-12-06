import { BaseHRMModel } from '../base-hrm';
import { ModelDetailConfig } from '../model-detail-config';

/**
 * Model cho employee để lưu lên server
 * @export
 * @class EventForInsert
 */
export class Employee extends BaseHRMModel {
  // PK
  ID: number;
  // ID tương ứng với User của ứng viên
  EmployeeID: string;
  // Mã nhân viên
  EmployeeCode: string;
  // Họ đệm
  FirstName: string;
  // Tên
  LastName: string;
  // Họ và tên
  FullName: string;
  // ID Giới  tính
  GenderID?: number;
  // Giowisi tính
  GenderName: string;
  // Ngày sinh
  BirthDay?: Date;
  // Mã số thuế cá nhân
  PersonalTaxCode: string;
  // Tình trạng hôn nhân (PickList)
  MaritalStatusID?: number;
  // Hôn nhân
  MaritalStatusName: string;
  // Thành phần gia đình (PickList)
  FamilyClassBackgroundID?: number;
  // TP gia đình
  FamilyClassBackground: string;
  // Dân tộc (PickList)
  EthnicID?: number;
  // Dân tộc
  EthnicName: string;
  // Quốc tịch
  CountryID?: number;
  // Quốc tịnh
  CountryName: string;
  // Thành phần bản thân (PickList)
  PersonalClassBackgroundID?: number;
  // thành phân bản thân
  PersonalClassBackgroundName: string;
  // Tôn giáo (PickList)
  ReligionID?: number;
  // Tôn giáo
  ReligionName: string;
  // Nơi sinh
  BirthPlace: string;
  // Nguyên quán
  HomeLand: string;
  // Số chứng minh nhân dân/thẻ căn cước
  IdentifyNumber: string;
  // Nơi cấp CMND
  IdentifyNumberIssuedPlace: string;
  // Ngày cấp CMND
  IdentifyNumberIssuedDate?: Date;
  // Ngày hết hạn CMND
  IdentifyNumberExpiredDate?: Date;
  // Số hộ chiếu
  PassportNumber: string;
  // Ngày cấp hộ chiếu
  PassportIssuedDate?: Date;
  // Nơi cấp hộ chiếu
  PassportIssuedPlace: string;
  // Hộ chiếu hiệu lực từ ngày
  PassportEffectFromDate?: Date;
  // Ngày hết hạn hộ chiếu
  PassportEffectToDate?: Date;
  // Trình độ văn hóa
  EducationLevel: string;
  // Tên nơi đào tạo (PickList)
  EducationPlaceID?: number;
  // nơi đào tạo
  EducationPlaceName: string;
  // Chuyên ngành (PickList)
  EducationMajorID?: number;
  // ngành
  EducationMajorName: string;
  // Khoa đào tạo (PickList)
  EducationFacultyID?: number;
  // khoa
  EducationFacultyName: string;
  // ID Trình độ
  LevelID?: number;
  // Tên trình độ
  LevelName: string;
  // Xếp loại bằng(PickList)
  EducationDegreeID?: number;
  // Xếp loại
  EducationDegreeName: string;
  // Năm tốt nghiệp
  AwardedYear?: number;
  // Điện thoại nhà riêng
  HomeTel: string;
  // Điện thoại cơ quan
  OfficeTel: string;
  // ĐTDĐ
  Mobile: string;
  // Di động khác
  OtherMobile: string;
  // Email
  Email: string;
  // Email cơ quan
  OfficeEmail: string;
  // Email khác
  OtherEmail: string;
  // Facebook
  FacebookID: string;
  // Skype
  SkypeID: string;
  // MSN
  MSNID: string;
  // Quốc gia thường trú
  NativeCountryID?: number;
  // Quốc gia
  NativeCountryName: string;
  // Tình/Thành thường trú
  NativeProvinceID?: number;
  // Tỉnh
  NativeProvinceName: string;
  // Quận/Huyện thường trú
  NativeDistrictID?: number;
  // quận
  NativeDistrictName: string;
  // Xã/Phường (HK thường trú)
  NativeWardID?: number;
  // xã
  NativeWardName: string;
  // Địa chỉ thường trú
  NativeAddress: string;
  // Là chủ hộ
  IsHeadHouseHold?: boolean;
  // Số sổ hộ khẩu
  RegistrationBookNumber: string;
  // Mã hộ gia đình
  RegistrationBookCode: string;
  // Quốc gia tạm trú
  CurrentCountryID?: number;
  // Quốc gia
  CurrentCountryName: string;
  // Tình/Thành tạm trú
  CurrentProvinceID?: number;
  // Quận/huyện
  CurrentProvinceName: string;
  // Quận/Huyện tạm trú
  CurrentDistrictID?: number;
  // Phường
  CurrentDistrictName: string;
  // Xã/Phường (HK tạm trú)
  CurrentWardID?: number;
  // Xã
  CurrentWardName: string;
  // Địa chỉ tạm trú
  CurrentAddress: string;
  // Tên người liên hệ trong trường hợp khẩn cấp
  ContactName: string;
  // Quan hệ người liên hệ khẩn cấp
  RelationshipName: string;
  // Di động người liên hệ khẩn cấp
  ContactMobile: string;
  // Điện thoại người liên hệ khẩn cấp
  ContactTel: string;
  // Email người liên hệ khẩn cấp
  ContactEmail: string;
  // Địa chỉ người liên hệ khẩn cấp
  ContactAddress: string;
  // Mã nhân viên trên máy chấm công
  EmployeeCodeTS: string;
  // Đơn vị, phòng ban, Tổ nhóm
  OrganizationUnitID: string;
  // Đơn vị, phòng ban, Tổ nhóm
  OrganizationUnitName: string;
  // Vị trí công việc
  JobPositionID?: number;
  // Vị trí công việc
  JobPositionName?: string;
  // Chức danh
  JobTitle: string;
  // Bậc nhân viên
  EmployeeGradeID?: number;
  // Bậc nhân viên
  EmployeeGradeName: string;
  // Tình trạng: Đang làm việc, Nghỉ hưu, Thôi việc, Hợp đồng ...
  EmployeeStatusID?: number;
  // Tên trạng thái
  EmployeeStatusName: string;
  // Địa điểm làm việc
  WorkingPlace: string;
  // Số sổ lao động
  LaborBookNumber: string;
  // ID Loại hợp đồng
  ContractTypeID?: number;
  // Loại hợp đồng
  ContractTypeName: string;
  // Ngày tập sự
  ProbationDate?: Date;
  // ngày thử việc
  HireDate?: Date;
  // Ngày chính thức
  ReceiveDate?: Date;
  // Người quản lý (trực tiếp)
  ReportToID: string;
  // Người quản lý
  ReportToName: string;
  // Người quản lý gián tiếp
  SupervisorID: string;
  // Người quản lý
  SupervisorName: string;
  // Số ngày phép được hưởng
  NumberOfLeaveDay?: number;
  // Tự động tăng theo thâm niên
  AutoIncrementSeniority?: boolean;
  // Ngày nghỉ việc
  TerminationDate?: Date;
  // Người duyệt nghỉ
  TerminationApprover: string;
  // Ghi chú (khi nghỉ việc)
  TerminationNote: string;
  // Số quyết định thôi việc
  TerminationDecisionNo: string;
  // Ngày duyệt nghỉ
  TerminationApproveDate?: Date;
  // Ngạch bậc lương
  SalaryCategory: string;
  // Lương cơ bản
  SalaryBasic?: number;
  // Mức lương đóng bảo hiểm xã hội
  SalarySocialInsurance?: number;
  // Số công chuẩn
  TotalStandardWorking?: number;
  // Số tài khoản
  BankAccountNo: string;
  // Ngân hàng
  BankID?: number;
  // Ngân hàng
  BankName: string;
  // 1: Tham gia công đoàn, 0: Không tham gia
  IsTradeUnion?: boolean;
  // Ngày cấp BHXH
  SocialInsuranceSupplementingDate?: Date;
  // Tỷ lệ đóng bảo hiểm
  InsuranceRate?: number;
  // Số BHXH
  SocialInsuranceNumber: string;
  // Mã số BHXH
  SocialInsuranceCode: string;
  // Mã tỉnh cấp BHXH
  IdentifyNumberIssuedProvinceID?: number;
  // Mã tỉnh
  IdentifyNumberIssuedProvinceName: string;
  // Số thẻ bảo hiểm y tế
  HealthInsuranceNumber: string;
  // Nơi cấp thẻ BHYT
  HealthInsuranceIssuePlace: string;
  // Ngày hết hạn thẻ BHYT
  HealthInsuranceExpiredDate?: Date;
  // Nơi đăng ký khám chữa bệnh
  HealthCareID?: number;
  // Nơi khám chữa bệnh
  HealthCareName: string;
  // Là Đoàn viên
  IsUnionMember?: boolean;
  // Ngày vào Đoàn
  UnionJoinDate?: Date;
  // Chức vụ Đoàn
  UnionPositionID?: number;
  // Tên chức vụ đoàn
  UnionPositionName: string;
  // Nơi kết nạp Đoàn
  UnionJoinPlace: string;
  // Là Đảng viên
  IsPartyMember?: boolean;
  // Ngày vào Đảng
  PartyJoinDate?: Date;
  // Chức vụ Đảng
  PartyPositionID?: number;
  // 2222
  PartyPositionName: string;
  // Nơi kết nạp
  PartyJoinPlace: string;
  // Cột lưu các thông tin custom
  CustomField: any;
  // ngày sửa
  ModifiedDate?: Date;
  // người sửa
  ModifiedBy: string;

  UserID: string;

  UserName: string; // email kích hoạt

  Avatar: string;
  StatusID: number;
  StatusName: string;
  IsDeleted: boolean; // hồ sơ đã bị xóa hay chưa
  //đơn vị công tác
  MilitaryBranch: string;

  EmployeeOthers: any[];

  constructor() {
    super();
    let modelDetailConfig: ModelDetailConfig[] = [];
    modelDetailConfig.push(new ModelDetailConfig("EmployeeOthers", "employee_other", "EmployeeID"));
    this.ModelDetailConfigs = modelDetailConfig;
  }

}
