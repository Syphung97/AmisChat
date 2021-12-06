import {
  Directive,
  HostListener,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ElementRef
} from "@angular/core";
import { AmisTransferDataService } from 'src/common/services/amis-transfer-data.service';
import { AmisTranslationService } from 'src/common/services/amis-translation.service';
import { LocalStorageUtils } from 'src/common/fn/local-storage-utils';
import { LocalStorageKey } from '../../constant/local-storage-name/local-storage-name';
import { AmisConverterUtils } from 'src/common/fn/converter-utils';
import { ConfigService } from 'src/common/services/app-config.service';

@Directive({
  selector: "[hidePermission]"
})
export class HidePermissionDirective implements OnInit {

  /**
   * Tên quyền cần check
   * Nếu truyền nhiều quyền thì cách nhau bằng dấu ;
   */
  @Input()
  hidePermission: string;

  /**
   * Tên phân hệ cần check
   */
  @Input()
  subSystemCode: string;

  /**
   * Trả ra sự kiện click sau khi check
   */
  @Output()
  passPermissionClick: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Tên class ẩn đi
   */
  @Input()
  cls: string = "hide";

  /**
   * Sự kiện click
   * @param event
   */
  @HostListener("click", ["$event"])
  clickEvent(event) {
    if (ConfigService.settings?.isCheckPermission) {
      const isPermission = this.checkPermissionUser();
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

  _isIgnorePermission: boolean = false;
  @Input()
  get isIgnorePermission(): boolean {
    return this._isIgnorePermission;
  }
  set isIgnorePermission(_isIgnorePermission: boolean) {
    this._isIgnorePermission = AmisConverterUtils.BooleanConverter(_isIgnorePermission);
  }


  constructor(
    private tranferSV: AmisTransferDataService,
    private amisTranslateSV: AmisTranslationService,
    private elementRef: ElementRef
  ) { }

  ngOnInit() {
    const me = this;
    const isPermission = me.checkPermissionUser();
    me.showHideItemPermission(isPermission);
  }

  /**
   * Kiểm tra quyền trong storage
   * LCLIEM 6/12/2019
   * @param e
   */
  checkPermissionUser(): boolean {
    const me = this;
    (ConfigService.settings?.isCheckPermission)
    if (!me.isIgnorePermission && ConfigService.settings?.isCheckPermission) {
      let permission = false;
      let userPermissionStr = LocalStorageUtils.get(LocalStorageKey.Permission);
      if (userPermissionStr) {
        let userPermission = JSON.parse(userPermissionStr);
        if (me.hidePermission && me.subSystemCode) {
          // tìm subsytem
          let tmpSubSystem = userPermission.find(e => e.SubSystemCode.toLowerCase() === me.subSystemCode.toLowerCase());
          if (tmpSubSystem) {
            if (tmpSubSystem) {
              // Tìm permissionCode
              let tmpHidePermission = me.hidePermission.split(";");
              let countFalse: number = 0;
              if (tmpHidePermission.length > 0) {
                tmpHidePermission.forEach(item => {
                  if (item) {
                    let tmpPermission = tmpSubSystem.Permissions.find(e => e.toLowerCase() === item.toLowerCase());
                    if (!tmpPermission) {
                      countFalse++;
                    }
                  }
                });
              }
              // nếu tất cả đều ko có quyền thì = false
              permission = (countFalse == tmpHidePermission.length) ? false : true;
            }
          }
        }
      }
      return permission;
    }
    else {
      return true;
    }
  }

  showHideItemPermission(isPermission) {
    const me = this;
    let tmpElement = me.elementRef.nativeElement;
    // Nếu có quyền thì hiện
    if (isPermission) {
      if (tmpElement.className.includes("hide")) {
        tmpElement.className = tmpElement.className.replace("hide", "");
      }
    }
    // Ko có quyền thì ẩn
    else {
      if (!tmpElement.className.includes("hide")) {
        tmpElement.className = `${tmpElement} hide`;
      }
    }
  }

  showNotifyNotPermission() {
    const me = this;
    me.tranferSV.showWarningToast(me.amisTranslateSV.getValueByKey("VALIDATION_NOT_PERMISSION"));
  }
}
