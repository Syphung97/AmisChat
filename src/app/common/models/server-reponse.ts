/**
 * Model Response trả về từ server
 * Created by: PTĐạt 06-03-2020
 */
export class ServerResponse {
  ValidateInfo: any;
  Success: boolean;
  Code: string;
  SubCode: number;
  UserMessage: string;
  SystemMessage: string;
  Data: any;
  ServerTime?: Date;
}
