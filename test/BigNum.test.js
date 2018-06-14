var assert = require('assert')
var BigNum = require('../BigNum')
var util = require('util')


describe('BigNum', () => {

  describe('constructor', () => {

    it('should return 0 if called with no arguments', () => {
      assert.deepEqual(new BigNum(), { i: 0n, e: 0 } );
    })

    it('should construct a BigNum from a string', () => {
      assert.deepEqual(new BigNum('5'), { i: 5n, e: 0 })
      assert.deepEqual(new BigNum('10'), { i: 1n, e: 1 })
      assert.deepEqual(new BigNum('5000'), { i: 5n, e: 3 })
      assert.deepEqual(new BigNum('500000000000000000000'), { i: 5n, e: 20 })

      assert.deepEqual(new BigNum('0.00000000000000000005'), { i: 5n, e: -20 })

      assert.deepEqual(new BigNum('5000000000.0000000005'), { i: 50000000000000000005n, e: -10 })

      assert.deepEqual(new BigNum('-5'), { i: -5n, e: 0 })
      assert.deepEqual(new BigNum('-5000'), { i: -5n, e: 3 })
      assert.deepEqual(new BigNum('-0.005'), { i: -5n, e: -3 })
      
      assert.deepEqual(new BigNum('.005'), { i: 5n, e: -3 })
      assert.deepEqual(new BigNum('005'), { i: 5n, e: 0 })
      
    })

    it('should construct a BigNum from a number', () => {

      assert.deepEqual(new BigNum(5), { i: 5n, e: 0 })
      assert.deepEqual(new BigNum(5000), { i: 5n, e: 3 })

      assert.deepEqual(new BigNum(-5), { i: -5n, e: 0 })
      assert.deepEqual(new BigNum(-5000), { i: -5n, e: 3 })
      assert.deepEqual(new BigNum(-0.005), { i: -5n, e: -3 })
      assert.deepEqual(new BigNum(0.1), { i: 1n, e: -1 })
      assert.deepEqual(new BigNum(1.23e-35), { i: 123n, e: -37 })

    });

    it.skip('should handle numbers larger than MAX_SAFE_INTEGER', () => {
      assert.deepEqual(new BigNum(1.23e+25), { i: 123, e: 27 } )
    })

  })

  describe('minus', () => {
    it('should return a new BigNum with the opposite sign', () => {
      assert.deepEqual((new BigNum(5)).minus(), { i: -5n, e: 0 })
      assert.deepEqual((new BigNum(-3.14)).minus(), { i: 314n, e: -2 })

      assert.deepEqual(BigNum.minus(new BigNum(0.00999)), { i: -999, e: -5 })

    })
  })

  describe('add', () => {
    it('should add two BigNums', () => {
      assert.deepEqual(BigNum.add(new BigNum('1000000000000'), 
                                              new BigNum('0.000000000001')),
                                  new BigNum('1000000000000.000000000001'));

      assert.deepEqual(BigNum.add(new BigNum('1000000000000'), 
                                             new BigNum('-0.000000000001')),
                                   new BigNum('999999999999.999999999999'));

      assert.deepEqual(BigNum.add(new BigNum('1234567890123456789'), 
                                 new BigNum('98765432109876543210')),
                                 new BigNum('99999999999999999999'));
      
      assert.deepEqual(BigNum.add(new BigNum('0.1'), new BigNum('0.2')), new BigNum('0.3'));
      assert.deepEqual(BigNum.add(new BigNum('-0.1'), new BigNum('-0.2')), new BigNum('-0.3'));
      assert.deepEqual(BigNum.add(new BigNum('0.1'), new BigNum('-0.2')), new BigNum('-0.1'));
      assert.deepEqual(BigNum.add(new BigNum('-0.1'), new BigNum('0.2')), new BigNum('0.1'));
      
      assert.deepEqual(BigNum.add(new BigNum('0.333333333333333333'), 
                                  new BigNum('0.666666666666666667')),
                                  new BigNum('1'));
      
    })
  })

  describe('subtract', () => {
    it('should subtract two BigNums', () => {
      assert.deepEqual(BigNum.subtract(new BigNum('1000000000000'), 
                                                   new BigNum('0.000000000001')),
                                        new BigNum('999999999999.999999999999'));

    })
  })

  describe('multiply', () => {
    it('should multiply two BigNums', () => {
      assert.deepEqual(BigNum.multiply(new BigNum('5'), new BigNum('2')), new BigNum('10'));

      assert.deepEqual(BigNum.multiply(new BigNum('5000000000000000000'), new BigNum('0.000000000000000002')), new BigNum('10'));

      assert.deepEqual(BigNum.multiply(new BigNum('-5'), new BigNum('2')), new BigNum('-10'));
      assert.deepEqual(BigNum.multiply(new BigNum('-5'), new BigNum('-2')), new BigNum('10'));
      assert.deepEqual(BigNum.multiply(new BigNum('5'), new BigNum('-2')), new BigNum('-10'));

    })
    
    it('should truncate the number of decimals in the result', () => {
      
      BigNum.precision = 30;

      var a = new BigNum('0.3333333333333333333333333333333333');
      assert.deepEqual(a.multiply(a), new BigNum('0.111111111111111111111111111111'))
      
      var a = new BigNum('33.333333333333333333333333333333333');
      assert.deepEqual(a.multiply(a), new BigNum('1111.111111111111111111111111111111'))
      

      var a = new BigNum('1.41421356237309504880168872420969807856967187537694807318');
      assert.deepEqual(a.multiply(a), new BigNum('2'))
      
    })

  })

  describe('divide', () => {
    it('should divide two BigNums', () => {
      assert.deepEqual(BigNum.divide(new BigNum('20'), new BigNum('4')), new BigNum('5'))
      assert.deepEqual(BigNum.divide(new BigNum('20'), new BigNum('-4')), new BigNum('-5'))
      assert.deepEqual(BigNum.divide(new BigNum('-20'), new BigNum('4')), new BigNum('-5'))
      assert.deepEqual(BigNum.divide(new BigNum('-20'), new BigNum('-4')), new BigNum('5'))

      BigNum.precision = 30;
      assert.deepEqual(BigNum.divide(new BigNum('1'), new BigNum('3')), new BigNum('0.333333333333333333333333333333'))
      assert.deepEqual(BigNum.divide(new BigNum('3'), new BigNum('4')), new BigNum('0.75'))
      assert.deepEqual(BigNum.divide(new BigNum('1'), new BigNum('5')), new BigNum('0.2'))
      assert.deepEqual(BigNum.divide(new BigNum('1'), new BigNum('6')), new BigNum('0.166666666666666666666666666666'))
      assert.deepEqual(BigNum.divide(new BigNum('1'), new BigNum('7')), new BigNum('0.142857142857142857142857142857'))

    })
  })

  describe('toString', () => {
    it('should return the string representation of a BigNum', () => {
      assert.equal(new BigNum('3.14159'), '3.14159');
      assert.equal(new BigNum('10000000000000000000.00000000000000001'), '10000000000000000000.00000000000000001');
      assert.equal(new BigNum('-4000'), '-4000');
    })
  })
})