import { Pipe, PipeTransform } from "@angular/core";
import { DatePipe } from "@angular/common";
import { AmisEnvirorment } from "src/common/constant/amis-envirorment";

@Pipe({
  name: "AMISDate"
})
export class AMISDatePipe extends DatePipe implements PipeTransform {

  /**
   * Pipe dạng ngày/tháng/năm
   * Created by: PTĐạt 06-03-2020
   */
  transform(value: any, args?: any, timezones?: any, locale = "vi-VN"): any {
    if (args == null) {
      args = AmisEnvirorment.DATE_FMT;
    }
    if (value == null || value == "") {
      return "";
    }
    try {
      return super.transform(value, args, timezones, locale);
    } catch (ex) {
      return value;
    }
  }

}
