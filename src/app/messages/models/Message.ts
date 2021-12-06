export class Message {
  content: any;
  conversationId!: string;
  createdAt!: any;
  id!: string;
  localId!: string;
  sender!: string;
  sequence!: number;
  state!: number;
  type!: number;
  isLastMessage!: boolean;
  isFirstMessage!: boolean;
  isOnlyEmoji!: boolean;
  senderName!: string;
  isReplyMe!: boolean;
}
