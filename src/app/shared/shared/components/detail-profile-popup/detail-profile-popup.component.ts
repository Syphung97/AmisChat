import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ButtonColor } from '../../enum/common/button-color.enum';
import { ButtonType } from '../../enum/common/button-type.enum';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { TypeControl } from '../../enum/common/type-control.enum';
import { ContextMenu } from '../../enum/context-menu/context-menu.enum';
import { AmisTranslationService } from 'src/common/services/amis-translation.service';
@Component({
  selector: 'amis-detail-profile-popup',
  templateUrl: './detail-profile-popup.component.html',
  styleUrls: ['./detail-profile-popup.component.scss']
})
export class DetailProfilePopupComponent implements OnInit {
  @Input() employee: any;
  @Input() visiblePopup: boolean;
  @Input() width: number;
  @Output() closed = new EventEmitter<boolean>();
  @Output() see = new EventEmitter<boolean>();
  @Output() editEmployee = new EventEmitter<number>();
  // Màu của button
  buttonColor = ButtonColor;
  // Loại butotn
  buttonType = ButtonType;
  typeControl = TypeControl;
  @Input() mainInfo: any[];
  contextMenuList = [
    {
      Key: ContextMenu.Edit,
      Text: this.translateSV.getValueByKey('CONTEXT_MENU_EDIT'),
      Icon: '',
      Class: ''
    },
    {
      Key: ContextMenu.DisActive,
      Text: this.translateSV.getValueByKey('CONTEXT_MENU_DISACTIVE'),
      Icon: '',
      Class: ''
    },
    {
      Key: ContextMenu.NotifyNewsfeed,
      Text: this.translateSV.getValueByKey('CONTEXT_MENU_NOTIFY_NEWFEED'),
      Icon: '',
      Class: ''
    },

    {
      Key: ContextMenu.EmployeeSelfUpdate,
      Text: this.translateSV.getValueByKey('CONTEXT_MENU_EMPLOYEE_SELF_UPDATE'),
      Icon: '',
      Class: ''
    },

    {
      Key: ContextMenu.AdjustOrganization,
      Text: this.translateSV.getValueByKey('CONTEXT_MENU_ADJUST_ORGANIZATION'),
      Icon: '',
      Class: ''
    },
    {
      Key: ContextMenu.MergeData,
      Text: this.translateSV.getValueByKey('CONTEXT_MENU_MERGE_DATA'),
      Class: '',
      Icon: ''
    },

    {
      Key: ContextMenu.Print,
      Text: this.translateSV.getValueByKey('CONTEXT_MENU_PRINT'),
      Class: '',
      Icon: ''
    },

    {
      Key: ContextMenu.Export,
      Text: this.translateSV.getValueByKey('CONTEXT_MENU_EXPORT'),
      Icon: '',
      Class: '',
      Submenu: [
        {
          Key: ContextMenu.ExportExcel,
          Text: this.translateSV.getValueByKey('CONTEXT_MENU_EPORT_EXCEL'),
          Icon: 'icon-export-excel',
          Class: ''
        },
        {
          Key: ContextMenu.ExportPDF,
          Text: this.translateSV.getValueByKey('CONTEXT_MENU_EPORT_PDF'),
          Icon: 'icon-export-pdf',
          Class: ''
        },
        {
          Key: ContextMenu.AdvanceExport,
          Text: this.translateSV.getValueByKey('CONTEXT_MENU_EPORT_ADVANCED_EXPORT'),
          Icon: 'icon-advance-export',
          Class: ''
        }
      ]
    },
    {
      Key: ContextMenu.Delete,
      Text: this.translateSV.getValueByKey('CONTEXT_MENU_EPORT_DELETE'),
      Icon: '',
      Class: 'deleted'
    },
  ];
  constructor(private router: Router, private translateSV: AmisTranslationService) { }

  ngOnInit(): void {
    // this.mainInfo.forEach(element => {
    //   if (!this.employee[element.FieldName])
    //     this.employee[element.FieldName] = "--";
    //   else {
    //     if (element.FieldName.includes("Day"))
    //       this.employee[element.FieldName] = moment(this.employee[element.FieldName], 'YYYY/MM/DD').format('DD/MM/YYYY');
    //   }
    // });
  }

  seeDetail() {
    this.see.emit(false);
  }

  onClose() {
    this.closed.emit(false);
  }

  editEmployeeDetail() {
    this.editEmployee.emit(this.employee.EmployeeID);
  }

  toobarExecuteAction(e){

  }

}
