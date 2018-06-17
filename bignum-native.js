class BigNum {
  constructor(a, options) {

    options = options || {};

    if(a === null || typeof(a) === 'undefined') {
      // Initialize value of 0
      this.i = 0n;
      this.e = 0;
      return;
    }

    var aStr = typeof(a) === 'string' ? a : a.toString();

    var result = BigNum._numberRegex.exec(a.toString());

    if(result) {
      //console.log(result);
      // Construct from string if possible
      //this.i = parseInt(result[1] + result[2] + result[4]);
      if(typeof(result[2]) === 'undefined') result[2] = '';
      if(typeof(result[4]) === 'undefined') result[4] = '';
      this.i = BigInt(result[1] + result[2] + result[4]);
      this.e = result[4] ? -result[4].length : 0;
      this._normalize();
    }
    else {
      // Conversion to string failed, so construct from number
      
      var m = 1n;
      if(a < 0) {
        a = -a;
        m = -1n;
      }
      
      if (a === 0) {
        this.i = 0;
        this.e = 0;
      }
      else {
        // Multiply the number by 10 until it is an integer
        var e = -Math.floor(Math.log10(a));
        if(e > 0) {
          a *= Math.pow(10, e);
        }
        else {
          e = 0;
        }
        while(a != Math.round(a)) {
          e++;
          a *= 10;
        }
        // Divide the number by 10 until the one's digit is non-zero
        while(a % 10 === 0 && a > 0) {
          e--;
          a /= 10;
        }
        a = BigInt(a);
        this.i = a*m;
        this.e = -e;
      }
    }
  }

  
  /**
   * Returns a new BigNum with the opposite sign of a.
   * @param {BigNum} a 
   * @returns {BigNum}
   */
  static minus(a) {
    var negated = new BigNum();
    negated.i = -a.i;
    negated.e = a.e;
    return negated;
  }

  /**
   * Returns a new BigNum that has the opposite sign of this BigNum.
   * @returns {BigNum}
   */
  minus() {
    return BigNum.minus(this);
  }


  /**
   * Returns a new BigNum that is the sum of a and b.
   * @param {BigNum} a 
   * @param {BigNum} b
   * @returns {BigNum} 
   */
  static add(a, b) {
    
    // a+b = a.i * 10^a.e + b.i * 10^b.e

    // a+b = ( a.i * 10^(a.e-b.e) + b.i ) * 10^b.e

    var a_plus_b;

    // Order arguments so that a.e >= b.e
    if(a.e < b.e) {
      var c = a;
      a = b;
      b = c;
    }

    var a_tens = BigNum.multiplyByTens(a.i, a.e - b.e);
    a_plus_b = new BigNum();
    a_plus_b.i = a_tens + b.i;
    a_plus_b.e = b.e;

    a_plus_b._normalize();
    return a_plus_b;

  }

  /**
   * Returns a new BigNum that is the sum of this and b.
   * @param {BigNum} b
   * @returns {BigNum} 
   */
  add(b) {
    return BigNum.add(this, b);
  }

  /**
   * Subtracts b from a.
   * @param {BigNum} a 
   * @param {BigNum} b
   * @returns {BigNum} 
   */
  static subtract(a, b) {
    return BigNum.add(a, BigNum.minus(b));
  }

  /**
   * Returns a new BigNum that is the difference between this and b.
   * @param {BigNum} b 
   */
  subtract(b) {
    return BigNum.subtract(this, b);
  }

  /**
   * Returns a new BigNum that is the product of a and b
   * @param {BigNum} a 
   * @param {BigNum} b
   * @returns {BigNum} 
   */
  static multiply(a, b) {
    // a * b = (a.i * b.i) * 10^(a.e + b.e)

    var a_times_b = new BigNum();
    a_times_b.i = a.i * b.i;
    a_times_b.e = a.e + b.e;

    a_times_b._normalize();
    return a_times_b;
  }

  /**
   * Returns a new BigNum that is the product of this and b
   * @param {BigNum} b 
   */
  multiply(b) {
    return BigNum.multiply(this, b);
  }

  /**
   * Returns a new BigNum that is the quotient of a and b
   * @param {BigNum} a 
   * @param {BigNum} b
   * @returns {BigNum} 
   */
  static divide(a, b) {

    // We need to increase the number of digits of a and b so that a / b will have the desired precision.

    // In order for the integer quotient to have the correct precision, a.e - b.e must be greater than that precision.
    // So we need only to increase a.e.
    // TODO: Revisit the value of increaseA. Is it correct in every circumstance?
    var increaseA = Math.max(BigNum.precision - (a.e + b.e), 0);

    var a_increased = new BigNum();
    a_increased.i = BigNum.multiplyByTens(a.i, increaseA);


    var quotient = new BigNum();

    quotient.i = a_increased.i / b.i;
    quotient.e = a.e - b.e - increaseA;

    // No need to truncate since we already increased the number of digits before dividing
    quotient._normalize();
    return quotient;
  }

  /**
   * Returns a new BigNum that is the quotient of this and b
   * @param {BigNum} b 
   */
  divide(b) {
    return BigNum.divide(this, b);
  }

  /**
   * Returns the square root of this BigNum.
   */
  sqrt() {
  
    BigNum._precision++;

    // Let the guess value be 10^(e/2), where e is this.e
    var x = new BigNum();
    x.i = 1n;
    x.e = Math.floor(this.e / 2);
    var onehalf = new BigNum('0.5');
    
    var xt = x.clone();
    xt._truncate();
    xt._normalize();
    var lastxt;

    var i;
    for(i=0; i<100; i++) {
      lastxt = xt;

      x = this.divide(x).add(x).multiply(onehalf); 
      xt = x.clone();
      xt._truncate();
      xt._normalize();
      if(xt.i === lastxt.i && xt.e === lastxt.e)
        break;
    }
    if(i>=100) {
      console.log("Warning: sqrt exceeded maximum iterations. (Did it enter a cycle?)");
    }
    BigNum._precision--;
    xt._truncate();
    xt._normalize();
    
    return xt;

  }

  /**
   * Returns the square root of x.
   * @param {BigNum} x 
   */
  static sqrt(x) {
    return x.sqrt();
  }

  clone() {
    var a = new BigNum();
    a.i = this.i;
    a.e = this.e;
    return a;
  }


  /**
   * Returns a BigInt that is equal to i times 10^e
   * TODO: Make this better
   * @param {BigInt} i 
   * @param {Number} e 
   * @returns {BigInt}
   */
  static multiplyByTens(i, e) {
    
    // The implementation is faster than 10n ** BigInt(e). But could we make it faster still?
    var ii = i;
    for(var j=0; j<e; j++) {
      ii *= 10n;
    }
    return ii;
  }

  /**
   * Remove zeroes in the least-significant digit of this BigNum
   */
  _normalize() {
    while(this.i % 10n === 0n && this.i !== 0n) {
      this.i /= 10n;
      this.e++;
    }
  }

  /**
   * Truncate this BigNum to the configured precision
   * TODO: Make this better
   * TODO: Rounding
   */
  _truncate() {
  
    var trunc = -this.e - BigNum._precision;
    if(trunc > 0) {
      this.i /= 10n ** BigInt(trunc-1);
      this.e += trunc;

      var nextDigit = this.i % 10n;
      if(nextDigit >= 5) {
        this.i += 10n;
      }

      this.i /= 10n;
    }

    // while(-this.e > BigNum._precision) {
    //   this.i /= 10n;
    //   this.e++;
    // }
  }

  toString() {
    
    var s = this.i.toString();
    var m = '';
    if(s[0] === '-') {
      s = s.substring(1, s.length);
      m = '-';
    }

    if(this.e > 0) {
      return m + s + '0'.repeat(this.e);
    }
    else if(this.e < 0) {
      if(-this.e >= s.length) {
        return m + '0.' + '0'.repeat(-this.e-s.length) + s;
      }
      return m + s.slice(0, s.length+this.e) + '.' + s.slice(s.length+this.e, s.length);
    }
    else {
      return s;
    }
  }
  
  static get precision() { return BigNum._precision; }
  static set precision(value) { BigNum._precision = value; }
}

BigNum._numberRegex = /^(-?)([0-9]+)(\.([0-9]+))?$/;

BigNum._precision = 30;

module.exports = BigNum;