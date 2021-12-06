import { Pipe, PipeTransform } from "@angular/core";
import { CurrencyPipe } from "@angular/common";

@Pipe({
    name: "AMISCurrency"
})
export class AMISCurrencyPipe extends CurrencyPipe implements PipeTransform {


    /**
     * Pipe tiền tệ
     * @param {*} value 
     * @param {string} [currencyCode='VND'] 
     * @param {string} [display='symbol'] 
     * @param {string} [digitsInfo='1.0-0'] 
     * @returns {*} 
     * @memberof AMISCurrencyPipe
     * created by vhtruong - 26/05/2020
     */
    transform(value: any, currencyCode: string = 'VND', display: string = 'symbol', digitsInfo: string = '1.0-0', locale: string = 'vi-VN'): any {
        if (value == null || value == "") {
            return "";
        }
        try {
            return super.transform(value, currencyCode, display, digitsInfo, locale);
        } catch (ex) {
            return value;
        }

    }

}
