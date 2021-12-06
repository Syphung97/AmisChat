import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'amis-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isCollapsed = false;

  @HostListener('window:unload', ['$event'])
  unloadHandler(event): void {
    alert(1);
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event): void {
    alert(2);
  }
}
