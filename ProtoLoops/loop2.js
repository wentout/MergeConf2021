'use strict';


const a = { a: 1 };

const b = { b: 2 };

const c = { c: 3 };

const d = { d: 4 };

const e = { e: 5, ee: 6, eee: 7  };

// const commonProps = Object.getOwnPropertyDescriptors(Object.prototype);
const commonProps = Object.getOwnPropertyDescriptors(Object.getPrototypeOf({}));

const proxify = function (initial) {
	const props = Object.getOwnPropertyDescriptors(initial);
	const handler = {
		get(target, prop, receiver) {
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
		setPrototypeOf(into, value) {
			Object.setPrototypeOf(into, value);
			return true;
		},
		ownKeys(target) {
			const keys = Reflect.ownKeys(target);
			debugger;
			return keys;
		},
		getOwnPropertyDescriptor(target, prop) {
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


debugger;
const loop = [a, b, c, d, e];
const theRing = ring(...loop);

debugger;
console.log(theRing.a === 1);
console.log(theRing.b === 2);
console.log(theRing.c === 3);
console.log(theRing.d === 4);
console.log(theRing.e === 5);
debugger;
loop.forEach(obj => {
	debugger;
	console.log(Object.getOwnPropertyDescriptors(obj));
	console.log(obj.a === 1);
	console.log(obj.b === 2);
	console.log(obj.c === 3);
	console.log(obj.d === 4);
	console.log(obj.e === 5);
	console.log(obj.ee === 6);
	console.log(obj.eee === 7);
});
