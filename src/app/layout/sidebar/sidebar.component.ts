import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewContainerRef,
  Injector,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PagingRequest } from 'src/app/core/models/PagingRequest';
import { StringeeService } from 'src/app/core/services/stringee.service';
import { AvatarService } from 'src/app/core/services/users/avatar.service';
import { UserService } from 'src/app/core/services/users/user.service';
import { ConversationItem } from 'src/app/shared/models/conversation';
import { ConversationTab } from './enums/conversation-tab.enum';
import { LazyLoadService } from './lazy-load.service';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from 'src/app/core/base.component';
@Component({
  selector: 'amis-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.less'],
})
export class SidebarComponent extends BaseComponent implements OnInit {
  @ViewChild('contactContainer', { read: ViewContainerRef, static: true })
  contactContainer!: ViewContainerRef;

  conversationTab = ConversationTab;

  tabActive = ConversationTab.Conversation;

  currentUser: any;

  listDirectory: any;

  visiblePopoverCreateChat = false;

  valueSearch = '';

  isFocusSearch = false;

  headerInstance: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private stringeeSV: StringeeService,
    private userSV: UserService,
    private avatarSV: AvatarService,
    private lazyloadSV: LazyLoadService,
    private injector: Injector
  ) {
    super();
  }

  ngOnInit(): void {
    this.currentUser = UserService.UserInfo;
    this.currentUser.Avatar = this.getAvatar(
      this.currentUser.AvatarToken,
      this.currentUser.UserID
    );
    this.initConversationAndContact();
  }

  getAvatar(avatarToken, userID: any, editVersion: any = new Date()): string {
    return this.avatarSV.getAvatar(
      avatarToken,
      userID,
      editVersion,
      true,
      80,
      80
    );
  }

  switchTab(val: any): void {
    if (val != this.tabActive) {
      this.tabActive = val;
      this.initConversationAndContact();
    }
  }

  /**
   * Tạo mới cuộc trò chuyện
   *
   * @memberof SidebarComponent
   */
  createNewConversation(): void {
    this.router.navigate(['m', 'new']);
    this.visiblePopoverCreateChat = false;
  }

  /**
   * Sử lí sự kiện search
   *
   * @param {any} value
   * @memberof SidebarComponent
   */
  onSearch(value): void {
    this.valueSearch = value;
    this.headerInstance.instance.valueSearch = value;
  }

  /**
   * Su li focus o search
   *
   * @param {any} e
   * @memberof SidebarComponent
   */
  onFocusSearch(e): void {
    if (e) {
      this.isFocusSearch = e;
      this.switchTab(ConversationTab.Directory);
    }
  }

  async initConversationAndContact(): Promise<void> {
    this.contactContainer.clear();

    const factory = await this.lazyloadSV.loadConversationAndUser(
      this.tabActive
    );
    this.headerInstance = this.contactContainer.createComponent(
      factory,
      undefined,
      this.injector
    );
    this.headerInstance.location.nativeElement.style.height =
      'calc(100% - 76px)';
    this.headerInstance.instance.valueSearch = this.valueSearch;

    this.headerInstance.instance.clearSearch
      .pipe(takeUntil(this._onDestroySub))
      .subscribe((data) => {
        this.valueSearch = '';
        this.switchTab(ConversationTab.Conversation);
      });
    if (this.tabActive == ConversationTab.Conversation) {
      this.isFocusSearch = false;
      this.headerInstance.instance.noConvData
        .pipe(takeUntil(this._onDestroySub))
        .subscribe((data) => {
          this.valueSearch = '';
          this.switchTab(ConversationTab.Directory);
        });
    }
  }
}
