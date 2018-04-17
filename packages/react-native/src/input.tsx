import React from 'react';
import {TextInput as NativeTextInput,View,Text,ViewStyle,TextStyle,TextInputStyle,TextInputProps} from 'react-native';
import {FieldProps} from '@jacked/core';

export interface InputProps extends TextInputProps{
    field:FieldProps,
    containerStyle?:ViewStyle,
    errorStyle?:TextStyle

}
export class TextInput extends React.PureComponent<InputProps> {

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
    render(){
        const {field,errorStyle,containerStyle,...rest} = this.props;
        const {focused} = this.state;
        return <View style={containerStyle}>
            <NativeTextInput value={field.value || ""} onChangeText={field.onInput} disabled={field.disabled} {...rest}
                 onFocus={this.onFocus} onBlur={this.onBlur}/>
            {field.error && (field.submitted || (field.dirty && !focused)) &&
            <Text style={errorStyle}>
                {field.error}
            </Text> }
        </View>
    }
}
