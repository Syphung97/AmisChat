import { Input, Pipe, PipeTransform } from '@angular/core';
import { StorageConstant } from 'src/app/shared/constant/storage-constant';
import { CommonFn } from '../../functions/commonFn';
import { UserService } from '../../services/users/user.service';

@Pipe({
  name: 'nameConv'
})
export class NameConvPipe implements PipeTransform {
  constructor() {

  }

  transform(conv: any, ...args: unknown[]): any {
    try {
      const listUserString = CommonFn.getCacheStringeeUser();
      if (listUserString && listUserString != "") {
        const stringeeUsers = JSON.parse(listUserString);
        if (!conv?.isGroup) {
          const listParticipant = conv.participants;
          if (conv.creator == UserService.UserInfo.StringeeUserID) {
            const displayUser = listParticipant.find(d => d.userId != conv.creator);
            return stringeeUsers?.find(e => e.StringeeUserID == displayUser.userId)?.DisplayName;
          }
          // nếu ko trùng user đang đăng nhâp thì gán bằng người tạo
          else if (conv.creator != UserService.UserInfo.StringeeUserID) {
            const displayUser = listParticipant.find(d => d.userId == conv.creator);
            return stringeeUsers?.find(e => e.StringeeUserID == displayUser.userId)?.DisplayName;
          }

        }
        else {
          return conv.name;
        }
      }
      else {
        return "";
      }
    } catch (error) {
      return "";
    }
    finally {

    }

  }

}
