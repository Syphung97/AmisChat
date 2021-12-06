import { Injectable, OnDestroy, OnInit } from "@angular/core";
import { Subject, Subscription } from "rxjs";

@Injectable()
export class BaseComponent implements OnDestroy {
  /**
   * Title: Biến dùng để khử observable
   * Created by: PTĐạt 21-11-2019
   */
  // tslint:disable-next-line:variable-name
  public _onDestroySub: Subject<void> = new Subject<void>();

  /**
   * DNCuong
   * @type {Subscription[]}
   * @memberof BaseComponent
   */
  public unSubscribles: Subscription[] = [];

  constructor() {
  }

  /**
   * Title: Hàm hủy
   * Created by: PTĐạt 21-11-2019
   */
  ngOnDestroy(): void {
    this._onDestroySub.next();
    this._onDestroySub.complete();
    this._onDestroySub.unsubscribe();

    // DNCuong(Thêm hàm unsub thủ công do takeUtil k dùng được)
    if (this.unSubscribles) {
      this.unSubscribles.forEach(unsub => {
        unsub.unsubscribe();
        unsub.closed = true;
        unsub.remove(unsub);
      });
    }
  }

}

