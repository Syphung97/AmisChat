import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from "rxjs";
import { AmisCommonUtils } from 'src/common/fn/common-utils';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { AvatarService } from 'src/app/services/user/avatar.service';
import { Router } from '@angular/router';
import { KeyCode } from 'src/common/enum/key-code.enum';
import { AmisTranslationService } from 'src/common/services/amis-translation.service';
import { ButtonType } from '../../enum/common/button-type.enum';
import { ButtonColor } from '../../enum/common/button-color.enum';
import { TransferDataService } from 'src/app/services/base/transfer-data.service';
import { QuickSearch } from '../../models/quick-search/quick-search';
import { Employee } from '../../models/employee/employee';
import { BaseComponent } from 'src/common/components/base-component';

@Component({
  selector: 'amis-select-box-dropdown',
  templateUrl: './select-box-dropdown.component.html',
  styleUrls: ['./select-box-dropdown.component.scss']
})
export class SelectBoxDropdownComponent extends BaseComponent implements OnInit {
  //#region Properties
  //viewchild input
  @ViewChild("searchKey") searchKey: ElementRef;
  //viewchild content scroll
  @ViewChild("scrollContent") scrollContent: ElementRef;
  // Hiện thị popup hay không
  popupVisible: boolean = false;
  // Hiển thị popover hay không
  visiblePopover = false;
  // Vị trí popover
  position = { 'at': 'bottom right', 'my': 'top right', 'offset': '0 -9' }
  // Từ khóa tìm kiếm
  searchName: string;
  // Danh sách tìm kiếm gần đây
  listProfile = [
  ];
  //số thứ tự của mảng kết quả
  index: number = -1;
  // Danh sach thông tin hiển thị cho popup
  mainInfo = [
  ];
  // Tham số xem có phải get recent không
  isGetRecent: boolean = true;
  //Thời gian tìm kiếm
  timeSearch: any;
  // Filter tìm kiếm
  paramFilter = {
    PageSize: 20,
    PageIndex: 1,
    Filter: "",
    Sort: btoa(`[{"selector":"LastName","desc":"false"}]`),
    QuickSearch: {},
    CustomParam: {
      Inactive: true
    }
  };
  // Id của nhân viên ấn chọn
  employee: any;

  // Biến để hiển thị popup xóa bộ lọc
  visibleNotify = false;

  hasRecentlySearching = false;
  // nội dung xóa trong popup
  contentNotifyDelete = this.translateSV.getValueByKey("HRM_SETTING_JOB_ROLE_NOTIFY_CONTENT_DELETE");
  // được phép xóa hay k
  isDelete = true;

  buttonType = ButtonType;
  buttonColor = ButtonColor;

  organizationUnit: any;
  filterStringDefault: string;

  public _onDestroySub: Subject<void> = new Subject<void>();
  constructor(
    private employeeService: EmployeeService,
    private avatarService: AvatarService,
    private router: Router,
    private translateSV: AmisTranslationService,
    private tranferDataSV: TransferDataService
  ) { super(); }

  ngOnInit(): void {
    this.employee = new Employee();
    this.tranferDataSV.getOrganizationUnit.pipe(takeUntil(this._onDestroySub)).subscribe(data => {
      let strOrganizationID = '';
      if (data && data.length > 0) {
        strOrganizationID = data.map(item => item.OrganizationUnitID).join(';');
      }
      const filterOrg = ['OrganizationUnitID', 'IN', strOrganizationID];
      this.organizationUnit = filterOrg;
    });
    this.tranferDataSV.shortCutAction.pipe(takeUntil(this._onDestroySub)).subscribe(res => {
      if (res === KeyCode.F4) {
        this.searchKey.nativeElement.focus();
      }
    });
  }
  /**
   * Hàm hiển thị popup thông tin thêm
   * Created by: HGVinh 15/05/2020
   * @param data data truyền vào
   * @param event
   */
  seeMoreInfo(event, data) {
    event.stopPropagation();
    this.popupVisible = true;
    this.employee = data;
  }


  /**
   * Hàm thực hiện tìm kiếm theo key gõ
   * Created by: HGVINH 15/05/2020
   * @param key
   */
  searchProfile(key) {
    clearTimeout(this.timeSearch);
    this.timeSearch = setTimeout(() => {
      var inputVal = key.value;
      this.isGetRecent = false;
      if (inputVal) {
        if (inputVal != this.searchName) {
          inputVal = inputVal.trim();
          this.searchName = inputVal;
          this.paramFilter.PageIndex = 1;
          // const strFilter = `[
          // "OR",["FullName","contains","${this.searchName}"],
          // "OR",["Email","contains","${this.searchName}"],
          // "OR",["EmployeeCode","contains","${this.searchName}"],
          // "OR",["OfficeEmail","contains","${this.searchName}"],
          // "OR",["OfficeTel","contains","${this.searchName}"],
          // "OR",["JobPositionName","contains","${this.searchName}"],
          // "OR",["OrganizationUnitName","contains","${this.searchName}"],
          // "OR",["Mobile","contains","${this.searchName}"]]`;

          // this.paramFilter.Filter = "this.getFilterString(AmisCommonUtils.Base64Encode(strFilter), '')";
          const quickSearch = new QuickSearch();
          quickSearch.Columns = [
            'EmployeeCode', // Mã nhân viên
            'FullName', // họ và tên nhân viên
            'JobPositionName', // vị trí công việc
            'OrganizationUnitName', // đơn vị công tác
            'Mobile', // ĐT di động
            'OfficeTel', // ĐT cơ quan
            'Email', // Email cá nhân
            'OfficeEmail' // Email cơ quan
          ];
          quickSearch.SearchValue = this.searchName;
          this.paramFilter.QuickSearch = quickSearch;
          this.getEmployee();
        }
      }
      else {
        this.isGetRecent = true;
        this.getRecent();
      }
    }, 300);
  }

  /**
   * Build lại chuỗi filter đi kèm với bộ lọc
   * Created by: dthieu 25-05-2020
   */
  getFilterString(filterString = '', filterOrg = null) {
    this.filterStringDefault = '';
    const arrayFilter = [];
    const operater = 'AND';
    if (filterString) {
      const f = AmisCommonUtils.Decode(AmisCommonUtils.Base64Decode(filterString));
      arrayFilter.push(...f);
    }
    if (filterOrg.length > 0) {
      if (arrayFilter.length > 0) {
        arrayFilter.push(operater);
      } else {
        const start = [1, '=', 1];
        arrayFilter.push(start);
        arrayFilter.push(operater);
      }
      arrayFilter.push(filterOrg);
    }

    this.filterStringDefault = AmisCommonUtils.Base64Encode(
      AmisCommonUtils.Encode(arrayFilter)
    );

    return this.filterStringDefault;
  }

  /**
   * Lấy danh sách nhân viên
   * HGVINH 15/04/2020
   */
  getEmployee() {
    this.employeeService.getEmployeeSearchBar(this.paramFilter).pipe(takeUntil(this._onDestroySub)).subscribe(res => {
      if (res && res.Success && res.Data) {
        this.handleResponseData(res.Data.PageData);
        this.mainInfo = res.Data.CustomData;
        localStorage.setItem("AMIS_EmployeesProfile_MainInfo", JSON.stringify(this.mainInfo));
      }
    })
  }

  /**
   * Hàm xử lí dữ liệu trả về
   * Created by: HGVinh 15/05/2020
   * @param resData dữ liệu trả về
   */
  handleResponseData(resData) {
    if (resData && resData.length) {
      resData.forEach(element => {
        element.Avatar = this.avatarService.getAvatar(element.UserID, element.EditVersion, true, 80, 80);
      });
    }
    this.listProfile = resData;
    this.visiblePopover = true;
  }

  /**
   * Hàm xóa trắng ô input
   */
  closePopover(item) {
    item.value = "";
    item.blur();
    this.searchName = "";
    this.listProfile = [];
    this.index = 0;
  }

  /**
   * Hàm xử lí khi đóng popup
   */
  onPopupClose(item) {
    item.focus();
    this.popupVisible = false;
  }

  /**
   * Hàm xử lí khi chi tiết nhân viên
   */
  onSeeDetail() {
    this.searchName = "";
    this.popupVisible = false;
    this.visiblePopover = false;
  }
  /**
   * Hàm xem chi tiết nhân viên
   * @param id id nhân viên
   */
  seeDetail(employee) {
    this.onSeeDetail();
    this.addToRecent(employee);
    setTimeout(() => {
      const param = {
        id: employee.EmployeeID,
        mode: "detail"
      }
      this.router.navigate([`profile/view`], {
        queryParams: param
      });
    }, 700);
    this.addToRecent(employee);
  }

  /**
   * Bật form sửa thông tin nhân viên
   * Created by: dthieu 27-05-2020
   */
  editEmployee(employeeID) {
    this.onSeeDetail();
    setTimeout(() => {
      const param = {
        id: employeeID,
        mode: "edit"
      };
      this.router.navigate([`profile/view`], {
        queryParams: param
      });
    }, 700);
  }

  /**
   * Hàm lấy về tìm kiếm gần đây
   * Created by: HGVinh 15/05/2020
   */
  getRecent() {
    this.listProfile = JSON.parse(localStorage.getItem("recentSearch")) ? JSON.parse(localStorage.getItem("recentSearch")) : [];
    this.mainInfo = JSON.parse(localStorage.getItem("AMIS_EmployeesProfile_MainInfo")) ? JSON.parse(localStorage.getItem("AMIS_EmployeesProfile_MainInfo")) : [];

    if (this.listProfile.length > 0) {
      this.visiblePopover = true;
      this.hasRecentlySearching = true;
    } else {
      this.visiblePopover = false;
      this.hasRecentlySearching = false;
    }
  }
  /**
   * Hàm xóa những hồ sơ tìm kiếm gần đây
   * Created by: HGVinh 15/05/2020
   */
  deleteRecent() {
    this.isDelete = true;
    this.visibleNotify = true;

  }
  /**
   * Hàm thêm nhân viên vừa tìm kiếm vào recent
   * Created by: HGVinh 15/05/2020
   */
  addToRecent(item) {
    this.employee = item;
    const recent = JSON.parse(localStorage.getItem("recentSearch")) ? JSON.parse(localStorage.getItem("recentSearch")) : [];
    if (recent.length === 0) {
      recent.push(item);
      localStorage.setItem("recentSearch", JSON.stringify(recent));
    } else {
      const exist = recent.filter(x => x.EmployeeCode === item.EmployeeCode);
      if (exist && exist.length !== 0) {
        localStorage.setItem("recentSearch", JSON.stringify(recent));
      } else {
        if (recent.length === 5) {
          recent.pop();
        }
        recent.push(item);
        localStorage.setItem("recentSearch", JSON.stringify(recent));
      }
    }
  }

  /**
   * Hàm xử lí khi gõ
   * Created by: HGVinh 15/04/2020
   * @param key key search
   */
  onKeyUp(key, event) {

    if (event.keyCode === KeyCode.Esc) {
      this.visiblePopover = false;
    } else if (event.keyCode === KeyCode.ArrowDown) {
      let profiles = this.scrollContent['element'].nativeElement.querySelector(".dx-scrollview-content").children;
      if (this.listProfile && this.listProfile.length > 0) {
        this.index++;
        if (this.index > this.listProfile.length - 1) {
          this.index = 0;
          this.scrollContent['instance'].scrollTo(0);
        }
        for (let i = 0; i < profiles.length; i++) {
          this.onMouseLeave(profiles[i]);
        }
        this.onMouseEnter(this.scrollContent['element'].nativeElement.querySelector(".dx-scrollview-content").children[this.index]);
        let clientHeight = this.scrollContent['instance'].clientHeight();
        let activeOffsetTop = this.scrollContent['element'].nativeElement.querySelector(".dx-scrollview-content").offsetTop + clientHeight;
        let scrollTop = this.scrollContent['element'].nativeElement.querySelector(".hovered").offsetTop;
        let scrollHeight = clientHeight + scrollTop;
        if (activeOffsetTop < scrollTop || activeOffsetTop > scrollHeight) {
          this.scrollContent['instance'].scrollBy(70);
        }
      }
    } else if (event.keyCode === KeyCode.ArrowUp) {
      if (this.listProfile && this.listProfile.length > 0) {
        let profiles = this.scrollContent['element'].nativeElement.querySelector(".dx-scrollview-content").children;
        this.index--;
        if (this.index < 0) {
          this.index = this.listProfile.length - 1;
          this.scrollContent['instance'].scrollBy(90 * this.listProfile.length);
        }
        for (let i = 0; i < profiles.length; i++) {
          this.onMouseLeave(profiles[i]);
        }
        this.onMouseEnter(this.scrollContent['element'].nativeElement.querySelector(".dx-scrollview-content").children[this.index]);
        let clientHeight = this.scrollContent['instance'].clientHeight();
        let activeOffsetTop = this.scrollContent['element'].nativeElement.querySelector(".dx-scrollview-content").offsetTop + clientHeight;
        let scrollTop = this.scrollContent['element'].nativeElement.querySelector(".hovered").offsetTop;
        let scrollHeight = scrollTop - activeOffsetTop;
        if (scrollHeight <= activeOffsetTop) {
          this.scrollContent['instance'].scrollBy(-66);
        }
      }
    } else if (event.keyCode === KeyCode.Enter) {
      if (this.listProfile.length) {
        this.addToRecent(this.listProfile[this.index])
        this.seeDetail(this.listProfile[this.index]);
      }
    } else {
      this.searchProfile(key);
    }
  }

  /**
   * Hủy xóa phần tử đã chọn trong grid
   * created by dthieu 27/5/2020
   */
  cancelDelete() {
    this.visibleNotify = false;
  }

  /**
   * Xóa lịch sử tìm kiếm
   * Created by: dthieu 27-05-2020
   */
  deleteFilterItem() {
    localStorage.removeItem("recentSearch");
    this.getRecent();
    this.visibleNotify = false;
  }

  onMouseEnter(e) {
    e.classList.add('hovered');
  }
  onMouseLeave(e) {
    e.classList.remove('hovered');
  }
}
