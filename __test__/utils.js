import traverse from 'traverse';

export function mockValidator(schema){
    return function(value) {
        return traverse(value).reduce(function(arr,node) {
            if (this.isLeaf && node != "good value") {
                arr.push({path: this.path.join("."), message: "was bad value"})
            }
            return arr;
        },[]);
    }
}