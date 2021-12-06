export class ToastModel {
  message: string;
  type: string; // success , error, warning
  constructor(mes = "", type = "success") {
    this.message = mes;
    this.type = type;
  }
}
