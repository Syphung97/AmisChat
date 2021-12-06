import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Observable, of } from "rxjs";
import { tap, catchError } from "rxjs/operators";
import { KeyValue } from "src/common/models/common/key-value";
/**
 * Service xử lý đa ngôn ngữ cho ứng dụng
 *
 * @export
 * @class GolfTranslationService
 */
@Injectable({
    providedIn: "root"
})
export class AmisTranslationService {
    constructor(private translate: TranslateService) {
        this.initLanguage();
    }

    /**
     * Thiết lập ngôn ngữ ban đầu.
     *
     * @memberof TourTranslationService
     * CreatedBy: nthung 20/09/2018
     */
    initLanguage(): void {
        const lang = localStorage.getItem("app_language");

        this.translate.addLangs(["en", "vi"]);

        if (lang) {
            this.translate.setDefaultLang(lang);
            this.switchLanguage(lang);
        } else {
            this.translate.setDefaultLang("en");

            const browserLang = this.translate.getBrowserLang();
            this.switchLanguage(browserLang.match(/en|vi/) ? browserLang : "vi");
        }
    }

    /**
     * Thiết lập thay đổi ngôn ngữ.
     *
     * @param {string} lang ngôn ngữ sẽ sử dụng
     * @memberof TourTranslationService
     * CreatedBy: nthung 20/09/2018
     */
    switchLanguage(lang: string): void {
        this.translate.use(lang);
    }

    /**
     * Lấy danh sách các ngôn ngữ có sẵn
     *
     * @returns {any[]} danh sách các ngôn ngữ đang có sẵn
     * @memberof TourTranslationService
     * CreatedBy: nthung 20/09/2018
     */
    getLangs(): any[] {
        return this.translate.getLangs();
    }

    /**
     * Lấy về giá trị theo từ khóa
     *
     * @param {string} key từ khóa.
     * @returns {string} giá trị tương ứng với từ khóa.
     * @memberof TourTranslationService
     * CreatedBy: nthung 20/09/2018
     * ModifiedBy: PTĐạt 22.11.2019 thêm param để để truyền động
     */
    getValueByKey(key: string, params?: Object): string {
        if (key) {
            return this.translate.instant(key, params);
        }
        return "NULL";
    }

    /**
     * Lấy về danh sách giá trị theo danh sách từ khóa
     *
     * @param {string[]} keys danh sách từ khóa.
     * @returns {Observable} trả về giá trị
     * @memberof TourTranslationService
     * CreatedBy: PNANH 20/09/2018
     */
    getValueByKeys(keys: string[]): Observable<any> {
        return this.translate.get(keys).pipe(
            tap(data => {
                return data;
            }),
            catchError(error => of(error))
        );
    }

    /**
     * Xử lý language cho datasource
     * CreatedBy: PNANH
     * CreatedDate: 06/10/2018
     * @param {*} dataSource {ID: number, LANG_KEY: string}
     * @returns {KeyValue[]} {Key: any, Value: any}
     * @memberof ReservationComponent
     */
    setDataSourceByLanguage(dataSource: any): KeyValue[] {
        let result: KeyValue[] = [];

        if (!dataSource) {
            return result;
        }

        // Lay ra danh sach LANG_KEY
        let lstLangKey: string[] = [];
        for (let i = 0; i < dataSource.length; i++) {
            lstLangKey.push(dataSource[i].LANG_KEY);
        }

        if (lstLangKey.length > 0) {
            // Lay ra value language tuong ung tu danh sach LANG_KEY
            this.getValueByKeys(lstLangKey).subscribe(data => {
                if (data) {
                    let relLang: KeyValue[] = [];
                    for (
                        let i = 0;
                        i <
                        JSON.stringify(data)
                            .replace(/[{}"]/g, "")
                            .split(",").length;
                        i++
                    ) {
                        const element = JSON.stringify(data)
                            .replace(/[{}"]/g, "")
                            .split(",")[i];
                        let item = new KeyValue();
                        item.Key = element.split(":")[0];
                        item.Value = element.split(":")[1];
                        relLang.push(item);
                    }

                    // Tao ra datasource mới với language tương ứng nhận được
                    for (let i = 0; i < dataSource.length; i++) {
                        for (let j = 0; j < relLang.length; j++) {
                            if (dataSource[i].LANG_KEY == relLang[j].Key) {
                                let item = new KeyValue();
                                item.Key = dataSource[i].ID;
                                item.Value = relLang[j].Value;
                                result.push(item);
                                break;
                            }
                        }
                    }

                    return result;
                }
            });
        }

        return result;
    }
    /**
     * Lấy về text từ resource
     * @param key Tên Key cần lấy
     * Create by: dvthang:28.03.2018
     */
    transform(key, params?: any) {
        if (!key) {
            return "";
        }
        return this.translate.instant(key, params);
    }
}
