export enum OperatorType {
    //Trongkhoảng,
    Between = 0,
    //Bằng,
    Equal = 1,
    //Lớnhơn,
    GreaterThan = 2,
    //Lớnhơnbằng,
    GreaterOrEqual = 3,
    //Nhỏhơn
    LessThan= 4,
    //Nhỏhơnbằng,
    LessOrEqual = 5,
    None = 6,
    //Ngoàikhoảng,
    NotBetween = 7,
    //Khôngbằng,
    NotEqual = 8,
    //chứa,
    Contains = 9,
    //Khôngchứa,
    NotContains = 10,
    //Trống,
    IsNullOrEmpty = 11,
    //Cógiátrị,
    HasValue = 12
}