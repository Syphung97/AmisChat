import contains from './contains';

export function add(a, b) {
  return Number(a) + Number(b);
}

export function sub(a, b) {
  return a - b;
}

export function mul(a, b) {
  return a * b;
}

export function div(a, b) {
  return a / b;
}

export function mod(a, b) {
  return a % b;
}

export function concat(a, b) {
  return '' + a + b;
}

export function equal(a, b) {
  return a === b;
}

export function notEqual(a, b) {
  return a !== b;
}

export function greaterThan(a, b) {
  return a > b;
}

export function lessThan(a, b) {
  return a < b;
}

export function greaterThanEqual(a, b) {
  return a >= b;
}

export function lessThanEqual(a, b) {
  return a <= b;
}

export function andOperator(a, b) {
  return Boolean(a && b);
}

export function orOperator(a, b) {
  return Boolean(a || b);
}

export function inOperator(a, b) {
  return contains(b, a);
}


export function neg(a) {
  return -a;
}

export function not(a) {
  return !a;
}

export function random(a) {
  return Math.random() * (a || 1);
}

export function tonumber(a) {
  return Number(a);
}

export function condition(cond, yep, nope) {
  return cond ? yep : nope;
}

//-----------------------String-------------------------------
export function len(s) {
  return String(s).length;
}

export function find(s) {
  return String(s).length;
}

export function containsOperator(s, a) {
  return String(s).indexOf(a) > 0;
}

export function startswith(s) {
  return String(s).length;
}
export function endswith(s, a) {
  return String(s).startsWith(a);
}
export function lower(s) {
  return String(s).toLowerCase();
}
export function upper(s) {
  return String(s).toUpperCase();
}
export function trim(s) {
  return String(s).trim();
}
export function substring(s, startIndex, length) {
  return String(s).substring(startIndex, len(s) - length);
}
export function replace(s, source, destination) {
  // return String(s).replaceAll(source, destination);
}
export function tostring(s) {
  return String(s);
}

//-----------------------Date-------------------------------

export function newdate(year, month, date, hour, minute, second, ms) {
  return new Date(year, month, date, hour, minute, second, ms)
}

export function datepart(s) {
  return s.format('dd/MM/yyyy');
}

export function timepart(s) {
  return s.format('HH:mm:ss');
}

export function adddate(date, number, type) {
  switch (type) {
    case 'year':
      return date.setFullYear(date.getFullYear() + number);
    case 'month':
      return date.setMonth(date.getMonth() + number);
    case 'day':
      return date.setDate(date.getDate() + number);
    case 'hour':
      return date.setHour(date.getHour() + number);
  }
  return date;
}

export function subdate(date, number, type) {
  return adddate(date, -number, type)
}

export function now(s) {
  return new Date();
}

export function datecomp(date1, date2) {
  return Math.floor(date2 - date1) / (1000 * 60);
}
export function dayofmonth(s) {
  return s.getDate()
}

export function hour(s) {
  return s.getHour();
}

export function minute(s) {
  return s.getMinutes();
}

export function month(s) {
  return s.getMonth() + 1;
}

export function year(s) {
  return s.getFullYear();
}

export function weekday(s) {
  return s.getMonth() + 1;
}
