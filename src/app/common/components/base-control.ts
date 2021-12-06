import { BaseComponent } from './base-component';
import { OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, OnChanges, SimpleChanges, AfterViewInit, HostListener } from '@angular/core';
import { ValidatorUtils } from '../fn/validator-utils';
import { FormControl, ValidatorFn } from '@angular/forms';
import { ValidateType } from '../constant/validator/validateType';
import { AmisTransferDataService } from '../services/amis-transfer-data.service';
import { AmisTranslationService } from '../services/amis-translation.service';
import { FieldChange } from '../models/field/field-change';
import { KeyCode } from '../enum/key-code.enum';
import { LanguageUtils } from 'src/app/shared/function/language-utils';
import { HRMPermissionUtils } from 'src/app/shared/function/permission-utils';
import { PermissionCode } from 'src/app/shared/constant/permission-code/permission-code';
import { AmisStringUtils } from '../fn/string-utils';
import { SelfServiceStatus } from 'src/app/shared/enum/self-service-status/self-service-status.enum';

export class BaseControl extends BaseComponent implements OnInit, OnChanges, AfterViewInit {

    @Output() valueChanged: EventEmitter<any> = new EventEmitter();

    @Output() afterValidated: EventEmitter<any> = new EventEmitter();

    @Output() submitUpdateField: EventEmitter<any> = new EventEmitter();

    @Output() updateFieldView: EventEmitter<any> = new EventEmitter(); // cập nhật lại hiển thị giá trị liên quan

    @Output() isErrorCustomChange: EventEmitter<any> = new EventEmitter();

    @Output() beforeEditValue: EventEmitter<any> = new EventEmitter();

    @Output() focusOutField: EventEmitter<any> = new EventEmitter();

    @Output() onKeyDown: EventEmitter<any> = new EventEmitter();
    @Output() onContentReady: EventEmitter<any> = new EventEmitter();

    @Output() valueChangedWithFieldAndValue: EventEmitter<any> = new EventEmitter();

    @Input() data: any;

    @Input()
    isFilterServer: boolean = false;

    /**
    * Phân hệ 
    * @type {string}
    * @memberof AmisControlFormGroupComponent
    */
    _permissionSubSystemCode: string = ""
    @Input() get permissionSubSystemCode() {
        return this._permissionSubSystemCode;
    }
    set permissionSubSystemCode(val) {
        if (val) {
            this._permissionSubSystemCode = val
        }
    }

    /**
     * Quyền muốn check trong phân hệ
     * @type {string}
     * @memberof AmisControlFormGroupComponent
     */
    _permissionCode: string = ""
    @Input() get permissionCode() {
        return this._permissionCode;
    }
    set permissionCode(val) {
        if (val) {
            this._permissionCode = val
        }
    }

    /**
     * Quyền muốn check trong phân hệ
     * @type {string}
     * @memberof AmisControlFormGroupComponent
     */
    _permissionObject: string = ""
    @Input() get permissionObject() {
        return this._permissionObject;
    }
    set permissionObject(val) {
        this._permissionObject = val
        if (this._permissionObject) {
            this.checkPermissionControl();
        }
    }

    public _value: any;
    @Input()
    get value(): any {
        return this._value;
    }
    set value(str: any) {
        this.onTouched(this.value);
        this.writeValue(str);
    }

    _customConfig: any;
    @Input()
    get customConfig(): any {
        return this._customConfig;
    }
    set customConfig(val) {
        if (val) {
            this._customConfig = val;
            this.setCustomConfig();
        }
    }


    /**
     * show label
     * created by vhtruong - 07/03/2020
     */
    _isShowLabel: boolean = true;
    @Input() get isShowLabel() {
        return this._isShowLabel
    }
    set isShowLabel(val) {
        this._isShowLabel = val;
    }

    /**
     * Vị trí của label
     * created by vhtruong - 07/03/2020
     */
    _labelPositon: string = "top";
    @Input() get labelPositon() {
        return this._labelPositon
    }
    set labelPositon(val) {
        this._labelPositon = val;
    }

    /**
     * Font weight
     * created by vhtruong - 07/03/2020
     */
    _labelFontWeight: string = "medium";
    @Input() get labelFontWeight() {
        return this._labelFontWeight
    }
    set labelFontWeight(val) {
        this._labelFontWeight = val;
    }

    /**
     * Text của label
     * created by vhtruong - 07/03/2020
     */
    _labelText: string = "";
    @Input() get labelText() {
        return this._labelText
    }
    set labelText(val) {
        this._labelText = val;
    }

    /**
     * Chiều dài của label
     * created by vhtruong - 07/03/2020
     */
    _labelWidth: string = "";
    @Input() get labelWidth() {
        return this._labelWidth
    }
    set labelWidth(val) {
        if (val) {
            this._labelWidth = val;
        }
    }

    /**
     * Class muốn truyền vào
     * created by vhtruong - 07/03/2020
     */
    _labelClass: string = "";
    @Input() get labelClass() {
        return this._labelClass
    }
    set labelClass(val) {
        if (val) {
            this._labelClass = val;
        }
    }

    /**
     * có bắt buộc nhập hay không
     * created by vhtruong - 07/03/2020
     */
    _isRequiredLabel: boolean = false;
    @Input() get isRequiredLabel() {
        return this._isRequiredLabel
    }
    set isRequiredLabel(val) {
        this._isRequiredLabel = val;
    }

    /**
 * nội dung tooltip label
 * created by vhtruong - 07/03/2020
 */
    _tooltipContent: string = "";
    @Input() get tooltipContent() {
        return this._tooltipContent
    }
    set tooltipContent(val) {
        this._tooltipContent = val;
    }

    /**
     * nội dung tooltip label
     * created by vhtruong - 07/03/2020
     */
    _isShowTooltip: boolean = false;
    @Input() get isShowTooltip() {
        return this._isShowTooltip
    }
    set isShowTooltip(val) {
        this._isShowTooltip = val;
    }

    /**
     * Có show lỗi hay không
     * created by vhtruong - 07/03/2020
     */
    _isShowError: boolean = false;
    @Input() get isShowError() {
        return this._isShowError;
    }
    set isShowError(val) {
        this._isShowError = val;
    }

    /**
     * Chỉ cho xem
     * created by vhtruong - 07/03/2020
     */
    _isViewEditable: boolean = true;
    @Input() get isViewEditable() {
        return this._isViewEditable;
    }
    set isViewEditable(val) {
        this._isViewEditable = val;
    }

    _isViewOnly: boolean = false;
    @Input() get isViewOnly() {
        return this._isViewOnly;
    }
    set isViewOnly(val) {
        this._isViewOnly = val;
        if (!this._isViewOnly) {

        }
    }

    /**
     * Có cho phép sửa không
     * created by nmduy 06/05/2020
     */
    _isEditable: boolean = false;
    @Input() get isEditable() {
        return this._isEditable;
    }
    set isEditable(val) {
        this._isEditable = val;
    }

    /**
     * maxlength
     * created by vhtruong - 07/03/2020
     */
    _maxLength: number;
    @Input() get maxLength() {
        return this._maxLength;
    }
    set maxLength(val) {
        this._maxLength = val;
    }

    /**
     * minlength
     * created by vhtruong - 07/03/2020
     */
    _minLength: number;
    @Input() get minLength() {
        return this._minLength;
    }
    set minLength(val) {
        this._minLength = val;
    }

    /**
     * Giá trị nhỏ nhất nếu có
     * created by vhtruong - 07/03/2020
     */
    _minValue: any;
    @Input() get minValue() {
        return this._minValue;
    }
    set minValue(val) {
        this._minValue = val;
    }

    /**
     * Giá trị lớn nhất nếu có
     * created by vhtruong - 07/03/2020
     */
    _maxValue: any;
    @Input() get maxValue() {
        return this._maxValue;
    }
    set maxValue(val) {
        this._maxValue = val;
    }

    /**
      * Submit form
      * created by vhtruong - 07/03/2020
      */
    _isSubmit: boolean = false;
    @Input() get isSubmit() {
        return this._isSubmit;
    }
    set isSubmit(val) {
        this._isSubmit = val;
    }

    /**
     * input có lỗi hay không
     * created by vhtruong - 07/03/2020
     */
    _isError: boolean = false;
    @Input() get isError() {
        return this._isError;
    }
    set isError(val) {
        this._isError = val;
    }

    /**
     * input có lỗi không trong validate form hay không
     * created by vhtruong - 07/03/2020
     */
    _isErrorCustom: boolean = false;
    @Input() get isErrorCustom() {
        return this._isErrorCustom;
    }
    set isErrorCustom(val) {
        this._isErrorCustom = val;
    }

    /**
     * message thông báo lỗi
     * created by vhtruong - 07/03/2020
     */
    _errorMessage: string = "";
    @Input() get errorMessage() {
        return this._errorMessage;
    }
    set errorMessage(val) {
        this._errorMessage = val;
    }

    /**
     * Disable input
     * created by vhtruong - 07/03/2020
     */
    _readonly: boolean = false;
    @Input() get readonly() {
        return this._readonly;
    }
    set readonly(val) {
        this._readonly = val;
    }

    /**
     * Placehoder trong input
     * created by vhtruong - 07/03/2020
     */
    _placeholder: string = "";
    @Input() get placehoder() {
        return this._placeholder;
    }
    set placehoder(val) {
        this._placeholder = val;
    }


    /**
     * Tên trường
     * created by nmduy 19/06/2020
     */
    _fieldName: string = "";
    @Input() get fieldName() {
        return this._fieldName;
    }
    set fieldName(val) {
        this._fieldName = val;
    }

    /**
     * Giá trị lớn nhất nếu có
     * created by vhtruong - 07/03/2020
     */
    @Input() validateMethods: string[];

    // Có hợp lệ hay không
    isValid: boolean = true;

    // Danh sách lỗi
    errorList: any[] = [];

    // Danh sách hàm validate lỗi
    listValidateFn = [];

    // Form Control
    // formControl: any;
    // formControl: FormControl;

    // Giá trị trước
    previousValue: any;

    // Giá trị trước
    previousDisplayValue: any;

    // Danh sách các field sẽ thay đổi sau khi trường dữ liệu thay đổi
    listFieldChanged: FieldChange[] = [];

    // Không có quyền xem
    isNotPermissionView: boolean = false;

    // Không có quyền sửa
    isNotPermissionUpdate: boolean = false;

    @Input()
    displayValue = "";

    @ViewChild("control")
    control: ElementRef;

    @ViewChild("formControl")
    formControl: FormControl;

    localID: string = "";

    // Có quyền hay không
    isHasPermisson: boolean = true;
    labelColor: string = "";

    // formControl: FormControl = new FormControl(this._value);

    constructor(
        public amisTransferDataService: AmisTransferDataService,
        public amisTranslateSV: AmisTranslationService,

    ) {
        super();
        this.localID = LanguageUtils.GetCurrentLocaleID();
    }

    ngAfterViewInit(): void {
    }

    ngOnChanges(changes: SimpleChanges): void {
    }

    ngOnInit(): void {
    }

    /**
     * Lấy về Method validate
     * @param {any} validateMethod 
     * @returns 
     * @memberof BaseControl
     * created by vhtruong - 08/05/2020
     */
    getValidateFn(validateMethod) {
        let result: ValidatorFn;
        switch (validateMethod) {
            case ValidateType.Required:
                result = ValidatorUtils.required(`${this._labelText} ${this.amisTranslateSV.getValueByKey("CAN_NOT_EMPTY_CONTENT")}`);
                break;
            case ValidateType.Email:
                result = ValidatorUtils.email(this.amisTranslateSV.getValueByKey("INVALID_EMAIL"));
                break;
            case ValidateType.MinLength:
                result = ValidatorUtils.minLength(this._minLength ?? 0, this.amisTranslateSV.getValueByKey("INVALID_MINLENGTH"));
                break;
            case ValidateType.MaxLength:
                result = ValidatorUtils.maxLength(this._maxLength ?? 0, this.amisTranslateSV.getValueByKey("INVALID_MAXLENGTH"));
                break;
            case ValidateType.MinDate:
                result = ValidatorUtils.minDate(this._minValue ?? new Date(), this.amisTranslateSV.getValueByKey("INVALID_MINDATE"));
                break;
            case ValidateType.MaxDate:
                result = ValidatorUtils.maxLength(this._maxValue ?? new Date(), this.amisTranslateSV.getValueByKey("INVALID_MAXDATE"));
                break;
            case ValidateType.MinNumber:
                result = ValidatorUtils.maxLength(this._maxValue ?? 0, this.amisTranslateSV.getValueByKey("INVALID_MINNUMBER"));
                break;
            case ValidateType.MaxNumber:
                result = ValidatorUtils.maxLength(this._maxValue ?? 0, this.amisTranslateSV.getValueByKey("INVALID_MAXNUMBER"));
                break;
        }
        return result;
    }


    /**
     * Lấy danh sách các function validate
     * @memberof BaseControl
     * created by vhtruong - 08/05/2020
     */
    getListValidateFn() {
        let resultArrayFn = [];
        if (this.validateMethods?.length) {
            this.validateMethods.forEach(e => {
                resultArrayFn.push(this.getValidateFn(e));
            })

        }
        return resultArrayFn;
    }


    /**
     * Validate
     * @memberof BaseControl
     * created by vhtruong - 08/05/2020
     */
    validate() {
        this.isValid = true;
        this.errorList = [];
        const listFn = this.getListValidateFn();
        if (this._isShowError) {
            this.formControl["control"]?.setValidators(listFn);
            this.formControl["control"]?.updateValueAndValidity();
            if (this.formControl?.errors) {
                this.isValid = false;
                this.errorList.push(this.formControl.errors);
            }
        }
    }

    /**
   * Sự kiện click vào icon sửa
   * nmduy 06/05/2020
   */
    onClickEdit() {
        if (!this._readonly) {
            this.previousValue = this._value;
            this.previousDisplayValue = this.displayValue;
            this._isViewEditable = false;
            this._isViewOnly = false;
            this.amisTransferDataService.beforeEditFieldValue(this.data);
            this.focusInput();
        }
    }

    /**
     * Sự kiện click vào icon copy
     * hgvinh 23/06/2020
     */
    onClickDuplicate() {
        const selBox = document.createElement('textarea');
        // selBox.style.position = 'fixed';
        // selBox.style.left = '0';
        // selBox.style.top = '0';
        // selBox.style.opacity = '0';
        selBox.value = this._value;
        if (this.displayValue) {
            selBox.value = this.displayValue;
        }
        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();
        document.execCommand('copy');
        document.body.removeChild(selBox);
        this.amisTransferDataService.showSuccessToast("Sao chép thành công");
    }


    /**
     * Sự kiện click vào icon dấu tích xanh đánh dấu xong
     * nmduy 06/05/2020
     */
    onClickDone() {
        this._isSubmit = true;
        this.validate();
        if (this.formControl?.errors) {
            this.focusInput();
            return;
        }
        this.submitUpdateField.emit();
    }

    /**
     * Sự kiện click vào icon x cancel thao tác sửa
     * nmduy 06/05/2020
     */
    onClickCancel() {
        this.displayValue = this.previousDisplayValue;
        this.value = this.previousValue;
        this.onTouched(this.value);
        this.writeValue(this.value);
        this._isSubmit = false;
        this._isViewEditable = true;
        this._isViewOnly = true;
    }

    writeValue(obj: any): void {
        this._value = obj;
        this.onChange(this.value);
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
    }

    onChange = (fn) => {
    };

    onTouched = (fn) => { };

    /**
     * Thay đổi giá trị input
     * created by vhtruong - 07/03/2020
     */
    onValueChanged(e?) {
        if (this._isErrorCustom) {
            this._isErrorCustom = false;
            this.isErrorCustomChange.emit(this._isErrorCustom);
        }
        this.valueChanged.emit(this._value);
    }


    /**
     * Tự động focus
     * @returns 
     * @memberof BaseControl
     * created by vhtruong - 12/05/2020
     */
    focusInput() {
        setTimeout(() => {
            const lstInput = this.control?.nativeElement?.querySelectorAll('input');
            if (lstInput?.length > 0) {
                for (let i = 0; i < lstInput.length; i++) {
                    if (lstInput[i].getAttribute('type') !== "hidden") {
                        lstInput[i].focus();
                        return;
                    }
                }
            }
        }, 0);
    }

    checkInputChange(changes: SimpleChanges, inputName) {
        const inputChange = changes[inputName];
        return (
            inputChange && inputChange.previousValue !== inputChange.currentValue
        );
    }


    /**
     * Sự kiện db click mở form sửa
     * @param {any} event 
     * @memberof BaseControl
     * created by vhtruong - 19/05/2020
     */
    @HostListener("dblclick", ["$event"])
    dbclickEvent(event) {
        if (this._isViewOnly && this._isViewEditable && this._isEditable) {
            if (HRMPermissionUtils.checkPermissionUserInListPermission(this._permissionSubSystemCode, this._permissionCode, PermissionCode.Edit, this._permissionObject)) {
                if (event && event.target) {
                    if (event.target.parentElement) {
                        const parentEle = event.target.parentElement;
                        if (parentEle) {
                            if (parentEle.classList && (parentEle.classList.contains("value-display") || parentEle.parentElement?.classList?.contains("value-display") || parentEle.parentElement?.parentElement?.classList?.contains("value-display"))) {
                                this.onClickEdit();
                            }
                        }
                    }
                }
            }
        }
    }


    /**
     * Gắn custom config
     * @memberof BaseControl
     * created by vhtruong - 05/06/2020
     */
    setCustomConfig() {
        if (this._customConfig) {
            try {
                const customObject = JSON.parse(this._customConfig);
                if (customObject) {
                    if (customObject.ListFieldChange) {
                        this.listFieldChanged = customObject.ListFieldChange;
                    }
                    if (customObject.IsFilterServer) {
                        this.isFilterServer = customObject.IsFilterServer;
                    }
                    if (customObject?.SelfService_Status == SelfServiceStatus.Reject) {
                        this._isShowTooltip = true;
                        this._tooltipContent = customObject?.SelfService_Reason ? customObject?.SelfService_Reason : this.amisTranslateSV.getValueByKey("EMPLOYEE_SELFSERVICE_REJECT");
                        this.labelColor = "#fe7f01";
                    }
                    this.setCustomConfigInField(customObject);
                }
            } catch (ex) {
                console.log(ex);
            }
        }
    }


    /**
     * Set custom config riêng trong từng field
     * @memberof BaseControl
     */
    setCustomConfigInField(object) {
      // To do
    }


    /**
     * Sự kiện keyup
     * @param {any} $event 
     * @memberof BaseControl
     */
    onKeyUp(event) {
        if (event instanceof (KeyboardEvent)) {
            if (!this._readonly && !this._isViewEditable && !this._isViewOnly && this._isEditable) {
                if (event.keyCode === KeyCode.Enter) {
                    this.onClickDone();
                }
                if (event.keyCode === KeyCode.Esc) {
                    this.onClickCancel();
                }
            }
        }
    }


    /**
     * Focus out ra khỏi control
     * @memberof BaseControl
     * created by vhtruong - 30/07/2020
     */
    focusOut(e?) {
        if (this._value != null && this._value != undefined) {
            this.focusOutField.emit(this._value);
        }
    }

    /**
     * select text khi focus vào control
     */
    selectAll(selector, tagName) {
        let i = 0;
        if (selector?.instance?.NAME === "dxNumberBox") {
            i = 1;
        }
        if (selector?.instance?.element()?.getElementsByTagName(tagName)?.length) {
            selector.instance.element().getElementsByTagName(tagName)[i]?.select();
        }
    }

    // Kiểm tra quyền custom của control
    checkPermissionControl() {
        const me = this;
        if (me._permissionObject) {
            let perObject = !AmisStringUtils.IsNullOrEmpty(me._permissionObject) ? JSON.parse(me._permissionObject) : null;
            if (!HRMPermissionUtils.checkPermissionUserInListPermission(me._permissionSubSystemCode, me.permissionCode, PermissionCode.View, perObject, true)) {
                me.isNotPermissionView = true;
            }
            if (!HRMPermissionUtils.checkPermissionUserInListPermission(me._permissionSubSystemCode, me.permissionCode, PermissionCode.Edit, perObject, true)) {
                me.isNotPermissionUpdate = true;
            }
        }
    }


}
