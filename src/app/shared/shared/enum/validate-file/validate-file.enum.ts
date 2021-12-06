/**
 * Các trường hợp validate file
 * Created by dtnam1 12/06/2020
 */
export enum ValidateFileEnum {
    // Hợp lệ
    Valid = 1,
    // Đuôi file không hợp lệ
    ExtensionInvalid = 2,
    // Vượt quá dung lượng
    OverSize = 3,
    // Đã tồn tại
    Exsist = 4,
    // Quá số lượng file trong 1 lần tải lên
    OverNumber = 5
}
