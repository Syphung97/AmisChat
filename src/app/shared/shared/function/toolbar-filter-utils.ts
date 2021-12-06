import * as moment from 'moment';
import { TypeControl } from '../enum/common/type-control.enum';
import { FieldConfigBetween, FieldConfigTime, FieldConfigEqual } from '../constant/field-config/field-config';
import { AmisNumberUtils } from 'src/common/fn/number-utils';
import { convertVNtoENToLower } from 'src/common/fn/convert-VNtoEn';
import { AmisCommonUtils } from 'src/common/fn/common-utils';
import { Period } from 'src/common/enum/period.enum';
import { TypeFilter } from 'src/common/enum/field-config.enum';

export class ToolbarFilterUtils {

    /**
   * áp dụng bộ lọc
   * pvthong 18/09/2020
   */
    public static applyFilter(param) {
        const paramFilter = this.buildValueFilter(param);
        return paramFilter;
    }

    /**
     * build lọc giá trị truyền lên tìm kiếm
     * pvthong 18/09/2020
     */
    public static buildValueFilter(param) {
        const listParam = [];
        const listParamShow = [];
        const start = [1, '=', 1];
        listParam.push(start);
        //biến check có phải trong khoảng thời gian hay k
        let isBetweenTime = false;
        //biến check có phải case lấy time k
        let isGetDate = false;
        param?.FilterTemplateData?.forEach(item => {
            item.TypeID = item.TypeFilter;
            item.Value = item.FilterValue;
            item.ValueText = item.FilterValueShow;
            let valueFil = '';
            let valueShow = '';
            let valueShowEnd = '';
            if (FieldConfigBetween?.includes(item.TypeID)) {
                isBetweenTime = true;
              }
              else {
                isBetweenTime = false;
              }
              if (FieldConfigTime?.includes(item.TypeID)) {
                isGetDate = true;
              }
              else {
                isGetDate = false;
              }

            const operater = 'AND';
            listParam.push(operater);
            switch (item.TypeControl) {
                case TypeControl.Date:
                    if (item.Value?.IsGetDate) {
                        let valueTime = this.caseDate(item.TypeID);
                        valueShow = valueTime?.valueShow;
                        valueShowEnd = valueTime?.valueShowEnd;
                      }
                      else {
                        if (item.TypeID == "between") {
                          valueShow = item.Value.FromDate ? moment(new Date(item.Value.FromDate), 'YYYY/MM/DD').format('DD/MM/YYYY') : "";
                          valueShowEnd = item.Value.ToDate ? moment(new Date(item.Value.ToDate), 'YYYY/MM/DD').format('DD/MM/YYYY') : "";
                        }
                        else if (isGetDate) {
                          let valueTime = this.caseDate(item.TypeID);
                          valueShow = valueTime?.valueShow;
                          valueShowEnd = valueTime?.valueShowEnd;
                          valueFil = valueTime?.valueShow ? moment(new Date(valueTime?.valueShow), 'DD/MM/YYYY').format('YYYY/MM/DD') : null;
                        }
                        else {
                          valueShow = item.Value
                            ? moment(item.Value, 'YYYY/MM/DD').format('DD/MM/YYYY')
                            : null;
                          valueFil = item.Value;
                        }
        
                      }

                    break;
                case TypeControl.Combobox:
                case TypeControl.SelectHuman:
                case TypeControl.TreeBox:
                case TypeControl.MultiCombobox:
                case TypeControl.TreeBoxMulti:
                case TypeControl.ComboTree:
                    valueShow = item.ValueText;
                    valueFil = item.Value;
                    break;
                case TypeControl.Number:
                case TypeControl.AutoNumber:
                case TypeControl.Year:
                    valueShow = item.Value;
                    valueFil = item.Value;
                    break;
                // case TypeControl.Year:
                //   const dateValue = new Date(item.Value);
                //   if (dateValue instanceof Date && !isNaN(dateValue.valueOf())) {
                //     item.Value = dateValue;
                //     valueShow = dateValue.getFullYear().toString();
                //     valueFil = item.Value;
                //   }
                //   break;
                case TypeControl.Currency:
                    valueShow = AmisNumberUtils.currenctFormatVN(item.Value);
                    valueFil = item.Value;
                    break;
                case TypeControl.Decimal:
                case TypeControl.Percent:
                    valueShow = AmisNumberUtils.formatDecimalNumber(item.Value);
                    valueFil = item.Value;
                    break;
                default:
                    if (!!item.Value && !!item.Value.trim()) {
                        valueShow = item.Value.trim();
                        valueFil = convertVNtoENToLower(item.Value.trim());
                    }
                    break;
            }
            const operateDate = ['=', '<', '>', '<>', '>=', '<='];
            if (
                item.TypeControl === TypeControl.Date &&
                operateDate.includes(item.TypeID)
            ) {
                const dateFir = new Date(valueFil);
                const dateBef = new Date(valueFil);
                dateFir.setHours(0, 0, 0, 0);
                dateBef.setHours(24, 0, 0, 0);
                let paramFir = [item.FieldName, '>=', dateFir];
                let paramBef = [item.FieldName, '<', dateBef];
                const operaterbet = 'AND';
                const operaterOr = 'OR';
                switch (item.TypeID) {
                    case '>':
                        paramBef = [item.FieldName, '>=', dateBef];
                        listParam.push(paramBef);
                        break;
                    case '<':
                        paramFir = [item.FieldName, '<', dateFir];
                        listParam.push(paramFir);
                        break;
                    case '=':
                        paramFir = [item.FieldName, '>=', dateFir];
                        listParam.push(paramFir);
                        listParam.push(operaterbet);
                        listParam.push(paramBef);
                        break;
                    case '<>':
                        paramFir = [item.FieldName, '<', dateFir];
                        paramBef = [item.FieldName, '>=', dateBef];
                        listParam.push(paramFir);
                        listParam.push(operaterOr);
                        listParam.push(paramBef);
                        listParam.push(operaterOr);
                        listParam.push([item.FieldName, 'isnull']);
                        break;
                    case '<=':
                        const paramFam = [item.FieldName, '<', dateFir];
                        listParam.push(paramFam);
                        listParam.push(operaterOr);
                        listParam.push('(');
                        listParam.push(paramFir);
                        listParam.push(operaterbet);
                        listParam.push(paramBef);
                        listParam.push(')');
                        break;
                    case '>=':
                        const paramFin = [item.FieldName, '>=', dateBef];
                        listParam.push(paramFin);
                        listParam.push(operaterOr);
                        listParam.push('(');
                        listParam.push(paramFir);
                        listParam.push(operaterbet);
                        listParam.push(paramBef);
                        listParam.push(')');
                        break;
                    default:
                        break;
                }
            } else {
                let param = [];
                if (
                    item.TypeControl == TypeControl.Date ||
                    item.TypeControl == TypeControl.DateTime
                ) {
                    if (item.TypeID === 'isnullorempty') {
                        item.TypeID = 'isnull';
                        param = [item.FieldName, item.TypeID];
                    } else if (item.TypeID === 'hasvalue') {
                        item.TypeID = 'notnull';
                        param = [item.FieldName, item.TypeID];
                    } else {
                        param = [item.FieldName, item.TypeID, valueFil];
                    }
                } else {
                    param = [item.FieldName, item.TypeID, valueFil];
                }
                if (FieldConfigTime?.includes(item.TypeID)) {
                    let paramStart = AmisCommonUtils.cloneData(param);
                    let paramEnd = AmisCommonUtils.cloneData(param);
                    paramStart[1] = ">=";
                    paramStart[2] = new Date(new Date(moment(valueShow, 'DD/MM/YYYY').format('YYYY/MM/DD')).setHours(0, 0, 0, 0));
                    paramEnd[1] = "<=";
                    paramEnd[2] = new Date(new Date(moment(valueShowEnd, 'DD/MM/YYYY').format('YYYY/MM/DD')).setHours(23, 59, 59, 59));
                    listParam.push(paramStart);
                    listParam.push("AND");
                    listParam.push(paramEnd);
                }
                else {
                    if (item.TypeControl == TypeControl.Combobox || item.TypeControl == TypeControl.MultiCombobox) {
                        if (param[1] == "<>") {
                            param[1] = "NOTIN";
                        }
                        else if (param[1] == "=") {
                            param[1] = "IN";
                        }
                    }
                    else if (FieldConfigEqual.includes(item.TypeID)) {
                        param[1] = "="
                    }
                    listParam.push(param);
                }
            }
            let typeName = item.TypeName;
            let typeSelect;
            if (!typeName) {
                typeSelect = param.ListTypeFilter.filter(it => {
                    return item.TypeID === it.Type;
                });
                if (typeSelect && typeSelect.length > 0) {
                    typeName = typeSelect[0].TypeName;
                }
            }
            const ParamShow = [
                item.Caption,
                typeName,
                valueShow,
                item.GroupFieldConfigID,
                item.TypeID,
                valueShowEnd,
                isBetweenTime,
                item.FieldName
            ];
            listParamShow.push(ParamShow);
        });
        const paramReturn = {
            paramFilter: AmisCommonUtils.Base64Encode(
                AmisCommonUtils.Encode(listParam)
            ),
            paramShow: listParamShow,
            IsLoad: true
        };
        return paramReturn;
    }

    /**
     * switch case lấy khoảng thời gian
     * Create by: pvthong:16.09.2020
     */
    public static caseDate(key) {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();
        let data = {
            valueShow: null,
            valueShowEnd: null
        }
        switch (key) {
            case Period.ToDay:
            case TypeFilter.ToDay:
                data.valueShow = moment(moment().startOf('day').toDate(), 'YYYY/MM/DD').format('DD/MM/YYYY');
                data.valueShowEnd = moment(moment().startOf('day').toDate(), 'YYYY/MM/DD').format('DD/MM/YYYY');
                break;
            case Period.ThisWeek:
            case TypeFilter.ThisWeek:
                data.valueShow = moment(moment().startOf('isoWeek').startOf('day').toDate(), 'YYYY/MM/DD').format('DD/MM/YYYY');
                data.valueShowEnd = moment(moment().endOf('isoWeek').startOf('day').toDate(), 'YYYY/MM/DD').format('DD/MM/YYYY');
                break;
            case Period.ThisMonth:
            case TypeFilter.ThisMonth:
                data.valueShow = moment(new Date(currentYear, currentMonth, 1), 'YYYY/MM/DD').format('DD/MM/YYYY');
                data.valueShowEnd = moment(new Date(currentYear, currentMonth, this.getTotalDays(currentYear, currentMonth)), 'YYYY/MM/DD').format('DD/MM/YYYY');
                break;
            case Period.FullYear:
            case TypeFilter.ThisYear:
                data.valueShow = moment(new Date(currentYear, 0, 1), 'YYYY/MM/DD').format('DD/MM/YYYY');
                data.valueShowEnd = moment(new Date(currentYear, 11, 31), 'YYYY/MM/DD').format('DD/MM/YYYY');
                break;
            case Period.Yesterday:
            case TypeFilter.Yesterday:
                data.valueShow = moment(moment().add(-1, "day").toDate(), 'YYYY/MM/DD').format('DD/MM/YYYY');
                data.valueShowEnd = moment(moment().add(-1, "day").toDate(), 'YYYY/MM/DD').format('DD/MM/YYYY');
                break;
            case Period.PrevWeek:
            case TypeFilter.PrevWeek:
                data.valueShow = moment(moment().startOf('week').startOf('day').subtract(1, 'week').toDate(), 'YYYY/MM/DD').format('DD/MM/YYYY');
                data.valueShowEnd = moment(moment().endOf('week').startOf('day').subtract(1, 'week').toDate(), 'YYYY/MM/DD').format('DD/MM/YYYY');
                break;
                break;
            case Period.PrevMonth:
            case TypeFilter.PrevMonth:
                data.valueShow = moment(moment().startOf('month').startOf('day').subtract(1, 'month').toDate(), 'YYYY/MM/DD').format('DD/MM/YYYY');
                data.valueShowEnd = moment(moment().endOf('month').startOf('day').subtract(1, 'month').toDate(), 'YYYY/MM/DD').format('DD/MM/YYYY');
                break;
            case Period.PrevYear:
            case TypeFilter.PrevYear:
                data.valueShow = moment(new Date(currentYear - 1, 0, 1), 'YYYY/MM/DD').format('DD/MM/YYYY');
                data.valueShowEnd = moment(new Date(currentYear - 1, 11, 31), 'YYYY/MM/DD').format('DD/MM/YYYY');
                break;
            case Period.Tomorrow:
            case TypeFilter.Tomorrow:
                data.valueShow = moment(moment().add(1, "day").toDate(), 'YYYY/MM/DD').format('DD/MM/YYYY');
                data.valueShowEnd = moment(moment().add(1, "day").toDate(), 'YYYY/MM/DD').format('DD/MM/YYYY');
                break;
            case Period.NextWeek:
            case TypeFilter.NextWeek:
                data.valueShow = moment(moment().add(1, 'weeks').startOf('isoWeek').startOf('day').toDate(), 'YYYY/MM/DD').format('DD/MM/YYYY');
                data.valueShowEnd = moment(moment().add(1, 'weeks').endOf('isoWeek').startOf('day').toDate(), 'YYYY/MM/DD').format('DD/MM/YYYY');
                break;
            case Period.NextMonth:
            case TypeFilter.NextMonth:
                if (currentMonth == 11) {
                    data.valueShow = moment(new Date(currentYear + 1, 0, 1), 'YYYY/MM/DD').format('DD/MM/YYYY');
                    data.valueShowEnd = moment(new Date(currentYear + 1, 0, 31), 'YYYY/MM/DD').format('DD/MM/YYYY');
                }
                else {
                    data.valueShow = moment(new Date(currentYear, currentMonth + 1, 1), 'YYYY/MM/DD').format('DD/MM/YYYY');
                    data.valueShowEnd = moment(new Date(currentYear, currentMonth + 1, this.getTotalDays(currentYear, currentMonth + 1)), 'YYYY/MM/DD').format('DD/MM/YYYY');
                }
                break;
            case Period.NextYear:
            case TypeFilter.NextYear:
                data.valueShow = moment(new Date(currentYear + 1, 0, 1), 'YYYY/MM/DD').format('DD/MM/YYYY');
                data.valueShowEnd = moment(new Date(currentYear + 1, 11, 31), 'YYYY/MM/DD').format('DD/MM/YYYY');
                break;
            default:
                data = null;
                break;
        }

        return data;
    }

    /**
     * Hàm lấy về tổng số ngày của tháng
     * @param year : Năm
     * @param month : tháng (Bắt đầu từ 0)
     * Create by: dthieu:02.05.2020
     */
    public static getTotalDays(year: number, month: number) {
        switch (month) {
            case 1:
                if (year % 400 === 0 || (year % 4 == 0 && year % 100 !== 0)) {
                    return 29;
                } else {
                    return 28;
                }
            case 0:
            case 2:
            case 4:
            case 6:
            case 7:
            case 9:
            case 11:
                return 31;
            default:
                return 30;
        }
    }
}