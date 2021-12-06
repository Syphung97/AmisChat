import { Injectable, Injector } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Observable, of } from "rxjs";
import { tap, catchError } from "rxjs/operators";



@Injectable({
  providedIn: 'root'
})
export class AmisTranslationService {

  constructor(
    protected translate: TranslateService
  ) {
    this.initLanguage();
  }


  /**
   * Khởi tạo ngôn ngữ
   * @memberof AmisTranslationService
   * CreatedBy: PTSY 2021/04/23
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
   * @memberof AmisTranslationService
   * CreatedBy: PTSY 2021/04/23
   */
  switchLanguage(lang: string): void {
    this.translate.use(lang);
  }

  /**
   * Lấy danh sách các ngôn ngữ có sẵn
   *
   * @returns {any[]} danh sách các ngôn ngữ đang có sẵn
   * @memberof AmisTranslationService
   * CreatedBy: PTSY 2021/04/23
   */
  getLangs(): any[] {
    return this.translate.getLangs();
  }

  /**
   * Lấy về danh sách giá trị theo danh sách từ khóa
   *
   * @param {string[]} key danh sách từ khóa.
   * @returns {Observable} trả về giá trị
   * @memberof AmisTranslationService
   * CreatedBy: PTSY 2021/04/23
   */
  getValueByKey(key: string, params?: object): Observable<any> {
    return this.translate.get(key, params).pipe(
      tap(data => {
        return data;
      }),
      catchError(error => of(error))
    );
  }

}
