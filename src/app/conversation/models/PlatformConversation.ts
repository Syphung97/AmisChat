import { BaseModel } from "src/app/core/models/BaseModel";

export class PlatformConversation  extends BaseModel{
  ConversationID!: string;
  ConversationName!: string;
  AvatarUrl!: string;
  IsGroup!: boolean;
  Creator!: string;
  Participants!: string;
  Admins!: string;
  ListParticipant!: Array<any>;
}
