import { GroupConfig } from '../models/group-config/group-config';
import { GroupType } from '../enum/group-config/group-type.enum';
import { ColumnGroup } from '../enum/group-config/column-group.enum';
import { ValidateType } from 'src/common/constant/validator/validateType';
import { AmisCommonUtils } from 'src/common/fn/common-utils';
import { GroupFieldConfig } from '../models/group-field-config/group-field-config';
import { TypeControl } from '../enum/common/type-control.enum';
import { convertInputFormulaToParams } from 'src/common/fn/expression-parse/fn-formula';
import { FormulaConfig } from '../models/formula-config/formula-config';


export class GroupConfigUtils {

    /**
     * Kiểm tra có phải môi trường truyền vào hay không
     * created by vhtruong - 06/03/2020
     */
    public static GetData(listGroupConfig: GroupConfig[]) {
        if (listGroupConfig) {
            // listGroupConfig.forEach(e => {
            //     e.ListGroupConfigChild = [];
            //     e = this.SetDataGroupCOnfig(e);
            // });
            for (let i = 0; i < listGroupConfig.length; i++) {
                if (listGroupConfig[i].GroupConfigParentID) {
                    let index = listGroupConfig.findIndex(e => e.GroupConfigID === listGroupConfig[i].GroupConfigParentID);
                    if (index !== -1) {
                        if(!listGroupConfig[index].ListGroupConfigChild){
                            listGroupConfig[index].ListGroupConfigChild = [];
                        }
                        listGroupConfig[index].ListGroupConfigChild.push(listGroupConfig[i]);
                    }
                    if(!listGroupConfig[i].IsNotSetChild){
                        listGroupConfig[i].IsChild = true;
                    }
                    // listGroupConfig[i].IsVisible = false;
                }
            }
            return listGroupConfig;
        }
        return [];
    }

    /**
     * Lấy danh sách group config cha
     * created by vhtruong - 06/03/2020
     */
    public static GetDataParent(listGroupConfig: GroupConfig[]) {
        if (listGroupConfig) {
            let result: GroupConfig[] = AmisCommonUtils.cloneDataArray(listGroupConfig);
            listGroupConfig.forEach(e => {
                if (e.GroupConfigParentID) {
                    let index = result.findIndex(t => t.GroupConfigID === e.GroupConfigID);
                    if (index !== -1) {
                        result.splice(index, 1);
                    }
                }
            })
            return result;
        }
        return [];
    }



    /**
     * Set dữ liệu với group config cha con
     * @static
     * @param {GroupConfig[]} listGroupConfig 
     * @returns 
     * @memberof GroupConfigUtils
     * created by vhtruong - 14/05/2020
     */
    public static GetDataParentChild(listGroupConfig: GroupConfig[]) {
        if (listGroupConfig) {
            let result: GroupConfig[] = AmisCommonUtils.cloneDataArray(listGroupConfig);
            listGroupConfig.forEach(e => {
                e = this.SetDataGroupCOnfig(e);
                if (e.ListGroupConfigChild?.length) {
                    e.ListGroupConfigChild = this.GetDataParentChild(e.ListGroupConfigChild)
                }
            })
            return result;
        }
        return [];
    }


    /**
     * Set data group config
     * @static
     * @param {GroupConfig} groupConfig 
     * @returns 
     * @memberof GroupConfigUtils
     * created by vhtruong  14/05/2020
     */
    public static SetDataGroupCOnfig(groupConfig: GroupConfig) {
        if (groupConfig) {
            if (groupConfig.GroupConfigParentID) {
                if(!groupConfig.IsNotSetChild){
                    groupConfig.IsChild = true;
                }
            }
            if (groupConfig.GroupType === GroupType.Field) {
                if (groupConfig.ColumnGroup === ColumnGroup.TwoCol) {
                    if (!groupConfig.ColOne?.length) {
                        groupConfig.ColOne = [];
                        groupConfig.ColOne.push(...groupConfig.GroupFieldConfigs.filter(t => t.ColumnIndex === 1));
                        groupConfig.ColTwo = [];
                        groupConfig.ColTwo.push(...groupConfig.GroupFieldConfigs.filter(t => t.ColumnIndex === 2));
                    }
                } else if (groupConfig.ColumnGroup === ColumnGroup.OneCol) {
                }
            } else if (groupConfig.GroupType === GroupType.Grid) {
                groupConfig.ColOne = [];
                groupConfig.ColTwo = [];
                if (groupConfig.IsSystem) {
                    groupConfig.ColOne.push(...groupConfig.GroupFieldConfigs.filter(t => t.ColumnIndex === 1));
                    groupConfig.ColTwo.push(...groupConfig.GroupFieldConfigs.filter(t => t.ColumnIndex === 2));
                    if (groupConfig.ColTwo.length) {
                        groupConfig.ColumnGroup = 2;
                    }
                } else {
                    if (groupConfig.GroupFieldConfigs?.length >= 10) {
                        groupConfig.ColOne.push(...groupConfig.GroupFieldConfigs.filter(function name(params, index) {
                            if (index < groupConfig.GroupFieldConfigs.length / 2) {
                                return true;
                            }
                            return false;
                        }));
                        groupConfig.ColTwo.push(...groupConfig.GroupFieldConfigs.filter(function name(params, index) {
                            if (index >= groupConfig.GroupFieldConfigs.length / 2) {
                                return true;
                            }
                            return false;
                        }));
                        groupConfig.ColumnGroup = 2;
                    }
                }
            }
            return groupConfig;
        }
        return null;
    }


    /**
     * Sinh ra các method validate cần thiết cho form
     * @static
     * @param {GroupFieldConfig} e 
     * @memberof GroupConfigUtils
     * created by vhtruong - 22/05/2020
     */
    public static GenerateValidateMethod(t: GroupFieldConfig) {
        let validateMethod = [];
        if (t.IsRequire) {
            validateMethod.push(ValidateType.Required);
        }
        if (t.TypeControl == TypeControl.Email) {
            validateMethod.push(ValidateType.Email);
        }
        if ((t.MinValue != null && t.MinValue != undefined) || (t.MaxValue != null && t.MaxValue != undefined) || (t.MinLength != null && t.MinLength != undefined) || (t.MaxLength != null && t.MaxLength != undefined)) {
            switch (t.TypeControl) {
                case TypeControl.Email:
                    if (t.MinLength != null && t.MinLength != undefined) {
                        validateMethod.push(ValidateType.MinLength);
                    }
                    if (t.MaxLength != null && t.MaxLength != undefined) {
                        validateMethod.push(ValidateType.MaxLength);
                    }
                    break;
                case TypeControl.Currency:
                    if (t.MinValue != null && t.MinValue != undefined) {
                        validateMethod.push(ValidateType.MinNumber);
                    }
                    if (t.MaxValue != null && t.MaxValue != undefined) {
                        validateMethod.push(ValidateType.MaxNumber);
                    }
                    break;
                case TypeControl.Percent:
                    if (t.MinValue != null && t.MinValue != undefined) {
                        validateMethod.push(ValidateType.MinNumber);
                    }
                    if (t.MaxValue != null && t.MaxValue != undefined) {
                        validateMethod.push(ValidateType.MaxNumber);
                    }
                    break;
                case TypeControl.Number:
                    if (t.MinValue != null && t.MinValue != undefined) {
                        validateMethod.push(ValidateType.MinNumber);
                    }
                    if (t.MaxValue != null && t.MaxValue != undefined) {
                        validateMethod.push(ValidateType.MaxNumber);
                    }
                    break;
                case TypeControl.Decimal:
                    if (t.MinValue != null && t.MinValue != undefined) {
                        validateMethod.push(ValidateType.MinNumber);
                    }
                    if (t.MaxValue != null && t.MaxValue != undefined) {
                        validateMethod.push(ValidateType.MaxNumber);
                    }
                    break;
                case TypeControl.DateTime:
                    if (t.MinValue) {
                        validateMethod.push(ValidateType.MinDate);
                    }
                    if (t.MaxValue) {
                        validateMethod.push(ValidateType.MaxDate);
                    }
                    break;
                case TypeControl.Date:
                    if (t.MinValue) {
                        validateMethod.push(ValidateType.MinDate);
                    }
                    if (t.MaxValue) {
                        validateMethod.push(ValidateType.MaxDate);
                    }
                    break;
                case TypeControl.MonthYear:
                    if (t.MinValue) {
                        validateMethod.push(ValidateType.MinDate);
                    }
                    if (t.MaxValue) {
                        validateMethod.push(ValidateType.MaxDate);
                    }
                    break;
                case TypeControl.DefaultType:
                    if (t.MinLength != null && t.MinLength != undefined) {
                        validateMethod.push(ValidateType.MinLength);
                    }
                    if (t.MaxLength != null && t.MaxLength != undefined) {
                        validateMethod.push(ValidateType.MaxLength);
                    }
                    break;
                case TypeControl.Hyperlink:
                    if (t.MinLength != null && t.MinLength != undefined) {
                        validateMethod.push(ValidateType.MinLength);
                    }
                    if (t.MaxLength != null && t.MaxLength != undefined) {
                        validateMethod.push(ValidateType.MaxLength);
                    }
                    break;
                case TypeControl.OneRow:
                    if (t.MinLength != null && t.MinLength != undefined) {
                        validateMethod.push(ValidateType.MinLength);
                    }
                    if (t.MaxLength != null && t.MaxLength != undefined) {
                        validateMethod.push(ValidateType.MaxLength);
                    }
                    break;
            }
        }
        return validateMethod;
    }


}