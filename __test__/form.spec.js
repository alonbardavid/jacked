import {configureBuilder} from '../src/form';
import {set} from 'lodash/fp';
import {mockValidator} from './utils';

const attachBuilder = configureBuilder({
    validator: mockValidator
});
function expectGood(form){
    expect(form.fields.valid.value).toEqual("good value");
    expect(form.isValid).toEqual(true);
    expect(form.fields.valid.error).toEqual(null);
    expect(form.errors).toEqual([]);
    expect(form.value).toEqual({valid:"good value"});
    expect(form.fields.valid.dirty).toEqual(false);
}
function expectBad(form){
    expect(form.isValid).toEqual(false);
    expect(form.fields.valid.value).toEqual("new value");
    expect(form.fields.valid.error).toEqual("was bad value");
    expect(form.errors).toEqual([{path:"valid",message:"was bad value"}]);
    expect(form.value).toEqual({valid:"new value"});
    expect(form.fields.valid.dirty).toEqual(true);
}
describe("form",()=>{
    test("form should validate",function(){
        const value = {
            valid:"good value"
        };
        const builder = attachBuilder("schema");
        let newForm;
        const form = builder(value,form=>{
            newForm = form;
        });
        expectGood(form);

        form.fields.valid.onChange("new value");
        expectBad(newForm);

        expectGood(form);

    })
})