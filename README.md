# BigNum-Native #

BigNum-Native is an implementation of arbitrary-precision decimal arithmetic that is based on JavaScript's new native [BigInt type](https://github.com/tc39/proposal-bigint). Chrome's implementation of arbitary-precision integer arithmetic [outperforms](https://developers.google.com/web/updates/2018/05/bigint) other big integer libraries, which hopefully makes this library *very fast*.

BigNum-Native uses the new `BigInt` type from ECMAScript 2018 (ES9), so it won't work everywhere quite yet. It is currently working in Chrome 67 and Node.js 10. Other browsers should hopefully be following soon....

## Installation ##

```
npm install bignum-native
```

## Usage ##

```js
var BigNum = require('bignum-native');

console.log(new BigNum('1').divide(new BigNum('3')).toString());

// 0.333333333333333333333333333333
```

## API ##

**BigNum(value, [options])** &mdash; Construct a `BigNum`
- `value` &mdash; A `string` or `number` to be converted to a `BigNum`. If omitted, `0` will be used.
- `options` &mdash; Not used at this time.

```js
let a = new BigNum('3.14')
```

**minus(x)** &mdash; Returns a new BigNum with the opposite sign as `x`.

```js
let a = new BigNum('5')
a.minus()  // -5

// or, equivalently:
BigNum.minus(a)  // -5
```

**add(x, y)** &mdash; Returns a new BigNum that is the sum of `x` and `y`.

```js
let a = new BigNum('50000000000')
let b = new BigNum('0.000000005')
a.add(b)  // 50000000000.000000005

// or, equivalently:
BigNum.add(a, b)  // 50000000000.000000005
```

**subtract(x, y)** &mdash; Returns a new BigNum obtained by subtracting `y` from `x`.

```js
let a = new BigNum('1')
let b = new BigNum('0.0000000000000000001')
a.subtract(b)  // 0.9999999999999999999

// or, equivalently:
BigNum.subtract(a, b)  // 0.9999999999999999999
```

**multiply(x, y)** &mdash; Returns a new BigNum obtained by multiplying `x` and `y`.

```js
let a = new BigNum('0.0000000000000000000025')
let b = new BigNum('400000000000000000000')
a.multiply(b)  // 1

// or, equivalently:
BigNum.multiply(a, b)  // 1
```

**divide(x, y)** &mdash; Returns a new BigNum obtained by dividing `x` and `y`. The number of decimals in the returned result is limited to `BigNum.precision` (default: 30).

```js
let a = new BigNum('1')
let b = new BigNum('3')
a.divide(b)  // 0.333333333333333333333333333333

// or, equivalently:
BigNum.divide(a, b)  // 0.333333333333333333333333333333
```

**BigNum.precision** &mdash; A configurable parameter which sets the number of digits after the decimal point to keep track of.

```js
let a = new BigNum('1')
let b = new BigNum('3')
BigNum.precision = 60;
a.divide(b) // 0.142857142857142857142857142857142857142857142857142857142857
```

## Testing ##

Tests are located in the `test` directory and use the `mocha` framework.

```
npm test
```

## Benchmarks ##

A simple performance benchmark suite is located in the `benchmark` directory.

```
node benchmark/index.js
```

Below is some sample output from a benchmark comparing BigNum-Native with BigNumber.js. BigNum-Native is faster in some places and slower in others. BigNum-Native currently lacks input type checking, error handling, and rounding, which may be the cause of the better speed. Or it could be due to V8's internal implementation of `BigInt` being highly optimized, which is what this library is intended to take advantage of. Or it could be a result of the particular benchmark calculations that were chosen; calculations with more or fewer digits, for example, might change the results. It will be interesting to see how these numbers change as the `BigInt` implementation is optimized in the future.

```
BigNum-Native parse x 1,909,749 ops/sec ±1.27% (88 runs sampled)
BigNumber.js  parse x 1,093,438 ops/sec ±0.82% (83 runs sampled)
BigNum-Native add x 6,070,220 ops/sec ±0.95% (79 runs sampled)
BigNumber.js  add x 4,145,152 ops/sec ±1.07% (82 runs sampled)
BigNum-Native subtract x 4,554,697 ops/sec ±1.27% (82 runs sampled)
BigNumber.js  subtract x 5,145,272 ops/sec ±0.98% (82 runs sampled)
BigNum-Native minus x 34,056,309 ops/sec ±1.45% (84 runs sampled)
BigNumber.js  minus x 11,268,415 ops/sec ±2.01% (82 runs sampled)
BigNum-Native multiply x 3,421,857 ops/sec ±1.49% (84 runs sampled)
BigNumber.js  multiply x 1,267,975 ops/sec ±1.09% (81 runs sampled)
BigNum-Native divide x 204,747 ops/sec ±1.04% (83 runs sampled)
BigNumber.js  divide x 262,573 ops/sec ±1.04% (81 runs sampled)
```

## Contributing ##

This library is far from perfect, or even complete, so contributions are very welcome! Please submit an issue to report bugs or propose new features, or submit a pull request.

## License ##

BigNum-Native is licensed under the MIT license.

Copyright (c) 2018 Eric Mansfield

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
