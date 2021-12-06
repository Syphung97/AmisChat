import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { StringeeService } from 'src/app/core/services/stringee.service';
import { RouterModule, Routes, Router } from '@angular/router';
import { ActivatedRoute } from "@angular/router";
import { UserService } from 'src/app/core/services/users/user.service';

@Component({
  selector: 'amis-conversation-input',
  templateUrl: './conversation-input.component.html',
  styleUrls: ['./conversation-input.component.less']
})
export class ConversationInputComponent implements OnInit {

  inputValue!: string;

  currentStringeeUser: any;

  @Output() onSendMessage = new EventEmitter();

  constructor(
    private route: ActivatedRoute,
    private stringeeService: StringeeService,
    private router: Router,

  ) { }

  ngOnInit(): void {
    this.currentStringeeUser = UserService.UserInfo.StringeeUserID;
  }

  onSelect(value: string): void {

  }

  sendMessage(): void {
    if (this.inputValue) {
      this.onSendMessage.emit(this.inputValue);
      this.inputValue = "";
    }

  }

  onKeyup(e: KeyboardEventInit): void {
    if (e.key == "Enter") {
      this.sendMessage();
    }

  }

  checkUserTyping(event): void {
    const idUrl = this.route.snapshot.paramMap.get('id');
    console.log(idUrl);
    //this.stringeeService.userBeginTyping(idUrl, this.currentStringeeUser);
  }
}
