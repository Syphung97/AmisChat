import { OnDestroy, OnInit } from "@angular/core";
import { Subject, Subscription, Observable } from "rxjs";
import { FormMode } from '../enum/form-mode.enum';
import { ButtonType } from 'src/app/shared/enum/common/button-type.enum';
import { ButtonColor } from 'src/app/shared/enum/common/button-color.enum';
import { DataType } from '../models/export/data-type.enum';
import { ContextMenu } from 'src/app/shared/enum/context-menu/context-menu.enum';
import { UserOptionService } from 'src/app/services/user-option/user-option.service';
import { IUsers } from 'src/app/shared/models/user/user';
import { SubSystemCode } from 'src/app/shared/constant/sub-system-code/sub-system-code';
import { AmisCommonUtils } from '../fn/common-utils';
import { SessionStorageUtils } from '../fn/session-storage-utils';
import { SessionStorageKey } from 'src/app/shared/constant/session-storage-key/session-storage-key';
import { GroupConfigService } from 'src/app/services/group-config/group-config.service';
import { takeUntil } from 'rxjs/operators';
import { ServerResponse } from 'http';
import { SaveDataType } from '../enum/action-save.enum';
import { PermissionCode } from 'src/app/shared/constant/permission-code/permission-code';

export class BaseComponent implements OnDestroy, OnInit {
  /**
   * Title: Biến dùng để khử observable
   * Created by: PTĐạt 21-11-2019
   */
  public _onDestroySub: Subject<void> = new Subject<void>();

  /**
   * DNCuong
   * @type {Subscription[]}
   * @memberof BaseComponent
   */
  public unSubscribles: Subscription[] = [];

  public formModeEntity = FormMode;

  public actionSaveDataEntity = SaveDataType;

  public subSystemCodeEntity = SubSystemCode;

  public permissionCodeEntity = PermissionCode;

  // Thông tin user hiện tại
  public currentUserInfo: IUsers = UserOptionService.userInfor;

  // Type button
  buttonType = ButtonType;

  // Màu sắc button
  buttonColor = ButtonColor;

  dataType = DataType;

  gridConfigCached = [];



  constructor(
    public groupConfigSV?: GroupConfigService
  ) { }

  /**
   * Title: Hàm hủy
   * Created by: PTĐạt 21-11-2019
   */
  ngOnDestroy(): void {
    this._onDestroySub.next();
    this._onDestroySub.complete();
    this._onDestroySub.unsubscribe();

    // DNCuong(Thêm hàm unsub thủ công do takeUtil k dùng được)
    if (this.unSubscribles) {
      this.unSubscribles.forEach(unsub => {
        unsub.unsubscribe();
        unsub.closed = true;
        unsub.remove(unsub);
      });
    }
  }

  /**
   * Title: Hàm khởi tạo
   * Created by: PTĐạt 21-11-2019
   */
  ngOnInit() {
  }

  /**
   * Hàm chung Lấy danh sách cột. Cached vào session storage
   * Created by: dthieu 02-07-2020
   */
  getListColumFromGroupConfig(layoutGridType): Observable<any> {
    const simpleObservable = new Observable((observer) => {

      let objectReturn = {};

      this.gridConfigCached = this.getLayoutConfigFromSessionStorage(layoutGridType);
      if (this.gridConfigCached?.length) {

        const configColumn = this.getColumnConfigFromSessionStorage(layoutGridType);
        objectReturn = configColumn?.ColumnConfig;
        // observable execution
        observer.next(objectReturn);
        observer.complete();

      } else {
        this.groupConfigSV.getGridColumsConfig(layoutGridType).pipe(takeUntil(this._onDestroySub)).subscribe(res => {
          if (res && res.Success && res.Data) {

            objectReturn = res.Data;
            this.setConfigToSessionStorage(res.Data, layoutGridType);

            // observable execution
            observer.next(objectReturn);
            observer.complete();
          }
        }, error => { });
      }

    });

    return simpleObservable;
  }

  /**
   * set lại config vào sesionstorage
   * Created by: dtnam1 02-09-2020
   * @param data 
   * @param subsystem 
   */
  resetConfigToSessionStorage(data, subsystem){
    this.removeConfigFromSessionStorage(subsystem);
    this.setConfigToSessionStorage(data, subsystem);
  }

  /**
   * thiết lập config vào sesionstorage
   * Created by: dthieu 02-07-2020
   */
  setConfigToSessionStorage(data, subsystem) {
    const objectConfig: any = {};
    objectConfig.SubSystemCode = subsystem;
    objectConfig.ColumnConfig = data;
    const config = AmisCommonUtils.Decode(SessionStorageUtils.get(SessionStorageKey.GridColumnConfig));
    config.push(objectConfig);
    SessionStorageUtils.set(SessionStorageKey.GridColumnConfig, AmisCommonUtils.Encode(config));
  }

  /**
   * Lấy thông tin toàn bộ grid config
   * Created by: dthieu 02-07-2020
   */
  getLayoutConfigFromSessionStorage(subsystem) {
    let gridConfig = [];
    if (SessionStorageUtils.get(SessionStorageKey.GridColumnConfig)) {
      gridConfig = AmisCommonUtils.Decode(SessionStorageUtils.get(SessionStorageKey.GridColumnConfig));
    }
    const config = gridConfig.filter(item => item.SubSystemCode == subsystem);

    return config;
  }

  /**
   * Lấy danh sách các cột trong config của grid
   * Created by: dthieu 02-07-2020
   */
  getColumnConfigFromSessionStorage(subsystemCode) {
    let gridConfig = [];
    let existSubsytem: any = {};
    if (SessionStorageUtils.get(SessionStorageKey.GridColumnConfig)) {
      gridConfig = AmisCommonUtils.Decode(SessionStorageUtils.get(SessionStorageKey.GridColumnConfig));
    }

    if (gridConfig?.length) {
      existSubsytem = gridConfig.find(i => i.SubSystemCode == subsystemCode);
    }

    return existSubsytem;
  }

  /**
   * Kiểm tra trong storage có key lưu cached từng phân hệ chưa. Nếu có rồi thì remove đi thêm lại. Phục vụ cho việc tùy chỉnh cột
   * Created by: dthieu 02-07-2020
   */
  removeConfigFromSessionStorage(subsystem) {
    let gridConfig = [];
    if (SessionStorageUtils.get(SessionStorageKey.GridColumnConfig)) {
      gridConfig = AmisCommonUtils.Decode(SessionStorageUtils.get(SessionStorageKey.GridColumnConfig));
    }
    const config = gridConfig.findIndex(item => item.SubSystemCode == subsystem);

    if (config > -1) {
      gridConfig.splice(config, 1);
    }
    SessionStorageUtils.set(SessionStorageKey.GridColumnConfig, AmisCommonUtils.Encode(gridConfig));
  }

  /**
   * Set session storage cơ cấu tổ chức
   * Created by: dthieu 21-09-2020
   */
  setSesionStorageOrganizationUnit(data){
    SessionStorageUtils.set(SessionStorageKey.DataOrganizationUnit, AmisCommonUtils.Encode(data));
  }

  /**
   * Lấy thông tin cơ cấu tổ chức
   * Created by: dthieu 21-09-2020
   */
  getSesionStorageOrganizationUnit() {
    let orgs = [];
    if (SessionStorageUtils.get(SessionStorageKey.DataOrganizationUnit)) {
      orgs = AmisCommonUtils.Decode(SessionStorageUtils.get(SessionStorageKey.DataOrganizationUnit));
    }
    return orgs;
  }

}

