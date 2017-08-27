import {configureBuilder} from './form';
import {validator} from './jacked-ajv';


const buildForm = configureBuilder({
    validator:validator,
});

export {buildForm};
