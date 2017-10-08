Object.defineProperty(exports,"__esModule",{value:true});var _extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key];}}}return target;};var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();exports.configureBuilder=configureBuilder;var _traverse=require('traverse');var _traverse2=_interopRequireDefault(_traverse);var _lodash=require('lodash');var _fp=require('lodash/fp');function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}var Form=function(){function Form(value,arg2){_classCallCheck(this,Form);_initialiseProps.call(this);this.value=value;if(arg2 instanceof Form){this._initFromPreviousForm(arg2);}else{this._initFromOptions(arg2);}}_createClass(Form,[{key:'_initFromPreviousForm',value:function _initFromPreviousForm(previousForm){this.validator=previousForm.validator;this.fields=previousForm.fields;this.onInput=previousForm.onInput;this.errors=previousForm.errors;}},{key:'_initFromOptions',value:function _initFromOptions(options){this.validator=options.validator(options.schema);this.onInput=options.onInput;this.errors=[];this._buildFields();this._validateAll();}},{key:'_onInput',value:function _onInput(path,value){this.onInput({path:path,value:value});}},{key:'update',value:function update(change){var validate=arguments.length>1&&arguments[1]!==undefined?arguments[1]:true;var newRootValue=(0,_fp.set)(change.path,change.value,this.value);var form=new Form(newRootValue,this);if(validate){form._validateAfterFieldChange(change.path);}else{form._setFieldDirty(change.path);}return form;}},{key:'_buildFields',value:function _buildFields(){var _buildField=this._buildField,value=this.value;this.fields=(0,_traverse2.default)(this.validator.getStructure()).map(function(){if(this.isLeaf){this.update(_buildField({path:this.path.join("."),value:(0,_lodash.get)(value,this.path),error:null,dirty:false}),true);}});}},{key:'_updateFieldsFromErrors',value:function _updateFieldsFromErrors(errors){var _this=this;errors.forEach(function(change){var value=(0,_lodash.get)(_this.value,change.path);var field=_this._buildField({path:change.path,value:value,error:change.message,dirty:change.dirty});_this.fields=(0,_fp.set)(change.path,field,_this.fields);});this.isValid=!(this.errors&&this.errors.length>0);}},{key:'_rebuildFields',value:function _rebuildFields(){var _buildField=this._buildField,value=this.value;this.fields=(0,_traverse2.default)(this.fields).map(function(){if(this.node.onInput){this.update(_buildField({path:this.path.join("."),value:(0,_lodash.get)(value,this.path),error:this.node.error,dirty:this.node.dirty}),true);}});}},{key:'_setFieldDirty',value:function _setFieldDirty(path){var oldField=(0,_lodash.get)(this.fields,path);var field=this._buildField({path:path,error:oldField.error,dirty:true,value:(0,_lodash.get)(this.value,path)});this.fields=(0,_fp.set)(path,field,this.fields);}},{key:'_validateAll',value:function _validateAll(){this.errors=this.validator(this.value);this._updateFieldsFromErrors(this.errors);}},{key:'validate',value:function validate(){var form=new Form(this.value,this);form._validateAfterFieldChange();return form;}},{key:'setSubmitted',value:function setSubmitted(){var submitted=arguments.length>0&&arguments[0]!==undefined?arguments[0]:true;return this.setFormProperties({submitted:submitted});}},{key:'setFormProperties',value:function setFormProperties(props){var form=new Form(this.value,this);form._submitted=props.submitted==null?form._submitted:props.submitted;form._disabled=props.disabled==null?form._disabled:props.disabled;if(this._submitted!=props.submitted||this._disabled!=props.disabled){form._rebuildFields();}form.isValid=this.isValid;return form;}},{key:'_validateAfterFieldChange',value:function _validateAfterFieldChange(dirtyPath){var oldErrors=this.errors;this.errors=this.validator(this.value);var changes=this.getChanges(oldErrors,this.errors,dirtyPath);this._updateFieldsFromErrors(changes);}}]);return Form;}();var _initialiseProps=function _initialiseProps(){var _this2=this;this._submitted=false;this._disabled=false;this._buildField=function(_ref){var path=_ref.path,value=_ref.value,error=_ref.error,dirty=_ref.dirty;var oldField=(0,_lodash.get)(_this2.fields,path);return{value:value,onInput:_this2._onInput.bind(_this2,path),error:error,submitted:_this2._submitted,disabled:_this2._disabled,dirty:dirty!=null?dirty:oldField&&oldField.dirty};};this.getChanges=function(old,current,dirtyPath){var hash=old.reduce(function(hash,value){hash.set(value.path,{path:value.path,message:value.message,old:true});return hash;},new Map());current.forEach(function(value){var old=hash.get(value.path);if(old&&old.message==value.message){hash.delete(value.path);}else{hash.set(value.path,{path:value.path,message:value.message});}});if(dirtyPath){var oldError=((0,_lodash.get)(_this2.fields,dirtyPath)||{}).error;var dirtyValue=hash.get(dirtyPath)||{path:dirtyPath,message:oldError};hash.set(dirtyPath,_extends({},dirtyValue,{dirty:true}));}return Array.from(hash.values()).map(function(x){return x.old?{path:x.path,error:null}:x;});};};function configureBuilder(options){return function buildValidator(schema){return function validate(value,onInput){return new Form(value,_extends({},options,{schema:schema,onInput:onInput}));};};}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9mb3JtLmpzIl0sIm5hbWVzIjpbImNvbmZpZ3VyZUJ1aWxkZXIiLCJGb3JtIiwidmFsdWUiLCJhcmcyIiwiX2luaXRGcm9tUHJldmlvdXNGb3JtIiwiX2luaXRGcm9tT3B0aW9ucyIsInByZXZpb3VzRm9ybSIsInZhbGlkYXRvciIsImZpZWxkcyIsIm9uSW5wdXQiLCJlcnJvcnMiLCJvcHRpb25zIiwic2NoZW1hIiwiX2J1aWxkRmllbGRzIiwiX3ZhbGlkYXRlQWxsIiwicGF0aCIsImNoYW5nZSIsInZhbGlkYXRlIiwibmV3Um9vdFZhbHVlIiwiZm9ybSIsIl92YWxpZGF0ZUFmdGVyRmllbGRDaGFuZ2UiLCJfc2V0RmllbGREaXJ0eSIsIl9idWlsZEZpZWxkIiwiZ2V0U3RydWN0dXJlIiwibWFwIiwiaXNMZWFmIiwidXBkYXRlIiwiam9pbiIsImVycm9yIiwiZGlydHkiLCJmb3JFYWNoIiwiZmllbGQiLCJtZXNzYWdlIiwiaXNWYWxpZCIsImxlbmd0aCIsIm5vZGUiLCJvbGRGaWVsZCIsIl91cGRhdGVGaWVsZHNGcm9tRXJyb3JzIiwic3VibWl0dGVkIiwic2V0Rm9ybVByb3BlcnRpZXMiLCJwcm9wcyIsIl9zdWJtaXR0ZWQiLCJfZGlzYWJsZWQiLCJkaXNhYmxlZCIsIl9yZWJ1aWxkRmllbGRzIiwiZGlydHlQYXRoIiwib2xkRXJyb3JzIiwiY2hhbmdlcyIsImdldENoYW5nZXMiLCJfb25JbnB1dCIsImJpbmQiLCJvbGQiLCJjdXJyZW50IiwiaGFzaCIsInJlZHVjZSIsInNldCIsIk1hcCIsImdldCIsImRlbGV0ZSIsIm9sZEVycm9yIiwiZGlydHlWYWx1ZSIsIkFycmF5IiwiZnJvbSIsInZhbHVlcyIsIngiLCJidWlsZFZhbGlkYXRvciJdLCJtYXBwaW5ncyI6Iit4QkFpS2dCQSxnQixDQUFBQSxnQixDQWpLaEIsa0MsaURBQ0EsOEJBQ0EsNkIsdU9BRU1DLEssWUFTRixjQUFZQyxLQUFaLENBQW1CQyxJQUFuQixDQUF5Qix3REFDckIsS0FB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Q0FOLEtBQUtFLEdBQUwsQ0FBU1YsU0FBVCxhQUNPZSxVQURQLEVBRUkvQixNQUFPLElBRlgsSUFJSCxDQUNELE1BQU9nQyxPQUFNQyxJQUFOLENBQVdULEtBQUtVLE1BQUwsRUFBWCxFQUEwQnZDLEdBQTFCLENBQThCLGtCQUFHd0MsR0FBRWIsR0FBRixDQUFNLENBQUNwQyxLQUFLaUQsRUFBRWpELElBQVIsQ0FBYWEsTUFBTSxJQUFuQixDQUFOLENBQStCb0MsQ0FBbEMsRUFBOUIsQ0FBUCxDQUNILEMsR0FFRSxRQUFTaEUsaUJBQVQsQ0FBMEJXLE9BQTFCLENBQWtDLENBQ3JDLE1BQU8sU0FBU3NELGVBQVQsQ0FBd0JyRCxNQUF4QixDQUErQixDQUNsQyxNQUFPLFNBQVNLLFNBQVQsQ0FBa0JmLEtBQWxCLENBQXdCTyxPQUF4QixDQUFnQyxDQUNuQyxNQUFPLElBQUlSLEtBQUosQ0FBU0MsS0FBVCxhQUNBUyxPQURBLEVBRUhDLGFBRkcsQ0FHSEgsZUFIRyxHQUFQLENBS0gsQ0FORCxDQU9ILENBUkQsQ0FTSCIsImZpbGUiOiJmb3JtLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHRyYXZlcnNlIGZyb20gJ3RyYXZlcnNlJztcclxuaW1wb3J0IHtnZXR9IGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCB7c2V0fSBmcm9tICdsb2Rhc2gvZnAnO1xyXG5cclxuY2xhc3MgRm9ybSB7XHJcbiAgICB2YWx1ZTtcclxuICAgIGZpZWxkcztcclxuICAgIGVycm9ycztcclxuICAgIHZhbGlkYXRvcjtcclxuICAgIG9uSW5wdXQ7XHJcbiAgICBfc3VibWl0dGVkID0gZmFsc2U7XHJcbiAgICBfZGlzYWJsZWQgPSBmYWxzZTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZSwgYXJnMikge1xyXG4gICAgICAgIHRoaXMudmFsdWUgPXZhbHVlO1xyXG4gICAgICAgIGlmIChhcmcyIGluc3RhbmNlb2YgRm9ybSl7XHJcbiAgICAgICAgICAgIHRoaXMuX2luaXRGcm9tUHJldmlvdXNGb3JtKGFyZzIpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2luaXRGcm9tT3B0aW9ucyhhcmcyKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBfaW5pdEZyb21QcmV2aW91c0Zvcm0ocHJldmlvdXNGb3JtKXtcclxuICAgICAgICB0aGlzLnZhbGlkYXRvciA9IHByZXZpb3VzRm9ybS52YWxpZGF0b3I7XHJcbiAgICAgICAgdGhpcy5maWVsZHMgPSBwcmV2aW91c0Zvcm0uZmllbGRzO1xyXG4gICAgICAgIHRoaXMub25JbnB1dCA9IHByZXZpb3VzRm9ybS5vbklucHV0O1xyXG4gICAgICAgIHRoaXMuZXJyb3JzID0gcHJldmlvdXNGb3JtLmVycm9ycztcclxuICAgIH1cclxuICAgIF9pbml0RnJvbU9wdGlvbnMob3B0aW9ucyl7XHJcbiAgICAgICAgdGhpcy52YWxpZGF0b3IgPSBvcHRpb25zLnZhbGlkYXRvcihvcHRpb25zLnNjaGVtYSk7XHJcbiAgICAgICAgdGhpcy5vbklucHV0ID0gb3B0aW9ucy5vbklucHV0O1xyXG4gICAgICAgIHRoaXMuZXJyb3JzID0gW107XHJcbiAgICAgICAgdGhpcy5fYnVpbGRGaWVsZHMoKTtcclxuICAgICAgICB0aGlzLl92YWxpZGF0ZUFsbCgpO1xyXG4gICAgfVxyXG4gICAgX29uSW5wdXQocGF0aCx2YWx1ZSl7XHJcbiAgICAgICAgdGhpcy5vbklucHV0KHtcclxuICAgICAgICAgICAgcGF0aCxcclxuICAgICAgICAgICAgdmFsdWVcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHVwZGF0ZShjaGFuZ2UsdmFsaWRhdGU9dHJ1ZSl7XHJcbiAgICAgICAgY29uc3QgbmV3Um9vdFZhbHVlID0gc2V0KGNoYW5nZS5wYXRoLGNoYW5nZS52YWx1ZSx0aGlzLnZhbHVlKTtcclxuICAgICAgICBjb25zdCBmb3JtID0gbmV3IEZvcm0obmV3Um9vdFZhbHVlLHRoaXMpO1xyXG4gICAgICAgIGlmICh2YWxpZGF0ZSl7XHJcbiAgICAgICAgICAgIGZvcm0uX3ZhbGlkYXRlQWZ0ZXJGaWVsZENoYW5nZShjaGFuZ2UucGF0aCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZm9ybS5fc2V0RmllbGREaXJ0eShjaGFuZ2UucGF0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmb3JtO1xyXG4gICAgfVxyXG4gICAgX2J1aWxkRmllbGRzKCl7XHJcbiAgICAgICAgY29uc3Qge19idWlsZEZpZWxkLHZhbHVlfSA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5maWVsZHMgPSB0cmF2ZXJzZSh0aGlzLnZhbGlkYXRvci5nZXRTdHJ1Y3R1cmUoKSkubWFwKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuaXNMZWFmKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZShfYnVpbGRGaWVsZCh7cGF0aDp0aGlzLnBhdGguam9pbihcIi5cIiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOmdldCh2YWx1ZSx0aGlzLnBhdGgpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcjpudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXJ0eTpmYWxzZX0pXHJcbiAgICAgICAgICAgICAgICAgICAgLHRydWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuICAgIF9idWlsZEZpZWxkID0gKHtwYXRoLHZhbHVlLGVycm9yLGRpcnR5fSkgPT57XHJcbiAgICAgICAgY29uc3Qgb2xkRmllbGQgPSBnZXQodGhpcy5maWVsZHMscGF0aCk7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgdmFsdWUsXHJcbiAgICAgICAgICAgIG9uSW5wdXQ6dGhpcy5fb25JbnB1dC5iaW5kKHRoaXMscGF0aCksXHJcbiAgICAgICAgICAgIGVycm9yLFxyXG4gICAgICAgICAgICBzdWJtaXR0ZWQ6dGhpcy5fc3VibWl0dGVkLFxyXG4gICAgICAgICAgICBkaXNhYmxlZDp0aGlzLl9kaXNhYmxlZCxcclxuICAgICAgICAgICAgZGlydHk6ZGlydHkgIT0gbnVsbD8gZGlydHkgOiBvbGRGaWVsZCAmJiBvbGRGaWVsZC5kaXJ0eVxyXG4gICAgICAgIH07XHJcbiAgICB9O1xyXG4gICAgX3VwZGF0ZUZpZWxkc0Zyb21FcnJvcnMoZXJyb3JzKXtcclxuICAgICAgICBlcnJvcnMuZm9yRWFjaChjaGFuZ2U9PntcclxuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBnZXQodGhpcy52YWx1ZSxjaGFuZ2UucGF0aCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGZpZWxkID0gdGhpcy5fYnVpbGRGaWVsZCh7cGF0aDpjaGFuZ2UucGF0aCx2YWx1ZSxlcnJvcjpjaGFuZ2UubWVzc2FnZSxkaXJ0eTpjaGFuZ2UuZGlydHl9KTtcclxuICAgICAgICAgICAgdGhpcy5maWVsZHMgPSBzZXQoY2hhbmdlLnBhdGgsZmllbGQsdGhpcy5maWVsZHMpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuaXNWYWxpZCA9ICEodGhpcy5lcnJvcnMgJiYgdGhpcy5lcnJvcnMubGVuZ3RoID4gMCk7XHJcblxyXG4gICAgfVxyXG4gICAgX3JlYnVpbGRGaWVsZHMoKXtcclxuICAgICAgICBjb25zdCB7X2J1aWxkRmllbGQsdmFsdWV9ID0gdGhpcztcclxuICAgICAgICB0aGlzLmZpZWxkcyA9IHRyYXZlcnNlKHRoaXMuZmllbGRzKS5tYXAoZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgaWYodGhpcy5ub2RlLm9uSW5wdXQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKF9idWlsZEZpZWxkKHtwYXRoOnRoaXMucGF0aC5qb2luKFwiLlwiKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6Z2V0KHZhbHVlLHRoaXMucGF0aCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yOnRoaXMubm9kZS5lcnJvcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGlydHk6dGhpcy5ub2RlLmRpcnR5fSlcclxuICAgICAgICAgICAgICAgICAgICAsdHJ1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfVxyXG4gICAgX3NldEZpZWxkRGlydHkocGF0aCl7XHJcbiAgICAgICAgY29uc3Qgb2xkRmllbGQgPSBnZXQodGhpcy5maWVsZHMscGF0aCk7XHJcbiAgICAgICAgY29uc3QgZmllbGQgPSB0aGlzLl9idWlsZEZpZWxkKHtwYXRoLGVycm9yOm9sZEZpZWxkLmVycm9yLGRpcnR5OnRydWUsdmFsdWU6Z2V0KHRoaXMudmFsdWUscGF0aCl9KTtcclxuICAgICAgICB0aGlzLmZpZWxkcyA9IHNldChwYXRoLGZpZWxkLHRoaXMuZmllbGRzKTtcclxuICAgIH1cclxuICAgIF92YWxpZGF0ZUFsbCgpe1xyXG4gICAgICAgIHRoaXMuZXJyb3JzID0gdGhpcy52YWxpZGF0b3IodGhpcy52YWx1ZSk7XHJcbiAgICAgICAgdGhpcy5fdXBkYXRlRmllbGRzRnJvbUVycm9ycyh0aGlzLmVycm9ycyk7XHJcbiAgICB9XHJcbiAgICB2YWxpZGF0ZSgpe1xyXG4gICAgICAgIGNvbnN0IGZvcm0gPSBuZXcgRm9ybSh0aGlzLnZhbHVlLHRoaXMpO1xyXG4gICAgICAgIGZvcm0uX3ZhbGlkYXRlQWZ0ZXJGaWVsZENoYW5nZSgpO1xyXG4gICAgICAgIHJldHVybiBmb3JtO1xyXG4gICAgfVxyXG4gICAgc2V0U3VibWl0dGVkKHN1Ym1pdHRlZD10cnVlKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5zZXRGb3JtUHJvcGVydGllcyh7XHJcbiAgICAgICAgICAgIHN1Ym1pdHRlZDpzdWJtaXR0ZWRcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG4gICAgc2V0Rm9ybVByb3BlcnRpZXMocHJvcHMpe1xyXG4gICAgICAgIGNvbnN0IGZvcm0gPSBuZXcgRm9ybSh0aGlzLnZhbHVlLHRoaXMpO1xyXG4gICAgICAgIGZvcm0uX3N1Ym1pdHRlZCA9IHByb3BzLnN1Ym1pdHRlZCA9PSBudWxsP2Zvcm0uX3N1Ym1pdHRlZCA6IHByb3BzLnN1Ym1pdHRlZDtcclxuICAgICAgICBmb3JtLl9kaXNhYmxlZCA9IHByb3BzLmRpc2FibGVkID09IG51bGw/Zm9ybS5fZGlzYWJsZWQgOiBwcm9wcy5kaXNhYmxlZDtcclxuICAgICAgICBpZiAodGhpcy5fc3VibWl0dGVkICE9IHByb3BzLnN1Ym1pdHRlZCB8fCB0aGlzLl9kaXNhYmxlZCAhPSBwcm9wcy5kaXNhYmxlZCl7XHJcbiAgICAgICAgICAgIGZvcm0uX3JlYnVpbGRGaWVsZHMoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9ybS5pc1ZhbGlkID0gdGhpcy5pc1ZhbGlkO1xyXG4gICAgICAgIHJldHVybiBmb3JtO1xyXG4gICAgfVxyXG4gICAgX3ZhbGlkYXRlQWZ0ZXJGaWVsZENoYW5nZShkaXJ0eVBhdGgpe1xyXG4gICAgICAgIGNvbnN0IG9sZEVycm9ycyA9IHRoaXMuZXJyb3JzO1xyXG4gICAgICAgIHRoaXMuZXJyb3JzID0gdGhpcy52YWxpZGF0b3IodGhpcy52YWx1ZSk7XHJcbiAgICAgICAgY29uc3QgY2hhbmdlcyA9IHRoaXMuZ2V0Q2hhbmdlcyhvbGRFcnJvcnMsdGhpcy5lcnJvcnMsZGlydHlQYXRoKTtcclxuICAgICAgICB0aGlzLl91cGRhdGVGaWVsZHNGcm9tRXJyb3JzKGNoYW5nZXMpO1xyXG4gICAgfVxyXG4gICAgZ2V0Q2hhbmdlcyA9IChvbGQsY3VycmVudCxkaXJ0eVBhdGgpID0+e1xyXG4gICAgICAgIGNvbnN0IGhhc2ggPSBvbGQucmVkdWNlKChoYXNoLHZhbHVlKT0+e1xyXG4gICAgICAgICAgICBoYXNoLnNldCh2YWx1ZS5wYXRoLHtcclxuICAgICAgICAgICAgICAgIHBhdGg6dmFsdWUucGF0aCxcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6dmFsdWUubWVzc2FnZSxcclxuICAgICAgICAgICAgICAgIG9sZDp0cnVlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gaGFzaDtcclxuICAgICAgICB9LG5ldyBNYXAoKSk7XHJcbiAgICAgICAgY3VycmVudC5mb3JFYWNoKHZhbHVlPT57XHJcbiAgICAgICAgICAgIGNvbnN0IG9sZCA9IGhhc2guZ2V0KHZhbHVlLnBhdGgpO1xyXG4gICAgICAgICAgICBpZiAob2xkICYmIG9sZC5tZXNzYWdlID09IHZhbHVlLm1lc3NhZ2UpIHtcclxuICAgICAgICAgICAgICAgIGhhc2guZGVsZXRlKHZhbHVlLnBhdGgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaGFzaC5zZXQodmFsdWUucGF0aCx7XHJcbiAgICAgICAgICAgICAgICAgICAgcGF0aDp2YWx1ZS5wYXRoLFxyXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6dmFsdWUubWVzc2FnZVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZiAoZGlydHlQYXRoKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG9sZEVycm9yID0gKGdldCh0aGlzLmZpZWxkcyxkaXJ0eVBhdGgpIHx8IHt9KS5lcnJvcjtcclxuICAgICAgICAgICAgY29uc3QgZGlydHlWYWx1ZSA9IGhhc2guZ2V0KGRpcnR5UGF0aCkgfHwge3BhdGg6IGRpcnR5UGF0aCwgbWVzc2FnZTpvbGRFcnJvcn07XHJcbiAgICAgICAgICAgIGhhc2guc2V0KGRpcnR5UGF0aCwge1xyXG4gICAgICAgICAgICAgICAgLi4uZGlydHlWYWx1ZSxcclxuICAgICAgICAgICAgICAgIGRpcnR5OiB0cnVlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gQXJyYXkuZnJvbShoYXNoLnZhbHVlcygpKS5tYXAoeD0+eC5vbGQ/e3BhdGg6eC5wYXRoLGVycm9yOm51bGx9OngpO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBjb25maWd1cmVCdWlsZGVyKG9wdGlvbnMpe1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIGJ1aWxkVmFsaWRhdG9yKHNjaGVtYSl7XHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIHZhbGlkYXRlKHZhbHVlLG9uSW5wdXQpe1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IEZvcm0odmFsdWUse1xyXG4gICAgICAgICAgICAgICAgLi4ub3B0aW9ucyxcclxuICAgICAgICAgICAgICAgIHNjaGVtYSxcclxuICAgICAgICAgICAgICAgIG9uSW5wdXQsXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG4iXX0=