export class NotificationDesktop {

  constructor() {

  }
  // tslint:disable-next-line:no-unnecessary-initializer
  public static notifyMe(title, content, conv): void {
    if (("Notification" in window)) {
      if (Notification.permission === "granted") {
        const img = window["cdnUrl"] + "/favicon.ico";
        const notification = new Notification(title, { body: content, icon: img });
        setTimeout(notification.close.bind(notification), 3000);

        notification.onclick = () => {
          location.href = `/messenger/m/${conv?.id}`;
        }
      }


    }
  }

  public static getNotifyPermission(): void {
    Notification.requestPermission().then((result) => {
      localStorage.setItem("notifyPermission", result);
    });
  }

  // tslint:disable-next-line:member-ordering


}
