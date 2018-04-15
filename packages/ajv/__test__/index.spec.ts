import {makeFormBuilder} from "../src/index";

const schema = {
    type:"object",
    properties:{
        str:{
            type:"string"
        },
        num:{
            type:"number",
            minimum:60
        }
    }
};

describe("class-validator",()=>{

    test("validator works when used in core",()=>{
        const value =  {
            str:1,
            num:12
        }

        const builder = makeFormBuilder(schema);
        let newForm;
        const form = builder(value,change=>{
            newForm = form.update(change);
        });
        expect(form.fields.str.value).toEqual(1);
        expect(form.isValid).toEqual(false);
        expect(form.fields.num.value).toEqual(12);
        expect(form.isValid).toEqual(false);
        expect(form.fields.num.error).toEqual("should be >= 60");
        expect(form.fields.str.error).toEqual("should be string");
        expect(form.errors.length).toEqual(2);
    })
});