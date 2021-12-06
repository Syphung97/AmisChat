import { StatisticTimeType, StatisticStructureType, StatisticDisplayType } from '../../enum/statistic-type/statistic-type.enum';

export const StatisticTimeTypeData = [
    { StatisticTypeID: StatisticTimeType.Month, StatisticTypeName: "MONTH" },
    { StatisticTypeID: StatisticTimeType.Quarter, StatisticTypeName: "QUARTER" },
    { StatisticTypeID: StatisticTimeType.Year, StatisticTypeName: "YEAR" },
];

export const StatisticStructureTypeData = [
    { StatisticTypeID: StatisticStructureType.OrganizationUnit, StatisticTypeName: "ORGANIZATION" },
    { StatisticTypeID: StatisticStructureType.JobPosition, StatisticTypeName: "JOB_POSITION" },
    { StatisticTypeID: StatisticStructureType.JobTitle, StatisticTypeName: "JOB_TITLE" },
    { StatisticTypeID: StatisticStructureType.Age, StatisticTypeName: "AGE" },
    { StatisticTypeID: StatisticStructureType.Gender, StatisticTypeName: "GENDER" },
    { StatisticTypeID: StatisticStructureType.WorkingYear, StatisticTypeName: "WORKING_YEAR" },
    { StatisticTypeID: StatisticStructureType.MaritalStatus, StatisticTypeName: "MARITAL_STATUS" },
    { StatisticTypeID: StatisticStructureType.Ethnic, StatisticTypeName: "ETHNIC" },
    { StatisticTypeID: StatisticStructureType.Religion, StatisticTypeName: "RELIGION" },
    { StatisticTypeID: StatisticStructureType.Nationality, StatisticTypeName: "NATIONALITY" },
    { StatisticTypeID: StatisticStructureType.Level, StatisticTypeName: "LEVEL" },
    { StatisticTypeID: StatisticStructureType.EducationPlace, StatisticTypeName: "EDUCATION_PLACE" },
    { StatisticTypeID: StatisticStructureType.EducationMajor, StatisticTypeName: "EDUCATION_MAJOR" },
]

export const StatisticDisplayTypeData = [
    { DisplayTypeID: StatisticDisplayType.MaxAmount, DisplayTypeName: "POPOVER_STATISTIC_MAX_AMOUNT" },
    { DisplayTypeID: StatisticDisplayType.MinPercent, DisplayTypeName: "POPOVER_STATISTIC_MIN_PERCENT" }
]