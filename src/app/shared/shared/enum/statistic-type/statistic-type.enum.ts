/**
 * Thống kê theo thời gian
 * nmduy 19/08/2020
 */
export enum StatisticTimeType {
    Month = 1,
    Quarter = 2,
    Year = 3
}

/**
 * Thống kê theo cơ cấu
 * nmduy 19/08/2020
 */
export enum StatisticStructureType {
    OrganizationUnit = 1, // phòng ban
    JobPosition = 2, // vị trí công việc
    JobTitle = 3, // chức danh
    Age = 4, // Theo độ tuổi
    Gender = 5, // Theo giới tính
    WorkingYear = 6,// Theo thâm niên công tác
    MaritalStatus = 7,// Theo tình trạng hôn nhân
    Ethnic = 8,// Theo dân tộc
    Religion = 9,// Theo tôn giáo
    Nationality = 10,// Theo quốc tịch
    Level = 11, // trình độ đào tạo
    EducationPlace = 12, // Theo nơi đào tạo
    EducationMajor = 13 //Theo chuyên ngành đào tạo
}

/**
 * Điều kiện hiển thị
 * nmduy 19/08/2020
 */
export enum StatisticDisplayType {
    MaxAmount = 1, // số lượng giá trị tối đa
    MinPercent = 2, // giá trị có phần trăm tối thiểu
}