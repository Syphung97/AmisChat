import * as _ from "lodash";

export class LodashUtils {
  /**
   * Clone object
   * @param data : Object cần clone
   * Create by: PTĐạt 25.11.2019
   */
  public static cloneData(data: object): object {
    return _.clone(data);
  }

  /**
   * Title: Clone deep object
   * Created by: PTĐạt 25.11.2019
   */
  public static cloneDeepData(data: object): object  {
    return _.cloneDeep(data);
  }
}
