import { BaseHRMModel } from '../base-hrm';

/**
 * Model cho employee để lưu lên server
 * @export
 * @class EventForInsert
 */
export class Contract extends BaseHRMModel {
  /// <summary>
  ///
  /// </summary>
  ContractID: number;
  /// <summary>
  /// ID nhân viên
  /// </summary>
  EmployeeID: number;
  /// <summary>
  /// Tên nhân viên
  /// </summary>
  EmployeeName: string;
  /// <summary>
  /// Mã nhân viên
  /// </summary>
  EmployeeCode: string;
  /// <summary>
  /// Số hợp đồng
  /// </summary>
  ContractNo: string;
  /// <summary>
  /// Tên hợp đồng
  /// </summary>
  ContractSubject: string;
  /// <summary>
  /// Loại hợp đồng
  /// </summary>
  ContractTypeID: number;
  /// <summary>
  /// Loại hợp đồng
  /// </summary>
  ContractTypeName: string;
  /// <summary>
  /// Ngày ký
  /// </summary>
  SignedDate: Date;
  /// <summary>
  /// Ngày bắt đầu có hiệu lực
  /// </summary>
  StartDate: Date;
  /// <summary>
  /// Ngày kết thúc hiệu lực
  /// </summary>
  EndDate: Date;
  /// <summary>
  /// ID vị trí công việc
  /// </summary>
  JobPositionID: number;
  /// <summary>
  /// Tên VTCV
  /// </summary>
  JobPositionName: string;
  /// <summary>
  /// ID ĐVCT
  /// </summary>
  OrganizationUnitID: string;
  /// <summary>
  /// Tên ĐVCT
  /// </summary>
  OrganizationUnitName: string;
  /// <summary>
  /// Giá trị hợp đồng
  /// </summary>
  SalaryBasic: number;
  /// <summary>
  /// Tỷ lệ hưởng lương. HĐ XĐ thời hạn, HĐ không XĐ thời hạn => Tỷ lệ hưởng lương mặc định =100%
  /// </summary>
  SalaryRate: number;
  /// <summary>
  /// Mức lương đóng BH
  /// </summary>
  SalaryForInsurance: number;
  /// <summary>
  /// ID thời hạn HĐ
  /// </summary>
  ContractPeriodID: number
  /// <summary>
  /// Thời hạn hợp đồng
  /// </summary>
  ContractPeriodName: string;
  /// <summary>
  /// Người đại diện công ty ký HĐ
  /// </summary>
  OnBehalfOfEmployerID: number;
  /// <summary>
  /// Người đại diện ký hợp đồng
  /// </summary>
  OnBehalfOfEmployerName: string;
  /// <summary>
  /// Chức danh
  /// </summary>
  JobTitleID: number;
  /// <summary>
  /// Chức danh người đại diện
  /// </summary>
  JobTitleName: string;
  /// <summary>
  /// Trích yếu hợp đồng
  /// </summary>
  Summary: string;
  /// <summary>
  /// ID Hình thức làm việc
  /// </summary>
  WorkTypeID: number;
  /// <summary>
  /// Hình thức làm việc
  /// </summary>
  WorkTypeName: string;
  /// <summary>
  /// ID tệp đính kèm
  /// </summary>
  AttachmentID: string;
  /// <summary>
  /// Tên tệp đính kèm
  /// </summary>
  AttachmentName: string;
  /// <summary>
  /// Ghi chú
  /// </summary>
  Description: string;
  /// <summary>
  /// Địa điểm làm việc
  /// </summary>
  WorkingPlace: string;
  /// <summary>
  /// ID Trạng thái HĐ
  /// </summary>
  ContractStatusID: number;
  /// <summary>
  /// Trạng thái hợp đồng
  /// </summary>
  ContractStatusName: string;
  /// <summary>
  /// ID loại hợp đồng gốc
  /// </summary>
  OriginalContractTypeID: number;
  /// <summary>
  ///  Loại hợp đồng gốc
  /// </summary>
  OriginalContractTypeName: string;
  /// <summary>
  /// Ngày bắt đầu có hiệu lực (trên hợp đồng gốc)
  /// </summary>
  OriginalStartDate: Date;
  /// <summary>
  /// Ngày kết thúc hết hiệu lực (trên hợp đồng gốc)
  /// </summary>
  OriginalEndDate: Date;
  /// <summary>
  /// Thời hạn hợp đồng (trên hợp đồng gốc)
  /// </summary>
  OriginalContractPeriodID: number;
  /// <summary>
  /// Thời hạn hợp đồng (trên hợp đồng gốc)
  /// </summary>
  OriginalContractPeriodName: string;
  /// <summary>
  /// Vị trí công việc (trên hợp đồng gốc)
  /// </summary>
  OriginalJobPositionID: number;
  /// <summary>
  /// Vị trí công việc (trên hợp đồng gốc)
  /// </summary>
  OriginalJobPositionName: string;
  /// <summary>
  /// Đơn vị (trên hợp đồng gốc)
  /// </summary>
  OriginalOrganizationUnitID: number;
  /// <summary>
  /// Đơn vị (trên hợp đồng gốc)
  /// </summary>
  OriginalOrganizationUnitName: string;
  /// <summary>
  /// Hình thức làm việc (PickList) (trên hợp đồng gốc)
  /// </summary>
  OriginalWorkTypeID: number;
  /// <summary>
  /// Hình thức làm việc (PickList) (trên hợp đồng gốc)
  /// </summary>
  OriginalWorkTypeName: string;
  /// <summary>
  /// Mức lương đóng bảo hiểm (trên hợp đồng gốc)
  /// </summary>
  OriginalSalaryForInsurance: number;
  /// <summary>
  /// Mức lương thỏa thuận (trên hợp đồng gốc)
  /// </summary>
  OriginalAgreedSalary: number;
  /// <summary>
  /// Tỷ lệ hưởng lương. HĐ XĐ thời hạn, HĐ không XĐ thời hạn => Tỷ lệ hưởng lương mặc định =100% (HĐ gốc)
  /// </summary>
  OriginalSalaryRate: number;
}
