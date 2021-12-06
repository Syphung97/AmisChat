import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild
} from '@angular/core';
import { ButtonType } from '../../enum/common/button-type.enum';
import { ButtonColor } from '../../enum/common/button-color.enum';
import { UserRoleService } from 'src/app/services/user-role/user-role.service';
import { DxTreeViewComponent } from 'devextreme-angular';
import { OrganizationUnitService } from 'src/app/services/organizaion-unit/organization-unit.service';
import { AppCode } from '../../appCode';
import { UserRoles } from 'src/common/models/user-role/user-role';
import { TypeShowControl } from 'src/common/models/base/typeShow';
import { AmisCommonUtils } from 'src/common/fn/common-utils';
import { GroupConfigUtils } from '../../function/group-control-utils';
import { GroupType } from '../../enum/group-config/group-type.enum';
import { ColumnGroup } from '../../enum/group-config/column-group.enum';
import { AmisTranslationService } from 'src/common/services/amis-translation.service';
import { AmisTransferDataService } from 'src/common/services/amis-transfer-data.service';
import { BaseComponent } from 'src/common/components/base-component';

@Component({
  selector: 'amis-popup-edit-user',
  templateUrl: './popup-edit-user.component.html',
  styleUrls: ['./popup-edit-user.component.scss']
})
export class PopupEditUserComponent extends BaseComponent implements OnInit {
  @Input()
  visiblePopup = false;

  // title pop
  @Input()
  title = this.translateSV.getValueByKey('GROUP_USER_POPUP_EDIT_TITLE');

  @Input()
  user;

  // Output hủy
  @Output()
  outputCancel: EventEmitter<any> = new EventEmitter<any>();

  // Lưu thành công 
  @Output()
  saveSuccess: EventEmitter<any> = new EventEmitter<any>();

  @Input()
  appSercurityType: number;

  // Cây phòng ban
  @ViewChild(DxTreeViewComponent, { static: false })
  treeview;

  isAppDefaultRole = false;

  buttonType = ButtonType;
  buttonColor = ButtonColor;
  isRoleEmpty = false;

  // Danh sách vai trò trong app
  roleList = [];

  roleID: string;

  roleObject: any;

  // Danh sách phòng ban
  listOrganizationAll = [];

  listItemIDs = [];

  // Kiểm tra để trống phòng ban hay không
  isDepartmentEmpty = false;

  organizationID: string;


  labelClass = 'col-4 p-0 mr-2';

  // submit thông tin
  isSubmit = false;

  // type control
  typeShow = new TypeShowControl();


  listGroupConfigs = [];
  fieldListConfig = [];

  isGetListRoleSuccess = false;
  isGetListOUSuccess = false;

  OUString;
  currentItem: any;

  listUserOUID: string;
  listUserOUName: string;
  userRoleName: string = '';
  userRoleID: string = '';


  constructor(
    private translateSV: AmisTranslationService,
    private userRoleService: UserRoleService,
    private organizationUnitService: OrganizationUnitService,
    private amisTranferData: AmisTransferDataService,
  ) { super(); }

  ngOnInit(): void {
    this.getAllOrganizationUnit();
    this.getRoleByAppCode();
    this.title += (this.user.FullName ? (' - ' + this.user.FullName) : '');

    // Cấu hình danh sách tên phòng ban
    let listOrganization;
    if (this.user.OrganizationUnitName) {
      listOrganization = this.user.OrganizationUnitName.split(',');
    }
    let listOrganizationString = '';
    listOrganization.forEach(e => {
      listOrganizationString += (e + ';');
    });
    listOrganizationString = listOrganizationString.substring(0, listOrganizationString.length - 1);
    this.listUserOUName = listOrganizationString;

    // Cấu hình danh sách ID phòng ban
    let listOrganizationID;
    if (this.user.OrganizationUnitID) {
      listOrganizationID = this.user.OrganizationUnitID.split(',');
    }
    let listOrganizationIDString = '';
    listOrganizationID.forEach(e => {
      listOrganizationIDString += (e + ';');
    });
    listOrganizationIDString = listOrganizationIDString.substring(0, listOrganizationIDString.length - 1);
    this.listUserOUID = listOrganizationIDString;

    // Cấu hình danh sách vai trò
    let listRoleID;
    if (this.user.RoleID) {
      listRoleID = this.user.RoleID.split(',');
    }
    listRoleID.forEach(element => {
      this.userRoleID += element;
    });

    let listRoleName;
    if (this.user.RoleName) {
      listRoleName = this.user.RoleName.split(',');
    }
    listRoleName.forEach(element => {
      this.userRoleName += element;
    });

    this.getAppRolesByUserID();
  }

  setView() {
    this.typeShow.IsViewOnly = false;
    this.typeShow.IsEditable = false;
  }

  /**
   * Xử lý đóng popup
   * Created by ltanh1 26/05/2020
   */
  cancel() {
    this.outputCancel.emit(true);
  }

  /**
   * đóng popup
   * Created by ltanh1 26/05/2020
   */
  closePopup() {
    this.cancel();
  }

  /**
   * Hàm validate trước khi lưu
   */
  beforeSave() {
    let valid = true;
    this.isRoleEmpty = this.roleID ? false : true;
    this.isDepartmentEmpty = this.listItemIDs.length > 0 ? false : true;
    if (this.isRoleEmpty || this.isDepartmentEmpty) {
      valid = false;
    }
    return valid;
  }

  /**
   * Lưu thông tin popup
   * Created by ltanh1 26/05/2020
   */
  save() {
    // if (this.beforeSave()) {
    this.isSubmit = AmisCommonUtils.cloneData({ IsSubmit: true });
  }

  /**
   * Sự kiện chọn giá trị vai trò
   * Created by ltanh1 30/05/2020
   */
  selectboxChangeValue(e) {
    this.isRoleEmpty = this.roleID ? false : true;
  }

  /**
   * Hàm lấy vai trò từ appcode
   * pqmai - 24/2/2020
   */
  getRoleByAppCode() {
    this.userRoleService.getListRolesByAppCode().subscribe(res => {
      if (res && res.Success) {
        this.roleList = res.Data;
        this.bindingDataToEditPopup();
      }
    });
  }

  /**
   * Xử lý chọn hoặc bỏ tag box
   * @param e
   * Created by ltanh1 30/05/2020
   */
  onSelectionTagBox(e) {
    const me = this;
    if (e && e.removedItems && e.removedItems.length > 0) {
      me.treeview.instance.unselectAll();
      this.listItemIDs.forEach(item => {
        me.treeview.instance.selectItem(item);
      });
    }
    if (this.listItemIDs.length > 0) {
      this.isDepartmentEmpty = false;
    }
  }

  /**
   * Xử lý sau khi chọn phòng ban
   * @param e
   * Created by ltanh1 30/05/2020
   */
  onPopupShown(e) {
    const dropdown = e.component.content();
    const element = e.component.$element()[0];
    // xóa đối tượng dữ liệu của tag box
    if (dropdown && dropdown.children && dropdown.children.length > 1) {
      dropdown.children[1].remove();
      dropdown.style.height = 'auto';

      let count = 0;
      const root = this.listOrganizationAll.find(
        item => item.ParentID === '00000000-0000-0000-0000-000000000000'
      );
      if (root) {
        for (let index = 0; index < this.listOrganizationAll.length; index++) {
          const item = this.listOrganizationAll[index];
          count = item.ParentID === root.OrganizationUnitID ? count + 1 : count;
        }
      }
      const heightDropDown = (count + 1) * 32;
      const posElement = element.getClientRects()[0];
      const posTop = posElement.top;
      const posBot = window.innerHeight - posTop - posElement.height;
      if (posBot > heightDropDown) {
        dropdown.parentNode.style.transform = 'translate(0px, 36px)';
      } else {
        dropdown.parentNode.style.transform = `translate(0px, -${heightDropDown +
          3}px)`;
      }
    }
  }

  /**
   * Hàm chọn phòng ban trên cây công ty
   * Created by ltanh1 30/05/2020
   */
  treeView_itemSelectionChanged(e) {
    const nodes = e.component.getNodes();
    this.listItemIDs = this.getSelectedItemsKeys(nodes);
    this.isDepartmentEmpty = false;
  }

  /**
   * Hàm lấy ra danh sách các item dc chọn
   * created by pqmai - 21/02/2020
   */
  getSelectedItemsKeys(items) {
    let result = [];
    const me = this;

    items.forEach(function (item) {
      if (item.selected) {
        result.push(item.key);
      }
      if (item.items.length > 0 && !item.selected) {
        result = result.concat(me.getSelectedItemsKeys(item.items));
      }
    });
    return result;
  }

  /**
   * Thiết lập data hiển thị cho cây cơ cấu tổ chức
   * pqmai - 21/02/2020
   */
  dataBoundTreeView(e) {
    const treeView = e.component;
    const dataSource = treeView.getDataSource();
    if (dataSource && dataSource.items().length > 0) {
      const listSouceOrg = dataSource.items();

      const root = listSouceOrg.filter(
        item => item.ParentID === '00000000-0000-0000-0000-000000000000'
      );
      if (root.length > 0) {
        treeView.expandItem(root);
      }
      // Lấy danh sách id tổ chức được chọn trên tab box
      const organizationUnitIDs = this.listItemIDs;
      if (organizationUnitIDs && organizationUnitIDs.length) {
        // khác rỗng thì for để chọn dừng id trên treeview
        organizationUnitIDs.forEach(id => {
          const itemSelectOrga = listSouceOrg.filter(function (et) {
            return et.OrganizationUnitID === id;
          });
          if (itemSelectOrga != null && itemSelectOrga.length > 0) {
            treeView.selectItem(itemSelectOrga);
          }
        });
      } else {
        // không có phòng ban nào đc chọn thì bỏ chọn tất cả
        treeView.unselectAll();
      }
    }
  }

  /**
   * Lấy danh sách tất cả cơ cấu tổ chức
   * created by pqmai - 21/02/2020
   */
  getAllOrganizationUnit() {
    this.organizationUnitService.GetAllOU().subscribe(res => {
      if (res && res.Success) {
        this.listOrganizationAll = res.Data;

        this.bindingDataToEditPopup();
        if (this.appSercurityType === 1) {
          const obj = this.listOrganizationAll.find(
            ou => (ou.MISACode = '/000/')
          );
          if (obj) {
            this.organizationID = obj.OrganizationUnitID;
          }
        }
      }
    });
  }

  /**
   * Lấy thông tin quyền theo userid người dùng
   * Created by ltanh1 02/06/2020
   */
  getAppRolesByUserID() {
    const userid = this.user.UserID;
    const appCodeString = AppCode;
    const param = { UserID: userid, AppCode: appCodeString };
    this.userRoleService.getAppRolesByUserID(param).subscribe(res => {
      if (res && res.Data[0] && res.Data[0].ListOrganizationUnitIDs && res.Data[0].RoleID) {
        const listOrganization = res.Data[0].ListOrganizationUnitIDs.split(',');
        // const listOrganization = res.Data[0].ListOrganizationUnitIDs;
        let listOrganizationString = '';
        listOrganization.forEach(e => {
          listOrganizationString += (e + ';');
        });
        listOrganizationString = listOrganizationString.substring(0, listOrganizationString.length - 1);
        this.OUString = listOrganizationString;
        // // const listOrganization = res.Data[0].ListOrganizationUnitIDs;
        this.listItemIDs = listOrganization;
        this.roleID = res.Data[0].RoleID;
        this.bindingDataToEditPopup();
      }
    });
  }

  /**
   * Điền dữ liệu người dùng vào trong popup sửa người dùng
   * Created by ltanh1 09/06/2020
   */
  bindingDataToEditPopup() {
    this.setView();

    this.listGroupConfigs = [];
    this.listGroupConfigs.push(
      {
        ColumnGroup: ColumnGroup.OneCol,
        GroupType: GroupType.Field,
        IsVisible: true,
        IsExpand: true,
        IsViewWhenAdd: true,
        GroupFieldConfigs: [
          {
            Caption: this.translateSV.getValueByKey("SETTING_USER_MANAGEMENT_GRID_ROLE"),
            RowIndex: 1,
            ColumnIndex: 1,
            DataType: 8,
            DisplayField: 'RoleName',
            DisplayFieldSource: 'RoleName',
            FieldName: 'RoleID',
            FieldNameSource: 'RoleID',
            IsRemoteServer: true,
            Controller: 'UserRole',
            Url: 'Role',
            IsGetMethod: true,
            IsRequire: true,
            IsUse: true,
            IsVisible: true,
            TypeControl: 3,
            Value: this.userRoleID,
            ValueText: this.userRoleName,
          },
          {
            Caption: this.translateSV.getValueByKey("SETTING_USER_MANAGEMENT_GRID_ACCESS_CONTROL"),
            RowIndex: 2,
            ColumnIndex: 1,
            DataType: 8,
            DisplayField: 'OrganizationUnitName',
            DisplayFieldSource: 'OrganizationUnitName',
            FieldName: 'OrganizationUnitID',
            FieldNameSource: 'OrganizationUnitID',
            IsRemoteServer: true,
            Controller: 'OrganizationUnit',
            Url: 'GetAllOU',
            IsGetMethod: true,
            IsRequire: true,
            IsUse: true,
            IsVisible: true,
            TypeControl: 24,
            Value: this.listUserOUID,
            ValueText: this.listUserOUName,
            CustomConfig: '{"MaxWidthPop": "378px"}'
          },
        ]
      }
    );
    this.fieldListConfig = AmisCommonUtils.cloneDataArray(GroupConfigUtils.GetData(this.listGroupConfigs));
  }

  /**
   * Bắn kết quả sau khi submit form
   * nmduy 20/05/2020
   * @param event
   */
  afterValidated(event) {
    if (event?.length) {
      console.log(event);
      console.log("co loi xay ra");
      return;
    }

    const appCodeString = AppCode;
    const param = {
      UserID: this.user.UserID,
      AppCode: appCodeString,
      ListUserRoles: []
    };
    this.fieldListConfig[0].GroupFieldConfigs.forEach(element => {
      if (element.FieldName === 'RoleID') {
        this.roleID = element.Value;
      }
      if (element.FieldName === 'OrganizationUnitID') {
        let listOUTmp = element.Value.split(';');
        this.listItemIDs = [];
        listOUTmp.forEach(e => {

          this.listItemIDs.push(e);
        });
      }
    });
    this.listItemIDs.forEach(element => {
      const userRole = new UserRoles();
      userRole.AppCode = appCodeString;
      userRole.RoleID = this.roleID;
      userRole.UserID = this.user.UserID;
      userRole.RoleName = this.roleList.filter(
        e => e.RoleID === this.roleID
      )[0].RoleName;
      userRole.OrganizationUnitID = element;
      param.ListUserRoles.push(userRole);
    });

    this.userRoleService
      .updateUserRolesInAppByUserID(param)
      .subscribe(res => {
        if (res && res.Success) {
          this.saveSuccess.emit();
          this.amisTranferData.showSuccessToast(this.translateSV.getValueByKey('TOAST_UPDATE_USER_SUCCESS'));
        }
      });
  }
}
