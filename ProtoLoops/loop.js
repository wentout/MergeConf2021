
const a = { a: 1 };

const b = { b: 2 };

const c = { c: 3 }

const d = { d: 4 }

const e = { e: 5 }

Object.setPrototypeOf( a, b );
Object.setPrototypeOf( b, c );
Object.setPrototypeOf( c, d );
Object.setPrototypeOf( d, e );

const ring = ( ...args ) => {

	const setArr = args.reduce( ( arr, arg ) => {
		arr.push( ...Reflect.ownKeys( arg ) );
		return arr;
	}, [] );

	const ringSet = new Set( ...setArr );

	const p = new Proxy( a, {
		get ( target, proto, receiver ) {
			return Reflect.get( receiver, proto );
		},
		ownKeys ( target ) {
			// return [ ...ringSet ];
			return [ ...new Set( [
				...Reflect.ownKeys( a ),
				...Reflect.ownKeys( b ),
				...Reflect.ownKeys( c ),
				...Reflect.ownKeys( d ),
				...Reflect.ownKeys( e ),
			] ) ];
		}
	} );
	Object.setPrototypeOf( args[ 0 ], p );
};


debugger;

const loop = [ a, b, c, d, e ];
ring( ...loop );

console.log( c.b )

// const it = a;
// loop.forEach( it => {
	// console.log( `--${ Object.getOwnPropertyNames( it )[ 0 ] }--` );
	// for ( var i in it ) {
	// 	console.log( '>>', i, a[ i ] );
	// }
// } );