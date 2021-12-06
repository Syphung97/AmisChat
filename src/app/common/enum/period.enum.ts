/**
 * Danh sách kỳ báo cáo
 * Create by: dthieu 17/8/2020
 */
export enum Period {
  M1 = 1,
  M2 = 2,
  M3 = 3,
  M4 = 4,
  M5 = 5,
  M6 = 6,
  M7 = 7,
  M8 = 8,
  M9 = 9,
  M10 = 10,
  M11 = 11,
  M12 = 12,
  ThisMonth = 13,
  PrevMonth = 14,
  NextMonth = 15,
  FirstQuarter = 16,
  SecondQuarter = 17,
  ThirdQuarter = 18,
  FourthQuarter = 19,
  FirstHalfYear = 20,
  SecondHalfYear = 21,
  FullYear = 22,
  PrevYear = 23,
  NextYear = 24,
  ThisQuarter = 25,
  PrevQuarter = 26,
  ThisWeek = 32,
  PrevWeek = 33,
  ToDay = 34,
  NextWeek = 35,
  NextQuarter = 36,
  Yesterday = 37,
  Tomorrow = 38,
  Custom = 0
}

export enum ShortPeriod {
  ThisMonth = 13,
  ThisQuarter = 25,
  FullYear = 22,
  FirstHalfYear = 20,
  SecondHalfYear = 21,
  Custom = 0
}

export enum PeriodOpportunityState {
  ThisMonth = 13,
  PrevMonth = 14,
  ThisQuarter = 25,
  PrevQuarter = 26,
  FullYear = 22,
  PrevYear = 23,
  FirstHalfYear = 20,
  SecondHalfYear = 21,
  Custom = 0
}

export enum PeriodStatistic {
  ToDay = 26,
  Yesterday = 27,
  TwentyFourHourBefore = 28,
  SevenDayAgo = 29,
  ThirtyDayAgo = 30,
  ThisMonth = 13,
  PrevMonth = 14,
  FullYear = 22,
  AllTimeFromStartSendEmail = 31,
  Custom = 0
}

export enum ReportPeriod {
  ThisWeek = 32,
  PrevWeek = 33,
  ThisMonth = 13,
  PrevMonth = 14,
  ThisQuarter = 25,
  PrevQuarter = 26,
  FullYear = 22,
  PrevYear = 23,
  FirstHalfYear = 20,
  SecondHalfYear = 21,
  Custom = 0
}

export enum DateRange {
  Period = 1,
  FromDate = 2,
  ToDate = 3
}
