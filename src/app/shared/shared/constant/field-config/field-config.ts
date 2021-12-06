import { TypeFilter } from 'src/common/enum/field-config.enum';



export const FieldConfigBetween = [ "between", TypeFilter.ThisWeek, TypeFilter.ThisMonth, TypeFilter.ThisYear, TypeFilter.PrevWeek, TypeFilter.PrevYear, TypeFilter.NextWeek, TypeFilter.NextMonth, TypeFilter.NextYear, TypeFilter.PrevMonth];

export const FieldConfigTime = [ "between", TypeFilter.ToDay, TypeFilter.Tomorrow, TypeFilter.Yesterday, TypeFilter.ThisWeek, TypeFilter.ThisMonth, TypeFilter.ThisYear, TypeFilter.PrevWeek, TypeFilter.PrevYear, TypeFilter.NextWeek, TypeFilter.NextMonth, TypeFilter.NextYear, TypeFilter.PrevMonth];

export const FieldConfigEqual = [ TypeFilter.ToDay, TypeFilter.Tomorrow, TypeFilter.Yesterday ];

export const FieldConfigGetDate = [ TypeFilter.ToDay, TypeFilter.Tomorrow, TypeFilter.Yesterday, TypeFilter.ThisWeek, TypeFilter.ThisMonth, TypeFilter.ThisYear, TypeFilter.PrevWeek, TypeFilter.PrevYear, TypeFilter.NextWeek, TypeFilter.NextMonth, TypeFilter.NextYear, TypeFilter.PrevMonth];
  