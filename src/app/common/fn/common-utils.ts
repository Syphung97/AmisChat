import { environment } from "src/environments/environment";
import * as _ from "lodash";
import { AmisStringUtils } from "src/common/fn/string-utils";

export class AmisCommonUtils {

    /**
     * Kiểm tra có phải môi trường truyền vào hay không
     * created by vhtruong - 06/03/2020
     */
    public static CheckEnvironment(envir: string) {
        return environment.name === envir;
    }

    /**
     * Clone object
     * @param data : Object cần clone
     * Create by: PTĐạt 25.11.2019
     */
    public static cloneData(data: object) {
        return _.clone(data);
    }

    /**
     * Title: Clone deep object
     * Created by: PTĐạt 25.11.2019
     */
    public static cloneDeepData(data: object) {
        return _.cloneDeep(data);
    }

    /**
     * Check giá có phải là mảng hay không
     * @param value : Giá trị cần kiểm tra
     * Created by: PTĐạt 25.11.2019
     */
    public static IsArray(value: any) {
        return _.isArray(value);
    }

    /**
     * Check object có rỗng không
     * Created by: PTĐạt 05-11-2019
     */
    public static IsEmpty(obj: object) {
        return _.isEmpty(obj);
    }


    /**
     * Kiểm tra giá trị là kiểu số hay không
     * @param value : Giá trị cần kiểm tra
     * Created by: PTĐạt 05-11-2019
     */
    public static IsNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    /**
     * Xóa item trong mảng
     * @param data : Mảng chưa item
     * item: Item cần xóa
     * Created by: PTĐạt 05-11-2019
     */
    public static RemoveItem(data: any, item: any) {
        let index = data.indexOf(item);
        if (index > -1) {
            return data.splice(index, 1);
        }
        return data;
    }

    /**
     * Thực hiện filter 1 mảng
     * @param collection: Mảng
     * @param predicate : Điều kiện filter:Có thể là func, object, mảng, property
     * @param fromIndex : Vị trí bắt đầu tìm kiếm
     */
    public static Filter(collection: any, predicate: any, fromIndex: number = 0) {
        return _.filter(collection, predicate, fromIndex);
    }

    /**
     * Thực hiện tìm kiếm 1 phần tử trong mảng
     * @param collection: Mảng
     * @param predicate : Điều kiện filter: Có thể là func, object, mảng, property
     * @param fromIndex : Vị trí bắt đầu tìm kiếm
     */
    public static Find(collection: any, predicate: any, fromIndex: number = 0) {
        return _.find(collection, predicate, fromIndex);
    }

    /**
     * Thực hiện tìm kiếm vị trí xuất hiện đầu tiên của phần tử trong mảng
     * @param collection: Mảng
     * @param predicate : Điều kiện filter: Có thể là func, object, mảng, property
     * @param fromIndex : Vị trí bắt đầu tìm kiếm
     */
    public static FindIndex(
        collection: any,
        predicate: any,
        fromIndex: number = 0
    ) {
        return _.findIndex(collection, predicate, fromIndex);
    }

    /**
     * Chuyển đối tượng sang kiểu string
     * @param data: Dữ liệu cần chuyển sang String
     */
    public static Encode(data) {
        return JSON.stringify(data);
    }

    /**
     * Convert chuỗi json sang dạng object
     * @param data: Dữ liệu cần chuyển sang String
     */
    public static Decode(data) {
        return JSON.parse(data);
    }

    /**
     * Title: Lọc phần tử trùng trong mảng
     */
    public static uniqueArray(array: any) {
        return _.uniq(array);
    }
    /**
     * hàm xóa một trường trong object
     *
     * @static
     * @param {*} obj
     * @param {any} key
     * @returns
     * @memberof AmisCommonUtils
     * vbcong 11/08/2020
     */
    public static omitKey(obj: any, key){
      return _.omit(obj, key);
    }

    /**
     * Title: Hàm xử lý mã hóa string dạng base64
     */
    public static Base64Encode(value: string) {
        if (AmisStringUtils.IsNullOrEmpty(value)) {
            return value;
        }
        if (Buffer) {
            return new Buffer(value, "utf8").toString("base64");
        }
        return btoa(value);
    }

    /**
     * Title: Hàm xử lý giải mã string dạng base64
     */
    public static Base64Decode(value: string) {
        if (AmisStringUtils.IsNullOrEmpty(value)) {
            return value;
        }
        if (Buffer) {
            return new Buffer(value, "base64").toString("utf8");
        }

        return atob(value);
    }

    /**
     * Title:Hàm trả về ngày cuối cùng của tháng
     * Created by: PTĐạt 25-11-2019
     */
    public static getLastDayOfMonth(month: number, year: number): number {
        switch (month) {
            case 1:
                if (year % 400 === 0 || (year % 4 == 0 && year % 100 !== 0)) {
                    return 29;
                } else {
                    return 28;
                }
            case 0:
            case 2:
            case 4:
            case 6:
            case 7:
            case 9:
            case 11:
                return 31;
            default:
                return 30;
        }
    }


    /**
     * Clone mảng
     * @static
     * @param {Array<any>} data
     * @returns
     * @memberof AmisCommonUtils
     */
    public static cloneDataArray(data: Array<any>) {
        let dataArr = [];
        if (data && data.length > 0) {
            data.forEach(function (item) {
                dataArr.push(_.clone(item));
            });
        }
        return dataArr;
    }

    /**
     * Trả về phần tử max của mảng
     * @static
     * @param {Array<any>} array
     * @param {any} [property]
     * @returns
     * @memberof AmisCommonUtils
     * DNCuong(25/03/2020)
     */
    public static getMax(array: Array<any>, property?) {
        if (property) {
            const arrayNumber = [];
            array.forEach(element => {
                if (element[property] && this.IsNumeric(element[property])) {
                    arrayNumber.push(element[property]);
                }
            });
            return Math.max(...arrayNumber);
        } else {
            return Math.max(...array);
        }
    }

    /**
     * Hàm so sánh obj dựa trên field name trả về cho hàm sort mảng obj
     * nmduy 21/07/2020
     */
    public static compare(key, order = "asc") {
        return function innerSort(objA, objB) {
            if (!objA.hasOwnProperty(key) || !objB.hasOwnProperty(key)) {
                return 0;
            }

            const valA = (typeof objA[key] === 'string') ? objA[key].toUpperCase() : objA[key];
            const valB = (typeof objB[key] === 'string') ? objB[key].toUpperCase() : objB[key];
            let comparison = 0;

            if (valA > valB) {
                comparison = 1;
            } else {
                comparison = -1;
            }

            return ((order === 'desc') ? (comparison * -1) : comparison);
        }

    }


    /**
     * parse json sang object và lấy theo key
     * nmduy 03/08/2020
     */
    public static getObjectFromJson() {

    }

    /**
   * Thực hiện trim tất cả các prop của object là string
   *
   * @param {any} object
   * @returns
   * @memberof AmisLayoutComponent
   * CREATEAD: PTSY 13/8/2020
   */
    public static trimProperties(object) {
        if (object) {
    
          Object.keys(object).map(k => {
            if (typeof object[k] == "string") {
              object[k] = object[k].trim()
            }
          });
          return object;
        }
      }

}
