import { ContractPeriod } from '../enum/contract/contract-period.enum';


/**
 * Sinh ra ngày mới theo ngày cũ và enum thời hạn hợp đồng truyền vào
 * 
 * @export
 * @param {any} date 
 * @param {any} enumValue 
 * @returns 
 */
export function genEndDateWithEnumContractPeriod(date, enumValue) {
    if (date) {
        let data = new Date(date);
        switch (enumValue) {
            case ContractPeriod.OneMonth:
                return new Date(data.setMonth(data.getMonth() + 1));
                break;
            case ContractPeriod.TwoMonth:
                return new Date(data.setMonth(data.getMonth() + 2));
                break;
            case ContractPeriod.ThreeMonth:
                return new Date(data.setMonth(data.getMonth() + 3));
                break;
            case ContractPeriod.SixMonth:
                return new Date(data.setMonth(data.getMonth() + 6));
                break;
            case ContractPeriod.OneYear:
                return new Date(data.setMonth(data.getMonth() + 12));
                break;
            case ContractPeriod.ThreeYear:
                return new Date(data.setMonth(data.getMonth() + 36));
                break;
        }
    }
    return null;
}

/**
 * Sinh ra ngày mới theo ngày cũ và enum thời hạn hợp đồng truyền vào
 * 
 * @export
 * @param {any} date 
 * @param {any} enumValue 
 * @returns 
 */
export function genStartDateWithEnumContractPeriod(date, enumValue) {
    if (date) {
        let data = new Date(date);
        switch (enumValue) {
            case ContractPeriod.OneMonth:
                return new Date(data.setMonth(data.getMonth() - 1));
                break;
            case ContractPeriod.TwoMonth:
                return new Date(data.setMonth(data.getMonth() - 2));
                break;
            case ContractPeriod.ThreeMonth:
                return new Date(data.setMonth(data.getMonth() - 3));
                break;
            case ContractPeriod.SixMonth:
                return new Date(data.setMonth(data.getMonth() - 6));
                break;
            case ContractPeriod.OneYear:
                return new Date(data.setMonth(data.getMonth() - 12));
                break;
            case ContractPeriod.ThreeYear:
                return new Date(data.setMonth(data.getMonth() - 36));
                break;
        }
    }
    return null;
}