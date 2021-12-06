import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { KeyCode } from 'src/common/enum/key-code.enum';
import { convertVNtoENToLower } from 'src/common/fn/convert-VNtoEn';
import { UploadAdapter } from "./amis-ckeditor-upload-adapter";
import { DownloadService } from 'src/app/services/base/download.service';
import { UploadService } from 'src/app/services/base/upload.service';
import { UploadTypeEnum } from 'src/app/shared/enum/uploadType/upload-type.enum';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '../base-component';
declare var DecoupledDocumentEditor: any;
declare var $: any;
@Component({
  selector: 'amis-amis-ckeditor',
  templateUrl: './amis-ckeditor.component.html',
  styleUrls: ['./amis-ckeditor.component.scss']
})
export class AmisCkeditorComponent extends BaseComponent implements OnInit {
  public Editor = DecoupledDocumentEditor;
  @ViewChild("ckeditor", { static: false })
  ckeditor: ElementRef;


  //config cho toolbar
  @Input() toolbarItems = [
    'heading',
    '|',
    'fontSize',
    'fontFamily',
    'fontColor',
    'fontBackgroundColor',
    '|',
    'bold',
    'italic',
    'underline',
    'strikethrough',
    'highlight',
    '|',
    'alignment',
    '|',
    'numberedList',
    'bulletedList',
    '|',
    'indent',
    'outdent',
    '|',
    'todoList',
    'link',
    'imageUpload',
    'insertTable',
    '|',
    'undo',
    'redo'
  ];

  //trường nội dung của editor, mặc định rỗng
  _value = "";

  /**
   * Config ckeditor
   * PTSY 26/6/2020
   * @memberof AmisCkeditorComponent
   */
  config = {};

  // Nội dung
  @Input() set value(data) {
    if (data != null && data != undefined) {
      this._value = data;
    }
  };

  _minHeight = "'auto'";
  @Input() set minHeight(data) {
    this._minHeight = data;
    this.editor?.editing?.view?.change(writer => {
      writer.setStyle('min-height', this._minHeight, this.editor.editing.view.document.getRoot())
    })
  };
  //chiều cao của editor
  @Input() height = "'auto'";
  editor;

  //dữ liệu trường trộn
  _feedData = [];
  @Input() set feedData(data) {
    this._feedData = data;

  }

  //xử lí khi click vào trường trộn
  @Input() set mentionByClick(data) {
    if (data) {
      this.editor.execute('mention', { marker: "#", mention: data });
      this.editor.execute('input', { text: " " });
      setTimeout(() => {
        this.editor.editing.view.focus();
      }, 300);
    }
  }

  //trường cho phép chỉnh sửa trên editor hay không
  _disabled = false;
  @Input() set disabled(data) {
    if (data != null && data != undefined) {
      this._disabled = data;
    }
  }

  // Tên để phân trong trường hợp có 2 editor dùng chung 1 trường trộn
  @Input() name;

  //xử lí khi thay đổi nội dung
  @Output() onContentChange = new EventEmitter();

  @Output() focused = new EventEmitter();

  /*
   * Cấu hình khi upload
   *
   * **/
  uploadConfig = {
    url: this.uploadSV.makeAPIUpload(UploadTypeEnum.EmployeeAttachment, false),
    header: {},
    imageUrl: this.downloadSV.makeApiDownloadHandle("{{filename}}", 40, "false")
  };




  constructor(
    private downloadSV: DownloadService,
    private uploadSV: UploadService
  ) {
    super();
  }
  ngOnInit() {
    this.config = {
      toolbar: {
        items: this.toolbarItems
      },
      language: 'en',
      image: {
        toolbar: [
          'imageTextAlternative',
          'imageStyle:full',
          'imageStyle:side'
        ]
      },
      table: {
        contentToolbar: [
          'tableColumn',
          'tableRow',
          'mergeTableCells',
          'tableCellProperties',
          'tableProperties'
        ]
      },
      licenseKey: '',
      mention: {
        commitKeys: KeyCode.Enter,
        feeds: [

          {
            marker: '#',
            feed: this.getFeedItem.bind(this),
            itemRenderer: this.customItemRenderer
          }
        ]
      },
      fontSize: {
        options: [8, 9, 10, 11, 13, 14, 18, 24, 36]
      },
      fontFamily: {
        options: [

          'Times New Roman',
          'Arial',
          'Courier New',
          'Helvetica',
          'Tahoma',
          'Verdana'
        ]
      }
    }
  }


  /**
   * On ready
   *
   * @param {any} editor
   * @memberof AmisCkeditorComponent
   * PTSY 25/6/2020
   */
  onReady(editor) {
    this.editor = editor;
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );

    editor.editing.view.change(writer => {
      writer.setStyle('height', this.height, editor.editing.view.document.getRoot())
    })

    editor.editing.view.change(writer => {
      writer.setStyle('min-height', this._minHeight, editor.editing.view.document.getRoot())
    })

    editor.execute("fontFamily", { value: 'Roboto' });

    editor.plugins.get("FileRepository").createUploadAdapter = loader => {
      const res = new UploadAdapter(loader, this.uploadConfig);

      UploadAdapter.subject.pipe(takeUntil(this._onDestroySub)).subscribe(data => {
        console.log(data);
      })
      return res;
    };

    this.registerEvent(editor);

  }


  onChange(editor) {
    this.onContentChange.emit(this._value);
  }

  onBlur(editor) {

  }

  onFocus(editor) {
    this.focused.emit(this.name);
  }




  /**
   * Sử lí các sự kiện liên quan editor
   *
   * @param {any} editor
   * @memberof AmisCkeditorComponent
   * PTSY 25/6/2020
   */
  registerEvent(editor) {
    const me = this;
    editor.editing.view.document.on('keydown', (evt, data) => {
      // if (data.keyCode == 9 && !data.shiftKey && editor.editing.view.document.isFocused) {
      //   editor.execute('input', { text: "        " });

      //   editor.editing.view.scrollToTheSelection();
      //   evt.stop();
      //   data.preventDefault();
      // }
    })
    editor.editing.view.document.on('paste', (evt, data) => {

    });
    editor.on('fileUploadResponse', (evt, data) => {

    });
  }

  /**
   * Hàm lấy dữ liệu mention
   *
   * @param {any} queryText
   * @returns
   * @memberof AmisCkeditorComponent
   * PTSY 25/6/2020
   */
  getFeedItem(queryText) {

    const me = this;
    return new Promise(resolve => {

      setTimeout(() => {
        const searchText = convertVNtoENToLower(queryText);
        const itemDisplay = me._feedData?.filter(x => {
          return (convertVNtoENToLower(x).includes(searchText))
        });
        resolve(itemDisplay);
      }, 0);
    })
  }

  /**
   * Custom giao diện select mention
   *
   * @param {any} item
   * @returns
   * @memberof AmisCkeditorComponent
   * PTSY 25/6/2020
   */
  customItemRenderer(item) {
    const itemElement = document.createElement("div");
    itemElement.classList.add("custom-item");
    itemElement.textContent = item.text.replaceAll("#", "");
    itemElement.id = item.id;
    return itemElement;
  }
}
