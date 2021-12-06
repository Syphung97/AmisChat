import { Component, OnInit, Output, EventEmitter, ElementRef, ViewChild, HostListener, ViewChildren, QueryList } from '@angular/core';
import { Input } from '@angular/core';
import { TransferDataService } from 'src/app/services/base/transfer-data.service';
import { BaseComponent } from '../base-component';
import { takeUntil } from 'rxjs/operators';
import { AmisCommonUtils } from 'src/common/fn/common-utils';
import { ButtonType } from 'src/app/shared/enum/common/button-type.enum';
import { ButtonColor } from 'src/app/shared/enum/common/button-color.enum';
import { DxScrollViewComponent, DxTextBoxComponent } from 'devextreme-angular';
import { AmisStringUtils } from 'src/common/fn/string-utils';
import { convertVNtoENToLower } from 'src/common/fn/convert-VNtoEn';

@Component({
  selector: 'amis-tabs',
  templateUrl: './amis-tabs.component.html',
  styleUrls: ['./amis-tabs.component.scss']
})
export class AmisTabsComponent extends BaseComponent implements OnInit {

  @Input() set inputListTab(data) {
    if (data && data.length > 0) {
      this.listTabAll = data;
      this.listTab = AmisCommonUtils.cloneDataArray(this.listTabAll);
      this.listTabClone = AmisCommonUtils.cloneDataArray(this.listTabAll);
      this.countColumn = (this.listTabClone.length / 2).toFixed(0);
      if (this.listTabClone.length / 2 % 2 != 0) {
        this.countColumn++;
      }
      if (this.tabActive) {
        this.outputTabActive.emit(this.tabActive);
        this.outputTabActiveObject.emit(this.listTabAll.find(e => e[this.Key] == this.tabActive));
      }
      this.isListTab = true;
      setTimeout(() => {
        this.displayColumn();
      });
    }
    this.getTabActiveDefault();
  };

  //Kiểm tra xem có listTab k
  isListTab: boolean = false;

  //danh sách tab hiển thị
  listTab = [];

  //danh sách các tab
  listTabAll = [];

  //danh sách tab clone
  listTabClone = [];
  //danh sách tab Khác clone(trừ những tab đã hiển thị)
  listTabCloneAll = [];


  //key list tab
  @Input() Key: string = "Key";
  //text hiển thị list tab
  @Input() Text: string = "Text";
  //Loại style tab
  @Input() typeListTab: number = 1;
  //tab active
  @Input() set _tabActive(data) {
    if (+data > 0) {
      this.tabActive = data;
      this.outputTabActive.emit(this.tabActive);
    }
  };
  tabActive: number;
  //font-weight
  @Input() fontWeight: string = "";

  //background của list tab
  @Input() background: string;

  //chiều cao của list tab
  @Input() height: string;

  //cỡ chữ của list tab
  @Input() fontSize: string;

  //màu chữ thường của list tab
  @Input() color: string;

  //màu chữ active của list tab
  @Input() colorActive: string;

  //bg active của tab
  @Input() bgActive: string;

  //màu chữ active của list tab
  @Input() isWidthFitcontent = false;
  //có bold màu chữ khi active k
  @Input() isActiveBold = true;
  //có hiển thị button hay k
  @Input() isDisplayButton = true;

  // Subsystem check quyền
  _permissionSubSystemCode: string = ""
  @Input() get permissionSubSystemCode() {
    return this._permissionSubSystemCode;
  }
  set permissionSubSystemCode(val) {
    if (val) {
      this._permissionSubSystemCode = val
    }
  }

  // permission code check quyền
  _permissionCodeList: string = ""
  @Input() get permissionCodeList() {
    return this._permissionCodeList;
  }
  set permissionCodeList(val) {
    if (val) {
      this._permissionCodeList = val
    }
  }

  // Có bỏ qua check quyền subsytem hay không
  _isInorgeSubSuystem: string = ""
  @Input() get isInorgeSubSuystem() {
    return this._isInorgeSubSuystem;
  }
  set isInorgeSubSuystem(val) {
    if (val) {
      this._isInorgeSubSuystem = val
    }
  }

  @Input() set inputFirstload(data) {
    if (data) {
      this.isFirstLoad = data.IsFirstLoad;
    }
  }
  @Output() outputTabActive: EventEmitter<number> = new EventEmitter<number>();

  @Output() outputTabActiveObject = new EventEmitter();

  @ViewChild("textBox", { static: false }) textBox: DxTextBoxComponent;

  @ViewChild("divListTab", { static: false }) divListTab: ElementRef;
  @ViewChildren("itemTab") itemTab: QueryList<ElementRef>;
  @ViewChild("dxScrollTab", { static: false }) dxScrollTab: DxScrollViewComponent;

  buttonType = ButtonType;
  buttonColor = ButtonColor;

  //hiện thị popover  ẩn cột
  visiblePopover: boolean = false;

  //
  isDisplayColumn: boolean = false;
  //số cột hiện thị được
  countCoulumDisplay: number = 0;
  //load lần đầu
  isFirstLoad: boolean = true;
  //danh sách độ rộng các cột
  arrTabWidth = [];

  //số lượng item column trên 1 cột
  countColumn: any;

  width: number = 537;

  searchText: string = "";

  //hiện thị btn mũi tên list tab sang trái
  isDisplayBtnArrowLeft: boolean = false;

  //hiện thị btn mũi tên list tab sang phải
  isDisplayBtnArrowRight: boolean = true;

  //kiểm tra có phải tab có ở trong danh sách hiển thị hay k
  isTabActiveDisplay = true;

  // Số lượng khác
  quantityOther = 0;

  constructor(
    private transferData: TransferDataService,
    private el: ElementRef
  ) {
    super();
  }

  ngOnInit(): void {
    this.transferData.changeWidthAmisTab.pipe(takeUntil(this._onDestroySub)).subscribe(data => {
      setTimeout(() => {
        this.displayColumn();
      })
    })
  }

  /**
   * lấy tab active mặc định
   * @memberof AmisTabsComponent
   * CREATED BY PVTHONG - 07/05/2020
   */
  getTabActiveDefault() {
    if (!this.tabActive && this.listTab && this.listTab.length > 0) {
      let tabActiveDefault = AmisCommonUtils.cloneData(this.listTab[0][this.Key]);
      this.tabActive = tabActiveDefault;
      this.outputTabActive.emit(tabActiveDefault);
      this.outputTabActiveObject.emit(this.listTab[0]);
    }
  }


  /**
   * click tab
   * @memberof AmisTabsComponent
   * CREATED BY PVTHONG - 05/05/2020
   */
  clickTab(tab) {
    if (+tab > 0 && tab != this.tabActive) {
      this.visiblePopover = false;
      this.tabActive = tab;
      let temp = this.listTab.find(x => x[this.Key] == tab);
      if (temp) {
        this.isTabActiveDisplay = true;
      }
      else {
        this.isTabActiveDisplay = false;
        temp = this.listTabClone.find(x => x[this.Key] == tab);
      }
      this.outputTabActive.emit(tab);
      this.outputTabActiveObject.emit(temp);
      // setTimeout(() => {
      //   let selector = '.item-tab-active-' + this.typeListTab;
      //   let offsetTabActive = this.el.nativeElement.querySelector(selector).offsetLeft;
      //   let widthTabActive = this.el.nativeElement.querySelector(selector).offsetWidth;
      //   let rightDxScroll = this.dxScrollTab.instance.scrollOffset().left + this.dxScrollTab.instance.clientWidth();
      //   let leftDxScroll = this.dxScrollTab.instance.scrollOffset().left;
      //   if (offsetTabActive < leftDxScroll) {
      //     this.dxScrollTab.instance.scrollTo(offsetTabActive);
      //   }
      //   if (offsetTabActive + widthTabActive > rightDxScroll) {
      //     this.dxScrollTab.instance.scrollTo(offsetTabActive);
      //   }
      // });
    }
  }


  /**
   * Lấy class
   * @memberof AmisTabsComponent
   * CREATED BY PVTHONG - 05/05/2020
   */
  getClass(keyTab) {
    if (this.tabActive === keyTab) {
      return "item-tab-active-" + this.typeListTab;
    }
    return "";
  }

  /**
   * ẩn hiện cột
   * @memberof AmisTabsComponent
   * CREATED BY PVTHONG - 05/05/2020
   */
  displayColumn() {
    if (!this.isListTab) {
      return;
    }

    let widthItemTab = 0;
    if (this.isFirstLoad) {
      this.arrTabWidth = [];
      //load lần đầu lấy độ rộng từng cột
      this.itemTab.forEach(item => {
        this.arrTabWidth.unshift(item.nativeElement.offsetWidth);
        widthItemTab += item.nativeElement.offsetWidth;
        //cộng margin
        if (this.typeListTab === 1) {
          widthItemTab += 4;
        }
      });
      this.isFirstLoad = false;
    }
    else {
      this.arrTabWidth.forEach(item => {
        widthItemTab += item;
      });
    }
    this.countCoulumDisplay = 0;
    let widthListTab = this.divListTab.nativeElement.offsetWidth - 40;
    //nếu type=3 lấy độ rộng của element cha để so sánh
    if (this.typeListTab === 3) {
      widthListTab = this.divListTab.nativeElement.parentElement.parentElement.offsetWidth - 40;
    }

    //kiểm tra đủ độ rộng hiển thị k
    if (widthListTab - 20 > widthItemTab) {
      this.isDisplayColumn = false;
      this.listTab = AmisCommonUtils.cloneDataArray(this.listTabAll);
      return;
    }

    //kiểm tra độ rộng ẩn từng cột
    while (widthListTab - 55 <= widthItemTab) {
      widthItemTab -= this.arrTabWidth[this.countCoulumDisplay];
      if (this.typeListTab === 1) {
        widthItemTab -= 4;
      }
      this.countCoulumDisplay++;
      this.isDisplayColumn = true;
    }
    this.countCoulumDisplay = this.listTabAll.length - this.countCoulumDisplay;

    this.listTab = [];
    for (let index = 0; index < this.countCoulumDisplay; index++) {
      this.listTab.push(this.listTabAll[index]);

    }

    const listKey = this.listTab.map(e => e[this.Key]);
    this.listTabClone = this.listTabAll.filter(e => {
      return !listKey.includes(e[this.Key])
    })

    this.calculateQuantityOther();

    let temp = this.listTab.find(x => x[this.Key] == this.tabActive);
    if (temp) {
      this.isTabActiveDisplay = true;
    }
    else {
      this.isTabActiveDisplay = false;
    }
  }

  /**
   * scroll tab
   * @memberof AmisTabsComponent
   * CREATED BY PVTHONG - 16/05/2020
   */
  onScroll(e) {
    //scroll ở vtri đtien
    if (e.reachedLeft) {
      this.isDisplayBtnArrowLeft = false;
    }
    else {
      this.isDisplayBtnArrowLeft = true;
    }

    //scroll ở vtri cuối cùng
    if (e.reachedRight) {
      this.isDisplayBtnArrowRight = false;
    }
    else {
      this.isDisplayBtnArrowRight = true;
    }
  }

  /**
   * dịch trái phải tab
   * @memberof AmisTabsComponent
   * CREATED BY PVTHONG - 07/05/2020
   */
  clickTabArrow(data) {
    this.dxScrollTab.instance.scrollBy(data);
  }

  /**
   * click ba chấm trên tab
   * @memberof AmisTabsComponent
   * CREATED BY PVTHONG - 07/05/2020
   */
  clickMoreColumn() {
    this.visiblePopover = true;
    setTimeout(() => {
      this.textBox.instance.focus();
    })
    this.searchText = "";
    this.listTabClone = [];
    this.listTabAll.forEach((element, index) => {
      if (index >= this.countCoulumDisplay) {
        this.listTabClone.push(element);
      }
    });
    this.listTabCloneAll = AmisCommonUtils.cloneDataArray(this.listTabClone);
    if (this.listTab.length <= 10) {
      this.width = 277;
    }
    else {
      this.width = 537;
    }
  }

  /**
   * thanh search
   * @memberof AmisTabsComponent
   * CREATED BY PVTHONG - 14/05/2020
   */
  onSearchControl(e) {
    let searchValue = e.element.querySelector('.dx-texteditor-input').value;
    this.searchText = AmisCommonUtils.cloneData(searchValue);
  }

  /**
   * search danh sách tab
   * @memberof AmisTabsComponent
   * CREATED BY PVTHONG - 30/09/2020
   */
  onSearchValueChanged(e) {
    let searchValue = e.element.querySelector('.dx-texteditor-input').value;
    searchValue = AmisStringUtils.convertVNtoENToLower(searchValue)?.trim();
    this.searchListTab(searchValue);
  }

  /**
   * search danh sách tab
   * @memberof AmisTabsComponent
   * CREATED BY PVTHONG - 30/09/2020
   */
  searchListTab(searchValue) {
    // if (searchValue == this.searchText) {
    //   return;
    // }
    if (searchValue?.trim() != "") {
      const tempListTab = AmisCommonUtils.cloneDataArray(this.listTabCloneAll);
      let listReturn = tempListTab.filter(e => { return AmisStringUtils.convertVNtoENToLower(e.GroupConfigName.toLocaleLowerCase()).includes(searchValue) });
      this.listTabClone = AmisCommonUtils.cloneDataArray(listReturn);
      this.countColumn = (this.listTabClone.length / 2).toFixed(0);
      if (this.listTabClone.length / 2 % 2 != 0) {
        this.countColumn++;
      }
      // if (this.listTabClone.length <= 10) {
      //   this.width = 277;
      // }
      // else {
      //   this.width = 537;

      // }
    }
    else {
      this.listTabClone = [];
      // for (let index = this.listTabAll.length - 1; index > this.countCoulumDisplay; index--) {
      //   this.listTabClone.unshift(this.listTabAll[index]);
      // }
      this.listTabAll.forEach((element, index) => {
        if (index >= this.countCoulumDisplay) {
          this.listTabClone.push(element);
        }
      });
      this.countColumn = (this.listTabClone.length / 2).toFixed(0);
      if (this.listTabClone.length / 2 % 2 != 0) {
        this.countColumn++;
      }

      // if (this.listTabClone.length <= 10) {
      //   this.width = 277;
      // }
      // else {
      //   this.width = 537;

      // }

    }
  }

  /**
   * Tính số lượng tab khác
   *
   * @memberof AmisTabsComponent
   */
  calculateQuantityOther() {
    this.quantityOther = 0;
    this.listTabClone.forEach(e => {
      this.quantityOther += e.CustomQuantity;
    })
  }

  /**
   * resize màn hình
   * @memberof AmisTabsComponent
   * CREATED BY PVTHONG - 05/05/2020
   */
  @HostListener("window:resize", ["$event"])
  public handleKeyUpEvent(event: KeyboardEvent): void {
    this.displayColumn();
  }
}
