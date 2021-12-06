import { BaseEntity } from 'src/common/models/base-entity';
import { IncomeAllowance } from '../income-allowance/income-allowance';
import { DeductionAllowance } from '../deduction-allowance/deduction-allowance';
import { GroupConfig } from '../group-config/group-config';

export class JobPosition extends BaseEntity {
    //PK
    JobPositionID: number;
    //Mã vai trò vị trí
    JobPositionCode: string;
    //Tên vai trò vị trí
    JobPositionName: string;
    /// ID nhóm vị trí công việc
    JobPositionCategoryID: number;
    /// Nhóm vị trí công việc
    JobPositionCategoryName: string;
    /// ID cấp bậc vị trí công công việc
    JobLevelID: number;
    /// Tên cấp bậc vị trí công việc
    JobLevelName: string;
    /// ID chức danh
    JobTitleID: number;
    /// Tên chức danh
    JobTitleName: string;
    /// ID CCTC
    OrganizationUnitID: number;
    /// Tên CCTC
    OrganizationUnitName: string;
    /// Mức lương đóng bảo hiểm
    SocialInsuranceSalary: number;
    /// Số ngày được nghỉ phép
    NumberOfLeaveDay: number;
    /// Thứ tự sắp xếp
    SortOrder: number;
    /// ID vai trò công việc
    JobPositionRoleID: number;
    /// Tên vai trò công việc
    JobPositionRoleName: string;
    /// Danh sách thu nhập thường xuyên
    IncomeAllowances: IncomeAllowance[];
    //Danh sách khấu trừ thường xuyên
    DeductionAllowances: DeductionAllowance[];
    /// Ngừng theo dõi
    Inactive: boolean;
    //ID trạng thái
    JobPositionStatusID : number;
    //tên trạng thái
    JobPositionStatusName : number;
    GroupConfigs: GroupConfig[];
}
