import {configureBuilder} from '@jacked/core';
import {validator} from './validator';


const formBuilder = configureBuilder({
    validator:validator,
});

export {formBuilder};
