import { StorageConstant } from 'src/app/shared/constant/storage-constant';

export const CommonFn = {
  logger: (error) => {
    console.log(error);
  },

  convertVNtoENToLower: (str: string) => {
    if (str) {
      str = str.replace(
        /à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ|À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ|A|Ă|Â/g,
        'a'
      );
      str = str.replace(
        /è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ|È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ|E|Ê/g,
        'e'
      );
      str = str.replace(/ì|í|ị|ỉ|ĩ|Ì|Í|Ị|Ỉ|Ĩ|I/g, 'i');
      str = str.replace(
        /ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ|Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ|O|Ô|Ơ/g,
        'o'
      );
      str = str.replace(
        /ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ|Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ|U|Ư/g,
        'u'
      );
      str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ|Ỳ|Ý|Ỵ|Ỷ|Ỹ|Y/g, 'y');
      str = str.replace(/đ|Đ|D/g, 'd');
      str = str.toLocaleLowerCase();
    }
    return str;
  },

  replaceBreakLine(data): any {
    data = data.replace(/(?:\r\n|\r|\n)/g, '<br>');
    return data;
  },

  replaceEmoIcon(data): any {
    if (data) {
      const map = {
        '&lt;3': '\u2764\uFE0F',
        '&lt;/3': '\uD83D\uDC94',
        ':D': '\uD83D\uDE00',
        ':)': '\uD83D\uDE03',
        ';)': '\uD83D\uDE09',
        ':(': '\uD83D\uDE12',
        ':p': '\uD83D\uDE1B',
        ';p': '\uD83D\uDE1C',
        ":'(": '\uD83D\uDE22',
        ":')": '\uD83D\uDE22',
      };
      // tslint:disable-next-line:typedef
      function escapeSpecialChars(regex) {
        return regex.replace(/([()[{*+.$^\\|?])/g, '\\$1');
      }

      // this.inputValue = this.composer.nativeElement.innerHTML;

      // tslint:disable-next-line:forin
      for (let i in map) {
        const regex = new RegExp(escapeSpecialChars(i), 'gim');
        data = data.replace(regex, map[i]);
      }

      return data;
    }
  },

  urlify(data): any {
    if (data) {
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      data = data.replace(urlRegex, (url) => {
        return '<a href="' + url + '" target="_blank">' + url + '</a>';
      });
      return data;
    }
  },
  encodeHTML(data): void {
    // let t = data.content.content;
    const txt = document.createElement('textarea');
    txt.innerHTML = data;
    data = txt.innerHTML;
  },

  getUserByStringeeID(stringeeUserID): any {
    try {
      const listUserString = CommonFn.getCacheStringeeUser();
      if (listUserString && listUserString != '') {
        const stringeeUsers = JSON.parse(listUserString);
        return stringeeUsers.find((x) => x.StringeeUserID == stringeeUserID);
      }
    } catch (error) { }
  },

  getCacheStringeeUser(isClear = false): any {
    const userData = sessionStorage.getItem(StorageConstant.StringeeUser);
    if (!userData) {
      return null;
    }
    const item = JSON.parse(userData);
    const now = new Date();
    const timeExpired = new Date(item.expired);
    // compare the expiry time of the item with the current time
    if (now.getTime() > timeExpired.getTime() && isClear) {
      // If the item is expired, delete the item from storage
      // and return null
      localStorage.removeItem(StorageConstant.StringeeUser);
      return null;
    }
    return JSON.stringify(item.value);
  },

  setCacheStringeeUser(stringeeUsers): void {
    const d1 = new Date();
    const d2 = new Date(d1);
    d2.setMinutes(d1.getMinutes() + 30);

    const item = {
      value: stringeeUsers.Data,
      expired: d2,
    };
    sessionStorage.setItem(StorageConstant.StringeeUser, JSON.stringify(item));
  },


  convertDateToString(date: Date): string {
    let res = "";
    if (date) {
      res = this.convertDayToString(date.getDate()) + "/" + this.convertMonthToString(date.getMonth()) + "/" + date.getFullYear()
    }
    return res;
  },

  convertMonthToString(month: number): string {
    let res = "";
    if (month <= 8) {
      res = "0" + (month + 1);
    }
    else {
      res = (month + 1).toString();
    }
    return res;
  },

  convertDayToString(day: number): string {
    let res = "";
    if (day <= 9) {
      res = "0" + day;
    }
    else {
      res = (day).toString();
    }
    return res;
  }
};
