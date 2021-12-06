/**
 *
 *
 * @export
 * @param {Date} time_1
 * @param {Date} time_2
 * @returns
 * Modified: PTSY
 * update vbcong 17/01/2020 sửa lệch một tháng vẫn tính hôm nay
 */
export function getRemainType(time_1: Date, time_2: Date) {
  const valueDay = Math.abs(time_1.getDate() - time_2.getDate());
  if (Math.abs(time_1.getMonth() - time_2.getMonth()) === 0 && time_1.getDate() - time_2.getDate() >= 0) {
      if (valueDay === 0) {
          return 1; // Hôm may
      } else {
          if (valueDay <= 1) {
              return 2; // Ngày mai
          } else {
              // ngày thường
              return 3;
          }
      }
  } else {
      return 3;
  }
}
