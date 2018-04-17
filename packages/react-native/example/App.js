import React from 'react';
import {makeFormBuilder} from '@jacked/ajv';
import {TextInput} from '@jacked/react-native';
import { StyleSheet, Text, View, Button } from 'react-native';

const schema = {
  type: "object",
  properties:{
    "name":{
      type:"string"
    },
    "idNumber":{
      type:"integer"
    },
    "email":{
      type:"string",
      format:"email"
    },
    "address": {
      type:"object",
      properties:{
        "street":{
          type:"string"
        },
        "city":{
          type:"string"
        }
      }
    }
  },
  "required":["name","idNumber","email"]

};
const formBuilder = makeFormBuilder(schema);


export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      form: formBuilder({},this.onFormChanged),
      successMessage:null
    }
  }
  onFormChanged = (change)=>{
    this.setState({
      form:this.state.form.update(change),
    });
  };
  onSubmit = ()=>{
    const form = this.state.form.setSubmitted();
    if (form.isValid) {
      const {name,idNumber,email,address} = this.state.form.value;
      this.setState({
        form,
        successMessage:`Success - ${name}, ${idNumber},${email} . from ${address.street} ${address.city}`
      })
    } else {
      this.setState({form});
    }
  }
  render() {
    const {fields} = this.state.form;
    return (
      <View style={styles.container}>
        {this.state.successMessage && <Text>
          {this.state.successMessage}
        </Text>}
        <View>
          <Text>Name*:</Text>
          <TextInput field={fields.name} />
        </View>
        <Button title="submit" onPress={this.onSubmit}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
