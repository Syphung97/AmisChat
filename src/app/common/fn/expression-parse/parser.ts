import { TEOF } from './token';
import { TokenStream } from './token-stream';
import { ParserState } from './parser-state';
import { Expression } from './expression';
import * as functions from './functions';

export function Parser(options) {
  this.options = options || {};
  this.unaryOps = {
    Abs: Math.abs,
    Ceil: Math.ceil,
    Floor: Math.floor,
    Naturallog: Math.log,
    Base10log: Math.log10,

    Sqrt: Math.sqrt,

  };

  this.binaryOps = {
    '+': functions.add,
    '-': functions.sub,
    '*': functions.mul,
    '/': functions.div,
    '%': functions.mod,
    '^': Math.pow,
    '||': functions.concat,
    '==': functions.equal,
    '!=': functions.notEqual,
    '>': functions.greaterThan,
    '<': functions.lessThan,
    '>=': functions.greaterThanEqual,
    '<=': functions.lessThanEqual,
    And: functions.andOperator,
    Or: functions.orOperator,


    'in': functions.inOperator
  };

  this.ternaryOps = {
    '?': functions.condition
  };

  this.functions = {
    Min: Math.min,
    Max: Math.max,
    Tonumber: functions.tonumber,
    //---------------------------------------
    Len: functions.len,
    Find: functions.find,
    Concat: functions.concat,
    Contains: functions.containsOperator,
    Startswith: functions.startswith,
    Endswith: functions.endswith,
    Lower: functions.lower,
    Upper: functions.upper,
    Trim: functions.trim,
    Substring: functions.substring,
    Replace: functions.replace,
    Tostring: functions.tostring,
    //---------------------------------------
    Newdate: functions.newdate,
    Datepart: functions.datepart,
    Timepart: functions.timepart,
    Adddate: functions.adddate,
    Subdate: functions.subdate,
    Now: functions.now,
    Datecomp: functions.datecomp,
    Dayofmonth: functions.dayofmonth,
    Hour: functions.hour,
    Minute: functions.minute,
    Month: functions.month,
    Year: functions.year,
    Weekday: functions.weekday,
    
    //--------------------------------------
    'if': functions.condition,
    'not': functions.not,
  };

  this.consts = {
    E: Math.E,
    PI: Math.PI,
    'true': true,
    'false': false
  };
}

Parser.prototype.parse = function (expr) {
  var instr = [];
  var parserState = new ParserState(
    this,
    new TokenStream(this, expr),
    { allowMemberAccess: this.options.allowMemberAccess }
  );

  parserState.parseExpression(instr);
  parserState.expect(TEOF, 'EOF');

  return new Expression(instr, this);
};

Parser.prototype.evaluate = function (expr, variables) {
  return this.parse(expr).evaluate(variables);
};

// var sharedParser = new Parser(null);

// Parser['parse'] = function (expr) {
//   return sharedParser.parse(expr);
// };

// Parser.evaluate = function (expr, variables) {
//   return sharedParser.parse(expr).evaluate(variables);
// };
