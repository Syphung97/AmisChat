import { Pipe, PipeTransform } from '@angular/core';

// Pipe bỏ * nếu caption có *
//Created By PVTHONG 08/07/2020
@Pipe({
    name: 'cutCaptionRequire'
})
export class CutCaptionRequirePipe implements PipeTransform {

    transform(name: string): any {
        //Cắt tên caption có *
        if (name) {
            let index = name.indexOf("*");
            if (index > 0) {
                return name.substring(0, index - 1);
            }
        }
        return name;

    }

}
