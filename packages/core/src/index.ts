import traverse from 'traverse';
import get from 'lodash.get';
import {set} from 'object-path-immutable';

export interface Validator {
    (schema):any;
    getStructure:()=>Object
}
export type onInputFunc = (arg:{path:string,value:any})=>any;
export interface FormOptions {
    validator:Validator;
    onInput:onInputFunc;
    schema:any;
}
export interface FieldProps {
    value:any;
    onInput:(value:any)=>void;
    error?:string;
    submitted:boolean;
    disabled:boolean;
    dirty:boolean;
};
export type Field<Skeleton> = FieldMap<Skeleton> & FieldProps;

export type FieldMap<Skeleton> = {
    [P in keyof Skeleton]: Field<P>
}
export type Error = {
    path:string;
    message:string;
    dirty?:boolean;
}
export class Form<Skeleton> {
    value:any;
    fields:FieldMap<Skeleton>;
    errors?:Error[];
    validator;
    onInput:onInputFunc;
    _submitted = false;
    _disabled = false;
    isValid = true;

    constructor(value, arg2:Form<Skeleton>|FormOptions) {
        this.value =value;
        if (arg2 instanceof Form){
            this._initFromPreviousForm(arg2);
        } else {
            this._initFromOptions(arg2);
        }
    }
    _initFromPreviousForm(previousForm:Form<Skeleton>){
        this.validator = previousForm.validator;
        this.fields = previousForm.fields;
        this.onInput = previousForm.onInput;
        this.errors = previousForm.errors;
    }
    _initFromOptions(options:FormOptions){
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
        const newRootValue = set(this.value,change.path,change.value);
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
    _buildField = (args:{path:string,value:any,error?:string,dirty?:boolean}):Field<any> =>{
        const {path,value,error,dirty} = args;
        const oldField:Field<any> = get(this.fields,path);
        return {
            value,
            onInput:this._onInput.bind(this,path),
            error,
            submitted:this._submitted,
            disabled:this._disabled,
            dirty:dirty != null? dirty : oldField && oldField.dirty
        } as Field<any>;
    };
    _updateFieldsFromErrors(changes:Error[]){
        changes.forEach(change=>{
            const value = get(this.value,change.path);
            const field = this._buildField({path:change.path,value,error:change.message,dirty:change.dirty});
            this.fields = set(this.fields,change.path,field);
        });
        this.isValid = !(this.errors && this.errors.length > 0);

    }
    _rebuildFields(){
        const {_buildField,value} = this;
        this.fields = traverse(this.fields).map(function(){
            if(this.node.onInput) {
                this.update(_buildField({path:this.path.join("."),
                        value:get(value,this.path),
                        error:this.node.error,
                        dirty:this.node.dirty})
                    ,true);
            }
        })
    }
    _setFieldDirty(path){
        const oldField = get(this.fields,path);
        const field = this._buildField({path,error:oldField.error,dirty:true,value:get(this.value,path)});
        this.fields = set(this.fields,path,field);
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
    setSubmitted(submitted=true){
        return this.setFormProperties({
            submitted:submitted
        })
    }
    setFormProperties(props){
        const form = new Form(this.value,this);
        form._submitted = props.submitted == null?form._submitted : props.submitted;
        form._disabled = props.disabled == null?form._disabled : props.disabled;
        if (this._submitted != props.submitted || this._disabled != props.disabled){
            form._rebuildFields();
        }
        form.isValid = this.isValid;
        return form;
    }
    _validateAfterFieldChange(dirtyPath?){
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
            if (old && old.message == value.message) {
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
        return Array.from(hash.values()).map((x:any)=>x.old?{path:x.path,error:null}:x);
    }
}

export type formBuilder = <T> (value:T,onInput:onInputFunc)=>Form<T>;
export function configureBuilder(options){
    return function makeFormBuilder(schema){
        return function formBuilder<T>(value:T,onInput:onInputFunc){
            return new Form<T>(value,{
                ...options,
                schema,
                onInput,
            })
        }
    }
}

