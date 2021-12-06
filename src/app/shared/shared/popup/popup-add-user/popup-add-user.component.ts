import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { AmisCommonUtils } from 'src/common/fn/common-utils';
import { Params } from 'src/common/models/common/params';
import { UserService } from 'src/app/services/user/user.service';
import { AvatarPlatFormService } from 'src/app/services/user/avatar-platform.service';
import { LayoutGridType } from '../../constant/layout-grid-type/layout-grid-type';
import { GroupConfigService } from 'src/app/services/group-config/group-config.service';
import { AmisStringUtils } from 'src/common/fn/string-utils';
import { AmisDataService } from 'src/common/services/amis-data.service';
import { BaseComponent } from 'src/common/components/base-component';
import { ColumnDataType } from '../../enum/column-type.enum';
import { TypeControl } from '../../enum/common/type-control.enum';
import { AmisPagingGridComponent } from 'src/common/components/amis-grid/amis-paging-grid/amis-paging-grid.component';
import { UserRoleService } from 'src/app/services/user-role/user-role.service';
import { UserRoles } from 'src/common/models/user-role/user-role';
import { AppCode } from '../../appCode';
import { AmisTransferDataService } from 'src/common/services/amis-transfer-data.service';
import { AmisTranslationService } from 'src/common/services/amis-translation.service';
import { UserStatus } from '../../enum/users/user-status.enum';
import { TypeShowControl } from 'src/common/models/base/typeShow';
import { GroupConfigUtils } from '../../function/group-control-utils';
import { ColumnGroup } from '../../enum/group-config/column-group.enum';
import { GroupType } from '../../enum/group-config/group-type.enum';
import { FormMode } from 'src/common/enum/form-mode.enum';
import { ContextMenu } from '../../enum/context-menu/context-menu.enum';

declare var $: any;

@Component({
  selector: 'amis-popup-add-user',
  templateUrl: './popup-add-user.component.html',
  styleUrls: ['./popup-add-user.component.scss']
})
export class PopupAddUserComponent extends BaseComponent implements OnInit {
  // Biến lưu id grid
  @ViewChild('pagingGrid', { static: false })
  pagingGrid: AmisPagingGridComponent;


  // Ẩn hiện popup
  @Input()
  visiblePopup = false;

  // title pop
  @Input()
  title = "";

  // Output hủy
  @Output()
  outputCancel: EventEmitter<any> = new EventEmitter<any>();

  // Lưu thành công 
  @Output()
  saveSuccess: EventEmitter<any> = new EventEmitter<any>();

  // Thuộc màn hình thêm người dùng hay không
  isShowAddPopup = true;
  currentUser: any;
  timeSearch: any;
  fieldConfigs: any;

  isRoleEmpty = false;

  isLoadGrid = false;

  // Tổng số lượng data
  totalRecord = 0;

  gridHeight = '390px';

  gridHeightPopupPermission = '445px';

  popupHeight = 'auto';

  popupWidth = 1080;

  offsetY = '0 100px';

  heightContent = '550px';

  layoutGridType = LayoutGridType.User;
  // controller gọi lấy dữ liệu

  // mảng sử dụng
  dataSource = [];
  columns = [
    {
      FieldName: 'EmployeeCode',
      Width: 200,
      IsVisible: true,
      SortOrder: 1,
      Caption: this.translateSV.getValueByKey('POPUP_ADD_USER_EMPLOYEE_CODE')
    },
    {
      FieldName: 'FullName',
      Width: 250,
      IsVisible: true,
      SortOrder: 2,
      Caption: this.translateSV.getValueByKey('SETTING_USER_MANAGEMENT_GRID_FULL_NAME')
    },
    {
      FieldName: 'OUName',
      Width: 250,
      IsVisible: true,
      SortOrder: 3,
      Caption: this.translateSV.getValueByKey('POPUP_ADD_USER_ORGANIZATION_UNIT')
    },
    {
      FieldName: 'JobPositionName',
      Width: 250,
      IsVisible: true,
      SortOrder: 4,
      Caption: this.translateSV.getValueByKey('POPUP_ADD_USER_JOB_POSITION')
    },
    {
      FieldName: 'Email',
      Width: 250,
      IsVisible: true,
      SortOrder: 5,
      IsView: true,
      Caption: this.translateSV.getValueByKey('SETTING_USER_MANAGEMENT_GRID_EMAIL')
    },
    {
      FieldName: 'Mobile',
      Width: 250,
      IsVisible: true,
      SortOrder: 6,
      IsView: true,
      Caption: this.translateSV.getValueByKey('SETTING_USER_MANAGEMENT_GRID_PHONE')
    },
    {
      FieldName: 'StatusName',
      Width: 250,
      IsFlex: true,
      IsVisible: true,
      SortOrder: 7,
      IsView: true,
      Caption: this.translateSV.getValueByKey('SETTING_USER_MANAGEMENT_GRID_STATUS'),
      TypeControl: TypeControl.EnumType
    }
  ];

  listChooseRecord = [];
  // danh sách record đc chọn
  selectedData = [];
  // danh sách các trường dữ liệu dùng để tìm kiếm
  searchFields = ["FullName", "Email", "Mobile", "EmployeeCode", "JobPositionName", "OUName"];
  // dữ liệu đổ lên grid
  orgDataSource: any = [];

  // số lượng/trang
  currentPageSize = 50;

  // trang hiện tại đang đứng
  currentPageIndex = 1;

  // Giá trị tìm kiếm
  searchName = '';

  // Loại pick list
  pickListType = '';

  // có phải click phân trang k
  isClearSelect = false;

  listOption = [
    {
      Key: ContextMenu.Edit,
      Value: this.translateSV.getValueByKey('EDIT2'),
      Icon: 'icon-edit'
    },
    {
      Key: ContextMenu.Delete,
      Value: this.translateSV.getValueByKey('DELETE'),
      Icon: 'icon-delete-red'
    }
  ];

  listOptionPermission = [
    {
      Key: ContextMenu.Delete,
      Text: this.translateSV.getValueByKey('DELETE'),
      Icon: 'icon-remove-red'
    }
  ];


  isAppDefaultRole = false;

  listItemIDs = [];

  param: Params;

  organizationID: string;

  // Kiểm tra để trống phòng ban hay không
  isDepartmentEmpty = false;

  requestParams: Params;

  appSercurityType = 1;

  /**
   * Config combobox & tagbox chọn vai trò và phòng ban
   */
  listGroupConfigs = [];
  fieldListConfig = [];
  labelClass = 'col-5 p-0 mr-2';
  // submit thông tin
  isSubmit = false;
  // type control
  typeShow = new TypeShowControl();
  isSelectedAllPage = false;
  selectedAllData: any;
  height = 640;

  /**
   * Có phải đang lấy toàn bộ dữ liệu không
   */
  isCallAPIGetAll = false;
  isLoadDataEvent: boolean = false;

  constructor(
    private userService: UserService,
    private avatarPlatformSV: AvatarPlatFormService,
    public groupConfigSV: GroupConfigService,
    private amisTranferData: AmisTransferDataService,
    public httpBase: AmisDataService,
    private userRoleService: UserRoleService,
    private translateSV: AmisTranslationService
  ) { super(); }

  ngOnInit(): void {
    this.title = this.translateSV.getValueByKey("SETTING_USER_LIST_ADD_USER");
    this.resizeGrid();
    this.isLoadGrid = true;
    this.getUsersPaging();
    this.bindingDataToEditPopup();
  }

  /**
   * Sửa lại kích thước grid
   * nmduy 17/08/2020
   */

  resizeGrid() {
    if (window.innerHeight < 768) {
      this.offsetY = "0 50px"
      this.gridHeight = "250px";
      this.gridHeightPopupPermission = "250px";
    }
  }

  /**
   * đóng popup
   * Created by ltanh1 26/05/2020
   */
  closePopup() {
    this.outputCancel.emit(false);
  }

  /**
   * Lưu thông tin popup
   * Created by ltanh1 26/05/2020
   */
  save() {
    this.isShowAddPopup = false;
    this.isRoleEmpty = false;
    this.isDepartmentEmpty = false;
    this.title = this.translateSV.getValueByKey("SETTING_USER_MANAGEMENT_USER_ROLE");
  }

  /**
   * Bỏ chọn bản ghi
   * Created by ltanh1 26/05/2020
   */
  removeSelectedRecord() {
    this.selectedData = [];
  }

  /**
   * Hàm thực hiện chọn bản ghi
   * @param data
   * Created by ltanh1 26/05/2020
   */
  chooseRecord(data) {
    this.selectedData = AmisCommonUtils.cloneDataArray(this.pagingGrid._selectedItems);
  }

  /**
   * Hàm thực hiện lấy thông tin người dùng
   * Created by ltanh1 26/05/2020
   */
  getUsersPaging(e?) {
    let param: Params = new Params();
    if (!e) {
      param = this.handleParamFilter();
    } else {
      param.PageIndex = e.PageIndex;
      param.PageSize = e.PageSize;
      param.Filter = e.Filter;
      param.Sort = window.btoa(`[{"selector":"FullName","desc":"false"}]`);
      this.isClearSelect = true;
      this.isLoadDataEvent = true;
    }

    this.userService.getNonPermissionUser(param).subscribe(res => {
      if (res && res.Success && res.Data) {
        this.dataSource = res.Data.PageData;
        this.dataSource.forEach(element => {
          element.Avatar = this.avatarPlatformSV.getAvatarDefault(
            element.UserID
          );

          switch (element.Status) {
            case UserStatus.Active:
              element.ColorConfig = {};
              element.StatusName = this.translateSV.getValueByKey('USER_STATUS_ACTIVITY');
              element.ColorConfig['Icon'] = 'icon-dot active';
              element.ColorConfig['StatusName'] = 'active-status';
              break;

            case UserStatus.Waiting:
              element.ColorConfig = {};
              element.StatusName = this.translateSV.getValueByKey('USER_STATUS_WAIT_APPROVED');
              element.ColorConfig['Icon'] = 'icon-dot approved';
              element.ColorConfig['StatusName'] = 'approved-status';
              break;

            case UserStatus.NotActive:
              element.ColorConfig = {};
              element.StatusName = this.translateSV.getValueByKey('USER_STATUS_NOT_ACTIVE');
              element.ColorConfig['Icon'] = 'icon-dot not-active';
              element.ColorConfig['StatusName'] = 'not-active-status';
              break;

            case UserStatus.Inactive:
              element.ColorConfig = {};
              element.StatusName = this.translateSV.getValueByKey('USER_STATUS_INACTIVE');
              element.ColorConfig['Icon'] = 'icon-dot inactive';
              element.ColorConfig['StatusName'] = 'inactive-status';
              break;

            case UserStatus.IsDeleted:
              element.ColorConfig = {};
              element.StatusName = this.translateSV.getValueByKey('USER_STATUS_IS_DELETED');
              element.ColorConfig['Icon'] = 'icon-dot delete';
              element.ColorConfig['StatusName'] = 'delete-status';
              break;

          }
        });
        this.totalRecord = res.Data.Total;
      }
      this.selectedData = AmisCommonUtils.cloneDataArray(this.selectedData);
    });
  }

  /**
   * Hàm thực hiện cấu hình param
   * Created by ltanh1 26/05/2020
   */
  getParamForPaging() {
    const param: Params = new Params();
    param.PageIndex = this.currentPageIndex;
    param.PageSize = this.currentPageSize;
    param.Filter = '';
    param.Sort = window.btoa(`[{"selector":"FullName","desc":"false"}]`);;
    return param;
  }


  /**
   * Hàm bắt sự kiện thay đổi ô input lọc
   * Created by ltanh1 29/05/2020
   */
  changeTextBoxValue(e) {
    this.isClearSelect = true;
    if (e && e.event && e.event.type === 'dxclick') {
      // this.requestParams.PageIndex = 1;
      this.getUsersPaging(this.requestParams);
      this.isClearSelect = true;
    }
  }

  /**
   * Hàm bắt sự kiện keyup ô input
   * @param e biến output giá trị
   * Created by ltanh1 29/05/2020
   */
  onKeyupSearchBox(e) {
    this.isClearSelect = true;
    clearTimeout(this.timeSearch);
    this.timeSearch = setTimeout(() => {
      let inputVal = $(e.element).find('input').val();
      if (inputVal) {
        inputVal = inputVal.trim();
      }
      if (inputVal !== this.searchName) {
        this.searchName = inputVal;
        // this.requestParams.PageIndex = 1;
        this.getUsersPaging(this.requestParams);
      }
    }, 500);
  }

  /**
   * Hàm xử lý lọc dữ liệu
   * Created by ltanh1 28/05/2020
   */
  handleParamFilter() {
    let requestParams: Params = this.getParamForPaging();
    requestParams.Filter = '';
    if (this.searchName && this.searchName.trim()) {
      const searchName = AmisStringUtils.convertVNtoENToLower(this.searchName.trim());
      let filterCondition = '[';
      if (this.searchFields.length) {
        for (let index = 0; index < this.searchFields.length; index++) {
          const element = this.searchFields[index];
          filterCondition += `["${element}","contains","${searchName}"]`;
          if (index < this.searchFields.length - 1) {
            filterCondition += `,"OR",`;
          }
        }
        filterCondition += ']';
        requestParams.Filter = window.btoa(filterCondition);
      }
    }
    return requestParams;
  }

  /**
   * Xử lý chọn tất cả trang
   * Created by ltanh1 13/06/2020
   */
  selectAllPage() {
    let param = this.getParamForPaging();
    param.PageSize = this.totalRecord;
    param.PageIndex = 1;
    this.userService.getNonPermissionUser(param).subscribe(res => {
      if (res && res.Success && res.Data.PageData) {
        this.isSelectedAllPage = true;
        this.selectedAllData = res.Data.PageData;
        const iDArray = this.selectedAllData.map(e => e[`UserID`]); // Lấy danh sách bản ghi đã được chọn
        // Lấy những bản ghi được chọn ở grid hiện tại
        const selectedRow = this.dataSource.filter(e => iDArray.indexOf(e[`UserID`]) > -1);

        this.isCallAPIGetAll = true;
        setTimeout(() => {
          // thực hiện chọn grid
          this.pagingGrid.grid.instance.selectRows(selectedRow, false);
          setTimeout(() => {
            this.isClearSelect = false;
          }, 300);
        }, 100);
      }
    });
  }


  // POPUP PHÂN QUYỀN

  /**
   * remove người dùng khỏi danh sách đc chọn
   * nmduy 31/08/2020
   */
  viewMoreRow(data) {
    if (data.ContextMenu.Key === ContextMenu.Delete && data.SelectedRow.data) {
      const removedUser = data.SelectedRow.data;
      this.selectedData = this.selectedData.filter(u => u.UserID != removedUser.UserID);
    }
    if (!this.selectedData?.length) {
      this.back()
    }
  }

  /**
   * Hàm xử lý click vào trong button xóa ở dấu ...
   * Created by ltanh1 04/06/2020
   */
  contextMenuExecuteAction(e) {
    if (e.Key == FormMode.Delete) {
      this.viewMoreRow(e);
    }
  }


  /**
   * Lưu thiết lập người dùng
   * Created by ltanh1 04/06/2020
   */
  submit() {
    this.isSubmit = AmisCommonUtils.cloneData({ IsSubmit: true });
  }

  /**
   * Sự kiện chọn giá trị vai trò
   * Created by ltanh1 30/05/2020
   */
  selectboxChangeValue(e) {
    this.isRoleEmpty = false;
  }

  /**
   * Hàm tạo giá trị output cho sự kiện quay lại
   * Created by ltanh1 01/06/2020
   */
  back() {
    this.currentPageIndex = 1;
    this.isShowAddPopup = true;
    this.isCallAPIGetAll = true;
    this.title = this.translateSV.getValueByKey("SETTING_USER_LIST_ADD_USER");
    this.popupHeight = 'auto';
    this.isSubmit = false;
    this.getUsersPaging();
  }


  setView() {
    this.typeShow.IsViewOnly = false;
    this.typeShow.IsEditable = false;
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
        ColumnGroup: ColumnGroup.TwoCol,
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
          },
          {
            Caption: this.translateSV.getValueByKey("SETTING_USER_MANAGEMENT_GRID_ACCESS_CONTROL"),
            RowIndex: 1,
            ColumnIndex: 2,
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
            CustomConfig: '{"MaxWidthPop": "350px"}'
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
      return;
    }
    const listUserRole = new Array<UserRoles>();
    let roleID = "";
    let roleName = "";
    this.fieldListConfig[0].GroupFieldConfigs.forEach(element => {
      if (element.FieldName === 'RoleID') {
        roleID = element.Value;
        roleName = element.ValueText;
      }
      if (element.FieldName === 'OrganizationUnitID') {
        let listOUTmp = element.Value.split(';');
        this.listItemIDs = [];
        listOUTmp.forEach(e => {
          this.listItemIDs.push(e);
        });
      }
    });
    this.selectedData.forEach(element => {
      const itemdata = new UserRoles();
      itemdata.ListOrganizationUnitIDs = this.listItemIDs;
      itemdata.UserID = element.UserID;
      itemdata.RoleID = roleID;
      itemdata.RoleName = roleName;
      itemdata.AppCode = AppCode;
      listUserRole.push(itemdata);
    });
    const param = { IsUpdate: false, ListUserRoles: listUserRole };
    this.userRoleService
      .insertListUserRolesWithUpdate(param)
      .subscribe(res => {
        if (res && res.Success) {
          this.amisTranferData.showSuccessToast(this.translateSV.getValueByKey('ADD_USER_SUCCESS'));
          this.afterSaveSuccess();
        } else {
          this.amisTranferData.showWarningToast(this.translateSV.getValueByKey('ADD_USER_FAIL'));
          this.closePopup();
        }
      });
  }

  /**
   * Sau khi lưu thành công
   */
  afterSaveSuccess() {
    this.saveSuccess.emit();
  }

}

