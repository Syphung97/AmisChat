import { OnDestroy, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { BaseComponent } from './base-component';

export class BaseFormComponent extends BaseComponent implements OnDestroy, OnInit {

    // Sau khi gọi api lưu thành công
    @Output() afterSaveSuccess: EventEmitter<any> = new EventEmitter();

    // Sau khi hủy bỏ
    @Output() afterCancel: EventEmitter<any> = new EventEmitter();

    // Sau khi Đóng form
    @Output() afterClose: EventEmitter<any> = new EventEmitter();

    // Sau khi Đổi form Mode
    @Output() afterChangeFormMode: EventEmitter<any> = new EventEmitter();

    // Sau khi xóa
    @Output() afterDeleteSuccess: EventEmitter<any> = new EventEmitter();

    // là form gọi lên từ grid hay không
    @Input() isTypeInFormGrid: boolean = false;

    constructor() {
        super();
    }

    ngOnInit() {
    }

}

