import {formBuilder} from "../src/index";
import {IsString,IsNumber,Min} from 'node_modules/class-validator';


describe("class-validator",()=>{
    class Sample {
        @IsString()
        str:string;

        @IsNumber()
        @Min(60)
        num:number;
    }
    test("validator works when used in core",()=>{
        const value =  new Sample();
        value.str = 1;
        value.num = 12;

        const builder = formBuilder(Sample);
        let newForm;
        const form = builder(value,change=>{
            newForm = form.update(change);
        });
        expect(form.fields.str.value).toEqual(1);
        expect(form.isValid).toEqual(false);
        expect(form.fields.num.value).toEqual(12);
        expect(form.isValid).toEqual(false);
        expect(form.fields.num.error).toEqual("num must be greater than 60");
        expect(form.fields.str.error).toEqual("str must be a string");
        expect(form.errors.length).toEqual(2);
    })
});