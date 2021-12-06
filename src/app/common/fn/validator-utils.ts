
import { ValidatorFn, AbstractControl } from "@angular/forms";
import { ValidateErrorType } from "src/common/constant/validator/validateErrorType";
import { AmisDateUtils } from "src/common/fn/date-utils";
import { AmisStringUtils } from "src/common/fn/string-utils";
import { AmisNumberUtils } from './number-utils';

/**
 * Class validate chung
 * created by vhtruong - 08/03/2020
 */
export class ValidatorUtils {

    /**
     * Validate required by FormControl
     * created by vhtruong - 09/03/2020
     */
    static required(mess: string = null): ValidatorFn {
        return (c: AbstractControl): { [key: string]: any } | null => {
            if (AmisStringUtils.validateRequired(c.value)) {
                return null;
            }
            return {
                [ValidateErrorType.Required]: true,
                'message': mess ? mess : buildErrorMessage(ValidateErrorType.Required)
            };
        };
    }

    /**
     * Validate định dạng email by FormControl
     * created by vhtruong - 09/03/2020
     */
    static email(mess: string = null): ValidatorFn {
        return (c: AbstractControl): { [key: string]: any } | null => {
            if (AmisStringUtils.validateRequired(c.value)) {
                if (AmisStringUtils.validateEmail(c.value)) {
                    return null;
                } else {
                    return {
                        [ValidateErrorType.InCorrectEmail]: true,
                        'message': mess ? mess : buildErrorMessage(ValidateErrorType.InCorrectEmail)
                    };
                }
            } else {
                return null;
            }
        };
    }

    /**
     * Validate min length by FormControl
     * created by vhtruong - 09/03/2020
     */
    static minLength(min: number, mess: string = null): ValidatorFn {
        return (c: AbstractControl): { [key: string]: any } | null => {
            if (AmisStringUtils.validateRequired(c.value)) {
                if (AmisStringUtils.validateMinLength(c.value, min)) {
                    return null;
                } else {
                    return {
                        [ValidateErrorType.MinLengthError]: true,
                        'message': mess ? mess : buildErrorMessage(ValidateErrorType.MinLengthError)
                    };
                }
            } else {
                return null;
            }
        };
    }

    /**
     * Validate max length by FormControl
     * created by vhtruong - 09/03/2020
     */
    static maxLength(max: number, mess: string = null): ValidatorFn {
        return (c: AbstractControl): { [key: string]: any } | null => {
            if (AmisStringUtils.validateRequired(c.value)) {
                if (AmisStringUtils.validateMaxLength(c.value, max)) {
                    return null;
                } else {
                    return {
                        [ValidateErrorType.MaxLengthError]: true,
                        'message': mess ? mess : buildErrorMessage(ValidateErrorType.MaxLengthError)
                    };
                }
            } else {
                return null;
            }
        };
    }

    /**
     * Validate min Date by FormControl
     * created by vhtruong - 09/03/2020
     */
    static minDate(date: Date, mess: string = null): ValidatorFn {
        return (c: AbstractControl): { [key: string]: any } | null => {
            if (AmisStringUtils.validateRequired(c.value)) {
                if (AmisDateUtils.validateMinDate(c.value, date)) {
                    return null;
                } else {
                    return {
                        [ValidateErrorType.MinDateError]: true,
                        'message': mess ? mess : buildErrorMessage(ValidateErrorType.MinDateError)
                    };
                }
            } else {
                return null;
            }
        };
    }

    /**
     * Validate max Date by FormControl
     * created by vhtruong - 09/03/2020
     */
    static maxDate(date: Date, mess: string = null): ValidatorFn {
        return (c: AbstractControl): { [key: string]: any } | null => {
            if (AmisStringUtils.validateRequired(c.value)) {
                if (AmisDateUtils.validateMaxDate(c.value, date)) {
                    return null;
                } else {
                    return {
                        [ValidateErrorType.MaxDateError]: true,
                        'message': mess ? mess : buildErrorMessage(ValidateErrorType.MaxDateError)
                    };
                }
            } else {
                return null;
            }
        };
    }

    /**
     * Validate nhỏ hơn ngày hiện tại by FormControl
     * created by vhtruong - 09/03/2020
     */
    static beforeCurrentDate(mess: string = null): ValidatorFn {
        return (c: AbstractControl): { [key: string]: any } | null => {
            if (AmisStringUtils.validateRequired(c.value)) {
                if (AmisDateUtils.validateBeforeCurrentDate(c.value)) {
                    return null;
                } else {
                    return {
                        [ValidateErrorType.BeforeCurrentDateError]: true,
                        'message': mess ? mess : buildErrorMessage(ValidateErrorType.BeforeCurrentDateError)
                    };
                }
            } else {
                return null;
            }
        };
    }
    /**
     * Validate nhỏ hơn hoặc bằng ngày hiện tại by FormControl
     * created by vhtruong - 09/03/2020
     */
    static sameOrBeforeCurrentDate(mess: string = null): ValidatorFn {
        return (c: AbstractControl): { [key: string]: any } | null => {
            if (AmisStringUtils.validateRequired(c.value)) {
                if (AmisDateUtils.validateSameOrBeforeCurrentDate(c.value)) {
                    return null;
                } else {
                    return {
                        [ValidateErrorType.SameOrBeforeCurrentDateError]: true,
                        'message': mess ? mess : buildErrorMessage(ValidateErrorType.SameOrBeforeCurrentDateError)
                    };
                }
            } else {
                return null;
            }
        };
    }

    /**
     * Validate lớn hơn ngày hiện tại by FormControl
     * created by vhtruong - 09/03/2020
     */
    static afterCurrentDate(mess: string = null): ValidatorFn {
        return (c: AbstractControl): { [key: string]: any } | null => {
            if (AmisStringUtils.validateRequired(c.value)) {
                if (AmisDateUtils.validateAfterCurrentDate(c.value)) {
                    return null;
                } else {
                    return {
                        [ValidateErrorType.AfterCurrentDateError]: true,
                        'message': mess ? mess : buildErrorMessage(ValidateErrorType.AfterCurrentDateError)
                    };
                }
            } else {
                return null;
            }
        };
    }

    /**
     * Validate min Date by FormControl
     * created by vhtruong - 09/03/2020
     */
    static sameOrAfterCurrentDate(mess: string = null): ValidatorFn {
        return (c: AbstractControl): { [key: string]: any } | null => {
            if (AmisStringUtils.validateRequired(c.value)) {
                if (AmisDateUtils.validateSameOrAfterCurrentDate(c.value)) {
                    return null;
                } else {
                    return {
                        [ValidateErrorType.SameOrAfterCurrentDateError]: true,
                        'message': mess ? mess : buildErrorMessage(ValidateErrorType.SameOrAfterCurrentDateError)
                    };
                }
            } else {
                return null;
            }
        };
    }

    /**
     * Validate min Date by FormControl
     * created by vhtruong - 09/03/2020
     */
    static minNumber(minNumber: number, mess: string = null): ValidatorFn {
        return (c: AbstractControl): { [key: string]: any } | null => {
            if (AmisStringUtils.validateRequired(c.value)) {
                if (AmisNumberUtils.validateMinNumber(c.value, minNumber)) {
                    return null;
                } else {
                    return {
                        [ValidateErrorType.MinNumberError]: true,
                        'message': mess ? mess : buildErrorMessage(ValidateErrorType.MinNumberError)
                    };
                }
            } else {
                return null;
            }
        };
    }

    /**
     * Validate min Date by FormControl
     * created by vhtruong - 09/03/2020
     */
    static maxNumber(maxNumber: number, mess: string = null): ValidatorFn {
        return (c: AbstractControl): { [key: string]: any } | null => {
            if (AmisStringUtils.validateRequired(c.value)) {
                if (AmisNumberUtils.validateMaxNumber(c.value, maxNumber)) {
                    return null;
                } else {
                    return {
                        [ValidateErrorType.MaxNumberError]: true,
                        'message': mess ? mess : buildErrorMessage(ValidateErrorType.MaxNumberError)
                    };
                }
            } else {
                return null;
            }
        };
    }

}

/**
 * build câu lỗi default
 * created by vhtruong - 09/03/2020
 */
export function buildErrorMessage(val) {
    let result = "";
    switch (val) {
        case ValidateErrorType.Required:
            result = "Không được để trống";
            break;
        case ValidateErrorType.InCorrectEmail:
            result = "Email không đúng định dạng";
            break;
        case ValidateErrorType.MinLengthError:
            result = "Nhỏ hơn số kí tự cho phép";
            break;
        case ValidateErrorType.MaxLengthError:
            result = "Lớn hơn số kí tự cho phép";
            break;
        case ValidateErrorType.MinDateError:
            result = "Không được nhỏ hơn ngày thiết lập";
            break;
        case ValidateErrorType.MaxDateError:
            result = "Không được lớn hơn ngày thiết lập";
            break;
        case ValidateErrorType.BeforeCurrentDateError:
            result = "Phải nhỏ hơn ngày hiện tại";
            break;
        case ValidateErrorType.SameOrBeforeCurrentDateError:
            result = "Phải nhỏ hơn hoặc bằng ngày hiện tại";
            break;
        case ValidateErrorType.AfterCurrentDateError:
            result = "Phải lớn hơn ngày hiện tại";
            break;
        case ValidateErrorType.SameOrAfterCurrentDateError:
            result = "Phải lớn hơn hoặc bằng ngày hiện tại";
            break;
        case ValidateErrorType.MinNumberError:
            result = "Phải lớn hơn giá trị thiết lập";
            break;
        case ValidateErrorType.MaxNumberError:
            result = "Phải nhỏ hơn giá trị thiết lập";
            break;
    }
    return result;
}
