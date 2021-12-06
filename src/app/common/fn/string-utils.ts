import * as _ from "lodash";

export class AmisStringUtils {

    public static Trim(value: any, whitespace?: string) {
        return _.trim(value, whitespace);
    }

    public static IsNullOrEmpty(value: string) {
        const result = _.isNull(value) || _.isEmpty(value);
        if (!result) {
            return _.isNull(value.trim()) || _.isEmpty(value.trim());
        }
        return result;
    }

    /**
     * Hàm cắt chuỗi
     * @param str: Chuỗi
     * @param separator : Ký tự để cắt
     * @param limit : Số từ cần lấy ra
     * Create by: dvthaang:18.10.2018
     */
    public static Split(str, separator, limit) {
        return _.split(str, separator, limit);
    }

    /**
     * Hàm replace chuỗi
     * @param str: Chuỗi
     * @param pattern :Chuỗi bị replace
     * @param replacement : Giá trị thay thế
     * Create by: dvthaang:19.10.2018
     */
    public static Replace(str, pattern, replacement) {
        return _.split(str, pattern).join(replacement);
    }

    public static convertVNtoENToLower(str: string): string {
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ|À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ|A|Ă|Â/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ|È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ|E|Ê/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ|Ì|Í|Ị|Ỉ|Ĩ|I/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ|Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ|O|Ô|Ơ/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ|Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ|U|Ư/g, "u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ|Ỳ|Ý|Ỵ|Ỷ|Ỹ|Y/g, "y");
        str = str.replace(/đ|Đ|D/g, "d");
        str = str.toLocaleLowerCase();
        return str;
    }

    public static convertVNtoEN(str: string): string {
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/đ/g, "d");
        str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
        str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
        str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
        str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
        str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
        str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
        str = str.replace(/Đ/g, "D");
        return str;
    }

    public static trimEnd(strValue: string, whitespace: string = " "): string {
        return _.trimEnd(strValue, whitespace);
    }

    public static trimStart(strValue: string, whitespace: string = " "): string {
        return _.trimStart(strValue, whitespace);
    }
    public static startCase(strValue: string): string {
        return _.startCase(strValue);
    }

    public static UpperFirst(strValue: string): string {
        return _.upperFirst(strValue);
    }

    public static convertCamelCaseToKebab(content: string) {
        return content
            .replace(/\.?([A-Z]+)/g, "-$1")
            .replace(/^-/, "")
            .toLowerCase();
    }

    /**
     * Validate required
     * created by vhtruong - 09/03/2020
     */
    public static validateRequired(val) {
        if (val !== null && val !== undefined && val.toString().trim() !== "") {
            return true;
        }
        return false;
    }

    /**
     * Validate email
     * created by vhtruong - 09/03/2020
     */
    public static validateEmail(val: string) {
        const regexp = /\S+@\S+\.\S+/;
        if (val) {
            if (regexp.test(val)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Validate min length
     * created by vhtruong - 09/03/2020
     */
    public static validateMinLength(val: string, min: number) {
        if(min === 0){
            return true;
        }
        if (!this.IsNullOrEmpty(val)) {
            if (val.trim().length >= min) {
                return true;
            }
        }
        return false;
    }

    /**
     * Validate max length
     * created by vhtruong - 09/03/2020
     */
    public static validateMaxLength(val: string, max: number) {
        if(max === 0){
            return true;
        }
        if (!this.IsNullOrEmpty(val)) {
            if (val.trim().length < max) {
                return true;
            }
        } 
        return false;
    }

    public static FormatString(str: string, listValue: string[] = []) {
        if (str && listValue.length > 0) {
            for (let i = 0; i < listValue.length; i++) {
                str = str.replace(`{${i}}`, listValue[i]);
            }
        }
        return str;
    }

    public static MergeData(str: string, obj: object) {
        if (obj && str) {
            for (let itm in obj) {
                str = str.replace(`##${itm}##`, obj[itm]);
            }
        }
        return str;
    }

}
