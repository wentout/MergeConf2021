'use strict';

// const opd = Object.getOwnPropertyDescriptors;
// const ogp = Object.getPrototypeOf;

console.log('\nlet\'s fun\n\n\n');

const {
    define,
    // SymbolReplaceGaia
} = require('mnemonica');



// placeholder for us to be able
// to control where we are now
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

// debugger;

const ProxyGaia = new Proxy({}, {
    get(target, prop, receiver) {
        debugger;
        return Reflect.get(target, prop, receiver);
    },
    set(target, prop, value, receiver) {
        debugger;
        return Reflect.set(target, prop, value, receiver);
    }
});

debugger;

MySuperType.registerHook('postCreation', function ({
    inheritedInstance
}) {
    debugger;
    this;
    Object.entries(inheritedInstance).forEach(([key, value]) => {
        debugger;
        if (typeof value !== 'function') {
            return;
        }
        delete inheritedInstance[key];
        Object.defineProperty(inheritedInstance, key, {
            get() {
                const me = this;
                debugger;
                if (this !== inheritedInstance) {
                    throw new Error('wrong invocation');
                }
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

debugger;

const myInstance = MySuperType.call(ProxyGaia);

debugger;

const result = myInstance.myMethod();
console.log(result);

debugger;


const NestedType = MySuperType.define('NestedType', function () {
    debugger;
    this.nestedTypeProp = 'someNestedProp';
});

debugger;
const nestedInstance = new myInstance.NestedType();

debugger;
console.log('nestedInstance instanceof NestedType  : ', nestedInstance instanceof NestedType);
console.log('nestedInstance instanceof MySuperType : ', nestedInstance instanceof MySuperType);

console.log(nestedInstance.myMethod());
debugger;

console.log('\n\n\nfun is over\n');