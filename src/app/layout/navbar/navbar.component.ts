import { Component, OnInit } from '@angular/core';
import { AmisTranslationService } from 'src/app/core/services/amis-translation-service.service';
import { ThemeService } from 'src/app/core/services/theme.service';
import { UserService } from 'src/app/core/services/users/user.service';
declare var APUI: any;
@Component({
  selector: 'amis-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.less']
})
export class NavbarComponent implements OnInit {


  theme = false;

  constructor(private themeService: ThemeService, private translateSV: AmisTranslationService) { }

  ngOnInit(): void {
    this.initAPUI();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme().then();
  }

  initAPUI(): void {

    APUI.AccountMenu({

      class: "account-app"

    });
    const userInfo = UserService.UserInfo;
    APUI.Fn.init(userInfo);
  }

}
