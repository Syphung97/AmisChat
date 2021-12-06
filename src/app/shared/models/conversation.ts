export class ConversationItem {
  ID!: any;
  Avatar: any;
  Title!: string;
  LastMessage!: string;
  LastTimeActive!: Date;
  IsGroup!: boolean;
  IsActive!: boolean;
  IsReceiveNotify!: boolean;

  constructor(ID: any, Avatar: any, Title: string,
              LastMessage: string,
              LastTimeActive: Date,
              IsGroup: boolean,
              IsActive: boolean,
              IsReceiveNotify: boolean) {
    this.ID = ID;
    this.Avatar = Avatar;
    this.Title = Title;
    this.LastMessage = LastMessage;
    this.LastTimeActive = LastTimeActive;
    this.IsGroup = IsGroup;
    this.IsActive = IsActive;
    this.IsReceiveNotify = IsReceiveNotify;

  }
}
