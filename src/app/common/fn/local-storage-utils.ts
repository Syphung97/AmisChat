import { AppCode } from 'src/app/shared/appCode';

export class LocalStorageUtils {


    /**
     * Check support
     * @static
     * @returns {boolean} 
     * @memberof LocalStorageUtils
     * created by vhtruong - 12/06/2020
     */
    public static checkBrowserSupport(): boolean{
        if(typeof Storage === "undefined"){
            return false;
        }
        return true;
    }


    /**
     * lấy dữ liệu theo key
     * @static
     * @param {string} key 
     * @returns {*} 
     * @memberof LocalStorageUtils
     * created by vhtruong - 12/06/2020
     */
    public static get(key: string): any{
        if(this.checkBrowserSupport()){
            return localStorage.getItem(this.getKey(key));
        }
        return null;
    }


    /**
     * set dữ liệu
     * @static
     * @param {string} key 
     * @param {*} value 
     * @memberof LocalStorageUtils
     * created by vhtruong - 12/06/2020
     */
    public static set(key: string, value: any){
        if(this.checkBrowserSupport()){
            localStorage.setItem(this.getKey(key), value);
        }
    }

    /**
     * set dữ liệu
     * @static
     * @param {string} key 
     * @param {*} value 
     * @memberof LocalStorageUtils
     * created by dtnam1 - 12/09/2020
     */
    public static reset(key: string, value: any){
        this.remove(key);
        this.set(key, value);
    }


    /**
     * remove
     * @static
     * @param {string} key 
     * @memberof LocalStorageUtils
     * created by vhtruong - 12/06/2020
     */
    public static remove(key: string){
        if(this.checkBrowserSupport()){
            localStorage.removeItem(this.getKey(key));
        }
    }


    /**
     * 
     * @static
     * @memberof LocalStorageUtils
     * created by vhtruong - 12/06/2020
     */
    // public static clear(){
    //     if(this.checkBrowserSupport()){
    //         localStorage.clear();
    //     }
    // }


    /**
     * Lấy key theo app
     * @static
     * @param {string} key 
     * @returns 
     * @memberof LocalStorageUtils
     * created by vhtruong - 12/06/2020
     */
    public static getKey(key: string){
       if(key){
           return `AMIS_${AppCode}_${key}`;
       }
    }
}
