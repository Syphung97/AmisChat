import { ConfigService } from 'src/common/services/app-config.service';
import { LocalStorageUtils } from 'src/common/fn/local-storage-utils';
import { LocalStorageKey } from '../constant/local-storage-name/local-storage-name';
import * as _ from "lodash";

export class HRMPermissionUtils {


    /**
     * Kiểm tra quyền user
     * @static
     * @param {any} subSystemCode 
     * @param {any} permissionCode 
     * @returns {boolean} 
     * @memberof HRMPermissionUtils
     */
    public static checkPermissionUser(
        subSystemCode,
        permissionCode
    ): boolean {
        // return true;
        const me = this;
        let permission = false;
        if (ConfigService.settings?.isCheckPermission) {
            let userPermissionStr = LocalStorageUtils.get(LocalStorageKey.Permission);
            if (userPermissionStr) {
                let userPermission = JSON.parse(userPermissionStr);
                if (permissionCode && subSystemCode) {
                    // Tìm subsystem
                    let tmpSubSystem = userPermission.find(e => e.SubSystemCode.toLowerCase() === subSystemCode.toLowerCase());
                    if (tmpSubSystem) {
                        // Tìm permissionCode
                        let tmpPermission = permissionCode.split(";");
                        let countTrue: number = 0;
                        if (tmpPermission.length > 0) {
                            tmpPermission.forEach(item => {
                                if (item) {
                                    let tmpPermission = tmpSubSystem.Permissions.find(e => e.toLowerCase() === item.toLowerCase());
                                    if (tmpPermission) {
                                        countTrue++;
                                    }
                                }
                            });
                        }
                        permission = (countTrue == tmpPermission.length) ? true : false;
                    }
                }
                else {
                    permission = false;
                }
            }
        } else {
            permission = true;
        }
        return permission;
    }


    /**
     * Kiểm tra quyền
     * @static
     * @param {any} subSystemCode 
     * @param {any} actionCode 
     * @param {any} permissionObject 
     * @returns {boolean} 
     * @memberof HRMPermissionUtils
     */
    public static checkPermissionUserInListPermission(
        subSystemCode,
        permissionList,
        actionCode,
        permissionObject,
        isInorgeSubSystem = false
    ): boolean {
        // return true;
        const me = this;
        let permission = false;
        if (ConfigService.settings?.isCheckPermission) {
            if (!isInorgeSubSystem) {
                if (!this.checkPermissionUser(subSystemCode, permissionList)) {
                    permission = false;
                    return permission;
                }
            }
            let userPermissionStr = LocalStorageUtils.get(LocalStorageKey.Permission);
            if (userPermissionStr) {
                let userPermission = JSON.parse(userPermissionStr);
                if (actionCode) {
                    if (permissionObject) {
                        if (permissionObject.hasOwnProperty(actionCode)) {
                            let listPermission = permissionObject[actionCode];
                            let countPermision: number = 0;
                            if (listPermission?.length) {
                                listPermission.forEach(element => {
                                    // Tìm subsystem
                                    let tmpSubSystem = userPermission.find(e => e.SubSystemCode.toLowerCase() === element.SubSystemCode?.toLowerCase());
                                    if (tmpSubSystem) {
                                        // Tìm permissionCode
                                        let tmpPermission = element.PermissionCode?.split(";");
                                        let countTrue: number = 0;
                                        if (tmpPermission.length > 0) {
                                            tmpPermission.forEach(item => {
                                                if (item) {
                                                    let tmpPermission = tmpSubSystem.Permissions.find(e => e.toLowerCase() === item.toLowerCase());
                                                    if (tmpPermission) {
                                                        countTrue++;
                                                    }
                                                }
                                            });
                                        }
                                        if (countTrue == tmpPermission.length) {
                                            countPermision++;
                                        }
                                    }
                                });
                            }
                            if (countPermision == listPermission.length) {
                                permission = true;
                                return permission;
                            }
                        }
                    } else {
                        permission = true;
                    }
                }
                else {
                    permission = false;
                }
            }
        } else {
            permission = true;
        }
        return permission;
    }


    /**
     * Check quyền vào một list subsystemcode
     * @param {any} listSubSystemCode 
     * @returns {boolean} 
     * @memberof HRMPermissionUtils
     */
    public static checkUserListPermission(listSubSystemCode): boolean {
        let permission = false;
        let tmpListSubSystem = listSubSystemCode.split(";");
        tmpListSubSystem = tmpListSubSystem.map(x => x.toLowerCase());
        // Tìm subsystem
        if (LocalStorageUtils.get(LocalStorageKey.Permission)) {
            let userPermission = JSON.parse(LocalStorageUtils.get(LocalStorageKey.Permission));
            if (userPermission) {
                let tmpSubSystem = userPermission.find(e => _.includes(tmpListSubSystem, e.SubSystemCode.toLowerCase()));
                permission = (tmpSubSystem) ? true : false;
            }
        }

        return permission;
    }
}