'use strict';

// const opd = Object.getOwnPropertyDescriptors;
// const ogp = Object.getPrototypeOf;

console.log('\nlet\'s fun\n\n\n');

const {
    define,
    // SymbolReplaceGaia
} = require('mnemonica');

var ExecutionContext = null;


const MySuperType = define('MySuperType', function () {
    this.numberField = 123;
    this.myMethod = function () {
        this;
        debugger;

        console.info('ExecutionContext : ', ExecutionContext.constructor.name);

        return this.numberField;
    };
});

// const myInstance = new MySuperType();

debugger;

MySuperType.registerHook('postCreation', function ({
    inheritedInstance
}) {
    this;
    inheritedInstance;
    Object.entries(inheritedInstance).forEach(([key, value]) => {
        if (typeof value !== 'function') {
            return;
        }
        delete inheritedInstance[key];
        Object.defineProperty(inheritedInstance, key, {
            get() {
                return function (...args) {
                    ExecutionContext = inheritedInstance;
                    const self = this || inheritedInstance;
                    const result = value.call(self, ...args);
                    ExecutionContext = null;
                    return result;
                };
            }
        });
    });
});

const myInstance = new MySuperType();

debugger;

const result = myInstance.myMethod();
console.log(result);

debugger;


const NestedType = MySuperType.define('NestedType', function () {
    this.nestedTypeProp = 'someNestedProp';
});

debugger;
const nestedInstance = new myInstance.NestedType();

console.log('nestedInstance instanceof NestedType  : ', nestedInstance instanceof NestedType);
console.log('nestedInstance instanceof MySuperType : ', nestedInstance instanceof MySuperType);

console.log(nestedInstance.myMethod());
debugger;

console.log('\n\n\nfun is over\n');