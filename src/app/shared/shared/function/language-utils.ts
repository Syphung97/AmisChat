import { LanguageLocale } from '../constant/language-locale/language-locale';

export class LanguageUtils {

    public static GetCurrentLocaleID() {
        const appLanguage = localStorage.getItem("app_language");
        const item = LanguageLocale.find(i => i.AppLanguage == appLanguage);
        let LocaleID = item ? item.LocaleID : "vi-VN";
        return LocaleID;
    }
}