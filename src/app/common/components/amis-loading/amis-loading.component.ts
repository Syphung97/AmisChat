import { Component, OnInit, Input, ElementRef } from '@angular/core';

@Component({
  selector: 'amis-loading',
  templateUrl: './amis-loading.component.html',
  styleUrls: ['./amis-loading.component.scss']
})
export class AmisLoadingComponent implements OnInit {

  @Input() fullScreen: boolean = false;

  @Input() bdColor: string;

  @Input() colorText: string = "#ffffff";

  @Input() colorLoad: string;

  @Input() text: string = "Đang tải . . .";

  @Input() set position(data) {
    if (data) {
      if(!this.fullScreen){
        this.getPos(data);
        return;
      }
    }
    this.positionLoad = {
      left: "0px",
      top: "0px",
      bottom: "0px",
      right: "0px"
    }
  }

  // object lấy position
  positionLoad = {
    left: "0px",
    top: "0px",
    bottom: "0px",
    right: "0px"
  }

  constructor() { }

  ngOnInit() {
  }


  /**
   * Lấy position cần loading
   * @param {any} data 
   * @memberof AmisLoadingComponent
   */
  getPos(data) {
    const pos = document.querySelector(`#${data}`)?.getBoundingClientRect();
    if(pos){
      this.positionLoad.left = `${pos.left}px`;
      this.positionLoad.top = `${pos.top}px`;
      this.positionLoad.right = `${window.innerWidth - pos.right}px`;
      this.positionLoad.bottom = `${window.innerHeight - pos.bottom}px`;
    }
  }

}
