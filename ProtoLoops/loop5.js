'use strict';

const opd = Object.getOwnPropertyDescriptors;
const ogp = Object.getPrototypeOf;

class A {a = 1};
class B {b = 2};
class C {c = 3};
class D {d = 4};
class E {e = 5};

const a = new A;
const b = new B;
const c = new C;
const d = new D;
const e = new E;
debugger;

// const commonProps = opd(Object.prototype);
const commonProps = opd(ogp({}));

// let searchSet = null;

const proxify = function (initial) {
	const props = opd(initial);
	const handler = {
		get (target, prop, receiver) {
			if (prop === Symbol.toPrimitive) {
				// node.js inspector needs this
				// debugger;
				proxify.started = undefined;
				return function () {
					return 'the ring';
				};
			}
			// any of other symbols are... 
			// emm...
			// how for example Symbol nodejs.utils.custom???
			if (typeof prop === 'symbol') {
				debugger;
				return undefined;
			}
			if (target[prop]) {
				return target[prop];
			}
			debugger;
			return Reflect.get(receiver, prop);
		},
		setPrototypeOf (into, value) {
			// Object.setPrototypeOf(into, value);
			// https://262.ecma-international.org/7.0/#sec-immutable-prototype-exotic-objects
			// https://github.com/tc39/ecma262/issues/272
			// const proto = ogp(initial);
			// if (proto === Object.prototype) {
			//	 // here is the simple object, not a class or constructor instance
			//	 Object.setPrototypeOf(initial, value);
			// } else {
			//	 const prepared = {};
			//	 Object.setPrototypeOf(prepared, value);
			//	 Object.setPrototypeOf(initial, prepared);
			// }
			Object.setPrototypeOf(initial, value);
			return true;
		},
		get getPrototypeOf () {
			// debugger;
			// if (searchSet === null) {
			//	 searchSet = new Set();
			// }

			return function (value) {
				// if (searchSet.has(value)) {
				//	 searchSet = null;
				//	 return Object.prototype;
				// }
				// searchSet.add(value);
				return value;
			};
		},
		ownKeys (target) {
			const keys = Reflect.ownKeys(target);
			debugger;
			return keys;
		},
		getOwnPropertyDescriptor (target, prop) {
			// if (commonProps[prop]) {
			// 	const answer = commonProps[prop];
			// 	const result = Object.assign({}, answer);
			//  return result;
			// }
			if (prop === 'constructor') {
				return {
					configurable: false
				};
			}
			const answer = props[prop];
			debugger;
			return answer;
		}
	};
	const p = new Proxy(initial, handler);
	return p;
};


const ring = (...args) => {

	const initial = proxify(args[0]);
	let current = initial;

	args.slice(1).forEach(arg => {
		const p = proxify(arg);
		Object.setPrototypeOf(current, p);
		current = p;
	}, current);

	Object.setPrototypeOf(current, initial);

	return initial;

};


// debugger;
// const loop = [a, a, a, b, c, d, e, { m: 7 }];
const loop = [a, b, c, d, e, {m: 7}];
const theRing = ring(...loop);

debugger;
console.log(theRing.a === 1);
console.log(theRing.b === 2);
console.log(theRing.c === 3);
console.log(theRing.d === 4);
console.log(theRing.e === 5);
console.log(theRing.m === 7);
// debugger;
loop.forEach(obj => {
	// debugger;
	console.log(opd(obj));
	console.log(obj.a === 1);
	console.log(obj.b === 2);
	console.log(obj.c === 3);
	console.log(obj.d === 4);
	console.log(obj.e === 5);
});

debugger;

console.log(opd(ogp(a)));
console.log(opd(ogp(ogp(ogp(a)))));
console.log(opd(ogp(ogp(ogp(ogp(ogp(a)))))));


const z = {
	z: 123
};


Object.setPrototypeOf(z, theRing);

console.log('wohoo', z.m === 7);
console.log('wohoo', z.z === 123);

/*
console.log('a instanceof A : ', a instanceof A);
console.log('b instanceof B : ', b instanceof B);
console.log('c instanceof C : ', c instanceof C);
console.log('d instanceof D : ', d instanceof D);
console.log('e instanceof E : ', e instanceof E);

debugger;

console.log('\nWoW Now!\n');

console.log('a instanceof B : ', a instanceof B);
console.log('a instanceof C : ', a instanceof C);
console.log('a instanceof D : ', a instanceof D);
console.log('a instanceof E : ', a instanceof E);

console.log('\nIt was wow, isn\'t it?!\n');

try {
	debugger;
	console.log('a instanceof Object : ', a instanceof Object);
} catch (e) {
	console.error(e);
}
*/