import { Component, OnInit, ViewChild, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';
import { AmisStringUtils } from 'src/common/fn/string-utils';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { AmisTransferDataService } from 'src/common/services/amis-transfer-data.service';
import { AmisTranslationService } from 'src/common/services/amis-translation.service';
import { AmisDataService } from 'src/common/services/amis-data.service';
import { AvatarService } from 'src/app/services/user/avatar.service';
import { AmisCommonUtils } from 'src/common/fn/common-utils';
import { BackgroundType } from 'src/app/shared/enum/common/background-type.enum';

@Component({
  selector: 'amis-amis-control-human-tagbox',
  templateUrl: './amis-control-human-tagbox.component.html',
  styleUrls: ['./amis-control-human-tagbox.component.scss']
})
export class AmisControlHumanTagboxComponent  implements OnInit {

  //#region tagbox
  @ViewChild("tagBox") tagBox;
  timeout;
  @Input() listCandidateSelected: any = [];
  @Output() onValueChanged = new EventEmitter();
  @Input() dataSource: any = []; //  Danh sách ứng viên để thao tác với các selectbox
  // listCandidate: any = []; //  Danh sách ứng viên để thao tác với các selectbox
  listFilter;
  //unknow
  selectbox;
  _tempSearchValue;
  //loading
  _isLoaded = false;
  //load xong
  _isLoadDone = true;
  //lần đầu nhấn control
  _firstTime = true;
  //load lại
  _isReloadData = false;
  dataPath;
  previousSelected = [];
  isSearching = false;
  //loại background
  backgroundType = BackgroundType;
  //unknow
  //#endregion

  constructor(
    private amisTransferSV: AmisTransferDataService,
    private amisTranslateSV: AmisTranslationService,
    public httpBase: AmisDataService,
    private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  onOpened(e) {
    const me = this;
    const objPopSele = document.querySelector('.dx-selectbox-popup-wrapper .dx-overlay-content');
    if (objPopSele) {
      objPopSele.classList.add('pop-select-human');
    }
  }

  //#region tagbox
  onChangeInput() {
    if (this._firstTime) {
      this._firstTime = false;
      this.dataSource.forEach(element => {
        element.UnsignedFullName = AmisStringUtils.convertVNtoENToLower(element.FullName).trim();
      });
    }
  }

  renderID() {
    let arr = this.dataSource.map(m => m.EmployeeID);
    let eleMax = Math.max.apply(null, arr);
    return eleMax + 1;
  }

  /**
   * hàm thêm một email ngoài hệ thống để gửi mail
   *
   * @param {any} e
   * @memberof PopupSendEmailComponent
   * dtnam1(2/7/2020)
   */
  addEmailOutSideSystem(e) {
    let valueMail = "";
    if (e?.event?.target?.value?.trim() !== "") {
      valueMail = AmisCommonUtils.cloneData(e.event.target.value);
      if (this.dataSource.find(x => x.FullName?.includes(valueMail) ||
        x.OfficeEmail?.includes(valueMail) ||
        x.UnsignedFullName?.includes(valueMail) ||
        x.EmployeeCode?.includes(valueMail))) {
        e.event.target.value = "";
        return;
      }

      const isValidateEmail = AmisStringUtils.validateEmail(valueMail);
      if (isValidateEmail) {
        const objMailOut = {
          OfficeEmail: AmisStringUtils.convertVNtoENToLower(valueMail).trim(),
          EmployeeID: this.renderID(),
        };
        if (!this.dataSource.find(x =>
          x.OfficeEmail === objMailOut.OfficeEmail)) {
          // e.component._refresh();
          if (!this.dataSource.find(x => x.OfficeEmail === objMailOut))
            this.dataSource.push(objMailOut);
          this.listCandidateSelected.push(objMailOut.EmployeeID);
          this.listFilter = this.dataSource;
          this.cdr.detectChanges();
        }
      } else {
        this.amisTransferSV.showErrorToast(this.amisTranslateSV.getValueByKey("HUMAN_TAGBOX_INVALID_EMAIL"));

      }
      e.event.target.value = "";
      //reload lại các option
      let temp = this.dataSource;
      this.dataSource = [];
      this.cdr.detectChanges();
      this.dataSource = temp;
      this.cdr.detectChanges();
    }
    this.tagBox.instance.focus();
  }

  onValueChangedFunc() {
    if (this.tagBox?.instance?.option("selectedItems"))
      this.onValueChanged.emit(this.tagBox.instance.option("selectedItems"));
  }
  //#endregion

}
