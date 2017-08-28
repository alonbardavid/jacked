import {configureBuilder} from './form';
import {validator} from './jacked-ajv';


const formBuilder = configureBuilder({
    validator:validator,
});

export {formBuilder};
