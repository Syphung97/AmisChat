import {
  animate,
  state,
  style,
  transition,
  trigger
} from "@angular/animations";


export class CommonAnimation {

  // Từ trái qua phải
  public static slideToRight = trigger("slideToRight", [
    transition(":enter", [
      style({ transform: "translateX(-100%)" }),
      animate("0.5s ease-in-out", style({ transform: "translateX(0%)" }))
    ]),
    transition(":leave", [
      style({ transform: "translateX(0%)" }),
      animate("0s ease-in-out", style({ display: "none" }))
    ])
  ]);

  // Phải qua trái
  public static slideToLeft = trigger("slideToLeft", [
    state("void", style({})),
    state("*", style({})),
    transition(":enter", [
      style({ transform: "translateX(100%)" }),
      animate("0.5s ease-in-out", style({ transform: "translateX(0%)" }))
    ]),
    transition(":leave", [
      style({ transform: "translateX(0%)" }),
      animate("0.5s ease-in-out", style({ transform: "translateX(-100%)" }))
    ])
  ]);

  // Từ trên xuống
  public static slideToBottom = trigger("slideToBottom", [
    state("void", style({})),
    state("*", style({})),
    transition(":enter", [
      style({ transform: "translateY(-100%)" }),
      animate("0.5s ease-in-out", style({ transform: "translateY(0%)" }))
    ]),
    transition(":leave", [
      style({ transform: "translateY(0%)" }),
      animate("0.5s ease-in-out", style({ transform: "translateY(100%)" }))
    ])
  ]);

  // Hiện từ dưới lên
  public static slideToTop = trigger("slideToTop", [
    state("void", style({})),
    state("*", style({})),
    transition(":enter", [
      style({ transform: "translateY(100%)" }),
      animate("0.5s ease-in-out", style({ transform: "translateY(0%)" }))
    ]),
    transition(":leave", [
      style({ transform: "translateY(0%)" }),
      animate("0.5s ease-in-out", style({ transform: "translateY(-100%)" }))
    ])
  ]);

  public static fadeInOutHorizontal = trigger("fadeInOutHorizontal", [
    transition(":enter", [
      style({ transform: "translateX(100%)", opacity: 0 }),
      animate(
        "500ms ease-in-out",
        style({ transform: "translateX(0)", opacity: 1 })
      )
    ]),
    transition(":leave", [
      style({ transform: "translateX(0)", opacity: 1 }),
      animate(
        "500ms ease-in-out",
        style({ transform: "translateX(100%)", opacity: 0 })
      )
    ])
  ]); // [@fadeInOutHorizontal]

  // Hiện từ dưới lên, ẩn từ trên xuống
  public static fadeInOutVertical = trigger("fadeInOutVertical", [
    transition(":enter", [
      style({ transform: "translateY(70%)", opacity: 0 }),
      animate("420ms", style({ transform: "translateY(0)", opacity: 1 }))
    ]),
    transition(":leave", [
      style({ transform: "translateY(0)", opacity: 1 }),
      animate("200ms", style({ transform: "translateY(70%)", opacity: 0 }))
    ])
  ]); // [@fadeInOutVertical]

  public static visibilytyChanged = trigger("visibilytyChanged", [
    transition(":enter", [
      style({ transform: "scale(1.0)", opacity: 1 }),
      animate("500ms", style({ transform: "scale(0.0)", opacity: 0 }))
    ]),
    transition(":leave", [
      style({ transform: "scale(0.0)", opacity: 0 }),
      animate("300ms", style({ transform: "scale(1.0)", opacity: 1 }))
    ])
  ]); // [@visibilytyChanged]

  public static showItem = trigger("showItem", [
    transition(":enter", [
      style({ opacity: 0 }),
      animate("500ms ease-in-out", style({ opacity: 1 }))
    ]),
    transition(":leave", [
      style({ opacity: 1 }),
      animate("0ms ease-in-out", style({ opacity: 0.2 }))
    ])
  ]); // [@visibilytyChanged]

  // Từ trái qua phải
  public static slideToRightNotHide = trigger("slideToRightNotHide", [
    transition(":enter", [
      style({ transform: "translateX(-100%)" }),
      animate("0.5s ease-in-out", style({ transform: "translateX(0%)" }))
    ]),
    transition(":leave", [
      style({ transform: "translateX(0%)" }),
      animate("0s ease-in-out", style({ display: "none" }))
    ])
  ]);

  // Amimation cho form không xác định height
  public static smoothHeight = trigger('grow', [
    transition('void <=> *', []),
    transition('* <=> *', [style({ height: '{{startHeight}}px', width: '{{startWidth}}px', opacity: 0 }), animate('0.5s ease')], {
      params: { startHeight: 0, startWidth: 0 }
    })
  ]);

  // Từ trái qua phải
  public static ScheduleSlideToRight = trigger("slideToRight", [
    transition(":enter", [
      style({ transform: "translateX(100%)" }),
      animate("0.5s ease-in-out", style({ transform: "translateX(0%)" }))
    ]),
    transition(":leave", [
      style({ transform: "translateX(0%)" }),
      animate("0s ease-in-out", style({ display: "none" }))
    ])
  ]);

  public static ZoomAndSlideTop = trigger("zoom", [
    transition(":enter", [
      // tslint:disable-next-line:whitespace
      style({ width: '1px', height: '1px', opacity: 0 }),
      animate("0.5s ease-in-out")
    ]),
    transition(":leave", [
      style({ transform: "translateY(0%)" }),
      animate("0.5s ease-in-out", style({ transform: "translateY(-100%)" }))
    ])
  ]);
  // SHOW ZOOM OUT
  public static showZoom = trigger("showZoom", [
    transition(":enter", [
      style({ transform: "scale(0)" }),
      animate("250ms", style({ transform: "scale(1.0)", transition: "none 0s ease 0s" }))
    ]),
    transition(":leave", [
      style({ display: "none" }),
      animate("500ms", style({ transform: "scale(0)", opacity: 0 }))
    ])
  ]);

  public static slideToLeftReport = trigger("slideToLeftReport", [
    state("void", style({})),
    state("*", style({})),
    transition(":enter", [
      style({ transform: "translateX(100%)" }),
      animate("1s ease-in-out", style({ transform: "translateX(0%)" }))
    ]),
    transition(":leave", [
      style({ transform: "translateX(0%)" }),
      animate("1s ease-in-out", style({ transform: "translateX(-100%)" }))
    ])
  ]);
}
