import traverse from 'traverse';
import {get} from 'lodash';
import {set} from 'lodash/fp';

class Form {
    value;
    fields;
    errors;
    validator;
    onChange;

    constructor(value, arg2) {
        this.value =value;
        if (arg2 instanceof Form){
            this.initFromPreviousForm(arg2);
        } else {
            this.initFromOptions(arg2);
        }
    }
    initFromPreviousForm(previousForm){
        this.validator = previousForm.validator;
        this.fields = previousForm.fields;
        this.onChange = previousForm.onChange;
        this.errors = previousForm.errors;
    }
    initFromOptions(options){
        this.validator = options.validator(options.schema);
        this.onChange = options.onChange;
        this.errors = [];
        this.buildFields();
        this.validateAll();
    }
    onInput(path,value){
        this.onChange({
            path,
            value
        });
    }
    update(change,validate=true){
        const newRootValue = set(change.path,change.value,this.value);
        const form = new Form(newRootValue,this);
        if (validate){
            form.validateAfterFieldChange(change.path);
        } else {
            form.setFieldDirty(change.path);
        }
        return form;
    }
    buildFields(){
        const {buildField,value} = this;
        this.fields = traverse(this.validator.getStructure()).map(function(){
            if(this.isLeaf) {
                this.update(buildField({path:this.path.join("."),
                    value:get(value,this.path),
                    error:null,
                    dirty:false})
                ,true);
            }
        })
    }
    buildField = ({path,value,error,dirty}) =>{
        const oldField = get(this.fields,path);
        return {
            value,
            onChange:this.onInput.bind(this,path),
            error,
            dirty:dirty != null? dirty : oldField && oldField.dirty
        };
    };
    updateFieldsFromErrors(errors){
        errors.forEach(change=>{
            const value = get(this.value,change.path);
            const field = this.buildField({path:change.path,value,error:change.message,dirty:change.dirty});
            this.fields = set(change.path,field,this.fields);
        });
        this.isValid = !(this.errors && this.errors.length > 0);

    }
    setFieldDirty(path){
        const oldField = get(this.fields,path);
        const field = this.buildField({path,error:oldField.error,dirty:true,value:get(this.value,path)});
        this.fields = set(path,field,this.fields);
    }
    validateAll(){
        this.errors = this.validator(this.value);
        this.updateFieldsFromErrors(this.errors);
    }
    validate(){
        const form = new Form(this.value,this);
        form.validateAfterFieldChange();
        return form;
    }
    validateAfterFieldChange(dirtyPath){
        const oldErrors = this.errors;
        this.errors = this.validator(this.value);
        const changes = getChanges(oldErrors,this.errors,dirtyPath);
        this.updateFieldsFromErrors(changes);
    }
}
function getChanges(old,current,dirtyPath){
    const hash = old.reduce((hash,value)=>{
        hash.set(value.path,{
            path:value.path,
            message:value.message,
            old:true
        });
        return hash;
    },new Map());
    current.forEach(value=>{
        const old = hash.get(value.path);
        if (old && old.error == value.error) {
            hash.delete(value.path);
        } else {
            hash.set(value.path,{
                path:value.path,
                message:value.message
            })
        }
    });

    if (dirtyPath) {
        const dirtyValue = hash.get(dirtyPath) || {path: dirtyPath, error: null};
        hash.set(dirtyPath, {
            ...dirtyValue,
            dirty: true
        });
    }
    return Array.from(hash.values()).map(x=>x.old?{path:x.path,error:null}:x);
}
export function configureBuilder(options){
    return function buildValidator(schema){
        return function validate(value,onChange){
            return new Form(value,{
                ...options,
                schema,
                onChange,
            })
        }
    }
}

