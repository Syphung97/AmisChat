export class EmailParameter {
  /// <summary>
  /// Tiêu đề email
  /// </summary>
  EmailSubject: string

  /// <summary>
  /// Nội dung email
  /// </summary>
  EmailContent:string

  /// <summary>
  /// Danh sách người nhận
  /// </summary>
  ToRecipients

  /// <summary>
  /// Danh sách người được Cc
  /// </summary>
  CcRecipients

  /// <summary>
  /// Danh sách người được Bcc
  /// </summary>
  BccRecipients

  /// <summary>
  /// Các tệp định kèm
  /// </summary>
  EmailAttachments

  /// <summary>
  /// Có lưu lại nhật ký gửi email không
  /// </summary>
  IsLogEmailSending

  References

  EmailParameter() {
    this.IsLogEmailSending = true;
  }
}
