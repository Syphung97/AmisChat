import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AmisStateService {
  public static BrowserVisited = true;
  constructor() {}
}
