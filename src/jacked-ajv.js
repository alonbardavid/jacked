import Ajv from 'ajv';
const ajv = new Ajv({
    allErrors:true
});

function transformError(error){
    return {
        message:error.message,
        path:error.dataPath.substr(1)
    }
}
export function validator(schema){
    const validate = ajv.compile(schema);
    return function(value){
        const valid = validate(value);
        return valid? [] : validate.errors.map(transformError);
    }
}