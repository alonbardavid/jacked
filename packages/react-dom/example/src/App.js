import React, { Component } from 'react';
import {makeFormBuilder} from '@jacked/ajv';
import {Input,NumberInput} from '@jacked/react-dom';
import './App.css';

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

class App extends Component {

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
  onSubmit = (event)=>{
    event.preventDefault();
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
      <form className="App" onSubmit={this.onSubmit}>
        {this.state.successMessage && <div>
          {this.state.successMessage}
        </div>}
        <div>
          <label htmlFor="name">Name*:</label>
          <Input field={fields.name} name="name" />
        </div>
        <div>
          <label htmlFor="idNumber">Identification*:</label>
          <NumberInput field={fields.idNumber} name="idNumber" type="number"/>
        </div>
        <div>
          <label htmlFor="email">Email*:</label>
          <Input field={fields.email} name="email" />
        </div>
        <div>
          <label htmlFor="street">Street:</label>
          <Input field={fields.address.street} name="street" />
        </div>
        <div>
          <label htmlFor="city">City:</label>
          <Input field={fields.address.city} name="city" />
        </div>
        <button type="submit">submit</button>
      </form>
    );
  }
}

export default App;
