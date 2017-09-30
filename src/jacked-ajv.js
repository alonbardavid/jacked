import Ajv from 'ajv';
import {mapValues} from 'lodash';
const ajv = new Ajv({
    allErrors:true
});

function transformError(error){
    if (error.keyword == "required"){
        return {
            path: error.params.missingProperty,
            message: error.message
        }
    }
    return {
        message:error.message,
        path:error.dataPath.substr(1)
    }
}
function schemaToSample(schema){
    switch(schema.type){
        case "object":
            return mapValues(schema.properties,val=>schemaToSample(val));
        case "array":
            if (schema.items && schema.items.length > 0){
                return schema.items.map(i=>schemaToSample(i));
            }
            return [];
        default:
            return schema.type;
    }
}
export function validator(schema){
    const validate = ajv.compile(schema);
    const structure = schemaToSample(schema);;
    function doValidation(value){
        const valid = validate(value);
        return valid? [] : validate.errors.map(transformError);
    }
    doValidation.getStructure = function(){
        return structure;
    };
    return doValidation;
}
