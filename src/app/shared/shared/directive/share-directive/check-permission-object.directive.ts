import {
  Directive,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ElementRef
} from "@angular/core";
import { AmisTransferDataService } from 'src/common/services/amis-transfer-data.service';
import { AmisTranslationService } from 'src/common/services/amis-translation.service';
import { AmisConverterUtils } from 'src/common/fn/converter-utils';
import { ConfigService } from 'src/common/services/app-config.service';
import { HRMPermissionUtils } from '../../function/permission-utils';
import { AmisStringUtils } from 'src/common/fn/string-utils';

@Directive({
  selector: "[permissionObject]"
})
export class CheckPermissionObjectDirective implements OnInit {

  @Input()
  actionCode: string;

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
   * Tên phân hệ cần check
   */
  @Input()
  permissionCodeList: string;


  @Input()
  isInorgeSubSuystem: boolean = false;

  /**
   * bỏ qua check quyền 
   * nmduy 28/09/2020
   */
  _isInorgePermission: boolean = false;
  @Input() set isInorgePermission(val) {
    this._isInorgePermission = val;
  }

  /**
   * Tên class ẩn đi
   */
  @Input()
  cls: string = "hide";


  /**
   * Tên quyền cần check
   * Nếu truyền nhiều quyền thì cách nhau bằng dấu ;
   */
  _permissionObject: any;
  @Input()
  get permissionObject(): boolean {
    return this._permissionObject;
  }
  set permissionObject(data) {
    this._permissionObject = data;
    if (ConfigService.settings?.isCheckPermission && !this._isInorgePermission) {
      const isPermission = this.checkPermissionUser();
      this.showHideItemPermission(isPermission);
    } else {
      this.showHideItemPermission(true);
    }
  }


  constructor(
    private tranferSV: AmisTransferDataService,
    private amisTranslateSV: AmisTranslationService,
    private elementRef: ElementRef
  ) { }

  ngOnInit() {
  }



  /**
   * Check quyền 
   * @returns {boolean} 
   * @memberof CheckPermissionObjectDirective
   */
  checkPermissionUser(): boolean {
    const me = this;
    let permission = !AmisStringUtils.IsNullOrEmpty(me._permissionObject) ? JSON.parse(me._permissionObject) : null;
    return HRMPermissionUtils.checkPermissionUserInListPermission(me.subSystemCode, me.permissionCodeList, me.actionCode, permission, AmisConverterUtils.BooleanConverter(me.isInorgeSubSuystem));
  }


  /**
   * Ẩn hiện
   * @param {any} isPermission 
   * @memberof CheckPermissionObjectDirective
   */
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


  /**
   * 
   * @memberof CheckPermissionObjectDirective
   */
  showNotifyNotPermission() {
    const me = this;
    me.tranferSV.showWarningToast(me.amisTranslateSV.getValueByKey("VALIDATION_NOT_PERMISSION"));
  }
}
