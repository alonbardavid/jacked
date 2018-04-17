import {configureBuilder,Form} from '@jacked/core';
import {validator} from './validator';


const makeFormBuilder = configureBuilder({
    validator:validator,
});

export {makeFormBuilder,Form};
