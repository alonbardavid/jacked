import {validator} from '../src/validator';
import {IsString,MinLength,ValidateNested} from 'node_modules/class-validator';

describe("jacked-class-validator",()=>{
    class TestObject {
        @IsString()
        val:string;

        @MinLength(20, {
            each: true
        })
        tags: string[];
    }
   test("validator should return ok when value matches schema",()=>{
        const compiled = validator(TestObject);
        const obj = new TestObject();
        obj.val = "a string";
        const result = compiled(obj);
        expect(result).toEqual([]);
   });
   test("validator should return an error when value doesn't match schema",()=>{
       const compiled = validator(TestObject);
       const obj = new TestObject();
       obj.val = 6;
       const result = compiled(obj);
       expect(result).toEqual([{path:"val",message:"val must be a string"}]);
   });
   test("validator should return properly validate after making changes",()=>{
       const compiled = validator(TestObject);
       const obj = new TestObject();
       obj.val = "a string";
       let result = compiled(obj);
       expect(result).toEqual([]);
       const obj2 = new TestObject();
        obj2.val = 1;
       result = compiled(obj2);
       expect(result).toEqual([{path:"val",message:"val must be a string"}]);
   });

    class CustomMessageObject {
        @MinLength(10,{
            message: "Custom message!"
        })
        val:string;
    }
   test("validator should handle custom messages",()=>{
       const compiled = validator(CustomMessageObject);
       const obj = new CustomMessageObject();
       obj.val = 6;
       const result = compiled(obj);
       expect(result).toEqual([{path:"val",message:"Custom message!"}]);
   });
    class ParentObject {
        @ValidateNested
        nested:CustomMessageObject;
    }
   test.skip("validator should handle nested objects",()=>{
       const compiled = validator(CustomMessageObject);
       const obj = new CustomMessageObject();
       obj.val = 6;
       const result = compiled(obj);
       expect(result).toEqual([{path:"val.val",message:"Custom message!"}]);
   });

});