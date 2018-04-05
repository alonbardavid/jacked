import {validator} from '../src/validator';

const schema = {
    type:"object",
    properties:{
        val:{
            type:"string"
        }
    }
};
describe("jacked-ajv",()=>{
   test("validator should return ok when value matches schema",()=>{
        const compiled = validator(schema);
        const result = compiled({val:"a string"});
        expect(result).toEqual([]);
   });
   test("validator should return an error when value doesn't match schema",()=>{
       const compiled = validator(schema);
       const result = compiled({val:5});
       expect(result).toEqual([{path:"val",message:"should be string"}]);
   });
   test("validator should return properly validate after making changes",()=>{
       const compiled = validator(schema);
       let result = compiled({val:"a string"});
       expect(result).toEqual([]);
       result = compiled({val:1});
       expect(result).toEqual([{path:"val",message:"should be string"}]);
   });

});