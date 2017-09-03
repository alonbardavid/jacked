import traverse from 'traverse';
import {get} from 'lodash';
import {set} from 'lodash/fp';

class Form {
    value;
    fields;
    errors;
    validator;
    onInput;

    constructor(value, arg2) {
        this.value =value;
        if (arg2 instanceof Form){
            this._initFromPreviousForm(arg2);
        } else {
            this._initFromOptions(arg2);
        }
    }
    _initFromPreviousForm(previousForm){
        this.validator = previousForm.validator;
        this.fields = previousForm.fields;
        this.onInput = previousForm.onInput;
        this.errors = previousForm.errors;
    }
    _initFromOptions(options){
        this.validator = options.validator(options.schema);
        this.onInput = options.onInput;
        this.errors = [];
        this._buildFields();
        this._validateAll();
    }
    _onInput(path,value){
        this.onInput({
            path,
            value
        });
    }
    update(change,validate=true){
        const newRootValue = set(change.path,change.value,this.value);
        const form = new Form(newRootValue,this);
        if (validate){
            form._validateAfterFieldChange(change.path);
        } else {
            form._setFieldDirty(change.path);
        }
        return form;
    }
    _buildFields(){
        const {_buildField,value} = this;
        this.fields = traverse(this.validator.getStructure()).map(function(){
            if(this.isLeaf) {
                this.update(_buildField({path:this.path.join("."),
                    value:get(value,this.path),
                    error:null,
                    dirty:false})
                ,true);
            }
        })
    }
    _buildField = ({path,value,error,dirty}) =>{
        const oldField = get(this.fields,path);
        return {
            value,
            onInput:this._onInput.bind(this,path),
            error,
            dirty:dirty != null? dirty : oldField && oldField.dirty
        };
    };
    _updateFieldsFromErrors(errors){
        errors.forEach(change=>{
            const value = get(this.value,change.path);
            const field = this._buildField({path:change.path,value,error:change.message,dirty:change.dirty});
            this.fields = set(change.path,field,this.fields);
        });
        this.isValid = !(this.errors && this.errors.length > 0);

    }
    _setFieldDirty(path){
        const oldField = get(this.fields,path);
        const field = this._buildField({path,error:oldField.error,dirty:true,value:get(this.value,path)});
        this.fields = set(path,field,this.fields);
    }
    _validateAll(){
        this.errors = this.validator(this.value);
        this._updateFieldsFromErrors(this.errors);
    }
    validate(){
        const form = new Form(this.value,this);
        form._validateAfterFieldChange();
        return form;
    }
    _validateAfterFieldChange(dirtyPath){
        const oldErrors = this.errors;
        this.errors = this.validator(this.value);
        const changes = this.getChanges(oldErrors,this.errors,dirtyPath);
        this._updateFieldsFromErrors(changes);
    }
    getChanges = (old,current,dirtyPath) =>{
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
            const oldError = (get(this.fields,dirtyPath) || {}).error;
            const dirtyValue = hash.get(dirtyPath) || {path: dirtyPath, message:oldError};
            hash.set(dirtyPath, {
                ...dirtyValue,
                dirty: true
            });
        }
        return Array.from(hash.values()).map(x=>x.old?{path:x.path,error:null}:x);
    }
}
export function configureBuilder(options){
    return function buildValidator(schema){
        return function validate(value,onInput){
            return new Form(value,{
                ...options,
                schema,
                onInput,
            })
        }
    }
}

