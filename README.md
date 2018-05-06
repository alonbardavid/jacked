A library to manage forms in a simple, consistant and extendable way.
Built with support for react, react-native, ajv validation and class-validator.


## Why another form library

I needed a form library for react that'll handle the messy issues of validation and error handling for me, while allowing me
to completely control the layout, functionality and look of form components.
Other form libraries either require you to use their own input components or make working with your own components overly complicated.

Jacked gives you full control to use whatever tools you want to decide how forms are laid out, how they look, how they behave
and how to handle state.


## Installation

Jacked is a scoped package and consists of the following modules:

* @jacked/ajv - jacked with ajv validations
* @jacked/class-validator - jacked with class-validator
* @jacked/t-comb - jacked with t-comb validations

Sample components

* @jacked/react-dom - basic components to be used with react-dom
* @jacked/react-native - basic components to be used with react-native

* @jacked/core - core module for using jacked with your own validators.

## Example Usage


Jacked streamlines validations for many common validators (ajv, t-comb and class-validator).
The following examples use ajv validator.

### building a schema and a form

When using jacked you have to define a validation schema for the validator that was chosen. When using @jacked/ajv
we're using the standard JsonSchema schema.

Once a schema is defined, you can create forms.

```js
	import {makeFormBuilder} from '@jacked/ajv';

	const schema = {
		type: "object",
		properties:{
			"name":{
				type:"string"
			},
			"idNumber":{
				type:"integer"
			}
		},
		"required":["name","idNumber"]
	};

	const formBuilder = makeFormBuilder(schema);

	let form;
	function onInputChanged(change){
		form = form.update(change)
	}
	const originalForm = form = formBuilder({name:"first",idNumber:1},onFormChanged);

	//we can now call for field updates on the fields themselves, and the form variable will be updated
	console.log(form.fields.name.value); // prints "first"

	form.fields.name.onInput("second");
	console.log(form.fields.name.value); //prints "second"

	//jacked is immutable
	console.log(originalForm.fields.name.value); //prints "first"

	//jacked keeps referential identity for fields that haven't changed
	console.log(originalForm.fields.idNumber === form.fields.idNumber); // prints true

	//jacked keeps errors in both the field itself and aggregated in the top
	form.fields.idNumber.onInput("not number");

	console.log(form.fields.idNumber.isValid); // prints false
	console.log(form.fields.idNumber.error); // prints "should be integer"
	console.log(form.errors); // prints [{path:"idNumber",message:"should be integer"}]


```

Once a form is defined, using it with react (or any other one-way binding framework) is simple

```js

class Input extends Component {

   onInputChange = (event) =>{
        this.props.field.onInput(event.target.value || null);
    }
    render(){
        const {field} = this.props;
        return <div>
            <input value={field.value} onChange={this.onInputChange} />
            {field.error && <div className="error">
                {field.error}
            </div> }
        </div>
    }

}
class MyForm extends Component {

  constructor(props){
    super(props);
    this.state = {
      form: formBuilder({},this.onFormChanged)
    }
  }
  onFormChanged = (change)=>{
    this.setState({
      form:this.state.form.update(change),
    });
  };
  render() {
    const {fields} = this.state.form;

    return (
      <form className="App" >

        <div>
          <label htmlFor="name">Name*:</label>
          <Input field={fields.name} name="name" />
        </div>
        <div>
          <label htmlFor="idNumber">identification*:</label>
          <Input field={fields.idNumber} name="idNumber" />
        </div>
      </form>
    );
  }
}
```

## Form API

### Top level api

*   `makeFormBuilder` - use to create a form from a scheme. The main entry point for jacked (`@jacked/ajv` and `@jacked/class-validator`
Example:
```js
	import {makeFormBuilder} from '@jacked/ajv';

	const schema = {
		type: "object",
		properties:{
			"name":{
				type:"string"
			},
			"idNumber":{
				type:"integer"
			}
		},
		"required":["name","idNumber"]
	};

	const formBuilder = makeFormBuilder(schema);
```

**    In `@jacked/ajv` `makeFormBuilder` receives a JsonSchema (with ajv extenstions)

*  `formBuilder(options)` - `makeFormBuilder` returns a form builder function. The form builder function
receives one argument and returns an instance of a form.

** `options`:
### FormBuilder

*

## Reason behind architecture choices

* Why does `formBuilder` require an onInput method?
Without passing the onInput from the top, you would have had to use a mixin or somehow relinquish control of state
to jacked, which is what other libraries do.

* Why does onInput return the change and not the form itself
It let's you had extra functionality based on changes if you need to without digging into the jacked's internals.


## Performance

Jacked's architecture makes sure that only fields that were changed are modified, which means that if PureComponent
or similar solutions are used, only the components that changed will be rendered.

However since jacked validates the entire object every time a field changes, it might cause performance issues for
large forms.


