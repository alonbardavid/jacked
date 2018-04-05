import {configureBuilder} from '../src';
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
        const builder = attachBuilder({valid:"schema"});
        let newForm;
        const form = builder(value,change=>{
            newForm = form.update(change);
        });
        expectGood(form);
        form.fields.valid.onInput("new value");
        expectBad(newForm,"new value");
        expectGood(form);
    });
    test("form should work with bad value",function(){
        const value = {
            valid:"bad value"
        };
        const builder = attachBuilder({valid:"schema"});
        const form = builder(value,()=>{});
        expect(form.isValid).toEqual(false);
        expect(form.fields.valid.value).toEqual("bad value");
        expect(form.fields.valid.error).toEqual("was bad value");
        expect(form.fields.valid.dirty).toEqual(false);
        expect(form.errors).toEqual([{path:"valid",message:"was bad value"}]);
        expect(form.value).toEqual({
            valid:"bad value"
        });
    });
    test("form should work with empty value",function(){
        const value = {};
        const builder = attachBuilder({valid:"schema"});
        const form = builder(value,()=>{});
        expect(form.isValid).toEqual(false);
        expect(form.fields.valid.value).toEqual(undefined);
        expect(form.fields.valid.error).toEqual("was bad value");
        expect(form.fields.valid.dirty).toEqual(false);
        expect(form.errors).toEqual([{path:"valid",message:"was bad value"}]);
        expect(form.value).toEqual({});
    });
    test("form with multiple values should keep other values when a value is updated",function(){
        const value = {
            first:"first good",
            second:"second good"
        };
        const builder = attachBuilder({first:"schema",second:"schema"});
        let form = builder(value,change=>{
            form = form.update(change);
        });
        expect(form.fields.first.value).toEqual("first good");
        expect(form.fields.second.value).toEqual("second good");
        form.fields.second.onInput("second changed good !");
        expect(form.fields.first.value).toEqual("first good");
        expect(form.fields.second.value).toEqual("second changed good !");
        form.fields.first.onInput("first changed good !");
        expect(form.fields.first.value).toEqual("first changed good !");
        expect(form.fields.second.value).toEqual("second changed good !");
    })
    test("collect errors",function(){
        const value = {
            first:"first good",
            second:"second good"
        };
        const builder = attachBuilder({first:"schema",second:"schema"});
        let form = builder(value,change=>{
            form = form.update(change,false);
        });
        form.fields.second.onInput("second bad!");
        const oldForm = form;
        expect(form.fields.first.value).toEqual("first good");
        expect(form.fields.second.value).toEqual("second bad!");
        expect(form.fields.second.error).toEqual(null);
        expect(form.errors).toEqual([]);
        form = form.validate();
        expect(form.fields.second.error).toEqual("was bad value");
        expect(form.errors).toEqual([{path:"second",message:"was bad value"}]);
        expect(oldForm.errors).toEqual([]);
        expect(oldForm.fields.second.error).toEqual(null);
    });
    test("changeing value while keeping error",()=>{
        const value = {
            valid:"bad value"
        };
        const builder = attachBuilder({valid:"schema"});
        let newForm;
        const form = builder(value,change=>{
            newForm = form.update(change);
        });
        expect(form.fields.valid.value).toEqual("bad value");
        expect(form.fields.valid.error).toEqual("was bad value");
        form.fields.valid.onInput("new value");
        expect(newForm.fields.valid.value).toEqual("new value");
        expect(newForm.fields.valid.error).toEqual("was bad value");
    })
})