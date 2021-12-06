import { OperatorType } from 'src/common/enum/operator-type.enum';
import { DataType } from '../models/export/data-type.enum';
import { AmisConverterUtils } from './converter-utils';
import { AmisDateUtils } from './date-utils';

export function convertType(value, dataType) {
    switch (dataType) {
        case DataType.CheckBoxType:
            return AmisConverterUtils.BooleanConverter(value);
        case DataType.DateType:
            return AmisConverterUtils.DateConverter(value);
        case DataType.DefaultType:
            return AmisConverterUtils.StringConverter(value);
        default: return value;
    }
}

/**
 * hàm compare dữ liệu
 * nmduy 03/10/2020
 */
// export function compareEqualValue(data, value, dataType: DataType) {

//     if (data === value) {
//         return true;
//     }

//     if (data != null && data != undefined && value != null && value != undefined && data.toString() == value.toString()) {
//         return true;
//     }
//     if ((data == null && value == undefined) || (value == null && data == undefined)) {
//         return true;
//     }
// }




export function checkDependentData(data, dataType: DataType, operator, value) {
    value = convertType(value, dataType);
    data = convertType(data, dataType);
    switch (operator) {
        case OperatorType.Equal:
            if (data === value) {
                return true;
            }
            if (dataType == DataType.DateType) {
                return AmisDateUtils.compareSameDates(value, data);
            }
            if (data != null && data != undefined && value != null && value != undefined && data.toString() == value.toString()) {
                return true;
            }
            if ((data == null && value == undefined) || (value == null && data == undefined)) {
                return true;
            }
            break;
        case OperatorType.GreaterThan:
            switch (dataType) {
                case DataType.DateType:
                    if ((data != null && value != undefined && value != null && data != undefined)) {
                        return AmisDateUtils.validateAfterDate(data, value);
                    }
                    return true;
                    break;
                default: if (data <= value) {
                    return true;
                }
            }
            break;
        case OperatorType.GreaterOrEqual:
            switch (dataType) {
                case DataType.DateType:
                    if ((data != null && value != undefined && value != null && data != undefined)) {
                        return AmisDateUtils.validateMinDate(data, value);
                    }
                    return true;
                    break;
                default: if (data <= value) {
                    return true;
                }
            }
            break;
        case OperatorType.LessThan:
            switch (dataType) {
                case DataType.DateType:
                    if ((data != null && value != undefined && value != null && data != undefined)) {
                        return AmisDateUtils.validateBeforeDate(data, value);
                    }
                    return true;
                    break;
                default: if (data <= value) {
                    return true;
                }
            }
            break;
        case OperatorType.LessOrEqual:
            switch (dataType) {
                case DataType.DateType:
                    if ((data != null && value != undefined && value != null && data != undefined)) {
                        return AmisDateUtils.validateMaxDate(data, value);
                    }
                    return true;
                    break;
                default: if (data >= value) {
                    return true;
                }
            }
            break;
        case OperatorType.None:
            if (data === value) {
                return true;
            }
            break;
        case OperatorType.NotBetween:
            if (data === value) {
                return true;
            }
            break;
        case OperatorType.NotEqual:
            if (data != null && data != undefined && value != null && value != undefined && data.toString() != value.toString()) {
                return true;
            }
            break;
        case OperatorType.Contains:
            if (data === value) {
                return true;
            }
            break;
        case OperatorType.NotContains:
            if (data === value) {
                return true;
            }
            break;
        case OperatorType.IsNullOrEmpty:
            if (data == null || data == undefined || data.toString().trim() === "") {
                return true;
            }
            break;
        case OperatorType.HasValue:
            if (data != null && data != undefined) {
                return true;
            }
            break;
    }
    return false;
}
