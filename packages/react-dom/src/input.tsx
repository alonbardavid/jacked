import React from 'react';
import {FieldProps} from '@jacked/core';

export interface InputProps {
    field:FieldProps
}
export class Input extends React.PureComponent<InputProps> {

    state = {
        focused:false
    }
    onFocus = ()=>{
        this.setState({
            focused:true
        })
    }
    onBlur = ()=>{
        this.setState({
            focused:false
        })
    }
    onInputChange = (event) =>{
        this.props.field.onInput(event.target.value || null);
    }
    render(){
        const {field,...rest} = this.props;
        const {focused} = this.state;
        return <div className="jacked-field">
            <input value={field.value || ""} onChange={this.onInputChange} disabled={field.disabled} {...rest}
                className={`jacked-input ${field.error?"invalid":""}`} onFocus={this.onFocus} onBlur={this.onBlur}/>
            {field.error && (field.submitted || (field.dirty && !focused)) && <div className="jacked-error">
                {field.error}
            </div> }
        </div>
    }
}

export class NumberInput extends React.PureComponent<InputProps> {
    state = {
        focused:false
    }
    onFocus = ()=>{
        this.setState({
            focused:true
        })
    }
    onBlur = ()=>{
        this.setState({
            focused:false
        })
    }
    onInputChange = (event) =>{
        const value = parseFloat(event.target.value);
        this.props.field.onInput(isNaN(value)? event.target.value:value);
    }
    render(){
        const {field,...rest} = this.props;
        const {focused} = this.state;
        return <div className="jacked-field jacked-number-field">
            <input value={field.value || ""} onChange={this.onInputChange} disabled={field.disabled} {...rest}
                   className={`jacked-input ${field.error?"invalid":""}`} onFocus={this.onFocus} onBlur={this.onBlur} />
            {field.error && (field.submitted || (field.dirty && !focused)) && <div className="jacked-error">
                {field.error}
            </div> }
        </div>
    }
}
