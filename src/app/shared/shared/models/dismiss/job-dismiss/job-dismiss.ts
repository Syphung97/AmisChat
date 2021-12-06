import { BaseHRMModel } from '../../base-hrm'

/**
* Model cho accomplishment để lưu lên server
 * @export
* @class EventForInsert
*/
export class JobDismiss extends BaseHRMModel {
    // ID
    JobDismissID: number
    // Tên công việc 
    JobDismissName: string
    // ID thủ tục miễn nhiệm
    DismissID: number
    // ID người thực hiện công việc
    ImplementerID: number
    // Tên người thực hiện
    ImplementerName: string
    // Ngày kết thúc
    EndDate: Date
    // ID trạng thái thủ tục miễn nhiệm
    JobDismissStatusID: number
    // Tên trạng thái thủ tục miễn nhiệm
    JobDismissStatusName: string
    // Ghi chú
    Description: string
    //sort order
    SortOrder: number;
}

