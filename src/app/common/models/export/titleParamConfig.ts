export class TitleParamConfig {
  ParamName: string; // Tiêu đề param
  ParamValue: string; // Giá trị param convert về text
  Row: number; // Param ở dòng thứ mấy trong các param
  Column: number; // Param ở cột thứ mấy trong các param
  Align?: any;
  Title?: any;
  constructor(
    ParamName: string,
    ParamValue: string,
    Row: number,
    Column: number,
    Align?: any,
    Title?: any
  ) {
    this.ParamName = ParamName;
    this.ParamValue = ParamValue;
    this.Row = Row;
    this.Column = Column;
    this.Title = Title;
    this.Align = Align;
  }
}

export class TitleParamConfigNew {
  ParamValue: string; // Giá trị param convert về text
  Row: number; // Param ở dòng thứ mấy trong các param
  Column: number; // Param ở cột thứ mấy trong các param
  Align?: any;
  Title?: any;
  constructor(
    Title: any,
    Row: number,
    Column: number,
    Align: any
  ) {
    this.Row = Row;
    this.Column = Column;
    this.Title = Title;
    this.Align = Align;
  }
}
