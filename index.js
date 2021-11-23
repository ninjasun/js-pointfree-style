// ///https://medium.com/dailyjs/functional-js-7-point-free-style-b21a1416ac6a
// We can use ramda to avoid writing all helpers ourselves
const R = require('ramda')

function log (message) {
  console.log(`${message}`)
}
/*
Even though using this style is not essential to writing code in a functional way, understanding jargon like this is useful in discussions and when trying to understand someone else’s code.
Point-free style is related to the way we invoke functions and can play nicely with curried functions. It helps us write code that is more concise and readable. As with a lot of techniques, it can of course be harmful when taken to the extreme.
**/

const getUserDisplayName = user => `${user.firstName} ${user.lastName}`

const users = [
  { firstName: 'Jane', lastName: 'Doe' },
  { firstName: 'John', lastName: 'Doe' }
]

users.map(user => getUserDisplayName(user)) // ["Jane Doe", "John Doe"]

/**
 * In this example, the user variable in line 8 is a point. We create an inline function, name its parameter user, and use it when invoking getUserDisplayName just a few characters later. We name and reference user explicitly, so user is a point.
 */

// we can go point free just by removing user from line 8
const getUserDisplayNamePointFree = (user, index) =>
  log(`${index} ${user.firstName} ${user.lastName}`)

users.map(getUserDisplayNamePointFree) // ["Jane Doe", "John Doe"]

const arr1 = ['1', '12', '123']
//It is not always that easy — sometimes to go point-free, we need to transform the inner function so that its signature matches the outer function. This sometimes requires us to use more complex techniques. Among those are a couple of useful higher-order functions that we can find in most FP libraries:

//getUserDisplayNamePointFree (the inner function) gets all the params from map
// what if the inner function implicitamente take more than one

arr1.map(num => parseInt(num)) // [1, 12, 123]

// This works nicely, however making it point-free is not as simple as:

arr1.map(parseInt) // [1, NaN, 1]

// This breaks because `map` passes more than just one argument to `parseInt` – it passes `currentValue`, `index`, and `array`
// `parseInt` then accepts the second argument as `radix`
// More information:
// * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
// * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt

// To fix this, we need to make sure that `parseInt` receives only the first argument, and ignores the rest:

const unary = fn => (...args) =>
  fn(args[0])[('1', '12', '123')].map(unary(parseInt)) // [1, 12, 123]

// useful HOF from functional programming Rambda
// PROP
// PIPE
// COMPOSE
// URNARY
// TRACE

// Example from https://github.com/loop-recur/FPJS-Class/blob/master/part1_exercises/exercises/compose/compose_exercises.js

// We can use ramda to avoid writing all helpers ourselves

const fastestCar = cars => {
  const sorted = R.sortBy(car => car.horsepower, cars)
  const fastest = R.last(sorted)
  return fastest.name
}

// Let's make this point-free using `compose` and `prop` that we discussed earlier:
const fastestCarPF = R.pipe(
  R.sortBy(R.prop('horsepower')),
  R.last,
  R.prop('name')
)

const fastestCar2 = cars => {
  const sorted = R.sortBy(car => car.horsepower, cars)
  console.log(sorted)
  const fastest = R.last(sorted)
  return fastest.name
}

const fastestCarPF2 = R.pipe(
  R.sortBy(R.prop('horsepower')),
  R.last,
  R.prop('name')
)

const fastestCarPF3 = R.pipe(
  R.sortBy(R.prop('horsepower')),
  R.trace,
  R.last,
  R.prop('name')
)

//point free style
// pro: it reads like english, cons: may add complexity to the code readability
// pro: no variable names, cons: add mental effort to understand it

/** Coming up with names for variables and functions is sometimes hard. With point-free style, you can save some of that effort.
Of course — this is only partly serious. Naming variables explicitly can sometimes help you think about abstractions and thus improve code design.
On the other hand, the mental effort is sometimes definitely there. Given that code is read many more times that it is written, not introducing unnecessary noise in the form of variables may actually be a good thing. 
**/

/** summary
 * Point-free style is a code-style choice and it’s not essential to make your code more functional. Understanding this concept, however, makes reading and discussing others’ code easier.
As with many things in life (and especially in programming), overusing it might introduce more problems than it solves, and you need to trust your intuition (and experience) on where the balance is.
Keep it reasonable and think twice if removing an explicit variable reference makes the code easier or harder to read. Use point-free style in moderation and make your code easier to read and follow.
Next up, we will focus on the practical side of things. We’ll discuss libraries that we can incorporate in our code to make writing functional code easier and more idiomatic. Stay tuned!
 */

//from https://www.educative.io/courses/functional-programming-patterns-with-ramdajs/3jEwl04BL7Q

//    point free: oyu dony see the data

//exercise: transform it into point free style
const countBobos = sentence => /bobo/gi.test(sentence)

const countBoobsFree = R.test(/bobo/gi)

// ex 2 (if/else where)
const shouldCode = person =>
  person.lovesTech && person.worksHard
    ? `${person.name} may enjoy a tech career!`
    : `${person.name} wouldn't enjoy a tech career.`

const shouldCodeFree = R.ifElse(
  R.where({ lovesTech: R.equals(true), worksHard: R.equals(true) }),
  `${person.name} may enjoy a tech career!`,
  `${person.name} wouldn't enjoy a tech career.`
)
/**
*  if else
* const incCount = R.ifElse(
*  R.has('count'),
*  R.over(R.lensProp('count'), R.inc),
*  R.assoc('count', 1)
);
incCount({});           //=> { count: 1 }
incCount({ count: 1 }); //=> { count: 2 }
*/
/**
 * // pred :: Object -> Boolean
const pred = R.where({
  a: R.equals('foo'),
  b: R.complement(R.equals('bar')),
  x: R.gt(R.__, 10),
  y: R.lt(R.__, 20)
});

pred({a: 'foo', b: 'xxx', x: 11, y: 19}); //=> true
pred({a: 'xxx', b: 'xxx', x: 11, y: 19}); //=> false
pred({a: 'foo', b: 'bar', x: 11, y: 19}); //=> false
pred({a: 'foo', b: 'xxx', x: 10, y: 19}); //=> false
pred({a: 'foo', b: 'xxx', x: 11, y: 20}); //=> false
 */

const keepYoungAdult = x => x >= 18 && x <= 25

const keepYoungAdults = R.filter(R.propSatisfies(keepYoungAdult, 'age'))

//*** ex 4 */
/**
 * import {filter, propSatisfies} from 'ramda';

const keepYoungAdult = (x) => x >= 18 && x <= 25

const keepYoungAdults = filter(propSatisfies(keepYoungAdult, 'age'))
 */
// ex 5
/**
 * Create a function called defaultTo. It takes two parameters:

defaultVal: A default value
val: The value to return
If val is null or undefined, return defaultVal.
Else, return val.

Curry it to allow preloading arguments.

// your code here
import { curry} from 'ramda'

const defaultToo = (defaultVal, val) => {
        if(!val){
            return defaultVal
        }
        return val  
}
const defaultTo = curry(defaultToo)
 */

/**
  * import { add, pipe, pluck, sum } from 'ramda';
import cart from './cart';

const toUSD = (amount) => amount.toLocaleString('en-US', {
  style: 'currency',
  currency: 'USD',
});

const getTotalPrice = pipe(
  pluck('price'),
  sum,
  toUSD
);

const result = getTotalPrice(cart);

console.log({ result });

  */
