
export class AppTitle {

  constructor(){

  }
  public static setTitle(value: string) {
    let companyName = localStorage.getItem('TransactionName');
    if (!companyName) {
      companyName = '';
    } else {
      companyName =  `| ${companyName}`;
    }
    return `${value} ${companyName} | AMIS Quản lý nhân sự`;
  }
}
