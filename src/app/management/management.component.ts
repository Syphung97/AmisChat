import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '../core/base.component';
import { AmisTranferDataService } from '../core/services/amis-tranfer-data.service';
import { AppConfigService } from '../core/services/app-config.service';
import { AmisStateService } from '../core/services/state.service';
import { ThemeService } from '../core/services/theme.service';

@Component({
  selector: 'amis-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.less'],
})
export class ManagementComponent extends BaseComponent implements OnInit {
  isCollapsed = false;

  constructor(
    private themeService: ThemeService,
    private tranferSV: AmisTranferDataService,
    private titleSV: Title
  ) {
    super();
  }

  ngOnInit(): void {
    this.subscribeData();
    console.log(this.titleSV.getTitle());
  }

  subscribeData(): void {
    this.tranferSV.onNewCall
      .pipe(takeUntil(this._onDestroySub))
      .subscribe((data) => {
        const x = document.getElementById('callNotify') as HTMLAudioElement;
        x.src = AppConfigService.settings.cdnAudioNewCall;
        if (data) {
          x.play();
        } else {
          x.src = '';
        }
      });

    this.tranferSV.onNewMessage
      .pipe(takeUntil(this._onDestroySub))
      .subscribe((data) => {
        const x = document.getElementById('callNotify') as HTMLAudioElement;
        x.src = AppConfigService.settings.cdnAudioNewMessage;
        if (data) {
          x.play();
        } else {
          x.src = '';
        }
      });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {

        AmisStateService.BrowserVisited = false;
      } else {

        AmisStateService.BrowserVisited = true;
      }
    });
  }

  toggleTheme(): void {
    this.themeService.toggleTheme().then();
  }

  @HostListener("window:keyup", ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    this.tranferSV.nextBackImage(event.key);
  }
}
