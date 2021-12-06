
/**
 * Config các object detail trong master
 * @export
 * @class ModelDetailConfig
 */
export class ModelDetailConfig {
    PropertyOnMasterName: string;
    TableName: string;
    PrimaryKeyName: string;
    constructor(propertyOnMasterName, tableName, primaryKeyName) {
        this.PropertyOnMasterName = propertyOnMasterName;
        this.TableName = tableName;
        this.PrimaryKeyName = primaryKeyName;
    }
}