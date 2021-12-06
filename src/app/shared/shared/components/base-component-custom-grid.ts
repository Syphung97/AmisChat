import { OnDestroy, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { BaseComponent } from 'src/common/components/base-component';
import { FormMode } from 'src/common/enum/form-mode.enum';
import { AmisCommonUtils } from 'src/common/fn/common-utils';
import { ContextMenu } from '../enum/context-menu/context-menu.enum';
import { DataService } from 'src/app/services/data/data.service';
import { AmisStringUtils } from 'src/common/fn/string-utils';
import { AmisTransferDataService } from 'src/common/services/amis-transfer-data.service';
import { AmisTranslationService } from 'src/common/services/amis-translation.service';
import * as _ from "lodash";
import { SubSystemCode } from 'src/app/shared/constant/sub-system-code/sub-system-code';
import { PermissionCode } from 'src/app/shared/constant/permission-code/permission-code';
import {SessionStorageUtils} from 'src/common/fn/session-storage-utils'

export class BaseCustomGridComponent extends BaseComponent implements OnDestroy, OnInit {

    @Input() formMode: FormMode = FormMode.Insert;

    // Dữ liệu truyền vào
    @Input() set inputparam(data) {
        if (data) {
            this.initForm(data);
        }
    }

    // Vị trí hiển thị của form thêm sửa dữ liệu của grid
    @Input() formPosition: string = "";

    // form mode cua thang cha
    @Input() masterFormMode: FormMode;

    //sau khi lưu data thành công
    @Output() afterSaveDataSuccess: EventEmitter<any> = new EventEmitter();

    // Subsystem code thực hiện hành động
    subSystemActionCode: any;

    // PermissionCode thực hiện hành động
    permissionActionCode: any;

    // Custom permission truyền vào
    permissionObject: any;

    // Có bỏ qua check quyền hay không
    isIgnorePermission: boolean = false;

    // nameDelete
    contentDelete: string = "";

    // Grid Config
    gridConfig: any;

    // Danh sách dữ liệu
    dataSourceGrid: any = [];

    // Danh sách cột
    gridColumns: any = [];

    // Grid có giá trị hay không
    isHaveData: boolean = false;

    // Giá trị của master
    masterValue: any;

    // field liên kết với master
    masterField: string;

    // Khóa chính của object
    primaryKey: string

    // Controller dùng để thêm, sửa dữ liệu trên grid
    controller: string;

    // Danh sách object trong grid
    listObject = [];

    // Danh sách option trong dấu 3 chấm
    listOption: any = [
        {
            Key: ContextMenu.Edit,
            Text: this.amisTranslateSV.getValueByKey("EDIT2"),
            Icon: 'icon-edit',
            Class: '',
            SubSystemCode: this.subSystemActionCode,
            PermissionCode: PermissionCode.Edit
          },
          {
            Key: ContextMenu.Delete,
            Text: this.amisTranslateSV.getValueByKey("DELETE"),
            Icon: 'icon-delete-red',
            Class: 'deleted',
            SubSystemCode: this.subSystemActionCode,
            PermissionCode: PermissionCode.Delete
          }
    ]

    // Hiển thị popup confirm xóa dữ liệu
    isShowDeleteDataGrid: boolean = false;

    // Nội dung popup confirm xóa dữ liệu
    contentPopupDelete: string = '';

    configGridTable: any;

    // Subsytem code
    subsys: any;

    isAllowSelect: any;

    // Object dữ liệu xóa
    objectDelete: any;

    // đã load xong danh sách cột chưa
    isLoaded: boolean = false;

    // Custom sort
    customOrder = [];

    sSUInstanse: any = SessionStorageUtils;

    constructor(
        public dataService: DataService,
        public amisTransferSV: AmisTransferDataService,
        public amisTranslateSV: AmisTranslationService,
    ) {
        super();
    }

    ngOnInit() {
        // this.getGridConfig();
    }

    //#region Binding form

    /**
     * Lấy grid config
     * @memberof BaseCustomGridComponent
     * created by vhtruong - 09/07/2020
     * 
     */
    getGridConfig() {
        this.dataService.getGridConfig(this.subsys).subscribe(res => {
            if (res?.Success && res.Data) {
                this.gridConfig = res.Data;
                this.gridColumns = res.Data.GridFieldConfigs
                this.isLoaded = true;
            }
        }, error => {

        })
    }


    /**
     * init form để override
     * @param {any} data 
     * @memberof BaseCustomGridComponent
     * created by vhtruong - 09/07/2020
     */
    initForm(data) {
        // Override
    }

    //#endregion

    //#region Action liên quan đến grid

    /**
     * click vào 1 dòng
     * @param {any} e 
     * @memberof BaseCustomGridComponent
     * created by vhtruong - 08/07/2020
     */
    onClickRow(e) {
        this.loadForm({
            FormMode: FormMode.View,
            Data: e.data
        });
    }


    /**
     * Xử lý action trong context menu
     * @param {any} e 
     * @memberof BaseCustomGridComponent
     * created by vhtruong - 08/07/2020
     */
    contextMenuExecuteAction(e) {
        if (e) {
            if (e.Key === ContextMenu.Edit) {
                this.loadForm({
                    FormMode: FormMode.Update,
                    Data: e.Data
                });
            } else if (e.Key === ContextMenu.Delete) {
                this.onDelete({
                    Data: e.Data
                });
            }
        }
    }

    clickOptions(e) {

    }

    chooseRecord(e) {

    }


    /**
     * Lưu custom cột
     * @param {any} data 
     * @memberof BaseCustomGridComponent
     * created by vhtruong - 09/07/2020
     */
    saveCustomColumns(data) {
        if (this.gridConfig) {
            if (AmisCommonUtils.IsArray(data)) {
                this.gridConfig.GridFieldConfigs = data;
                this.dataService.saveLayoutGridConfig(this.gridConfig).subscribe(res => {
                });
            } else {
                this.gridConfig = data;
                this.dataService.saveLayoutGridConfig(this.gridConfig).subscribe(res => {
                });
            }
        }
    }

    //#endregion

    //#region Xử lý thay đổi dữ liệu

    /**
     * Lấy index của dữ liệu trong grid
     * @returns 
     * @memberof BaseCustomGridComponent
     * created by vhtruong - 09/07/2020
     */
    getIndexGrid() {
        let index = 0;
        this.listObject?.forEach(e => {
            if (e.IndexGrid) {
                if (e.IndexGrid > index) {
                    index = e.IndexGrid;
                }
            }
        })
        return index + 1;
    }


    /**
     * Set hiển thị có dữ liệu trên bảng hay không
     * @memberof BaseCustomGridComponent
     * created by vhtruong - 09/07/2020
     */
    setHaveData() {
        this.isHaveData = this.dataSourceGrid?.length ? true : false;
    }

    /**
      * Sự kiện lưu giá trị từ form thêm
      * @param {any} e 
      * @memberof BaseCustomGridComponent
      * created by vhtruong - 09/07/2020
      */
    onSaveForm(e) {
        if (e) {
            // Form cuar master là thêm mới hoặc nhân bản thì gọi lên api cùng master
            if (this.formMode === FormMode.Insert || this.formMode === FormMode.Duplicate) {

                // Nếu form submit detail không phải là Lưu và thêm mới thì tắt form
                if (e.FormModeSubmit != FormMode.SaveAndInsert) {
                    this.onCloseForm();
                }

                // Thêm State cho model để gửi lên server theo master
                e.Data.State = FormMode.Insert;


                if (e.FormModeSubmit === FormMode.Update) {
                    let index = this.listObject.findIndex(t => t.IndexGrid === e.Data.IndexGrid);
                    if (index != -1) {
                        this.listObject[index] = e.Data;
                        this.initDataInGrid();
                    }
                } else if (e.FormModeSubmit === FormMode.Insert || e.FormModeSubmit === FormMode.SaveAndInsert) {
                    e.Data.IndexGrid = this.getIndexGrid();
                    this.listObject.push(e.Data);
                    this.initDataInGrid();
                }
                this.setHaveData();
                // Form của master là sửa hoặc xem chi tiết thì gọi lên api luôn
            } else if (this.formMode === FormMode.Update || this.formMode === FormMode.View) {

                // Gán state cho object
                if (e.FormModeSubmit == FormMode.Update) {
                    let index = this.listObject.findIndex(t => t[this.primaryKey] === e.Data[this.primaryKey]);
                    if (index != -1) {
                        this.listObject[index] = e.Data;
                    }
                } else if (e.FormModeSubmit === FormMode.Insert || e.FormModeSubmit === FormMode.SaveAndInsert) {
                    this.listObject.push(e.Data);
                }

                if (e.FormModeSubmit != FormMode.SaveAndInsert) {
                    this.onCloseForm();
                    this.initDataInGrid();
                }
                this.setHaveData();
            }
        }
    }


    /**
     * Xóa dữ liệu trong bảng
     * @memberof BaseCustomGridComponent
     * created by vhtruong - 09/07/2020
     */
    onDelete(e) {
        this.objectDelete = e;
        this.showPopupConfirmDelete();
    }


    /**
     * Hiển thị popup confirm xóa dòng
     * @memberof BaseCustomGridComponent
     * created by vhtruong - 10/07/2020
     */
    showPopupConfirmDelete() {
        this.contentPopupDelete = AmisStringUtils.MergeData(this.contentDelete, this.objectDelete?.Data);
        this.isShowDeleteDataGrid = true;
    }


    /**
     * Đóng popup confirm xóa dữ liệu
     * @param {any} e 
     * @memberof BaseCustomGridComponent
     * created by vhtruong - 10/07/2020
     */
    closePopupDelete(e) {
        this.isShowDeleteDataGrid = false;
    }


    /**
     * Xóa dữ liệu
     * @param {any} e 
     * @memberof BaseCustomGridComponent
     * created by vhtruong - 20/07/2020
     */
    onDeleteForm(e) {
        //override
    }


    /**
     * Xác nhận xóa dữ liệu
     * @memberof BaseCustomGridComponent
     */
    deleteDataGrid(e) {
        if (this.objectDelete) {
            // Form cuar master là thêm mới hoặc nhân bản thì gọi lên api cùng master
            if (this.formMode === FormMode.Insert || this.formMode === FormMode.Duplicate) {

                let index = this.listObject.findIndex(t => t.IndexGrid === this.objectDelete.Data.IndexGrid);
                if (index != -1) {
                    this.listObject.splice(index, 1);
                    this.initDataInGrid();
                    this.setHaveData();
                }

                // Form của master là sửa hoặc xem chi tiết thì gọi lên api luôn
            } else if (this.formMode === FormMode.Update || this.formMode === FormMode.View) {

                this.dataService.delete(this.controller, [this.objectDelete.Data]).subscribe(res => {
                    if (res?.Success) {
                        let index = this.listObject.findIndex(t => t[this.primaryKey] === this.objectDelete.Data[this.primaryKey]);
                        if (index != -1) {
                            this.listObject.splice(index, 1);
                            this.initDataInGrid();
                            this.setHaveData();
                            this.amisTransferSV.showSuccessToast(this.amisTranslateSV.getValueByKey("DELETE_SUCCESS"));
                            this.afterSaveDataSuccess.emit();
                        }
                        return;
                    }
                    this.amisTransferSV.showErrorToast();
                }, error => {
                    this.amisTransferSV.showErrorToast();
                })
            }
        }
    }


    //#endregion

    //#region Đóng mở form thêm mới, sửa

    /**
     * Mở form thêm sửa dữ liệu
     * @memberof BaseCustomGridComponent
     * created by vhtruong - 09/07/2020
     */
    loadForm(data) {
        // Override
    }

    /**
     * Đóng form thêm sửa
     * @memberof BaseCustomGridComponent
     * created by vhtruong - 09/07/2020
     */
    onCloseForm() {
        // Override
    }


    /**
     * Xử lý lại dữ liệu để hiển thị
     * @memberof BaseCustomGridComponent
     * created by vhtruong - 20/07/2020
     */
    initDataInGrid() {
        this.dataSourceGrid = AmisCommonUtils.cloneDataArray(this.listObject);
        if (this.customOrder?.length) {
            this.dataSourceGrid = _.orderBy(this.dataSourceGrid, this.customOrder.map(e => e.FieldName), this.customOrder.map(e => e.OrderBy?.toLowerCase()));
        }
    }

    //#endregion
}

