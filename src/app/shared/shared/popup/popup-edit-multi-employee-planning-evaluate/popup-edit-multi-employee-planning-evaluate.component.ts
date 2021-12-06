import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TypeControl } from '../../enum/common/type-control.enum';
import { AmisTranslationService } from 'src/common/services/amis-translation.service';
import { AmisDataService } from 'src/common/services/amis-data.service';
import { AmisCommonUtils } from 'src/common/fn/common-utils';
import { AmisStringUtils } from 'src/common/fn/string-utils';
import { FormMode } from 'src/common/enum/form-mode.enum';
import { BaseCustomGridComponent } from '../../components/base-component-custom-grid';
import { DataService } from 'src/app/services/data/data.service';
import { ContextMenu } from '../../enum/context-menu/context-menu.enum';
import { AmisTransferDataService } from 'src/common/services/amis-transfer-data.service';

@Component({
  selector: 'amis-popup-edit-multi-employee-planning-evaluate',
  templateUrl: './popup-edit-multi-employee-planning-evaluate.component.html',
  styleUrls: ['./popup-edit-multi-employee-planning-evaluate.component.scss']
})

export class PopupEditMultiEmployeePlanningEvaluateComponent extends BaseCustomGridComponent implements OnInit {

  filterValue: string;   //value tìm kiếm

  isClearSelect: boolean = false;

  isVisiblePopupSelect: boolean = false;
  @Input()
  visiblePopup = false;

  @Input()
  masterFormMode: FormMode;

  @Input() set selectedEmployeeEvaluations(value) { // danh sách những tiêu chí được chọn
    if (value?.length) {
      this.dataSource = value;
      this.dataFilter = AmisCommonUtils.cloneDataArray(this.dataSource);
    }
  }

  @Input() currentJobPositionPhase: any; // vị trí quy hoạch đang được chọn

  @Output()
  onClosePopup: EventEmitter<any> = new EventEmitter();

  @Output()
  onSavePlanCriteria: EventEmitter<any> = new EventEmitter();
  // Danh sách option trong dấu 3 chấm
  listOption = [
    {
      Key: ContextMenu.Delete,
      Text: "Xóa",
      Icon: 'icon-close-red'
    }
  ]

  /**
* Các thông tin của form popup xóa
*/
  popupDelete = {
    TitlePopupDelete: "",
    VisiblePopupDelete: false,
    ContentPopupDelete: "",
    ItemDelete: null
  }


  pagingParam = {
    PageIndex: 0,
    PageSize: 0,
    Filter: "",
    Sort: ""
  }

  //cột grid
  columns: any = [
    {
      Caption: this.translateSV.getValueByKey("HRM_EMPLOYEE_PLANNING_CRITERIA_FORM_PLANNING_CRITERIA_NAME"),
      FieldName: "PlanningCriteriaName",
      IsVisible: true,
      MinWidth: 150,
      SortOrder: 1,
      Width: 200,
    },
    {
      Caption: this.translateSV.getValueByKey("HRM_EMPLOYEE_PLANNING_CRITERIA_FORM_PLANNING_RESULT"),
      FieldName: "ResultEvaluationID",
      DisplayFieldName: "ResultEvaluationName",
      IsVisible: true,
      MinWidth: 150,
      SortOrder: 2,
      Width: 250,
      isEditting: true,
      TypeControl: TypeControl.Combobox,
      Lookup: {
        dataSource: [],
        displayExpr: "PickListValue",
        valueExpr: "PickListID"
      },
      InfoLookup: {
        controller: "Dictionary",
        url: "data",
        params: {
          GroupFieldConfig: {
            LayoutConfigID: 4,
            SubsystemCode: "EmployeePlanningEvaluate",
            TableName: "employee_planning_evaluate",
            FieldName: "ResultEvaluationID"
          }
        }

      },
    },
    {
      Caption: this.translateSV.getValueByKey("HRM_EMPLOYEE_PLANNING_CRITERIA_FORM_PLANNING_COMMENT"),
      FieldName: "Comment",
      IsVisible: true,
      MinWidth: 150,
      SortOrder: 3,
      Width: 300,
      isEditting: true
    }
  ];

  //dữ liệu đổ lên grid
  dataSource: any = [];
  //dữ liệu đã filter
  dataFilter: any = [
  ];

  //thời gian setTimeout
  timeSearch: any;
  visibleGrid: boolean = true;
  visibleImport: boolean = true;

  //lưu dữ liệu grid
  isSubmit = { isSubmit: false };

  constructor(
    private translateSV: AmisTranslationService,
    public amisDataSV: AmisDataService,
    public dataService: DataService,
    public amisTransferSV: AmisTransferDataService,
    public amisTranslateSV: AmisTranslationService,
  ) { super(dataService, amisTransferSV, amisTranslateSV); }

  ngOnInit(): void {
  }

  /**
   * Lấy những thằng được chọn sau khi submit
   * nmduy 09/07/2020
   */
  submitSaveData(e) {
    this.onSavePlanCriteria.emit(e);
    this.closePopup();
  }


  /**
  * hàm xử lí khi thay đổi giá trị search
  * nmduy 09/07/2020
  * @param e
  */
  onSearchControl(e) {
    let searchText = e.element.querySelector('.dx-texteditor-input').value;
    if (e?.element?.querySelector('.dx-texteditor-input')?.value) {
      clearTimeout(this.timeSearch);
      this.timeSearch = setTimeout(() => {
        this.filterValue = searchText;
        searchText = AmisStringUtils.convertVNtoENToLower(searchText).trim();
        this.dataFilter = this.dataSource.filter(f => AmisStringUtils.convertVNtoENToLower(f.PlanningCriteriaName).includes(searchText));
      }, 500);
    } else {
      this.dataFilter = AmisCommonUtils.cloneData(this.dataSource);
    }
  }

  /**
   * Thay đổi giá trị text box
   * nmduy 20/07/2020
   */
  onValueTextboxChange(e) {
    if (e && e.event && e.event.type == "dxclick") {
      this.dataFilter = AmisCommonUtils.cloneData(this.dataSource);
    }
  }

  /**
   * Hiển thị popup chọn tiêu chí đánh giá
   * nmduy 13/07/2020
   */
  onShowPopupChoosePlanningCriteria() {
    this.isVisiblePopupSelect = true;
  }

  /**
   * đóng popup
   */
  closePopup() {
    this.visiblePopup = false;
    this.onClosePopup.emit();
  }

  /**
   * Click lưu 
   * nmduy 09/07/2020
   */
  save() {
    this.isSubmit = AmisCommonUtils.cloneData({ isSubmit: true });
  }

  /**
   * Hứng dữ liệu đổ ra từ popup chọn 
   * nmduy 10/07/2020
   */
  onSelectPlanCriteria(e) {
    if (e?.length) {
      this.dataSource = this.dataSource.concat(e);
      this.dataFilter = this.dataFilter.concat(e);
    }
  }

  /**
 * ouput dataSource khi thay đổi
 * Created By PVTHONG 07/07/2020
 */
  outputDataSource(selectedItems) {
    this.dataSource = AmisCommonUtils.cloneDataArray(selectedItems);
    for (let i = 0; i < selectedItems.length; i++) {
      const element = selectedItems[i];
      const index = this.dataFilter.findIndex(i => i.PlanningCriteriaID == element.PlanningCriteriaID);
      if (index > -1) {
        this.dataFilter[index] = element;
      }
    }
  }

  /**
   * Xóa tất cả 
   * nmduy 10/07/2020
   */
  onDeleteItems() {
    const me = this;
    me.popupDelete.VisiblePopupDelete = true;
    me.popupDelete.TitlePopupDelete = this.translateSV.getValueByKey("HRM_EMPLOYEE_PLANNING_CRITERIA_DELETE_TITLE");
    me.popupDelete.ContentPopupDelete = this.translateSV.getValueByKey("HRM_EMPLOYEE_PLANNING_CRITERIA_DELETE_MULTI_CONFIRM");
  }

  /**
   * Sự kiện hủy popup Xóa
   * nmduy 17/12/2019
   * @param e
   */
  cancelPopupDelete(e) {
    const me = this;
    me.popupDelete.VisiblePopupDelete = false;
  }

  /**
   * Sự kiện xác nhận xóa
   * nmduy 17/12/2019
   * @param e
   */
  confirmPopupDelete(e) {
    const me = this;
    me.popupDelete.VisiblePopupDelete = false;
    this.dataSource = [];
    this.dataFilter = [];
  }


  /**
   * click xóa trên 1 dòng
   * nmduy 13/07/2020
   */
  contextMenuExecuteAction(e) {
    let data = e.SelectedRow.data;
    this.dataSource = this.dataSource.filter(item => item.PlanningCriteriaID != data.PlanningCriteriaID);
    this.dataFilter = this.dataFilter.filter(item => item.PlanningCriteriaID != data.PlanningCriteriaID);
  }
}
