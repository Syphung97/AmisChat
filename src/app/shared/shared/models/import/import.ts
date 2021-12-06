export class Import {
  //Số thứ tự
  Index: number;
  //Kết quả
  Result: string;
  //Giải thisch lỗi
  ErrorMessage: string;
  //Hợp lệ hay không
  Success: boolean;
  //Email có hợp lệ không
  IsInvalidEmail: boolean;
  //Số điện thoại có hợp lệ hay không
  IsInvalidMobile: boolean;
  //Ngày ứng tuyển có hợp lệ hay không
  IsInvalidApplyDate: boolean;
  //Ngày sinh có hợp lệ hay không
  IsInvalidBirthday: boolean;
  //Giới tính có hợp lệ hay không
  IsInvalidGender: boolean;
  //kiểu dữ liệu
  DataType: number;
  //type control
  TypeControl: number;
  //danh sách cột validate lỗi
  listFieldError: any
}
