import { Component, OnInit, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import {
  DxDropDownBoxComponent
} from 'devextreme-angular';
import { OrganizationUnit } from '../../models/organization-unit/organization-unit';
import { OrganizationUnitService } from 'src/app/services/organizaion-unit/organization-unit.service';
import { TransferDataService } from 'src/app/services/base/transfer-data.service';
import { AmisCommonUtils } from 'src/common/fn/common-utils';
import { AmisStringUtils } from 'src/common/fn/string-utils';
import { BaseComponent } from 'src/common/components/base-component';
import { SessionStorageKey } from '../../constant/session-storage-key/session-storage-key';


@Component({
  selector: 'amis-select-organization-unit',
  templateUrl: './select-organization-unit.component.html',
  styleUrls: ['./select-organization-unit.component.scss']
})
export class SelectOrganizationUnitComponent extends BaseComponent implements OnInit {

  @Output() OrganizationUnitChange: EventEmitter<any> = new EventEmitter();
  _organizationUnit: any;
  @Input() set OrganizationUnit(val) { // cơ cấu tổ chức mặc định
    if (val) {
      this._organizationUnit = AmisCommonUtils.cloneData(val);
      this.setOrgUnitData(val);
    }
  };

  @Input() isChangerOpenFirst = true;
  @Input() width = 320; // chiều rộng

  @Output() changeOrganizationUnit = new EventEmitter();
  @ViewChild('dropdown', { static: false })
  dropdown: DxDropDownBoxComponent;

  treeBoxValueOrga = [];

  listOrganizationShow: OrganizationUnit[];

  listOrganization: OrganizationUnit[];
  //trường xác định có load dữ liệu theo cơ cấu tổ chức ở lúc bật lên không
  @Input() isLoadedOninit = false;

  isLoadedOrg = false;

  orgObject: any = {};

  // có cho hiển tihj cơ cấu tổ chức ngừng theo dõi không ?
  isShowOUInactive = false;

  constructor(
    private organizationService: OrganizationUnitService,
    private transferData: TransferDataService,
  ) { super(); }

  ngOnInit(): void {
    if (!this.listOrganization?.length) {
      this.setOrgUnitData();
    };
    if (this.isLoadedOninit) {
      this.onGetData();
    };
  }

  /**
   * Thiết lập giá trị cơ cấu tổ chức
   * nmduy 05/10/2020
   */
  setOrgUnitData(org = null) {
    if (this.listOrganization?.length) {
      this.treeBoxValueOrga = org?.OrganizationUnitID;
    } else {
      this.listOrganization = [];
      this.listOrganizationShow = [];
      this.treeBoxValueOrga = [];
      const objOrganizationUnit: any = {};
      if (org) {
        objOrganizationUnit.OrganizationUnitID = org?.OrganizationUnitID;
        objOrganizationUnit.OrganizationUnitName = org?.OrganizationUnitName;
        this.isShowOUInactive = org?.InActive;
      } else {
        objOrganizationUnit.OrganizationUnitID = this.currentUserInfo?.OrganizationUnitID;
        objOrganizationUnit.OrganizationUnitName = this.currentUserInfo?.OrganizationUnitName;
      }
      this.listOrganization.push(objOrganizationUnit);
      this.listOrganizationShow = AmisCommonUtils.cloneDataArray(this.listOrganization);
      this.treeBoxValueOrga.push(objOrganizationUnit.OrganizationUnitID);
    };
  }

  /**
   * Lấy dữ liệu
   * nmduy 26/08/2020
   */
  onGetData() {
    if (!this.isLoadedOrg) {

      const organizationUnit = this.getSesionStorageOrganizationUnit();

      if (organizationUnit?.length) {
        this.listOrganization = organizationUnit;
        this.listOrganizationShow = this.buildOrgaByStatus();
        // Lấy cctc cao nhât để load dữ liệu
        if (organizationUnit && organizationUnit.length > 0) {
          this.transferData.getOrganization(organizationUnit);
          this.isLoadedOrg = true;
        }
      } else {
        const allowInactive = true;
        this.organizationService.getAllOrganizationByUser(allowInactive).subscribe(res => {
          if (res && res.Success) {
            this.listOrganization = [];
            this.listOrganization = this.buildTreeDataListOrganizaiton(res.Data);
            this.listOrganizationShow = this.buildOrgaByStatus();
            // Lấy cctc cao nhât để load dữ liệu
            if (res.Data && res.Data.length > 0) {
              this.transferData.getOrganization(res.Data);
              this.isLoadedOrg = true;
            }

            this.setSesionStorageOrganizationUnit(this.listOrganization);
          }
        });
      }

    }
  }

  /**
   * Mở dropdown cơ cấu tổ chức
   */
  onOpened() {
    const popTree = document.querySelector('.dx-dropdowneditor-overlay .dx-overlay-content');
    if (popTree) {
      popTree.classList.add('amis-select-tree-org');
      const searchPopTree: HTMLInputElement = popTree.querySelector('.dx-treeview-search input.dx-texteditor-input');
      if (searchPopTree) {
        searchPopTree?.focus();
      }
    }
    this.onGetData();
  }

  /**
   * hàm build danh sách dữ liệu sử dụng cho cây cơ cấu tổ chức
   * dthieu 15/6/2020
   */
  buildTreeDataListOrganizaiton(listData) {
    if (listData && listData.length > 0) {
      const listAllParent = this.findAllParent(listData);
      if (listAllParent && listAllParent.length > 0) {
        listAllParent.forEach(el => {
          const temp = listData.find(x => x.MISACode === el.MISACode);
          if (temp) {
            temp.ParentID = null;
          }
        });
      }
    }
    return listData;
  }


  /**
   * Tìm tất cả các node tổng
   * dthieu 15/6/2020
   */
  findAllParent(listData) {
    const listParent = [];
    listData.forEach(item => {
      item.OrganizationUnitNameSearch = AmisStringUtils.convertVNtoENToLower(item.OrganizationUnitName);
      if (item.MISACode && item.MISACode.length > 8) {
        const listCode = item.MISACode.split('/');
        listCode.splice(listCode.length - 2, 1);
        const miCoParent = listCode.join('/');
        const itemPar = listData.find(x => x.MISACode === miCoParent);
        if (!itemPar) {
          item.IsExpanded = true;
          listParent.push(item);
        }
      } else {
        item.IsExpanded = true;
        listParent.push(item);
      }
    });
    return listParent;
  }

  /**
 * hàm build cơ cấu theo trạng thái lựa chọn
 *
 * @memberof HrmContractToolbarComponent
 * vbcong 27/07/2020
 */
  buildOrgaByStatus() {
    let listOuShow = AmisCommonUtils.cloneDataArray(this.listOrganization);
    if (!this.isShowOUInactive) {
      listOuShow = this.listOrganization.filter(item => {
        return !item.Inactive;
      });
    }
    if (listOuShow.length > 0) {
      const listParentShow = listOuShow.filter(item => {
        return item.ParentID == null;
      });
      if (listParentShow.length > 0) {
        const parentID = listParentShow[0].OrganizationUnitID;
        const parentName = listParentShow[0].OrganizationUnitName;
        if (this.isChangerOpenFirst) {
          this.treeBoxValueOrga = [];
          this.treeBoxValueOrga.push(parentID);
        }
        this.orgObject.OrganizationUnitID = parentID;
        this.orgObject.OrganizationUnitName = parentName;
      }
    }
    return listOuShow;
  }

  /**
* load xong tree
*
* @param {any} e
* @memberof AmisControlTreeBoxComponent
* vbcong
*/
  readyTreeBox(e) {
    const popTree = document.querySelector('.dx-dropdowneditor-overlay .dx-overlay-content');
    if (popTree) {
      const searchPopTree: HTMLInputElement = popTree.querySelector('.dx-treeview-search input.dx-texteditor-input');
      searchPopTree?.focus();
    }
  }

  treeView_itemSelectionChanged(e) {
    if (e) {
      this.dropdown.instance.close();
      this.treeBoxValueOrga = e.itemData.OrganizationUnitID;
      this.orgObject.OrganizationUnitID = this.treeBoxValueOrga;
      this.orgObject.OrganizationUnitName = e.itemData.OrganizationUnitName;
      this.orgObject.Inactive = this.isShowOUInactive;
      
      if (this._organizationUnit) {
        this._organizationUnit.OrganizationUnitID = this.orgObject.OrganizationUnitID;
        this._organizationUnit.OrganizationUnitName = this.orgObject.OrganizationUnitName;
        this._organizationUnit.InActive = this.isShowOUInactive;
        this.OrganizationUnitChange.emit(this._organizationUnit);
      }

      this.changeOrganizationUnit.emit(this.orgObject);
    }
  }

  /**
 * hàm thay đổi cách lấy dữ liệu load cơ cấu tổ chức.
 *
 * @memberof HrmContractToolbarComponent
 * vbcong 27/07/2020
 */
  changerGetOUStatus() {
    this.isShowOUInactive = !this.isShowOUInactive;
    this.listOrganizationShow = this.buildOrgaByStatus();
    this.orgObject.Inactive = this.isShowOUInactive;
    this.treeBoxValueOrga = [];
    this.treeBoxValueOrga.push(this.orgObject.OrganizationUnitID);
    this.orgObject.OrganizationUnitName = this.orgObject.OrganizationUnitName;

    if (this._organizationUnit) {
      this._organizationUnit.OrganizationUnitID = this.orgObject.OrganizationUnitID;
      this._organizationUnit.OrganizationUnitName = this.orgObject.OrganizationUnitName;
      this._organizationUnit.InActive = this.isShowOUInactive;
      this.OrganizationUnitChange.emit(this._organizationUnit);
    }
    this.changeOrganizationUnit.emit(this.orgObject);
  }
}
