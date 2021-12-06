import { Component, OnInit, Input } from '@angular/core';

import { StringeeUser } from 'src/app/shared/models/stringee-user';

@Component({
  selector: 'amis-popup-new-conversation',
  templateUrl: './popup-new-conversation.component.html',
  styleUrls: ['./popup-new-conversation.component.scss']
})
export class PopupNewConversationComponent implements OnInit {

  constructor(

  ) { }



  @Input() isVisible = true;
  misa!: string;
  countUser = 0;
  allChecked?: boolean;


  ngOnInit(): void {
    this.misa = "Công ty Cổ phần MISA";
  }



  users = [
    new StringeeUser(1586472, "Nguyễn Đình Nghĩa",
      "AMIS Core - Khối sản xuất")
  ];

  selectedItems(user: StringeeUser): void {

    user.checked = !user.checked;
    if (user.checked === true) {
      this.countUser += 1;
    }
    else {
      this.countUser -= 1;
    }

  }


  selectAll(): void {
    this.users.forEach(element => {
      if (element.checked === true) {
        element.checked = true;
      }
      else {
        element.checked = true;
      }
      this.countUser = this.users.length;

      if (this.allChecked === false) {
        element.checked = false;
        this.countUser = 0;
      }
    });

  }

  close(): void {
    this.isVisible = false;
  }
}
