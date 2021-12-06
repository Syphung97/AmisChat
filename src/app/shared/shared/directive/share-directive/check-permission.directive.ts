import { Directive, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { AmisTransferDataService } from 'src/common/services/amis-transfer-data.service';
import { AmisTranslationService } from 'src/common/services/amis-translation.service';
import { LocalStorageUtils } from 'src/common/fn/local-storage-utils';
import { LocalStorageKey } from '../../constant/local-storage-name/local-storage-name';
import { ConfigService } from 'src/common/services/app-config.service';


@Directive({
  selector: "[permissionCode]"
})
export class CheckPermissionDirective {

  /**
   * Tên quyền cần check
   * Nếu truyền nhiều quyền thì cách nhau bằng dấu ;
   * LCLIEM 5/12/2019
   */
  @Input()
  permissionCode: string;

  /**
   * Tên phân hệ cần check
   * LCLIEM 5/12/2019
   */
  @Input()
  subSystemCode: string;

  /**
   * có bỏ qua check quyền không
   * nmduy 24/08/2020
   */
  @Input()
  isIgnorePermission: boolean = false;

  /**
   * Trả ra sự kiện click sau khi check
   * LCLIEM 5/12/2019
   */
  @Output()
  passPermissionClick: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Sự kiện click
   * LCLIEM 5/12/2019
   * @param event
   */
  @HostListener("click", ['$event'])
  clickEvent(event) {
    if (ConfigService.settings?.isCheckPermission) {
      const isPermission = this.checkPermissionUser(event);
      if (isPermission) {
        this.passPermissionClick.emit(event);
      }
      else {
        this.showNotifyNotPermission();
      }
    } else {
      this.passPermissionClick.emit(event);
    }
  }

  constructor(
    private tranferSV: AmisTransferDataService,
    private amisTranslateSV: AmisTranslationService
  ) { }


  /**
   * Kiểm tra quyền user
   * @param {any} e 
   * @returns {boolean} 
   * @memberof CheckPermissionDirective
   */
  checkPermissionUser(e): boolean {
    // return true;
    const me = this;
    let permission = false;
    if (ConfigService.settings?.isCheckPermission && !this.isIgnorePermission) {
      let userPermissionStr = LocalStorageUtils.get(LocalStorageKey.Permission);
      if (userPermissionStr) {
        let userPermission = JSON.parse(userPermissionStr);
        if (me.permissionCode && me.subSystemCode) {
          // Tìm subsystem
          let tmpSubSystem = userPermission.find(e => e.SubSystemCode.toLowerCase() === me.subSystemCode.toLowerCase());
          if (tmpSubSystem) {
            // Tìm permissionCode
            let tmpPermission = me.permissionCode.split(";");
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
   * Hiển thị thông báo không có quyền
   * @memberof CheckPermissionDirective
   */
  showNotifyNotPermission() {
    const me = this;
    me.tranferSV.showWarningToast(me.amisTranslateSV.getValueByKey("VALIDATION_NOT_PERMISSION"));
  }
}
