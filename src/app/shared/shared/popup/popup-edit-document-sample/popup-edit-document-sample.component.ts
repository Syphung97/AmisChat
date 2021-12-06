import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { ButtonType } from '../../enum/common/button-type.enum';
import { ButtonColor } from '../../enum/common/button-color.enum';
import { AmisTranslationService } from 'src/common/services/amis-translation.service';
import { AmisTransferDataService } from 'src/common/services/amis-transfer-data.service';
import { JobPosition } from 'src/app/shared/models/job-position/job-position';
import { FormMode } from 'src/common/enum/form-mode.enum';
import { TypeShowControl } from 'src/common/models/base/typeShow';
import { ConfigService } from 'src/app/services/config/config.serice';
import { GroupConfigUtils } from 'src/app/shared/function/group-control-utils';
import { JobPositionRole } from '../../models/job-position-role/job-position-role';
import { AmisCommonUtils } from 'src/common/fn/common-utils';
import { BaseComponent } from 'src/common/components/base-component';

@Component({
  selector: 'amis-popup-edit-document-sample',
  templateUrl: './popup-edit-document-sample.component.html',
  styleUrls: ['./popup-edit-document-sample.component.scss']
})
export class PopupEditDocumentSampleComponent extends BaseComponent implements OnInit {

  //#region amis control form group

  //biến vai trò công việc thêm sửa
  currentJobPosition = new JobPosition();
  //biến vai trò công việc thêm sửa
  currentJobRole = new JobPositionRole();
  formMode: FormMode;
  listGroupConfigs: any = [];
  inputCurrentJobRole: JobPositionRole;
  //submit thông tin
  isSubmit: boolean = false;
  viewJobPosition: number = FormMode.Insert;
  //type control
  typeShow = new TypeShowControl();
  //#endregion

  @ViewChild('form') form: ElementRef;
  @Input() dataSource: any;
  @Input()
  visiblePopup = false;

  // title pop
  @Input()
  title = 'Chỉnh sửa mẫu văn bản';

  // SubsystemCode
  @Input()
  SubsystemCode: string = "Template";

  // LayoutConfigID
  @Input()
  LayoutConfigID: number = 4;

  // danh sách config
  @Input() set groupConfig(data) {
    if (data) {
      this.listGroupConfigs = data;
    }
  }

  // Output hủy
  @Output()
  outputCancel: EventEmitter<any> = new EventEmitter<any>();

  // Output hủy
  @Output()
  templateEdit: EventEmitter<any> = new EventEmitter<any>();

  buttonType = ButtonType;
  buttonColor = ButtonColor;
  /**
   * thông tin mẫu văn bản sau chỉnh sửa
   */
  updatedData = [];

  /**
   * Map các trường của mẫu văn bản trả về từ sv vs tệp mẫu tải lên
   */
  mapFieldName = [
    { key: 'AttachmentID', value: 'FileName' },
    { key: 'TemplateName', value: 'TemplateName' },
    { key: 'Description', value: 'Description' },
    { key: 'AttachmentFileSize', value: 'FileSize' },
    { key: 'TemplateTypeID', value: 'TemplateTypeID' }
  ];

  visibleForm: boolean = false;

  constructor(private translateSV: AmisTranslationService,
    private amisTransferDataSV: AmisTransferDataService,
    private configService: ConfigService,
    private cdr: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit(): void {
    this.getTemplateConfig();
  }
  //#region popup base
  /**
   * đóng popup
   */
  closePopup() {
    this.cancel();
  }
  /**
   * Xử lý đóng popup
   */
  cancel() {
    this.outputCancel.emit(true);
  }
  /**
   * Bắt sk click button save
   */
  submit(formMode) {
    if (formMode) {

      this.formMode = formMode;
      this.isSubmit = AmisCommonUtils.cloneData({ IsSubmit: true });
    }
  }
  //#endregion

  //#region amis control form group

  /**
     * Hàm nhận giá trị sau khi validate từ form
     * @param {any} event
     */
  afterValidated(event) {
    if (event?.length) {
      return;
    }
    this.saveData();
  }

  /**
   * Lấy config mẫu văn bản
   *  created by dtnam1 - 05/06/2020
   */
  getTemplateConfig() {
    if (this.listGroupConfigs?.length) {
      this.listGroupConfigs = GroupConfigUtils.GetData(this.listGroupConfigs);
      this.assignDataGroupConfig();
      return;
    }
    let param = {
      SubsystemCode: this.SubsystemCode,
      LayoutConfigID: this.LayoutConfigID
    }
    this.configService.getLayoutConfig(param).subscribe(res => {
      if (res.Success && res?.Data?.ListGroupConfig[0]) {
        let data = res.Data.ListGroupConfig;
        this.listGroupConfigs = GroupConfigUtils.GetData(data);

        // this.configDataSelectbox(this.listGroupConfigs[0].GroupFieldConfigs);
        this.assignDataGroupConfig();
        setTimeout(() => {
          this.visibleForm = true;
        }, 500);
      }
    });
  }

  /**
   * Gán data cho groupConfig
   * Created by PVTHONG 08/07/2020
   */
  assignDataGroupConfig() {
    if(!this.listGroupConfigs[0]?.GroupFieldConfigs?.length || !this.dataSource){
      return;
    }
    this.listGroupConfigs[0].GroupFieldConfigs.forEach(groupConfig => {
      //map các trường
      //gán các giá trị truyền từ component cha vào groupConfig
      let fieldNameOfConfig = groupConfig?.FieldName;
      if (fieldNameOfConfig) {
        let fieldName = this.mapFieldName.find(x => x.key === fieldNameOfConfig);
        //lưu các giá trị vào trường value và valueText trong groupConfig
        if (fieldName?.key === 'TemplateTypeID') {
          groupConfig.ValueText = this.dataSource['TemplateTypeName'];
          groupConfig.Value = this.dataSource['TemplateTypeID'];
        } else {
          groupConfig.ValueText = this.dataSource[fieldName?.value];
          groupConfig.Value = this.dataSource[fieldName?.value];
        }

        //Ẩn đi các trường k cần thiết
        if (["AttachmentID", "Content", "AttachmentFileSize"].includes(fieldNameOfConfig)) {
          if (groupConfig.IsUse) {
            groupConfig.IsUse = false;

          }
        }
      }
    });
  }

  /**
   * Update data của mẫu văn bản
   */
  saveData() {
    this.listGroupConfigs[0].GroupFieldConfigs.forEach(groupConfig => {
      let value = groupConfig.Value;
      let valueText = groupConfig.ValueText;
      let fieldNameOfConfig = groupConfig.FieldName;
      if (fieldNameOfConfig) {
        //Lấy các giá trị từ groupConfig ra dataSource
        let fieldName = this.mapFieldName.find(x => x.key === fieldNameOfConfig);
        if (fieldName?.key === 'TemplateTypeID' && valueText && value) {
          this.dataSource['TemplateTypeName'] = valueText;
          this.dataSource[fieldName.value] = value;
        } else {
          if (value)
            this.dataSource[fieldName?.value] = value;
        }
      }
    });
    //truyền dataSource lên component cha
    this.templateEdit.emit(this.dataSource);
    this.visiblePopup = false;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.amisTransferDataSV.showSuccessToast(this.translateSV.getValueByKey("IMPORT_TEMPLATE_EDIT_SUCCESS"));
    }, 200);
  }

  //#endregion

}
