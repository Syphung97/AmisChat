/**
 * Các kiểu lỗi
 * created by vhtruong - 09/03/2020
 */
export const ValidateErrorType = {
    // Trống
    Required: "Required",
    // Email không đúng định dạng
    InCorrectEmail: "InCorrectEmail",
    // Không đúng định dạng số
    InCorrectNumber: "InCorrectNumber",
    // Ít hơn min length
    MinLengthError: "MinLengthError",
    // Nhiều hơn max length
    MaxLengthError: "MaxLengthError",
    // Nhỏ hơn thời gian min
    MinTimeError: "MinTimeError",
    // Lớn hơn thời gian max
    MaxTimeError: "MaxTimeError",
    // Ít hơn min date
    MinDateError: "MinDateError",
    // Nhiều hơn max date
    MaxDateError: "MaxDateError",
    // Không nhỏ hơn ngày hiện tại
    BeforeCurrentDateError: "BeforeCurrentDateError",
    // Không nhỏ hơn hoặc bằng ngày hiện tại
    SameOrBeforeCurrentDateError: "SameOrBeforeCurrentDateError",
    // Không lớn hơn ngày hiện tại
    AfterCurrentDateError: "AfterCurrentDateError",
    // Không lớn hơn hoặc bằng ngày hiện tại
    SameOrAfterCurrentDateError: "SameOrAfterCurrentDateError",
    // Không nhỏ hơn giá trị truyền vào
    MinNumberError: "MinNumberError",
    // Không lớn hơn giá trị truyền vào
    MaxNumberError: "MaxNUmberError",
};
