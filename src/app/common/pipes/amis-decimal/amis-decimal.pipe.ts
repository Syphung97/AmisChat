import { Pipe, PipeTransform } from "@angular/core";
import {  DecimalPipe } from "@angular/common";

@Pipe({
  name: "AMISDecimal"
})
export class AMISDecimalPipe extends DecimalPipe implements PipeTransform {

  /**
   * Pipe number
   * Created by: PVTHONG 28-07-2020
   */
  transform(value: any, args?: any): any {
    if (value == null || value == "") {
      return "";
    }
    try {
      return super.transform(value, args);
    } catch (ex) {
      return value;
    }
  }

}
