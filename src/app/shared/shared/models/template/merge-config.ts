export class MergeConfig {
  /// <summary>
        /// ID của mẫu trộn
        /// </summary>
        public  TemplateIDs :string

        /// <summary>
        /// Danh sách ID các dữ liệu cần trộn
        /// </summary>
        public  IDs :string

        /// <summary>
        /// Định dạng lưu file
        /// </summary>
        public  FileType :string

        /// <summary>
        /// Có trộn riêng mỗi bản ghi ra 1 file không
        /// </summary>
        public  IsSeparate: boolean
        /// <summary>
        /// Tên file zip trả về client
        /// </summary>
        public  ZipName: string
}
