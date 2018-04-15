import {configureBuilder,onInputFunc,formBuilder} from '@jacked/core';
import {validator} from './validator';


const attachSchema = configureBuilder({
    validator:validator,
});
function makeFormBuilder (schema):formBuilder{
    var formBuilder = attachSchema(schema);
    return formBuilder;
}

export {makeFormBuilder};
