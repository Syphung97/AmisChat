import { Pipe, PipeTransform } from '@angular/core';
import { AmisStringUtils } from 'src/common/fn/string-utils';

// Pipe lấy ra chữ cái đầu của tên
@Pipe({
  name: 'shortName'
})
export class AmisShortNamePipe implements PipeTransform {

  transform(name: string): any {
    // Cắt tên thành mảng
    if (name) {
      name = name.trim();
      name = name.replace("<b style='color: #2680eb'>", "");
      const array = name.split(' ');
      return AmisStringUtils.convertVNtoENToLower(array[array.length - 1][0]).toUpperCase();

    } else {
      return "";
    }

  }

}
