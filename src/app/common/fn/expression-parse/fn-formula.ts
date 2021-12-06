import { Parser } from "./parser";
import { TypeControl } from 'src/app/shared/enum/common/type-control.enum';
import { AmisStringUtils } from '../string-utils';

/**
 * Title: Chuyển chuỗi công thức thành mảng các trường
 * Created by: TVHUNG 06-03-2019
 */
export function convertInputFormulaToParams(sample) {
  // Tách phần biến ra khỏi công thức
  const arr = [],
    params = [];
  if (!sample) {
    return params;
  }
  for (let i = 0; i < sample.length; i++) {
    if (
      i != sample.length - 1 &&
      sample.charAt(i) == "$" &&
      sample.charAt(i + 1) == "{"
    ) {
      arr.push(i);
    }
    if (sample.charAt(i) == "}") {
      params.push(sample.substring(arr.pop() + 2, i));
    }
  }
  return params;
}

export function setNormalizeParams(params, text, fields, sampleData) {
  const returnValue = {
    normalizeParams: [],
    text: text
  };
  params.forEach(element => {
    const field = fields.find(p => p.FieldName === element);
    let data = "";

    let fieldType = null;
    if (field) {
      fieldType = field.TypeControl;
    }

    const key = Object.keys(TypeControl).find(
      k => TypeControl[k] === fieldType
    );
    data = sampleData[key];

    returnValue.normalizeParams.push({
      param: "_" + element.trim(),
      data: data
    });
    returnValue.text = returnValue.text.replaceAll(
      "${" + element + "}",
      "_" + AmisStringUtils.convertVNtoEN(element.replaceAll(/\ /g, "_"))
    );
  });
  return returnValue;
}

export function validateBracket(text, params): boolean {
  let isBracketValid = 0;
  for (let i = 0; i < text.length; i++) {
    if (text.charAt(i) === "(") {
      isBracketValid++;
    } else if (text.charAt(i) === ")") {
      isBracketValid--;
    }
    if (isBracketValid < 0) {
      return false;
    }
  }
  if (isBracketValid > 0) {
    return false;
  }
  return true;
}


/**
 * Thực thi công thức
 * @export
 * @param {any} text 
 * @param {any} normalizeParams 
 * @returns {*} 
 */
export function executeFormula(text, normalizeParams): any {
  try {
    const parser = new Parser(null);
    normalizeParams = normalizeParams.map(x => {
      x.param = AmisStringUtils.convertVNtoEN(x.param.replaceAll(/\ /g, "_"));
      return x;
    });
    const expr = parser.parse(text);
    const func = expr.toJSFunction(
      normalizeParams.map(t => {
        return t.param;
      })
    );
    const example = func.apply(
      this,
      normalizeParams.map(t => {
        return t.data ? t.data : "";
      })
    );
    if (isNaN(example) && typeof example === "number") {
      return "";
    }
    return example;
  } catch (exception) {
    return "";
  }
}
