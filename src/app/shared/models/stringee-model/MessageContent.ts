export class MessageContent {
  type!: number;

  convId!: string;

  message!: MessageData;
}

export class MessageData {
  content!: string;
  metadata!: object;
  sticker: any;
}
