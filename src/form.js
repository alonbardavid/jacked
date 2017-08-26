import traverse from 'traverse';
import {get} from 'lodash';
import {set} from 'lodash/fp';

class Form {
    value;
    fields;
    errors;
    schema;
    validator;
    merger;
    onChange;

    constructor(value, arg2) {
        this.value =value;
        if (arg2 instanceof Form){
            const previousForm = arg2;
            this.validator = previousForm.validator;
            this.merger = previousForm.merger;
            this.fieldBuilder = previousForm.fieldBuilder;
            this.fields = previousForm.fields;
            this.onChange = previousForm.onChange;
            this.errors = previousForm.errors;
        } else {
            const {schema,validator,merger,fieldBuilder,onChange} = arg2;
            this.validator = validator(schema);
            this.merger = merger;
            this.fieldBuilder = fieldBuilder;
            this.onChange = onChange;
            this.errors = [];
            this.buildFields();
            this.validateAll();
        }
    }
    onInput(path,value){
        const newValue = this.merger(this.value,path,value);
        const form = new Form(newValue,this);
        form.validateAfterFieldChange(path);
        this.onChange(form,{
            path,
            old:get(this.value,path),
            current:get(form.value,path)
        })
    }
    buildFields(){
        const {buildField} = this;
        this.fields = traverse(this.value).map(function(){
            if(this.isLeaf) {
                const value = this.node;
                this.update(buildField({path:this.path.join("."),value,error:null,dirty:false}),true);
            }
        })
    }
    buildField = ({path,value,error,dirty}) =>{
        const oldField = get(this.fields,path);
        return this.fieldBuilder({
            value,
            onChange:this.onInput.bind(this,path),
            error,
            prev:oldField,
            dirty:dirty == null? oldField.dirty : dirty
        });
    };
    updateFieldsFromErrors(errors){
        errors.forEach(change=>{
            const value = get(this.value,change.path);
            const field = this.buildField({path:change.path,value,error:change.error,dirty:change.dirty});
            this.fields = set(change.path,field,this.fields);
        });
        this.isValid = !(this.errors && this.errors.length > 0);

    }
    validateAll(){
        this.errors = this.validator(this.value);
        this.updateFieldsFromErrors(this.errors);
    }
    validateAfterFieldChange(path){
        const oldErrors = this.errors;
        this.errors = this.validator(this.value);

        const changes = getChanges(oldErrors,this.errors,path);
        this.updateFieldsFromErrors(changes);

    }
}
function getChanges(old,current,forcePath){
    const hash = old.reduce((hash,value)=>{
        hash.set(value.path,{
            path:value.path,
            error:value.error,
            old:true
        });
    },new Map());
    current.forEach(value=>{
        const old = hash.get(value.path);
        if (old && old.error == value.error) {
            hash.delete(value.path);
        } else {
            hash.set(value.path,{
                path:value.path,
                error:value.message
            })
        }
    });
    const forcedValue =hash.get(forcePath) || {path:forcePath,error:null};
    hash.set(forcePath,{
        ...forcedValue,
        dirty:true
    });
    return Array.from(hash.values()).map(x=>x.old?{path:x.path,error:null}:x);
}
export function configureBuilder(options){
    return function buildValidator(schema){
        return function validate(value,onChange){
            return new Form(value,{
                schema,
                onChange,
                ...options
            })
        }
    }
}

