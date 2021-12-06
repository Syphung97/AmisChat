export class StringeeUser {
    userID: any;
    name?: string;
    avatar: any;
    checked?: boolean;
    constructor(userID: any, name: string, avatar: any){
        this.userID = userID;
        this.name = name;
        this.avatar = avatar;
        this.checked = false;
    }
}
