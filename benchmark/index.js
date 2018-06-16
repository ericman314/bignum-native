var Benchmark = require('benchmark');
var BigNum = require('../bignum-native');
var BigNumber = require('bignumber.js');

BigNum.precision = 50;

BigNumber.config({ DECIMAL_PLACES: 50, ROUNDING_MODE: 4 })
BigNumber.config({ EXPONENTIAL_AT: 1e+9 })

var suite = new Benchmark.Suite;

var num1 = '8965168485622506189945604.1235068121348084163185216';
var num2 = '2480986213549488579706531.6546845013548451265890628';


var bn1 = new BigNum(num1);
var bn2 = new BigNum(num2);

var parse = () => { return new BigNum(num1); };
var add = () => { return bn1.add(bn2); };
var subtract = () => { return bn1.subtract(bn2); };
var minus = () => { return bn1.minus(); };
var multiply = () => { return bn1.multiply(bn2); };
var divide = () => { return bn1.divide(bn2); };


/** BigNumber.js */

var B1 = new BigNumber(num1);
var B2 = new BigNumber(num2);

var Bparse = () => {    return new BigNumber(num1); };
var Bsubtract = () => { return B1.minus    (B2); };
var Badd = () => {      return B1.plus     (B2); };
var Bminus = () => {    return B1.negated  (); };
var Bmultiply = () => { return B1.times    (B2); };
var Bdivide = () => {   return B1.dividedBy(B2); };

// add tests

suite.add('BigNum-Native parse',      parse)
suite.add('BigNumber.js  parse',      Bparse)
suite.add('BigNum-Native add',        add)
suite.add('BigNumber.js  add',        Badd)
suite.add('BigNum-Native subtract',   subtract)
suite.add('BigNumber.js  subtract',   Bsubtract)
suite.add('BigNum-Native minus',      minus)
suite.add('BigNumber.js  minus',      Bminus)
suite.add('BigNum-Native multiply',   multiply)
suite.add('BigNumber.js  multiply',   Bmultiply)
suite.add('BigNum-Native divide',     divide)
suite.add('BigNumber.js  divide',     Bdivide)



// add listeners
suite.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {

})
// run async
.run({ 'async': true });


console.log(multiply().toString());
console.log(Bmultiply().toString());

console.log(divide().toString());
console.log(Bdivide().toString());

console.log(add().toString());
console.log(Badd().toString());

console.log(subtract().toString());
console.log(Bsubtract().toString());