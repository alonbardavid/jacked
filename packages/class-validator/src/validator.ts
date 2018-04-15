import {validateSync , MetadataStorage, getFromContainer } from "class-validator";
import "reflect-metadata";


function transformError(error){
    return {
        path: error.property,
        message: error.message || Object.values(error.constraints)[0]
    }
}
function schemaToSample(schema){
    let container = (<MetadataStorage>getFromContainer(MetadataStorage));
    let metadata = container.getTargetValidationMetadatas(schema, JSON.stringify(this));

    const sampleObj = {};
    metadata.forEach(m=>{
        if (m.type === "") {
            sampleObj[m.propertyName] = [];
        } else {
            sampleObj[m.propertyName] = "";
        }
    })
    return sampleObj;
}

export function validator(schema){
    const structure = schemaToSample(schema);
    function doValidation(value){
        const errors =  validateSync(value);
        const valid = errors.length  == 0;
        return valid? [] : errors.map(transformError);
    }
    (doValidation as any).getStructure = function(){
        return structure;
    };
    return doValidation;
}
