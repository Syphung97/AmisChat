import { Component, OnInit, Input, Output, EventEmitter, ElementRef } from "@angular/core";
import { ButtonType } from 'src/app/shared/enum/common/button-type.enum';
import { ButtonColor } from 'src/app/shared/enum/common/button-color.enum';

@Component({
  selector: "amis-button",
  templateUrl: "./amis-button.component.html",
  styleUrls: ["./amis-button.component.scss"]
})
export class AmisButtonComponent implements OnInit {

  // Disabled
  @Input() isDisable: boolean = false;

  // Loại button
  _isMultiOption: boolean = false;
  @Input()
  set isMultiOption(value) {
    this._isMultiOption = value;
  };

  // Loại button
  @Input()
  type: ButtonType = ButtonType.OnlyText;

  // Màu button
  @Input()
  color: ButtonColor = ButtonColor.BluePrimary;

  // có phải button dạng hiển thị thêm không
  @Input()
  isShowMore: boolean = false;

  //có phải hiển thị dropdowm với 1 option không 
  @Input()
  oneOptionDropdowm: boolean = false;

  // Nội dung Button
  @Input()
  name = "";
  // trường check xem button có viewmore co cần thêm vertical line không
  @Input() requireVerticalLine: boolean = true;

  @Input() finishCall = false;
  @Input() startCall = false;

  // Icon
  @Input()
  iconLeft = "";
  @Input()
  iconRight = "";

  // permisstion code
  permissionCode = "";
  @Input() set _permissionCode(value) {
    this.permissionCode = value;
  };

  // subsystem code
  subSystemCode = "";
  @Input() set _subSystemCode(value) {
    this.subSystemCode = value;
  };

  // có check quyền click button không

  isIgnorePermission = true;
  @Input() set _isIgnorePermission(value) {
    this.isIgnorePermission = value;
  };

  // icon với button chỉ có icon
  _icon: string = "";
  @Input() set icon(value) {
    this._icon = value;
    this.getPopoverId();
  };

  _isActive: boolean = false;
  @Input() set isActive(value) {
    this._isActive = value;
  };

  listOptions = [{
    Icon: "icon-caret-down",
    IsIgnorePermission: true,
    SubSystemCode: "",
    PermissionCode: "",
    Text: ""
  }];

  // hiển thị tooltip cho button
  _isShowTooltip: boolean = false;
  @Input() set isShowTooltip(value) {
    this._isShowTooltip = value;
    this.getPopoverId();
  }

  // nội dung tooltip cho button
  _tooltipContent: string = "";
  @Input() set tooltipContent(value) {
    this._tooltipContent = value;
  }


  // dữ liệu cho menu viewmore gần thanh search
  @Input() set viewMoreMenu(data) {
    if (data?.length > 1) {
      this.listOptions[0]['items'] = data;
    } else {
      this.listOptions = [];
      this.listOptions = this.listOptions.concat(data);
      this._isShowTooltip = true;
      this._tooltipContent = this.listOptions[0].Text;
      this.getPopoverId();
    }
    this.handleListOption();
  }


  // Output bắt sự kiện click
  @Output()
  clickButton: EventEmitter<any> = new EventEmitter<any>();

  // Output bắt sự kiện click
  @Output()
  clickMoreButton: EventEmitter<any> = new EventEmitter<any>();

  // Output bắt sự kiện click
  @Output()
  clickItemViewMoreButton: EventEmitter<any> = new EventEmitter<any>();

  // Enum loại Button
  buttonType = ButtonType;
  // Enum loại Button
  buttonColor = ButtonColor;

  // @ViewChild('dropdownBtn', { static: false })
  // dropdownBtn: DxDropDownButtonComponent;
  items = ["EventEmitter", "// Enum loại Button", "   * CREATED BY NMDUC - 09/03/2020"]

  // Thêm tùy chọn class
  @Input()
  customClass = "";

  tooltipID: string = "tooltip";

  constructor(
    public el: ElementRef
  ) { }


  ngOnInit() {
    if (this.permissionCode && this.subSystemCode) {
      this.isIgnorePermission = false;
    }
  }

  /**
   * Xử lý danh sách option button more
   * nmduy 25/08/2020
   */
  handleListOption() {
    if (this.listOptions[0]["items"]?.length) {
      this.listOptions[0]["items"].forEach(element => {
        if (element.SubSystemCode && element.PermissionCode) {
          element.IsIgnorePermission = false;
        } else {
          element.IsIgnorePermission = true;
        }
      });
    } else {
      if (this.listOptions[0].SubSystemCode) { // nếu có check theo subsystem code thì check quyền
        this.listOptions[0].IsIgnorePermission = false;
      } else {
        this.listOptions[0].IsIgnorePermission = true;
      }
    }
  }

  /**
   * Click chọn 1 item
   * nmduy 28/07/2020
   */
  itemClick(item) {
    if (item?.Key) {
      this.clickItemViewMoreButton.emit(item);
    }
  }

  /**
 * hiển thị menu
 * nmduy 27/08/2020
 */
  onShowMenu(e) {
    const dropdownMenu = document.querySelector('.dx-context-menu.dx-menu-base');
    if (dropdownMenu) {
      dropdownMenu.classList.add('amis-btn-dropdown-menu');
    }
  }

  /**
   * Sự kiện click vào Button
   * @memberof ButtonComponent
   * CREATED BY NMDUC - 09/03/2020
   */
  onClickButton(e) {
    this.clickButton.emit(e);
  }

  /**
   * Sự kiện click vào Button
   * @memberof ButtonComponent
   * CREATED BY NMDUC - 09/03/2020
   */
  onClickMoreButton(e) {
    this.clickMoreButton.emit(e);
  }

  /**
   * 
   */
  onSelectItem(e) {
    console.log(e);
  }

  /**
  * Hàm xử lí khi ấn vào menu dropdowm viewmore ở toolbar
  * created by: hgvinh 13/07/2020
  */
  onItemViewMoreClick(item) {
    // if (this.viewMoreMenu.length > 1) {
    //   this.clickItemViewMoreButton.emit(item);
    //   // this.dropdownBtn.instance.close();
    // } else {
    // }
  }

  /**
   * Tạo id cho popover
   * nmduy 07/09/2020
   */
  getPopoverId() {
    this.tooltipID = `tooltip-${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}`
  }
}
