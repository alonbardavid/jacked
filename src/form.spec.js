import {configureBuilder} from './form';
import {set} from 'lodash/fp';
import traverse from 'traverse';
function mockValidator(schema){
    return function(value) {
        return traverse(value).reduce(function(arr,node) {
            if (this.isLeaf && node != "good value") {
                arr.push({path: this.path.join("."), message: "was bad value"})
            }
            return arr;
        },[]);
    }
}
function mockFieldBuilder({value,onChange,error,dirty}) {
    return {
        value,
        onChange,
        error,
        dirty
    }
}
function mockMerger(model,field,value){
    return set(field,value,model);
}
const attachBuilder = configureBuilder({
    validator: mockValidator,
    fieldBuilder: mockFieldBuilder,
    merger:mockMerger
});
describe("form",()=>{
    test("form should validate",function(){
        const value = {
            valid:"good value"
        }
        const builder = attachBuilder("schema");
        let newForm;
        const form = builder(value,form=>{
            newForm = form;
        });
        expect(form.fields.valid.value).toEqual("good value");
        expect(form.isValid).toEqual(true);
        expect(form.fields.valid.value).toEqual("good value");
        expect(form.fields.valid.error).toEqual(null);
        expect(form.errors).toEqual([]);
        expect(form.value).toEqual({valid:"good value"});
        expect(form.fields.valid.dirty).toEqual(false);

        form.fields.valid.onChange("new value");
        expect(newForm.isValid).toEqual(false);
        expect(newForm.fields.valid.value).toEqual("new value");
        expect(newForm.fields.valid.error).toEqual("was bad value");
        expect(newForm.errors).toEqual([{path:"valid",message:"was bad value"}]);
        expect(newForm.value).toEqual({valid:"new value"});
        expect(newForm.fields.valid.dirty).toEqual(true);

        expect(form.fields.valid.value).toEqual("good value");
        expect(form.isValid).toEqual(true);
        expect(form.fields.valid.value).toEqual("good value");
        expect(form.fields.valid.error).toEqual(null);
        expect(form.errors).toEqual([]);
        expect(form.value).toEqual({valid:"good value"});
        expect(form.fields.valid.dirty).toEqual(false);

    })
})