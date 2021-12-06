
export class ServiceResponse {
  ValidateInfo: any;
  Success!: boolean;
  Code!: string;
  SubCode!: number;
  UserMessage!: string;
  SystemMessage!: string;
  Data: any;
  ServerTime?: Date;
}
