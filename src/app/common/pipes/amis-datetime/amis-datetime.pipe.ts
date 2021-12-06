import { Pipe, PipeTransform } from "@angular/core";
import { DatePipe } from "@angular/common";
import { AmisEnvirorment } from "src/common/constant/amis-envirorment";

@Pipe({
  name: "AMISDatetime"
})
export class AMISDatetimePipe extends DatePipe implements PipeTransform {

  /**
   * Pipe ngày giờ
   * Created by: PTĐạt 06-03-2020
   */
  transform(value: any, args?: any): any {
    return super.transform(value, AmisEnvirorment.DATE_TIME_FMT);
  }

}
