export class AmisConverterUtils {

    public static StringConverter(value) {   
        if(value === null || value === undefined || typeof(value) === "string"){
            return value;
        }
        return value.toString();
    }

    public static DateConverter(value) {   
        if(value === null || value === undefined){
            return value;
        }
        return new Date(value);
    }
    
    public static BooleanConverter(value) {   
        if(value === null || value === undefined){
            return false;
        }
        if(typeof(value) === "boolean"){
            return value;
        }
        return value.toString() === "true" || value.toString() === "True" || value.toString() === "1";
    }

}