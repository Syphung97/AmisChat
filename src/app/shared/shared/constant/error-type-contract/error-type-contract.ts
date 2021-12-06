export const ErrorTypeContract = {
    /// So sánh ngày thử việc không hợp lệ
    CompareHireDateInvalid : "CompareHireDateInvalid",
    /// So sánh ngày tiếp nhận chính thức không hợp lệ
    CompareReceiveDateInvalid : "CompareReceiveDateInvalid",
    /// Có hợp đồng cũ còn hiệu lực
    HasContractEffective : "HasContractEffective",
    /// Hợp đồng hết hiệu lực
    ContractExpired : "ContractExpired",
    /// Cập nhật hết hiệu lực các hợp đồng cũ
    UpdateExpireOtherContract : "UpdateExpireOtherContract",
    /// Cập nhật hết hiệu lực hợp đồng hiện tại
    UpdateExpireCurrentContract : "UpdateExpireCurrentContract",
    /// Không thực hiện gì với các lỗi cảnh báo
    NoActionWarrningCode : "NoActionWarrningCode",
    /// Ngày hiệu lực nhỏ hơn ngày có hiệu lực hợp đồng
    StartDateLessThanContractStartDate : "StartDateLessThanContractStartDate",
    /// Trùng ngày có hiệu lực
    DupplicateAppendixStartDate : "DupplicateAppendixStartDate",
    //Trùng số phụ lục
    DulicateData: "DulicateData",
}