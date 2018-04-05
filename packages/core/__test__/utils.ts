import traverse from 'traverse';
import get from 'lodash.get';
export function mockValidator(schema){
    function validator(value) {
        return traverse(schema).reduce(function(arr,node) {
            node = get(value,this.path);
            if (this.isLeaf && (!node || node.indexOf("good") == -1)) {
                arr.push({path: this.path.join("."), message: "was bad value"})
            }
            return arr;
        },[]);
    }
    validator.getStructure = function(){
        return schema;
    };
    return validator;
}