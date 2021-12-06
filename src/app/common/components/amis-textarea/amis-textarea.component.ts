import { Component, OnInit, forwardRef, AfterViewInit, ViewChild, Input, Output, EventEmitter, OnChanges, SimpleChanges } from "@angular/core";
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from "@angular/forms";
import { DxTextAreaComponent } from "devextreme-angular";

@Component({
    selector: "amis-textarea",
    templateUrl: "./amis-textarea.component.html",
    styleUrls: ["./amis-textarea.component.scss"],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => AmisTextareaComponent),
            multi: true
        }
    ]
})
export class AmisTextareaComponent implements OnInit, ControlValueAccessor, AfterViewInit, OnChanges {


    static nextId = 0;

    public _value?: any;

    _isError = false;

    id = "";

    //Tiêu đề control
    @Input()
    title = "";


    @Input()
    get value(): string {
        return this._value;
    }
    /**
     * Gán giá trị cho control
     * @param str
     * Create by: dvthang:18.10.2018
     */
    set value(str: string) {
        // if (!this.disabled) {
        this.writeValue(str);
        // }
    }

    //Input tự động Resize
    @Input() autoResizeEnabled = false;

    @Input()
    isRequired = false;

    /**
  * Handle sự kiện thay đổi giá trị
  * Created by: PTĐạt 12-12-2019
  */
    @Output()
    valueChanged: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild(DxTextAreaComponent, { static: false })
    dxTextArea: DxTextAreaComponent;

    @Input()
    errorMessage: string = "";

    // Tiêu đề khi chưa có giá trị
    @Input()
    placeholder: string;

    @Input()
    fieldName: string;

    @Input()
    isCheckValidate = true;

    constructor() {
        this.id = `misa-textarea-${AmisTextareaComponent.nextId++}`;
    }

    ngOnInit() {
    }

    ngAfterViewInit(): void {
        // throw new Error("Method not implemented.");
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.checkInputChange(changes, "errorMessage")) {
            if (this.errorMessage.length) {
                this._isError = true;
            } else {
                this._isError = false;
            }
        }
    }

    writeValue(str: any): void {
        const me = this;
        if (typeof str !== "undefined" && str != null && str !== me._value) {
            me._value = str;
            me.change(this._value);
            // me.raiseEventChanged(this._value);
        }
    }
    registerOnChange(fn: any): void {
        this.change = fn;
    }
    registerOnTouched(fn: any): void {
        this.touched = fn;
    }
    // Được gọi khi thay đổi giá trị check
    change = (str: string) => { };

    // Được gọi khi thay đổi giá trị check
    touched = () => { };


    /**
     * Title: Thực hiện raise event change cho textbox
     * @param
     * Created by: PTĐạt 12-12-2019
     */
    raiseEventChanged(e) {
        const result = {
            Data: this._value,
            Control: this
        };
        this.valueChanged.emit(result);
    }

    /**
    * Check hiển thị trên control
    * Create by: PTĐạt 12-12-2019
    */
    checkInputChange(changes: SimpleChanges, inputName) {
        const inputChange = changes[inputName];
        return (
            inputChange && inputChange.previousValue !== inputChange.currentValue
        );
    }

}
