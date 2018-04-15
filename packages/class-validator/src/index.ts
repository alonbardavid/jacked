import {configureBuilder} from '@jacked/core';
import {validator} from './validator';


const makeFormBuilder = configureBuilder({
    validator:validator,
});

export {makeFormBuilder};
