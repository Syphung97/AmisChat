import { BaseModel } from 'src/app/core/models/BaseModel';

export class Participant extends BaseModel {
  ConversationID!: string;

  ConversationName!: string;

  StringeeUserID!: string;
}
