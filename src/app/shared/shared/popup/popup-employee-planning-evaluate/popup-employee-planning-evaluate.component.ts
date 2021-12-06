import { Component, OnInit, Input, Output, EventEmitter, ViewContainerRef, ViewChild } from '@angular/core';
import { TypeControl } from '../../enum/common/type-control.enum';
import { AmisTranslationService } from 'src/common/services/amis-translation.service';
import { AmisDataService } from 'src/common/services/amis-data.service';
import { PlanningCriteriaService } from 'src/app/services/planning-criteria/planning-criteria.service';
import { AmisStringUtils } from 'src/common/fn/string-utils';
import { AmisCommonUtils } from 'src/common/fn/common-utils';
import { JobPositionService } from 'src/app/services/job-position/job-position.service';
import { BaseComponent } from 'src/common/components/base-component';
import { GroupType } from '../../enum/group-config/group-type.enum';
import { ColumnGroup } from '../../enum/group-config/column-group.enum';
import { EmployeePlanningEvaluate } from '../../models/planning-phase/employee-planning-evaluate/employee-planning-evaluate';
import { AmisPagingGridComponent } from 'src/common/components/amis-grid/amis-paging-grid/amis-paging-grid.component';

@Component({
  selector: 'amis-popup-employee-planning-evaluate',
  templateUrl: './popup-employee-planning-evaluate.component.html',
  styleUrls: ['./popup-employee-planning-evaluate.component.scss']
})
export class PopupEmployeePlanningEvaluateComponent extends BaseComponent implements OnInit {

  @ViewChild('grid')
  grid: AmisPagingGridComponent;

  @ViewChild('planningCriteriaForm', { read: ViewContainerRef }) planningCriteriaForm: ViewContainerRef;

  selectedJobPositionID: number; // vị trí công việc được chọn

  filterValue: string = "";   //value tìm kiếm

  listJobPositions = []; // danh sách vị trí công việc

  isLoadedJobPositions: boolean = false;

  visiblePopupAdd: boolean = false;

  subsys = "EmployeePlanningEvaluate";

  isGetAllEvaluate: boolean = false;

  @Input()
  visiblePopup = false;

  @Input()
  formPosition = "";

  @Input()
  selectedEmployeeEvaluations = []; // danh sách những tiêu chí đã được chọn

  @Input() currentJobPositionPhase: any; // vị trí quy hoạch đang được chọn

  @Output()
  onClosePopup: EventEmitter<any> = new EventEmitter();

  @Output()
  onSelectPlanCriteria: EventEmitter<any> = new EventEmitter();

  selectedData = [];

  currentItem = new EmployeePlanningEvaluate();

  pagingParam = {
    PageIndex: 0,
    PageSize: 0,
    Filter: "",
    Sort: ""
  }

  isSave: boolean = false; // biến check xác định là click lưu dữ liệu 

  //cột grid
  columns: any = [
    {
      Caption: this.amisTranslateSV.getValueByKey("HRM_EMPLOYEE_PLANNING_CRITERIA_FORM_PLANNING_CRITERIA_NAME"),
      FieldName: "PlanningCriteriaName",
      IsVisible: true,
      MinWidth: 150,
      SortOrder: 1,
      Width: 230,
    },
    {
      Caption: this.amisTranslateSV.getValueByKey("HRM_EMPLOYEE_PLANNING_CRITERIA_FORM_PLANNING_RESULT"),
      FieldName: "ResultEvaluationID",
      DisplayFieldName: "ResultEvaluationName",
      IsVisible: true,
      MinWidth: 150,
      SortOrder: 2,
      Width: 200,
      isEditting: true,
      IsRequire: true,
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
      Caption: this.amisTranslateSV.getValueByKey("HRM_EMPLOYEE_PLANNING_CRITERIA_FORM_PLANNING_COMMENT"),
      FieldName: "Comment",
      IsVisible: true,
      MinWidth: 150,
      SortOrder: 3,
      Width: 300,
      isEditting: true
    }
  ];

  dependentDatas = [
    {
      FieldName: "ApplyAllJobPosition",
      Operator: 1,
      Value: true,
      Config: JSON.stringify([
        {
          FieldName: "JobPositionID",
          IsReadOnly: true,
          Value: null,
          ValueText: null,
          IsRequire: false,
          ControlValue: []

        }
      ])
    },
    {
      FieldName: "ApplyAllJobPosition",
      Operator: 1,
      Value: false,
      Config: JSON.stringify([
        {
          FieldName: "JobPositionID",
          IsReadOnly: false,
          IsRequire: true
        }
      ])
    }
  ]

  // Group config cho popup thêm 

  _groupConfigs =
    {
      IsVisible: true,
      IsViewWhenAdd: true,
      GroupConfigName: "",
      GroupType: GroupType.Field,
      ColumnGroup: ColumnGroup.OneCol,
      GroupFieldConfigs: [
        {
          FieldName: "PlanningCriteriaName",
          Caption: this.amisTranslateSV.getValueByKey("HRM_SETTING_PLANNING_CRITERIA_FORM_NAME"),
          RowIndex: 1,
          ColumnIndex: 1,
          TypeControl: 0,
          IsRequire: true,
          IsUse: true,
          SortOrder: 1,
          IsVisible: true,
        },
        {
          SubsystemCode: "PlanningCriteria",
          TableName: "planning_criteria",
          FieldName: "JobPositionID",
          DisplayField: "JobPositionName",
          FieldNameSource: "JobPositionID",
          DisplayFieldSource: "JobPositionName",
          Caption: this.amisTranslateSV.getValueByKey("HRM_SETTING_PLANNING_CRITERIA_FORM_JOB_POSITION"),
          RowIndex: 2,
          ColumnIndex: 1,
          TypeControl: 4,
          IsRequire: true,
          IsUse: true,
          SortOrder: 5,
          IsVisible: true,
          IsReadOnly: false
        },
        {
          FieldName: "ApplyAllJobPosition",
          Caption: this.amisTranslateSV.getValueByKey("HRM_SETTING_PLANNING_CRITERIA_FORM_APPLY_ALL_JOB"),
          RowIndex: 3,
          ColumnIndex: 1,
          TypeControl: 12,
          IsUse: true,
          SortOrder: 3,
          IsVisible: true,
          Value: false,
        },
      ]
    };

  optionAllJobPosition = {
    JobPositionID: -1,
    JobPositionName: this.amisTranslateSV.getValueByKey("HRM_EMPLOYEE_PLANNING_CRITERIA_ALL_JOB")
  }


  //dữ liệu đổ lên grid
  dataSource = [];

  //thời gian setTimeout
  timeSearch: any;
  visibleGrid: boolean = true;
  visibleImport: boolean = true;

  offsetY = "";
  height = 400;

  //lưu dữ liệu grid
  isSubmit = { isSubmit: false };

  //lưu dữ liệu grid
  isSaveGrid = { isSaveGrid: false };

  constructor(
    private planningCriteriaSV: PlanningCriteriaService,
    private jobPositionSV: JobPositionService,
    private amisTranslateSV: AmisTranslationService,
    public amisDataSV: AmisDataService
  ) { super(); }

  ngOnInit(): void {

    this.getJobPositionPhase();
  }

  /**
   * Giá trị select box thay đổi
   * nmduy 09/07/2020
   */
  onValueChanged(e) {
    if (e?.previousValue) {
      this.getPlanningCriteria();
    }
  }


  /**
   * Lấy vị trí công việc
   * nmduy 09/07/2020
   */
  getJobPositionPhase() {
    if (this.currentJobPositionPhase) {
      this.listJobPositions = [this.currentJobPositionPhase];
      this.selectedJobPositionID = this.currentJobPositionPhase.JobPositionID;
      this.listJobPositions.unshift(this.optionAllJobPosition);
      this.getPlanningCriteria();
    } else {
      this.getJobPosition();
    }
  }


  /**
   * lấy danh sách vị trí công việc
   * nmduy 09/07/2020
   */
  getJobPosition() {
    if (!this.isLoadedJobPositions) { // nếu chưa gọi service load vị trí công việc
      this.jobPositionSV.getJobPositionPaging(this.pagingParam).subscribe(res => {
        if (res?.Success && res.Data?.PageData?.length) {
          this.isLoadedJobPositions = true;
          this.listJobPositions = res.Data.PageData;
          this.listJobPositions.unshift(this.optionAllJobPosition);
          if (!this.selectedJobPositionID) {
            this.selectedJobPositionID = this.optionAllJobPosition.JobPositionID;
            this.getPlanningCriteria();
          }
        }
      });
    }
  }



  /**
   * Lấy điều kiện lọc theo danh sách tiêu chí chưa được chọn
   * nmduy 10/07/2020
   */
  genFilterCondition() {
    let param = {
      PageIndex: 0,
      PageSize: 0,
      Filter: "",
      Sort: "",
      CustomParam: {
        JobPositionID: 0,
        SubsystemCode: this.subSystemCodeEntity.PlanningPhase
      }
    }
    let filterConditions = [];
    if (this.selectedJobPositionID != -1) { // nếu không phải lấy tất cả vị trí công việc
      param.CustomParam.JobPositionID = this.selectedJobPositionID;
    } else {
      param.CustomParam.JobPositionID = null;
    }
    filterConditions.push(["PlanningCriteriaName", "contains", this.filterValue]);
    if (this.selectedEmployeeEvaluations?.length) {
      for (let i = 0; i < this.selectedEmployeeEvaluations.length; i++) {
        filterConditions.push("AND");
        filterConditions.push(["PlanningCriteriaID", "!=", this.selectedEmployeeEvaluations[i].PlanningCriteriaID]);
      }
    }
    param.Filter = AmisCommonUtils.Base64Encode(JSON.stringify(filterConditions));
    return param;
  }



  /**
   * Lấy danh sách tiêu chí đánh giá theo vị trí công việc
   * nmduy 09/07/2020
   */
  getPlanningCriteria() {
    let param = this.genFilterCondition();
    this.onSaveGrid();
    this.planningCriteriaSV.getByJobPositionID(param).subscribe(res => {
      if (res?.Success && res?.Data) {
        this.handleDataSource(res.Data.PageData);
      }
    });
  }


  /**
   * Xử lý dữ liệu datasource trả về
   * nmduy 20/07/2020
   */
  handleDataSource(data) {
    if (data?.length) {
      for (let i = 0; i < data.length; i++) {
        const index = this.selectedData.findIndex(item => item.PlanningCriteriaID == data[i].PlanningCriteriaID);
        if (index > -1) {
          data[i].ResultEvaluationID = this.selectedData[index].ResultEvaluationID;
          data[i].ResultEvaluationName = this.selectedData[index].ResultEvaluationName;
          data[i].Comment = this.selectedData[index].Comment;
        } else {
          data[i].ResultEvaluationID = 1;
          data[i].ResultEvaluationName = this.amisTranslateSV.getValueByKey("HRM_EMPLOYEE_PLANNING_CRITERIA_NOT_EVALUATE");
          data[i].Comment = "";
        }
      }
    }
    this.dataSource = AmisCommonUtils.cloneDataArray(data);
    this.selectedData = AmisCommonUtils.cloneDataArray(this.selectedData);
  }


  /**
   * Lấy những thằng được chọn sau khi submit
   * nmduy 09/07/2020
   */
  submitSaveData(selectedItems) {
    if (this.isSave) {
      this.onSelectPlanCriteria.emit(selectedItems);
      this.closePopup();
    }
  }


  /**
* select phần tử trong grid
* created by nmduy  - 12/05/2020
*/
  chooseRecord(data) {
    if (data) {
      let listID = this.selectedData.map(e => e.PlanningCriteriaID);
      if (data.currentSelectedRowKeys.length != 0) {
        data.currentSelectedRowKeys.forEach(element => {
          if (listID.indexOf(element.PlanningCriteriaID) < 0) {
            this.selectedData.push(element);
          }
        });
      }
      if (data.currentDeselectedRowKeys.length != 0) {
        let deleteID = data.currentDeselectedRowKeys.map(e => e.PlanningCriteriaID);
        this.selectedData.forEach(ele => {
          if (deleteID.indexOf(ele.PlanningCriteriaID) > -1) {
            this.selectedData = this.selectedData.filter(e => e.PlanningCriteriaID != ele.PlanningCriteriaID);
          }
        });
      }
    }
  }

  /**
* Bỏ chọn bản ghi
* Created by: nmduy  13-05-2020
*/
  removeSelectedRecord() {
    this.selectedData = [];
  }

  /**
  * hàm xử lí khi thay đổi giá trị search
  * nmduy 09/07/2020
  * @param e
  */
  onSearchControl(e) {
    let searchText = e.element.querySelector('.dx-texteditor-input').value;
    clearTimeout(this.timeSearch);
    this.timeSearch = setTimeout(() => {
      searchText = AmisStringUtils.convertVNtoENToLower(searchText).trim();
      this.filterValue = searchText;
      this.getPlanningCriteria();
    }, 500)
  }

  /**
 * Thay đổi giá trị text box
 * nmduy 20/07/2020
 */
  onValueTextboxChange(e) {
    if (e && e.event && e.event.type == "dxclick") {
      this.filterValue = "";
      this.getPlanningCriteria();
    }
  }

  /**
   * ouput dataSource khi thay đổi
   * Created By PVTHONG 07/07/2020
   */
  outputDataSource(selectedItems) {
    for (let i = 0; i < selectedItems.length; i++) {
      const element = selectedItems[i];
      const index = this.selectedData.findIndex(i => i.PlanningCriteriaID == element.PlanningCriteriaID);
      if (index > -1) {
        this.selectedData[index] = element;
      } else {
        this.selectedData.push(element);
      }
    }
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
    this.isSave = true;
    this.isSubmit = AmisCommonUtils.cloneData({ isSubmit: true });
  }


  /**
   * Lấy danh sách các bản ghi được chọn hiện tại
   */
  onSaveGrid() {
    this.isSave = false;
    this.isSaveGrid = AmisCommonUtils.cloneData({ isSaveGrid: true });
  }


  /**
   * Dữ liệu bắn ra từ popup thêm mới
   * nmduy 15/07/2020
   */
  onDataChange(item) {
    this.visiblePopupAdd = false;
    this.getPlanningCriteria();
    // if (this.selectedJobPositionID == this.optionAllJobPosition.JobPositionID || item.ApplyAllJobPosition || this.selectedJobPositionID == item.JobPositionID) {
    //   this.dataSource = this.dataSource.concat(item);
    // }
  }

  /**
   * option lookup change 
   * nmduy 11/09/2020
   */
  lookUpValueChange(e) {
    console.log(e);
  }

  /**
   * Mở popup add
   * nmduy 20/07/2020
   */
  openPopupAdd() {
    this.visiblePopupAdd = true;
    const jobPositionField = this._groupConfigs.GroupFieldConfigs.find(item => item.FieldName == "JobPositionID");
    if (jobPositionField) {
      jobPositionField.IsReadOnly = false;
      jobPositionField.IsRequire = true;
    }
    this.currentItem = new EmployeePlanningEvaluate();
  }

  /**
* set chiều cao grid
* Created by nmduy 19/05/2020
*/
  resizeGrid() {
    if (window.innerHeight < 768) {
      this.offsetY = "0 50px"
      this.height = 300;
    }
  }
}
