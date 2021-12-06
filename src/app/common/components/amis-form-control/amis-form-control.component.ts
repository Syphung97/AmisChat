import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: 'amis-form-control',
  templateUrl: './amis-form-control.component.html',
  styleUrls: ['./amis-form-control.component.scss']
})
export class AmisFormControlComponent implements OnInit {

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
  _isRequired: boolean = false;
  @Input() get isRequired() {
    return this._isRequired
  }
  set isRequired(val) {
    this._isRequired = val;
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
    this.getTooltipID();
    this._isShowTooltip = val;
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
     * Tên trường
     * created by nmduy 19/06/2020
     */
  _labelColor: string = "";
  @Input() get labelColor() {
    return this._labelColor;
  }
  set labelColor(val) {
    this._labelColor = val;
  }

  tooltipID: string = "label";

  constructor() { }

  ngOnInit(): void {
  }

  /**
   * Lấy tooltip id 
   * nmduy 17/09/2020
   */
  getTooltipID() {
    this.tooltipID = `label-${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}`;
  }
}
