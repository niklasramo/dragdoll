var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// node_modules/chai/chai.js
var __defProp2 = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __name = (target, value) => __defProp2(target, "name", { value, configurable: true });
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp2(target, name, { get: all[name], enumerable: true });
};
var require_util = __commonJS({
  "(disabled):util"() {
  }
});
var utils_exports = {};
__export(utils_exports, {
  addChainableMethod: () => addChainableMethod,
  addLengthGuard: () => addLengthGuard,
  addMethod: () => addMethod,
  addProperty: () => addProperty,
  checkError: () => check_error_exports,
  compareByInspect: () => compareByInspect,
  eql: () => deep_eql_default,
  expectTypes: () => expectTypes,
  flag: () => flag,
  getActual: () => getActual,
  getMessage: () => getMessage2,
  getName: () => getName,
  getOperator: () => getOperator,
  getOwnEnumerableProperties: () => getOwnEnumerableProperties,
  getOwnEnumerablePropertySymbols: () => getOwnEnumerablePropertySymbols,
  getPathInfo: () => getPathInfo,
  hasProperty: () => hasProperty,
  inspect: () => inspect2,
  isNaN: () => isNaN2,
  isNumeric: () => isNumeric,
  isProxyEnabled: () => isProxyEnabled,
  isRegExp: () => isRegExp2,
  objDisplay: () => objDisplay,
  overwriteChainableMethod: () => overwriteChainableMethod,
  overwriteMethod: () => overwriteMethod,
  overwriteProperty: () => overwriteProperty,
  proxify: () => proxify,
  test: () => test,
  transferFlags: () => transferFlags,
  type: () => type
});
var check_error_exports = {};
__export(check_error_exports, {
  compatibleConstructor: () => compatibleConstructor,
  compatibleInstance: () => compatibleInstance,
  compatibleMessage: () => compatibleMessage,
  getConstructorName: () => getConstructorName,
  getMessage: () => getMessage
});
function isErrorInstance(obj) {
  return obj instanceof Error || Object.prototype.toString.call(obj) === "[object Error]";
}
__name(isErrorInstance, "isErrorInstance");
function isRegExp(obj) {
  return Object.prototype.toString.call(obj) === "[object RegExp]";
}
__name(isRegExp, "isRegExp");
function compatibleInstance(thrown, errorLike) {
  return isErrorInstance(errorLike) && thrown === errorLike;
}
__name(compatibleInstance, "compatibleInstance");
function compatibleConstructor(thrown, errorLike) {
  if (isErrorInstance(errorLike)) {
    return thrown.constructor === errorLike.constructor || thrown instanceof errorLike.constructor;
  } else if ((typeof errorLike === "object" || typeof errorLike === "function") && errorLike.prototype) {
    return thrown.constructor === errorLike || thrown instanceof errorLike;
  }
  return false;
}
__name(compatibleConstructor, "compatibleConstructor");
function compatibleMessage(thrown, errMatcher) {
  const comparisonString = typeof thrown === "string" ? thrown : thrown.message;
  if (isRegExp(errMatcher)) {
    return errMatcher.test(comparisonString);
  } else if (typeof errMatcher === "string") {
    return comparisonString.indexOf(errMatcher) !== -1;
  }
  return false;
}
__name(compatibleMessage, "compatibleMessage");
function getConstructorName(errorLike) {
  let constructorName = errorLike;
  if (isErrorInstance(errorLike)) {
    constructorName = errorLike.constructor.name;
  } else if (typeof errorLike === "function") {
    constructorName = errorLike.name;
    if (constructorName === "") {
      const newConstructorName = new errorLike().name;
      constructorName = newConstructorName || constructorName;
    }
  }
  return constructorName;
}
__name(getConstructorName, "getConstructorName");
function getMessage(errorLike) {
  let msg = "";
  if (errorLike && errorLike.message) {
    msg = errorLike.message;
  } else if (typeof errorLike === "string") {
    msg = errorLike;
  }
  return msg;
}
__name(getMessage, "getMessage");
function flag(obj, key, value) {
  let flags = obj.__flags || (obj.__flags = /* @__PURE__ */ Object.create(null));
  if (arguments.length === 3) {
    flags[key] = value;
  } else {
    return flags[key];
  }
}
__name(flag, "flag");
function test(obj, args) {
  let negate = flag(obj, "negate"), expr = args[0];
  return negate ? !expr : expr;
}
__name(test, "test");
function type(obj) {
  if (typeof obj === "undefined") {
    return "undefined";
  }
  if (obj === null) {
    return "null";
  }
  const stringTag = obj[Symbol.toStringTag];
  if (typeof stringTag === "string") {
    return stringTag;
  }
  const type3 = Object.prototype.toString.call(obj).slice(8, -1);
  return type3;
}
__name(type, "type");
var canElideFrames = "captureStackTrace" in Error;
var _a;
var AssertionError = (_a = class extends Error {
  constructor(message = "Unspecified AssertionError", props, ssf) {
    super(message);
    __publicField(this, "message");
    this.message = message;
    if (canElideFrames) {
      Error.captureStackTrace(this, ssf || _a);
    }
    for (const key in props) {
      if (!(key in this)) {
        this[key] = props[key];
      }
    }
  }
  get name() {
    return "AssertionError";
  }
  get ok() {
    return false;
  }
  toJSON(stack) {
    return {
      ...this,
      name: this.name,
      message: this.message,
      ok: false,
      stack: stack !== false ? this.stack : void 0
    };
  }
}, __name(_a, "AssertionError"), _a);
function expectTypes(obj, types) {
  let flagMsg = flag(obj, "message");
  let ssfi = flag(obj, "ssfi");
  flagMsg = flagMsg ? flagMsg + ": " : "";
  obj = flag(obj, "object");
  types = types.map(function(t) {
    return t.toLowerCase();
  });
  types.sort();
  let str = types.map(function(t, index) {
    let art = ~["a", "e", "i", "o", "u"].indexOf(t.charAt(0)) ? "an" : "a";
    let or = types.length > 1 && index === types.length - 1 ? "or " : "";
    return or + art + " " + t;
  }).join(", ");
  let objType = type(obj).toLowerCase();
  if (!types.some(function(expected) {
    return objType === expected;
  })) {
    throw new AssertionError(
      flagMsg + "object tested must be " + str + ", but " + objType + " given",
      void 0,
      ssfi
    );
  }
}
__name(expectTypes, "expectTypes");
function getActual(obj, args) {
  return args.length > 4 ? args[4] : obj._obj;
}
__name(getActual, "getActual");
var ansiColors = {
  bold: ["1", "22"],
  dim: ["2", "22"],
  italic: ["3", "23"],
  underline: ["4", "24"],
  // 5 & 6 are blinking
  inverse: ["7", "27"],
  hidden: ["8", "28"],
  strike: ["9", "29"],
  // 10-20 are fonts
  // 21-29 are resets for 1-9
  black: ["30", "39"],
  red: ["31", "39"],
  green: ["32", "39"],
  yellow: ["33", "39"],
  blue: ["34", "39"],
  magenta: ["35", "39"],
  cyan: ["36", "39"],
  white: ["37", "39"],
  brightblack: ["30;1", "39"],
  brightred: ["31;1", "39"],
  brightgreen: ["32;1", "39"],
  brightyellow: ["33;1", "39"],
  brightblue: ["34;1", "39"],
  brightmagenta: ["35;1", "39"],
  brightcyan: ["36;1", "39"],
  brightwhite: ["37;1", "39"],
  grey: ["90", "39"]
};
var styles = {
  special: "cyan",
  number: "yellow",
  bigint: "yellow",
  boolean: "yellow",
  undefined: "grey",
  null: "bold",
  string: "green",
  symbol: "green",
  date: "magenta",
  regexp: "red"
};
var truncator = "\u2026";
function colorise(value, styleType) {
  const color = ansiColors[styles[styleType]] || ansiColors[styleType] || "";
  if (!color) {
    return String(value);
  }
  return `\x1B[${color[0]}m${String(value)}\x1B[${color[1]}m`;
}
__name(colorise, "colorise");
function normaliseOptions({
  showHidden = false,
  depth = 2,
  colors = false,
  customInspect = true,
  showProxy = false,
  maxArrayLength = Infinity,
  breakLength = Infinity,
  seen = [],
  // eslint-disable-next-line no-shadow
  truncate: truncate2 = Infinity,
  stylize = String
} = {}, inspect3) {
  const options4 = {
    showHidden: Boolean(showHidden),
    depth: Number(depth),
    colors: Boolean(colors),
    customInspect: Boolean(customInspect),
    showProxy: Boolean(showProxy),
    maxArrayLength: Number(maxArrayLength),
    breakLength: Number(breakLength),
    truncate: Number(truncate2),
    seen,
    inspect: inspect3,
    stylize
  };
  if (options4.colors) {
    options4.stylize = colorise;
  }
  return options4;
}
__name(normaliseOptions, "normaliseOptions");
function isHighSurrogate(char) {
  return char >= "\uD800" && char <= "\uDBFF";
}
__name(isHighSurrogate, "isHighSurrogate");
function truncate(string, length, tail = truncator) {
  string = String(string);
  const tailLength = tail.length;
  const stringLength = string.length;
  if (tailLength > length && stringLength > tailLength) {
    return tail;
  }
  if (stringLength > length && stringLength > tailLength) {
    let end = length - tailLength;
    if (end > 0 && isHighSurrogate(string[end - 1])) {
      end = end - 1;
    }
    return `${string.slice(0, end)}${tail}`;
  }
  return string;
}
__name(truncate, "truncate");
function inspectList(list, options4, inspectItem, separator = ", ") {
  inspectItem = inspectItem || options4.inspect;
  const size = list.length;
  if (size === 0)
    return "";
  const originalLength = options4.truncate;
  let output = "";
  let peek = "";
  let truncated = "";
  for (let i = 0; i < size; i += 1) {
    const last = i + 1 === list.length;
    const secondToLast = i + 2 === list.length;
    truncated = `${truncator}(${list.length - i})`;
    const value = list[i];
    options4.truncate = originalLength - output.length - (last ? 0 : separator.length);
    const string = peek || inspectItem(value, options4) + (last ? "" : separator);
    const nextLength = output.length + string.length;
    const truncatedLength = nextLength + truncated.length;
    if (last && nextLength > originalLength && output.length + truncated.length <= originalLength) {
      break;
    }
    if (!last && !secondToLast && truncatedLength > originalLength) {
      break;
    }
    peek = last ? "" : inspectItem(list[i + 1], options4) + (secondToLast ? "" : separator);
    if (!last && secondToLast && truncatedLength > originalLength && nextLength + peek.length > originalLength) {
      break;
    }
    output += string;
    if (!last && !secondToLast && nextLength + peek.length >= originalLength) {
      truncated = `${truncator}(${list.length - i - 1})`;
      break;
    }
    truncated = "";
  }
  return `${output}${truncated}`;
}
__name(inspectList, "inspectList");
function quoteComplexKey(key) {
  if (key.match(/^[a-zA-Z_][a-zA-Z_0-9]*$/)) {
    return key;
  }
  return JSON.stringify(key).replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'");
}
__name(quoteComplexKey, "quoteComplexKey");
function inspectProperty([key, value], options4) {
  options4.truncate -= 2;
  if (typeof key === "string") {
    key = quoteComplexKey(key);
  } else if (typeof key !== "number") {
    key = `[${options4.inspect(key, options4)}]`;
  }
  options4.truncate -= key.length;
  value = options4.inspect(value, options4);
  return `${key}: ${value}`;
}
__name(inspectProperty, "inspectProperty");
function inspectArray(array, options4) {
  const nonIndexProperties = Object.keys(array).slice(array.length);
  if (!array.length && !nonIndexProperties.length)
    return "[]";
  options4.truncate -= 4;
  const listContents = inspectList(array, options4);
  options4.truncate -= listContents.length;
  let propertyContents = "";
  if (nonIndexProperties.length) {
    propertyContents = inspectList(nonIndexProperties.map((key) => [key, array[key]]), options4, inspectProperty);
  }
  return `[ ${listContents}${propertyContents ? `, ${propertyContents}` : ""} ]`;
}
__name(inspectArray, "inspectArray");
var getArrayName = /* @__PURE__ */ __name((array) => {
  if (typeof Buffer === "function" && array instanceof Buffer) {
    return "Buffer";
  }
  if (array[Symbol.toStringTag]) {
    return array[Symbol.toStringTag];
  }
  return array.constructor.name;
}, "getArrayName");
function inspectTypedArray(array, options4) {
  const name = getArrayName(array);
  options4.truncate -= name.length + 4;
  const nonIndexProperties = Object.keys(array).slice(array.length);
  if (!array.length && !nonIndexProperties.length)
    return `${name}[]`;
  let output = "";
  for (let i = 0; i < array.length; i++) {
    const string = `${options4.stylize(truncate(array[i], options4.truncate), "number")}${i === array.length - 1 ? "" : ", "}`;
    options4.truncate -= string.length;
    if (array[i] !== array.length && options4.truncate <= 3) {
      output += `${truncator}(${array.length - array[i] + 1})`;
      break;
    }
    output += string;
  }
  let propertyContents = "";
  if (nonIndexProperties.length) {
    propertyContents = inspectList(nonIndexProperties.map((key) => [key, array[key]]), options4, inspectProperty);
  }
  return `${name}[ ${output}${propertyContents ? `, ${propertyContents}` : ""} ]`;
}
__name(inspectTypedArray, "inspectTypedArray");
function inspectDate(dateObject, options4) {
  const stringRepresentation = dateObject.toJSON();
  if (stringRepresentation === null) {
    return "Invalid Date";
  }
  const split = stringRepresentation.split("T");
  const date = split[0];
  return options4.stylize(`${date}T${truncate(split[1], options4.truncate - date.length - 1)}`, "date");
}
__name(inspectDate, "inspectDate");
function inspectFunction(func, options4) {
  const functionType = func[Symbol.toStringTag] || "Function";
  const name = func.name;
  if (!name) {
    return options4.stylize(`[${functionType}]`, "special");
  }
  return options4.stylize(`[${functionType} ${truncate(name, options4.truncate - 11)}]`, "special");
}
__name(inspectFunction, "inspectFunction");
function inspectMapEntry([key, value], options4) {
  options4.truncate -= 4;
  key = options4.inspect(key, options4);
  options4.truncate -= key.length;
  value = options4.inspect(value, options4);
  return `${key} => ${value}`;
}
__name(inspectMapEntry, "inspectMapEntry");
function mapToEntries(map) {
  const entries = [];
  map.forEach((value, key) => {
    entries.push([key, value]);
  });
  return entries;
}
__name(mapToEntries, "mapToEntries");
function inspectMap(map, options4) {
  const size = map.size - 1;
  if (size <= 0) {
    return "Map{}";
  }
  options4.truncate -= 7;
  return `Map{ ${inspectList(mapToEntries(map), options4, inspectMapEntry)} }`;
}
__name(inspectMap, "inspectMap");
var isNaN = Number.isNaN || ((i) => i !== i);
function inspectNumber(number, options4) {
  if (isNaN(number)) {
    return options4.stylize("NaN", "number");
  }
  if (number === Infinity) {
    return options4.stylize("Infinity", "number");
  }
  if (number === -Infinity) {
    return options4.stylize("-Infinity", "number");
  }
  if (number === 0) {
    return options4.stylize(1 / number === Infinity ? "+0" : "-0", "number");
  }
  return options4.stylize(truncate(String(number), options4.truncate), "number");
}
__name(inspectNumber, "inspectNumber");
function inspectBigInt(number, options4) {
  let nums = truncate(number.toString(), options4.truncate - 1);
  if (nums !== truncator)
    nums += "n";
  return options4.stylize(nums, "bigint");
}
__name(inspectBigInt, "inspectBigInt");
function inspectRegExp(value, options4) {
  const flags = value.toString().split("/")[2];
  const sourceLength = options4.truncate - (2 + flags.length);
  const source = value.source;
  return options4.stylize(`/${truncate(source, sourceLength)}/${flags}`, "regexp");
}
__name(inspectRegExp, "inspectRegExp");
function arrayFromSet(set2) {
  const values = [];
  set2.forEach((value) => {
    values.push(value);
  });
  return values;
}
__name(arrayFromSet, "arrayFromSet");
function inspectSet(set2, options4) {
  if (set2.size === 0)
    return "Set{}";
  options4.truncate -= 7;
  return `Set{ ${inspectList(arrayFromSet(set2), options4)} }`;
}
__name(inspectSet, "inspectSet");
var stringEscapeChars = new RegExp("['\\u0000-\\u001f\\u007f-\\u009f\\u00ad\\u0600-\\u0604\\u070f\\u17b4\\u17b5\\u200c-\\u200f\\u2028-\\u202f\\u2060-\\u206f\\ufeff\\ufff0-\\uffff]", "g");
var escapeCharacters = {
  "\b": "\\b",
  "	": "\\t",
  "\n": "\\n",
  "\f": "\\f",
  "\r": "\\r",
  "'": "\\'",
  "\\": "\\\\"
};
var hex = 16;
var unicodeLength = 4;
function escape(char) {
  return escapeCharacters[char] || `\\u${`0000${char.charCodeAt(0).toString(hex)}`.slice(-unicodeLength)}`;
}
__name(escape, "escape");
function inspectString(string, options4) {
  if (stringEscapeChars.test(string)) {
    string = string.replace(stringEscapeChars, escape);
  }
  return options4.stylize(`'${truncate(string, options4.truncate - 2)}'`, "string");
}
__name(inspectString, "inspectString");
function inspectSymbol(value) {
  if ("description" in Symbol.prototype) {
    return value.description ? `Symbol(${value.description})` : "Symbol()";
  }
  return value.toString();
}
__name(inspectSymbol, "inspectSymbol");
var getPromiseValue = /* @__PURE__ */ __name(() => "Promise{\u2026}", "getPromiseValue");
try {
  const { getPromiseDetails, kPending, kRejected } = process.binding("util");
  if (Array.isArray(getPromiseDetails(Promise.resolve()))) {
    getPromiseValue = /* @__PURE__ */ __name((value, options4) => {
      const [state, innerValue] = getPromiseDetails(value);
      if (state === kPending) {
        return "Promise{<pending>}";
      }
      return `Promise${state === kRejected ? "!" : ""}{${options4.inspect(innerValue, options4)}}`;
    }, "getPromiseValue");
  }
} catch (notNode) {
}
var promise_default = getPromiseValue;
function inspectObject(object, options4) {
  const properties4 = Object.getOwnPropertyNames(object);
  const symbols = Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols(object) : [];
  if (properties4.length === 0 && symbols.length === 0) {
    return "{}";
  }
  options4.truncate -= 4;
  options4.seen = options4.seen || [];
  if (options4.seen.includes(object)) {
    return "[Circular]";
  }
  options4.seen.push(object);
  const propertyContents = inspectList(properties4.map((key) => [key, object[key]]), options4, inspectProperty);
  const symbolContents = inspectList(symbols.map((key) => [key, object[key]]), options4, inspectProperty);
  options4.seen.pop();
  let sep = "";
  if (propertyContents && symbolContents) {
    sep = ", ";
  }
  return `{ ${propertyContents}${sep}${symbolContents} }`;
}
__name(inspectObject, "inspectObject");
var toStringTag = typeof Symbol !== "undefined" && Symbol.toStringTag ? Symbol.toStringTag : false;
function inspectClass(value, options4) {
  let name = "";
  if (toStringTag && toStringTag in value) {
    name = value[toStringTag];
  }
  name = name || value.constructor.name;
  if (!name || name === "_class") {
    name = "<Anonymous Class>";
  }
  options4.truncate -= name.length;
  return `${name}${inspectObject(value, options4)}`;
}
__name(inspectClass, "inspectClass");
function inspectArguments(args, options4) {
  if (args.length === 0)
    return "Arguments[]";
  options4.truncate -= 13;
  return `Arguments[ ${inspectList(args, options4)} ]`;
}
__name(inspectArguments, "inspectArguments");
var errorKeys = [
  "stack",
  "line",
  "column",
  "name",
  "message",
  "fileName",
  "lineNumber",
  "columnNumber",
  "number",
  "description",
  "cause"
];
function inspectObject2(error, options4) {
  const properties4 = Object.getOwnPropertyNames(error).filter((key) => errorKeys.indexOf(key) === -1);
  const name = error.name;
  options4.truncate -= name.length;
  let message = "";
  if (typeof error.message === "string") {
    message = truncate(error.message, options4.truncate);
  } else {
    properties4.unshift("message");
  }
  message = message ? `: ${message}` : "";
  options4.truncate -= message.length + 5;
  options4.seen = options4.seen || [];
  if (options4.seen.includes(error)) {
    return "[Circular]";
  }
  options4.seen.push(error);
  const propertyContents = inspectList(properties4.map((key) => [key, error[key]]), options4, inspectProperty);
  return `${name}${message}${propertyContents ? ` { ${propertyContents} }` : ""}`;
}
__name(inspectObject2, "inspectObject");
function inspectAttribute([key, value], options4) {
  options4.truncate -= 3;
  if (!value) {
    return `${options4.stylize(String(key), "yellow")}`;
  }
  return `${options4.stylize(String(key), "yellow")}=${options4.stylize(`"${value}"`, "string")}`;
}
__name(inspectAttribute, "inspectAttribute");
function inspectHTMLCollection(collection, options4) {
  return inspectList(collection, options4, inspectHTML, "\n");
}
__name(inspectHTMLCollection, "inspectHTMLCollection");
function inspectHTML(element, options4) {
  const properties4 = element.getAttributeNames();
  const name = element.tagName.toLowerCase();
  const head = options4.stylize(`<${name}`, "special");
  const headClose = options4.stylize(`>`, "special");
  const tail = options4.stylize(`</${name}>`, "special");
  options4.truncate -= name.length * 2 + 5;
  let propertyContents = "";
  if (properties4.length > 0) {
    propertyContents += " ";
    propertyContents += inspectList(properties4.map((key) => [key, element.getAttribute(key)]), options4, inspectAttribute, " ");
  }
  options4.truncate -= propertyContents.length;
  const truncate2 = options4.truncate;
  let children = inspectHTMLCollection(element.children, options4);
  if (children && children.length > truncate2) {
    children = `${truncator}(${element.children.length})`;
  }
  return `${head}${propertyContents}${headClose}${children}${tail}`;
}
__name(inspectHTML, "inspectHTML");
var symbolsSupported = typeof Symbol === "function" && typeof Symbol.for === "function";
var chaiInspect = symbolsSupported ? Symbol.for("chai/inspect") : "@@chai/inspect";
var nodeInspect = false;
try {
  const nodeUtil = require_util();
  nodeInspect = nodeUtil.inspect ? nodeUtil.inspect.custom : false;
} catch (noNodeInspect) {
  nodeInspect = false;
}
var constructorMap = /* @__PURE__ */ new WeakMap();
var stringTagMap = {};
var baseTypesMap = {
  undefined: /* @__PURE__ */ __name((value, options4) => options4.stylize("undefined", "undefined"), "undefined"),
  null: /* @__PURE__ */ __name((value, options4) => options4.stylize("null", "null"), "null"),
  boolean: /* @__PURE__ */ __name((value, options4) => options4.stylize(String(value), "boolean"), "boolean"),
  Boolean: /* @__PURE__ */ __name((value, options4) => options4.stylize(String(value), "boolean"), "Boolean"),
  number: inspectNumber,
  Number: inspectNumber,
  bigint: inspectBigInt,
  BigInt: inspectBigInt,
  string: inspectString,
  String: inspectString,
  function: inspectFunction,
  Function: inspectFunction,
  symbol: inspectSymbol,
  // A Symbol polyfill will return `Symbol` not `symbol` from typedetect
  Symbol: inspectSymbol,
  Array: inspectArray,
  Date: inspectDate,
  Map: inspectMap,
  Set: inspectSet,
  RegExp: inspectRegExp,
  Promise: promise_default,
  // WeakSet, WeakMap are totally opaque to us
  WeakSet: /* @__PURE__ */ __name((value, options4) => options4.stylize("WeakSet{\u2026}", "special"), "WeakSet"),
  WeakMap: /* @__PURE__ */ __name((value, options4) => options4.stylize("WeakMap{\u2026}", "special"), "WeakMap"),
  Arguments: inspectArguments,
  Int8Array: inspectTypedArray,
  Uint8Array: inspectTypedArray,
  Uint8ClampedArray: inspectTypedArray,
  Int16Array: inspectTypedArray,
  Uint16Array: inspectTypedArray,
  Int32Array: inspectTypedArray,
  Uint32Array: inspectTypedArray,
  Float32Array: inspectTypedArray,
  Float64Array: inspectTypedArray,
  Generator: /* @__PURE__ */ __name(() => "", "Generator"),
  DataView: /* @__PURE__ */ __name(() => "", "DataView"),
  ArrayBuffer: /* @__PURE__ */ __name(() => "", "ArrayBuffer"),
  Error: inspectObject2,
  HTMLCollection: inspectHTMLCollection,
  NodeList: inspectHTMLCollection
};
var inspectCustom = /* @__PURE__ */ __name((value, options4, type3) => {
  if (chaiInspect in value && typeof value[chaiInspect] === "function") {
    return value[chaiInspect](options4);
  }
  if (nodeInspect && nodeInspect in value && typeof value[nodeInspect] === "function") {
    return value[nodeInspect](options4.depth, options4);
  }
  if ("inspect" in value && typeof value.inspect === "function") {
    return value.inspect(options4.depth, options4);
  }
  if ("constructor" in value && constructorMap.has(value.constructor)) {
    return constructorMap.get(value.constructor)(value, options4);
  }
  if (stringTagMap[type3]) {
    return stringTagMap[type3](value, options4);
  }
  return "";
}, "inspectCustom");
var toString = Object.prototype.toString;
function inspect(value, opts = {}) {
  const options4 = normaliseOptions(opts, inspect);
  const { customInspect } = options4;
  let type3 = value === null ? "null" : typeof value;
  if (type3 === "object") {
    type3 = toString.call(value).slice(8, -1);
  }
  if (type3 in baseTypesMap) {
    return baseTypesMap[type3](value, options4);
  }
  if (customInspect && value) {
    const output = inspectCustom(value, options4, type3);
    if (output) {
      if (typeof output === "string")
        return output;
      return inspect(output, options4);
    }
  }
  const proto = value ? Object.getPrototypeOf(value) : false;
  if (proto === Object.prototype || proto === null) {
    return inspectObject(value, options4);
  }
  if (value && typeof HTMLElement === "function" && value instanceof HTMLElement) {
    return inspectHTML(value, options4);
  }
  if ("constructor" in value) {
    if (value.constructor !== Object) {
      return inspectClass(value, options4);
    }
    return inspectObject(value, options4);
  }
  if (value === Object(value)) {
    return inspectObject(value, options4);
  }
  return options4.stylize(String(value), type3);
}
__name(inspect, "inspect");
var config = {
  /**
   * ### config.includeStack
   *
   * User configurable property, influences whether stack trace
   * is included in Assertion error message. Default of false
   * suppresses stack trace in the error message.
   *
   *     chai.config.includeStack = true;  // enable stack on error
   *
   * @param {boolean}
   * @public
   */
  includeStack: false,
  /**
   * ### config.showDiff
   *
   * User configurable property, influences whether or not
   * the `showDiff` flag should be included in the thrown
   * AssertionErrors. `false` will always be `false`; `true`
   * will be true when the assertion has requested a diff
   * be shown.
   *
   * @param {boolean}
   * @public
   */
  showDiff: true,
  /**
   * ### config.truncateThreshold
   *
   * User configurable property, sets length threshold for actual and
   * expected values in assertion errors. If this threshold is exceeded, for
   * example for large data structures, the value is replaced with something
   * like `[ Array(3) ]` or `{ Object (prop1, prop2) }`.
   *
   * Set it to zero if you want to disable truncating altogether.
   *
   * This is especially userful when doing assertions on arrays: having this
   * set to a reasonable large value makes the failure messages readily
   * inspectable.
   *
   *     chai.config.truncateThreshold = 0;  // disable truncating
   *
   * @param {number}
   * @public
   */
  truncateThreshold: 40,
  /**
   * ### config.useProxy
   *
   * User configurable property, defines if chai will use a Proxy to throw
   * an error when a non-existent property is read, which protects users
   * from typos when using property-based assertions.
   *
   * Set it to false if you want to disable this feature.
   *
   *     chai.config.useProxy = false;  // disable use of Proxy
   *
   * This feature is automatically disabled regardless of this config value
   * in environments that don't support proxies.
   *
   * @param {boolean}
   * @public
   */
  useProxy: true,
  /**
   * ### config.proxyExcludedKeys
   *
   * User configurable property, defines which properties should be ignored
   * instead of throwing an error if they do not exist on the assertion.
   * This is only applied if the environment Chai is running in supports proxies and
   * if the `useProxy` configuration setting is enabled.
   * By default, `then` and `inspect` will not throw an error if they do not exist on the
   * assertion object because the `.inspect` property is read by `util.inspect` (for example, when
   * using `console.log` on the assertion object) and `.then` is necessary for promise type-checking.
   *
   *     // By default these keys will not throw an error if they do not exist on the assertion object
   *     chai.config.proxyExcludedKeys = ['then', 'inspect'];
   *
   * @param {Array}
   * @public
   */
  proxyExcludedKeys: ["then", "catch", "inspect", "toJSON"],
  /**
   * ### config.deepEqual
   *
   * User configurable property, defines which a custom function to use for deepEqual
   * comparisons.
   * By default, the function used is the one from the `deep-eql` package without custom comparator.
   *
   *     // use a custom comparator
   *     chai.config.deepEqual = (expected, actual) => {
   *         return chai.util.eql(expected, actual, {
   *             comparator: (expected, actual) => {
   *                 // for non number comparison, use the default behavior
   *                 if(typeof expected !== 'number') return null;
   *                 // allow a difference of 10 between compared numbers
   *                 return typeof actual === 'number' && Math.abs(actual - expected) < 10
   *             }
   *         })
   *     };
   *
   * @param {Function}
   * @public
   */
  deepEqual: null
};
function inspect2(obj, showHidden, depth, colors) {
  let options4 = {
    colors,
    depth: typeof depth === "undefined" ? 2 : depth,
    showHidden,
    truncate: config.truncateThreshold ? config.truncateThreshold : Infinity
  };
  return inspect(obj, options4);
}
__name(inspect2, "inspect");
function objDisplay(obj) {
  let str = inspect2(obj), type3 = Object.prototype.toString.call(obj);
  if (config.truncateThreshold && str.length >= config.truncateThreshold) {
    if (type3 === "[object Function]") {
      return !obj.name || obj.name === "" ? "[Function]" : "[Function: " + obj.name + "]";
    } else if (type3 === "[object Array]") {
      return "[ Array(" + obj.length + ") ]";
    } else if (type3 === "[object Object]") {
      let keys = Object.keys(obj), kstr = keys.length > 2 ? keys.splice(0, 2).join(", ") + ", ..." : keys.join(", ");
      return "{ Object (" + kstr + ") }";
    } else {
      return str;
    }
  } else {
    return str;
  }
}
__name(objDisplay, "objDisplay");
function getMessage2(obj, args) {
  let negate = flag(obj, "negate");
  let val = flag(obj, "object");
  let expected = args[3];
  let actual = getActual(obj, args);
  let msg = negate ? args[2] : args[1];
  let flagMsg = flag(obj, "message");
  if (typeof msg === "function") msg = msg();
  msg = msg || "";
  msg = msg.replace(/#\{this\}/g, function() {
    return objDisplay(val);
  }).replace(/#\{act\}/g, function() {
    return objDisplay(actual);
  }).replace(/#\{exp\}/g, function() {
    return objDisplay(expected);
  });
  return flagMsg ? flagMsg + ": " + msg : msg;
}
__name(getMessage2, "getMessage");
function transferFlags(assertion, object, includeAll) {
  let flags = assertion.__flags || (assertion.__flags = /* @__PURE__ */ Object.create(null));
  if (!object.__flags) {
    object.__flags = /* @__PURE__ */ Object.create(null);
  }
  includeAll = arguments.length === 3 ? includeAll : true;
  for (let flag3 in flags) {
    if (includeAll || flag3 !== "object" && flag3 !== "ssfi" && flag3 !== "lockSsfi" && flag3 != "message") {
      object.__flags[flag3] = flags[flag3];
    }
  }
}
__name(transferFlags, "transferFlags");
function type2(obj) {
  if (typeof obj === "undefined") {
    return "undefined";
  }
  if (obj === null) {
    return "null";
  }
  const stringTag = obj[Symbol.toStringTag];
  if (typeof stringTag === "string") {
    return stringTag;
  }
  const sliceStart = 8;
  const sliceEnd = -1;
  return Object.prototype.toString.call(obj).slice(sliceStart, sliceEnd);
}
__name(type2, "type");
function FakeMap() {
  this._key = "chai/deep-eql__" + Math.random() + Date.now();
}
__name(FakeMap, "FakeMap");
FakeMap.prototype = {
  get: /* @__PURE__ */ __name(function get(key) {
    return key[this._key];
  }, "get"),
  set: /* @__PURE__ */ __name(function set(key, value) {
    if (Object.isExtensible(key)) {
      Object.defineProperty(key, this._key, {
        value,
        configurable: true
      });
    }
  }, "set")
};
var MemoizeMap = typeof WeakMap === "function" ? WeakMap : FakeMap;
function memoizeCompare(leftHandOperand, rightHandOperand, memoizeMap) {
  if (!memoizeMap || isPrimitive(leftHandOperand) || isPrimitive(rightHandOperand)) {
    return null;
  }
  var leftHandMap = memoizeMap.get(leftHandOperand);
  if (leftHandMap) {
    var result = leftHandMap.get(rightHandOperand);
    if (typeof result === "boolean") {
      return result;
    }
  }
  return null;
}
__name(memoizeCompare, "memoizeCompare");
function memoizeSet(leftHandOperand, rightHandOperand, memoizeMap, result) {
  if (!memoizeMap || isPrimitive(leftHandOperand) || isPrimitive(rightHandOperand)) {
    return;
  }
  var leftHandMap = memoizeMap.get(leftHandOperand);
  if (leftHandMap) {
    leftHandMap.set(rightHandOperand, result);
  } else {
    leftHandMap = new MemoizeMap();
    leftHandMap.set(rightHandOperand, result);
    memoizeMap.set(leftHandOperand, leftHandMap);
  }
}
__name(memoizeSet, "memoizeSet");
var deep_eql_default = deepEqual;
function deepEqual(leftHandOperand, rightHandOperand, options4) {
  if (options4 && options4.comparator) {
    return extensiveDeepEqual(leftHandOperand, rightHandOperand, options4);
  }
  var simpleResult = simpleEqual(leftHandOperand, rightHandOperand);
  if (simpleResult !== null) {
    return simpleResult;
  }
  return extensiveDeepEqual(leftHandOperand, rightHandOperand, options4);
}
__name(deepEqual, "deepEqual");
function simpleEqual(leftHandOperand, rightHandOperand) {
  if (leftHandOperand === rightHandOperand) {
    return leftHandOperand !== 0 || 1 / leftHandOperand === 1 / rightHandOperand;
  }
  if (leftHandOperand !== leftHandOperand && // eslint-disable-line no-self-compare
  rightHandOperand !== rightHandOperand) {
    return true;
  }
  if (isPrimitive(leftHandOperand) || isPrimitive(rightHandOperand)) {
    return false;
  }
  return null;
}
__name(simpleEqual, "simpleEqual");
function extensiveDeepEqual(leftHandOperand, rightHandOperand, options4) {
  options4 = options4 || {};
  options4.memoize = options4.memoize === false ? false : options4.memoize || new MemoizeMap();
  var comparator = options4 && options4.comparator;
  var memoizeResultLeft = memoizeCompare(leftHandOperand, rightHandOperand, options4.memoize);
  if (memoizeResultLeft !== null) {
    return memoizeResultLeft;
  }
  var memoizeResultRight = memoizeCompare(rightHandOperand, leftHandOperand, options4.memoize);
  if (memoizeResultRight !== null) {
    return memoizeResultRight;
  }
  if (comparator) {
    var comparatorResult = comparator(leftHandOperand, rightHandOperand);
    if (comparatorResult === false || comparatorResult === true) {
      memoizeSet(leftHandOperand, rightHandOperand, options4.memoize, comparatorResult);
      return comparatorResult;
    }
    var simpleResult = simpleEqual(leftHandOperand, rightHandOperand);
    if (simpleResult !== null) {
      return simpleResult;
    }
  }
  var leftHandType = type2(leftHandOperand);
  if (leftHandType !== type2(rightHandOperand)) {
    memoizeSet(leftHandOperand, rightHandOperand, options4.memoize, false);
    return false;
  }
  memoizeSet(leftHandOperand, rightHandOperand, options4.memoize, true);
  var result = extensiveDeepEqualByType(leftHandOperand, rightHandOperand, leftHandType, options4);
  memoizeSet(leftHandOperand, rightHandOperand, options4.memoize, result);
  return result;
}
__name(extensiveDeepEqual, "extensiveDeepEqual");
function extensiveDeepEqualByType(leftHandOperand, rightHandOperand, leftHandType, options4) {
  switch (leftHandType) {
    case "String":
    case "Number":
    case "Boolean":
    case "Date":
      return deepEqual(leftHandOperand.valueOf(), rightHandOperand.valueOf());
    case "Promise":
    case "Symbol":
    case "function":
    case "WeakMap":
    case "WeakSet":
      return leftHandOperand === rightHandOperand;
    case "Error":
      return keysEqual(leftHandOperand, rightHandOperand, ["name", "message", "code"], options4);
    case "Arguments":
    case "Int8Array":
    case "Uint8Array":
    case "Uint8ClampedArray":
    case "Int16Array":
    case "Uint16Array":
    case "Int32Array":
    case "Uint32Array":
    case "Float32Array":
    case "Float64Array":
    case "Array":
      return iterableEqual(leftHandOperand, rightHandOperand, options4);
    case "RegExp":
      return regexpEqual(leftHandOperand, rightHandOperand);
    case "Generator":
      return generatorEqual(leftHandOperand, rightHandOperand, options4);
    case "DataView":
      return iterableEqual(new Uint8Array(leftHandOperand.buffer), new Uint8Array(rightHandOperand.buffer), options4);
    case "ArrayBuffer":
      return iterableEqual(new Uint8Array(leftHandOperand), new Uint8Array(rightHandOperand), options4);
    case "Set":
      return entriesEqual(leftHandOperand, rightHandOperand, options4);
    case "Map":
      return entriesEqual(leftHandOperand, rightHandOperand, options4);
    case "Temporal.PlainDate":
    case "Temporal.PlainTime":
    case "Temporal.PlainDateTime":
    case "Temporal.Instant":
    case "Temporal.ZonedDateTime":
    case "Temporal.PlainYearMonth":
    case "Temporal.PlainMonthDay":
      return leftHandOperand.equals(rightHandOperand);
    case "Temporal.Duration":
      return leftHandOperand.total("nanoseconds") === rightHandOperand.total("nanoseconds");
    case "Temporal.TimeZone":
    case "Temporal.Calendar":
      return leftHandOperand.toString() === rightHandOperand.toString();
    default:
      return objectEqual(leftHandOperand, rightHandOperand, options4);
  }
}
__name(extensiveDeepEqualByType, "extensiveDeepEqualByType");
function regexpEqual(leftHandOperand, rightHandOperand) {
  return leftHandOperand.toString() === rightHandOperand.toString();
}
__name(regexpEqual, "regexpEqual");
function entriesEqual(leftHandOperand, rightHandOperand, options4) {
  try {
    if (leftHandOperand.size !== rightHandOperand.size) {
      return false;
    }
    if (leftHandOperand.size === 0) {
      return true;
    }
  } catch (sizeError) {
    return false;
  }
  var leftHandItems = [];
  var rightHandItems = [];
  leftHandOperand.forEach(/* @__PURE__ */ __name(function gatherEntries(key, value) {
    leftHandItems.push([key, value]);
  }, "gatherEntries"));
  rightHandOperand.forEach(/* @__PURE__ */ __name(function gatherEntries(key, value) {
    rightHandItems.push([key, value]);
  }, "gatherEntries"));
  return iterableEqual(leftHandItems.sort(), rightHandItems.sort(), options4);
}
__name(entriesEqual, "entriesEqual");
function iterableEqual(leftHandOperand, rightHandOperand, options4) {
  var length = leftHandOperand.length;
  if (length !== rightHandOperand.length) {
    return false;
  }
  if (length === 0) {
    return true;
  }
  var index = -1;
  while (++index < length) {
    if (deepEqual(leftHandOperand[index], rightHandOperand[index], options4) === false) {
      return false;
    }
  }
  return true;
}
__name(iterableEqual, "iterableEqual");
function generatorEqual(leftHandOperand, rightHandOperand, options4) {
  return iterableEqual(getGeneratorEntries(leftHandOperand), getGeneratorEntries(rightHandOperand), options4);
}
__name(generatorEqual, "generatorEqual");
function hasIteratorFunction(target) {
  return typeof Symbol !== "undefined" && typeof target === "object" && typeof Symbol.iterator !== "undefined" && typeof target[Symbol.iterator] === "function";
}
__name(hasIteratorFunction, "hasIteratorFunction");
function getIteratorEntries(target) {
  if (hasIteratorFunction(target)) {
    try {
      return getGeneratorEntries(target[Symbol.iterator]());
    } catch (iteratorError) {
      return [];
    }
  }
  return [];
}
__name(getIteratorEntries, "getIteratorEntries");
function getGeneratorEntries(generator) {
  var generatorResult = generator.next();
  var accumulator = [generatorResult.value];
  while (generatorResult.done === false) {
    generatorResult = generator.next();
    accumulator.push(generatorResult.value);
  }
  return accumulator;
}
__name(getGeneratorEntries, "getGeneratorEntries");
function getEnumerableKeys(target) {
  var keys = [];
  for (var key in target) {
    keys.push(key);
  }
  return keys;
}
__name(getEnumerableKeys, "getEnumerableKeys");
function getEnumerableSymbols(target) {
  var keys = [];
  var allKeys = Object.getOwnPropertySymbols(target);
  for (var i = 0; i < allKeys.length; i += 1) {
    var key = allKeys[i];
    if (Object.getOwnPropertyDescriptor(target, key).enumerable) {
      keys.push(key);
    }
  }
  return keys;
}
__name(getEnumerableSymbols, "getEnumerableSymbols");
function keysEqual(leftHandOperand, rightHandOperand, keys, options4) {
  var length = keys.length;
  if (length === 0) {
    return true;
  }
  for (var i = 0; i < length; i += 1) {
    if (deepEqual(leftHandOperand[keys[i]], rightHandOperand[keys[i]], options4) === false) {
      return false;
    }
  }
  return true;
}
__name(keysEqual, "keysEqual");
function objectEqual(leftHandOperand, rightHandOperand, options4) {
  var leftHandKeys = getEnumerableKeys(leftHandOperand);
  var rightHandKeys = getEnumerableKeys(rightHandOperand);
  var leftHandSymbols = getEnumerableSymbols(leftHandOperand);
  var rightHandSymbols = getEnumerableSymbols(rightHandOperand);
  leftHandKeys = leftHandKeys.concat(leftHandSymbols);
  rightHandKeys = rightHandKeys.concat(rightHandSymbols);
  if (leftHandKeys.length && leftHandKeys.length === rightHandKeys.length) {
    if (iterableEqual(mapSymbols(leftHandKeys).sort(), mapSymbols(rightHandKeys).sort()) === false) {
      return false;
    }
    return keysEqual(leftHandOperand, rightHandOperand, leftHandKeys, options4);
  }
  var leftHandEntries = getIteratorEntries(leftHandOperand);
  var rightHandEntries = getIteratorEntries(rightHandOperand);
  if (leftHandEntries.length && leftHandEntries.length === rightHandEntries.length) {
    leftHandEntries.sort();
    rightHandEntries.sort();
    return iterableEqual(leftHandEntries, rightHandEntries, options4);
  }
  if (leftHandKeys.length === 0 && leftHandEntries.length === 0 && rightHandKeys.length === 0 && rightHandEntries.length === 0) {
    return true;
  }
  return false;
}
__name(objectEqual, "objectEqual");
function isPrimitive(value) {
  return value === null || typeof value !== "object";
}
__name(isPrimitive, "isPrimitive");
function mapSymbols(arr) {
  return arr.map(/* @__PURE__ */ __name(function mapSymbol(entry) {
    if (typeof entry === "symbol") {
      return entry.toString();
    }
    return entry;
  }, "mapSymbol"));
}
__name(mapSymbols, "mapSymbols");
function hasProperty(obj, name) {
  if (typeof obj === "undefined" || obj === null) {
    return false;
  }
  return name in Object(obj);
}
__name(hasProperty, "hasProperty");
function parsePath(path) {
  const str = path.replace(/([^\\])\[/g, "$1.[");
  const parts = str.match(/(\\\.|[^.]+?)+/g);
  return parts.map((value) => {
    if (value === "constructor" || value === "__proto__" || value === "prototype") {
      return {};
    }
    const regexp = /^\[(\d+)\]$/;
    const mArr = regexp.exec(value);
    let parsed = null;
    if (mArr) {
      parsed = { i: parseFloat(mArr[1]) };
    } else {
      parsed = { p: value.replace(/\\([.[\]])/g, "$1") };
    }
    return parsed;
  });
}
__name(parsePath, "parsePath");
function internalGetPathValue(obj, parsed, pathDepth) {
  let temporaryValue = obj;
  let res = null;
  pathDepth = typeof pathDepth === "undefined" ? parsed.length : pathDepth;
  for (let i = 0; i < pathDepth; i++) {
    const part = parsed[i];
    if (temporaryValue) {
      if (typeof part.p === "undefined") {
        temporaryValue = temporaryValue[part.i];
      } else {
        temporaryValue = temporaryValue[part.p];
      }
      if (i === pathDepth - 1) {
        res = temporaryValue;
      }
    }
  }
  return res;
}
__name(internalGetPathValue, "internalGetPathValue");
function getPathInfo(obj, path) {
  const parsed = parsePath(path);
  const last = parsed[parsed.length - 1];
  const info = {
    parent: parsed.length > 1 ? internalGetPathValue(obj, parsed, parsed.length - 1) : obj,
    name: last.p || last.i,
    value: internalGetPathValue(obj, parsed)
  };
  info.exists = hasProperty(info.parent, info.name);
  return info;
}
__name(getPathInfo, "getPathInfo");
var _a2;
var Assertion = (_a2 = class {
  /**
   * Creates object for chaining.
   * `Assertion` objects contain metadata in the form of flags. Three flags can
   * be assigned during instantiation by passing arguments to this constructor:
   *
   * - `object`: This flag contains the target of the assertion. For example, in
   * the assertion `expect(numKittens).to.equal(7);`, the `object` flag will
   * contain `numKittens` so that the `equal` assertion can reference it when
   * needed.
   *
   * - `message`: This flag contains an optional custom error message to be
   * prepended to the error message that's generated by the assertion when it
   * fails.
   *
   * - `ssfi`: This flag stands for "start stack function indicator". It
   * contains a function reference that serves as the starting point for
   * removing frames from the stack trace of the error that's created by the
   * assertion when it fails. The goal is to provide a cleaner stack trace to
   * end users by removing Chai's internal functions. Note that it only works
   * in environments that support `Error.captureStackTrace`, and only when
   * `Chai.config.includeStack` hasn't been set to `false`.
   *
   * - `lockSsfi`: This flag controls whether or not the given `ssfi` flag
   * should retain its current value, even as assertions are chained off of
   * this object. This is usually set to `true` when creating a new assertion
   * from within another assertion. It's also temporarily set to `true` before
   * an overwritten assertion gets called by the overwriting assertion.
   *
   * - `eql`: This flag contains the deepEqual function to be used by the assertion.
   *
   * @param {unknown} obj target of the assertion
   * @param {string} [msg] (optional) custom error message
   * @param {Function} [ssfi] (optional) starting point for removing stack frames
   * @param {boolean} [lockSsfi] (optional) whether or not the ssfi flag is locked
   */
  constructor(obj, msg, ssfi, lockSsfi) {
    /** @type {{}} */
    __publicField(this, "__flags", {});
    flag(this, "ssfi", ssfi || _a2);
    flag(this, "lockSsfi", lockSsfi);
    flag(this, "object", obj);
    flag(this, "message", msg);
    flag(this, "eql", config.deepEqual || deep_eql_default);
    return proxify(this);
  }
  /** @returns {boolean} */
  static get includeStack() {
    console.warn(
      "Assertion.includeStack is deprecated, use chai.config.includeStack instead."
    );
    return config.includeStack;
  }
  /** @param {boolean} value */
  static set includeStack(value) {
    console.warn(
      "Assertion.includeStack is deprecated, use chai.config.includeStack instead."
    );
    config.includeStack = value;
  }
  /** @returns {boolean} */
  static get showDiff() {
    console.warn(
      "Assertion.showDiff is deprecated, use chai.config.showDiff instead."
    );
    return config.showDiff;
  }
  /** @param {boolean} value */
  static set showDiff(value) {
    console.warn(
      "Assertion.showDiff is deprecated, use chai.config.showDiff instead."
    );
    config.showDiff = value;
  }
  /**
   * @param {string} name
   * @param {Function} fn
   */
  static addProperty(name, fn) {
    addProperty(this.prototype, name, fn);
  }
  /**
   * @param {string} name
   * @param {Function} fn
   */
  static addMethod(name, fn) {
    addMethod(this.prototype, name, fn);
  }
  /**
   * @param {string} name
   * @param {Function} fn
   * @param {Function} chainingBehavior
   */
  static addChainableMethod(name, fn, chainingBehavior) {
    addChainableMethod(this.prototype, name, fn, chainingBehavior);
  }
  /**
   * @param {string} name
   * @param {Function} fn
   */
  static overwriteProperty(name, fn) {
    overwriteProperty(this.prototype, name, fn);
  }
  /**
   * @param {string} name
   * @param {Function} fn
   */
  static overwriteMethod(name, fn) {
    overwriteMethod(this.prototype, name, fn);
  }
  /**
   * @param {string} name
   * @param {Function} fn
   * @param {Function} chainingBehavior
   */
  static overwriteChainableMethod(name, fn, chainingBehavior) {
    overwriteChainableMethod(this.prototype, name, fn, chainingBehavior);
  }
  /**
   * ### .assert(expression, message, negateMessage, expected, actual, showDiff)
   *
   * Executes an expression and check expectations. Throws AssertionError for reporting if test doesn't pass.
   *
   * @name assert
   * @param {unknown} _expr to be tested
   * @param {string | Function} msg or function that returns message to display if expression fails
   * @param {string | Function} _negateMsg or function that returns negatedMessage to display if negated expression fails
   * @param {unknown} expected value (remember to check for negation)
   * @param {unknown} _actual (optional) will default to `this.obj`
   * @param {boolean} showDiff (optional) when set to `true`, assert will display a diff in addition to the message if expression fails
   * @returns {void}
   */
  assert(_expr, msg, _negateMsg, expected, _actual, showDiff) {
    const ok = test(this, arguments);
    if (false !== showDiff) showDiff = true;
    if (void 0 === expected && void 0 === _actual) showDiff = false;
    if (true !== config.showDiff) showDiff = false;
    if (!ok) {
      msg = getMessage2(this, arguments);
      const actual = getActual(this, arguments);
      const assertionErrorObjectProperties = {
        actual,
        expected,
        showDiff
      };
      const operator = getOperator(this, arguments);
      if (operator) {
        assertionErrorObjectProperties.operator = operator;
      }
      throw new AssertionError(
        msg,
        assertionErrorObjectProperties,
        // @ts-expect-error Not sure what to do about these types yet
        config.includeStack ? this.assert : flag(this, "ssfi")
      );
    }
  }
  /**
   * Quick reference to stored `actual` value for plugin developers.
   *
   * @returns {unknown}
   */
  get _obj() {
    return flag(this, "object");
  }
  /**
   * Quick reference to stored `actual` value for plugin developers.
   *
   * @param {unknown} val
   */
  set _obj(val) {
    flag(this, "object", val);
  }
}, __name(_a2, "Assertion"), _a2);
function isProxyEnabled() {
  return config.useProxy && typeof Proxy !== "undefined" && typeof Reflect !== "undefined";
}
__name(isProxyEnabled, "isProxyEnabled");
function addProperty(ctx, name, getter) {
  getter = getter === void 0 ? function() {
  } : getter;
  Object.defineProperty(ctx, name, {
    get: /* @__PURE__ */ __name(function propertyGetter() {
      if (!isProxyEnabled() && !flag(this, "lockSsfi")) {
        flag(this, "ssfi", propertyGetter);
      }
      let result = getter.call(this);
      if (result !== void 0) return result;
      let newAssertion = new Assertion();
      transferFlags(this, newAssertion);
      return newAssertion;
    }, "propertyGetter"),
    configurable: true
  });
}
__name(addProperty, "addProperty");
var fnLengthDesc = Object.getOwnPropertyDescriptor(function() {
}, "length");
function addLengthGuard(fn, assertionName, isChainable) {
  if (!fnLengthDesc.configurable) return fn;
  Object.defineProperty(fn, "length", {
    get: /* @__PURE__ */ __name(function() {
      if (isChainable) {
        throw Error(
          "Invalid Chai property: " + assertionName + '.length. Due to a compatibility issue, "length" cannot directly follow "' + assertionName + '". Use "' + assertionName + '.lengthOf" instead.'
        );
      }
      throw Error(
        "Invalid Chai property: " + assertionName + '.length. See docs for proper usage of "' + assertionName + '".'
      );
    }, "get")
  });
  return fn;
}
__name(addLengthGuard, "addLengthGuard");
function getProperties(object) {
  let result = Object.getOwnPropertyNames(object);
  function addProperty2(property) {
    if (result.indexOf(property) === -1) {
      result.push(property);
    }
  }
  __name(addProperty2, "addProperty");
  let proto = Object.getPrototypeOf(object);
  while (proto !== null) {
    Object.getOwnPropertyNames(proto).forEach(addProperty2);
    proto = Object.getPrototypeOf(proto);
  }
  return result;
}
__name(getProperties, "getProperties");
var builtins = ["__flags", "__methods", "_obj", "assert"];
function proxify(obj, nonChainableMethodName) {
  if (!isProxyEnabled()) return obj;
  return new Proxy(obj, {
    get: /* @__PURE__ */ __name(function proxyGetter(target, property) {
      if (typeof property === "string" && config.proxyExcludedKeys.indexOf(property) === -1 && !Reflect.has(target, property)) {
        if (nonChainableMethodName) {
          throw Error(
            "Invalid Chai property: " + nonChainableMethodName + "." + property + '. See docs for proper usage of "' + nonChainableMethodName + '".'
          );
        }
        let suggestion = null;
        let suggestionDistance = 4;
        getProperties(target).forEach(function(prop) {
          if (
            // we actually mean to check `Object.prototype` here
            // eslint-disable-next-line no-prototype-builtins
            !Object.prototype.hasOwnProperty(prop) && builtins.indexOf(prop) === -1
          ) {
            let dist = stringDistanceCapped(property, prop, suggestionDistance);
            if (dist < suggestionDistance) {
              suggestion = prop;
              suggestionDistance = dist;
            }
          }
        });
        if (suggestion !== null) {
          throw Error(
            "Invalid Chai property: " + property + '. Did you mean "' + suggestion + '"?'
          );
        } else {
          throw Error("Invalid Chai property: " + property);
        }
      }
      if (builtins.indexOf(property) === -1 && !flag(target, "lockSsfi")) {
        flag(target, "ssfi", proxyGetter);
      }
      return Reflect.get(target, property);
    }, "proxyGetter")
  });
}
__name(proxify, "proxify");
function stringDistanceCapped(strA, strB, cap) {
  if (Math.abs(strA.length - strB.length) >= cap) {
    return cap;
  }
  let memo = [];
  for (let i = 0; i <= strA.length; i++) {
    memo[i] = Array(strB.length + 1).fill(0);
    memo[i][0] = i;
  }
  for (let j = 0; j < strB.length; j++) {
    memo[0][j] = j;
  }
  for (let i = 1; i <= strA.length; i++) {
    let ch = strA.charCodeAt(i - 1);
    for (let j = 1; j <= strB.length; j++) {
      if (Math.abs(i - j) >= cap) {
        memo[i][j] = cap;
        continue;
      }
      memo[i][j] = Math.min(
        memo[i - 1][j] + 1,
        memo[i][j - 1] + 1,
        memo[i - 1][j - 1] + (ch === strB.charCodeAt(j - 1) ? 0 : 1)
      );
    }
  }
  return memo[strA.length][strB.length];
}
__name(stringDistanceCapped, "stringDistanceCapped");
function addMethod(ctx, name, method) {
  let methodWrapper = /* @__PURE__ */ __name(function() {
    if (!flag(this, "lockSsfi")) {
      flag(this, "ssfi", methodWrapper);
    }
    let result = method.apply(this, arguments);
    if (result !== void 0) return result;
    let newAssertion = new Assertion();
    transferFlags(this, newAssertion);
    return newAssertion;
  }, "methodWrapper");
  addLengthGuard(methodWrapper, name, false);
  ctx[name] = proxify(methodWrapper, name);
}
__name(addMethod, "addMethod");
function overwriteProperty(ctx, name, getter) {
  let _get = Object.getOwnPropertyDescriptor(ctx, name), _super = /* @__PURE__ */ __name(function() {
  }, "_super");
  if (_get && "function" === typeof _get.get) _super = _get.get;
  Object.defineProperty(ctx, name, {
    get: /* @__PURE__ */ __name(function overwritingPropertyGetter() {
      if (!isProxyEnabled() && !flag(this, "lockSsfi")) {
        flag(this, "ssfi", overwritingPropertyGetter);
      }
      let origLockSsfi = flag(this, "lockSsfi");
      flag(this, "lockSsfi", true);
      let result = getter(_super).call(this);
      flag(this, "lockSsfi", origLockSsfi);
      if (result !== void 0) {
        return result;
      }
      let newAssertion = new Assertion();
      transferFlags(this, newAssertion);
      return newAssertion;
    }, "overwritingPropertyGetter"),
    configurable: true
  });
}
__name(overwriteProperty, "overwriteProperty");
function overwriteMethod(ctx, name, method) {
  let _method = ctx[name], _super = /* @__PURE__ */ __name(function() {
    throw new Error(name + " is not a function");
  }, "_super");
  if (_method && "function" === typeof _method) _super = _method;
  let overwritingMethodWrapper = /* @__PURE__ */ __name(function() {
    if (!flag(this, "lockSsfi")) {
      flag(this, "ssfi", overwritingMethodWrapper);
    }
    let origLockSsfi = flag(this, "lockSsfi");
    flag(this, "lockSsfi", true);
    let result = method(_super).apply(this, arguments);
    flag(this, "lockSsfi", origLockSsfi);
    if (result !== void 0) {
      return result;
    }
    let newAssertion = new Assertion();
    transferFlags(this, newAssertion);
    return newAssertion;
  }, "overwritingMethodWrapper");
  addLengthGuard(overwritingMethodWrapper, name, false);
  ctx[name] = proxify(overwritingMethodWrapper, name);
}
__name(overwriteMethod, "overwriteMethod");
var canSetPrototype = typeof Object.setPrototypeOf === "function";
var testFn = /* @__PURE__ */ __name(function() {
}, "testFn");
var excludeNames = Object.getOwnPropertyNames(testFn).filter(function(name) {
  let propDesc = Object.getOwnPropertyDescriptor(testFn, name);
  if (typeof propDesc !== "object") return true;
  return !propDesc.configurable;
});
var call = Function.prototype.call;
var apply = Function.prototype.apply;
function addChainableMethod(ctx, name, method, chainingBehavior) {
  if (typeof chainingBehavior !== "function") {
    chainingBehavior = /* @__PURE__ */ __name(function() {
    }, "chainingBehavior");
  }
  let chainableBehavior = {
    method,
    chainingBehavior
  };
  if (!ctx.__methods) {
    ctx.__methods = {};
  }
  ctx.__methods[name] = chainableBehavior;
  Object.defineProperty(ctx, name, {
    get: /* @__PURE__ */ __name(function chainableMethodGetter() {
      chainableBehavior.chainingBehavior.call(this);
      let chainableMethodWrapper = /* @__PURE__ */ __name(function() {
        if (!flag(this, "lockSsfi")) {
          flag(this, "ssfi", chainableMethodWrapper);
        }
        let result = chainableBehavior.method.apply(this, arguments);
        if (result !== void 0) {
          return result;
        }
        let newAssertion = new Assertion();
        transferFlags(this, newAssertion);
        return newAssertion;
      }, "chainableMethodWrapper");
      addLengthGuard(chainableMethodWrapper, name, true);
      if (canSetPrototype) {
        let prototype = Object.create(this);
        prototype.call = call;
        prototype.apply = apply;
        Object.setPrototypeOf(chainableMethodWrapper, prototype);
      } else {
        let asserterNames = Object.getOwnPropertyNames(ctx);
        asserterNames.forEach(function(asserterName) {
          if (excludeNames.indexOf(asserterName) !== -1) {
            return;
          }
          let pd = Object.getOwnPropertyDescriptor(ctx, asserterName);
          Object.defineProperty(chainableMethodWrapper, asserterName, pd);
        });
      }
      transferFlags(this, chainableMethodWrapper);
      return proxify(chainableMethodWrapper);
    }, "chainableMethodGetter"),
    configurable: true
  });
}
__name(addChainableMethod, "addChainableMethod");
function overwriteChainableMethod(ctx, name, method, chainingBehavior) {
  let chainableBehavior = ctx.__methods[name];
  let _chainingBehavior = chainableBehavior.chainingBehavior;
  chainableBehavior.chainingBehavior = /* @__PURE__ */ __name(function overwritingChainableMethodGetter() {
    let result = chainingBehavior(_chainingBehavior).call(this);
    if (result !== void 0) {
      return result;
    }
    let newAssertion = new Assertion();
    transferFlags(this, newAssertion);
    return newAssertion;
  }, "overwritingChainableMethodGetter");
  let _method = chainableBehavior.method;
  chainableBehavior.method = /* @__PURE__ */ __name(function overwritingChainableMethodWrapper() {
    let result = method(_method).apply(this, arguments);
    if (result !== void 0) {
      return result;
    }
    let newAssertion = new Assertion();
    transferFlags(this, newAssertion);
    return newAssertion;
  }, "overwritingChainableMethodWrapper");
}
__name(overwriteChainableMethod, "overwriteChainableMethod");
function compareByInspect(a, b) {
  return inspect2(a) < inspect2(b) ? -1 : 1;
}
__name(compareByInspect, "compareByInspect");
function getOwnEnumerablePropertySymbols(obj) {
  if (typeof Object.getOwnPropertySymbols !== "function") return [];
  return Object.getOwnPropertySymbols(obj).filter(function(sym) {
    return Object.getOwnPropertyDescriptor(obj, sym).enumerable;
  });
}
__name(getOwnEnumerablePropertySymbols, "getOwnEnumerablePropertySymbols");
function getOwnEnumerableProperties(obj) {
  return Object.keys(obj).concat(getOwnEnumerablePropertySymbols(obj));
}
__name(getOwnEnumerableProperties, "getOwnEnumerableProperties");
var isNaN2 = Number.isNaN;
function isObjectType(obj) {
  let objectType = type(obj);
  let objectTypes = ["Array", "Object", "Function"];
  return objectTypes.indexOf(objectType) !== -1;
}
__name(isObjectType, "isObjectType");
function getOperator(obj, args) {
  let operator = flag(obj, "operator");
  let negate = flag(obj, "negate");
  let expected = args[3];
  let msg = negate ? args[2] : args[1];
  if (operator) {
    return operator;
  }
  if (typeof msg === "function") msg = msg();
  msg = msg || "";
  if (!msg) {
    return void 0;
  }
  if (/\shave\s/.test(msg)) {
    return void 0;
  }
  let isObject = isObjectType(expected);
  if (/\snot\s/.test(msg)) {
    return isObject ? "notDeepStrictEqual" : "notStrictEqual";
  }
  return isObject ? "deepStrictEqual" : "strictEqual";
}
__name(getOperator, "getOperator");
function getName(fn) {
  return fn.name;
}
__name(getName, "getName");
function isRegExp2(obj) {
  return Object.prototype.toString.call(obj) === "[object RegExp]";
}
__name(isRegExp2, "isRegExp");
function isNumeric(obj) {
  return ["Number", "BigInt"].includes(type(obj));
}
__name(isNumeric, "isNumeric");
var { flag: flag2 } = utils_exports;
[
  "to",
  "be",
  "been",
  "is",
  "and",
  "has",
  "have",
  "with",
  "that",
  "which",
  "at",
  "of",
  "same",
  "but",
  "does",
  "still",
  "also"
].forEach(function(chain) {
  Assertion.addProperty(chain);
});
Assertion.addProperty("not", function() {
  flag2(this, "negate", true);
});
Assertion.addProperty("deep", function() {
  flag2(this, "deep", true);
});
Assertion.addProperty("nested", function() {
  flag2(this, "nested", true);
});
Assertion.addProperty("own", function() {
  flag2(this, "own", true);
});
Assertion.addProperty("ordered", function() {
  flag2(this, "ordered", true);
});
Assertion.addProperty("any", function() {
  flag2(this, "any", true);
  flag2(this, "all", false);
});
Assertion.addProperty("all", function() {
  flag2(this, "all", true);
  flag2(this, "any", false);
});
var functionTypes = {
  function: [
    "function",
    "asyncfunction",
    "generatorfunction",
    "asyncgeneratorfunction"
  ],
  asyncfunction: ["asyncfunction", "asyncgeneratorfunction"],
  generatorfunction: ["generatorfunction", "asyncgeneratorfunction"],
  asyncgeneratorfunction: ["asyncgeneratorfunction"]
};
function an(type3, msg) {
  if (msg) flag2(this, "message", msg);
  type3 = type3.toLowerCase();
  let obj = flag2(this, "object"), article = ~["a", "e", "i", "o", "u"].indexOf(type3.charAt(0)) ? "an " : "a ";
  const detectedType = type(obj).toLowerCase();
  if (functionTypes["function"].includes(type3)) {
    this.assert(
      functionTypes[type3].includes(detectedType),
      "expected #{this} to be " + article + type3,
      "expected #{this} not to be " + article + type3
    );
  } else {
    this.assert(
      type3 === detectedType,
      "expected #{this} to be " + article + type3,
      "expected #{this} not to be " + article + type3
    );
  }
}
__name(an, "an");
Assertion.addChainableMethod("an", an);
Assertion.addChainableMethod("a", an);
function SameValueZero(a, b) {
  return isNaN2(a) && isNaN2(b) || a === b;
}
__name(SameValueZero, "SameValueZero");
function includeChainingBehavior() {
  flag2(this, "contains", true);
}
__name(includeChainingBehavior, "includeChainingBehavior");
function include(val, msg) {
  if (msg) flag2(this, "message", msg);
  let obj = flag2(this, "object"), objType = type(obj).toLowerCase(), flagMsg = flag2(this, "message"), negate = flag2(this, "negate"), ssfi = flag2(this, "ssfi"), isDeep = flag2(this, "deep"), descriptor = isDeep ? "deep " : "", isEql = isDeep ? flag2(this, "eql") : SameValueZero;
  flagMsg = flagMsg ? flagMsg + ": " : "";
  let included = false;
  switch (objType) {
    case "string":
      included = obj.indexOf(val) !== -1;
      break;
    case "weakset":
      if (isDeep) {
        throw new AssertionError(
          flagMsg + "unable to use .deep.include with WeakSet",
          void 0,
          ssfi
        );
      }
      included = obj.has(val);
      break;
    case "map":
      obj.forEach(function(item) {
        included = included || isEql(item, val);
      });
      break;
    case "set":
      if (isDeep) {
        obj.forEach(function(item) {
          included = included || isEql(item, val);
        });
      } else {
        included = obj.has(val);
      }
      break;
    case "array":
      if (isDeep) {
        included = obj.some(function(item) {
          return isEql(item, val);
        });
      } else {
        included = obj.indexOf(val) !== -1;
      }
      break;
    default: {
      if (val !== Object(val)) {
        throw new AssertionError(
          flagMsg + "the given combination of arguments (" + objType + " and " + type(val).toLowerCase() + ") is invalid for this assertion. You can use an array, a map, an object, a set, a string, or a weakset instead of a " + type(val).toLowerCase(),
          void 0,
          ssfi
        );
      }
      let props = Object.keys(val);
      let firstErr = null;
      let numErrs = 0;
      props.forEach(function(prop) {
        let propAssertion = new Assertion(obj);
        transferFlags(this, propAssertion, true);
        flag2(propAssertion, "lockSsfi", true);
        if (!negate || props.length === 1) {
          propAssertion.property(prop, val[prop]);
          return;
        }
        try {
          propAssertion.property(prop, val[prop]);
        } catch (err) {
          if (!check_error_exports.compatibleConstructor(err, AssertionError)) {
            throw err;
          }
          if (firstErr === null) firstErr = err;
          numErrs++;
        }
      }, this);
      if (negate && props.length > 1 && numErrs === props.length) {
        throw firstErr;
      }
      return;
    }
  }
  this.assert(
    included,
    "expected #{this} to " + descriptor + "include " + inspect2(val),
    "expected #{this} to not " + descriptor + "include " + inspect2(val)
  );
}
__name(include, "include");
Assertion.addChainableMethod("include", include, includeChainingBehavior);
Assertion.addChainableMethod("contain", include, includeChainingBehavior);
Assertion.addChainableMethod("contains", include, includeChainingBehavior);
Assertion.addChainableMethod("includes", include, includeChainingBehavior);
Assertion.addProperty("ok", function() {
  this.assert(
    flag2(this, "object"),
    "expected #{this} to be truthy",
    "expected #{this} to be falsy"
  );
});
Assertion.addProperty("true", function() {
  this.assert(
    true === flag2(this, "object"),
    "expected #{this} to be true",
    "expected #{this} to be false",
    flag2(this, "negate") ? false : true
  );
});
Assertion.addProperty("numeric", function() {
  const object = flag2(this, "object");
  this.assert(
    ["Number", "BigInt"].includes(type(object)),
    "expected #{this} to be numeric",
    "expected #{this} to not be numeric",
    flag2(this, "negate") ? false : true
  );
});
Assertion.addProperty("callable", function() {
  const val = flag2(this, "object");
  const ssfi = flag2(this, "ssfi");
  const message = flag2(this, "message");
  const msg = message ? `${message}: ` : "";
  const negate = flag2(this, "negate");
  const assertionMessage = negate ? `${msg}expected ${inspect2(val)} not to be a callable function` : `${msg}expected ${inspect2(val)} to be a callable function`;
  const isCallable = [
    "Function",
    "AsyncFunction",
    "GeneratorFunction",
    "AsyncGeneratorFunction"
  ].includes(type(val));
  if (isCallable && negate || !isCallable && !negate) {
    throw new AssertionError(assertionMessage, void 0, ssfi);
  }
});
Assertion.addProperty("false", function() {
  this.assert(
    false === flag2(this, "object"),
    "expected #{this} to be false",
    "expected #{this} to be true",
    flag2(this, "negate") ? true : false
  );
});
Assertion.addProperty("null", function() {
  this.assert(
    null === flag2(this, "object"),
    "expected #{this} to be null",
    "expected #{this} not to be null"
  );
});
Assertion.addProperty("undefined", function() {
  this.assert(
    void 0 === flag2(this, "object"),
    "expected #{this} to be undefined",
    "expected #{this} not to be undefined"
  );
});
Assertion.addProperty("NaN", function() {
  this.assert(
    isNaN2(flag2(this, "object")),
    "expected #{this} to be NaN",
    "expected #{this} not to be NaN"
  );
});
function assertExist() {
  let val = flag2(this, "object");
  this.assert(
    val !== null && val !== void 0,
    "expected #{this} to exist",
    "expected #{this} to not exist"
  );
}
__name(assertExist, "assertExist");
Assertion.addProperty("exist", assertExist);
Assertion.addProperty("exists", assertExist);
Assertion.addProperty("empty", function() {
  let val = flag2(this, "object"), ssfi = flag2(this, "ssfi"), flagMsg = flag2(this, "message"), itemsCount;
  flagMsg = flagMsg ? flagMsg + ": " : "";
  switch (type(val).toLowerCase()) {
    case "array":
    case "string":
      itemsCount = val.length;
      break;
    case "map":
    case "set":
      itemsCount = val.size;
      break;
    case "weakmap":
    case "weakset":
      throw new AssertionError(
        flagMsg + ".empty was passed a weak collection",
        void 0,
        ssfi
      );
    case "function": {
      const msg = flagMsg + ".empty was passed a function " + getName(val);
      throw new AssertionError(msg.trim(), void 0, ssfi);
    }
    default:
      if (val !== Object(val)) {
        throw new AssertionError(
          flagMsg + ".empty was passed non-string primitive " + inspect2(val),
          void 0,
          ssfi
        );
      }
      itemsCount = Object.keys(val).length;
  }
  this.assert(
    0 === itemsCount,
    "expected #{this} to be empty",
    "expected #{this} not to be empty"
  );
});
function checkArguments() {
  let obj = flag2(this, "object"), type3 = type(obj);
  this.assert(
    "Arguments" === type3,
    "expected #{this} to be arguments but got " + type3,
    "expected #{this} to not be arguments"
  );
}
__name(checkArguments, "checkArguments");
Assertion.addProperty("arguments", checkArguments);
Assertion.addProperty("Arguments", checkArguments);
function assertEqual(val, msg) {
  if (msg) flag2(this, "message", msg);
  let obj = flag2(this, "object");
  if (flag2(this, "deep")) {
    let prevLockSsfi = flag2(this, "lockSsfi");
    flag2(this, "lockSsfi", true);
    this.eql(val);
    flag2(this, "lockSsfi", prevLockSsfi);
  } else {
    this.assert(
      val === obj,
      "expected #{this} to equal #{exp}",
      "expected #{this} to not equal #{exp}",
      val,
      this._obj,
      true
    );
  }
}
__name(assertEqual, "assertEqual");
Assertion.addMethod("equal", assertEqual);
Assertion.addMethod("equals", assertEqual);
Assertion.addMethod("eq", assertEqual);
function assertEql(obj, msg) {
  if (msg) flag2(this, "message", msg);
  let eql = flag2(this, "eql");
  this.assert(
    eql(obj, flag2(this, "object")),
    "expected #{this} to deeply equal #{exp}",
    "expected #{this} to not deeply equal #{exp}",
    obj,
    this._obj,
    true
  );
}
__name(assertEql, "assertEql");
Assertion.addMethod("eql", assertEql);
Assertion.addMethod("eqls", assertEql);
function assertAbove(n, msg) {
  if (msg) flag2(this, "message", msg);
  let obj = flag2(this, "object"), doLength = flag2(this, "doLength"), flagMsg = flag2(this, "message"), msgPrefix = flagMsg ? flagMsg + ": " : "", ssfi = flag2(this, "ssfi"), objType = type(obj).toLowerCase(), nType = type(n).toLowerCase();
  if (doLength && objType !== "map" && objType !== "set") {
    new Assertion(obj, flagMsg, ssfi, true).to.have.property("length");
  }
  if (!doLength && objType === "date" && nType !== "date") {
    throw new AssertionError(
      msgPrefix + "the argument to above must be a date",
      void 0,
      ssfi
    );
  } else if (!isNumeric(n) && (doLength || isNumeric(obj))) {
    throw new AssertionError(
      msgPrefix + "the argument to above must be a number",
      void 0,
      ssfi
    );
  } else if (!doLength && objType !== "date" && !isNumeric(obj)) {
    let printObj = objType === "string" ? "'" + obj + "'" : obj;
    throw new AssertionError(
      msgPrefix + "expected " + printObj + " to be a number or a date",
      void 0,
      ssfi
    );
  }
  if (doLength) {
    let descriptor = "length", itemsCount;
    if (objType === "map" || objType === "set") {
      descriptor = "size";
      itemsCount = obj.size;
    } else {
      itemsCount = obj.length;
    }
    this.assert(
      itemsCount > n,
      "expected #{this} to have a " + descriptor + " above #{exp} but got #{act}",
      "expected #{this} to not have a " + descriptor + " above #{exp}",
      n,
      itemsCount
    );
  } else {
    this.assert(
      obj > n,
      "expected #{this} to be above #{exp}",
      "expected #{this} to be at most #{exp}",
      n
    );
  }
}
__name(assertAbove, "assertAbove");
Assertion.addMethod("above", assertAbove);
Assertion.addMethod("gt", assertAbove);
Assertion.addMethod("greaterThan", assertAbove);
function assertLeast(n, msg) {
  if (msg) flag2(this, "message", msg);
  let obj = flag2(this, "object"), doLength = flag2(this, "doLength"), flagMsg = flag2(this, "message"), msgPrefix = flagMsg ? flagMsg + ": " : "", ssfi = flag2(this, "ssfi"), objType = type(obj).toLowerCase(), nType = type(n).toLowerCase(), errorMessage, shouldThrow = true;
  if (doLength && objType !== "map" && objType !== "set") {
    new Assertion(obj, flagMsg, ssfi, true).to.have.property("length");
  }
  if (!doLength && objType === "date" && nType !== "date") {
    errorMessage = msgPrefix + "the argument to least must be a date";
  } else if (!isNumeric(n) && (doLength || isNumeric(obj))) {
    errorMessage = msgPrefix + "the argument to least must be a number";
  } else if (!doLength && objType !== "date" && !isNumeric(obj)) {
    let printObj = objType === "string" ? "'" + obj + "'" : obj;
    errorMessage = msgPrefix + "expected " + printObj + " to be a number or a date";
  } else {
    shouldThrow = false;
  }
  if (shouldThrow) {
    throw new AssertionError(errorMessage, void 0, ssfi);
  }
  if (doLength) {
    let descriptor = "length", itemsCount;
    if (objType === "map" || objType === "set") {
      descriptor = "size";
      itemsCount = obj.size;
    } else {
      itemsCount = obj.length;
    }
    this.assert(
      itemsCount >= n,
      "expected #{this} to have a " + descriptor + " at least #{exp} but got #{act}",
      "expected #{this} to have a " + descriptor + " below #{exp}",
      n,
      itemsCount
    );
  } else {
    this.assert(
      obj >= n,
      "expected #{this} to be at least #{exp}",
      "expected #{this} to be below #{exp}",
      n
    );
  }
}
__name(assertLeast, "assertLeast");
Assertion.addMethod("least", assertLeast);
Assertion.addMethod("gte", assertLeast);
Assertion.addMethod("greaterThanOrEqual", assertLeast);
function assertBelow(n, msg) {
  if (msg) flag2(this, "message", msg);
  let obj = flag2(this, "object"), doLength = flag2(this, "doLength"), flagMsg = flag2(this, "message"), msgPrefix = flagMsg ? flagMsg + ": " : "", ssfi = flag2(this, "ssfi"), objType = type(obj).toLowerCase(), nType = type(n).toLowerCase(), errorMessage, shouldThrow = true;
  if (doLength && objType !== "map" && objType !== "set") {
    new Assertion(obj, flagMsg, ssfi, true).to.have.property("length");
  }
  if (!doLength && objType === "date" && nType !== "date") {
    errorMessage = msgPrefix + "the argument to below must be a date";
  } else if (!isNumeric(n) && (doLength || isNumeric(obj))) {
    errorMessage = msgPrefix + "the argument to below must be a number";
  } else if (!doLength && objType !== "date" && !isNumeric(obj)) {
    let printObj = objType === "string" ? "'" + obj + "'" : obj;
    errorMessage = msgPrefix + "expected " + printObj + " to be a number or a date";
  } else {
    shouldThrow = false;
  }
  if (shouldThrow) {
    throw new AssertionError(errorMessage, void 0, ssfi);
  }
  if (doLength) {
    let descriptor = "length", itemsCount;
    if (objType === "map" || objType === "set") {
      descriptor = "size";
      itemsCount = obj.size;
    } else {
      itemsCount = obj.length;
    }
    this.assert(
      itemsCount < n,
      "expected #{this} to have a " + descriptor + " below #{exp} but got #{act}",
      "expected #{this} to not have a " + descriptor + " below #{exp}",
      n,
      itemsCount
    );
  } else {
    this.assert(
      obj < n,
      "expected #{this} to be below #{exp}",
      "expected #{this} to be at least #{exp}",
      n
    );
  }
}
__name(assertBelow, "assertBelow");
Assertion.addMethod("below", assertBelow);
Assertion.addMethod("lt", assertBelow);
Assertion.addMethod("lessThan", assertBelow);
function assertMost(n, msg) {
  if (msg) flag2(this, "message", msg);
  let obj = flag2(this, "object"), doLength = flag2(this, "doLength"), flagMsg = flag2(this, "message"), msgPrefix = flagMsg ? flagMsg + ": " : "", ssfi = flag2(this, "ssfi"), objType = type(obj).toLowerCase(), nType = type(n).toLowerCase(), errorMessage, shouldThrow = true;
  if (doLength && objType !== "map" && objType !== "set") {
    new Assertion(obj, flagMsg, ssfi, true).to.have.property("length");
  }
  if (!doLength && objType === "date" && nType !== "date") {
    errorMessage = msgPrefix + "the argument to most must be a date";
  } else if (!isNumeric(n) && (doLength || isNumeric(obj))) {
    errorMessage = msgPrefix + "the argument to most must be a number";
  } else if (!doLength && objType !== "date" && !isNumeric(obj)) {
    let printObj = objType === "string" ? "'" + obj + "'" : obj;
    errorMessage = msgPrefix + "expected " + printObj + " to be a number or a date";
  } else {
    shouldThrow = false;
  }
  if (shouldThrow) {
    throw new AssertionError(errorMessage, void 0, ssfi);
  }
  if (doLength) {
    let descriptor = "length", itemsCount;
    if (objType === "map" || objType === "set") {
      descriptor = "size";
      itemsCount = obj.size;
    } else {
      itemsCount = obj.length;
    }
    this.assert(
      itemsCount <= n,
      "expected #{this} to have a " + descriptor + " at most #{exp} but got #{act}",
      "expected #{this} to have a " + descriptor + " above #{exp}",
      n,
      itemsCount
    );
  } else {
    this.assert(
      obj <= n,
      "expected #{this} to be at most #{exp}",
      "expected #{this} to be above #{exp}",
      n
    );
  }
}
__name(assertMost, "assertMost");
Assertion.addMethod("most", assertMost);
Assertion.addMethod("lte", assertMost);
Assertion.addMethod("lessThanOrEqual", assertMost);
Assertion.addMethod("within", function(start, finish, msg) {
  if (msg) flag2(this, "message", msg);
  let obj = flag2(this, "object"), doLength = flag2(this, "doLength"), flagMsg = flag2(this, "message"), msgPrefix = flagMsg ? flagMsg + ": " : "", ssfi = flag2(this, "ssfi"), objType = type(obj).toLowerCase(), startType = type(start).toLowerCase(), finishType = type(finish).toLowerCase(), errorMessage, shouldThrow = true, range = startType === "date" && finishType === "date" ? start.toISOString() + ".." + finish.toISOString() : start + ".." + finish;
  if (doLength && objType !== "map" && objType !== "set") {
    new Assertion(obj, flagMsg, ssfi, true).to.have.property("length");
  }
  if (!doLength && objType === "date" && (startType !== "date" || finishType !== "date")) {
    errorMessage = msgPrefix + "the arguments to within must be dates";
  } else if ((!isNumeric(start) || !isNumeric(finish)) && (doLength || isNumeric(obj))) {
    errorMessage = msgPrefix + "the arguments to within must be numbers";
  } else if (!doLength && objType !== "date" && !isNumeric(obj)) {
    let printObj = objType === "string" ? "'" + obj + "'" : obj;
    errorMessage = msgPrefix + "expected " + printObj + " to be a number or a date";
  } else {
    shouldThrow = false;
  }
  if (shouldThrow) {
    throw new AssertionError(errorMessage, void 0, ssfi);
  }
  if (doLength) {
    let descriptor = "length", itemsCount;
    if (objType === "map" || objType === "set") {
      descriptor = "size";
      itemsCount = obj.size;
    } else {
      itemsCount = obj.length;
    }
    this.assert(
      itemsCount >= start && itemsCount <= finish,
      "expected #{this} to have a " + descriptor + " within " + range,
      "expected #{this} to not have a " + descriptor + " within " + range
    );
  } else {
    this.assert(
      obj >= start && obj <= finish,
      "expected #{this} to be within " + range,
      "expected #{this} to not be within " + range
    );
  }
});
function assertInstanceOf(constructor, msg) {
  if (msg) flag2(this, "message", msg);
  let target = flag2(this, "object");
  let ssfi = flag2(this, "ssfi");
  let flagMsg = flag2(this, "message");
  let isInstanceOf;
  try {
    isInstanceOf = target instanceof constructor;
  } catch (err) {
    if (err instanceof TypeError) {
      flagMsg = flagMsg ? flagMsg + ": " : "";
      throw new AssertionError(
        flagMsg + "The instanceof assertion needs a constructor but " + type(constructor) + " was given.",
        void 0,
        ssfi
      );
    }
    throw err;
  }
  let name = getName(constructor);
  if (name == null) {
    name = "an unnamed constructor";
  }
  this.assert(
    isInstanceOf,
    "expected #{this} to be an instance of " + name,
    "expected #{this} to not be an instance of " + name
  );
}
__name(assertInstanceOf, "assertInstanceOf");
Assertion.addMethod("instanceof", assertInstanceOf);
Assertion.addMethod("instanceOf", assertInstanceOf);
function assertProperty(name, val, msg) {
  if (msg) flag2(this, "message", msg);
  let isNested = flag2(this, "nested"), isOwn = flag2(this, "own"), flagMsg = flag2(this, "message"), obj = flag2(this, "object"), ssfi = flag2(this, "ssfi"), nameType = typeof name;
  flagMsg = flagMsg ? flagMsg + ": " : "";
  if (isNested) {
    if (nameType !== "string") {
      throw new AssertionError(
        flagMsg + "the argument to property must be a string when using nested syntax",
        void 0,
        ssfi
      );
    }
  } else {
    if (nameType !== "string" && nameType !== "number" && nameType !== "symbol") {
      throw new AssertionError(
        flagMsg + "the argument to property must be a string, number, or symbol",
        void 0,
        ssfi
      );
    }
  }
  if (isNested && isOwn) {
    throw new AssertionError(
      flagMsg + 'The "nested" and "own" flags cannot be combined.',
      void 0,
      ssfi
    );
  }
  if (obj === null || obj === void 0) {
    throw new AssertionError(
      flagMsg + "Target cannot be null or undefined.",
      void 0,
      ssfi
    );
  }
  let isDeep = flag2(this, "deep"), negate = flag2(this, "negate"), pathInfo = isNested ? getPathInfo(obj, name) : null, value = isNested ? pathInfo.value : obj[name], isEql = isDeep ? flag2(this, "eql") : (val1, val2) => val1 === val2;
  let descriptor = "";
  if (isDeep) descriptor += "deep ";
  if (isOwn) descriptor += "own ";
  if (isNested) descriptor += "nested ";
  descriptor += "property ";
  let hasProperty2;
  if (isOwn) hasProperty2 = Object.prototype.hasOwnProperty.call(obj, name);
  else if (isNested) hasProperty2 = pathInfo.exists;
  else hasProperty2 = hasProperty(obj, name);
  if (!negate || arguments.length === 1) {
    this.assert(
      hasProperty2,
      "expected #{this} to have " + descriptor + inspect2(name),
      "expected #{this} to not have " + descriptor + inspect2(name)
    );
  }
  if (arguments.length > 1) {
    this.assert(
      hasProperty2 && isEql(val, value),
      "expected #{this} to have " + descriptor + inspect2(name) + " of #{exp}, but got #{act}",
      "expected #{this} to not have " + descriptor + inspect2(name) + " of #{act}",
      val,
      value
    );
  }
  flag2(this, "object", value);
}
__name(assertProperty, "assertProperty");
Assertion.addMethod("property", assertProperty);
function assertOwnProperty(_name, _value, _msg) {
  flag2(this, "own", true);
  assertProperty.apply(this, arguments);
}
__name(assertOwnProperty, "assertOwnProperty");
Assertion.addMethod("ownProperty", assertOwnProperty);
Assertion.addMethod("haveOwnProperty", assertOwnProperty);
function assertOwnPropertyDescriptor(name, descriptor, msg) {
  if (typeof descriptor === "string") {
    msg = descriptor;
    descriptor = null;
  }
  if (msg) flag2(this, "message", msg);
  let obj = flag2(this, "object");
  let actualDescriptor = Object.getOwnPropertyDescriptor(Object(obj), name);
  let eql = flag2(this, "eql");
  if (actualDescriptor && descriptor) {
    this.assert(
      eql(descriptor, actualDescriptor),
      "expected the own property descriptor for " + inspect2(name) + " on #{this} to match " + inspect2(descriptor) + ", got " + inspect2(actualDescriptor),
      "expected the own property descriptor for " + inspect2(name) + " on #{this} to not match " + inspect2(descriptor),
      descriptor,
      actualDescriptor,
      true
    );
  } else {
    this.assert(
      actualDescriptor,
      "expected #{this} to have an own property descriptor for " + inspect2(name),
      "expected #{this} to not have an own property descriptor for " + inspect2(name)
    );
  }
  flag2(this, "object", actualDescriptor);
}
__name(assertOwnPropertyDescriptor, "assertOwnPropertyDescriptor");
Assertion.addMethod("ownPropertyDescriptor", assertOwnPropertyDescriptor);
Assertion.addMethod("haveOwnPropertyDescriptor", assertOwnPropertyDescriptor);
function assertLengthChain() {
  flag2(this, "doLength", true);
}
__name(assertLengthChain, "assertLengthChain");
function assertLength(n, msg) {
  if (msg) flag2(this, "message", msg);
  let obj = flag2(this, "object"), objType = type(obj).toLowerCase(), flagMsg = flag2(this, "message"), ssfi = flag2(this, "ssfi"), descriptor = "length", itemsCount;
  switch (objType) {
    case "map":
    case "set":
      descriptor = "size";
      itemsCount = obj.size;
      break;
    default:
      new Assertion(obj, flagMsg, ssfi, true).to.have.property("length");
      itemsCount = obj.length;
  }
  this.assert(
    itemsCount == n,
    "expected #{this} to have a " + descriptor + " of #{exp} but got #{act}",
    "expected #{this} to not have a " + descriptor + " of #{act}",
    n,
    itemsCount
  );
}
__name(assertLength, "assertLength");
Assertion.addChainableMethod("length", assertLength, assertLengthChain);
Assertion.addChainableMethod("lengthOf", assertLength, assertLengthChain);
function assertMatch(re, msg) {
  if (msg) flag2(this, "message", msg);
  let obj = flag2(this, "object");
  this.assert(
    re.exec(obj),
    "expected #{this} to match " + re,
    "expected #{this} not to match " + re
  );
}
__name(assertMatch, "assertMatch");
Assertion.addMethod("match", assertMatch);
Assertion.addMethod("matches", assertMatch);
Assertion.addMethod("string", function(str, msg) {
  if (msg) flag2(this, "message", msg);
  let obj = flag2(this, "object"), flagMsg = flag2(this, "message"), ssfi = flag2(this, "ssfi");
  new Assertion(obj, flagMsg, ssfi, true).is.a("string");
  this.assert(
    ~obj.indexOf(str),
    "expected #{this} to contain " + inspect2(str),
    "expected #{this} to not contain " + inspect2(str)
  );
});
function assertKeys(keys) {
  let obj = flag2(this, "object"), objType = type(obj), keysType = type(keys), ssfi = flag2(this, "ssfi"), isDeep = flag2(this, "deep"), str, deepStr = "", actual, ok = true, flagMsg = flag2(this, "message");
  flagMsg = flagMsg ? flagMsg + ": " : "";
  let mixedArgsMsg = flagMsg + "when testing keys against an object or an array you must give a single Array|Object|String argument or multiple String arguments";
  if (objType === "Map" || objType === "Set") {
    deepStr = isDeep ? "deeply " : "";
    actual = [];
    obj.forEach(function(val, key) {
      actual.push(key);
    });
    if (keysType !== "Array") {
      keys = Array.prototype.slice.call(arguments);
    }
  } else {
    actual = getOwnEnumerableProperties(obj);
    switch (keysType) {
      case "Array":
        if (arguments.length > 1) {
          throw new AssertionError(mixedArgsMsg, void 0, ssfi);
        }
        break;
      case "Object":
        if (arguments.length > 1) {
          throw new AssertionError(mixedArgsMsg, void 0, ssfi);
        }
        keys = Object.keys(keys);
        break;
      default:
        keys = Array.prototype.slice.call(arguments);
    }
    keys = keys.map(function(val) {
      return typeof val === "symbol" ? val : String(val);
    });
  }
  if (!keys.length) {
    throw new AssertionError(flagMsg + "keys required", void 0, ssfi);
  }
  let len = keys.length, any = flag2(this, "any"), all = flag2(this, "all"), expected = keys, isEql = isDeep ? flag2(this, "eql") : (val1, val2) => val1 === val2;
  if (!any && !all) {
    all = true;
  }
  if (any) {
    ok = expected.some(function(expectedKey) {
      return actual.some(function(actualKey) {
        return isEql(expectedKey, actualKey);
      });
    });
  }
  if (all) {
    ok = expected.every(function(expectedKey) {
      return actual.some(function(actualKey) {
        return isEql(expectedKey, actualKey);
      });
    });
    if (!flag2(this, "contains")) {
      ok = ok && keys.length == actual.length;
    }
  }
  if (len > 1) {
    keys = keys.map(function(key) {
      return inspect2(key);
    });
    let last = keys.pop();
    if (all) {
      str = keys.join(", ") + ", and " + last;
    }
    if (any) {
      str = keys.join(", ") + ", or " + last;
    }
  } else {
    str = inspect2(keys[0]);
  }
  str = (len > 1 ? "keys " : "key ") + str;
  str = (flag2(this, "contains") ? "contain " : "have ") + str;
  this.assert(
    ok,
    "expected #{this} to " + deepStr + str,
    "expected #{this} to not " + deepStr + str,
    expected.slice(0).sort(compareByInspect),
    actual.sort(compareByInspect),
    true
  );
}
__name(assertKeys, "assertKeys");
Assertion.addMethod("keys", assertKeys);
Assertion.addMethod("key", assertKeys);
function assertThrows(errorLike, errMsgMatcher, msg) {
  if (msg) flag2(this, "message", msg);
  let obj = flag2(this, "object"), ssfi = flag2(this, "ssfi"), flagMsg = flag2(this, "message"), negate = flag2(this, "negate") || false;
  new Assertion(obj, flagMsg, ssfi, true).is.a("function");
  if (isRegExp2(errorLike) || typeof errorLike === "string") {
    errMsgMatcher = errorLike;
    errorLike = null;
  }
  let caughtErr;
  let errorWasThrown = false;
  try {
    obj();
  } catch (err) {
    errorWasThrown = true;
    caughtErr = err;
  }
  let everyArgIsUndefined = errorLike === void 0 && errMsgMatcher === void 0;
  let everyArgIsDefined = Boolean(errorLike && errMsgMatcher);
  let errorLikeFail = false;
  let errMsgMatcherFail = false;
  if (everyArgIsUndefined || !everyArgIsUndefined && !negate) {
    let errorLikeString = "an error";
    if (errorLike instanceof Error) {
      errorLikeString = "#{exp}";
    } else if (errorLike) {
      errorLikeString = check_error_exports.getConstructorName(errorLike);
    }
    let actual = caughtErr;
    if (caughtErr instanceof Error) {
      actual = caughtErr.toString();
    } else if (typeof caughtErr === "string") {
      actual = caughtErr;
    } else if (caughtErr && (typeof caughtErr === "object" || typeof caughtErr === "function")) {
      try {
        actual = check_error_exports.getConstructorName(caughtErr);
      } catch (_err) {
      }
    }
    this.assert(
      errorWasThrown,
      "expected #{this} to throw " + errorLikeString,
      "expected #{this} to not throw an error but #{act} was thrown",
      errorLike && errorLike.toString(),
      actual
    );
  }
  if (errorLike && caughtErr) {
    if (errorLike instanceof Error) {
      let isCompatibleInstance = check_error_exports.compatibleInstance(
        caughtErr,
        errorLike
      );
      if (isCompatibleInstance === negate) {
        if (everyArgIsDefined && negate) {
          errorLikeFail = true;
        } else {
          this.assert(
            negate,
            "expected #{this} to throw #{exp} but #{act} was thrown",
            "expected #{this} to not throw #{exp}" + (caughtErr && !negate ? " but #{act} was thrown" : ""),
            errorLike.toString(),
            caughtErr.toString()
          );
        }
      }
    }
    let isCompatibleConstructor = check_error_exports.compatibleConstructor(
      caughtErr,
      errorLike
    );
    if (isCompatibleConstructor === negate) {
      if (everyArgIsDefined && negate) {
        errorLikeFail = true;
      } else {
        this.assert(
          negate,
          "expected #{this} to throw #{exp} but #{act} was thrown",
          "expected #{this} to not throw #{exp}" + (caughtErr ? " but #{act} was thrown" : ""),
          errorLike instanceof Error ? errorLike.toString() : errorLike && check_error_exports.getConstructorName(errorLike),
          caughtErr instanceof Error ? caughtErr.toString() : caughtErr && check_error_exports.getConstructorName(caughtErr)
        );
      }
    }
  }
  if (caughtErr && errMsgMatcher !== void 0 && errMsgMatcher !== null) {
    let placeholder = "including";
    if (isRegExp2(errMsgMatcher)) {
      placeholder = "matching";
    }
    let isCompatibleMessage = check_error_exports.compatibleMessage(
      caughtErr,
      errMsgMatcher
    );
    if (isCompatibleMessage === negate) {
      if (everyArgIsDefined && negate) {
        errMsgMatcherFail = true;
      } else {
        this.assert(
          negate,
          "expected #{this} to throw error " + placeholder + " #{exp} but got #{act}",
          "expected #{this} to throw error not " + placeholder + " #{exp}",
          errMsgMatcher,
          check_error_exports.getMessage(caughtErr)
        );
      }
    }
  }
  if (errorLikeFail && errMsgMatcherFail) {
    this.assert(
      negate,
      "expected #{this} to throw #{exp} but #{act} was thrown",
      "expected #{this} to not throw #{exp}" + (caughtErr ? " but #{act} was thrown" : ""),
      errorLike instanceof Error ? errorLike.toString() : errorLike && check_error_exports.getConstructorName(errorLike),
      caughtErr instanceof Error ? caughtErr.toString() : caughtErr && check_error_exports.getConstructorName(caughtErr)
    );
  }
  flag2(this, "object", caughtErr);
}
__name(assertThrows, "assertThrows");
Assertion.addMethod("throw", assertThrows);
Assertion.addMethod("throws", assertThrows);
Assertion.addMethod("Throw", assertThrows);
function respondTo(method, msg) {
  if (msg) flag2(this, "message", msg);
  let obj = flag2(this, "object"), itself = flag2(this, "itself"), context = "function" === typeof obj && !itself ? obj.prototype[method] : obj[method];
  this.assert(
    "function" === typeof context,
    "expected #{this} to respond to " + inspect2(method),
    "expected #{this} to not respond to " + inspect2(method)
  );
}
__name(respondTo, "respondTo");
Assertion.addMethod("respondTo", respondTo);
Assertion.addMethod("respondsTo", respondTo);
Assertion.addProperty("itself", function() {
  flag2(this, "itself", true);
});
function satisfy(matcher, msg) {
  if (msg) flag2(this, "message", msg);
  let obj = flag2(this, "object");
  let result = matcher(obj);
  this.assert(
    result,
    "expected #{this} to satisfy " + objDisplay(matcher),
    "expected #{this} to not satisfy" + objDisplay(matcher),
    flag2(this, "negate") ? false : true,
    result
  );
}
__name(satisfy, "satisfy");
Assertion.addMethod("satisfy", satisfy);
Assertion.addMethod("satisfies", satisfy);
function closeTo(expected, delta, msg) {
  if (msg) flag2(this, "message", msg);
  let obj = flag2(this, "object"), flagMsg = flag2(this, "message"), ssfi = flag2(this, "ssfi");
  new Assertion(obj, flagMsg, ssfi, true).is.numeric;
  let message = "A `delta` value is required for `closeTo`";
  if (delta == void 0) {
    throw new AssertionError(
      flagMsg ? `${flagMsg}: ${message}` : message,
      void 0,
      ssfi
    );
  }
  new Assertion(delta, flagMsg, ssfi, true).is.numeric;
  message = "A `expected` value is required for `closeTo`";
  if (expected == void 0) {
    throw new AssertionError(
      flagMsg ? `${flagMsg}: ${message}` : message,
      void 0,
      ssfi
    );
  }
  new Assertion(expected, flagMsg, ssfi, true).is.numeric;
  const abs = /* @__PURE__ */ __name((x) => x < 0n ? -x : x, "abs");
  const strip = /* @__PURE__ */ __name((number) => parseFloat(parseFloat(number).toPrecision(12)), "strip");
  this.assert(
    strip(abs(obj - expected)) <= delta,
    "expected #{this} to be close to " + expected + " +/- " + delta,
    "expected #{this} not to be close to " + expected + " +/- " + delta
  );
}
__name(closeTo, "closeTo");
Assertion.addMethod("closeTo", closeTo);
Assertion.addMethod("approximately", closeTo);
function isSubsetOf(_subset, _superset, cmp, contains, ordered) {
  let superset = Array.from(_superset);
  let subset = Array.from(_subset);
  if (!contains) {
    if (subset.length !== superset.length) return false;
    superset = superset.slice();
  }
  return subset.every(function(elem, idx) {
    if (ordered) return cmp ? cmp(elem, superset[idx]) : elem === superset[idx];
    if (!cmp) {
      let matchIdx = superset.indexOf(elem);
      if (matchIdx === -1) return false;
      if (!contains) superset.splice(matchIdx, 1);
      return true;
    }
    return superset.some(function(elem2, matchIdx) {
      if (!cmp(elem, elem2)) return false;
      if (!contains) superset.splice(matchIdx, 1);
      return true;
    });
  });
}
__name(isSubsetOf, "isSubsetOf");
Assertion.addMethod("members", function(subset, msg) {
  if (msg) flag2(this, "message", msg);
  let obj = flag2(this, "object"), flagMsg = flag2(this, "message"), ssfi = flag2(this, "ssfi");
  new Assertion(obj, flagMsg, ssfi, true).to.be.iterable;
  new Assertion(subset, flagMsg, ssfi, true).to.be.iterable;
  let contains = flag2(this, "contains");
  let ordered = flag2(this, "ordered");
  let subject, failMsg, failNegateMsg;
  if (contains) {
    subject = ordered ? "an ordered superset" : "a superset";
    failMsg = "expected #{this} to be " + subject + " of #{exp}";
    failNegateMsg = "expected #{this} to not be " + subject + " of #{exp}";
  } else {
    subject = ordered ? "ordered members" : "members";
    failMsg = "expected #{this} to have the same " + subject + " as #{exp}";
    failNegateMsg = "expected #{this} to not have the same " + subject + " as #{exp}";
  }
  let cmp = flag2(this, "deep") ? flag2(this, "eql") : void 0;
  this.assert(
    isSubsetOf(subset, obj, cmp, contains, ordered),
    failMsg,
    failNegateMsg,
    subset,
    obj,
    true
  );
});
Assertion.addProperty("iterable", function(msg) {
  if (msg) flag2(this, "message", msg);
  let obj = flag2(this, "object");
  this.assert(
    obj != void 0 && obj[Symbol.iterator],
    "expected #{this} to be an iterable",
    "expected #{this} to not be an iterable",
    obj
  );
});
function oneOf(list, msg) {
  if (msg) flag2(this, "message", msg);
  let expected = flag2(this, "object"), flagMsg = flag2(this, "message"), ssfi = flag2(this, "ssfi"), contains = flag2(this, "contains"), isDeep = flag2(this, "deep"), eql = flag2(this, "eql");
  new Assertion(list, flagMsg, ssfi, true).to.be.an("array");
  if (contains) {
    this.assert(
      list.some(function(possibility) {
        return expected.indexOf(possibility) > -1;
      }),
      "expected #{this} to contain one of #{exp}",
      "expected #{this} to not contain one of #{exp}",
      list,
      expected
    );
  } else {
    if (isDeep) {
      this.assert(
        list.some(function(possibility) {
          return eql(expected, possibility);
        }),
        "expected #{this} to deeply equal one of #{exp}",
        "expected #{this} to deeply equal one of #{exp}",
        list,
        expected
      );
    } else {
      this.assert(
        list.indexOf(expected) > -1,
        "expected #{this} to be one of #{exp}",
        "expected #{this} to not be one of #{exp}",
        list,
        expected
      );
    }
  }
}
__name(oneOf, "oneOf");
Assertion.addMethod("oneOf", oneOf);
function assertChanges(subject, prop, msg) {
  if (msg) flag2(this, "message", msg);
  let fn = flag2(this, "object"), flagMsg = flag2(this, "message"), ssfi = flag2(this, "ssfi");
  new Assertion(fn, flagMsg, ssfi, true).is.a("function");
  let initial;
  if (!prop) {
    new Assertion(subject, flagMsg, ssfi, true).is.a("function");
    initial = subject();
  } else {
    new Assertion(subject, flagMsg, ssfi, true).to.have.property(prop);
    initial = subject[prop];
  }
  fn();
  let final = prop === void 0 || prop === null ? subject() : subject[prop];
  let msgObj = prop === void 0 || prop === null ? initial : "." + prop;
  flag2(this, "deltaMsgObj", msgObj);
  flag2(this, "initialDeltaValue", initial);
  flag2(this, "finalDeltaValue", final);
  flag2(this, "deltaBehavior", "change");
  flag2(this, "realDelta", final !== initial);
  this.assert(
    initial !== final,
    "expected " + msgObj + " to change",
    "expected " + msgObj + " to not change"
  );
}
__name(assertChanges, "assertChanges");
Assertion.addMethod("change", assertChanges);
Assertion.addMethod("changes", assertChanges);
function assertIncreases(subject, prop, msg) {
  if (msg) flag2(this, "message", msg);
  let fn = flag2(this, "object"), flagMsg = flag2(this, "message"), ssfi = flag2(this, "ssfi");
  new Assertion(fn, flagMsg, ssfi, true).is.a("function");
  let initial;
  if (!prop) {
    new Assertion(subject, flagMsg, ssfi, true).is.a("function");
    initial = subject();
  } else {
    new Assertion(subject, flagMsg, ssfi, true).to.have.property(prop);
    initial = subject[prop];
  }
  new Assertion(initial, flagMsg, ssfi, true).is.a("number");
  fn();
  let final = prop === void 0 || prop === null ? subject() : subject[prop];
  let msgObj = prop === void 0 || prop === null ? initial : "." + prop;
  flag2(this, "deltaMsgObj", msgObj);
  flag2(this, "initialDeltaValue", initial);
  flag2(this, "finalDeltaValue", final);
  flag2(this, "deltaBehavior", "increase");
  flag2(this, "realDelta", final - initial);
  this.assert(
    final - initial > 0,
    "expected " + msgObj + " to increase",
    "expected " + msgObj + " to not increase"
  );
}
__name(assertIncreases, "assertIncreases");
Assertion.addMethod("increase", assertIncreases);
Assertion.addMethod("increases", assertIncreases);
function assertDecreases(subject, prop, msg) {
  if (msg) flag2(this, "message", msg);
  let fn = flag2(this, "object"), flagMsg = flag2(this, "message"), ssfi = flag2(this, "ssfi");
  new Assertion(fn, flagMsg, ssfi, true).is.a("function");
  let initial;
  if (!prop) {
    new Assertion(subject, flagMsg, ssfi, true).is.a("function");
    initial = subject();
  } else {
    new Assertion(subject, flagMsg, ssfi, true).to.have.property(prop);
    initial = subject[prop];
  }
  new Assertion(initial, flagMsg, ssfi, true).is.a("number");
  fn();
  let final = prop === void 0 || prop === null ? subject() : subject[prop];
  let msgObj = prop === void 0 || prop === null ? initial : "." + prop;
  flag2(this, "deltaMsgObj", msgObj);
  flag2(this, "initialDeltaValue", initial);
  flag2(this, "finalDeltaValue", final);
  flag2(this, "deltaBehavior", "decrease");
  flag2(this, "realDelta", initial - final);
  this.assert(
    final - initial < 0,
    "expected " + msgObj + " to decrease",
    "expected " + msgObj + " to not decrease"
  );
}
__name(assertDecreases, "assertDecreases");
Assertion.addMethod("decrease", assertDecreases);
Assertion.addMethod("decreases", assertDecreases);
function assertDelta(delta, msg) {
  if (msg) flag2(this, "message", msg);
  let msgObj = flag2(this, "deltaMsgObj");
  let initial = flag2(this, "initialDeltaValue");
  let final = flag2(this, "finalDeltaValue");
  let behavior = flag2(this, "deltaBehavior");
  let realDelta = flag2(this, "realDelta");
  let expression;
  if (behavior === "change") {
    expression = Math.abs(final - initial) === Math.abs(delta);
  } else {
    expression = realDelta === Math.abs(delta);
  }
  this.assert(
    expression,
    "expected " + msgObj + " to " + behavior + " by " + delta,
    "expected " + msgObj + " to not " + behavior + " by " + delta
  );
}
__name(assertDelta, "assertDelta");
Assertion.addMethod("by", assertDelta);
Assertion.addProperty("extensible", function() {
  let obj = flag2(this, "object");
  let isExtensible = obj === Object(obj) && Object.isExtensible(obj);
  this.assert(
    isExtensible,
    "expected #{this} to be extensible",
    "expected #{this} to not be extensible"
  );
});
Assertion.addProperty("sealed", function() {
  let obj = flag2(this, "object");
  let isSealed = obj === Object(obj) ? Object.isSealed(obj) : true;
  this.assert(
    isSealed,
    "expected #{this} to be sealed",
    "expected #{this} to not be sealed"
  );
});
Assertion.addProperty("frozen", function() {
  let obj = flag2(this, "object");
  let isFrozen = obj === Object(obj) ? Object.isFrozen(obj) : true;
  this.assert(
    isFrozen,
    "expected #{this} to be frozen",
    "expected #{this} to not be frozen"
  );
});
Assertion.addProperty("finite", function(_msg) {
  let obj = flag2(this, "object");
  this.assert(
    typeof obj === "number" && isFinite(obj),
    "expected #{this} to be a finite number",
    "expected #{this} to not be a finite number"
  );
});
function compareSubset(expected, actual) {
  if (expected === actual) {
    return true;
  }
  if (typeof actual !== typeof expected) {
    return false;
  }
  if (typeof expected !== "object" || expected === null) {
    return expected === actual;
  }
  if (!actual) {
    return false;
  }
  if (Array.isArray(expected)) {
    if (!Array.isArray(actual)) {
      return false;
    }
    return expected.every(function(exp) {
      return actual.some(function(act) {
        return compareSubset(exp, act);
      });
    });
  }
  if (expected instanceof Date) {
    if (actual instanceof Date) {
      return expected.getTime() === actual.getTime();
    } else {
      return false;
    }
  }
  return Object.keys(expected).every(function(key) {
    let expectedValue = expected[key];
    let actualValue = actual[key];
    if (typeof expectedValue === "object" && expectedValue !== null && actualValue !== null) {
      return compareSubset(expectedValue, actualValue);
    }
    if (typeof expectedValue === "function") {
      return expectedValue(actualValue);
    }
    return actualValue === expectedValue;
  });
}
__name(compareSubset, "compareSubset");
Assertion.addMethod("containSubset", function(expected) {
  const actual = flag(this, "object");
  const showDiff = config.showDiff;
  this.assert(
    compareSubset(expected, actual),
    "expected #{act} to contain subset #{exp}",
    "expected #{act} to not contain subset #{exp}",
    expected,
    actual,
    showDiff
  );
});
function expect(val, message) {
  return new Assertion(val, message);
}
__name(expect, "expect");
expect.fail = function(actual, expected, message, operator) {
  if (arguments.length < 2) {
    message = actual;
    actual = void 0;
  }
  message = message || "expect.fail()";
  throw new AssertionError(
    message,
    {
      actual,
      expected,
      operator
    },
    expect.fail
  );
};
var should_exports = {};
__export(should_exports, {
  Should: () => Should,
  should: () => should
});
function loadShould() {
  function shouldGetter() {
    if (this instanceof String || this instanceof Number || this instanceof Boolean || typeof Symbol === "function" && this instanceof Symbol || typeof BigInt === "function" && this instanceof BigInt) {
      return new Assertion(this.valueOf(), null, shouldGetter);
    }
    return new Assertion(this, null, shouldGetter);
  }
  __name(shouldGetter, "shouldGetter");
  function shouldSetter(value) {
    Object.defineProperty(this, "should", {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  }
  __name(shouldSetter, "shouldSetter");
  Object.defineProperty(Object.prototype, "should", {
    set: shouldSetter,
    get: shouldGetter,
    configurable: true
  });
  let should2 = {};
  should2.fail = function(actual, expected, message, operator) {
    if (arguments.length < 2) {
      message = actual;
      actual = void 0;
    }
    message = message || "should.fail()";
    throw new AssertionError(
      message,
      {
        actual,
        expected,
        operator
      },
      should2.fail
    );
  };
  should2.equal = function(actual, expected, message) {
    new Assertion(actual, message).to.equal(expected);
  };
  should2.Throw = function(fn, errt, errs, msg) {
    new Assertion(fn, msg).to.Throw(errt, errs);
  };
  should2.exist = function(val, msg) {
    new Assertion(val, msg).to.exist;
  };
  should2.not = {};
  should2.not.equal = function(actual, expected, msg) {
    new Assertion(actual, msg).to.not.equal(expected);
  };
  should2.not.Throw = function(fn, errt, errs, msg) {
    new Assertion(fn, msg).to.not.Throw(errt, errs);
  };
  should2.not.exist = function(val, msg) {
    new Assertion(val, msg).to.not.exist;
  };
  should2["throw"] = should2["Throw"];
  should2.not["throw"] = should2.not["Throw"];
  return should2;
}
__name(loadShould, "loadShould");
var should = loadShould;
var Should = loadShould;
function assert(express, errmsg) {
  let test2 = new Assertion(null, null, assert, true);
  test2.assert(express, errmsg, "[ negation message unavailable ]");
}
__name(assert, "assert");
assert.fail = function(actual, expected, message, operator) {
  if (arguments.length < 2) {
    message = actual;
    actual = void 0;
  }
  message = message || "assert.fail()";
  throw new AssertionError(
    message,
    {
      actual,
      expected,
      operator
    },
    assert.fail
  );
};
assert.isOk = function(val, msg) {
  new Assertion(val, msg, assert.isOk, true).is.ok;
};
assert.isNotOk = function(val, msg) {
  new Assertion(val, msg, assert.isNotOk, true).is.not.ok;
};
assert.equal = function(act, exp, msg) {
  let test2 = new Assertion(act, msg, assert.equal, true);
  test2.assert(
    exp == flag(test2, "object"),
    "expected #{this} to equal #{exp}",
    "expected #{this} to not equal #{act}",
    exp,
    act,
    true
  );
};
assert.notEqual = function(act, exp, msg) {
  let test2 = new Assertion(act, msg, assert.notEqual, true);
  test2.assert(
    exp != flag(test2, "object"),
    "expected #{this} to not equal #{exp}",
    "expected #{this} to equal #{act}",
    exp,
    act,
    true
  );
};
assert.strictEqual = function(act, exp, msg) {
  new Assertion(act, msg, assert.strictEqual, true).to.equal(exp);
};
assert.notStrictEqual = function(act, exp, msg) {
  new Assertion(act, msg, assert.notStrictEqual, true).to.not.equal(exp);
};
assert.deepEqual = assert.deepStrictEqual = function(act, exp, msg) {
  new Assertion(act, msg, assert.deepEqual, true).to.eql(exp);
};
assert.notDeepEqual = function(act, exp, msg) {
  new Assertion(act, msg, assert.notDeepEqual, true).to.not.eql(exp);
};
assert.isAbove = function(val, abv, msg) {
  new Assertion(val, msg, assert.isAbove, true).to.be.above(abv);
};
assert.isAtLeast = function(val, atlst, msg) {
  new Assertion(val, msg, assert.isAtLeast, true).to.be.least(atlst);
};
assert.isBelow = function(val, blw, msg) {
  new Assertion(val, msg, assert.isBelow, true).to.be.below(blw);
};
assert.isAtMost = function(val, atmst, msg) {
  new Assertion(val, msg, assert.isAtMost, true).to.be.most(atmst);
};
assert.isTrue = function(val, msg) {
  new Assertion(val, msg, assert.isTrue, true).is["true"];
};
assert.isNotTrue = function(val, msg) {
  new Assertion(val, msg, assert.isNotTrue, true).to.not.equal(true);
};
assert.isFalse = function(val, msg) {
  new Assertion(val, msg, assert.isFalse, true).is["false"];
};
assert.isNotFalse = function(val, msg) {
  new Assertion(val, msg, assert.isNotFalse, true).to.not.equal(false);
};
assert.isNull = function(val, msg) {
  new Assertion(val, msg, assert.isNull, true).to.equal(null);
};
assert.isNotNull = function(val, msg) {
  new Assertion(val, msg, assert.isNotNull, true).to.not.equal(null);
};
assert.isNaN = function(val, msg) {
  new Assertion(val, msg, assert.isNaN, true).to.be.NaN;
};
assert.isNotNaN = function(value, message) {
  new Assertion(value, message, assert.isNotNaN, true).not.to.be.NaN;
};
assert.exists = function(val, msg) {
  new Assertion(val, msg, assert.exists, true).to.exist;
};
assert.notExists = function(val, msg) {
  new Assertion(val, msg, assert.notExists, true).to.not.exist;
};
assert.isUndefined = function(val, msg) {
  new Assertion(val, msg, assert.isUndefined, true).to.equal(void 0);
};
assert.isDefined = function(val, msg) {
  new Assertion(val, msg, assert.isDefined, true).to.not.equal(void 0);
};
assert.isCallable = function(value, message) {
  new Assertion(value, message, assert.isCallable, true).is.callable;
};
assert.isNotCallable = function(value, message) {
  new Assertion(value, message, assert.isNotCallable, true).is.not.callable;
};
assert.isObject = function(val, msg) {
  new Assertion(val, msg, assert.isObject, true).to.be.a("object");
};
assert.isNotObject = function(val, msg) {
  new Assertion(val, msg, assert.isNotObject, true).to.not.be.a("object");
};
assert.isArray = function(val, msg) {
  new Assertion(val, msg, assert.isArray, true).to.be.an("array");
};
assert.isNotArray = function(val, msg) {
  new Assertion(val, msg, assert.isNotArray, true).to.not.be.an("array");
};
assert.isString = function(val, msg) {
  new Assertion(val, msg, assert.isString, true).to.be.a("string");
};
assert.isNotString = function(val, msg) {
  new Assertion(val, msg, assert.isNotString, true).to.not.be.a("string");
};
assert.isNumber = function(val, msg) {
  new Assertion(val, msg, assert.isNumber, true).to.be.a("number");
};
assert.isNotNumber = function(val, msg) {
  new Assertion(val, msg, assert.isNotNumber, true).to.not.be.a("number");
};
assert.isNumeric = function(val, msg) {
  new Assertion(val, msg, assert.isNumeric, true).is.numeric;
};
assert.isNotNumeric = function(val, msg) {
  new Assertion(val, msg, assert.isNotNumeric, true).is.not.numeric;
};
assert.isFinite = function(val, msg) {
  new Assertion(val, msg, assert.isFinite, true).to.be.finite;
};
assert.isBoolean = function(val, msg) {
  new Assertion(val, msg, assert.isBoolean, true).to.be.a("boolean");
};
assert.isNotBoolean = function(val, msg) {
  new Assertion(val, msg, assert.isNotBoolean, true).to.not.be.a("boolean");
};
assert.typeOf = function(val, type3, msg) {
  new Assertion(val, msg, assert.typeOf, true).to.be.a(type3);
};
assert.notTypeOf = function(value, type3, message) {
  new Assertion(value, message, assert.notTypeOf, true).to.not.be.a(type3);
};
assert.instanceOf = function(val, type3, msg) {
  new Assertion(val, msg, assert.instanceOf, true).to.be.instanceOf(type3);
};
assert.notInstanceOf = function(val, type3, msg) {
  new Assertion(val, msg, assert.notInstanceOf, true).to.not.be.instanceOf(
    type3
  );
};
assert.include = function(exp, inc, msg) {
  new Assertion(exp, msg, assert.include, true).include(inc);
};
assert.notInclude = function(exp, inc, msg) {
  new Assertion(exp, msg, assert.notInclude, true).not.include(inc);
};
assert.deepInclude = function(exp, inc, msg) {
  new Assertion(exp, msg, assert.deepInclude, true).deep.include(inc);
};
assert.notDeepInclude = function(exp, inc, msg) {
  new Assertion(exp, msg, assert.notDeepInclude, true).not.deep.include(inc);
};
assert.nestedInclude = function(exp, inc, msg) {
  new Assertion(exp, msg, assert.nestedInclude, true).nested.include(inc);
};
assert.notNestedInclude = function(exp, inc, msg) {
  new Assertion(exp, msg, assert.notNestedInclude, true).not.nested.include(
    inc
  );
};
assert.deepNestedInclude = function(exp, inc, msg) {
  new Assertion(exp, msg, assert.deepNestedInclude, true).deep.nested.include(
    inc
  );
};
assert.notDeepNestedInclude = function(exp, inc, msg) {
  new Assertion(
    exp,
    msg,
    assert.notDeepNestedInclude,
    true
  ).not.deep.nested.include(inc);
};
assert.ownInclude = function(exp, inc, msg) {
  new Assertion(exp, msg, assert.ownInclude, true).own.include(inc);
};
assert.notOwnInclude = function(exp, inc, msg) {
  new Assertion(exp, msg, assert.notOwnInclude, true).not.own.include(inc);
};
assert.deepOwnInclude = function(exp, inc, msg) {
  new Assertion(exp, msg, assert.deepOwnInclude, true).deep.own.include(inc);
};
assert.notDeepOwnInclude = function(exp, inc, msg) {
  new Assertion(exp, msg, assert.notDeepOwnInclude, true).not.deep.own.include(
    inc
  );
};
assert.match = function(exp, re, msg) {
  new Assertion(exp, msg, assert.match, true).to.match(re);
};
assert.notMatch = function(exp, re, msg) {
  new Assertion(exp, msg, assert.notMatch, true).to.not.match(re);
};
assert.property = function(obj, prop, msg) {
  new Assertion(obj, msg, assert.property, true).to.have.property(prop);
};
assert.notProperty = function(obj, prop, msg) {
  new Assertion(obj, msg, assert.notProperty, true).to.not.have.property(prop);
};
assert.propertyVal = function(obj, prop, val, msg) {
  new Assertion(obj, msg, assert.propertyVal, true).to.have.property(prop, val);
};
assert.notPropertyVal = function(obj, prop, val, msg) {
  new Assertion(obj, msg, assert.notPropertyVal, true).to.not.have.property(
    prop,
    val
  );
};
assert.deepPropertyVal = function(obj, prop, val, msg) {
  new Assertion(obj, msg, assert.deepPropertyVal, true).to.have.deep.property(
    prop,
    val
  );
};
assert.notDeepPropertyVal = function(obj, prop, val, msg) {
  new Assertion(
    obj,
    msg,
    assert.notDeepPropertyVal,
    true
  ).to.not.have.deep.property(prop, val);
};
assert.ownProperty = function(obj, prop, msg) {
  new Assertion(obj, msg, assert.ownProperty, true).to.have.own.property(prop);
};
assert.notOwnProperty = function(obj, prop, msg) {
  new Assertion(obj, msg, assert.notOwnProperty, true).to.not.have.own.property(
    prop
  );
};
assert.ownPropertyVal = function(obj, prop, value, msg) {
  new Assertion(obj, msg, assert.ownPropertyVal, true).to.have.own.property(
    prop,
    value
  );
};
assert.notOwnPropertyVal = function(obj, prop, value, msg) {
  new Assertion(
    obj,
    msg,
    assert.notOwnPropertyVal,
    true
  ).to.not.have.own.property(prop, value);
};
assert.deepOwnPropertyVal = function(obj, prop, value, msg) {
  new Assertion(
    obj,
    msg,
    assert.deepOwnPropertyVal,
    true
  ).to.have.deep.own.property(prop, value);
};
assert.notDeepOwnPropertyVal = function(obj, prop, value, msg) {
  new Assertion(
    obj,
    msg,
    assert.notDeepOwnPropertyVal,
    true
  ).to.not.have.deep.own.property(prop, value);
};
assert.nestedProperty = function(obj, prop, msg) {
  new Assertion(obj, msg, assert.nestedProperty, true).to.have.nested.property(
    prop
  );
};
assert.notNestedProperty = function(obj, prop, msg) {
  new Assertion(
    obj,
    msg,
    assert.notNestedProperty,
    true
  ).to.not.have.nested.property(prop);
};
assert.nestedPropertyVal = function(obj, prop, val, msg) {
  new Assertion(
    obj,
    msg,
    assert.nestedPropertyVal,
    true
  ).to.have.nested.property(prop, val);
};
assert.notNestedPropertyVal = function(obj, prop, val, msg) {
  new Assertion(
    obj,
    msg,
    assert.notNestedPropertyVal,
    true
  ).to.not.have.nested.property(prop, val);
};
assert.deepNestedPropertyVal = function(obj, prop, val, msg) {
  new Assertion(
    obj,
    msg,
    assert.deepNestedPropertyVal,
    true
  ).to.have.deep.nested.property(prop, val);
};
assert.notDeepNestedPropertyVal = function(obj, prop, val, msg) {
  new Assertion(
    obj,
    msg,
    assert.notDeepNestedPropertyVal,
    true
  ).to.not.have.deep.nested.property(prop, val);
};
assert.lengthOf = function(exp, len, msg) {
  new Assertion(exp, msg, assert.lengthOf, true).to.have.lengthOf(len);
};
assert.hasAnyKeys = function(obj, keys, msg) {
  new Assertion(obj, msg, assert.hasAnyKeys, true).to.have.any.keys(keys);
};
assert.hasAllKeys = function(obj, keys, msg) {
  new Assertion(obj, msg, assert.hasAllKeys, true).to.have.all.keys(keys);
};
assert.containsAllKeys = function(obj, keys, msg) {
  new Assertion(obj, msg, assert.containsAllKeys, true).to.contain.all.keys(
    keys
  );
};
assert.doesNotHaveAnyKeys = function(obj, keys, msg) {
  new Assertion(obj, msg, assert.doesNotHaveAnyKeys, true).to.not.have.any.keys(
    keys
  );
};
assert.doesNotHaveAllKeys = function(obj, keys, msg) {
  new Assertion(obj, msg, assert.doesNotHaveAllKeys, true).to.not.have.all.keys(
    keys
  );
};
assert.hasAnyDeepKeys = function(obj, keys, msg) {
  new Assertion(obj, msg, assert.hasAnyDeepKeys, true).to.have.any.deep.keys(
    keys
  );
};
assert.hasAllDeepKeys = function(obj, keys, msg) {
  new Assertion(obj, msg, assert.hasAllDeepKeys, true).to.have.all.deep.keys(
    keys
  );
};
assert.containsAllDeepKeys = function(obj, keys, msg) {
  new Assertion(
    obj,
    msg,
    assert.containsAllDeepKeys,
    true
  ).to.contain.all.deep.keys(keys);
};
assert.doesNotHaveAnyDeepKeys = function(obj, keys, msg) {
  new Assertion(
    obj,
    msg,
    assert.doesNotHaveAnyDeepKeys,
    true
  ).to.not.have.any.deep.keys(keys);
};
assert.doesNotHaveAllDeepKeys = function(obj, keys, msg) {
  new Assertion(
    obj,
    msg,
    assert.doesNotHaveAllDeepKeys,
    true
  ).to.not.have.all.deep.keys(keys);
};
assert.throws = function(fn, errorLike, errMsgMatcher, msg) {
  if ("string" === typeof errorLike || errorLike instanceof RegExp) {
    errMsgMatcher = errorLike;
    errorLike = null;
  }
  let assertErr = new Assertion(fn, msg, assert.throws, true).to.throw(
    errorLike,
    errMsgMatcher
  );
  return flag(assertErr, "object");
};
assert.doesNotThrow = function(fn, errorLike, errMsgMatcher, message) {
  if ("string" === typeof errorLike || errorLike instanceof RegExp) {
    errMsgMatcher = errorLike;
    errorLike = null;
  }
  new Assertion(fn, message, assert.doesNotThrow, true).to.not.throw(
    errorLike,
    errMsgMatcher
  );
};
assert.operator = function(val, operator, val2, msg) {
  let ok;
  switch (operator) {
    case "==":
      ok = val == val2;
      break;
    case "===":
      ok = val === val2;
      break;
    case ">":
      ok = val > val2;
      break;
    case ">=":
      ok = val >= val2;
      break;
    case "<":
      ok = val < val2;
      break;
    case "<=":
      ok = val <= val2;
      break;
    case "!=":
      ok = val != val2;
      break;
    case "!==":
      ok = val !== val2;
      break;
    default:
      msg = msg ? msg + ": " : msg;
      throw new AssertionError(
        msg + 'Invalid operator "' + operator + '"',
        void 0,
        assert.operator
      );
  }
  let test2 = new Assertion(ok, msg, assert.operator, true);
  test2.assert(
    true === flag(test2, "object"),
    "expected " + inspect2(val) + " to be " + operator + " " + inspect2(val2),
    "expected " + inspect2(val) + " to not be " + operator + " " + inspect2(val2)
  );
};
assert.closeTo = function(act, exp, delta, msg) {
  new Assertion(act, msg, assert.closeTo, true).to.be.closeTo(exp, delta);
};
assert.approximately = function(act, exp, delta, msg) {
  new Assertion(act, msg, assert.approximately, true).to.be.approximately(
    exp,
    delta
  );
};
assert.sameMembers = function(set1, set2, msg) {
  new Assertion(set1, msg, assert.sameMembers, true).to.have.same.members(set2);
};
assert.notSameMembers = function(set1, set2, msg) {
  new Assertion(
    set1,
    msg,
    assert.notSameMembers,
    true
  ).to.not.have.same.members(set2);
};
assert.sameDeepMembers = function(set1, set2, msg) {
  new Assertion(
    set1,
    msg,
    assert.sameDeepMembers,
    true
  ).to.have.same.deep.members(set2);
};
assert.notSameDeepMembers = function(set1, set2, msg) {
  new Assertion(
    set1,
    msg,
    assert.notSameDeepMembers,
    true
  ).to.not.have.same.deep.members(set2);
};
assert.sameOrderedMembers = function(set1, set2, msg) {
  new Assertion(
    set1,
    msg,
    assert.sameOrderedMembers,
    true
  ).to.have.same.ordered.members(set2);
};
assert.notSameOrderedMembers = function(set1, set2, msg) {
  new Assertion(
    set1,
    msg,
    assert.notSameOrderedMembers,
    true
  ).to.not.have.same.ordered.members(set2);
};
assert.sameDeepOrderedMembers = function(set1, set2, msg) {
  new Assertion(
    set1,
    msg,
    assert.sameDeepOrderedMembers,
    true
  ).to.have.same.deep.ordered.members(set2);
};
assert.notSameDeepOrderedMembers = function(set1, set2, msg) {
  new Assertion(
    set1,
    msg,
    assert.notSameDeepOrderedMembers,
    true
  ).to.not.have.same.deep.ordered.members(set2);
};
assert.includeMembers = function(superset, subset, msg) {
  new Assertion(superset, msg, assert.includeMembers, true).to.include.members(
    subset
  );
};
assert.notIncludeMembers = function(superset, subset, msg) {
  new Assertion(
    superset,
    msg,
    assert.notIncludeMembers,
    true
  ).to.not.include.members(subset);
};
assert.includeDeepMembers = function(superset, subset, msg) {
  new Assertion(
    superset,
    msg,
    assert.includeDeepMembers,
    true
  ).to.include.deep.members(subset);
};
assert.notIncludeDeepMembers = function(superset, subset, msg) {
  new Assertion(
    superset,
    msg,
    assert.notIncludeDeepMembers,
    true
  ).to.not.include.deep.members(subset);
};
assert.includeOrderedMembers = function(superset, subset, msg) {
  new Assertion(
    superset,
    msg,
    assert.includeOrderedMembers,
    true
  ).to.include.ordered.members(subset);
};
assert.notIncludeOrderedMembers = function(superset, subset, msg) {
  new Assertion(
    superset,
    msg,
    assert.notIncludeOrderedMembers,
    true
  ).to.not.include.ordered.members(subset);
};
assert.includeDeepOrderedMembers = function(superset, subset, msg) {
  new Assertion(
    superset,
    msg,
    assert.includeDeepOrderedMembers,
    true
  ).to.include.deep.ordered.members(subset);
};
assert.notIncludeDeepOrderedMembers = function(superset, subset, msg) {
  new Assertion(
    superset,
    msg,
    assert.notIncludeDeepOrderedMembers,
    true
  ).to.not.include.deep.ordered.members(subset);
};
assert.oneOf = function(inList, list, msg) {
  new Assertion(inList, msg, assert.oneOf, true).to.be.oneOf(list);
};
assert.isIterable = function(obj, msg) {
  if (obj == void 0 || !obj[Symbol.iterator]) {
    msg = msg ? `${msg} expected ${inspect2(obj)} to be an iterable` : `expected ${inspect2(obj)} to be an iterable`;
    throw new AssertionError(msg, void 0, assert.isIterable);
  }
};
assert.changes = function(fn, obj, prop, msg) {
  if (arguments.length === 3 && typeof obj === "function") {
    msg = prop;
    prop = null;
  }
  new Assertion(fn, msg, assert.changes, true).to.change(obj, prop);
};
assert.changesBy = function(fn, obj, prop, delta, msg) {
  if (arguments.length === 4 && typeof obj === "function") {
    let tmpMsg = delta;
    delta = prop;
    msg = tmpMsg;
  } else if (arguments.length === 3) {
    delta = prop;
    prop = null;
  }
  new Assertion(fn, msg, assert.changesBy, true).to.change(obj, prop).by(delta);
};
assert.doesNotChange = function(fn, obj, prop, msg) {
  if (arguments.length === 3 && typeof obj === "function") {
    msg = prop;
    prop = null;
  }
  return new Assertion(fn, msg, assert.doesNotChange, true).to.not.change(
    obj,
    prop
  );
};
assert.changesButNotBy = function(fn, obj, prop, delta, msg) {
  if (arguments.length === 4 && typeof obj === "function") {
    let tmpMsg = delta;
    delta = prop;
    msg = tmpMsg;
  } else if (arguments.length === 3) {
    delta = prop;
    prop = null;
  }
  new Assertion(fn, msg, assert.changesButNotBy, true).to.change(obj, prop).but.not.by(delta);
};
assert.increases = function(fn, obj, prop, msg) {
  if (arguments.length === 3 && typeof obj === "function") {
    msg = prop;
    prop = null;
  }
  return new Assertion(fn, msg, assert.increases, true).to.increase(obj, prop);
};
assert.increasesBy = function(fn, obj, prop, delta, msg) {
  if (arguments.length === 4 && typeof obj === "function") {
    let tmpMsg = delta;
    delta = prop;
    msg = tmpMsg;
  } else if (arguments.length === 3) {
    delta = prop;
    prop = null;
  }
  new Assertion(fn, msg, assert.increasesBy, true).to.increase(obj, prop).by(delta);
};
assert.doesNotIncrease = function(fn, obj, prop, msg) {
  if (arguments.length === 3 && typeof obj === "function") {
    msg = prop;
    prop = null;
  }
  return new Assertion(fn, msg, assert.doesNotIncrease, true).to.not.increase(
    obj,
    prop
  );
};
assert.increasesButNotBy = function(fn, obj, prop, delta, msg) {
  if (arguments.length === 4 && typeof obj === "function") {
    let tmpMsg = delta;
    delta = prop;
    msg = tmpMsg;
  } else if (arguments.length === 3) {
    delta = prop;
    prop = null;
  }
  new Assertion(fn, msg, assert.increasesButNotBy, true).to.increase(obj, prop).but.not.by(delta);
};
assert.decreases = function(fn, obj, prop, msg) {
  if (arguments.length === 3 && typeof obj === "function") {
    msg = prop;
    prop = null;
  }
  return new Assertion(fn, msg, assert.decreases, true).to.decrease(obj, prop);
};
assert.decreasesBy = function(fn, obj, prop, delta, msg) {
  if (arguments.length === 4 && typeof obj === "function") {
    let tmpMsg = delta;
    delta = prop;
    msg = tmpMsg;
  } else if (arguments.length === 3) {
    delta = prop;
    prop = null;
  }
  new Assertion(fn, msg, assert.decreasesBy, true).to.decrease(obj, prop).by(delta);
};
assert.doesNotDecrease = function(fn, obj, prop, msg) {
  if (arguments.length === 3 && typeof obj === "function") {
    msg = prop;
    prop = null;
  }
  return new Assertion(fn, msg, assert.doesNotDecrease, true).to.not.decrease(
    obj,
    prop
  );
};
assert.doesNotDecreaseBy = function(fn, obj, prop, delta, msg) {
  if (arguments.length === 4 && typeof obj === "function") {
    let tmpMsg = delta;
    delta = prop;
    msg = tmpMsg;
  } else if (arguments.length === 3) {
    delta = prop;
    prop = null;
  }
  return new Assertion(fn, msg, assert.doesNotDecreaseBy, true).to.not.decrease(obj, prop).by(delta);
};
assert.decreasesButNotBy = function(fn, obj, prop, delta, msg) {
  if (arguments.length === 4 && typeof obj === "function") {
    let tmpMsg = delta;
    delta = prop;
    msg = tmpMsg;
  } else if (arguments.length === 3) {
    delta = prop;
    prop = null;
  }
  new Assertion(fn, msg, assert.decreasesButNotBy, true).to.decrease(obj, prop).but.not.by(delta);
};
assert.ifError = function(val) {
  if (val) {
    throw val;
  }
};
assert.isExtensible = function(obj, msg) {
  new Assertion(obj, msg, assert.isExtensible, true).to.be.extensible;
};
assert.isNotExtensible = function(obj, msg) {
  new Assertion(obj, msg, assert.isNotExtensible, true).to.not.be.extensible;
};
assert.isSealed = function(obj, msg) {
  new Assertion(obj, msg, assert.isSealed, true).to.be.sealed;
};
assert.isNotSealed = function(obj, msg) {
  new Assertion(obj, msg, assert.isNotSealed, true).to.not.be.sealed;
};
assert.isFrozen = function(obj, msg) {
  new Assertion(obj, msg, assert.isFrozen, true).to.be.frozen;
};
assert.isNotFrozen = function(obj, msg) {
  new Assertion(obj, msg, assert.isNotFrozen, true).to.not.be.frozen;
};
assert.isEmpty = function(val, msg) {
  new Assertion(val, msg, assert.isEmpty, true).to.be.empty;
};
assert.isNotEmpty = function(val, msg) {
  new Assertion(val, msg, assert.isNotEmpty, true).to.not.be.empty;
};
assert.containsSubset = function(val, exp, msg) {
  new Assertion(val, msg).to.containSubset(exp);
};
assert.doesNotContainSubset = function(val, exp, msg) {
  new Assertion(val, msg).to.not.containSubset(exp);
};
var aliases = [
  ["isOk", "ok"],
  ["isNotOk", "notOk"],
  ["throws", "throw"],
  ["throws", "Throw"],
  ["isExtensible", "extensible"],
  ["isNotExtensible", "notExtensible"],
  ["isSealed", "sealed"],
  ["isNotSealed", "notSealed"],
  ["isFrozen", "frozen"],
  ["isNotFrozen", "notFrozen"],
  ["isEmpty", "empty"],
  ["isNotEmpty", "notEmpty"],
  ["isCallable", "isFunction"],
  ["isNotCallable", "isNotFunction"],
  ["containsSubset", "containSubset"]
];
for (const [name, as] of aliases) {
  assert[as] = assert[name];
}
var used = [];
function use(fn) {
  const exports = {
    use,
    AssertionError,
    util: utils_exports,
    config,
    expect,
    assert,
    Assertion,
    ...should_exports
  };
  if (!~used.indexOf(fn)) {
    fn(exports, utils_exports);
    used.push(fn);
  }
  return exports;
}
__name(use, "use");

// src/sensors/sensor.ts
var SensorEventType = {
  Start: "start",
  Move: "move",
  Cancel: "cancel",
  End: "end",
  Destroy: "destroy"
};

// src/sensors/base-sensor.ts
import { Emitter } from "eventti";
var BaseSensor = class {
  constructor() {
    this.drag = null;
    this.isDestroyed = false;
    this._emitter = new Emitter();
  }
  _createDragData(data) {
    return {
      x: data.x,
      y: data.y
    };
  }
  _updateDragData(data) {
    if (!this.drag) return;
    this.drag.x = data.x;
    this.drag.y = data.y;
  }
  _resetDragData() {
    this.drag = null;
  }
  _start(data) {
    if (this.isDestroyed || this.drag) return;
    this.drag = this._createDragData(data);
    this._emitter.emit(SensorEventType.Start, data);
  }
  _move(data) {
    if (!this.drag) return;
    this._updateDragData(data);
    this._emitter.emit(SensorEventType.Move, data);
  }
  _end(data) {
    if (!this.drag) return;
    this._updateDragData(data);
    this._emitter.emit(SensorEventType.End, data);
    this._resetDragData();
  }
  _cancel(data) {
    if (!this.drag) return;
    this._updateDragData(data);
    this._emitter.emit(SensorEventType.Cancel, data);
    this._resetDragData();
  }
  on(type3, listener, listenerId) {
    return this._emitter.on(type3, listener, listenerId);
  }
  off(type3, listenerId) {
    this._emitter.off(type3, listenerId);
  }
  cancel() {
    if (!this.drag) return;
    this._cancel({
      type: SensorEventType.Cancel,
      x: this.drag.x,
      y: this.drag.y
    });
  }
  destroy() {
    if (this.isDestroyed) return;
    this.isDestroyed = true;
    this.cancel();
    this._emitter.emit(SensorEventType.Destroy, {
      type: SensorEventType.Destroy
    });
    this._emitter.off();
  }
};

// src/singletons/ticker.ts
import { AutoTicker } from "tikki";
var tickerPhases = {
  read: Symbol(),
  write: Symbol()
};
var ticker = new AutoTicker({
  phases: [tickerPhases.read, tickerPhases.write]
});

// src/sensors/pointer-sensor.ts
import { Emitter as Emitter2 } from "eventti";

// src/utils/get-pointer-event-data.ts
function getPointerEventData(e, id) {
  if ("pointerId" in e) {
    return e.pointerId === id ? e : null;
  }
  if ("changedTouches" in e) {
    let i = 0;
    for (; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === id) {
        return e.changedTouches[i];
      }
    }
    return null;
  }
  return e;
}

// src/utils/get-pointer-type.ts
function getPointerType(e) {
  return "pointerType" in e ? e.pointerType : "touches" in e ? "touch" : "mouse";
}

// src/utils/get-pointer-id.ts
function getPointerId(e) {
  if ("pointerId" in e) return e.pointerId;
  if ("changedTouches" in e) return e.changedTouches[0] ? e.changedTouches[0].identifier : null;
  return -1;
}

// src/utils/parse-listener-options.ts
function parseListenerOptions(options4 = {}) {
  const { capture = true, passive = true } = options4;
  return { capture, passive };
}

// src/constants.ts
var IS_BROWSER = typeof window !== "undefined" && typeof window.document !== "undefined";
var HAS_TOUCH_EVENTS = IS_BROWSER && "ontouchstart" in window;
var HAS_POINTER_EVENTS = IS_BROWSER && !!window.PointerEvent;
var IS_SAFARI = !!(IS_BROWSER && navigator.vendor && navigator.vendor.indexOf("Apple") > -1 && navigator.userAgent && navigator.userAgent.indexOf("CriOS") == -1 && navigator.userAgent.indexOf("FxiOS") == -1);

// src/utils/parse-source-events.ts
function parseSourceEvents(sourceEvents) {
  return sourceEvents === "auto" || sourceEvents === void 0 ? HAS_POINTER_EVENTS ? "pointer" : HAS_TOUCH_EVENTS ? "touch" : "mouse" : sourceEvents;
}

// src/sensors/pointer-sensor.ts
var POINTER_EVENTS = {
  start: "pointerdown",
  move: "pointermove",
  cancel: "pointercancel",
  end: "pointerup"
};
var TOUCH_EVENTS = {
  start: "touchstart",
  move: "touchmove",
  cancel: "touchcancel",
  end: "touchend"
};
var MOUSE_EVENTS = {
  start: "mousedown",
  move: "mousemove",
  cancel: "",
  end: "mouseup"
};
var SOURCE_EVENTS = {
  pointer: POINTER_EVENTS,
  touch: TOUCH_EVENTS,
  mouse: MOUSE_EVENTS
};
var PointerSensor = class {
  constructor(element, options4 = {}) {
    const {
      listenerOptions = {},
      sourceEvents = "auto",
      startPredicate = (e) => "button" in e && e.button > 0 ? false : true
    } = options4;
    this.element = element;
    this.drag = null;
    this.isDestroyed = false;
    this._areWindowListenersBound = false;
    this._startPredicate = startPredicate;
    this._listenerOptions = parseListenerOptions(listenerOptions);
    this._sourceEvents = parseSourceEvents(sourceEvents);
    this._emitter = new Emitter2();
    this._onStart = this._onStart.bind(this);
    this._onMove = this._onMove.bind(this);
    this._onCancel = this._onCancel.bind(this);
    this._onEnd = this._onEnd.bind(this);
    element.addEventListener(
      SOURCE_EVENTS[this._sourceEvents].start,
      this._onStart,
      this._listenerOptions
    );
  }
  /**
   * Check if the provided event contains the tracked pointer id or in the case
   * of touch event if the first changed touch is the tracked touch object and
   * return the event or touch object. Otherwise return null.
   */
  _getTrackedPointerEventData(e) {
    return this.drag ? getPointerEventData(e, this.drag.pointerId) : null;
  }
  /**
   * Listener for start event.
   */
  _onStart(e) {
    if (this.isDestroyed || this.drag) return;
    if (!this._startPredicate(e)) return;
    const pointerId = getPointerId(e);
    if (pointerId === null) return;
    const pointerEventData = getPointerEventData(e, pointerId);
    if (pointerEventData === null) return;
    const dragData = {
      pointerId,
      pointerType: getPointerType(e),
      x: pointerEventData.clientX,
      y: pointerEventData.clientY
    };
    this.drag = dragData;
    const eventData = {
      ...dragData,
      type: SensorEventType.Start,
      srcEvent: e,
      target: pointerEventData.target
    };
    this._emitter.emit(eventData.type, eventData);
    if (this.drag) {
      this._bindWindowListeners();
    }
  }
  /**
   * Listener for move event.
   */
  _onMove(e) {
    if (!this.drag) return;
    const pointerEventData = this._getTrackedPointerEventData(e);
    if (!pointerEventData) return;
    this.drag.x = pointerEventData.clientX;
    this.drag.y = pointerEventData.clientY;
    const eventData = {
      type: SensorEventType.Move,
      srcEvent: e,
      target: pointerEventData.target,
      ...this.drag
    };
    this._emitter.emit(eventData.type, eventData);
  }
  /**
   * Listener for cancel event.
   */
  _onCancel(e) {
    if (!this.drag) return;
    const pointerEventData = this._getTrackedPointerEventData(e);
    if (!pointerEventData) return;
    this.drag.x = pointerEventData.clientX;
    this.drag.y = pointerEventData.clientY;
    const eventData = {
      type: SensorEventType.Cancel,
      srcEvent: e,
      target: pointerEventData.target,
      ...this.drag
    };
    this._emitter.emit(eventData.type, eventData);
    this._resetDrag();
  }
  /**
   * Listener for end event.
   */
  _onEnd(e) {
    if (!this.drag) return;
    const pointerEventData = this._getTrackedPointerEventData(e);
    if (!pointerEventData) return;
    this.drag.x = pointerEventData.clientX;
    this.drag.y = pointerEventData.clientY;
    const eventData = {
      type: SensorEventType.End,
      srcEvent: e,
      target: pointerEventData.target,
      ...this.drag
    };
    this._emitter.emit(eventData.type, eventData);
    this._resetDrag();
  }
  /**
   * Bind window event listeners for move/end/cancel.
   */
  _bindWindowListeners() {
    if (this._areWindowListenersBound) return;
    const { move: move2, end, cancel } = SOURCE_EVENTS[this._sourceEvents];
    window.addEventListener(move2, this._onMove, this._listenerOptions);
    window.addEventListener(end, this._onEnd, this._listenerOptions);
    if (cancel) {
      window.addEventListener(cancel, this._onCancel, this._listenerOptions);
    }
    this._areWindowListenersBound = true;
  }
  /**
   * Unbind window event listeners for move/end/cancel.
   */
  _unbindWindowListeners() {
    if (this._areWindowListenersBound) {
      const { move: move2, end, cancel } = SOURCE_EVENTS[this._sourceEvents];
      window.removeEventListener(move2, this._onMove, this._listenerOptions);
      window.removeEventListener(end, this._onEnd, this._listenerOptions);
      if (cancel) {
        window.removeEventListener(cancel, this._onCancel, this._listenerOptions);
      }
      this._areWindowListenersBound = false;
    }
  }
  /**
   * Reset drag data.
   */
  _resetDrag() {
    this.drag = null;
    this._unbindWindowListeners();
  }
  /**
   * Forcefully cancel the drag process.
   */
  cancel() {
    if (!this.drag) return;
    const eventData = {
      type: SensorEventType.Cancel,
      srcEvent: null,
      target: null,
      ...this.drag
    };
    this._emitter.emit(eventData.type, eventData);
    this._resetDrag();
  }
  /**
   * Update the instance's settings.
   */
  updateSettings(options4) {
    if (this.isDestroyed) return;
    const { listenerOptions, sourceEvents, startPredicate } = options4;
    const nextSourceEvents = parseSourceEvents(sourceEvents);
    const nextListenerOptions = parseListenerOptions(listenerOptions);
    if (startPredicate && this._startPredicate !== startPredicate) {
      this._startPredicate = startPredicate;
    }
    if (listenerOptions && (this._listenerOptions.capture !== nextListenerOptions.capture || this._listenerOptions.passive === nextListenerOptions.passive) || sourceEvents && this._sourceEvents !== nextSourceEvents) {
      this.element.removeEventListener(
        SOURCE_EVENTS[this._sourceEvents].start,
        this._onStart,
        this._listenerOptions
      );
      this._unbindWindowListeners();
      this.cancel();
      if (sourceEvents) {
        this._sourceEvents = nextSourceEvents;
      }
      if (listenerOptions && nextListenerOptions) {
        this._listenerOptions = nextListenerOptions;
      }
      this.element.addEventListener(
        SOURCE_EVENTS[this._sourceEvents].start,
        this._onStart,
        this._listenerOptions
      );
    }
  }
  /**
   * Bind a drag event listener.
   */
  on(type3, listener, listenerId) {
    return this._emitter.on(type3, listener, listenerId);
  }
  /**
   * Unbind a drag event listener.
   */
  off(type3, listenerId) {
    this._emitter.off(type3, listenerId);
  }
  /**
   * Destroy the instance and unbind all drag event listeners.
   */
  destroy() {
    if (this.isDestroyed) return;
    this.isDestroyed = true;
    this.cancel();
    this._emitter.emit(SensorEventType.Destroy, {
      type: SensorEventType.Destroy
    });
    this._emitter.off();
    this.element.removeEventListener(
      SOURCE_EVENTS[this._sourceEvents].start,
      this._onStart,
      this._listenerOptions
    );
  }
};

// src/sensors/keyboard-sensor.ts
var keyboardSensorDefaults = {
  moveDistance: 25,
  cancelOnBlur: true,
  cancelOnVisibilityChange: true,
  startPredicate: (e, sensor) => {
    if (sensor.element && (e.key === "Enter" || e.key === " ")) {
      if (document.activeElement === sensor.element) {
        const { x, y } = sensor.element.getBoundingClientRect();
        return { x, y };
      }
    }
    return null;
  },
  movePredicate: (e, sensor) => {
    if (!sensor.drag) return null;
    switch (e.key) {
      case "ArrowLeft": {
        return {
          x: sensor.drag.x - sensor.moveDistance.x,
          y: sensor.drag.y
        };
      }
      case "ArrowRight": {
        return {
          x: sensor.drag.x + sensor.moveDistance.x,
          y: sensor.drag.y
        };
      }
      case "ArrowUp": {
        return {
          x: sensor.drag.x,
          y: sensor.drag.y - sensor.moveDistance.y
        };
      }
      case "ArrowDown": {
        return {
          x: sensor.drag.x,
          y: sensor.drag.y + sensor.moveDistance.y
        };
      }
      default: {
        return null;
      }
    }
  },
  cancelPredicate: (e, sensor) => {
    if (sensor.drag && e.key === "Escape") {
      const { x, y } = sensor.drag;
      return { x, y };
    }
    return null;
  },
  endPredicate: (e, sensor) => {
    if (sensor.drag && (e.key === "Enter" || e.key === " ")) {
      const { x, y } = sensor.drag;
      return { x, y };
    }
    return null;
  }
};
var KeyboardSensor = class extends BaseSensor {
  constructor(element, options4 = {}) {
    super();
    const {
      moveDistance = keyboardSensorDefaults.moveDistance,
      cancelOnBlur = keyboardSensorDefaults.cancelOnBlur,
      cancelOnVisibilityChange = keyboardSensorDefaults.cancelOnVisibilityChange,
      startPredicate = keyboardSensorDefaults.startPredicate,
      movePredicate = keyboardSensorDefaults.movePredicate,
      cancelPredicate = keyboardSensorDefaults.cancelPredicate,
      endPredicate = keyboardSensorDefaults.endPredicate
    } = options4;
    this.element = element;
    this.moveDistance = typeof moveDistance === "number" ? { x: moveDistance, y: moveDistance } : { ...moveDistance };
    this._cancelOnBlur = cancelOnBlur;
    this._cancelOnVisibilityChange = cancelOnVisibilityChange;
    this._startPredicate = startPredicate;
    this._movePredicate = movePredicate;
    this._cancelPredicate = cancelPredicate;
    this._endPredicate = endPredicate;
    this._onKeyDown = this._onKeyDown.bind(this);
    this._internalCancel = this._internalCancel.bind(this);
    this._blurCancelHandler = this._blurCancelHandler.bind(this);
    document.addEventListener("keydown", this._onKeyDown);
    if (cancelOnBlur) {
      element?.addEventListener("blur", this._blurCancelHandler);
    }
    if (cancelOnVisibilityChange) {
      document.addEventListener("visibilitychange", this._internalCancel);
    }
  }
  _internalCancel() {
    this.cancel();
  }
  _blurCancelHandler() {
    queueMicrotask(() => {
      if (document.activeElement !== this.element) {
        this.cancel();
      }
    });
  }
  _onKeyDown(e) {
    if (!this.drag) {
      const startPosition = this._startPredicate(e, this);
      if (startPosition) {
        e.preventDefault();
        this._start({
          type: SensorEventType.Start,
          x: startPosition.x,
          y: startPosition.y,
          srcEvent: e
        });
      }
      return;
    }
    const cancelPosition = this._cancelPredicate(e, this);
    if (cancelPosition) {
      e.preventDefault();
      this._cancel({
        type: SensorEventType.Cancel,
        x: cancelPosition.x,
        y: cancelPosition.y,
        srcEvent: e
      });
      return;
    }
    const endPosition = this._endPredicate(e, this);
    if (endPosition) {
      e.preventDefault();
      this._end({
        type: SensorEventType.End,
        x: endPosition.x,
        y: endPosition.y,
        srcEvent: e
      });
      return;
    }
    const movePosition = this._movePredicate(e, this);
    if (movePosition) {
      e.preventDefault();
      this._move({
        type: SensorEventType.Move,
        x: movePosition.x,
        y: movePosition.y,
        srcEvent: e
      });
      return;
    }
  }
  updateSettings(options4 = {}) {
    const {
      moveDistance,
      cancelOnBlur,
      cancelOnVisibilityChange,
      startPredicate,
      movePredicate,
      cancelPredicate,
      endPredicate
    } = options4;
    if (moveDistance !== void 0) {
      if (typeof moveDistance === "number") {
        this.moveDistance.x = this.moveDistance.y = moveDistance;
      } else {
        this.moveDistance.x = moveDistance.x;
        this.moveDistance.y = moveDistance.y;
      }
    }
    if (cancelOnBlur !== void 0 && this._cancelOnBlur !== cancelOnBlur) {
      this._cancelOnBlur = cancelOnBlur;
      if (cancelOnBlur) {
        this.element?.addEventListener("blur", this._blurCancelHandler);
      } else {
        this.element?.removeEventListener("blur", this._blurCancelHandler);
      }
    }
    if (cancelOnVisibilityChange !== void 0 && this._cancelOnVisibilityChange !== cancelOnVisibilityChange) {
      this._cancelOnVisibilityChange = cancelOnVisibilityChange;
      if (cancelOnVisibilityChange) {
        document.addEventListener("visibilitychange", this._internalCancel);
      } else {
        document.removeEventListener("visibilitychange", this._internalCancel);
      }
    }
    if (startPredicate) {
      this._startPredicate = startPredicate;
    }
    if (movePredicate) {
      this._movePredicate = movePredicate;
    }
    if (cancelPredicate) {
      this._cancelPredicate = cancelPredicate;
    }
    if (endPredicate) {
      this._endPredicate = endPredicate;
    }
  }
  destroy() {
    if (this.isDestroyed) return;
    super.destroy();
    document.removeEventListener("keydown", this._onKeyDown);
    if (this._cancelOnBlur) {
      this.element?.removeEventListener("blur", this._blurCancelHandler);
    }
    if (this._cancelOnVisibilityChange) {
      document.removeEventListener("visibilitychange", this._internalCancel);
    }
  }
};

// src/draggable/draggable.ts
import { Emitter as Emitter3 } from "eventti";

// src/utils/object-cache.ts
var ObjectCache = class {
  constructor() {
    this._cache = /* @__PURE__ */ new Map();
    this._validation = /* @__PURE__ */ new Map();
  }
  set(key, value) {
    this._cache.set(key, value);
    this._validation.set(key, void 0);
  }
  get(key) {
    return this._cache.get(key);
  }
  has(key) {
    return this._cache.has(key);
  }
  delete(key) {
    this._cache.delete(key);
    this._validation.delete(key);
  }
  isValid(key) {
    return this._validation.has(key);
  }
  invalidate(key) {
    if (key === void 0) {
      this._validation.clear();
    } else {
      this._validation.delete(key);
    }
  }
  clear() {
    this._cache.clear();
    this._validation.clear();
  }
};

// src/draggable/draggable-drag.ts
var DraggableDrag = class {
  constructor(sensor, startEvent) {
    this.sensor = sensor;
    this.startEvent = startEvent;
    this.prevMoveEvent = startEvent;
    this.moveEvent = startEvent;
    this.endEvent = null;
    this.items = [];
    this.isEnded = false;
    this._matrixCache = new ObjectCache();
    this._clientOffsetCache = new ObjectCache();
  }
};

// src/draggable/draggable-drag-item.ts
import { getOffsetContainer } from "mezr";

// src/utils/get-style.ts
var STYLE_DECLARATION_CACHE = /* @__PURE__ */ new WeakMap();
function getStyle(element) {
  let styleDeclaration = STYLE_DECLARATION_CACHE.get(element)?.deref();
  if (!styleDeclaration) {
    styleDeclaration = window.getComputedStyle(element, null);
    STYLE_DECLARATION_CACHE.set(element, new WeakRef(styleDeclaration));
  }
  return styleDeclaration;
}

// src/utils/get-client-offset.ts
function getClientOffset(element, result = { x: 0, y: 0 }) {
  result.x = 0;
  result.y = 0;
  if (element instanceof Window) {
    return result;
  }
  if (element instanceof Document) {
    result.x = window.scrollX * -1;
    result.y = window.scrollY * -1;
    return result;
  }
  const { x, y } = element.getBoundingClientRect();
  const style = getStyle(element);
  result.x = x + (parseFloat(style.borderLeftWidth) || 0);
  result.y = y + (parseFloat(style.borderTopWidth) || 0);
  return result;
}

// src/utils/is-point.ts
function isPoint(value) {
  return typeof value === "object" && value !== null && "x" in value && "y" in value;
}

// src/utils/get-offset-diff.ts
var OFFSET_A = { x: 0, y: 0 };
var OFFSET_B = { x: 0, y: 0 };
function getOffsetDiff(elemA, elemB, result = { x: 0, y: 0 }) {
  const offsetA = isPoint(elemA) ? elemA : getClientOffset(elemA, OFFSET_A);
  const offsetB = isPoint(elemB) ? elemB : getClientOffset(elemB, OFFSET_B);
  result.x = offsetB.x - offsetA.x;
  result.y = offsetB.y - offsetA.y;
  return result;
}

// src/utils/get-intrinsic-height.ts
function getIntrinsicHeight(element) {
  const style = getStyle(element);
  let height = parseFloat(style.height) || 0;
  if (style.boxSizing === "border-box") {
    return height;
  }
  height += parseFloat(style.borderTopWidth) || 0;
  height += parseFloat(style.borderBottomWidth) || 0;
  height += parseFloat(style.paddingTop) || 0;
  height += parseFloat(style.paddingBottom) || 0;
  if (element instanceof HTMLElement) {
    height += element.offsetHeight - element.clientHeight;
  }
  return height;
}

// src/utils/get-intrinsic-width.ts
function getIntrinsicWidth(element) {
  const style = getStyle(element);
  let width = parseFloat(style.width) || 0;
  if (style.boxSizing === "border-box") {
    return width;
  }
  width += parseFloat(style.borderLeftWidth) || 0;
  width += parseFloat(style.borderRightWidth) || 0;
  width += parseFloat(style.paddingLeft) || 0;
  width += parseFloat(style.paddingRight) || 0;
  if (element instanceof HTMLElement) {
    width += element.offsetWidth - element.clientWidth;
  }
  return width;
}

// src/utils/get-element-transform-string.ts
function getElementTransformString(el, ignoreNormalTransform = false) {
  const { translate, rotate, scale, transform } = getStyle(el);
  let transformString = "";
  if (translate && translate !== "none") {
    let [x = "0px", y = "0px", z] = translate.split(" ");
    if (x.includes("%")) {
      x = `${parseFloat(x) / 100 * getIntrinsicWidth(el)}px`;
    }
    if (y.includes("%")) {
      y = `${parseFloat(y) / 100 * getIntrinsicHeight(el)}px`;
    }
    if (z) {
      transformString += `translate3d(${x},${y},${z})`;
    } else {
      transformString += `translate(${x},${y})`;
    }
  }
  if (rotate && rotate !== "none") {
    const rotateValues = rotate.split(" ");
    if (rotateValues.length > 1) {
      transformString += `rotate3d(${rotateValues.join(",")})`;
    } else {
      transformString += `rotate(${rotateValues.join(",")})`;
    }
  }
  if (scale && scale !== "none") {
    const scaleValues = scale.split(" ");
    if (scaleValues.length === 3) {
      transformString += `scale3d(${scaleValues.join(",")})`;
    } else {
      transformString += `scale(${scaleValues.join(",")})`;
    }
  }
  if (!ignoreNormalTransform && transform && transform !== "none") {
    transformString += transform;
  }
  return transformString;
}

// src/utils/parse-transform-origin.ts
function parseTransformOrigin(transformOrigin) {
  const values = transformOrigin.split(" ");
  let originX = "";
  let originY = "";
  let originZ = "";
  if (values.length === 1) {
    originX = originY = values[0];
  } else if (values.length === 2) {
    [originX, originY] = values;
  } else {
    [originX, originY, originZ] = values;
  }
  return {
    x: parseFloat(originX) || 0,
    y: parseFloat(originY) || 0,
    z: parseFloat(originZ) || 0
  };
}

// src/utils/reset-matrix.ts
var RESET_TRANSFORM = "scale(1, 1)";
function resetMatrix(m) {
  return m.setMatrixValue(RESET_TRANSFORM);
}

// src/utils/get-world-transform-matrix.ts
var MATRIX = IS_BROWSER ? new DOMMatrix() : null;
function getWorldTransformMatrix(el, result = new DOMMatrix()) {
  let currentElement = el;
  resetMatrix(result);
  while (currentElement) {
    const transformString = getElementTransformString(currentElement);
    if (transformString) {
      MATRIX.setMatrixValue(transformString);
      if (!MATRIX.isIdentity) {
        const { transformOrigin } = getStyle(currentElement);
        const { x, y, z } = parseTransformOrigin(transformOrigin);
        if (z === 0) {
          MATRIX.setMatrixValue(
            `translate(${x}px,${y}px) ${MATRIX} translate(${x * -1}px,${y * -1}px)`
          );
        } else {
          MATRIX.setMatrixValue(
            `translate3d(${x}px,${y}px,${z}px) ${MATRIX} translate3d(${x * -1}px,${y * -1}px,${z * -1}px)`
          );
        }
        result.preMultiplySelf(MATRIX);
      }
    }
    currentElement = currentElement.parentElement;
  }
  return result;
}

// src/utils/set-styles.ts
function setStyles(el, styles2, important = false) {
  const { style } = el;
  for (const key in styles2) {
    style.setProperty(key, styles2[key], important ? "important" : "");
  }
}

// src/utils/create-measure-element.ts
function createMeasureElement() {
  const el = document.createElement("div");
  el.classList.add("dragdoll-measure");
  setStyles(
    el,
    {
      display: "block",
      position: "absolute",
      inset: "0px",
      padding: "0px",
      margin: "0px",
      border: "none",
      opacity: "0",
      transform: "none",
      "transform-origin": "0 0",
      transition: "none",
      animation: "none",
      "pointer-events": "none"
    },
    true
  );
  return el;
}

// src/utils/is-matrix-warped.ts
function isMatrixWarped(m) {
  return m.m11 !== 1 || m.m12 !== 0 || m.m13 !== 0 || m.m14 !== 0 || m.m21 !== 0 || m.m22 !== 1 || m.m23 !== 0 || m.m24 !== 0 || m.m31 !== 0 || m.m32 !== 0 || m.m33 !== 1 || m.m34 !== 0 || m.m43 !== 0 || m.m44 !== 1;
}

// src/draggable/draggable-drag-item.ts
var MEASURE_ELEMENT = IS_BROWSER ? createMeasureElement() : null;
var DraggableDragItem = class {
  constructor(element, draggable) {
    if (!element.isConnected) {
      throw new Error("Element is not connected");
    }
    const { drag } = draggable;
    if (!drag) {
      throw new Error("Drag is not defined");
    }
    const style = getStyle(element);
    const clientRect = element.getBoundingClientRect();
    const individualTransforms = getElementTransformString(element, true);
    this.data = {};
    this.element = element;
    this.elementTransformOrigin = parseTransformOrigin(style.transformOrigin);
    this.elementTransformMatrix = new DOMMatrix().setMatrixValue(
      individualTransforms + style.transform
    );
    this.elementOffsetMatrix = new DOMMatrix(individualTransforms).invertSelf();
    this.frozenStyles = null;
    this.unfrozenStyles = null;
    this.position = { x: 0, y: 0 };
    this.containerOffset = { x: 0, y: 0 };
    this.alignmentOffset = { x: 0, y: 0 };
    this._moveDiff = { x: 0, y: 0 };
    this._alignDiff = { x: 0, y: 0 };
    this._matrixCache = drag["_matrixCache"];
    this._clientOffsetCache = drag["_clientOffsetCache"];
    const elementContainer = element.parentElement;
    if (!elementContainer) {
      throw new Error("Dragged element does not have a parent element.");
    }
    this.elementContainer = elementContainer;
    const dragContainer = draggable.settings.container || elementContainer;
    this.dragContainer = dragContainer;
    if (elementContainer !== dragContainer) {
      const { position } = style;
      if (position !== "fixed" && position !== "absolute") {
        throw new Error(
          `Dragged element has "${position}" position, but only "fixed" or "absolute" are allowed when using a custom drag container.`
        );
      }
    }
    const elementOffsetContainer = getOffsetContainer(element) || element;
    this.elementOffsetContainer = elementOffsetContainer;
    const dragOffsetContainer = dragContainer === elementContainer ? elementOffsetContainer : getOffsetContainer(element, { container: dragContainer });
    this.dragOffsetContainer = dragOffsetContainer;
    {
      const { width, height, x, y } = clientRect;
      this.clientRect = { width, height, x, y };
    }
    this._updateContainerMatrices();
    this._updateContainerOffset();
    const frozenStyles = draggable.settings.frozenStyles({
      draggable,
      drag,
      item: this,
      style
    });
    if (Array.isArray(frozenStyles)) {
      if (frozenStyles.length) {
        const props = {};
        for (const prop of frozenStyles) {
          props[prop] = style[prop];
        }
        this.frozenStyles = props;
      } else {
        this.frozenStyles = null;
      }
    } else {
      this.frozenStyles = frozenStyles;
    }
    if (this.frozenStyles) {
      const unfrozenStyles = {};
      for (const key in this.frozenStyles) {
        if (this.frozenStyles.hasOwnProperty(key)) {
          unfrozenStyles[key] = element.style[key];
        }
      }
      this.unfrozenStyles = unfrozenStyles;
    }
  }
  _updateContainerMatrices() {
    [this.elementContainer, this.dragContainer].forEach((container) => {
      if (!this._matrixCache.isValid(container)) {
        const matrices = this._matrixCache.get(container) || [new DOMMatrix(), new DOMMatrix()];
        const [matrix, inverseMatrix] = matrices;
        getWorldTransformMatrix(container, matrix);
        inverseMatrix.setMatrixValue(matrix.toString()).invertSelf();
        this._matrixCache.set(container, matrices);
      }
    });
  }
  _updateContainerOffset() {
    const {
      elementOffsetContainer,
      elementContainer,
      dragOffsetContainer,
      dragContainer,
      containerOffset,
      _clientOffsetCache,
      _matrixCache
    } = this;
    if (elementOffsetContainer !== dragOffsetContainer) {
      const [dragOffset, elementOffset] = [
        [dragContainer, dragOffsetContainer],
        [elementContainer, elementOffsetContainer]
      ].map(([container, offsetContainer]) => {
        const offset = _clientOffsetCache.get(offsetContainer) || { x: 0, y: 0 };
        if (!_clientOffsetCache.isValid(offsetContainer)) {
          const matrices = _matrixCache.get(container);
          if (offsetContainer instanceof HTMLElement && matrices && !matrices[0].isIdentity) {
            if (isMatrixWarped(matrices[0])) {
              MEASURE_ELEMENT.style.setProperty("transform", matrices[1].toString(), "important");
              offsetContainer.append(MEASURE_ELEMENT);
              getClientOffset(MEASURE_ELEMENT, offset);
              MEASURE_ELEMENT.remove();
            } else {
              getClientOffset(offsetContainer, offset);
              offset.x -= matrices[0].m41;
              offset.y -= matrices[0].m42;
            }
          } else {
            getClientOffset(offsetContainer, offset);
          }
        }
        _clientOffsetCache.set(offsetContainer, offset);
        return offset;
      });
      getOffsetDiff(dragOffset, elementOffset, containerOffset);
    } else {
      containerOffset.x = 0;
      containerOffset.y = 0;
    }
  }
  getContainerMatrix() {
    return this._matrixCache.get(this.elementContainer);
  }
  getDragContainerMatrix() {
    return this._matrixCache.get(this.dragContainer);
  }
  updateSize(dimensions) {
    if (dimensions) {
      this.clientRect.width = dimensions.width;
      this.clientRect.height = dimensions.height;
    } else {
      const { width, height } = this.element.getBoundingClientRect();
      this.clientRect.width = width;
      this.clientRect.height = height;
    }
  }
};

// src/utils/append-element.ts
function appendElement(element, container, innerContainer) {
  const focusedElement = document.activeElement;
  const containsFocus = element.contains(focusedElement);
  if (innerContainer) innerContainer.append(element);
  container.append(innerContainer || element);
  if (containsFocus && document.activeElement !== focusedElement) {
    focusedElement.focus({ preventScroll: true });
  }
}

// src/utils/round-number.ts
function roundNumber(value, decimals = 0) {
  const multiplier = Math.pow(10, decimals);
  return Math.round((value + Number.EPSILON) * multiplier) / multiplier;
}

// src/utils/are-matrices-equal.ts
function areMatricesEqual(m1, m2) {
  if (m1.isIdentity && m2.isIdentity) return true;
  if (m1.is2D && m2.is2D) {
    return m1.a === m2.a && m1.b === m2.b && m1.c === m2.c && m1.d === m2.d && m1.e === m2.e && m1.f === m2.f;
  }
  return m1.m11 === m2.m11 && m1.m12 === m2.m12 && m1.m13 === m2.m13 && m1.m14 === m2.m14 && m1.m21 === m2.m21 && m1.m22 === m2.m22 && m1.m23 === m2.m23 && m1.m24 === m2.m24 && m1.m31 === m2.m31 && m1.m32 === m2.m32 && m1.m33 === m2.m33 && m1.m34 === m2.m34 && m1.m41 === m2.m41 && m1.m42 === m2.m42 && m1.m43 === m2.m43 && m1.m44 === m2.m44;
}

// src/draggable/draggable.ts
var SCROLL_LISTENER_OPTIONS = { capture: true, passive: true };
var POSITION_CHANGE = { x: 0, y: 0 };
var ELEMENT_MATRIX = IS_BROWSER ? new DOMMatrix() : null;
var TEMP_MATRIX = IS_BROWSER ? new DOMMatrix() : null;
var DraggableModifierPhase = {
  Start: "start",
  Move: "move",
  End: "end"
};
var DraggableApplyPositionPhase = {
  Start: "start",
  StartAlign: "start-align",
  Move: "move",
  Align: "align",
  End: "end",
  EndAlign: "end-align"
};
var DraggableEventType = {
  PrepareStart: "preparestart",
  Start: "start",
  PrepareMove: "preparemove",
  Move: "move",
  End: "end",
  Destroy: "destroy"
};
var DraggableDefaultSettings = {
  container: null,
  startPredicate: () => true,
  elements: () => null,
  frozenStyles: () => null,
  applyPosition: ({ item, phase }) => {
    const isEndPhase = phase === DraggableApplyPositionPhase.End || phase === DraggableApplyPositionPhase.EndAlign;
    const [containerMatrix, inverseContainerMatrix] = item.getContainerMatrix();
    const [_dragContainerMatrix, inverseDragContainerMatrix] = item.getDragContainerMatrix();
    const {
      position,
      alignmentOffset,
      containerOffset,
      elementTransformMatrix,
      elementTransformOrigin,
      elementOffsetMatrix
    } = item;
    const { x: oX, y: oY, z: oZ } = elementTransformOrigin;
    const needsOriginOffset = !elementTransformMatrix.isIdentity && (oX !== 0 || oY !== 0 || oZ !== 0);
    const tX = position.x + alignmentOffset.x + containerOffset.x;
    const tY = position.y + alignmentOffset.y + containerOffset.y;
    resetMatrix(ELEMENT_MATRIX);
    if (needsOriginOffset) {
      if (oZ === 0) {
        ELEMENT_MATRIX.translateSelf(-oX, -oY);
      } else {
        ELEMENT_MATRIX.translateSelf(-oX, -oY, -oZ);
      }
    }
    if (isEndPhase) {
      if (!inverseContainerMatrix.isIdentity) {
        ELEMENT_MATRIX.multiplySelf(inverseContainerMatrix);
      }
    } else {
      if (!inverseDragContainerMatrix.isIdentity) {
        ELEMENT_MATRIX.multiplySelf(inverseDragContainerMatrix);
      }
    }
    resetMatrix(TEMP_MATRIX).translateSelf(tX, tY);
    ELEMENT_MATRIX.multiplySelf(TEMP_MATRIX);
    if (!containerMatrix.isIdentity) {
      ELEMENT_MATRIX.multiplySelf(containerMatrix);
    }
    if (needsOriginOffset) {
      resetMatrix(TEMP_MATRIX).translateSelf(oX, oY, oZ);
      ELEMENT_MATRIX.multiplySelf(TEMP_MATRIX);
    }
    if (!elementTransformMatrix.isIdentity) {
      ELEMENT_MATRIX.multiplySelf(elementTransformMatrix);
    }
    if (!elementOffsetMatrix.isIdentity) {
      ELEMENT_MATRIX.preMultiplySelf(elementOffsetMatrix);
    }
    item.element.style.transform = `${ELEMENT_MATRIX}`;
  },
  computeClientRect: ({ drag }) => {
    return drag.items[0].clientRect || null;
  },
  positionModifiers: [],
  group: null
};
var Draggable = class {
  constructor(sensors, options4 = {}) {
    const { id = Symbol(), ...restOptions } = options4;
    this.id = id;
    this.sensors = sensors;
    this.settings = this._parseSettings(restOptions);
    this.plugins = {};
    this.drag = null;
    this.isDestroyed = false;
    this._sensorData = /* @__PURE__ */ new Map();
    this._emitter = new Emitter3();
    this._startPhase = 0 /* None */;
    this._startId = Symbol();
    this._moveId = Symbol();
    this._alignId = Symbol();
    this._onMove = this._onMove.bind(this);
    this._onScroll = this._onScroll.bind(this);
    this._onEnd = this._onEnd.bind(this);
    this._prepareStart = this._prepareStart.bind(this);
    this._applyStart = this._applyStart.bind(this);
    this._prepareMove = this._prepareMove.bind(this);
    this._applyMove = this._applyMove.bind(this);
    this._prepareAlign = this._prepareAlign.bind(this);
    this._applyAlign = this._applyAlign.bind(this);
    this.sensors.forEach((sensor) => {
      this._sensorData.set(sensor, {
        predicateState: 0 /* Pending */,
        predicateEvent: null,
        onMove: (e) => this._onMove(e, sensor),
        onEnd: (e) => this._onEnd(e, sensor)
      });
      const { onMove, onEnd } = this._sensorData.get(sensor);
      sensor.on(SensorEventType.Start, onMove, onMove);
      sensor.on(SensorEventType.Move, onMove, onMove);
      sensor.on(SensorEventType.Cancel, onEnd, onEnd);
      sensor.on(SensorEventType.End, onEnd, onEnd);
      sensor.on(SensorEventType.Destroy, onEnd, onEnd);
    });
  }
  _parseSettings(options4, defaults = DraggableDefaultSettings) {
    const {
      container = defaults.container,
      startPredicate = defaults.startPredicate,
      elements = defaults.elements,
      frozenStyles = defaults.frozenStyles,
      positionModifiers = defaults.positionModifiers,
      applyPosition = defaults.applyPosition,
      computeClientRect = defaults.computeClientRect,
      group = defaults.group,
      onPrepareStart = defaults.onPrepareStart,
      onStart = defaults.onStart,
      onPrepareMove = defaults.onPrepareMove,
      onMove = defaults.onMove,
      onEnd = defaults.onEnd,
      onDestroy = defaults.onDestroy
    } = options4 || {};
    return {
      container,
      startPredicate,
      elements,
      frozenStyles,
      positionModifiers,
      applyPosition,
      computeClientRect,
      group,
      onPrepareStart,
      onStart,
      onPrepareMove,
      onMove,
      onEnd,
      onDestroy
    };
  }
  _emit(type3, ...e) {
    this._emitter.emit(type3, ...e);
  }
  _onMove(e, sensor) {
    const sensorData = this._sensorData.get(sensor);
    if (!sensorData) return;
    switch (sensorData.predicateState) {
      case 0 /* Pending */: {
        sensorData.predicateEvent = e;
        const shouldStart = this.settings.startPredicate({
          draggable: this,
          sensor,
          event: e
        });
        if (shouldStart === true) {
          this.resolveStartPredicate(sensor);
        } else if (shouldStart === false) {
          this.rejectStartPredicate(sensor);
        }
        break;
      }
      case 1 /* Resolved */: {
        if (this.drag) {
          this.drag.moveEvent = e;
          ticker.once(tickerPhases.read, this._prepareMove, this._moveId);
          ticker.once(tickerPhases.write, this._applyMove, this._moveId);
        }
        break;
      }
    }
  }
  _onScroll() {
    this.align();
  }
  _onEnd(e, sensor) {
    const sensorData = this._sensorData.get(sensor);
    if (!sensorData) return;
    if (!this.drag) {
      sensorData.predicateState = 0 /* Pending */;
      sensorData.predicateEvent = null;
    } else if (sensorData.predicateState === 1 /* Resolved */) {
      this.drag.endEvent = e;
      this._sensorData.forEach((data) => {
        data.predicateState = 0 /* Pending */;
        data.predicateEvent = null;
      });
      this.stop();
    }
  }
  _prepareStart() {
    const drag = this.drag;
    if (!drag) return;
    this._startPhase = 2 /* Prepare */;
    const elements = this.settings.elements({
      draggable: this,
      drag
    }) || [];
    drag.items = elements.map((element) => {
      return new DraggableDragItem(element, this);
    });
    this._applyModifiers(DraggableModifierPhase.Start, 0, 0);
    this._emit(DraggableEventType.PrepareStart, drag.startEvent);
    this.settings.onPrepareStart?.(drag, this);
    this._startPhase = 3 /* FinishPrepare */;
  }
  _applyStart() {
    const drag = this.drag;
    if (!drag) return;
    this._startPhase = 4 /* Apply */;
    for (const item of drag.items) {
      if (item.dragContainer !== item.elementContainer) {
        appendElement(item.element, item.dragContainer);
      }
      if (item.frozenStyles) {
        Object.assign(item.element.style, item.frozenStyles);
      }
      this.settings.applyPosition({
        phase: DraggableApplyPositionPhase.Start,
        draggable: this,
        drag,
        item
      });
    }
    for (const item of drag.items) {
      const containerMatrix = item.getContainerMatrix()[0];
      const dragContainerMatrix = item.getDragContainerMatrix()[0];
      if (areMatricesEqual(containerMatrix, dragContainerMatrix)) {
        continue;
      }
      if (!isMatrixWarped(containerMatrix) && !isMatrixWarped(dragContainerMatrix)) {
        continue;
      }
      const rect = item.element.getBoundingClientRect();
      const { alignmentOffset } = item;
      alignmentOffset.x += roundNumber(item.clientRect.x - rect.x, 3);
      alignmentOffset.y += roundNumber(item.clientRect.y - rect.y, 3);
    }
    for (const item of drag.items) {
      const { alignmentOffset } = item;
      if (alignmentOffset.x !== 0 || alignmentOffset.y !== 0) {
        this.settings.applyPosition({
          phase: DraggableApplyPositionPhase.StartAlign,
          draggable: this,
          drag,
          item
        });
      }
    }
    window.addEventListener("scroll", this._onScroll, SCROLL_LISTENER_OPTIONS);
    this._emit(DraggableEventType.Start, drag.startEvent);
    this.settings.onStart?.(drag, this);
    this._startPhase = 5 /* FinishApply */;
  }
  _prepareMove() {
    const drag = this.drag;
    if (!drag) return;
    const { moveEvent, prevMoveEvent } = drag;
    if (moveEvent === prevMoveEvent) return;
    this._applyModifiers(
      DraggableModifierPhase.Move,
      moveEvent.x - prevMoveEvent.x,
      moveEvent.y - prevMoveEvent.y
    );
    this._emit(DraggableEventType.PrepareMove, moveEvent);
    if (drag.isEnded) return;
    this.settings.onPrepareMove?.(drag, this);
    if (drag.isEnded) return;
    drag.prevMoveEvent = moveEvent;
  }
  _applyMove() {
    const drag = this.drag;
    if (!drag) return;
    for (const item of drag.items) {
      item["_moveDiff"].x = 0;
      item["_moveDiff"].y = 0;
      this.settings.applyPosition({
        phase: DraggableApplyPositionPhase.Move,
        draggable: this,
        drag,
        item
      });
    }
    this._emit(DraggableEventType.Move, drag.moveEvent);
    if (drag.isEnded) return;
    this.settings.onMove?.(drag, this);
  }
  _prepareAlign() {
    const { drag } = this;
    if (!drag) return;
    for (const item of drag.items) {
      const { x, y } = item.element.getBoundingClientRect();
      const alignDiffX = item.clientRect.x - item["_moveDiff"].x - x;
      item.alignmentOffset.x = item.alignmentOffset.x - item["_alignDiff"].x + alignDiffX;
      item["_alignDiff"].x = alignDiffX;
      const alignDiffY = item.clientRect.y - item["_moveDiff"].y - y;
      item.alignmentOffset.y = item.alignmentOffset.y - item["_alignDiff"].y + alignDiffY;
      item["_alignDiff"].y = alignDiffY;
    }
  }
  _applyAlign() {
    const { drag } = this;
    if (!drag) return;
    for (const item of drag.items) {
      item["_alignDiff"].x = 0;
      item["_alignDiff"].y = 0;
      this.settings.applyPosition({
        phase: DraggableApplyPositionPhase.Align,
        draggable: this,
        drag,
        item
      });
    }
  }
  _applyModifiers(phase, changeX, changeY) {
    const { drag } = this;
    if (!drag) return;
    const { positionModifiers } = this.settings;
    for (const item of drag.items) {
      let positionChange = POSITION_CHANGE;
      positionChange.x = changeX;
      positionChange.y = changeY;
      for (const modifier of positionModifiers) {
        positionChange = modifier(positionChange, {
          draggable: this,
          drag,
          item,
          phase
        });
      }
      item.position.x += positionChange.x;
      item.position.y += positionChange.y;
      item.clientRect.x += positionChange.x;
      item.clientRect.y += positionChange.y;
      if (phase === "move") {
        item["_moveDiff"].x += positionChange.x;
        item["_moveDiff"].y += positionChange.y;
      }
    }
  }
  on(type3, listener, listenerId) {
    return this._emitter.on(type3, listener, listenerId);
  }
  off(type3, listenerId) {
    this._emitter.off(type3, listenerId);
  }
  resolveStartPredicate(sensor, e) {
    const sensorData = this._sensorData.get(sensor);
    if (!sensorData) return;
    const startEvent = e || sensorData.predicateEvent;
    if (sensorData.predicateState === 0 /* Pending */ && startEvent) {
      this._startPhase = 1 /* Init */;
      sensorData.predicateState = 1 /* Resolved */;
      sensorData.predicateEvent = null;
      this.drag = new DraggableDrag(sensor, startEvent);
      this._sensorData.forEach((data, s) => {
        if (s === sensor) return;
        data.predicateState = 2 /* Rejected */;
        data.predicateEvent = null;
      });
      ticker.once(tickerPhases.read, this._prepareStart, this._startId);
      ticker.once(tickerPhases.write, this._applyStart, this._startId);
    }
  }
  rejectStartPredicate(sensor) {
    const sensorData = this._sensorData.get(sensor);
    if (sensorData?.predicateState === 0 /* Pending */) {
      sensorData.predicateState = 2 /* Rejected */;
      sensorData.predicateEvent = null;
    }
  }
  stop() {
    const drag = this.drag;
    if (!drag || drag.isEnded) return;
    const startPhase = this._startPhase;
    if (startPhase === 2 /* Prepare */ || startPhase === 4 /* Apply */) {
      throw new Error("Cannot stop drag start process at this point");
    }
    this._startPhase = 0 /* None */;
    drag.isEnded = true;
    ticker.off(tickerPhases.read, this._startId);
    ticker.off(tickerPhases.write, this._startId);
    ticker.off(tickerPhases.read, this._moveId);
    ticker.off(tickerPhases.write, this._moveId);
    ticker.off(tickerPhases.read, this._alignId);
    ticker.off(tickerPhases.write, this._alignId);
    window.removeEventListener("scroll", this._onScroll, SCROLL_LISTENER_OPTIONS);
    if (startPhase > 1 /* Init */) {
      this._applyModifiers(DraggableModifierPhase.End, 0, 0);
    }
    if (startPhase === 5 /* FinishApply */) {
      for (const item of drag.items) {
        if (item.elementContainer !== item.dragContainer) {
          appendElement(item.element, item.elementContainer);
          item.alignmentOffset.x = 0;
          item.alignmentOffset.y = 0;
          item.containerOffset.x = 0;
          item.containerOffset.y = 0;
        }
        if (item.unfrozenStyles) {
          for (const key in item.unfrozenStyles) {
            item.element.style[key] = item.unfrozenStyles[key] || "";
          }
        }
        this.settings.applyPosition({
          phase: DraggableApplyPositionPhase.End,
          draggable: this,
          drag,
          item
        });
      }
      for (const item of drag.items) {
        if (item.elementContainer !== item.dragContainer) {
          const itemRect = item.element.getBoundingClientRect();
          item.alignmentOffset.x = roundNumber(item.clientRect.x - itemRect.x, 3);
          item.alignmentOffset.y = roundNumber(item.clientRect.y - itemRect.y, 3);
        }
      }
      for (const item of drag.items) {
        if (item.elementContainer !== item.dragContainer && (item.alignmentOffset.x !== 0 || item.alignmentOffset.y !== 0)) {
          this.settings.applyPosition({
            phase: DraggableApplyPositionPhase.EndAlign,
            draggable: this,
            drag,
            item
          });
        }
      }
    } else if (startPhase === 3 /* FinishPrepare */) {
      for (const item of drag.items) {
        item.clientRect.x -= item.position.x;
        item.clientRect.y -= item.position.y;
        item.position.x = 0;
        item.position.y = 0;
        if (item.elementContainer !== item.dragContainer) {
          item.alignmentOffset.x = 0;
          item.alignmentOffset.y = 0;
          item.containerOffset.x = 0;
          item.containerOffset.y = 0;
        }
      }
    }
    this._emit(DraggableEventType.End, drag.endEvent);
    this.settings.onEnd?.(drag, this);
    this.drag = null;
  }
  align(instant = false) {
    if (!this.drag) return;
    if (instant) {
      this._prepareAlign();
      this._applyAlign();
    } else {
      ticker.once(tickerPhases.read, this._prepareAlign, this._alignId);
      ticker.once(tickerPhases.write, this._applyAlign, this._alignId);
    }
  }
  getClientRect() {
    const { drag, settings } = this;
    if (!drag) return null;
    return settings.computeClientRect?.({ draggable: this, drag }) || null;
  }
  updateSettings(options4 = {}) {
    this.settings = this._parseSettings(options4, this.settings);
  }
  use(plugin) {
    return plugin(this);
  }
  destroy() {
    if (this.isDestroyed) return;
    this.isDestroyed = true;
    this.stop();
    this._sensorData.forEach(({ onMove, onEnd }, sensor) => {
      sensor.off(SensorEventType.Start, onMove);
      sensor.off(SensorEventType.Move, onMove);
      sensor.off(SensorEventType.Cancel, onEnd);
      sensor.off(SensorEventType.End, onEnd);
      sensor.off(SensorEventType.Destroy, onEnd);
    });
    this._sensorData.clear();
    this._emit(DraggableEventType.Destroy);
    this.settings.onDestroy?.(this);
    this._emitter.off();
  }
};

// src/utils/is-document.ts
function isDocument(value) {
  return value instanceof Document;
}

// src/utils/create-full-rect.ts
function createFullRect(sourceRect, result = { width: 0, height: 0, x: 0, y: 0, left: 0, top: 0, right: 0, bottom: 0 }) {
  if (sourceRect) {
    result.width = sourceRect.width;
    result.height = sourceRect.height;
    result.x = sourceRect.x;
    result.y = sourceRect.y;
    result.left = sourceRect.x;
    result.top = sourceRect.y;
    result.right = sourceRect.x + sourceRect.width;
    result.bottom = sourceRect.y + sourceRect.height;
  }
  return result;
}

// src/draggable/modifiers/create-containment-modifier.ts
var TEMP_RECT_1 = createFullRect();
var TEMP_RECT_2 = createFullRect();

// src/utils/classic-object-pool.ts
var ClassicObjectPool = class {
  constructor(getItem, {
    batchSize = 100,
    minBatchCount = 0,
    maxBatchCount = Number.MAX_SAFE_INTEGER,
    initialBatchCount = 0,
    shrinkThreshold = 2,
    onRelease
  } = {}) {
    this._batchSize = Math.floor(Math.max(batchSize, 1));
    this._minSize = Math.floor(Math.max(minBatchCount, 0)) * this._batchSize;
    this._maxSize = Math.floor(
      Math.min(Math.max(maxBatchCount * this._batchSize, this._batchSize), Number.MAX_SAFE_INTEGER)
    );
    this._shrinkThreshold = Math.floor(Math.max(shrinkThreshold, 1) * this._batchSize);
    this._data = new Array(
      Math.floor(Math.max(Math.max(initialBatchCount, minBatchCount) * this._batchSize, 0))
    );
    this._index = 0;
    this._getItem = getItem;
    this._onRelease = onRelease;
  }
  get(...args) {
    if (this._index > 0) {
      return this._getItem(this._data[--this._index], ...args);
    }
    if (this._index === 0) {
      const currentCapacity = this._data.length;
      const growBy = Math.min(this._batchSize, this._maxSize - currentCapacity);
      if (growBy > 0) {
        this._data.length = currentCapacity + growBy;
      }
    }
    return this._getItem(void 0, ...args);
  }
  release(object) {
    if (this._index < this._maxSize) {
      if (this._onRelease) {
        this._onRelease(object);
      }
      this._data[this._index++] = object;
      if (this._index >= this._shrinkThreshold) {
        const newCapacity = this._data.length - this._batchSize;
        if (newCapacity >= this._minSize) {
          this._data.length = newCapacity;
          this._index -= this._batchSize;
        }
      }
    }
  }
  destroy() {
    this._data.length = 0;
    this._index = 0;
  }
};

// src/utils/get-distance.ts
import { getDistance as _getDistance } from "mezr";
var RECT_A = createFullRect();
var RECT_B = createFullRect();
function getDistance(a, b) {
  return _getDistance(createFullRect(a, RECT_A), createFullRect(b, RECT_B));
}

// src/utils/get-intersection-rect.ts
function getIntersectionRect(a, b, result = { width: 0, height: 0, x: 0, y: 0 }) {
  const x1 = Math.max(a.x, b.x);
  const x2 = Math.min(a.x + a.width, b.x + b.width);
  if (x2 <= x1) return null;
  const y1 = Math.max(a.y, b.y);
  const y2 = Math.min(a.y + a.height, b.y + b.height);
  if (y2 <= y1) return null;
  result.x = x1;
  result.y = y1;
  result.width = x2 - x1;
  result.height = y2 - y1;
  return result;
}

// src/utils/get-intersection-score.ts
var TEMP_RECT = { width: 0, height: 0, x: 0, y: 0 };
function getIntersectionScore(a, b, intersectionRect) {
  if (!intersectionRect) intersectionRect = getIntersectionRect(a, b, TEMP_RECT);
  if (!intersectionRect) return 0;
  const area = intersectionRect.width * intersectionRect.height;
  if (!area) return 0;
  const maxArea = Math.min(a.width, b.width) * Math.min(a.height, b.height);
  return area / maxArea * 100;
}

// src/utils/get-rect.ts
import { getRect as mezrGetRect } from "mezr";
function getRect(...args) {
  const { width, height, left: x, top: y } = mezrGetRect(...args);
  return { width, height, x, y };
}

// src/utils/is-window.ts
function isWindow(value) {
  return value instanceof Window;
}

// src/utils/get-scroll-element.ts
function getScrollElement(element) {
  if (isWindow(element) || element === document.documentElement || element === document.body) {
    return window;
  } else {
    return element;
  }
}

// src/utils/get-scroll-left.ts
function getScrollLeft(element) {
  return isWindow(element) ? element.scrollX : element.scrollLeft;
}

// src/utils/get-scroll-left-max.ts
function getScrollLeftMax(element) {
  if (isWindow(element)) element = document.documentElement;
  return element.scrollWidth - element.clientWidth;
}

// src/utils/get-scroll-top.ts
function getScrollTop(element) {
  return isWindow(element) ? element.scrollY : element.scrollTop;
}

// src/utils/get-scroll-top-max.ts
function getScrollTopMax(element) {
  if (isWindow(element)) element = document.documentElement;
  return element.scrollHeight - element.clientHeight;
}

// src/utils/is-intersecting.ts
function isIntersecting(a, b) {
  return !(a.x + a.width <= b.x || b.x + b.width <= a.x || a.y + a.height <= b.y || b.y + b.height <= a.y);
}

// src/auto-scroll/auto-scroll.ts
var TEMP_RECT2 = {
  width: 0,
  height: 0,
  x: 0,
  y: 0
};
var DEFAULT_THRESHOLD = 50;
var SPEED_DATA = {
  direction: "none",
  threshold: 0,
  distance: 0,
  value: 0,
  maxValue: 0,
  duration: 0,
  speed: 0,
  deltaTime: 0,
  isEnding: false
};
var AUTO_SCROLL_AXIS = {
  x: 1,
  y: 2
};
var AUTO_SCROLL_AXIS_DIRECTION = {
  forward: 4,
  reverse: 8
};
var AUTO_SCROLL_DIRECTION_X = {
  none: 0,
  left: AUTO_SCROLL_AXIS.x | AUTO_SCROLL_AXIS_DIRECTION.reverse,
  right: AUTO_SCROLL_AXIS.x | AUTO_SCROLL_AXIS_DIRECTION.forward
};
var AUTO_SCROLL_DIRECTION_Y = {
  none: 0,
  up: AUTO_SCROLL_AXIS.y | AUTO_SCROLL_AXIS_DIRECTION.reverse,
  down: AUTO_SCROLL_AXIS.y | AUTO_SCROLL_AXIS_DIRECTION.forward
};
var AUTO_SCROLL_DIRECTION = {
  ...AUTO_SCROLL_DIRECTION_X,
  ...AUTO_SCROLL_DIRECTION_Y
};
function getDirectionAsString(direction) {
  switch (direction) {
    case AUTO_SCROLL_DIRECTION_X.none:
    case AUTO_SCROLL_DIRECTION_Y.none:
      return "none";
    case AUTO_SCROLL_DIRECTION_X.left:
      return "left";
    case AUTO_SCROLL_DIRECTION_X.right:
      return "right";
    case AUTO_SCROLL_DIRECTION_Y.up:
      return "up";
    case AUTO_SCROLL_DIRECTION_Y.down:
      return "down";
    default:
      throw new Error(`Unknown direction value: ${direction}`);
  }
}
function getPaddedRect(rect, padding, result) {
  let { left = 0, right = 0, top = 0, bottom = 0 } = padding;
  left = Math.max(0, left);
  right = Math.max(0, right);
  top = Math.max(0, top);
  bottom = Math.max(0, bottom);
  result.width = rect.width + left + right;
  result.height = rect.height + top + bottom;
  result.x = rect.x - left;
  result.y = rect.y - top;
  return result;
}
function isScrolledToMax(scrollValue, maxScrollValue) {
  return Math.ceil(scrollValue) >= Math.floor(maxScrollValue);
}
function computeThreshold(idealThreshold, targetSize) {
  return Math.min(targetSize / 2, idealThreshold);
}
function computeEdgeOffset(threshold, inertAreaSize, itemSize, targetSize) {
  return Math.max(0, itemSize + threshold * 2 + targetSize * inertAreaSize - targetSize) / 2;
}
var AutoScrollItemData = class {
  constructor() {
    this.positionX = 0;
    this.positionY = 0;
    this.directionX = AUTO_SCROLL_DIRECTION.none;
    this.directionY = AUTO_SCROLL_DIRECTION.none;
    this.overlapCheckRequestTime = 0;
  }
};
var AutoScrollAction = class {
  constructor() {
    this.element = null;
    this.requestX = null;
    this.requestY = null;
    this.scrollLeft = 0;
    this.scrollTop = 0;
  }
  reset() {
    if (this.requestX) this.requestX.action = null;
    if (this.requestY) this.requestY.action = null;
    this.element = null;
    this.requestX = null;
    this.requestY = null;
    this.scrollLeft = 0;
    this.scrollTop = 0;
  }
  addRequest(request) {
    if (AUTO_SCROLL_AXIS.x & request.direction) {
      this.requestX && this.removeRequest(this.requestX);
      this.requestX = request;
    } else {
      this.requestY && this.removeRequest(this.requestY);
      this.requestY = request;
    }
    request.action = this;
  }
  removeRequest(request) {
    if (this.requestX === request) {
      this.requestX = null;
      request.action = null;
    } else if (this.requestY === request) {
      this.requestY = null;
      request.action = null;
    }
  }
  computeScrollValues() {
    if (!this.element) return;
    this.scrollLeft = this.requestX ? this.requestX.value : getScrollLeft(this.element);
    this.scrollTop = this.requestY ? this.requestY.value : getScrollTop(this.element);
  }
  scroll() {
    if (!this.element) return;
    if (this.element.scrollTo) {
      this.element.scrollTo(this.scrollLeft, this.scrollTop);
    } else {
      this.element.scrollLeft = this.scrollLeft;
      this.element.scrollTop = this.scrollTop;
    }
  }
};
var AutoScrollRequest = class {
  constructor() {
    this.item = null;
    this.element = null;
    this.isActive = false;
    this.isEnding = false;
    this.direction = 0;
    this.value = NaN;
    this.maxValue = 0;
    this.threshold = 0;
    this.distance = 0;
    this.deltaTime = 0;
    this.speed = 0;
    this.duration = 0;
    this.action = null;
  }
  reset() {
    if (this.isActive) this.onStop();
    this.item = null;
    this.element = null;
    this.isActive = false;
    this.isEnding = false;
    this.direction = 0;
    this.value = NaN;
    this.maxValue = 0;
    this.threshold = 0;
    this.distance = 0;
    this.deltaTime = 0;
    this.speed = 0;
    this.duration = 0;
    this.action = null;
  }
  hasReachedEnd() {
    return AUTO_SCROLL_AXIS_DIRECTION.forward & this.direction ? isScrolledToMax(this.value, this.maxValue) : this.value <= 0;
  }
  computeCurrentScrollValue() {
    if (!this.element) return 0;
    if (this.value !== this.value) {
      return AUTO_SCROLL_AXIS.x & this.direction ? getScrollLeft(this.element) : getScrollTop(this.element);
    }
    return Math.max(0, Math.min(this.value, this.maxValue));
  }
  computeNextScrollValue() {
    const delta = this.speed * (this.deltaTime / 1e3);
    const nextValue = AUTO_SCROLL_AXIS_DIRECTION.forward & this.direction ? this.value + delta : this.value - delta;
    return Math.max(0, Math.min(nextValue, this.maxValue));
  }
  computeSpeed() {
    if (!this.item || !this.element) return 0;
    const { speed } = this.item;
    if (typeof speed === "function") {
      SPEED_DATA.direction = getDirectionAsString(this.direction);
      SPEED_DATA.threshold = this.threshold;
      SPEED_DATA.distance = this.distance;
      SPEED_DATA.value = this.value;
      SPEED_DATA.maxValue = this.maxValue;
      SPEED_DATA.duration = this.duration;
      SPEED_DATA.speed = this.speed;
      SPEED_DATA.deltaTime = this.deltaTime;
      SPEED_DATA.isEnding = this.isEnding;
      return speed(this.element, SPEED_DATA);
    } else {
      return speed;
    }
  }
  tick(deltaTime) {
    if (!this.isActive) {
      this.isActive = true;
      this.onStart();
    }
    this.deltaTime = deltaTime;
    this.value = this.computeCurrentScrollValue();
    this.speed = this.computeSpeed();
    this.value = this.computeNextScrollValue();
    this.duration += deltaTime;
    return this.value;
  }
  onStart() {
    if (!this.item || !this.element) return;
    const { onStart } = this.item;
    if (typeof onStart === "function") {
      onStart(this.element, getDirectionAsString(this.direction));
    }
  }
  onStop() {
    if (!this.item || !this.element) return;
    const { onStop } = this.item;
    if (typeof onStop === "function") {
      onStop(this.element, getDirectionAsString(this.direction));
    }
  }
};
var AutoScroll = class {
  constructor(options4 = {}) {
    const { overlapCheckInterval = 150 } = options4;
    this.items = [];
    this.settings = {
      overlapCheckInterval
    };
    this._actions = [];
    this._isDestroyed = false;
    this._isTicking = false;
    this._tickTime = 0;
    this._tickDeltaTime = 0;
    this._requests = {
      [AUTO_SCROLL_AXIS.x]: /* @__PURE__ */ new Map(),
      [AUTO_SCROLL_AXIS.y]: /* @__PURE__ */ new Map()
    };
    this._itemData = /* @__PURE__ */ new Map();
    this._requestPool = new ClassicObjectPool(
      (request) => request || new AutoScrollRequest(),
      {
        initialBatchCount: 1,
        minBatchCount: 1,
        onRelease: (request) => request.reset()
      }
    );
    this._actionPool = new ClassicObjectPool(
      (action) => action || new AutoScrollAction(),
      {
        batchSize: 10,
        initialBatchCount: 1,
        minBatchCount: 1,
        onRelease: (action) => action.reset()
      }
    );
    this._frameRead = this._frameRead.bind(this);
    this._frameWrite = this._frameWrite.bind(this);
  }
  _frameRead(time) {
    if (this._isDestroyed) return;
    if (time && this._tickTime) {
      this._tickDeltaTime = time - this._tickTime;
      this._tickTime = time;
      this._updateItems();
      this._updateRequests();
      this._updateActions();
    } else {
      this._tickTime = time;
      this._tickDeltaTime = 0;
    }
  }
  _frameWrite() {
    if (this._isDestroyed) return;
    this._applyActions();
  }
  _startTicking() {
    if (this._isTicking) return;
    this._isTicking = true;
    ticker.on(tickerPhases.read, this._frameRead, this._frameRead);
    ticker.on(tickerPhases.write, this._frameWrite, this._frameWrite);
  }
  _stopTicking() {
    if (!this._isTicking) return;
    this._isTicking = false;
    this._tickTime = 0;
    this._tickDeltaTime = 0;
    ticker.off(tickerPhases.read, this._frameRead);
    ticker.off(tickerPhases.write, this._frameWrite);
  }
  _requestItemScroll(item, axis, element, direction, threshold, distance, maxValue) {
    const reqMap = this._requests[axis];
    let request = reqMap.get(item);
    if (request) {
      if (request.element !== element || request.direction !== direction) {
        request.reset();
      }
    } else {
      request = this._requestPool.get();
      reqMap.set(item, request);
    }
    request.item = item;
    request.element = element;
    request.direction = direction;
    request.threshold = threshold;
    request.distance = distance;
    request.maxValue = maxValue;
  }
  _cancelItemScroll(item, axis) {
    const reqMap = this._requests[axis];
    const request = reqMap.get(item);
    if (!request) return;
    if (request.action) request.action.removeRequest(request);
    this._requestPool.release(request);
    reqMap.delete(item);
  }
  _checkItemOverlap(item, checkX, checkY) {
    const { inertAreaSize, targets, clientRect } = item;
    if (!targets.length) {
      checkX && this._cancelItemScroll(item, AUTO_SCROLL_AXIS.x);
      checkY && this._cancelItemScroll(item, AUTO_SCROLL_AXIS.y);
      return;
    }
    const itemData = this._itemData.get(item);
    const moveDirectionX = itemData?.directionX;
    const moveDirectionY = itemData?.directionY;
    if (!moveDirectionX && !moveDirectionY) {
      checkX && this._cancelItemScroll(item, AUTO_SCROLL_AXIS.x);
      checkY && this._cancelItemScroll(item, AUTO_SCROLL_AXIS.y);
      return;
    }
    let xElement = null;
    let xPriority = -Infinity;
    let xThreshold = 0;
    let xScore = -Infinity;
    let xDirection = AUTO_SCROLL_DIRECTION.none;
    let xDistance = 0;
    let xMaxScroll = 0;
    let yElement = null;
    let yPriority = -Infinity;
    let yThreshold = 0;
    let yScore = -Infinity;
    let yDirection = AUTO_SCROLL_DIRECTION.none;
    let yDistance = 0;
    let yMaxScroll = 0;
    let i = 0;
    for (; i < targets.length; i++) {
      const target = targets[i];
      const targetThreshold = typeof target.threshold === "number" ? target.threshold : DEFAULT_THRESHOLD;
      const testAxisX = !!(checkX && moveDirectionX && target.axis !== "y");
      const testAxisY = !!(checkY && moveDirectionY && target.axis !== "x");
      const testPriority = target.priority || 0;
      if ((!testAxisX || testPriority < xPriority) && (!testAxisY || testPriority < yPriority)) {
        continue;
      }
      const testElement = getScrollElement(target.element || target);
      const testMaxScrollX = testAxisX ? getScrollLeftMax(testElement) : -1;
      const testMaxScrollY = testAxisY ? getScrollTopMax(testElement) : -1;
      if (testMaxScrollX <= 0 && testMaxScrollY <= 0) continue;
      const testRect = getRect([testElement, "padding"], window);
      let testScore = getIntersectionScore(clientRect, testRect) || -Infinity;
      if (testScore === -Infinity) {
        if (target.padding && isIntersecting(clientRect, getPaddedRect(testRect, target.padding, TEMP_RECT2))) {
          testScore = -(getDistance(clientRect, testRect) || 0);
        } else {
          continue;
        }
      }
      if (testAxisX && testPriority >= xPriority && testMaxScrollX > 0 && (testPriority > xPriority || testScore > xScore)) {
        let testDistance = 0;
        let testDirection = AUTO_SCROLL_DIRECTION.none;
        const testThreshold = computeThreshold(targetThreshold, testRect.width);
        const testEdgeOffset = computeEdgeOffset(
          testThreshold,
          inertAreaSize,
          clientRect.width,
          testRect.width
        );
        if (moveDirectionX === AUTO_SCROLL_DIRECTION.right) {
          testDistance = testRect.x + testRect.width + testEdgeOffset - (clientRect.x + clientRect.width);
          if (testDistance <= testThreshold && !isScrolledToMax(getScrollLeft(testElement), testMaxScrollX)) {
            testDirection = AUTO_SCROLL_DIRECTION.right;
          }
        } else if (moveDirectionX === AUTO_SCROLL_DIRECTION.left) {
          testDistance = clientRect.x - (testRect.x - testEdgeOffset);
          if (testDistance <= testThreshold && getScrollLeft(testElement) > 0) {
            testDirection = AUTO_SCROLL_DIRECTION.left;
          }
        }
        if (testDirection) {
          xElement = testElement;
          xPriority = testPriority;
          xThreshold = testThreshold;
          xScore = testScore;
          xDirection = testDirection;
          xDistance = testDistance;
          xMaxScroll = testMaxScrollX;
        }
      }
      if (testAxisY && testPriority >= yPriority && testMaxScrollY > 0 && (testPriority > yPriority || testScore > yScore)) {
        let testDistance = 0;
        let testDirection = AUTO_SCROLL_DIRECTION_Y.none;
        const testThreshold = computeThreshold(targetThreshold, testRect.height);
        const testEdgeOffset = computeEdgeOffset(
          testThreshold,
          inertAreaSize,
          clientRect.height,
          testRect.height
        );
        if (moveDirectionY === AUTO_SCROLL_DIRECTION.down) {
          testDistance = testRect.y + testRect.height + testEdgeOffset - (clientRect.y + clientRect.height);
          if (testDistance <= testThreshold && !isScrolledToMax(getScrollTop(testElement), testMaxScrollY)) {
            testDirection = AUTO_SCROLL_DIRECTION.down;
          }
        } else if (moveDirectionY === AUTO_SCROLL_DIRECTION.up) {
          testDistance = clientRect.y - (testRect.y - testEdgeOffset);
          if (testDistance <= testThreshold && getScrollTop(testElement) > 0) {
            testDirection = AUTO_SCROLL_DIRECTION.up;
          }
        }
        if (testDirection) {
          yElement = testElement;
          yPriority = testPriority;
          yThreshold = testThreshold;
          yScore = testScore;
          yDirection = testDirection;
          yDistance = testDistance;
          yMaxScroll = testMaxScrollY;
        }
      }
    }
    if (checkX) {
      if (xElement && xDirection) {
        this._requestItemScroll(
          item,
          AUTO_SCROLL_AXIS.x,
          xElement,
          xDirection,
          xThreshold,
          xDistance,
          xMaxScroll
        );
      } else {
        this._cancelItemScroll(item, AUTO_SCROLL_AXIS.x);
      }
    }
    if (checkY) {
      if (yElement && yDirection) {
        this._requestItemScroll(
          item,
          AUTO_SCROLL_AXIS.y,
          yElement,
          yDirection,
          yThreshold,
          yDistance,
          yMaxScroll
        );
      } else {
        this._cancelItemScroll(item, AUTO_SCROLL_AXIS.y);
      }
    }
  }
  _updateScrollRequest(scrollRequest) {
    const item = scrollRequest.item;
    const { inertAreaSize, smoothStop, targets, clientRect } = item;
    let hasReachedEnd = null;
    let i = 0;
    for (; i < targets.length; i++) {
      const target = targets[i];
      const testElement = getScrollElement(target.element || target);
      if (testElement !== scrollRequest.element) continue;
      const testIsAxisX = !!(AUTO_SCROLL_AXIS.x & scrollRequest.direction);
      if (testIsAxisX) {
        if (target.axis === "y") continue;
      } else {
        if (target.axis === "x") continue;
      }
      const testMaxScroll = testIsAxisX ? getScrollLeftMax(testElement) : getScrollTopMax(testElement);
      if (testMaxScroll <= 0) {
        break;
      }
      const testRect = getRect([testElement, "padding"], window);
      const testScore = getIntersectionScore(clientRect, testRect) || -Infinity;
      if (testScore === -Infinity) {
        const padding = target.scrollPadding || target.padding;
        if (!(padding && isIntersecting(clientRect, getPaddedRect(testRect, padding, TEMP_RECT2)))) {
          break;
        }
      }
      const targetThreshold = typeof target.threshold === "number" ? target.threshold : DEFAULT_THRESHOLD;
      const testThreshold = computeThreshold(
        targetThreshold,
        testIsAxisX ? testRect.width : testRect.height
      );
      const testEdgeOffset = computeEdgeOffset(
        testThreshold,
        inertAreaSize,
        testIsAxisX ? clientRect.width : clientRect.height,
        testIsAxisX ? testRect.width : testRect.height
      );
      let testDistance = 0;
      if (scrollRequest.direction === AUTO_SCROLL_DIRECTION.left) {
        testDistance = clientRect.x - (testRect.x - testEdgeOffset);
      } else if (scrollRequest.direction === AUTO_SCROLL_DIRECTION.right) {
        testDistance = testRect.x + testRect.width + testEdgeOffset - (clientRect.x + clientRect.width);
      } else if (scrollRequest.direction === AUTO_SCROLL_DIRECTION.up) {
        testDistance = clientRect.y - (testRect.y - testEdgeOffset);
      } else {
        testDistance = testRect.y + testRect.height + testEdgeOffset - (clientRect.y + clientRect.height);
      }
      if (testDistance > testThreshold) {
        break;
      }
      const testScroll = testIsAxisX ? getScrollLeft(testElement) : getScrollTop(testElement);
      hasReachedEnd = AUTO_SCROLL_AXIS_DIRECTION.forward & scrollRequest.direction ? isScrolledToMax(testScroll, testMaxScroll) : testScroll <= 0;
      if (hasReachedEnd) break;
      scrollRequest.maxValue = testMaxScroll;
      scrollRequest.threshold = testThreshold;
      scrollRequest.distance = testDistance;
      scrollRequest.isEnding = false;
      return true;
    }
    if (smoothStop === true && scrollRequest.speed > 0) {
      if (hasReachedEnd === null) hasReachedEnd = scrollRequest.hasReachedEnd();
      scrollRequest.isEnding = hasReachedEnd ? false : true;
    } else {
      scrollRequest.isEnding = false;
    }
    return scrollRequest.isEnding;
  }
  _updateItems() {
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      const itemData = this._itemData.get(item);
      const { x, y } = item.position;
      const prevX = itemData.positionX;
      const prevY = itemData.positionY;
      if (x === prevX && y === prevY) {
        continue;
      }
      itemData.directionX = x > prevX ? AUTO_SCROLL_DIRECTION.right : x < prevX ? AUTO_SCROLL_DIRECTION.left : itemData.directionX;
      itemData.directionY = y > prevY ? AUTO_SCROLL_DIRECTION.down : y < prevY ? AUTO_SCROLL_DIRECTION.up : itemData.directionY;
      itemData.positionX = x;
      itemData.positionY = y;
      if (itemData.overlapCheckRequestTime === 0) {
        itemData.overlapCheckRequestTime = this._tickTime;
      }
    }
  }
  _updateRequests() {
    const items = this.items;
    const requestsX = this._requests[AUTO_SCROLL_AXIS.x];
    const requestsY = this._requests[AUTO_SCROLL_AXIS.y];
    let i = 0;
    for (; i < items.length; i++) {
      const item = items[i];
      const itemData = this._itemData.get(item);
      const checkTime = itemData.overlapCheckRequestTime;
      let needsCheck = checkTime > 0 && this._tickTime - checkTime > this.settings.overlapCheckInterval;
      let checkX = true;
      const reqX = requestsX.get(item);
      if (reqX && reqX.isActive) {
        checkX = !this._updateScrollRequest(reqX);
        if (checkX) {
          needsCheck = true;
          this._cancelItemScroll(item, AUTO_SCROLL_AXIS.x);
        }
      }
      let checkY = true;
      const reqY = requestsY.get(item);
      if (reqY && reqY.isActive) {
        checkY = !this._updateScrollRequest(reqY);
        if (checkY) {
          needsCheck = true;
          this._cancelItemScroll(item, AUTO_SCROLL_AXIS.y);
        }
      }
      if (needsCheck) {
        itemData.overlapCheckRequestTime = 0;
        this._checkItemOverlap(item, checkX, checkY);
      }
    }
  }
  _requestAction(request, axis) {
    const isAxisX = axis === AUTO_SCROLL_AXIS.x;
    let action = null;
    let i = 0;
    for (; i < this._actions.length; i++) {
      action = this._actions[i];
      if (request.element !== action.element) {
        action = null;
        continue;
      }
      if (isAxisX ? action.requestX : action.requestY) {
        this._cancelItemScroll(request.item, axis);
        return;
      }
      break;
    }
    if (!action) action = this._actionPool.get();
    action.element = request.element;
    action.addRequest(request);
    request.tick(this._tickDeltaTime);
    this._actions.push(action);
  }
  _updateActions() {
    let i = 0;
    for (i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      const reqX = this._requests[AUTO_SCROLL_AXIS.x].get(item);
      const reqY = this._requests[AUTO_SCROLL_AXIS.y].get(item);
      if (reqX) this._requestAction(reqX, AUTO_SCROLL_AXIS.x);
      if (reqY) this._requestAction(reqY, AUTO_SCROLL_AXIS.y);
    }
    for (i = 0; i < this._actions.length; i++) {
      this._actions[i].computeScrollValues();
    }
  }
  _applyActions() {
    if (!this._actions.length) return;
    let i = 0;
    for (i = 0; i < this._actions.length; i++) {
      this._actions[i].scroll();
      this._actionPool.release(this._actions[i]);
    }
    this._actions.length = 0;
  }
  addItem(item) {
    if (this._isDestroyed || this._itemData.has(item)) return;
    const { x, y } = item.position;
    const itemData = new AutoScrollItemData();
    itemData.positionX = x;
    itemData.positionY = y;
    itemData.directionX = AUTO_SCROLL_DIRECTION.none;
    itemData.directionY = AUTO_SCROLL_DIRECTION.none;
    itemData.overlapCheckRequestTime = this._tickTime;
    this._itemData.set(item, itemData);
    this.items.push(item);
    if (!this._isTicking) this._startTicking();
  }
  removeItem(item) {
    if (this._isDestroyed) return;
    const index = this.items.indexOf(item);
    if (index === -1) return;
    if (this._requests[AUTO_SCROLL_AXIS.x].get(item)) {
      this._cancelItemScroll(item, AUTO_SCROLL_AXIS.x);
      this._requests[AUTO_SCROLL_AXIS.x].delete(item);
    }
    if (this._requests[AUTO_SCROLL_AXIS.y].get(item)) {
      this._cancelItemScroll(item, AUTO_SCROLL_AXIS.y);
      this._requests[AUTO_SCROLL_AXIS.y].delete(item);
    }
    this._itemData.delete(item);
    this.items.splice(index, 1);
    if (this._isTicking && !this.items.length) {
      this._stopTicking();
    }
  }
  isDestroyed() {
    return this._isDestroyed;
  }
  isItemScrollingX(item) {
    return !!this._requests[AUTO_SCROLL_AXIS.x].get(item)?.isActive;
  }
  isItemScrollingY(item) {
    return !!this._requests[AUTO_SCROLL_AXIS.y].get(item)?.isActive;
  }
  isItemScrolling(item) {
    return this.isItemScrollingX(item) || this.isItemScrollingY(item);
  }
  updateSettings(options4 = {}) {
    const { overlapCheckInterval = this.settings.overlapCheckInterval } = options4;
    this.settings.overlapCheckInterval = overlapCheckInterval;
  }
  destroy() {
    if (this._isDestroyed) return;
    this.items.forEach((item) => this.removeItem(item));
    this._requestPool.destroy();
    this._actionPool.destroy();
    this._actions.length = 0;
    this._isDestroyed = true;
  }
};

// src/singletons/auto-scroll.ts
var autoScroll = new AutoScroll();

// src/dnd-context/dnd-context.ts
import { Emitter as Emitter5 } from "eventti";

// src/droppable/droppable.ts
import { Emitter as Emitter4 } from "eventti";
var DroppableEventType = {
  Destroy: "destroy"
};
var Droppable = class {
  constructor(element, options4 = {}) {
    const { id = Symbol(), accept = () => true, data = {} } = options4;
    this.id = id;
    this.element = element;
    this.accept = accept;
    this.data = data;
    this.isDestroyed = false;
    this._clientRect = { x: 0, y: 0, width: 0, height: 0 };
    this._emitter = new Emitter4();
    this.updateClientRect();
  }
  on(type3, listener, listenerId) {
    return this._emitter.on(type3, listener, listenerId);
  }
  off(type3, listenerId) {
    this._emitter.off(type3, listenerId);
  }
  getClientRect() {
    return this._clientRect;
  }
  updateClientRect(rect) {
    const bcr = rect || this.element.getBoundingClientRect();
    const { _clientRect } = this;
    _clientRect.x = bcr.x;
    _clientRect.y = bcr.y;
    _clientRect.width = bcr.width;
    _clientRect.height = bcr.height;
  }
  destroy() {
    if (this.isDestroyed) return;
    this.isDestroyed = true;
    this._emitter.emit(DroppableEventType.Destroy);
    this._emitter.off();
  }
};

// src/utils/fast-object-pool.ts
var FastObjectPool = class {
  constructor(getItem) {
    this._items = [];
    this._index = 0;
    this._getItem = getItem;
  }
  get(...args) {
    if (this._index >= this._items.length) {
      return this._items[this._index++] = this._getItem(void 0, ...args);
    }
    return this._getItem(this._items[this._index++], ...args);
  }
  resetPointer() {
    this._index = 0;
  }
  resetItems(maxLength = 0) {
    const newItemCount = Math.max(0, Math.min(maxLength, this._items.length));
    this._index = Math.min(this._index, newItemCount);
    this._items.length = newItemCount;
  }
};

// src/utils/create-rect.ts
function createRect(sourceRect, result = { width: 0, height: 0, x: 0, y: 0 }) {
  if (sourceRect) {
    result.width = sourceRect.width;
    result.height = sourceRect.height;
    result.x = sourceRect.x;
    result.y = sourceRect.y;
  }
  return result;
}

// src/dnd-context/collision-detector.ts
var MAX_CACHED_COLLISIONS = 20;
var EMPTY_SYMBOL = Symbol();
var CollisionDetector = class {
  constructor(dndContext) {
    this._listenerId = Symbol();
    this._dndContext = dndContext;
    this._collisionDataPoolCache = [];
    this._collisionDataPoolMap = /* @__PURE__ */ new Map();
  }
  _checkCollision(draggable, droppable, collisionData) {
    const draggableRect = draggable.getClientRect();
    const droppableRect = droppable.getClientRect();
    if (!draggableRect) return null;
    const intersectionRect = getIntersectionRect(
      draggableRect,
      droppableRect,
      collisionData.intersectionRect
    );
    if (intersectionRect === null) return null;
    const intersectionScore = getIntersectionScore(draggableRect, droppableRect, intersectionRect);
    if (intersectionScore <= 0) return null;
    collisionData.droppableId = droppable.id;
    createRect(droppableRect, collisionData.droppableRect);
    createRect(draggableRect, collisionData.draggableRect);
    collisionData.intersectionScore = intersectionScore;
    return collisionData;
  }
  _sortCollisions(_draggable, collisions) {
    return collisions.sort((a, b) => {
      const diff = b.intersectionScore - a.intersectionScore;
      if (diff !== 0) return diff;
      return a.droppableRect.width * a.droppableRect.height - b.droppableRect.width * b.droppableRect.height;
    });
  }
  _createCollisionData() {
    return {
      droppableId: EMPTY_SYMBOL,
      droppableRect: createRect(),
      draggableRect: createRect(),
      intersectionRect: createRect(),
      intersectionScore: 0
    };
  }
  getCollisionDataPool(draggable) {
    let pool = this._collisionDataPoolMap.get(draggable);
    if (!pool) {
      pool = this._collisionDataPoolCache.pop() || new FastObjectPool((item) => {
        return item || this._createCollisionData();
      });
      this._collisionDataPoolMap.set(draggable, pool);
    }
    return pool;
  }
  removeCollisionDataPool(draggable) {
    const pool = this._collisionDataPoolMap.get(draggable);
    if (pool) {
      pool.resetItems(MAX_CACHED_COLLISIONS);
      pool.resetPointer();
      this._collisionDataPoolCache.push(pool);
      this._collisionDataPoolMap.delete(draggable);
    }
  }
  detectCollisions(draggable, targets, collisions) {
    collisions.length = 0;
    if (!targets.size) {
      return;
    }
    const collisionDataPool = this.getCollisionDataPool(draggable);
    let collisionData = null;
    const droppables2 = targets.values();
    for (const droppable of droppables2) {
      collisionData = collisionData || collisionDataPool.get();
      if (this._checkCollision(draggable, droppable, collisionData)) {
        collisions.push(collisionData);
        collisionData = null;
      }
    }
    if (collisions.length > 1) {
      this._sortCollisions(draggable, collisions);
    }
    collisionDataPool.resetPointer();
  }
  destroy() {
    this._collisionDataPoolMap.forEach((pool) => {
      pool.resetItems();
    });
  }
};

// src/dnd-context/dnd-context.ts
var SCROLL_LISTENER_OPTIONS2 = { capture: true, passive: true };
var DndContextEventType = {
  Start: "start",
  Move: "move",
  Enter: "enter",
  Leave: "leave",
  Collide: "collide",
  End: "end",
  AddDraggables: "addDraggables",
  RemoveDraggables: "removeDraggables",
  AddDroppables: "addDroppables",
  RemoveDroppables: "removeDroppables",
  Destroy: "destroy"
};
var DndContext = class {
  constructor(options4 = {}) {
    this._onScroll = () => {
      if (this._drags.size === 0) return;
      ticker.once(
        tickerPhases.read,
        () => {
          this.updateDroppableClientRects();
        },
        this._listenerId
      );
      this.detectCollisions();
    };
    const { collisionDetector } = options4;
    this.draggables = /* @__PURE__ */ new Map();
    this.droppables = /* @__PURE__ */ new Map();
    this.isDestroyed = false;
    this._drags = /* @__PURE__ */ new Map();
    this._listenerId = Symbol();
    this._emitter = new Emitter5();
    this._onScroll = this._onScroll.bind(this);
    this._collisionDetector = collisionDetector ? collisionDetector(this) : new CollisionDetector(this);
  }
  get drags() {
    return this._drags;
  }
  _isMatch(draggable, droppable) {
    let isMatch = typeof droppable.accept === "function" ? droppable.accept(draggable) : droppable.accept.includes(draggable.settings.group);
    if (isMatch && draggable.drag) {
      const items = draggable.drag.items;
      for (let i = 0; i < items.length; i++) {
        if (items[i].element === droppable.element) {
          return false;
        }
      }
    }
    return isMatch;
  }
  _getTargets(draggable) {
    const drag = this._drags.get(draggable);
    if (drag?._targets) return drag._targets;
    const targets = /* @__PURE__ */ new Map();
    for (const droppable of this.droppables.values()) {
      if (this._isMatch(draggable, droppable)) {
        targets.set(droppable.id, droppable);
      }
    }
    if (drag) drag._targets = targets;
    return targets;
  }
  _onDragPrepareStart(draggable) {
    if (!this.draggables.has(draggable.id)) return;
    if (this._drags.get(draggable)) return;
    this._drags.set(draggable, {
      isEnded: false,
      data: {},
      _targets: null,
      _cd: {
        phase: 0 /* Idle */,
        tickerId: Symbol(),
        targets: /* @__PURE__ */ new Map(),
        collisions: [],
        contacts: /* @__PURE__ */ new Set(),
        prevContacts: /* @__PURE__ */ new Set(),
        addedContacts: /* @__PURE__ */ new Set(),
        persistedContacts: /* @__PURE__ */ new Set()
      }
    });
    if (this._drags.size === 1) {
      this.updateDroppableClientRects();
    }
    this._computeCollisions(draggable);
    if (this._drags.size === 1) {
      window.addEventListener("scroll", this._onScroll, SCROLL_LISTENER_OPTIONS2);
    }
  }
  _onDragStart(draggable) {
    const drag = this._drags.get(draggable);
    if (!drag || drag.isEnded) return;
    if (this._emitter.listenerCount(DndContextEventType.Start)) {
      const targets = this._getTargets(draggable);
      this._emitter.emit(DndContextEventType.Start, {
        draggable,
        targets
      });
    }
    this._emitCollisions(draggable);
  }
  _onDragPrepareMove(draggable) {
    const drag = this._drags.get(draggable);
    if (!drag || drag.isEnded) return;
    this._computeCollisions(draggable);
  }
  _onDragMove(draggable) {
    const drag = this._drags.get(draggable);
    if (!drag || drag.isEnded) return;
    if (this._emitter.listenerCount(DndContextEventType.Move)) {
      const targets = this._getTargets(draggable);
      this._emitter.emit(DndContextEventType.Move, {
        draggable,
        targets
      });
    }
    this._emitCollisions(draggable);
  }
  _onDragEnd(draggable) {
    this._stopDrag(draggable);
  }
  _onDragCancel(draggable) {
    this._stopDrag(draggable, true);
  }
  _onDraggableDestroy(draggable) {
    this.removeDraggables([draggable]);
  }
  // Returns true if the final cleanup was queued to a microtask.
  _stopDrag(draggable, canceled = false) {
    const drag = this._drags.get(draggable);
    if (!drag || drag.isEnded) return false;
    drag.isEnded = true;
    const isEmittingCollisions = drag._cd.phase === 3 /* Emitting */;
    if (!isEmittingCollisions) {
      this._computeCollisions(draggable, true);
      this._emitCollisions(draggable, true);
    }
    const { targets, collisions, contacts } = drag._cd;
    if (this._emitter.listenerCount(DndContextEventType.End)) {
      this._emitter.emit(DndContextEventType.End, {
        canceled,
        draggable,
        targets,
        collisions,
        contacts
      });
    }
    if (isEmittingCollisions) {
      window.queueMicrotask(() => {
        this._finalizeStopDrag(draggable);
      });
      return true;
    }
    this._finalizeStopDrag(draggable);
    return false;
  }
  _finalizeStopDrag(draggable) {
    const drag = this._drags.get(draggable);
    if (!drag || !drag.isEnded) return;
    this._drags.delete(draggable);
    this._collisionDetector.removeCollisionDataPool(draggable);
    ticker.off(tickerPhases.read, drag._cd.tickerId);
    ticker.off(tickerPhases.write, drag._cd.tickerId);
    if (!this._drags.size) {
      ticker.off(tickerPhases.read, this._listenerId);
      window.removeEventListener("scroll", this._onScroll, SCROLL_LISTENER_OPTIONS2);
    }
  }
  _computeCollisions(draggable, force = false) {
    const drag = this._drags.get(draggable);
    if (!drag || !force && drag.isEnded) return;
    const cd = drag._cd;
    switch (cd.phase) {
      case 1 /* Computing */:
        throw new Error("Collisions are being computed.");
      case 3 /* Emitting */:
        throw new Error("Collisions are being emitted.");
      default:
        break;
    }
    cd.phase = 1 /* Computing */;
    cd.targets = this._getTargets(draggable);
    this._collisionDetector.detectCollisions(draggable, cd.targets, cd.collisions);
    cd.phase = 2 /* Computed */;
  }
  _emitCollisions(draggable, force = false) {
    const drag = this._drags.get(draggable);
    if (!drag || !force && drag.isEnded) return;
    const cd = drag._cd;
    switch (cd.phase) {
      case 1 /* Computing */:
        throw new Error("Collisions are being computed.");
      case 3 /* Emitting */:
        throw new Error("Collisions are being emitted.");
      case 0 /* Idle */:
        return;
      default:
        break;
    }
    cd.phase = 3 /* Emitting */;
    const emitter = this._emitter;
    const collisions = cd.collisions;
    const targets = cd.targets;
    const addedContacts = cd.addedContacts;
    const persistedContacts = cd.persistedContacts;
    const prevContacts = cd.contacts;
    const contacts = cd.prevContacts;
    cd.prevContacts = prevContacts;
    cd.contacts = contacts;
    const removedContacts = prevContacts;
    addedContacts.clear();
    persistedContacts.clear();
    contacts.clear();
    for (const collision of collisions) {
      const droppable = targets.get(collision.droppableId);
      if (!droppable) continue;
      contacts.add(droppable);
      if (prevContacts.has(droppable)) {
        persistedContacts.add(droppable);
        prevContacts.delete(droppable);
      } else {
        addedContacts.add(droppable);
      }
    }
    if (prevContacts.size && emitter.listenerCount(DndContextEventType.Leave)) {
      emitter.emit(DndContextEventType.Leave, {
        draggable,
        targets,
        collisions,
        contacts,
        removedContacts
      });
    }
    if (addedContacts.size && emitter.listenerCount(DndContextEventType.Enter)) {
      emitter.emit(DndContextEventType.Enter, {
        draggable,
        targets,
        collisions,
        contacts,
        addedContacts
      });
    }
    if (emitter.listenerCount(DndContextEventType.Collide) && (contacts.size || removedContacts.size)) {
      emitter.emit(DndContextEventType.Collide, {
        draggable,
        targets,
        collisions,
        contacts,
        addedContacts,
        removedContacts,
        persistedContacts
      });
    }
    addedContacts.clear();
    persistedContacts.clear();
    prevContacts.clear();
    cd.phase = 0 /* Idle */;
  }
  on(type3, listener, listenerId) {
    return this._emitter.on(type3, listener, listenerId);
  }
  off(type3, listenerId) {
    this._emitter.off(type3, listenerId);
  }
  updateDroppableClientRects() {
    for (const droppable of this.droppables.values()) {
      droppable.updateClientRect();
    }
  }
  clearTargets(draggable) {
    if (draggable) {
      const drag = this._drags.get(draggable);
      if (drag) drag._targets = null;
    } else {
      for (const drag of this._drags.values()) {
        drag._targets = null;
      }
    }
  }
  detectCollisions(draggable) {
    if (this.isDestroyed) return;
    if (draggable) {
      const drag = this._drags.get(draggable);
      if (!drag || drag.isEnded) return;
      ticker.once(tickerPhases.read, () => this._computeCollisions(draggable), drag._cd.tickerId);
      ticker.once(tickerPhases.write, () => this._emitCollisions(draggable), drag._cd.tickerId);
    } else {
      for (const [d, drag] of this._drags) {
        if (drag.isEnded) continue;
        ticker.once(tickerPhases.read, () => this._computeCollisions(d), drag._cd.tickerId);
        ticker.once(tickerPhases.write, () => this._emitCollisions(d), drag._cd.tickerId);
      }
    }
  }
  addDraggables(draggables) {
    if (this.isDestroyed) return;
    const addedDraggables = /* @__PURE__ */ new Set();
    for (const draggable of draggables) {
      if (this.draggables.has(draggable.id)) continue;
      addedDraggables.add(draggable);
      this.draggables.set(draggable.id, draggable);
      draggable.on(
        DraggableEventType.PrepareStart,
        () => {
          this._onDragPrepareStart(draggable);
        },
        this._listenerId
      );
      draggable.on(
        DraggableEventType.Start,
        () => {
          this._onDragStart(draggable);
        },
        this._listenerId
      );
      draggable.on(
        DraggableEventType.PrepareMove,
        () => {
          this._onDragPrepareMove(draggable);
        },
        this._listenerId
      );
      draggable.on(
        DraggableEventType.Move,
        () => {
          this._onDragMove(draggable);
        },
        this._listenerId
      );
      draggable.on(
        DraggableEventType.End,
        (e) => {
          if (e?.type === SensorEventType.End) {
            this._onDragEnd(draggable);
          } else if (e?.type === SensorEventType.Cancel) {
            this._onDragCancel(draggable);
          }
        },
        this._listenerId
      );
      draggable.on(
        DraggableEventType.Destroy,
        () => {
          this._onDraggableDestroy(draggable);
        },
        this._listenerId
      );
    }
    if (!addedDraggables.size) return;
    if (this._emitter.listenerCount(DndContextEventType.AddDraggables)) {
      this._emitter.emit(DndContextEventType.AddDraggables, { draggables: addedDraggables });
    }
    for (const draggable of addedDraggables) {
      if (!this.isDestroyed && draggable.drag && !draggable.drag.isEnded) {
        const startPhase = draggable["_startPhase"];
        if (startPhase >= 2) this._onDragPrepareStart(draggable);
        if (startPhase >= 4) this._onDragStart(draggable);
      }
    }
  }
  removeDraggables(draggables) {
    if (this.isDestroyed) return;
    const removedDraggables = /* @__PURE__ */ new Set();
    for (const draggable of draggables) {
      if (!this.draggables.has(draggable.id)) continue;
      removedDraggables.add(draggable);
      this.draggables.delete(draggable.id);
      draggable.off(DraggableEventType.PrepareStart, this._listenerId);
      draggable.off(DraggableEventType.Start, this._listenerId);
      draggable.off(DraggableEventType.PrepareMove, this._listenerId);
      draggable.off(DraggableEventType.Move, this._listenerId);
      draggable.off(DraggableEventType.End, this._listenerId);
      draggable.off(DraggableEventType.Destroy, this._listenerId);
    }
    for (const draggable of removedDraggables) {
      this._stopDrag(draggable, true);
    }
    if (this._emitter.listenerCount(DndContextEventType.RemoveDraggables)) {
      this._emitter.emit(DndContextEventType.RemoveDraggables, { draggables: removedDraggables });
    }
  }
  addDroppables(droppables2) {
    if (this.isDestroyed) return;
    const addedDroppables = /* @__PURE__ */ new Set();
    for (const droppable of droppables2) {
      if (this.droppables.has(droppable.id)) continue;
      addedDroppables.add(droppable);
      this.droppables.set(droppable.id, droppable);
      droppable.on(
        DroppableEventType.Destroy,
        () => {
          this.removeDroppables([droppable]);
        },
        this._listenerId
      );
      this._drags.forEach(({ _targets }, draggable) => {
        if (_targets && this._isMatch(draggable, droppable)) {
          _targets.set(droppable.id, droppable);
          this.detectCollisions(draggable);
        }
      });
    }
    if (addedDroppables.size && this._emitter.listenerCount(DndContextEventType.AddDroppables)) {
      this._emitter.emit(DndContextEventType.AddDroppables, { droppables: addedDroppables });
    }
  }
  removeDroppables(droppables2) {
    if (this.isDestroyed) return;
    const removedDroppables = /* @__PURE__ */ new Set();
    for (const droppable of droppables2) {
      if (!this.droppables.has(droppable.id)) continue;
      this.droppables.delete(droppable.id);
      removedDroppables.add(droppable);
      droppable.off(DroppableEventType.Destroy, this._listenerId);
      this._drags.forEach(({ _targets }, draggable) => {
        if (_targets && _targets.has(droppable.id)) {
          _targets.delete(droppable.id);
          this.detectCollisions(draggable);
        }
      });
    }
    if (removedDroppables.size && this._emitter.listenerCount(DndContextEventType.RemoveDroppables)) {
      this._emitter.emit(DndContextEventType.RemoveDroppables, { droppables: removedDroppables });
    }
  }
  destroy() {
    if (this.isDestroyed) return;
    this.isDestroyed = true;
    this.draggables.forEach((draggable) => {
      draggable.off(DraggableEventType.PrepareStart, this._listenerId);
      draggable.off(DraggableEventType.Start, this._listenerId);
      draggable.off(DraggableEventType.PrepareMove, this._listenerId);
      draggable.off(DraggableEventType.Move, this._listenerId);
      draggable.off(DraggableEventType.End, this._listenerId);
      draggable.off(DraggableEventType.Destroy, this._listenerId);
    });
    this.droppables.forEach((droppable) => {
      droppable.off(DroppableEventType.Destroy, this._listenerId);
    });
    const activeDraggables = this._drags.keys();
    for (const draggable of activeDraggables) {
      this._stopDrag(draggable, true);
    }
    this._emitter.emit(DndContextEventType.Destroy);
    this._emitter.off();
    this._collisionDetector.destroy();
    this.draggables.clear();
    this.droppables.clear();
  }
};

// src/utils/get-clip-ancestors.ts
var VISIBLE_OVERFLOW = "visible";
function getClipAncestors(element, includeElement, result = []) {
  let parent = includeElement ? element : element?.parentNode;
  result.length = 0;
  while (parent && !isDocument(parent)) {
    if (parent instanceof Element) {
      const style = getStyle(parent);
      if (!(style.overflowY === VISIBLE_OVERFLOW || style.overflowX === VISIBLE_OVERFLOW)) {
        result.push(parent);
      }
      parent = parent.parentNode;
    } else if (parent instanceof ShadowRoot) {
      parent = parent.host;
    } else {
      parent = parent.parentNode;
    }
  }
  result.push(window);
  return result;
}

// src/dnd-context/advanced-collision-detector.ts
var EMPTY_RECT = { width: 0, height: 0, x: 0, y: 0 };
var MAX_RECT = {
  width: Number.MAX_SAFE_INTEGER,
  height: Number.MAX_SAFE_INTEGER,
  x: Number.MAX_SAFE_INTEGER * -0.5,
  y: Number.MAX_SAFE_INTEGER * -0.5
};
var DRAGGABLE_CLIP_ANCESTORS = [];
var DROPPABLE_CLIP_ANCESTORS = [];
var DRAGGABLE_CLIP_CHAIN = [];
var DROPPABLE_CLIP_CHAIN = [];
function computeDraggableClipAncestors(draggable) {
  if (!DRAGGABLE_CLIP_ANCESTORS.length) {
    const dragContainer = draggable.drag?.items?.[0]?.dragContainer;
    if (dragContainer) {
      getClipAncestors(dragContainer, true, DRAGGABLE_CLIP_ANCESTORS);
    } else {
      DRAGGABLE_CLIP_ANCESTORS.push(window);
    }
  }
}
function computeDroppableClipAncestors(droppable) {
  if (!DROPPABLE_CLIP_ANCESTORS.length) {
    getClipAncestors(droppable.element, false, DROPPABLE_CLIP_ANCESTORS);
  }
}
function getRecursiveIntersectionRect(elements, result = createRect()) {
  createRect(elements.length ? getRect([elements[0], "padding"], window) : MAX_RECT, result);
  for (let i = 1; i < elements.length; i++) {
    const el = elements[i];
    const rect = getRect([el, "padding"], window);
    if (!getIntersectionRect(result, rect, result)) {
      createRect(EMPTY_RECT, result);
      break;
    }
  }
  return result;
}
var AdvancedCollisionDetector = class extends CollisionDetector {
  constructor(dndContext) {
    super(dndContext);
    this._dragStates = /* @__PURE__ */ new Map();
    this._listenersAttached = false;
    this._clearCache = () => this.clearCache();
  }
  _checkCollision(draggable, droppable, collisionData) {
    const state = this._dragStates.get(draggable);
    if (!state) return null;
    const draggableRect = draggable.getClientRect();
    const droppableRect = droppable.getClientRect();
    if (!draggableRect || !droppableRect) return null;
    let clipMaskKey = state.clipMaskKeyMap.get(droppable);
    if (!clipMaskKey) {
      DROPPABLE_CLIP_ANCESTORS.length = 0;
      DRAGGABLE_CLIP_CHAIN.length = 0;
      DROPPABLE_CLIP_CHAIN.length = 0;
      computeDroppableClipAncestors(droppable);
      clipMaskKey = DROPPABLE_CLIP_ANCESTORS[0] || window;
      state.clipMaskKeyMap.set(droppable, clipMaskKey);
      if (!state.clipMaskMap.has(clipMaskKey)) {
        computeDraggableClipAncestors(draggable);
        let fccc = window;
        for (const droppableClipAncestor of DROPPABLE_CLIP_ANCESTORS) {
          if (DRAGGABLE_CLIP_ANCESTORS.includes(droppableClipAncestor)) {
            fccc = droppableClipAncestor;
            break;
          }
        }
        for (const draggableClipAncestor of DRAGGABLE_CLIP_ANCESTORS) {
          if (draggableClipAncestor === fccc) break;
          if (draggableClipAncestor instanceof Element) {
            DRAGGABLE_CLIP_CHAIN.push(draggableClipAncestor);
          }
        }
        for (const droppableClipAncestor of DROPPABLE_CLIP_ANCESTORS) {
          if (droppableClipAncestor === fccc) break;
          if (droppableClipAncestor instanceof Element) {
            DROPPABLE_CLIP_CHAIN.push(droppableClipAncestor);
          }
        }
        const draggableClipMask2 = getRecursiveIntersectionRect(DRAGGABLE_CLIP_CHAIN);
        const droppableClipMask2 = getRecursiveIntersectionRect(DROPPABLE_CLIP_CHAIN);
        state.clipMaskMap.set(clipMaskKey, [draggableClipMask2, droppableClipMask2]);
      }
      DROPPABLE_CLIP_ANCESTORS.length = 0;
      DRAGGABLE_CLIP_CHAIN.length = 0;
      DROPPABLE_CLIP_CHAIN.length = 0;
    }
    const [draggableClipMask, droppableClipMask] = state.clipMaskMap.get(clipMaskKey) || [];
    if (!draggableClipMask || !droppableClipMask) return null;
    if (!getIntersectionRect(draggableRect, draggableClipMask, collisionData.draggableVisibleRect)) {
      return null;
    }
    if (!getIntersectionRect(droppableRect, droppableClipMask, collisionData.droppableVisibleRect)) {
      return null;
    }
    if (!getIntersectionRect(
      collisionData.draggableVisibleRect,
      collisionData.droppableVisibleRect,
      collisionData.intersectionRect
    )) {
      return null;
    }
    const score = getIntersectionScore(
      collisionData.draggableVisibleRect,
      collisionData.droppableVisibleRect,
      collisionData.intersectionRect
    );
    if (score <= 0) return null;
    collisionData.droppableId = droppable.id;
    createRect(droppableRect, collisionData.droppableRect);
    createRect(draggableRect, collisionData.draggableRect);
    collisionData.intersectionScore = score;
    return collisionData;
  }
  _sortCollisions(_draggable, collisions) {
    return collisions.sort((a, b) => {
      const diff = b.intersectionScore - a.intersectionScore;
      if (diff !== 0) return diff;
      return a.droppableVisibleRect.width * a.droppableVisibleRect.height - b.droppableVisibleRect.width * b.droppableVisibleRect.height;
    });
  }
  _createCollisionData() {
    const data = super._createCollisionData();
    data.droppableVisibleRect = createRect();
    data.draggableVisibleRect = createRect();
    return data;
  }
  _getDragState(draggable) {
    let state = this._dragStates.get(draggable);
    if (state) return state;
    state = {
      clipMaskKeyMap: /* @__PURE__ */ new Map(),
      clipMaskMap: /* @__PURE__ */ new Map(),
      cacheDirty: true
    };
    this._dragStates.set(draggable, state);
    if (!this._listenersAttached) {
      window.addEventListener("scroll", this._clearCache, {
        capture: true,
        passive: true
      });
      window.addEventListener("resize", this._clearCache, { passive: true });
      this._listenersAttached = true;
    }
    return state;
  }
  // Create or get pool, making sure our drag state exists first.
  getCollisionDataPool(draggable) {
    this._getDragState(draggable);
    return super.getCollisionDataPool(draggable);
  }
  removeCollisionDataPool(draggable) {
    if (this._dragStates.delete(draggable)) {
      if (this._dndContext.drags.size <= 0) {
        if (this._listenersAttached) {
          window.removeEventListener("scroll", this._clearCache, { capture: true });
          window.removeEventListener("resize", this._clearCache);
          this._listenersAttached = false;
        }
      }
    }
    super.removeCollisionDataPool(draggable);
  }
  detectCollisions(draggable, targets, collisions) {
    DRAGGABLE_CLIP_ANCESTORS.length = 0;
    const state = this._getDragState(draggable);
    if (state.cacheDirty) {
      state.clipMaskKeyMap.clear();
      state.clipMaskMap.clear();
      state.cacheDirty = false;
    }
    super.detectCollisions(draggable, targets, collisions);
    DRAGGABLE_CLIP_ANCESTORS.length = 0;
  }
  clearCache(draggable) {
    if (draggable) {
      const state = this._dragStates.get(draggable);
      if (state) state.cacheDirty = true;
    } else {
      this._dragStates.forEach((state) => {
        state.cacheDirty = true;
      });
    }
  }
};

// tests/src/base-sensor/methods/_cancel.ts
function methodProtectedCancel() {
  describe("_cancel", () => {
    it(`should reset drag data`, () => {
      const s = new BaseSensor();
      s["_start"]({ type: "start", x: 1, y: 2 });
      s["_cancel"]({ type: "cancel", x: 5, y: 6 });
      assert.equal(s.drag, null);
      s.destroy();
    });
    it(`should not modify isDestroyed property`, () => {
      const s = new BaseSensor();
      s["_start"]({ type: "start", x: 1, y: 2 });
      assert.equal(s.isDestroyed, false);
      s["_cancel"]({ type: "cancel", x: 5, y: 6 });
      assert.equal(s.isDestroyed, false);
      s.destroy();
    });
    it(`should emit "cancel" event with correct arguments after updating instance properties`, () => {
      const s = new BaseSensor();
      const cancelArgs = { type: "cancel", x: 5, y: 6 };
      let emitCount = 0;
      s.on("cancel", (data) => {
        assert.deepEqual(s.drag, { x: data.x, y: data.y });
        assert.equal(s.isDestroyed, false);
        assert.deepEqual(data, cancelArgs);
        ++emitCount;
      });
      s["_start"]({ type: "start", x: 1, y: 2 });
      s["_cancel"](cancelArgs);
      assert.equal(emitCount, 1);
      s.destroy();
    });
    it(`should not do anything if drag is not active`, () => {
      const s = new BaseSensor();
      const { drag, isDestroyed } = s;
      let emitCount = 0;
      s.on("cancel", () => void ++emitCount);
      s["_cancel"]({ type: "cancel", x: 3, y: 4 });
      assert.deepEqual(s.drag, drag);
      assert.equal(s.isDestroyed, isDestroyed);
      assert.equal(emitCount, 0);
      s.destroy();
    });
  });
}

// tests/src/base-sensor/methods/_end.ts
function methodProtectedEnd() {
  describe("_end", () => {
    it(`should reset drag data`, () => {
      const s = new BaseSensor();
      s["_start"]({ type: "start", x: 1, y: 2 });
      s["_end"]({ type: "end", x: 5, y: 6 });
      assert.equal(s.drag, null);
      s.destroy();
    });
    it(`should not modify isDestroyed property`, () => {
      const s = new BaseSensor();
      s["_start"]({ type: "start", x: 1, y: 2 });
      assert.equal(s.isDestroyed, false);
      s["_end"]({ type: "end", x: 5, y: 6 });
      assert.equal(s.isDestroyed, false);
      s.destroy();
    });
    it(`should emit "end" event with correct arguments after updating instance properties`, () => {
      const s = new BaseSensor();
      const endArgs = { type: "end", x: 5, y: 6 };
      let emitCount = 0;
      s.on("end", (data) => {
        assert.deepEqual(s.drag, { x: data.x, y: data.y });
        assert.equal(s.isDestroyed, false);
        assert.deepEqual(data, endArgs);
        ++emitCount;
      });
      s["_start"]({ type: "start", x: 1, y: 2 });
      s["_end"](endArgs);
      assert.equal(emitCount, 1);
      s.destroy();
    });
    it(`should not do anything if drag is not active`, () => {
      const s = new BaseSensor();
      const { drag, isDestroyed } = s;
      let emitCount = 0;
      s.on("end", () => void ++emitCount);
      s["_end"]({ type: "end", x: 3, y: 4 });
      assert.deepEqual(s.drag, drag);
      assert.equal(s.isDestroyed, isDestroyed);
      assert.equal(emitCount, 0);
      s.destroy();
    });
  });
}

// tests/src/base-sensor/methods/_move.ts
function methodProtectedMove() {
  describe("_move", () => {
    it(`should update drag data to reflect the provided coordinates`, () => {
      const s = new BaseSensor();
      s["_start"]({ type: "start", x: 1, y: 2 });
      s["_move"]({ type: "move", x: 3, y: 4 });
      assert.deepEqual(s.drag, { x: 3, y: 4 });
      s.destroy();
    });
    it(`should not modify isDestroyed property`, () => {
      const s = new BaseSensor();
      s["_start"]({ type: "start", x: 1, y: 2 });
      assert.equal(s.isDestroyed, false);
      s["_move"]({ type: "move", x: 3, y: 4 });
      assert.equal(s.isDestroyed, false);
      s.destroy();
    });
    it(`should emit "move" event with correct arguments after updating instance properties`, () => {
      const s = new BaseSensor();
      const moveArgs = { type: "move", x: 3, y: 4 };
      let emitCount = 0;
      s.on("move", (data) => {
        assert.deepEqual(s.drag, { x: data.x, y: data.y });
        assert.equal(s.isDestroyed, false);
        assert.deepEqual(data, moveArgs);
        ++emitCount;
      });
      s["_start"]({ type: "start", x: 1, y: 2 });
      s["_move"](moveArgs);
      assert.equal(emitCount, 1);
      s.destroy();
    });
    it(`should not do anything if drag is not active`, () => {
      const s = new BaseSensor();
      const { drag, isDestroyed } = s;
      let emitCount = 0;
      s.on("move", () => void ++emitCount);
      s["_move"]({ type: "move", x: 3, y: 4 });
      assert.deepEqual(s.drag, drag);
      assert.equal(s.isDestroyed, isDestroyed);
      assert.equal(emitCount, 0);
      s.destroy();
    });
  });
}

// tests/src/base-sensor/methods/_start.ts
function methodProtectedStart() {
  describe("_start", () => {
    it(`should create drag data`, () => {
      const s = new BaseSensor();
      s["_start"]({ type: "start", x: 1, y: 2 });
      assert.deepEqual(s.drag, { x: 1, y: 2 });
      s.destroy();
    });
    it(`should not modify isDestroyed property`, () => {
      const s = new BaseSensor();
      assert.equal(s.isDestroyed, false);
      s["_start"]({ type: "start", x: 1, y: 2 });
      assert.equal(s.isDestroyed, false);
      s.destroy();
    });
    it(`should emit "start" event with correct arguments after updating instance properties`, () => {
      const s = new BaseSensor();
      const startArgs = { type: "start", x: 1, y: 2 };
      let emitCount = 0;
      s.on("start", (data) => {
        assert.deepEqual(s.drag, { x: data.x, y: data.y });
        assert.equal(s.isDestroyed, false);
        assert.deepEqual(data, startArgs);
        ++emitCount;
      });
      s["_start"](startArgs);
      assert.equal(emitCount, 1);
      s.destroy();
    });
    it(`should not do anything if drag is already active`, () => {
      const s = new BaseSensor();
      let emitCount = 0;
      s.on("start", () => void ++emitCount);
      s["_start"]({ type: "start", x: 1, y: 2 });
      const isDestroyed = s.isDestroyed;
      const { drag } = s;
      s["_start"]({ type: "start", x: 3, y: 4 });
      assert.deepEqual(s.drag, drag);
      assert.equal(s.isDestroyed, isDestroyed);
      assert.equal(emitCount, 1);
      s.destroy();
    });
    it(`should not do anything if instance is destroyed (isDestroyed is true)`, () => {
      const s = new BaseSensor();
      let emitCount = 0;
      s.on("start", () => void ++emitCount);
      s.destroy();
      const { drag, isDestroyed } = s;
      s["_start"]({ type: "start", x: 3, y: 4 });
      assert.deepEqual(s.drag, drag);
      assert.equal(s.isDestroyed, isDestroyed);
      assert.equal(emitCount, 0);
      s.destroy();
    });
  });
}

// tests/src/base-sensor/methods/cancel.ts
function methodCancel() {
  describe("cancel", () => {
    it(`should reset drag data`, () => {
      const s = new BaseSensor();
      s["_start"]({ type: "start", x: 1, y: 2 });
      s.cancel();
      assert.equal(s.drag, null);
      s.destroy();
    });
    it(`should not modify isDestroyed property`, () => {
      const s = new BaseSensor();
      s["_start"]({ type: "start", x: 1, y: 2 });
      assert.equal(s.isDestroyed, false);
      s.cancel();
      assert.equal(s.isDestroyed, false);
      s.destroy();
    });
    it(`should emit "cancel" event with correct arguments after updating instance properties`, () => {
      const s = new BaseSensor();
      let emitCount = 0;
      s.on("cancel", (data) => {
        assert.deepEqual(s.drag, { x: data.x, y: data.y });
        assert.equal(s.isDestroyed, false);
        assert.deepEqual(data, {
          type: "cancel",
          x: 1,
          y: 2
        });
        ++emitCount;
      });
      s["_start"]({ type: "start", x: 1, y: 2 });
      s.cancel();
      assert.equal(emitCount, 1);
      s.destroy();
    });
    it(`should not do anything if drag is not active`, () => {
      const s = new BaseSensor();
      const { drag, isDestroyed } = s;
      let emitCount = 0;
      s.on("cancel", () => void ++emitCount);
      s.cancel();
      assert.deepEqual(s.drag, drag);
      assert.equal(s.isDestroyed, isDestroyed);
      assert.equal(emitCount, 0);
      s.destroy();
    });
  });
}

// tests/src/base-sensor/methods/destroy.ts
function methodDestroy() {
  describe("destroy", () => {
    it(`should (if drag is active):
          1. set isDestroyed property to true
          2. emit "cancel" event with the current x/y coordinates
          3. reset drag data
          4. emit "destroy" event
          5. remove all listeners from the internal emitter
       `, () => {
      const s = new BaseSensor();
      const startArgs = { type: "start", x: 1, y: 2 };
      let events5 = [];
      s["_start"](startArgs);
      s.on("start", (data) => void events5.push(data.type));
      s.on("move", (data) => void events5.push(data.type));
      s.on("end", (data) => void events5.push(data.type));
      s.on("cancel", (data) => {
        assert.deepEqual(s.drag, { x: startArgs.x, y: startArgs.y });
        assert.equal(s.isDestroyed, true);
        assert.deepEqual(data, {
          type: "cancel",
          x: startArgs.x,
          y: startArgs.y
        });
        events5.push(data.type);
      });
      s.on("destroy", (data) => {
        assert.equal(s.drag, null);
        assert.equal(s.isDestroyed, true);
        assert.deepEqual(data, {
          type: "destroy"
        });
        events5.push(data.type);
      });
      assert.equal(s["_emitter"].listenerCount(), 5);
      s.destroy();
      assert.equal(s.drag, null);
      assert.equal(s.isDestroyed, true);
      assert.deepEqual(events5, ["cancel", "destroy"]);
      assert.equal(s["_emitter"].listenerCount(), 0);
    });
    it(`should (if drag is not active):
          1. set isDestroyed property to true
          2. emit "destroy" event
          3. remove all listeners from the internal emitter
       `, () => {
      const s = new BaseSensor();
      let events5 = [];
      s.on("start", (data) => void events5.push(data.type));
      s.on("move", (data) => void events5.push(data.type));
      s.on("end", (data) => void events5.push(data.type));
      s.on("cancel", (data) => void events5.push(data.type));
      s.on("destroy", (data) => {
        assert.equal(s.drag, null);
        assert.equal(s.isDestroyed, true);
        assert.deepEqual(data, {
          type: "destroy"
        });
        events5.push(data.type);
      });
      assert.equal(s["_emitter"].listenerCount(), 5);
      s.destroy();
      assert.equal(s.drag, null);
      assert.equal(s.isDestroyed, true);
      assert.deepEqual(events5, ["destroy"]);
      assert.equal(s["_emitter"].listenerCount(), 0);
    });
    it("should not do anything if the sensor is already destroyed", () => {
      const s = new BaseSensor();
      s.destroy();
      let events5 = [];
      s.on("start", (data) => void events5.push(data.type));
      s.on("move", (data) => void events5.push(data.type));
      s.on("end", (data) => void events5.push(data.type));
      s.on("cancel", (data) => void events5.push(data.type));
      s.on("destroy", (data) => void events5.push(data.type));
      s.destroy();
      assert.equal(s.drag, null);
      assert.equal(s.isDestroyed, true);
      assert.deepEqual(events5, []);
    });
  });
}

// tests/src/base-sensor/methods/off.ts
function methodOff() {
  describe("off", () => {
    it("should remove an event listener based on id", () => {
      const s = new BaseSensor();
      let msg = "";
      const idA = s.on("start", () => void (msg += "a"));
      s.on("start", () => void (msg += "b"));
      s.off("start", idA);
      s["_start"]({ type: "start", x: 1, y: 2 });
      assert.equal(msg, "b");
      s.destroy();
    });
  });
}

// tests/src/base-sensor/methods/on.ts
function methodOn() {
  describe("on", () => {
    it("should return a unique symbol by default", () => {
      const s = new BaseSensor();
      const idA = s.on("start", () => {
      });
      const idB = s.on("start", () => {
      });
      assert.equal(typeof idA, "symbol");
      assert.notEqual(idA, idB);
      s.destroy();
    });
    it("should allow duplicate event listeners", () => {
      const s = new BaseSensor();
      let counter = 0;
      const listener = () => {
        ++counter;
      };
      s.on("start", listener);
      s.on("start", listener);
      s["_start"]({ type: "start", x: 1, y: 2 });
      assert.equal(counter, 2);
      s.destroy();
    });
    it("should remove the existing listener and add the new one if the same id is used", () => {
      const s = new BaseSensor();
      let msg = "";
      s.on("start", () => void (msg += "a"), 1);
      s.on("start", () => void (msg += "b"), 2);
      s.on("start", () => void (msg += "c"), 1);
      s["_start"]({ type: "start", x: 1, y: 2 });
      assert.equal(msg, "bc");
      s.destroy();
    });
    it("should allow defining a custom id (string/symbol/number) for the event listener via third argument", () => {
      const s = new BaseSensor();
      const idA = Symbol();
      assert.equal(
        s.on("start", () => {
        }, idA),
        idA
      );
      const idB = 1;
      assert.equal(
        s.on("start", () => {
        }, idB),
        idB
      );
      const idC = "foo";
      assert.equal(
        s.on("start", () => {
        }, idC),
        idC
      );
      s.destroy();
    });
  });
}

// tests/src/base-sensor/methods/index.ts
function methods() {
  describe("methods", () => {
    methodProtectedCancel();
    methodProtectedEnd();
    methodProtectedMove();
    methodProtectedStart();
    methodCancel();
    methodDestroy();
    methodOff();
    methodOn();
  });
}

// tests/src/base-sensor/properties/drag.ts
function propDrag() {
  describe("drag", () => {
    it(`should be null on init`, () => {
      const s = new BaseSensor();
      assert.equal(s.drag, null);
      s.destroy();
    });
    it(`should contain drag data during drag`, () => {
      const s = new BaseSensor();
      s["_start"]({
        type: "start",
        x: 0,
        y: 0
      });
      assert.deepEqual(s.drag, { x: 0, y: 0 });
      s.destroy();
    });
  });
}

// tests/src/base-sensor/properties/is-destroyed.ts
function propIsDestroyed() {
  describe("isDestroyed", () => {
    it(`should be false on init`, () => {
      const s = new BaseSensor();
      assert.equal(s.isDestroyed, false);
      s.destroy();
    });
    it(`should be true after destroy method is called`, () => {
      const s = new BaseSensor();
      s.destroy();
      assert.equal(s.isDestroyed, true);
    });
  });
}

// tests/src/base-sensor/properties/index.ts
function properties() {
  describe("properties", () => {
    propDrag();
    propIsDestroyed();
  });
}

// tests/src/base-sensor/index.ts
describe("BaseSensor", () => {
  methods();
  properties();
});

// tests/src/utils/create-test-element.ts
var defaultStyles = {
  display: "block",
  position: "absolute",
  left: "0px",
  top: "0px",
  width: "100px",
  height: "100px",
  padding: "0px",
  margin: "0px",
  boxSizing: "border-box",
  backgroundColor: "red"
};
function createTestElement(styles2 = {}) {
  const el = document.createElement("div");
  el.tabIndex = 0;
  Object.assign(el.style, { ...defaultStyles, ...styles2 });
  document.body.appendChild(el);
  return el;
}

// tests/src/utils/focus-element.ts
function focusElement(element) {
  if (document.activeElement !== element) {
    element.focus();
    element.dispatchEvent(
      new FocusEvent("focus", {
        bubbles: false,
        cancelable: true
      })
    );
  }
}

// tests/src/utils/wait-next-frame.ts
function waitNextFrame() {
  return new Promise((resolve) => {
    window.requestAnimationFrame(() => {
      resolve(void 0);
    });
  });
}

// tests/src/draggable/events.ts
function events() {
  describe("events", () => {
    it("should be called at the right time with the right arguments", async () => {
      let events5 = [];
      let currentKeyboardEvent = null;
      const el = createTestElement();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], {
        elements: () => [el]
      });
      draggable.on("preparestart", (...args) => {
        assert.equal(args.length, 1);
        assert.equal(args[0].type, "start");
        assert.equal(args[0].srcEvent, currentKeyboardEvent);
        events5.push("preparestart");
      });
      draggable.on("start", (...args) => {
        assert.equal(args.length, 1);
        assert.equal(args[0].type, "start");
        assert.equal(args[0].srcEvent, currentKeyboardEvent);
        events5.push("start");
      });
      draggable.on("preparemove", (...args) => {
        assert.equal(args.length, 1);
        assert.equal(args[0].type, "move");
        assert.equal(args[0].srcEvent, currentKeyboardEvent);
        events5.push("preparemove");
      });
      draggable.on("move", (...args) => {
        assert.equal(args.length, 1);
        assert.equal(args[0].type, "move");
        assert.equal(args[0].srcEvent, currentKeyboardEvent);
        events5.push("move");
      });
      draggable.on("end", (...args) => {
        assert.equal(args.length, 1);
        assert.equal(args[0]?.type, "end");
        assert.equal(args[0]?.srcEvent, currentKeyboardEvent);
        events5.push("end");
      });
      draggable.on("destroy", (...args) => {
        assert.equal(args.length, 0);
        events5.push("destroy");
      });
      focusElement(el);
      currentKeyboardEvent = new KeyboardEvent("keydown", { key: "Enter" });
      document.dispatchEvent(currentKeyboardEvent);
      await waitNextFrame();
      assert.deepEqual(events5, ["preparestart", "start"]);
      events5.length = 0;
      currentKeyboardEvent = new KeyboardEvent("keydown", { key: "ArrowRight" });
      document.dispatchEvent(currentKeyboardEvent);
      await waitNextFrame();
      assert.deepEqual(events5, ["preparemove", "move"]);
      events5.length = 0;
      currentKeyboardEvent = new KeyboardEvent("keydown", { key: "Enter" });
      document.dispatchEvent(currentKeyboardEvent);
      assert.deepEqual(events5, ["end"]);
      events5.length = 0;
      draggable.destroy();
      assert.deepEqual(events5, ["destroy"]);
      keyboardSensor.destroy();
      el.remove();
    });
  });
}

// tests/src/draggable/methods/align.ts
function methodAlign() {
  describe("align", () => {
    it("should align the element visually", async () => {
      const el = createTestElement();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], { elements: () => [el] });
      let rect = el.getBoundingClientRect();
      assert.equal(rect.x, 0);
      assert.equal(rect.y, 0);
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
      await waitNextFrame();
      rect = el.getBoundingClientRect();
      assert.equal(rect.x, 1);
      assert.equal(rect.y, 0);
      el.style.left = parseFloat(el.style.left) + 10 + "px";
      el.style.top = parseFloat(el.style.top) + 10 + "px";
      rect = el.getBoundingClientRect();
      assert.equal(rect.x, 11);
      assert.equal(rect.y, 10);
      draggable.align();
      rect = el.getBoundingClientRect();
      assert.equal(rect.x, 11);
      assert.equal(rect.y, 10);
      await waitNextFrame();
      rect = el.getBoundingClientRect();
      assert.equal(rect.x, 1);
      assert.equal(rect.y, 0);
      el.style.left = parseFloat(el.style.left) + 10 + "px";
      el.style.top = parseFloat(el.style.top) + 10 + "px";
      rect = el.getBoundingClientRect();
      assert.equal(rect.x, 11);
      assert.equal(rect.y, 10);
      draggable.align(true);
      rect = el.getBoundingClientRect();
      assert.equal(rect.x, 1);
      assert.equal(rect.y, 0);
      draggable.destroy();
      keyboardSensor.destroy();
      el.remove();
    });
  });
}

// tests/src/draggable/methods/destroy.ts
function methodDestroy2() {
  describe("destroy", () => {
    it("should destroy the draggable instance", async () => {
      const el = createTestElement();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], { elements: () => [el] });
      let destroyEventCount = 0;
      draggable.on("destroy", () => {
        ++destroyEventCount;
      });
      draggable.destroy();
      assert.equal(draggable.isDestroyed, true);
      assert.equal(destroyEventCount, 1);
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
      await waitNextFrame();
      const rect = el.getBoundingClientRect();
      assert.equal(draggable.drag, null);
      assert.equal(rect.x, 0);
      assert.equal(rect.y, 0);
      draggable.destroy();
      assert.equal(destroyEventCount, 1);
      keyboardSensor.destroy();
      el.remove();
    });
  });
}

// tests/src/draggable/methods/off.ts
function methodOff2() {
  describe("off", () => {
    it("should remove an event listener based on id", async () => {
      const el = createTestElement();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], { elements: () => [el] });
      let result = "";
      const idA = draggable.on("start", () => {
        result += "a";
      });
      draggable.on("start", () => {
        result += "b";
      });
      draggable.off("start", idA);
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      await waitNextFrame();
      assert.equal(result, "b", "Only the second event listener should have been triggered");
      draggable.destroy();
      keyboardSensor.destroy();
      el.remove();
    });
  });
}

// tests/src/draggable/methods/on.ts
function methodOn2() {
  describe("on", () => {
    it("should return a unique symbol by default", () => {
      const el = createTestElement();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], { elements: () => [el] });
      const idA = draggable.on("start", () => {
      });
      const idB = draggable.on("start", () => {
      });
      assert.equal(typeof idA, "symbol");
      assert.notEqual(idA, idB);
      keyboardSensor.destroy();
      draggable.destroy();
      el.remove();
    });
    it("should allow duplicate event listeners", async () => {
      const el = createTestElement();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], { elements: () => [el] });
      let counter = 0;
      const listener = () => {
        ++counter;
      };
      draggable.on("start", listener);
      draggable.on("start", listener);
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      await waitNextFrame();
      assert.equal(counter, 2);
      keyboardSensor.destroy();
      draggable.destroy();
      el.remove();
    });
    it("should remove the existing listener and add the new one if the same id is used", async () => {
      const el = createTestElement();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], { elements: () => [el] });
      let msg = "";
      draggable.on("start", () => void (msg += "a"), 1);
      draggable.on("start", () => void (msg += "b"), 2);
      draggable.on("start", () => void (msg += "c"), 1);
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      await waitNextFrame();
      assert.equal(msg, "bc");
      keyboardSensor.destroy();
      draggable.destroy();
      el.remove();
    });
    it("should allow defining a custom id (string/symbol/number) for the event listener via third argument", () => {
      const el = createTestElement();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], { elements: () => [el] });
      const idA = Symbol();
      assert.equal(
        draggable.on("start", () => {
        }, idA),
        idA
      );
      const idB = 1;
      assert.equal(
        draggable.on("start", () => {
        }, idB),
        idB
      );
      const idC = "foo";
      assert.equal(
        draggable.on("start", () => {
        }, idC),
        idC
      );
      keyboardSensor.destroy();
      draggable.destroy();
      el.remove();
    });
  });
}

// tests/src/draggable/methods/stop.ts
function methodStop() {
  describe("stop", () => {
    it("should stop the drag after it has started", async () => {
      const el = createTestElement();
      const elRect = el.getBoundingClientRect();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], {
        elements: () => [el],
        onEnd: (drag) => {
          onEndCalled = true;
          assert.equal(drag.isEnded, true);
        }
      });
      let endEventTriggered = false;
      let onEndCalled = false;
      draggable.on("end", () => {
        endEventTriggered = true;
      });
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      await waitNextFrame();
      assert.notEqual(draggable.drag, null, "Drag should have started");
      draggable.stop();
      assert.equal(draggable.drag, null, "Drag should have stopped instantly");
      assert.equal(endEventTriggered, true, "end event should have been triggered");
      assert.equal(onEndCalled, true, "onEnd callback should have been called");
      assert.deepEqual(
        elRect,
        el.getBoundingClientRect(),
        "Element's bounding client rect should not change after stopping the drag"
      );
      draggable.destroy();
      keyboardSensor.destroy();
      el.remove();
    });
    it("should stop the drag synchronously after it is triggered to be start", async () => {
      const el = createTestElement();
      const elRect = el.getBoundingClientRect();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], {
        elements: () => [el],
        onEnd: (drag) => {
          onEndCalled = true;
          assert.equal(drag.isEnded, true);
        }
      });
      let endEventTriggered = false;
      let onEndCalled = false;
      draggable.on("end", () => {
        endEventTriggered = true;
      });
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      assert.notEqual(draggable.drag, null, "Drag should have started");
      draggable.stop();
      assert.equal(draggable.drag, null, "Drag should have stopped instantly");
      assert.equal(endEventTriggered, true, "end event should have been triggered");
      assert.equal(onEndCalled, true, "onEnd callback should have been called");
      assert.deepEqual(
        elRect,
        el.getBoundingClientRect(),
        "Element's bounding client rect should not change after stopping the drag"
      );
      draggable.destroy();
      keyboardSensor.destroy();
      el.remove();
    });
  });
}

// tests/src/draggable/methods/update-settings.ts
function methodUpdateSettings() {
  describe("updateSettings", () => {
    it("should update the container setting", () => {
      const el = createTestElement();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], { elements: () => [el] });
      const newContainer = createTestElement();
      draggable.updateSettings({ container: newContainer });
      assert.equal(draggable.settings.container, newContainer);
      draggable.destroy();
      keyboardSensor.destroy();
      el.remove();
      newContainer.remove();
    });
    it("should update the startPredicate setting", () => {
      const el = createTestElement();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], { elements: () => [el] });
      const newStartPredicate = () => false;
      draggable.updateSettings({ startPredicate: newStartPredicate });
      assert.equal(draggable.settings.startPredicate, newStartPredicate);
      draggable.destroy();
      keyboardSensor.destroy();
      el.remove();
    });
    it("should update the elements setting", () => {
      const elA = createTestElement();
      const elB = createTestElement();
      const keyboardSensor = new KeyboardSensor(elA, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], { elements: () => [elA] });
      const newElements = () => [elB];
      draggable.updateSettings({ elements: newElements });
      assert.equal(draggable.settings.elements, newElements);
      draggable.destroy();
      keyboardSensor.destroy();
      elA.remove();
      elB.remove();
    });
    it("should update the frozenStyles setting", () => {
      const el = createTestElement();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], { elements: () => [el] });
      const newFrozenStyles = () => ({ position: "absolute" });
      draggable.updateSettings({ frozenStyles: newFrozenStyles });
      assert.equal(draggable.settings.frozenStyles, newFrozenStyles);
      draggable.destroy();
      keyboardSensor.destroy();
      el.remove();
    });
    it("should update the positionModifiers setting", () => {
      const el = createTestElement();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], { elements: () => [el] });
      const newPositionModifiers = [
        (change) => ({ x: change.x + 10, y: change.y + 10 })
      ];
      draggable.updateSettings({ positionModifiers: newPositionModifiers });
      assert.deepEqual(draggable.settings.positionModifiers, newPositionModifiers);
      draggable.destroy();
      keyboardSensor.destroy();
      el.remove();
    });
    it("should update the applyPosition setting", () => {
      const el = createTestElement();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], { elements: () => [el] });
      const newApplyPosition = () => {
      };
      draggable.updateSettings({ applyPosition: newApplyPosition });
      assert.equal(draggable.settings.applyPosition, newApplyPosition);
      draggable.destroy();
      keyboardSensor.destroy();
      el.remove();
    });
    it("should update the onPrepareStart setting", () => {
      const el = createTestElement();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], { elements: () => [el] });
      const newOnPrepareStart = () => {
      };
      draggable.updateSettings({ onPrepareStart: newOnPrepareStart });
      assert.equal(draggable.settings.onPrepareStart, newOnPrepareStart);
      draggable.destroy();
      keyboardSensor.destroy();
      el.remove();
    });
    it("should update the onStart setting", () => {
      const el = createTestElement();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], { elements: () => [el] });
      const newOnStart = () => {
      };
      draggable.updateSettings({ onStart: newOnStart });
      assert.equal(draggable.settings.onStart, newOnStart);
      draggable.destroy();
      keyboardSensor.destroy();
      el.remove();
    });
    it("should update the onPrepareMove setting", () => {
      const el = createTestElement();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], { elements: () => [el] });
      const newOnPrepareMove = () => {
      };
      draggable.updateSettings({ onPrepareMove: newOnPrepareMove });
      assert.equal(draggable.settings.onPrepareMove, newOnPrepareMove);
      draggable.destroy();
      keyboardSensor.destroy();
      el.remove();
    });
    it("should update the onMove setting", () => {
      const el = createTestElement();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], { elements: () => [el] });
      const newOnMove = () => {
      };
      draggable.updateSettings({ onMove: newOnMove });
      assert.equal(draggable.settings.onMove, newOnMove);
      draggable.destroy();
      keyboardSensor.destroy();
      el.remove();
    });
    it("should update the onEnd setting", () => {
      const el = createTestElement();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], { elements: () => [el] });
      const newOnEnd = () => {
      };
      draggable.updateSettings({ onEnd: newOnEnd });
      assert.equal(draggable.settings.onEnd, newOnEnd);
      draggable.destroy();
      keyboardSensor.destroy();
      el.remove();
    });
    it("should update the onDestroy setting", () => {
      const el = createTestElement();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], { elements: () => [el] });
      const newOnDestroy = () => {
      };
      draggable.updateSettings({ onDestroy: newOnDestroy });
      assert.equal(draggable.settings.onDestroy, newOnDestroy);
      draggable.destroy();
      keyboardSensor.destroy();
      el.remove();
    });
  });
}

// tests/src/draggable/methods/use.ts
function methodUse() {
  describe("use", () => {
    it("should register a plugin", () => {
      const el = createTestElement();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], { elements: () => [el] });
      function testPlugin() {
        return (_draggable) => {
          const pluginInstance = {
            name: "test",
            version: "1.0.0"
          };
          const extendedDraggable = _draggable;
          extendedDraggable.plugins[pluginInstance.name] = pluginInstance;
          return extendedDraggable;
        };
      }
      const draggableWithPlugin = draggable.use(testPlugin());
      assert.equal(draggableWithPlugin.plugins.test.name, "test");
      assert.equal(draggableWithPlugin.plugins.test.version, "1.0.0");
      draggable.destroy();
      keyboardSensor.destroy();
      el.remove();
    });
  });
}

// tests/src/draggable/methods/index.ts
function methods2() {
  describe("methods", () => {
    methodAlign();
    methodDestroy2();
    methodOff2();
    methodOn2();
    methodStop();
    methodUpdateSettings();
    methodUse();
  });
}

// tests/src/draggable/options/apply-position.ts
function optionApplyPosition() {
  describe("applyPosition", () => {
    it("should receive the correct arguments", async () => {
      let callCount = 0;
      let expectedPhase = "";
      const el = createTestElement();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], {
        elements: () => [el],
        applyPosition: (args) => {
          ++callCount;
          assert.equal(Object.keys(args).length, 4);
          assert.equal(args.draggable, draggable);
          assert.equal(args.drag, draggable.drag);
          assert.equal(args.item, draggable.drag?.items[0]);
          assert.equal(args.phase, expectedPhase);
        }
      });
      focusElement(el);
      expectedPhase = "start";
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      await waitNextFrame();
      assert.equal(callCount, 1);
      expectedPhase = "move";
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
      await waitNextFrame();
      assert.equal(callCount, 2);
      expectedPhase = "end";
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      assert.equal(callCount, 3);
      draggable.destroy();
      keyboardSensor.destroy();
      el.remove();
    });
  });
}

// tests/src/draggable/options/callbacks.ts
function optionCallbacks() {
  describe("callbacks", () => {
    it("should be called at the right time with the right arguments", async () => {
      let events5 = [];
      let currentKeyboardEvent = null;
      const el = createTestElement();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], {
        elements: () => [el],
        onPrepareStart(...args) {
          assert.equal(args.length, 2);
          assert.equal(args[0], draggable.drag);
          assert.equal(args[1], draggable);
          assert.equal(args[0].startEvent.srcEvent, currentKeyboardEvent);
          assert.equal(args[0].prevMoveEvent.srcEvent, currentKeyboardEvent);
          assert.equal(args[0].moveEvent.srcEvent, currentKeyboardEvent);
          events5.push("onPrepareStart");
        },
        onStart(...args) {
          assert.equal(args.length, 2);
          assert.equal(args[0], draggable.drag);
          assert.equal(args[1], draggable);
          assert.equal(args[0].startEvent.srcEvent, currentKeyboardEvent);
          assert.equal(args[0].prevMoveEvent.srcEvent, currentKeyboardEvent);
          assert.equal(args[0].moveEvent.srcEvent, currentKeyboardEvent);
          events5.push("onStart");
        },
        onPrepareMove(...args) {
          assert.equal(args.length, 2);
          assert.equal(args[0], draggable.drag);
          assert.equal(args[1], draggable);
          assert.equal(args[0].moveEvent.srcEvent, currentKeyboardEvent);
          events5.push("onPrepareMove");
        },
        onMove(...args) {
          assert.equal(args.length, 2);
          assert.equal(args[0], draggable.drag);
          assert.equal(args[1], draggable);
          assert.equal(args[0].moveEvent.srcEvent, currentKeyboardEvent);
          events5.push("onMove");
        },
        onEnd(...args) {
          assert.equal(args.length, 2);
          assert.equal(args[0], draggable.drag);
          assert.equal(args[1], draggable);
          assert.equal(args[0].endEvent?.srcEvent, currentKeyboardEvent);
          events5.push("onEnd");
        },
        onDestroy(...args) {
          assert.equal(args.length, 1);
          assert.equal(args[0], draggable);
          events5.push("onDestroy");
        }
      });
      draggable.on("preparestart", () => {
        events5.push("preparestart");
      });
      draggable.on("start", () => {
        events5.push("start");
      });
      draggable.on("preparemove", () => {
        events5.push("preparemove");
      });
      draggable.on("move", () => {
        events5.push("move");
      });
      draggable.on("end", () => {
        events5.push("end");
      });
      draggable.on("destroy", () => {
        events5.push("destroy");
      });
      focusElement(el);
      currentKeyboardEvent = new KeyboardEvent("keydown", { key: "Enter" });
      document.dispatchEvent(currentKeyboardEvent);
      await waitNextFrame();
      assert.deepEqual(events5, ["preparestart", "onPrepareStart", "start", "onStart"]);
      events5.length = 0;
      currentKeyboardEvent = new KeyboardEvent("keydown", { key: "ArrowRight" });
      document.dispatchEvent(currentKeyboardEvent);
      await waitNextFrame();
      assert.deepEqual(events5, ["preparemove", "onPrepareMove", "move", "onMove"]);
      events5.length = 0;
      currentKeyboardEvent = new KeyboardEvent("keydown", { key: "Enter" });
      document.dispatchEvent(currentKeyboardEvent);
      assert.deepEqual(events5, ["end", "onEnd"]);
      events5.length = 0;
      draggable.destroy();
      assert.deepEqual(events5, ["destroy", "onDestroy"]);
      keyboardSensor.destroy();
      el.remove();
    });
  });
}

// tests/src/utils/round-number.ts
function roundNumber2(value, decimals = 0) {
  const multiplier = Math.pow(10, decimals);
  return Math.round((value + Number.EPSILON) * multiplier) / multiplier;
}

// tests/src/draggable/options/container.ts
function optionContainer() {
  describe("container", () => {
    it("should define the drag container", async () => {
      const container = createTestElement();
      const el = createTestElement();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], { container, elements: () => [el] });
      const originalContainer = el.parentNode;
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      assert.notEqual(draggable.drag, null);
      await waitNextFrame();
      assert.ok(container.contains(el));
      assert.equal(el.parentElement, container);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      assert.equal(draggable.drag, null);
      assert.equal(el.parentNode, originalContainer);
      draggable.destroy();
      keyboardSensor.destroy();
      el.remove();
      container.remove();
    });
    it(`should maintain client position`, async () => {
      const containerPositions = ["static", "relative", "fixed", "absolute"];
      const elPositions = ["fixed", "absolute"];
      for (const containerPosition of containerPositions) {
        for (const elPosition of elPositions) {
          const assertMsg = `element ${elPosition} - container ${containerPosition}`;
          const container = createTestElement({
            position: containerPosition,
            left: "0px",
            top: "0px",
            transform: "translate(7px, 8px)"
          });
          const el = createTestElement({
            position: elPosition,
            left: "19px",
            top: "20px",
            transform: "translate(-1px, -5px)"
          });
          const keyboardSensor = new KeyboardSensor(el, {
            moveDistance: 1
          });
          const draggable = new Draggable([keyboardSensor], {
            container,
            elements: () => [el]
          });
          const originalContainer = el.parentNode;
          let containerRect = container.getBoundingClientRect();
          let elRect = el.getBoundingClientRect();
          assert.notEqual(elRect.x, containerRect.x, "1: " + assertMsg);
          assert.notEqual(elRect.y, containerRect.y, "2: " + assertMsg);
          focusElement(el);
          document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
          await waitNextFrame();
          assert.ok(container.contains(el), "3: " + assertMsg);
          let rect = el.getBoundingClientRect();
          assert.equal(rect.x, elRect.x, "4: " + assertMsg);
          assert.equal(rect.y, elRect.y, "5: " + assertMsg);
          document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
          await waitNextFrame();
          rect = el.getBoundingClientRect();
          assert.equal(rect.x, elRect.x + 1, "6: " + assertMsg);
          assert.equal(rect.y, elRect.y, "7: " + assertMsg);
          document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
          rect = el.getBoundingClientRect();
          assert.equal(rect.x, elRect.x + 1, "9: " + assertMsg);
          assert.equal(rect.y, elRect.y, "10: " + assertMsg);
          assert.equal(el.parentNode, originalContainer, "11: " + assertMsg);
          draggable.destroy();
          keyboardSensor.destroy();
          el.remove();
          container.remove();
        }
      }
    });
    it("should work with transformed elements", async () => {
      const el = createTestElement({
        transform: "scale(1.2) translate(-5px, -6px) rotate(33deg) skew(31deg, 43deg)",
        transformOrigin: "21px 22px"
      });
      const scrollContainer = createTestElement({
        overflow: "auto",
        width: "100%",
        height: "100%"
      });
      const scrollContent = createTestElement({
        position: "relative",
        width: "calc(100% + 100px)",
        height: "calc(100% + 100px)"
      });
      const container1 = createTestElement({
        transform: "scale(0.9) translate(3px, 4px) rotate(-10deg) skew(5deg, 10deg)",
        transformOrigin: "5px 10px"
      });
      const container2 = createTestElement({
        transform: "scale(0.8) translate(4px, 5px) rotate(-20deg) skew(10deg, 15deg)",
        transformOrigin: "10px 15px"
      });
      const container3 = createTestElement({
        transform: "scale(0.7) translate(5px, 6px) rotate(-30deg) skew(15deg, 20deg)",
        transformOrigin: "15px 20px"
      });
      const dragContainer1 = createTestElement({
        transform: "scale(0.6) translate(6px, 7px) rotate(-35deg) skew(20deg, 25deg)",
        transformOrigin: "20px 25px"
      });
      const dragContainer2 = createTestElement({
        transform: "scale(0.5) translate(7px, 8px) rotate(-40deg) skew(25deg, 30deg)",
        transformOrigin: "25px 30px"
      });
      const dragContainer3 = createTestElement({
        transform: "scale(0.4) translate(8px, 9px) rotate(-45deg) skew(30deg, 35deg)",
        transformOrigin: "30px 35px"
      });
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], {
        elements: () => [el],
        container: dragContainer1
      });
      scrollContainer.appendChild(scrollContent);
      scrollContent.appendChild(container1);
      scrollContent.appendChild(dragContainer1);
      dragContainer1.appendChild(dragContainer2);
      dragContainer2.appendChild(dragContainer3);
      container1.appendChild(container2);
      container2.appendChild(container3);
      container3.appendChild(el);
      const startRect = el.getBoundingClientRect();
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
      await waitNextFrame();
      scrollContainer.scrollBy(25, 50);
      await waitNextFrame();
      const moveRect = el.getBoundingClientRect();
      assert.equal(roundNumber2(moveRect.x - startRect.x, 3), 1, "x");
      assert.equal(roundNumber2(moveRect.y - startRect.y, 3), 1, "y");
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      const endRect = el.getBoundingClientRect();
      assert.equal(roundNumber2(endRect.x - startRect.x, 3), 1, "x");
      assert.equal(roundNumber2(endRect.y - startRect.y, 3), 1, "y");
      draggable.destroy();
      keyboardSensor.destroy();
      el.remove();
      container1.remove();
      container2.remove();
      container3.remove();
      dragContainer1.remove();
      dragContainer2.remove();
      dragContainer3.remove();
    });
  });
}

// tests/src/draggable/options/elements.ts
function optionElements() {
  describe("elements", () => {
    it("should be a function that returns an array of the dragged elements", async () => {
      const elA = createTestElement();
      const elB = createTestElement();
      const elC = createTestElement();
      const keyboardSensor = new KeyboardSensor(elA, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], {
        elements: () => [elB, elC]
      });
      focusElement(elA);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
      await waitNextFrame();
      const rectA = elA.getBoundingClientRect();
      assert.equal(rectA.x, 0);
      assert.equal(rectA.y, 0);
      const rectB = elB.getBoundingClientRect();
      assert.equal(rectB.x, 1);
      assert.equal(rectB.y, 0);
      const rectC = elC.getBoundingClientRect();
      assert.equal(rectC.x, 1);
      assert.equal(rectC.y, 0);
      draggable.destroy();
      keyboardSensor.destroy();
      elA.remove();
      elB.remove();
      elC.remove();
    });
  });
}

// tests/src/draggable/options/frozen-styles.ts
function optionFrozenStyles() {
  describe("frozenStyles", async () => {
    it("should receive the correct arguments", async () => {
      let callCount = 0;
      const el = createTestElement();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], {
        elements: () => [el],
        frozenStyles: (args) => {
          ++callCount;
          assert.equal(Object.keys(args).length, 4);
          assert.equal(args.draggable, draggable);
          assert.equal(args.drag, draggable.drag);
          assert.equal(args.item.element, el);
          assert.deepEqual(args.style, window.getComputedStyle(el));
          return null;
        }
      });
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      await waitNextFrame();
      assert.equal(callCount, 1);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
      await waitNextFrame();
      assert.equal(callCount, 1);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      assert.equal(callCount, 1);
      draggable.destroy();
      keyboardSensor.destroy();
      el.remove();
    });
    it("should freeze the styles of the dragged element", async () => {
      const container = createTestElement();
      const el = createTestElement();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], {
        container,
        elements: () => [el],
        frozenStyles: () => {
          return ["width", "height", "left", "top"];
        }
      });
      el.style.width = "10vw";
      el.style.height = "10vh";
      el.style.left = "10vw";
      el.style.top = "10vh";
      const expectedFrozenStyles = {
        width: getComputedStyle(el).width,
        height: getComputedStyle(el).height,
        left: getComputedStyle(el).left,
        top: getComputedStyle(el).top
      };
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      await waitNextFrame();
      assert.equal(el.style.width, expectedFrozenStyles.width);
      assert.equal(el.style.height, expectedFrozenStyles.height);
      assert.equal(el.style.left, expectedFrozenStyles.left);
      assert.equal(el.style.top, expectedFrozenStyles.top);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      assert.equal(el.style.width, "10vw");
      assert.equal(el.style.height, "10vh");
      assert.equal(el.style.left, "10vw");
      assert.equal(el.style.top, "10vh");
      draggable.destroy();
      keyboardSensor.destroy();
      el.remove();
    });
    it("should set the explicitly provided styles if object is provided", async () => {
      const container = createTestElement();
      const el = createTestElement();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], {
        container,
        elements: () => [el],
        frozenStyles: () => {
          return { width: "10px", height: "20px", left: "30px", top: "40px" };
        }
      });
      el.style.width = "10vw";
      el.style.height = "10vh";
      el.style.left = "10vw";
      el.style.top = "10vh";
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      await waitNextFrame();
      assert.equal(el.style.width, "10px");
      assert.equal(el.style.height, "20px");
      assert.equal(el.style.left, "30px");
      assert.equal(el.style.top, "40px");
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      assert.equal(el.style.width, "10vw");
      assert.equal(el.style.height, "10vh");
      assert.equal(el.style.left, "10vw");
      assert.equal(el.style.top, "10vh");
      draggable.destroy();
      keyboardSensor.destroy();
      el.remove();
    });
  });
}

// tests/src/draggable/options/position-modifiers.ts
function optionPositionModifiers() {
  describe("positionModifiers", () => {
    it("should modify the dragged element position", async () => {
      let phaseCounter = { start: 0, move: 0, end: 0 };
      const el = createTestElement();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], {
        elements: () => [el],
        positionModifiers: [
          (position, args) => {
            assert.equal(args.draggable, draggable);
            assert.equal(args.drag, draggable.drag);
            assert.equal(args.item, draggable.drag?.items[0]);
            switch (args.phase) {
              case "start": {
                ++phaseCounter.start;
                position.x += 1;
                position.y += 1;
                break;
              }
              case "move": {
                ++phaseCounter.move;
                position.x += 2;
                position.y += 2;
                break;
              }
              case "end": {
                ++phaseCounter.end;
                position.x += 3;
                position.y += 3;
                break;
              }
            }
            return position;
          }
        ]
      });
      let rect = el.getBoundingClientRect();
      assert.equal(rect.x, 0);
      assert.equal(rect.y, 0);
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      await waitNextFrame();
      rect = el.getBoundingClientRect();
      assert.equal(rect.x, 1);
      assert.equal(rect.y, 1);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
      await waitNextFrame();
      rect = el.getBoundingClientRect();
      assert.equal(rect.x, 4);
      assert.equal(rect.y, 3);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
      await waitNextFrame();
      rect = el.getBoundingClientRect();
      assert.equal(rect.x, 6);
      assert.equal(rect.y, 6);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      rect = el.getBoundingClientRect();
      assert.equal(rect.x, 9);
      assert.equal(rect.y, 9);
      assert.equal(phaseCounter.start, 1);
      assert.equal(phaseCounter.move, 2);
      assert.equal(phaseCounter.end, 1);
      draggable.destroy();
      keyboardSensor.destroy();
      el.remove();
    });
  });
}

// tests/src/draggable/options/start-predicate.ts
function optionStartPredicate() {
  describe("startPredicate", () => {
    it("should be called only on start and move events of the sensors", async () => {
      let callCount = 0;
      const el = createTestElement();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], {
        elements: () => [el],
        startPredicate: () => {
          ++callCount;
          return void 0;
        }
      });
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      assert.equal(callCount, 1);
      callCount = 0;
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
      assert.equal(callCount, 1);
      callCount = 0;
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
      assert.equal(callCount, 1);
      callCount = 0;
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      assert.equal(callCount, 0);
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      assert.equal(callCount, 1);
      callCount = 0;
      keyboardSensor.cancel();
      assert.equal(callCount, 0);
      draggable.destroy();
      keyboardSensor.destroy();
      el.remove();
    });
    it("should receive the correct arguments", async () => {
      let callCount = 0;
      let keyboardEvent = null;
      const el = createTestElement();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], {
        elements: () => [el],
        startPredicate: (args) => {
          ++callCount;
          assert.equal(Object.keys(args).length, 3);
          assert.equal(args.draggable, draggable);
          assert.equal(args.sensor, keyboardSensor);
          assert.equal(typeof args.event.x, "number");
          assert.equal(typeof args.event.y, "number");
          assert.ok(["move", "start"].includes(args.event.type));
          assert.equal(args.event.srcEvent, keyboardEvent);
          return void 0;
        }
      });
      focusElement(el);
      keyboardEvent = new KeyboardEvent("keydown", { key: "Enter" });
      document.dispatchEvent(keyboardEvent);
      assert.equal(callCount, 1);
      keyboardEvent = new KeyboardEvent("keydown", { key: "ArrowDown" });
      document.dispatchEvent(keyboardEvent);
      assert.equal(callCount, 2);
      keyboardEvent = new KeyboardEvent("keydown", { key: "Enter" });
      document.dispatchEvent(keyboardEvent);
      assert.equal(callCount, 2);
      draggable.destroy();
      keyboardSensor.destroy();
      el.remove();
    });
    it("should remain in pending state when `undefined` is returned", async () => {
      let callCount = 0;
      const el = createTestElement();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], {
        elements: () => [el],
        startPredicate: () => {
          ++callCount;
          return void 0;
        }
      });
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      assert.equal(callCount, 1);
      assert.equal(draggable.drag, null);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
      assert.equal(callCount, 2);
      assert.equal(draggable.drag, null);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
      assert.equal(callCount, 3);
      assert.equal(draggable.drag, null);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      assert.equal(callCount, 3);
      assert.equal(draggable.drag, null);
      draggable.destroy();
      keyboardSensor.destroy();
      el.remove();
    });
    it("should resolve when `true` is returned", async () => {
      let callCount = 0;
      const el = createTestElement();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], {
        elements: () => [el],
        startPredicate: () => {
          ++callCount;
          return true;
        }
      });
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      assert.equal(callCount, 1);
      assert.notEqual(draggable.drag, null);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
      assert.equal(callCount, 1);
      assert.notEqual(draggable.drag, null);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      assert.equal(draggable.drag, null);
      assert.equal(callCount, 1);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      assert.equal(callCount, 2);
      assert.notEqual(draggable.drag, null);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
      assert.equal(callCount, 2);
      assert.notEqual(draggable.drag, null);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      assert.equal(callCount, 2);
      assert.equal(draggable.drag, null);
      draggable.destroy();
      keyboardSensor.destroy();
      el.remove();
    });
    it("should reject when `false` is returned", async () => {
      let callCount = 0;
      const el = createTestElement();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], {
        elements: () => [el],
        startPredicate: () => {
          ++callCount;
          return false;
        }
      });
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      assert.equal(callCount, 1);
      assert.equal(draggable.drag, null);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
      assert.equal(callCount, 1);
      assert.equal(draggable.drag, null);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      assert.equal(callCount, 1);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      assert.equal(callCount, 2);
      assert.equal(draggable.drag, null);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
      assert.equal(callCount, 2);
      assert.equal(draggable.drag, null);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      assert.equal(callCount, 2);
      assert.equal(draggable.drag, null);
      draggable.destroy();
      keyboardSensor.destroy();
      el.remove();
    });
  });
}

// tests/src/draggable/options/index.ts
function options() {
  describe("options", () => {
    optionApplyPosition();
    optionCallbacks();
    optionContainer();
    optionElements();
    optionFrozenStyles();
    optionPositionModifiers();
    optionStartPredicate();
  });
}

// tests/src/utils/fake-touch.ts
var FakeTouch = class {
  constructor(options4 = {}) {
    const {
      identifier = 0,
      target = null,
      clientX = 0,
      clientY = 0,
      screenX = 0,
      screenY = 0,
      radiusX = 0,
      radiusY = 0,
      rotationAngle = 0,
      force = 0
    } = options4;
    const mouseEvent = new MouseEvent("mousedown", { clientX, clientY, screenX, screenY });
    this.identifier = identifier;
    this.target = target || document.elementFromPoint(mouseEvent.clientX, mouseEvent.clientY) || document.documentElement;
    this.clientX = mouseEvent.clientX;
    this.clientY = mouseEvent.clientY;
    this.screenX = mouseEvent.screenX;
    this.screenY = mouseEvent.screenY;
    this.pageX = mouseEvent.pageX;
    this.pageY = mouseEvent.pageY;
    this.radiusX = radiusX;
    this.radiusY = radiusY;
    this.rotationAngle = rotationAngle;
    this.force = force;
  }
};
var FakeTouchEvent = class extends UIEvent {
  constructor(type3, options4 = {}) {
    const {
      altKey = false,
      ctrlKey = false,
      metaKey = false,
      shiftKey = false,
      touches = [],
      targetTouches = [],
      changedTouches = [],
      ...parentOptions
    } = options4;
    super(type3, parentOptions);
    this.altKey = altKey;
    this.ctrlKey = ctrlKey;
    this.metaKey = metaKey;
    this.shiftKey = shiftKey;
    this.touches = touches;
    this.targetTouches = targetTouches;
    this.changedTouches = changedTouches;
  }
};

// tests/src/utils/create-fake-touch-event.ts
function createFakeTouchEvent(type3, options4 = {}) {
  const {
    identifier,
    target,
    clientX,
    clientY,
    screenX,
    screenY,
    radiusX,
    radiusY,
    rotationAngle,
    force,
    ...eventOptions
  } = options4;
  const touch = new FakeTouch({
    identifier,
    target,
    clientX,
    clientY,
    screenX,
    screenY,
    radiusX,
    radiusY,
    rotationAngle,
    force
  });
  const touchEvent = new FakeTouchEvent(type3, {
    ...eventOptions,
    touches: [touch],
    changedTouches: [touch],
    targetTouches: [touch]
  });
  return touchEvent;
}

// tests/src/utils/create-fake-drag.ts
var idCounter = 100;
async function createFakeDrag(steps, options4) {
  const {
    eventType = "mouse",
    stepDuration = 16,
    extraSteps = 0,
    cancelAtEnd = false,
    pointerId = ++idCounter,
    pointerType = "touch",
    onAfterStep
  } = options4;
  const finalSteps = [...steps];
  if (extraSteps > 0) {
    const stepTo = finalSteps.pop();
    const stepFrom = finalSteps.pop();
    finalSteps.push(stepFrom);
    for (let i = 0; i < extraSteps; i++) {
      const alpha = (i + 1) / (extraSteps + 1);
      const x = stepFrom.x + (stepTo.x - stepFrom.x) * alpha;
      const y = stepFrom.y + (stepTo.y - stepFrom.y) * alpha;
      finalSteps.push({
        x: Math.round(x),
        y: Math.round(y)
      });
    }
    finalSteps.push(stepTo);
  }
  for (let i = 0; i < finalSteps.length; i++) {
    const isStart = i === 0;
    const isEnd = i === finalSteps.length - 1;
    const { x, y } = finalSteps[i];
    if (!isStart && !isEnd) {
      const prevStep = finalSteps[i - 1];
      if (prevStep.x === x && prevStep.y === y) {
        continue;
      }
    }
    if (!isStart && stepDuration > 0) {
      await new Promise((resolve) => setTimeout(resolve, stepDuration));
    }
    const target = document.elementFromPoint(x, y);
    if (!target) throw new Error("No event target found!");
    switch (eventType) {
      case "mouse": {
        const eventName = isStart ? "mousedown" : isEnd ? "mouseup" : "mousemove";
        const event = new MouseEvent(eventName, {
          clientX: x,
          clientY: y,
          bubbles: true,
          cancelable: true,
          view: window
        });
        target.dispatchEvent(event);
        if (onAfterStep) onAfterStep(event);
        break;
      }
      case "touch": {
        const eventName = isStart ? "touchstart" : isEnd ? cancelAtEnd ? "touchcancel" : "touchend" : "touchmove";
        const event = createFakeTouchEvent(eventName, {
          clientX: x,
          clientY: y,
          bubbles: true,
          cancelable: true,
          view: window,
          target,
          identifier: pointerId
        });
        target.dispatchEvent(event);
        if (onAfterStep) onAfterStep(event);
        break;
      }
      case "pointer": {
        const eventName = isStart ? "pointerdown" : isEnd ? cancelAtEnd ? "pointercancel" : "pointerup" : "pointermove";
        const event = new PointerEvent(eventName, {
          clientX: x,
          clientY: y,
          bubbles: true,
          cancelable: true,
          view: window,
          pointerId,
          pointerType,
          isPrimary: true,
          width: 100,
          height: 100
        });
        target.dispatchEvent(event);
        if (onAfterStep) onAfterStep(event);
        break;
      }
    }
  }
}

// tests/src/draggable/misc.ts
function misc() {
  describe("misc", () => {
    it("should drag an element using the provided sensors", async () => {
      const el = createTestElement();
      const pointerSensor = new PointerSensor(el, { sourceEvents: "mouse" });
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([pointerSensor, keyboardSensor], { elements: () => [el] });
      let rect = el.getBoundingClientRect();
      assert.equal(rect.x, 0);
      assert.equal(rect.y, 0);
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
      await waitNextFrame();
      rect = el.getBoundingClientRect();
      assert.equal(rect.x, 1);
      assert.equal(rect.y, 0);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      assert.equal(draggable.drag, null);
      await createFakeDrag(
        [
          { x: 1, y: 1 },
          // mouse down
          { x: 2, y: 2 },
          // mouse move
          { x: 3, y: 3 },
          // mouse move
          { x: 3, y: 3 }
          // mouse up
        ],
        {
          eventType: "mouse",
          stepDuration: 50
        }
      );
      await waitNextFrame();
      assert.equal(draggable.drag, null);
      rect = el.getBoundingClientRect();
      assert.equal(rect.x, 3);
      assert.equal(rect.y, 2);
      draggable.destroy();
      pointerSensor.destroy();
      keyboardSensor.destroy();
      el.remove();
    });
    it("should work with transformed elements", async () => {
      const el = createTestElement({
        transform: "scale(1.2) translate(-5px, -6px) rotate(33deg) skew(30deg, -40deg)",
        transformOrigin: "21px 22px"
      });
      const container1 = createTestElement({
        transform: "scale(0.9) translate(3px, 4px) rotate(-10deg) skew(5deg, 10deg)",
        transformOrigin: "5px 10px"
      });
      const container2 = createTestElement({
        transform: "scale(0.8) translate(4px, 5px) rotate(-20deg) skew(10deg, 15deg)",
        transformOrigin: "10px 15px"
      });
      const container3 = createTestElement({
        transform: "scale(0.7) translate(5px, 6px) rotate(-30deg) skew(15deg, 20deg)",
        transformOrigin: "15px 20px"
      });
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], { elements: () => [el] });
      container1.appendChild(container2);
      container2.appendChild(container3);
      container3.appendChild(el);
      const startRect = el.getBoundingClientRect();
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
      await waitNextFrame();
      const endRect = el.getBoundingClientRect();
      assert.equal(roundNumber2(endRect.x - startRect.x, 3), 1, "x");
      assert.equal(roundNumber2(endRect.y - startRect.y, 3), 1, "y");
      draggable.destroy();
      keyboardSensor.destroy();
      el.remove();
      container1.remove();
      container2.remove();
      container3.remove();
    });
    it("should work with individual transforms (translate, rotate, scale)", async () => {
      const el = createTestElement({
        translate: "100px 20%",
        scale: "1.2",
        rotate: "45deg",
        transform: "scale(1.2) translate(-5px, -6px) rotate(33deg) skew(30deg, -40deg)",
        transformOrigin: "21px 22px"
      });
      const container1 = createTestElement({
        translate: "10% -45px",
        scale: "0.5",
        rotate: "-25deg",
        transform: "scale(0.9) translate(3px, 4px) rotate(-10deg) skew(5deg, 10deg)",
        transformOrigin: "5px 10px"
      });
      const container2 = createTestElement({
        translate: "5% 10%",
        scale: "1.6",
        rotate: "189deg",
        transform: "scale(0.8) translate(4px, 5px) rotate(-20deg) skew(10deg, 15deg)",
        transformOrigin: "10px 15px"
      });
      const container3 = createTestElement({
        translate: "-20px -30px",
        scale: "0.4",
        rotate: "10deg",
        transform: "scale(0.7) translate(5px, 6px) rotate(-30deg) skew(15deg, 20deg)",
        transformOrigin: "15px 20px"
      });
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], { elements: () => [el] });
      container1.appendChild(container2);
      container2.appendChild(container3);
      container3.appendChild(el);
      const startRect = el.getBoundingClientRect();
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
      await waitNextFrame();
      const endRect = el.getBoundingClientRect();
      assert.equal(roundNumber2(endRect.x - startRect.x, 3), 1, "x");
      assert.equal(roundNumber2(endRect.y - startRect.y, 3), 1, "y");
      draggable.destroy();
      keyboardSensor.destroy();
      el.remove();
      container1.remove();
      container2.remove();
      container3.remove();
    });
  });
}

// tests/src/draggable/index.ts
describe("Draggable", () => {
  events();
  options();
  methods2();
  misc();
});

// tests/src/utils/default-page-styles.ts
function addDefaultPageStyles(doc) {
  if (doc.getElementById("default-page-styles")) return;
  const styleSheet = doc.createElement("style");
  styleSheet.id = "default-page-styles";
  styleSheet.type = "text/css";
  styleSheet.innerHTML = `
    * {
      box-sizing: border-box;
    }
    html { 
      width: 100%;
      height: 100%;
    }
    body {
      width: 100%;
      min-height: 100%;
      margin: 0;
    }
  `;
  doc.head.appendChild(styleSheet);
}
function removeDefaultPageStyles(doc) {
  doc.getElementById("default-page-styles")?.remove();
}

// tests/src/pointer-sensor/events/cancel.ts
function eventCancel() {
  describe("cancel", () => {
    it(`should be triggered correctly on pointercancel`, function() {
      const el = createTestElement();
      const s = new PointerSensor(el, { sourceEvents: "pointer" });
      let cancelEvent = null;
      let sourceEvent;
      s.on("cancel", (e) => {
        if (cancelEvent === null) {
          cancelEvent = e;
        } else {
          assert.fail("cancel event listener called twice");
        }
      });
      createFakeDrag(
        [
          { x: 1, y: 1 },
          { x: 2, y: 2 },
          { x: 2, y: 2 }
        ],
        {
          eventType: "pointer",
          stepDuration: 0,
          cancelAtEnd: true,
          onAfterStep: (e) => {
            if (e.type === "pointercancel") {
              sourceEvent = e;
            }
          }
        }
      );
      assert.deepEqual(cancelEvent, {
        type: "cancel",
        srcEvent: sourceEvent,
        target: el,
        pointerId: sourceEvent.pointerId,
        pointerType: sourceEvent.pointerType,
        x: 2,
        y: 2
      });
      s.destroy();
      el.remove();
    });
    it(`should be triggered correctly on touchcancel`, function() {
      const el = createTestElement();
      const s = new PointerSensor(el, { sourceEvents: "touch" });
      let cancelEvent = null;
      let sourceEvent;
      s.on("cancel", (e) => {
        if (cancelEvent === null) {
          cancelEvent = e;
        } else {
          assert.fail("cancel event listener called twice");
        }
      });
      createFakeDrag(
        [
          { x: 1, y: 1 },
          { x: 2, y: 2 },
          { x: 2, y: 2 }
        ],
        {
          eventType: "touch",
          stepDuration: 0,
          cancelAtEnd: true,
          onAfterStep: (e) => {
            if (e.type === "touchcancel") {
              sourceEvent = e;
            }
          }
        }
      );
      assert.deepEqual(cancelEvent, {
        type: "cancel",
        srcEvent: sourceEvent,
        target: el,
        pointerId: sourceEvent.changedTouches[0].identifier,
        pointerType: "touch",
        x: 2,
        y: 2
      });
      s.destroy();
      el.remove();
    });
  });
}

// tests/src/pointer-sensor/events/destroy.ts
function eventDestroy() {
  describe("destroy", () => {
    it(`should be triggered on destroy`, function() {
      const el = createTestElement();
      const s = new PointerSensor(el);
      let destroyEventCount = 0;
      s.on("destroy", (e) => {
        ++destroyEventCount;
        assert.deepEqual(e, { type: "destroy" });
      });
      s.destroy();
      assert.equal(destroyEventCount, 1);
      el.remove();
    });
  });
}

// tests/src/pointer-sensor/events/end.ts
function eventEnd() {
  describe("end", () => {
    it(`should be triggered correctly on mouseup`, function() {
      const el = createTestElement();
      const s = new PointerSensor(el, { sourceEvents: "mouse" });
      let endEvent = null;
      let sourceEvent;
      s.on("end", (e) => {
        if (endEvent === null) {
          endEvent = e;
        } else {
          assert.fail("end event listener called twice");
        }
      });
      createFakeDrag(
        [
          { x: 1, y: 1 },
          { x: 2, y: 2 },
          { x: 2, y: 2 }
        ],
        {
          eventType: "mouse",
          stepDuration: 0,
          onAfterStep: (e) => {
            if (e.type === "mouseup") {
              sourceEvent = e;
            }
          }
        }
      );
      assert.deepEqual(endEvent, {
        type: "end",
        srcEvent: sourceEvent,
        target: el,
        pointerId: -1,
        pointerType: "mouse",
        x: 2,
        y: 2
      });
      s.destroy();
      el.remove();
    });
    it(`should be triggered correctly on pointerup`, function() {
      const el = createTestElement();
      const s = new PointerSensor(el, { sourceEvents: "pointer" });
      let endEvent = null;
      let sourceEvent;
      s.on("end", (e) => {
        if (endEvent === null) {
          endEvent = e;
        } else {
          assert.fail("end event listener called twice");
        }
      });
      createFakeDrag(
        [
          { x: 1, y: 1 },
          { x: 2, y: 2 },
          { x: 2, y: 2 }
        ],
        {
          eventType: "pointer",
          stepDuration: 0,
          onAfterStep: (e) => {
            if (e.type === "pointerup") {
              sourceEvent = e;
            }
          }
        }
      );
      assert.deepEqual(endEvent, {
        type: "end",
        srcEvent: sourceEvent,
        target: el,
        pointerId: sourceEvent.pointerId,
        pointerType: sourceEvent.pointerType,
        x: 2,
        y: 2
      });
      s.destroy();
      el.remove();
    });
    it(`should be triggered correctly on touchend`, function() {
      const el = createTestElement();
      const s = new PointerSensor(el, { sourceEvents: "touch" });
      let endEvent = null;
      let sourceEvent;
      s.on("end", (e) => {
        if (endEvent === null) {
          endEvent = e;
        } else {
          assert.fail("end event listener called twice");
        }
      });
      createFakeDrag(
        [
          { x: 1, y: 1 },
          { x: 2, y: 2 },
          { x: 2, y: 2 }
        ],
        {
          eventType: "touch",
          stepDuration: 0,
          onAfterStep: (e) => {
            if (e.type === "touchend") {
              sourceEvent = e;
            }
          }
        }
      );
      assert.deepEqual(endEvent, {
        type: "end",
        srcEvent: sourceEvent,
        target: el,
        pointerId: sourceEvent.changedTouches[0].identifier,
        pointerType: "touch",
        x: 2,
        y: 2
      });
      s.destroy();
      el.remove();
    });
  });
}

// tests/src/pointer-sensor/events/move.ts
function eventMove() {
  describe("move", () => {
    it(`should be triggered correctly on mousemove`, function() {
      const el = createTestElement();
      const s = new PointerSensor(el, { sourceEvents: "mouse" });
      let moveEvent = null;
      let sourceEvent;
      s.on("move", (e) => {
        if (moveEvent === null) {
          moveEvent = e;
        } else {
          assert.fail("move event listener called twice");
        }
      });
      createFakeDrag(
        [
          { x: 1, y: 1 },
          { x: 2, y: 2 },
          { x: 2, y: 2 }
        ],
        {
          eventType: "mouse",
          stepDuration: 0,
          onAfterStep: (e) => {
            if (e.type === "mousemove") {
              sourceEvent = e;
            }
          }
        }
      );
      assert.deepEqual(moveEvent, {
        type: "move",
        srcEvent: sourceEvent,
        target: el,
        pointerId: -1,
        pointerType: "mouse",
        x: 2,
        y: 2
      });
      s.destroy();
      el.remove();
    });
    it(`should be triggered correctly on pointermove`, function() {
      const el = createTestElement();
      const s = new PointerSensor(el, { sourceEvents: "pointer" });
      let moveEvent = null;
      let sourceEvent;
      s.on("move", (e) => {
        if (moveEvent === null) {
          moveEvent = e;
        } else {
          assert.fail("move event listener called twice");
        }
      });
      createFakeDrag(
        [
          { x: 1, y: 1 },
          { x: 2, y: 2 },
          { x: 2, y: 2 }
        ],
        {
          eventType: "pointer",
          stepDuration: 0,
          onAfterStep: (e) => {
            if (e.type === "pointermove") {
              sourceEvent = e;
            }
          }
        }
      );
      assert.deepEqual(moveEvent, {
        type: "move",
        srcEvent: sourceEvent,
        target: el,
        pointerId: sourceEvent.pointerId,
        pointerType: sourceEvent.pointerType,
        x: 2,
        y: 2
      });
      s.destroy();
      el.remove();
    });
    it(`should be triggered correctly on touchmove`, function() {
      const el = createTestElement();
      const s = new PointerSensor(el, { sourceEvents: "touch" });
      let moveEvent = null;
      let sourceEvent;
      s.on("move", (e) => {
        if (moveEvent === null) {
          moveEvent = e;
        } else {
          assert.fail("start event listener called twice");
        }
      });
      createFakeDrag(
        [
          { x: 1, y: 1 },
          { x: 2, y: 2 },
          { x: 2, y: 2 }
        ],
        {
          eventType: "touch",
          stepDuration: 0,
          onAfterStep: (e) => {
            if (e.type === "touchmove") {
              sourceEvent = e;
            }
          }
        }
      );
      assert.deepEqual(moveEvent, {
        type: "move",
        srcEvent: sourceEvent,
        target: el,
        pointerId: sourceEvent.changedTouches[0].identifier,
        pointerType: "touch",
        x: 2,
        y: 2
      });
      s.destroy();
      el.remove();
    });
  });
}

// tests/src/pointer-sensor/events/start.ts
function eventStart() {
  describe("start", () => {
    it(`should be triggered correctly on mousedown`, function() {
      const el = createTestElement();
      const s = new PointerSensor(el, { sourceEvents: "mouse" });
      let startEvent = null;
      let sourceEvent;
      s.on("start", (e) => {
        if (startEvent === null) {
          startEvent = e;
        } else {
          assert.fail("start event listener called twice");
        }
      });
      createFakeDrag(
        [
          { x: 1, y: 1 },
          { x: 2, y: 2 },
          { x: 2, y: 2 }
        ],
        {
          eventType: "mouse",
          stepDuration: 0,
          onAfterStep: (e) => {
            if (e.type === "mousedown") {
              sourceEvent = e;
            }
          }
        }
      );
      assert.deepEqual(startEvent, {
        type: "start",
        srcEvent: sourceEvent,
        target: el,
        pointerId: -1,
        pointerType: "mouse",
        x: 1,
        y: 1
      });
      s.destroy();
      el.remove();
    });
    it(`should be triggered correctly on pointerdown`, function() {
      const el = createTestElement();
      const s = new PointerSensor(el, { sourceEvents: "pointer" });
      let startEvent = null;
      let sourceEvent;
      s.on("start", (e) => {
        if (startEvent === null) {
          startEvent = e;
        } else {
          assert.fail("start event listener called twice");
        }
      });
      createFakeDrag(
        [
          { x: 1, y: 1 },
          { x: 2, y: 2 },
          { x: 2, y: 2 }
        ],
        {
          eventType: "pointer",
          stepDuration: 0,
          onAfterStep: (e) => {
            if (e.type === "pointerdown") {
              sourceEvent = e;
            }
          }
        }
      );
      assert.deepEqual(startEvent, {
        type: "start",
        srcEvent: sourceEvent,
        target: el,
        pointerId: sourceEvent.pointerId,
        pointerType: sourceEvent.pointerType,
        x: 1,
        y: 1
      });
      s.destroy();
      el.remove();
    });
    it(`should be triggered correctly on touchstart`, function() {
      const el = createTestElement();
      const s = new PointerSensor(el, { sourceEvents: "touch" });
      let startEvent = null;
      let sourceEvent;
      s.on("start", (e) => {
        if (startEvent === null) {
          startEvent = e;
        } else {
          assert.fail("start event listener called twice");
        }
      });
      createFakeDrag(
        [
          { x: 1, y: 1 },
          { x: 2, y: 2 },
          { x: 2, y: 2 }
        ],
        {
          eventType: "touch",
          stepDuration: 0,
          onAfterStep: (e) => {
            if (e.type === "touchstart") {
              sourceEvent = e;
            }
          }
        }
      );
      assert.deepEqual(startEvent, {
        type: "start",
        srcEvent: sourceEvent,
        target: el,
        pointerId: sourceEvent.changedTouches[0].identifier,
        pointerType: "touch",
        x: 1,
        y: 1
      });
      s.destroy();
      el.remove();
    });
  });
}

// tests/src/pointer-sensor/events/index.ts
function events2() {
  describe("events", () => {
    eventCancel();
    eventDestroy();
    eventEnd();
    eventMove();
    eventStart();
  });
}

// tests/src/pointer-sensor/methods/cancel.ts
function methodCancel2() {
  describe("cancel", () => {
    it(`should cancel active drag forcefully`, () => {
      const el = createTestElement();
      const s = new PointerSensor(el, { sourceEvents: "pointer" });
      let cancelEventCount = 0;
      s.on("cancel", () => {
        ++cancelEventCount;
      });
      createFakeDrag(
        [
          { x: 1, y: 1 },
          { x: 2, y: 2 },
          { x: 2, y: 2 }
        ],
        {
          eventType: "pointer",
          stepDuration: 0,
          onAfterStep: () => {
            assert.notEqual(s.drag, null);
            s.cancel();
          }
        }
      );
      assert.equal(s.drag, null);
      assert.equal(cancelEventCount, 1);
      s.destroy();
      el.remove();
    });
  });
}

// tests/src/pointer-sensor/methods/destroy.ts
function methodDestroy3() {
  describe("destroy", () => {
    it(`should destroy the sensor`, () => {
      const el = createTestElement();
      const s = new PointerSensor(el, { sourceEvents: "pointer" });
      let cancelEventCount = 0;
      let destroyEventCount = 0;
      s.on("cancel", () => {
        ++cancelEventCount;
      });
      s.on("destroy", () => {
        ++destroyEventCount;
      });
      s.destroy();
      assert.equal(s.isDestroyed, true);
      assert.equal(destroyEventCount, 1);
      assert.equal(cancelEventCount, 0);
      el.remove();
    });
    it(`should destroy the sensor during drag`, () => {
      const el = createTestElement();
      const s = new PointerSensor(el, { sourceEvents: "pointer" });
      let cancelEventCount = 0;
      let destroyEventCount = 0;
      s.on("cancel", () => {
        ++cancelEventCount;
      });
      s.on("destroy", () => {
        ++destroyEventCount;
      });
      createFakeDrag(
        [
          { x: 1, y: 1 },
          { x: 2, y: 2 },
          { x: 2, y: 2 }
        ],
        {
          eventType: "pointer",
          stepDuration: 0,
          onAfterStep: () => {
            assert.notEqual(s.drag, null);
            s.destroy();
          }
        }
      );
      assert.equal(s.drag, null);
      assert.equal(s.isDestroyed, true);
      assert.equal(destroyEventCount, 1);
      assert.equal(cancelEventCount, 1);
      el.remove();
    });
  });
}

// tests/src/pointer-sensor/methods/off.ts
function methodOff3() {
  describe("off", () => {
    it("should remove an event listener based on id", () => {
      const el = createTestElement();
      const s = new PointerSensor(el, { sourceEvents: "mouse" });
      let msg = "";
      const idA = s.on("start", () => void (msg += "a"));
      s.on("start", () => void (msg += "b"));
      s.off("start", idA);
      el.dispatchEvent(
        new MouseEvent("mousedown", {
          clientX: 0,
          clientY: 0,
          bubbles: true,
          cancelable: true,
          view: window
        })
      );
      assert.equal(msg, "b");
      s.destroy();
      el.remove();
    });
  });
}

// tests/src/pointer-sensor/methods/on.ts
function methodOn3() {
  describe("on", () => {
    it("should return a unique symbol by default", () => {
      const el = createTestElement();
      const s = new PointerSensor(el);
      const idA = s.on("start", () => {
      });
      const idB = s.on("start", () => {
      });
      assert.equal(typeof idA, "symbol");
      assert.notEqual(idA, idB);
      el.remove();
      s.destroy();
    });
    it("should allow duplicate event listeners", () => {
      const el = createTestElement();
      const s = new PointerSensor(el, { sourceEvents: "mouse" });
      let counter = 0;
      const listener = () => {
        ++counter;
      };
      s.on("start", listener);
      s.on("start", listener);
      el.dispatchEvent(
        new MouseEvent("mousedown", {
          clientX: 0,
          clientY: 0,
          bubbles: true,
          cancelable: true,
          view: window
        })
      );
      assert.equal(counter, 2);
      el.remove();
      s.destroy();
    });
    it("should remove the existing listener and add the new one if the same id is used", () => {
      const el = createTestElement();
      const s = new PointerSensor(el, { sourceEvents: "mouse" });
      let msg = "";
      s.on("start", () => void (msg += "a"), 1);
      s.on("start", () => void (msg += "b"), 2);
      s.on("start", () => void (msg += "c"), 1);
      el.dispatchEvent(
        new MouseEvent("mousedown", {
          clientX: 0,
          clientY: 0,
          bubbles: true,
          cancelable: true,
          view: window
        })
      );
      assert.equal(msg, "bc");
      el.remove();
      s.destroy();
    });
    it("should allow defining a custom id (string/symbol/number) for the event listener via third argument", () => {
      const el = createTestElement();
      const s = new PointerSensor(el);
      const idA = Symbol();
      assert.equal(
        s.on("start", () => {
        }, idA),
        idA
      );
      const idB = 1;
      assert.equal(
        s.on("start", () => {
        }, idB),
        idB
      );
      const idC = "foo";
      assert.equal(
        s.on("start", () => {
        }, idC),
        idC
      );
      el.remove();
      s.destroy();
    });
  });
}

// tests/src/pointer-sensor/methods/update-settings.ts
function methodUpdateSettings2() {
  describe("updateSettings", () => {
    it(`should update startPredicate setting`, function() {
      const s = new PointerSensor(document.body, {
        sourceEvents: "mouse",
        startPredicate: () => false
      });
      document.body.dispatchEvent(new MouseEvent("mousedown"));
      assert.equal(s.drag, null);
      s.updateSettings({ startPredicate: () => true });
      document.body.dispatchEvent(new MouseEvent("mousedown"));
      assert.notEqual(s.drag, null);
    });
    it(`should update sourceEvents setting`, function() {
      const s = new PointerSensor(document.body, {
        sourceEvents: "pointer",
        startPredicate: () => true
      });
      document.body.dispatchEvent(new MouseEvent("mousedown"));
      assert.equal(s.drag, null);
      s.updateSettings({ sourceEvents: "mouse" });
      document.body.dispatchEvent(new MouseEvent("mousedown"));
      assert.notEqual(s.drag, null);
    });
  });
}

// tests/src/pointer-sensor/methods/index.ts
function methods3() {
  describe("methods", () => {
    methodCancel2();
    methodDestroy3();
    methodOff3();
    methodOn3();
    methodUpdateSettings2();
  });
}

// tests/src/pointer-sensor/options/source-events.ts
function optionSourceEvents() {
  describe("sourceEvents", () => {
    it('should listen to mouse/pointer/touch events when set to "mouse"/"pointer"/"touch"', function() {
      const mouseSensor = new PointerSensor(document.body, { sourceEvents: "mouse" });
      const pointerSensor = new PointerSensor(document.body, { sourceEvents: "pointer" });
      const touchSensor = new PointerSensor(document.body, { sourceEvents: "touch" });
      const mouseList = [];
      const pointerList = [];
      const touchList = [];
      mouseSensor.on("start", (e) => mouseList.push(e.type));
      mouseSensor.on("move", (e) => mouseList.push(e.type));
      mouseSensor.on("end", (e) => mouseList.push(e.type));
      pointerSensor.on("start", (e) => pointerList.push(e.type));
      pointerSensor.on("move", (e) => pointerList.push(e.type));
      pointerSensor.on("end", (e) => pointerList.push(e.type));
      touchSensor.on("start", (e) => touchList.push(e.type));
      touchSensor.on("move", (e) => touchList.push(e.type));
      touchSensor.on("end", (e) => touchList.push(e.type));
      createFakeDrag(
        [
          { x: 1, y: 1 },
          { x: 2, y: 2 },
          { x: 2, y: 2 }
        ],
        {
          eventType: "mouse",
          stepDuration: 0
        }
      );
      assert.deepEqual(mouseList, ["start", "move", "end"]);
      assert.deepEqual(pointerList, []);
      assert.deepEqual(touchList, []);
      mouseList.length = 0;
      createFakeDrag(
        [
          { x: 1, y: 1 },
          { x: 2, y: 2 },
          { x: 2, y: 2 }
        ],
        {
          eventType: "pointer",
          stepDuration: 0
        }
      );
      assert.deepEqual(mouseList, []);
      assert.deepEqual(pointerList, ["start", "move", "end"]);
      assert.deepEqual(touchList, []);
      pointerList.length = 0;
      createFakeDrag(
        [
          { x: 1, y: 1 },
          { x: 2, y: 2 },
          { x: 2, y: 2 }
        ],
        {
          eventType: "touch",
          stepDuration: 0
        }
      );
      assert.deepEqual(mouseList, []);
      assert.deepEqual(pointerList, []);
      assert.deepEqual(touchList, ["start", "move", "end"]);
      mouseSensor.destroy();
      pointerSensor.destroy();
      touchSensor.destroy();
    });
  });
}

// tests/src/pointer-sensor/options/start-predicate.ts
function optionStartPredicate2() {
  describe("startPredicate", () => {
    it("should allow start only when e.button is 0 by default", function() {
      const s = new PointerSensor(document.body, { sourceEvents: "mouse" });
      document.body.dispatchEvent(new MouseEvent("mousedown", { button: 1 }));
      assert.equal(s.drag, null);
      document.body.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));
      assert.notEqual(s.drag, null);
      s.destroy();
    });
    it("should allow start when true is returned and prevent start when false is returned", function() {
      const s1 = new PointerSensor(document.body, {
        sourceEvents: "mouse",
        startPredicate: () => true
      });
      const s2 = new PointerSensor(document.body, {
        sourceEvents: "mouse",
        startPredicate: () => false
      });
      document.body.dispatchEvent(new MouseEvent("mousedown"));
      assert.notEqual(s1.drag, null);
      assert.equal(s2.drag, null);
      s1.destroy();
      s2.destroy();
    });
  });
}

// tests/src/pointer-sensor/options/index.ts
function options2() {
  describe("options", () => {
    optionSourceEvents();
    optionStartPredicate2();
  });
}

// tests/src/pointer-sensor/properties/drag.ts
function propDrag2() {
  describe("drag", () => {
    it(`should be null on init`, function() {
      const s = new PointerSensor(document.body);
      assert.equal(s.drag, null);
      s.destroy();
    });
    it(`should contain drag data during drag`, function() {
      const el = createTestElement();
      const s = new PointerSensor(el, { sourceEvents: "pointer" });
      let dragEventCount = 0;
      createFakeDrag(
        [
          { x: 1, y: 1 },
          { x: 2, y: 2 },
          { x: 2, y: 2 }
        ],
        {
          eventType: "pointer",
          pointerId: 1,
          pointerType: "touch",
          stepDuration: 0,
          onAfterStep: (e) => {
            ++dragEventCount;
            if (e.type === "start") {
              assert.deepEqual(s.drag, {
                pointerId: 1,
                pointerType: "touch",
                x: 1,
                y: 1
              });
            } else if (e.type === "move") {
              assert.deepEqual(s.drag, {
                pointerId: 1,
                pointerType: "touch",
                x: 2,
                y: 2
              });
            } else if (e.type === "end") {
              assert.equal(s.drag, null);
            }
          }
        }
      );
      assert.equal(dragEventCount, 3);
      s.destroy();
      el.remove();
    });
  });
}

// tests/src/pointer-sensor/properties/is-destroyed.ts
function propIsDestroyed2() {
  describe("isDestroyed", () => {
    it(`should be false on init`, function() {
      const s = new PointerSensor(document.body);
      assert.equal(s.isDestroyed, false);
      s.destroy();
    });
    it(`should be true after destroy method is called`, function() {
      const s = new PointerSensor(document.body);
      s.destroy();
      assert.equal(s.isDestroyed, true);
    });
    it(`should prevent drag from starting when true`, () => {
      const el = createTestElement();
      const s = new PointerSensor(el, { sourceEvents: "mouse" });
      s.destroy();
      createFakeDrag(
        [
          { x: 1, y: 1 },
          { x: 2, y: 2 },
          { x: 2, y: 2 }
        ],
        {
          eventType: "mouse",
          stepDuration: 0,
          onAfterStep: () => {
            assert.equal(s.drag, null);
          }
        }
      );
      assert.equal(s.drag, null);
      el.remove();
    });
  });
}

// tests/src/pointer-sensor/properties/index.ts
function properties2() {
  describe("properties", () => {
    propDrag2();
    propIsDestroyed2();
  });
}

// tests/src/pointer-sensor/misc.ts
function misc2() {
  describe("misc", () => {
    describe("target element parameter", () => {
      it("should accept document.documentElement", function() {
        const s = new PointerSensor(document.documentElement, { sourceEvents: "mouse" });
        document.documentElement.dispatchEvent(new MouseEvent("mousedown"));
        assert.notEqual(s.drag, null);
        s.destroy();
      });
      it("should accept document.body", function() {
        const s = new PointerSensor(document.body, { sourceEvents: "mouse" });
        document.body.dispatchEvent(new MouseEvent("mousedown"));
        assert.notEqual(s.drag, null);
        s.destroy();
      });
      it("should accept a descendant of document.body", function() {
        const el = createTestElement();
        const s = new PointerSensor(el, { sourceEvents: "mouse" });
        el.dispatchEvent(new MouseEvent("mousedown"));
        assert.notEqual(s.drag, null);
        el.remove();
        s.destroy();
      });
    });
  });
}

// tests/src/pointer-sensor/index.ts
describe("PointerSensor", () => {
  beforeEach(() => {
    addDefaultPageStyles(document);
    return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });
  afterEach(() => {
    removeDefaultPageStyles(document);
    return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });
  events2();
  methods3();
  options2();
  properties2();
  misc2();
});

// tests/src/utils/blur-element.ts
function blurElement(element) {
  if (element === document.activeElement) {
    element.blur();
    element.dispatchEvent(new FocusEvent("blur"));
  }
}

// tests/src/utils/wait.ts
function wait(time) {
  return new Promise((resolve) => {
    window.setTimeout(() => {
      resolve(void 0);
    }, time);
  });
}

// tests/src/keyboard-sensor/options/cancel-on-blur.ts
function optionCancelOnBlur() {
  describe("cancelOnBlur", () => {
    it("should cancel drag on blur when true", async () => {
      const el = createTestElement();
      const s = new KeyboardSensor(el, { cancelOnBlur: true });
      assert.equal(s["_cancelOnBlur"], true);
      let cancelEvents = 0;
      s.on("cancel", () => {
        ++cancelEvents;
      });
      let endEvents = 0;
      s.on("end", () => {
        ++endEvents;
      });
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      assert.notEqual(s.drag, null);
      blurElement(el);
      await wait(1);
      assert.equal(s.drag, null);
      assert.equal(cancelEvents, 1);
      assert.equal(endEvents, 0);
      el.remove();
      s.destroy();
    });
    it("should not cancel drag on blur when false", () => {
      const el = createTestElement();
      const s = new KeyboardSensor(el, { cancelOnBlur: false });
      assert.equal(s["_cancelOnBlur"], false);
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      assert.notEqual(s.drag, null);
      blurElement(el);
      assert.notEqual(s.drag, null);
      el.remove();
      s.destroy();
    });
  });
}

// tests/src/keyboard-sensor/options/cancel-predicate.ts
function optionCancelPredicate() {
  describe("cancelPredicate", () => {
    it("should define the cancel predicate", () => {
      let returnValue = null;
      const el = createTestElement();
      const s = new KeyboardSensor(el, {
        cancelPredicate: (e, sensor) => {
          assert.equal(e.type, "keydown");
          assert.equal(sensor, s);
          return returnValue;
        }
      });
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      returnValue = null;
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
      assert.notEqual(s.drag, null);
      returnValue = void 0;
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
      assert.notEqual(s.drag, null);
      returnValue = { x: 1, y: 1 };
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
      assert.equal(s.drag, null);
      el.remove();
      s.destroy();
    });
    it(`should cancel drag with Escape by default`, function() {
      const el = createTestElement();
      const s = new KeyboardSensor(el);
      const srcEvent = new KeyboardEvent("keydown", { key: "Escape" });
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      assert.deepEqual(s.drag, { x: 0, y: 0 });
      document.dispatchEvent(srcEvent);
      assert.equal(s.drag, null);
      s.destroy();
      el.remove();
    });
  });
}

// tests/src/keyboard-sensor/options/end-predicate.ts
function optionEndPredicate() {
  describe("endPredicate", () => {
    it("should define the end predicate", () => {
      let returnValue = null;
      const el = createTestElement();
      const s = new KeyboardSensor(el, {
        endPredicate: (e, sensor) => {
          assert.equal(e.type, "keydown");
          assert.equal(sensor, s);
          return returnValue;
        }
      });
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      returnValue = null;
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      assert.notEqual(s.drag, null);
      returnValue = void 0;
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      assert.notEqual(s.drag, null);
      returnValue = { x: 1, y: 1 };
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      assert.equal(s.drag, null);
      el.remove();
      s.destroy();
    });
    it(`should end drag with Enter and Space by default when the target element is focused`, function() {
      ["Enter", " "].forEach((key) => {
        const el = createTestElement();
        const s = new KeyboardSensor(el);
        focusElement(el);
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
        assert.deepEqual(s.drag, { x: 0, y: 0 });
        document.dispatchEvent(new KeyboardEvent("keydown", { key }));
        assert.equal(s.drag, null);
        s.destroy();
        el.remove();
      });
    });
  });
}

// tests/src/keyboard-sensor/options/move-distance.ts
function optionMoveDistance() {
  describe("moveDistance", () => {
    it("should define the drag movement distance for x-axis and y-axis separately with an object", () => {
      const el = createTestElement();
      const s = new KeyboardSensor(el, { moveDistance: { x: 7, y: 9 } });
      assert.deepEqual(s.moveDistance, { x: 7, y: 9 });
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      assert.deepEqual(s.drag, { x: 0, y: 0 });
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
      assert.deepEqual(s.drag, { x: 7, y: 0 });
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
      assert.deepEqual(s.drag, { x: 7, y: 9 });
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft" }));
      assert.deepEqual(s.drag, { x: 0, y: 9 });
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp" }));
      assert.deepEqual(s.drag, { x: 0, y: 0 });
      el.remove();
      s.destroy();
    });
    it("should define the drag movement distance for both axes with a number", () => {
      const el = createTestElement();
      const s = new KeyboardSensor(el, { moveDistance: 5 });
      assert.deepEqual(s.moveDistance, { x: 5, y: 5 });
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      assert.deepEqual(s.drag, { x: 0, y: 0 });
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
      assert.deepEqual(s.drag, { x: 5, y: 0 });
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
      assert.deepEqual(s.drag, { x: 5, y: 5 });
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft" }));
      assert.deepEqual(s.drag, { x: 0, y: 5 });
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp" }));
      assert.deepEqual(s.drag, { x: 0, y: 0 });
      el.remove();
      s.destroy();
    });
  });
}

// tests/src/keyboard-sensor/options/move-predicate.ts
function optionMovePredicate() {
  describe("movePredicate", () => {
    it("should define the move predicate", () => {
      let returnValue = null;
      const el = createTestElement();
      const s = new KeyboardSensor(el, {
        movePredicate: (e, sensor) => {
          assert.equal(e.type, "keydown");
          assert.equal(sensor, s);
          return returnValue;
        }
      });
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      returnValue = null;
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
      assert.deepEqual(s.drag, { x: 0, y: 0 });
      returnValue = void 0;
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
      assert.deepEqual(s.drag, { x: 0, y: 0 });
      returnValue = { x: 1, y: 1 };
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
      assert.deepEqual(s.drag, returnValue);
      el.remove();
      s.destroy();
    });
    it(`should move drag with arrow keys by default`, function() {
      ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].forEach((key) => {
        const el = createTestElement();
        const s = new KeyboardSensor(el, { moveDistance: 1 });
        const srcEvent = new KeyboardEvent("keydown", { key });
        focusElement(el);
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
        document.dispatchEvent(srcEvent);
        switch (key) {
          case "ArrowLeft":
            assert.deepEqual(s.drag, { x: -1, y: 0 });
            break;
          case "ArrowRight":
            assert.deepEqual(s.drag, { x: 1, y: 0 });
            break;
          case "ArrowUp":
            assert.deepEqual(s.drag, { x: 0, y: -1 });
            break;
          case "ArrowDown":
            assert.deepEqual(s.drag, { x: 0, y: 1 });
            break;
        }
        s.destroy();
        el.remove();
      });
    });
  });
}

// tests/src/keyboard-sensor/options/start-predicate.ts
function optionStartPredicate3() {
  describe("startPredicate", () => {
    it("should define the start predicate", () => {
      let returnValue = null;
      const el = createTestElement();
      const s = new KeyboardSensor(el, {
        startPredicate: (e, sensor) => {
          assert.equal(e.type, "keydown");
          assert.equal(sensor, s);
          return returnValue;
        }
      });
      returnValue = null;
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      assert.equal(s.drag, null);
      returnValue = void 0;
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      assert.equal(s.drag, null);
      returnValue = { x: 10, y: 20 };
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      assert.deepEqual(s.drag, { x: 10, y: 20 });
      el.remove();
      s.destroy();
    });
    it(`should start drag with Enter and Space by default when the target element is focused`, function() {
      ["Enter", " "].forEach((key) => {
        const el = createTestElement();
        const elDecoy = createTestElement();
        const s = new KeyboardSensor(el);
        const srcEvent = new KeyboardEvent("keydown", { key });
        document.dispatchEvent(srcEvent);
        assert.equal(s.drag, null);
        focusElement(elDecoy);
        document.dispatchEvent(srcEvent);
        assert.equal(s.drag, null);
        focusElement(el);
        document.dispatchEvent(srcEvent);
        assert.deepEqual(s.drag, { x: 0, y: 0 });
        s.destroy();
        el.remove();
        elDecoy.remove();
      });
    });
  });
}

// tests/src/keyboard-sensor/options/index.ts
function options3() {
  describe("options", () => {
    optionCancelOnBlur();
    optionCancelPredicate();
    optionEndPredicate();
    optionMoveDistance();
    optionMovePredicate();
    optionStartPredicate3();
  });
}

// tests/src/keyboard-sensor/properties/drag.ts
function propDrag3() {
  describe("drag", () => {
    it(`should be null on init`, function() {
      const el = createTestElement();
      const s = new KeyboardSensor(el);
      assert.equal(s.drag, null);
      el.remove();
      s.destroy();
    });
    it(`should be null after destroy method is called`, function() {
      const el = createTestElement();
      const s = new KeyboardSensor(el);
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      assert.notEqual(s.drag, null);
      s.destroy();
      assert.equal(s.drag, null);
      el.remove();
    });
    it(`should match the current drag position`, function() {
      const el = createTestElement();
      const s = new KeyboardSensor(el, { moveDistance: 1 });
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      assert.deepEqual(s.drag, { x: 0, y: 0 });
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
      assert.deepEqual(s.drag, { x: 1, y: 0 });
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
      assert.deepEqual(s.drag, { x: 1, y: 1 });
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft" }));
      assert.deepEqual(s.drag, { x: 0, y: 1 });
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp" }));
      assert.deepEqual(s.drag, { x: 0, y: 0 });
      s.destroy();
      el.remove();
    });
  });
}

// tests/src/keyboard-sensor/properties/is-destroyed.ts
function propIsDestroyed3() {
  describe("isDestroyed", () => {
    it(`should be false on init`, function() {
      const el = createTestElement();
      const s = new KeyboardSensor(el);
      assert.equal(s.isDestroyed, false);
      el.remove();
      s.destroy();
    });
    it(`should be true after destroy method is called`, function() {
      const el = createTestElement();
      const s = new KeyboardSensor(el);
      s.destroy();
      assert.equal(s.isDestroyed, true);
      el.remove();
    });
    it(`should prevent drag from starting when true`, () => {
      const el = createTestElement();
      const s = new KeyboardSensor(el);
      s.destroy();
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      assert.equal(s.drag, null);
      el.remove();
    });
  });
}

// tests/src/keyboard-sensor/properties/index.ts
function properties3() {
  describe("properties", () => {
    propDrag3();
    propIsDestroyed3();
  });
}

// tests/src/keyboard-sensor/methods/cancel.ts
function methodCancel3() {
  describe("cancel", () => {
    it(`should emit "cancel" event with correct arguments after updating instance properties`, () => {
      const el = createTestElement();
      const s = new KeyboardSensor(el);
      let events5 = [];
      s.on("start", (data) => void events5.push(data.type));
      s.on("move", (data) => void events5.push(data.type));
      s.on("end", (data) => void events5.push(data.type));
      s.on("destroy", (data) => void events5.push(data.type));
      s.on("cancel", (data) => {
        assert.deepEqual(data, {
          type: "cancel",
          x: s.drag.x,
          y: s.drag.y
        });
        events5.push(data.type);
      });
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      assert.notEqual(s.drag, null);
      s.cancel();
      assert.equal(s.drag, null);
      assert.deepEqual(events5, ["start", "cancel"]);
      s.destroy();
      el.remove();
    });
    it(`should not do anything if drag is not active`, () => {
      const el = createTestElement();
      const s = new KeyboardSensor(el);
      let events5 = [];
      s.on("start", (data) => void events5.push(data.type));
      s.on("move", (data) => void events5.push(data.type));
      s.on("end", (data) => void events5.push(data.type));
      s.on("destroy", (data) => void events5.push(data.type));
      s.on("cancel", (data) => void events5.push(data.type));
      s.cancel();
      assert.deepEqual(events5, []);
      s.destroy();
      el.remove();
    });
  });
}

// tests/src/keyboard-sensor/methods/destroy.ts
function methodDestroy4() {
  describe("destroy", () => {
    it("should allow destroying only once", () => {
      const el = createTestElement();
      const s = new KeyboardSensor(el);
      let events5 = [];
      s.destroy();
      s.on("destroy", (data) => void events5.push(data.type));
      s.destroy();
      assert.deepEqual(events5, []);
      el.remove();
    });
    describe("if drag active", () => {
      it(`should set isDestroyed property to true, emit "cancel" event with the current x/y coordinates, reset drag data, emit "destroy" event and remove all listeners`, () => {
        const el = createTestElement();
        const s = new KeyboardSensor(el);
        let events5 = [];
        s.on("start", (data) => void events5.push(data.type));
        s.on("move", (data) => void events5.push(data.type));
        s.on("end", (data) => void events5.push(data.type));
        s.on("cancel", (data) => {
          assert.notEqual(s.drag, null);
          assert.equal(s.isDestroyed, true);
          assert.deepEqual(data, {
            type: "cancel",
            x: s.drag.x,
            y: s.drag.y
          });
          events5.push(data.type);
        });
        s.on("destroy", (data) => {
          assert.equal(s.drag, null);
          assert.equal(s.isDestroyed, true);
          assert.deepEqual(data, { type: "destroy" });
          events5.push(data.type);
        });
        assert.equal(s["_emitter"].listenerCount(), 5);
        focusElement(el);
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
        s.destroy();
        el.remove();
        assert.equal(s.drag, null);
        assert.equal(s.isDestroyed, true);
        assert.deepEqual(events5, ["start", "cancel", "destroy"]);
        assert.equal(s["_emitter"].listenerCount(), 0);
      });
    });
    describe("if drag is not active", () => {
      it(`should set isDestroyed property to true, emit "destroy" event and remove all listeners`, () => {
        const el = createTestElement();
        const s = new KeyboardSensor(el);
        let events5 = [];
        s.on("start", (data) => void events5.push(data.type));
        s.on("move", (data) => void events5.push(data.type));
        s.on("end", (data) => void events5.push(data.type));
        s.on("cancel", (data) => void events5.push(data.type));
        s.on("destroy", (data) => {
          assert.equal(s.drag, null);
          assert.equal(s.isDestroyed, true);
          assert.deepEqual(data, { type: "destroy" });
          events5.push(data.type);
        });
        assert.equal(s["_emitter"].listenerCount(), 5);
        s.destroy();
        el.remove();
        assert.equal(s.drag, null);
        assert.equal(s.isDestroyed, true);
        assert.deepEqual(events5, ["destroy"]);
        assert.equal(s["_emitter"].listenerCount(), 0);
      });
    });
  });
}

// tests/src/keyboard-sensor/methods/off.ts
function methodOff4() {
  describe("off", () => {
    it("should remove an event listener based on id", () => {
      const el = createTestElement();
      const s = new KeyboardSensor(el);
      let msg = "";
      const idA = s.on("start", () => void (msg += "a"));
      s.on("start", () => void (msg += "b"));
      s.off("start", idA);
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      assert.equal(msg, "b");
      s.destroy();
      el.remove();
    });
  });
}

// tests/src/keyboard-sensor/methods/on.ts
function methodOn4() {
  describe("on", () => {
    it("should return a unique symbol by default", () => {
      const el = createTestElement();
      const s = new KeyboardSensor(el);
      const idA = s.on("start", () => {
      });
      const idB = s.on("start", () => {
      });
      assert.equal(typeof idA, "symbol");
      assert.notEqual(idA, idB);
      el.remove();
      s.destroy();
    });
    it("should allow duplicate event listeners", () => {
      const el = createTestElement();
      const s = new KeyboardSensor(el);
      let counter = 0;
      const listener = () => {
        ++counter;
      };
      s.on("start", listener);
      s.on("start", listener);
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      assert.equal(counter, 2);
      el.remove();
      s.destroy();
    });
    it("should remove the existing listener and add the new one if the same id is used", () => {
      const el = createTestElement();
      const s = new KeyboardSensor(el);
      let msg = "";
      s.on("start", () => void (msg += "a"), 1);
      s.on("start", () => void (msg += "b"), 2);
      s.on("start", () => void (msg += "c"), 1);
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      assert.equal(msg, "bc");
      el.remove();
      s.destroy();
    });
    it("should allow defining a custom id (string/symbol/number) for the event listener via third argument", () => {
      const el = createTestElement();
      const s = new KeyboardSensor(el);
      const idA = Symbol();
      assert.equal(
        s.on("start", () => {
        }, idA),
        idA
      );
      const idB = 1;
      assert.equal(
        s.on("start", () => {
        }, idB),
        idB
      );
      const idC = "foo";
      assert.equal(
        s.on("start", () => {
        }, idC),
        idC
      );
      el.remove();
      s.destroy();
    });
  });
}

// tests/src/keyboard-sensor/methods/update-settings.ts
function methodUpdateSettings3() {
  describe("updateSettings", () => {
    it(`should update settings`, function() {
      const initSettings = {
        moveDistance: 25,
        cancelOnBlur: false,
        cancelOnVisibilityChange: false,
        startPredicate: () => null,
        movePredicate: () => null,
        cancelPredicate: () => null,
        endPredicate: () => null
      };
      const updatedSettings = {
        moveDistance: 50,
        cancelOnBlur: true,
        cancelOnVisibilityChange: true,
        startPredicate: () => void 0,
        movePredicate: () => void 0,
        cancelPredicate: () => void 0,
        endPredicate: () => void 0
      };
      const el = createTestElement();
      const s = new KeyboardSensor(el, initSettings);
      assert.equal(s.moveDistance.x, initSettings.moveDistance);
      assert.equal(s.moveDistance.y, initSettings.moveDistance);
      assert.equal(s["_cancelOnBlur"], initSettings.cancelOnBlur);
      assert.equal(s["_cancelOnVisibilityChange"], initSettings.cancelOnVisibilityChange);
      assert.equal(s["_startPredicate"], initSettings.startPredicate);
      assert.equal(s["_movePredicate"], initSettings.movePredicate);
      assert.equal(s["_cancelPredicate"], initSettings.cancelPredicate);
      assert.equal(s["_endPredicate"], initSettings.endPredicate);
      s.updateSettings(updatedSettings);
      assert.equal(s.moveDistance.x, updatedSettings.moveDistance);
      assert.equal(s.moveDistance.y, updatedSettings.moveDistance);
      assert.equal(s["_cancelOnBlur"], updatedSettings.cancelOnBlur);
      assert.equal(s["_cancelOnVisibilityChange"], updatedSettings.cancelOnVisibilityChange);
      assert.equal(s["_startPredicate"], updatedSettings.startPredicate);
      assert.equal(s["_movePredicate"], updatedSettings.movePredicate);
      assert.equal(s["_cancelPredicate"], updatedSettings.cancelPredicate);
      assert.equal(s["_endPredicate"], updatedSettings.endPredicate);
      s.destroy();
      el.remove();
    });
  });
}

// tests/src/keyboard-sensor/methods/index.ts
function methods4() {
  describe("methods", () => {
    methodCancel3();
    methodDestroy4();
    methodOff4();
    methodOn4();
    methodUpdateSettings3();
  });
}

// tests/src/keyboard-sensor/events/cancel.ts
function eventCancel2() {
  describe("cancel", () => {
    it("should be triggered on drag cancel", () => {
      const el = createTestElement();
      const s = new KeyboardSensor(el);
      const cancelEvent = {
        type: "cancel",
        x: 0,
        y: 0,
        srcEvent: new KeyboardEvent("keydown", { key: "Escape" })
      };
      let cancelEventCount = 0;
      s.on("cancel", (e) => {
        assert.deepEqual(e, cancelEvent);
        ++cancelEventCount;
      });
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      document.dispatchEvent(cancelEvent.srcEvent);
      assert.equal(cancelEventCount, 1);
      el.remove();
      s.destroy();
    });
  });
}

// tests/src/keyboard-sensor/events/destroy.ts
function eventDestroy2() {
  describe("destroy", () => {
    it("should be triggered on destroy", () => {
      const el = createTestElement();
      const s = new KeyboardSensor(el);
      let destroyEventCount = 0;
      s.on("destroy", (e) => {
        assert.deepEqual(e, { type: "destroy" });
        ++destroyEventCount;
      });
      s.destroy();
      assert.equal(destroyEventCount, 1);
      el.remove();
    });
  });
}

// tests/src/keyboard-sensor/events/end.ts
function eventEnd2() {
  describe("end", () => {
    it("should be triggered on drag end", () => {
      const el = createTestElement();
      const s = new KeyboardSensor(el);
      const endEvent = {
        type: "end",
        x: 0,
        y: 0,
        srcEvent: new KeyboardEvent("keydown", { key: "Enter" })
      };
      let endEventCount = 0;
      s.on("end", (e) => {
        assert.deepEqual(e, endEvent);
        ++endEventCount;
      });
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      document.dispatchEvent(endEvent.srcEvent);
      assert.equal(endEventCount, 1);
      el.remove();
      s.destroy();
    });
  });
}

// tests/src/keyboard-sensor/events/move.ts
function eventMove2() {
  describe("move", () => {
    it("should be triggered on drag move", () => {
      const el = createTestElement();
      const s = new KeyboardSensor(el, { moveDistance: 1 });
      let expectedEvent;
      let moveEventCount = 0;
      s.on("move", (e) => {
        assert.deepEqual(e, expectedEvent);
        ++moveEventCount;
        return;
      });
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      expectedEvent = {
        type: "move",
        x: -1,
        y: 0,
        srcEvent: new KeyboardEvent("keydown", { key: "ArrowLeft" })
      };
      document.dispatchEvent(expectedEvent.srcEvent);
      expectedEvent = {
        type: "move",
        x: 0,
        y: 0,
        srcEvent: new KeyboardEvent("keydown", { key: "ArrowRight" })
      };
      document.dispatchEvent(expectedEvent.srcEvent);
      expectedEvent = {
        type: "move",
        x: 0,
        y: -1,
        srcEvent: new KeyboardEvent("keydown", { key: "ArrowUp" })
      };
      document.dispatchEvent(expectedEvent.srcEvent);
      expectedEvent = {
        type: "move",
        x: 0,
        y: 0,
        srcEvent: new KeyboardEvent("keydown", { key: "ArrowDown" })
      };
      document.dispatchEvent(expectedEvent.srcEvent);
      assert.equal(moveEventCount, 4);
      el.remove();
      s.destroy();
    });
  });
}

// tests/src/keyboard-sensor/events/start.ts
function eventStart2() {
  describe("start", () => {
    it(`should be triggered on drag start`, function() {
      const el = createTestElement({ left: "10px", top: "20px" });
      const s = new KeyboardSensor(el);
      const expectedEvent = {
        type: "start",
        x: 10,
        y: 20,
        srcEvent: new KeyboardEvent("keydown", { key: "Enter" })
      };
      let startEventCount = 0;
      s.on("start", (e) => {
        assert.deepEqual(e, expectedEvent);
        ++startEventCount;
      });
      focusElement(el);
      document.dispatchEvent(expectedEvent.srcEvent);
      assert.equal(startEventCount, 1);
      el.remove();
      s.destroy();
    });
  });
}

// tests/src/keyboard-sensor/events/index.ts
function events3() {
  describe("events", () => {
    eventCancel2();
    eventDestroy2();
    eventEnd2();
    eventMove2();
    eventStart2();
  });
}

// tests/src/keyboard-sensor/index.ts
describe("KeyboardSensor", () => {
  beforeEach(() => {
    addDefaultPageStyles(document);
    return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });
  afterEach(() => {
    removeDefaultPageStyles(document);
    return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });
  options3();
  properties3();
  methods4();
  events3();
});

// tests/src/utils/keyboard-helpers.ts
var press = (key) => document.dispatchEvent(new KeyboardEvent("keydown", { key }));
var startDrag = async (el) => {
  focusElement(el);
  press("Enter");
  await waitNextFrame();
};
var endDrag = async () => {
  press("Enter");
  await waitNextFrame();
};
var move = async (direction, times = 1) => {
  for (let i = 0; i < times; i++) {
    press(`Arrow${direction}`);
    await waitNextFrame();
  }
};

// tests/src/dnd-context/events.ts
function events4() {
  describe("events", () => {
    it("should emit start and end events during drag lifecycle", async () => {
      const events5 = [];
      const dragElement = createTestElement({ left: "0px", top: "0px" });
      const dropElement = createTestElement({ left: "200px", top: "0px" });
      const keyboardSensor = new KeyboardSensor(dragElement, { moveDistance: 10 });
      const draggable = new Draggable([keyboardSensor], {
        elements: () => [dragElement],
        group: "test"
      });
      const droppable = new Droppable(dropElement, {
        accept: ["test"]
      });
      const dndContext = new DndContext();
      dndContext.on("start", (data) => {
        assert.equal(data.draggable, draggable);
        assert.instanceOf(data.targets, Map);
        assert.equal(data.targets.size, 1);
        assert.isTrue(data.targets.has(droppable.id));
        events5.push("start");
      });
      dndContext.on("end", (data) => {
        assert.equal(data.draggable, draggable);
        assert.instanceOf(data.targets, Map);
        assert.equal(data.targets.size, 1);
        assert.isTrue(data.targets.has(droppable.id));
        events5.push("end");
      });
      dndContext.addDraggables([draggable]);
      dndContext.addDroppables([droppable]);
      await startDrag(dragElement);
      assert.deepEqual(events5, ["start"]);
      events5.length = 0;
      await endDrag();
      assert.deepEqual(events5, ["end"]);
      dndContext.destroy();
      draggable.destroy();
      droppable.destroy();
      keyboardSensor.destroy();
      dragElement.remove();
      dropElement.remove();
    });
    it("should emit move events during drag movement", async () => {
      const events5 = [];
      const dragElement = createTestElement({ left: "0px", top: "0px" });
      const dropElement = createTestElement({ left: "200px", top: "0px" });
      const keyboardSensor = new KeyboardSensor(dragElement, { moveDistance: 10 });
      const draggable = new Draggable([keyboardSensor], {
        elements: () => [dragElement],
        group: "test"
      });
      const droppable = new Droppable(dropElement, {
        accept: ["test"]
      });
      const dndContext = new DndContext();
      dndContext.on("move", (data) => {
        assert.equal(data.draggable, draggable);
        assert.instanceOf(data.targets, Map);
        events5.push("move");
      });
      dndContext.addDraggables([draggable]);
      dndContext.addDroppables([droppable]);
      await startDrag(dragElement);
      await move("Right");
      assert.equal(events5.length, 1);
      assert.equal(events5[0], "move");
      await endDrag();
      dndContext.destroy();
      draggable.destroy();
      droppable.destroy();
      keyboardSensor.destroy();
      dragElement.remove();
      dropElement.remove();
    });
    it("should emit enter and leave events when draggable enters/leaves droppable", async () => {
      const events5 = [];
      const dragElement = createTestElement({
        left: "0px",
        top: "0px",
        width: "50px",
        height: "50px"
      });
      const dropElement = createTestElement({
        left: "100px",
        top: "0px",
        width: "50px",
        height: "50px"
      });
      const keyboardSensor = new KeyboardSensor(dragElement, { moveDistance: 101 });
      const draggable = new Draggable([keyboardSensor], {
        elements: () => [dragElement],
        group: "test"
      });
      const droppable = new Droppable(dropElement, {
        accept: ["test"]
      });
      const dndContext = new DndContext();
      dndContext.on("enter", (data) => {
        events5.push({
          type: "enter",
          collisions: data.collisions.length,
          addedContacts: data.addedContacts.size
        });
      });
      dndContext.on("leave", (data) => {
        events5.push({
          type: "leave",
          collisions: data.collisions.length,
          removedContacts: data.removedContacts.size
        });
      });
      dndContext.addDraggables([draggable]);
      dndContext.addDroppables([droppable]);
      await startDrag(dragElement);
      await move("Right");
      assert.equal(events5.length, 1);
      assert.equal(events5[0].type, "enter");
      assert.equal(events5[0].collisions, 1);
      assert.equal(events5[0].addedContacts, 1);
      await move("Right");
      assert.equal(events5.length, 2);
      assert.equal(events5[1].type, "leave");
      assert.equal(events5[1].collisions, 0);
      assert.equal(events5[1].removedContacts, 1);
      await endDrag();
      dndContext.destroy();
      draggable.destroy();
      droppable.destroy();
      keyboardSensor.destroy();
      dragElement.remove();
      dropElement.remove();
    });
    it("should include collisions in end event when draggable ends over droppable", async () => {
      const events5 = [];
      const dragElement = createTestElement({
        left: "0px",
        top: "0px",
        width: "50px",
        height: "50px"
      });
      const dropElement = createTestElement({
        left: "0px",
        top: "0px",
        width: "50px",
        height: "50px"
      });
      const keyboardSensor = new KeyboardSensor(dragElement, { moveDistance: 10 });
      const draggable = new Draggable([keyboardSensor], {
        elements: () => [dragElement],
        group: "test"
      });
      const droppable = new Droppable(dropElement, {
        accept: ["test"]
      });
      const dndContext = new DndContext();
      dndContext.on("end", (data) => {
        assert.equal(data.draggable, draggable);
        assert.equal(data.collisions.length, 1);
        assert.isTrue(data.collisions.some((c) => c.droppableId === droppable.id));
        events5.push("end");
      });
      dndContext.addDraggables([draggable]);
      dndContext.addDroppables([droppable]);
      await startDrag(dragElement);
      await endDrag();
      assert.equal(events5.length, 1);
      assert.equal(events5[0], "end");
      dndContext.destroy();
      draggable.destroy();
      droppable.destroy();
      keyboardSensor.destroy();
      dragElement.remove();
      dropElement.remove();
    });
    it("should emit addDraggables and removeDraggables events", () => {
      const events5 = [];
      const dragElement = createTestElement();
      const keyboardSensor = new KeyboardSensor(dragElement, { moveDistance: 10 });
      const draggable = new Draggable([keyboardSensor], {
        elements: () => [dragElement],
        group: "test"
      });
      const dndContext = new DndContext();
      dndContext.on("addDraggables", (data) => {
        events5.push({ type: "addDraggables", draggables: data.draggables });
      });
      dndContext.on("removeDraggables", (data) => {
        events5.push({ type: "removeDraggables", draggables: data.draggables });
      });
      dndContext.addDraggables([draggable]);
      assert.equal(events5.length, 1);
      assert.equal(events5[0].type, "addDraggables");
      assert.equal(events5[0].draggables.has(draggable), true);
      dndContext.removeDraggables([draggable]);
      assert.equal(events5.length, 2);
      assert.equal(events5[1].type, "removeDraggables");
      assert.equal(events5[1].draggables.has(draggable), true);
      dndContext.destroy();
      draggable.destroy();
      keyboardSensor.destroy();
      dragElement.remove();
    });
    it("should emit addDroppable and removeDroppable events", () => {
      const events5 = [];
      const dropElement = createTestElement();
      const droppable = new Droppable(dropElement, {
        accept: ["test"]
      });
      const dndContext = new DndContext();
      dndContext.on("addDroppables", (data) => {
        data.droppables.forEach((droppable2) => {
          events5.push({ type: "addDroppable", droppable: droppable2 });
        });
      });
      dndContext.on("removeDroppables", (data) => {
        data.droppables.forEach((droppable2) => {
          events5.push({ type: "removeDroppable", droppable: droppable2 });
        });
      });
      dndContext.addDroppables([droppable]);
      assert.equal(events5.length, 1);
      assert.equal(events5[0].type, "addDroppable");
      assert.equal(events5[0].droppable, droppable);
      dndContext.removeDroppables([droppable]);
      assert.equal(events5.length, 2);
      assert.equal(events5[1].type, "removeDroppable");
      assert.equal(events5[1].droppable, droppable);
      dndContext.destroy();
      droppable.destroy();
      dropElement.remove();
    });
    it("should emit end with canceled=true when drag is cancelled", async () => {
      const events5 = [];
      const dragElement = createTestElement();
      const keyboardSensor = new KeyboardSensor(dragElement, { moveDistance: 10 });
      const draggable = new Draggable([keyboardSensor], {
        elements: () => [dragElement],
        group: "test"
      });
      const dndContext = new DndContext();
      dndContext.on("end", (data) => {
        assert.equal(data.draggable, draggable);
        assert.isTrue(data.canceled);
        events5.push("end");
      });
      dndContext.addDraggables([draggable]);
      await startDrag(dragElement);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
      assert.equal(events5.length, 1);
      assert.equal(events5[0], "end");
      dndContext.destroy();
      draggable.destroy();
      keyboardSensor.destroy();
      dragElement.remove();
    });
    it("should emit destroy event when context is destroyed", () => {
      const events5 = [];
      const dndContext = new DndContext();
      dndContext.on("destroy", () => {
        events5.push("destroy");
      });
      dndContext.destroy();
      assert.equal(events5.length, 1);
      assert.equal(events5[0], "destroy");
    });
  });
  describe("event flow and ordering", () => {
    it("should emit leave \u2192 enter \u2192 collide in order when transitioning between droppables", async () => {
      const order = [];
      const dragEl = createTestElement({ left: "0px", top: "0px", width: "40px", height: "40px" });
      const dropA = createTestElement({ left: "0px", top: "0px", width: "40px", height: "40px" });
      const dropB = createTestElement({ left: "50px", top: "0px", width: "40px", height: "40px" });
      const sensor = new KeyboardSensor(dragEl, { moveDistance: 60 });
      const draggable = new Draggable([sensor], { elements: () => [dragEl], group: "g" });
      const droppableA = new Droppable(dropA, { accept: ["g"] });
      const droppableB = new Droppable(dropB, { accept: ["g"] });
      const ctx = new DndContext();
      ctx.on("leave", () => order.push("leave"));
      ctx.on("enter", () => order.push("enter"));
      ctx.on("collide", () => order.push("collide"));
      ctx.addDraggables([draggable]);
      ctx.addDroppables([droppableA, droppableB]);
      await startDrag(dragEl);
      order.length = 0;
      await move("Right");
      assert.isTrue(order.includes("enter"));
      if (order.includes("leave")) {
        assert.isBelow(order.indexOf("leave"), order.indexOf("enter"));
      }
      ctx.destroy();
      draggable.destroy();
      droppableA.destroy();
      droppableB.destroy();
      sensor.destroy();
      dragEl.remove();
      dropA.remove();
      dropB.remove();
    });
    it("should emit end with collisions when ending after first enter", async () => {
      const events5 = [];
      const dragEl = createTestElement({ left: "0px", top: "0px", width: "40px", height: "40px" });
      const dropEl = createTestElement({ left: "0px", top: "0px", width: "40px", height: "40px" });
      const sensor = new KeyboardSensor(dragEl, { moveDistance: 10 });
      const draggable = new Draggable([sensor], { elements: () => [dragEl], group: "g" });
      const droppable = new Droppable(dropEl, { accept: ["g"] });
      const ctx = new DndContext();
      let gotEnter = false;
      ctx.on("enter", ({ collisions }) => {
        events5.push("enter");
        gotEnter = true;
        assert.isAtLeast(collisions.length, 1);
      });
      ctx.on("end", ({ canceled, collisions }) => {
        events5.push("end");
        assert.isFalse(canceled);
        assert.isAtLeast(collisions.length, 1);
      });
      ctx.addDraggables([draggable]);
      ctx.addDroppables([droppable]);
      await startDrag(dragEl);
      await waitNextFrame();
      assert.isTrue(gotEnter);
      await endDrag();
      assert.deepEqual(events5, ["enter", "end"]);
      ctx.destroy();
      draggable.destroy();
      droppable.destroy();
      sensor.destroy();
      dragEl.remove();
      dropEl.remove();
    });
    it("should honor clearTargets when accept changes mid-drag", async () => {
      const events5 = [];
      const dragEl = createTestElement({ left: "0px", top: "0px", width: "40px", height: "40px" });
      const dropEl = createTestElement({ left: "0px", top: "0px", width: "40px", height: "40px" });
      let accepts = false;
      const sensor = new KeyboardSensor(dragEl, { moveDistance: 10 });
      const draggable = new Draggable([sensor], { elements: () => [dragEl], group: "g" });
      const droppable = new Droppable(dropEl, { accept: () => accepts });
      const ctx = new DndContext();
      ctx.on("enter", () => events5.push("enter"));
      ctx.addDraggables([draggable]);
      ctx.addDroppables([droppable]);
      await startDrag(dragEl);
      assert.equal(events5.length, 0);
      accepts = true;
      ctx.clearTargets(draggable);
      ctx.detectCollisions(draggable);
      await waitNextFrame();
      assert.deepEqual(events5, ["enter"]);
      ctx.destroy();
      draggable.destroy();
      droppable.destroy();
      sensor.destroy();
      dragEl.remove();
      dropEl.remove();
    });
    it("should tolerate removing a droppable during enter emission", async () => {
      const events5 = [];
      const dragEl = createTestElement({ left: "0px", top: "0px", width: "40px", height: "40px" });
      const dropEl = createTestElement({ left: "0px", top: "0px", width: "40px", height: "40px" });
      const sensor = new KeyboardSensor(dragEl, { moveDistance: 10 });
      const draggable = new Draggable([sensor], { elements: () => [dragEl], group: "g" });
      const droppable = new Droppable(dropEl, { accept: ["g"] });
      const ctx = new DndContext();
      let shouldRemove = false;
      ctx.on("enter", () => {
        events5.push("enter");
        shouldRemove = true;
      });
      ctx.on("end", () => {
        events5.push("end");
      });
      ctx.addDraggables([draggable]);
      ctx.addDroppables([droppable]);
      await startDrag(dragEl);
      if (shouldRemove) ctx.removeDroppables([droppable]);
      await waitNextFrame();
      await endDrag();
      assert.deepEqual(events5, ["enter", "end"]);
      assert.isFalse(ctx.droppables.has(droppable.id));
      ctx.destroy();
      draggable.destroy();
      droppable.destroy();
      sensor.destroy();
      dragEl.remove();
      dropEl.remove();
    });
    it("should expose mutable drag data via getDragData during lifecycle", async () => {
      const seen = [];
      const dragEl = createTestElement({ left: "0px", top: "0px", width: "40px", height: "40px" });
      const dropEl = createTestElement({ left: "60px", top: "0px", width: "40px", height: "40px" });
      const sensor = new KeyboardSensor(dragEl, { moveDistance: 10 });
      const draggable = new Draggable([sensor], { elements: () => [dragEl], group: "g" });
      const droppable = new Droppable(dropEl, { accept: ["g"] });
      const ctx = new DndContext();
      ctx.on("start", () => {
        const data = ctx.drags.get(draggable);
        data.data.counter = 1;
        seen.push({ phase: "start", value: data.data.counter });
      });
      ctx.on("move", () => {
        const data = ctx.drags.get(draggable);
        data.data.counter += 1;
        seen.push({ phase: "move", value: data.data.counter });
      });
      ctx.on("end", () => {
        const data = ctx.drags.get(draggable);
        assert.isNotNull(data);
        seen.push({ phase: "end", value: data.data.counter });
      });
      ctx.addDraggables([draggable]);
      ctx.addDroppables([droppable]);
      await startDrag(dragEl);
      await move("Right");
      await endDrag();
      assert.deepEqual(
        seen.map((s) => s.phase),
        ["start", "move", "end"]
      );
      assert.deepEqual(
        seen.map((s) => s.value),
        [1, 2, 2]
      );
      ctx.destroy();
      draggable.destroy();
      droppable.destroy();
      sensor.destroy();
      dragEl.remove();
      dropEl.remove();
    });
  });
}

// tests/src/dnd-context/collision-detection.ts
function collisionDetection() {
  describe("collision detection", () => {
    it("should detect collisions when draggable overlaps droppable", async () => {
      const collisionEvents = [];
      const dragElement = createTestElement({
        left: "0px",
        top: "0px",
        width: "50px",
        height: "50px"
      });
      const dropElement = createTestElement({
        left: "25px",
        top: "25px",
        width: "50px",
        height: "50px"
      });
      const keyboardSensor = new KeyboardSensor(dragElement, { moveDistance: 10 });
      const draggable = new Draggable([keyboardSensor], {
        elements: () => [dragElement],
        group: "test"
      });
      const droppable = new Droppable(dropElement, {
        accept: ["test"]
      });
      const dndContext = new DndContext();
      dndContext.on("enter", (data) => {
        collisionEvents.push({
          type: "enter",
          collisions: data.collisions
        });
      });
      dndContext.addDraggables([draggable]);
      dndContext.addDroppables([droppable]);
      focusElement(dragElement);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      await waitNextFrame();
      assert.equal(collisionEvents.length, 1);
      assert.equal(collisionEvents[0].type, "enter");
      assert.equal(collisionEvents[0].collisions.length, 1);
      assert.equal(collisionEvents[0].collisions[0].droppableId, droppable.id);
      const collisionData = collisionEvents[0].collisions[0];
      assert.isDefined(collisionData);
      assert.equal(collisionData.droppableId, droppable.id);
      assert.isNumber(collisionData.intersectionScore);
      assert.isTrue(collisionData.intersectionScore > 0);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      dndContext.destroy();
      draggable.destroy();
      droppable.destroy();
      keyboardSensor.destroy();
      dragElement.remove();
      dropElement.remove();
    });
    it("should not detect collisions when draggable does not overlap droppable", async () => {
      const collisionEvents = [];
      const dragElement = createTestElement({
        left: "0px",
        top: "0px",
        width: "50px",
        height: "50px"
      });
      const dropElement = createTestElement({
        left: "100px",
        top: "100px",
        width: "50px",
        height: "50px"
      });
      const keyboardSensor = new KeyboardSensor(dragElement, { moveDistance: 10 });
      const draggable = new Draggable([keyboardSensor], {
        elements: () => [dragElement],
        group: "test"
      });
      const droppable = new Droppable(dropElement, {
        accept: ["test"]
      });
      const dndContext = new DndContext();
      dndContext.on("enter", (data) => {
        collisionEvents.push({
          type: "enter",
          collisions: data.collisions
        });
      });
      dndContext.addDraggables([draggable]);
      dndContext.addDroppables([droppable]);
      focusElement(dragElement);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      await waitNextFrame();
      assert.equal(collisionEvents.length, 0);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      dndContext.destroy();
      draggable.destroy();
      droppable.destroy();
      keyboardSensor.destroy();
      dragElement.remove();
      dropElement.remove();
    });
    it("should update collisions when draggable moves", async () => {
      const collisionEvents = [];
      const dragElement = createTestElement({
        left: "0px",
        top: "0px",
        width: "50px",
        height: "50px"
      });
      const dropElement = createTestElement({
        left: "60px",
        top: "0px",
        width: "50px",
        height: "50px"
      });
      const keyboardSensor = new KeyboardSensor(dragElement, { moveDistance: 70 });
      const draggable = new Draggable([keyboardSensor], {
        elements: () => [dragElement],
        group: "test"
      });
      const droppable = new Droppable(dropElement, {
        accept: ["test"]
      });
      const dndContext = new DndContext();
      dndContext.on("enter", (data) => {
        collisionEvents.push({ type: "enter", collisions: data.collisions.length });
      });
      dndContext.on("leave", (data) => {
        collisionEvents.push({ type: "leave", collisions: data.collisions.length });
      });
      dndContext.addDraggables([draggable]);
      dndContext.addDroppables([droppable]);
      focusElement(dragElement);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      await waitNextFrame();
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
      await waitNextFrame();
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
      await waitNextFrame();
      assert.equal(collisionEvents.length, 2);
      assert.equal(collisionEvents[0].type, "enter");
      assert.equal(collisionEvents[0].collisions, 1);
      assert.equal(collisionEvents[1].type, "leave");
      assert.equal(collisionEvents[1].collisions, 0);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      dndContext.destroy();
      draggable.destroy();
      droppable.destroy();
      keyboardSensor.destroy();
      dragElement.remove();
      dropElement.remove();
    });
    it("should handle multiple droppables correctly", async () => {
      const collisionEvents = [];
      const dragElement = createTestElement({
        left: "0px",
        top: "0px",
        width: "50px",
        height: "50px"
      });
      const dropElement1 = createTestElement({
        left: "0px",
        top: "0px",
        width: "50px",
        height: "50px"
      });
      const dropElement2 = createTestElement({
        left: "60px",
        top: "0px",
        width: "50px",
        height: "50px"
      });
      const keyboardSensor = new KeyboardSensor(dragElement, { moveDistance: 60 });
      const draggable = new Draggable([keyboardSensor], {
        elements: () => [dragElement],
        group: "test"
      });
      const droppable1 = new Droppable(dropElement1, {
        accept: ["test"]
      });
      const droppable2 = new Droppable(dropElement2, {
        accept: ["test"]
      });
      const dndContext = new DndContext();
      dndContext.on("enter", (data) => {
        collisionEvents.push({
          type: "enter",
          collisions: [...data.collisions]
        });
      });
      dndContext.on("leave", (data) => {
        collisionEvents.push({
          type: "leave",
          collisions: [...data.collisions]
        });
      });
      dndContext.addDraggables([draggable]);
      dndContext.addDroppables([droppable1, droppable2]);
      focusElement(dragElement);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      await waitNextFrame();
      assert.equal(collisionEvents.length, 1);
      assert.equal(collisionEvents[0].type, "enter");
      assert.equal(collisionEvents[0].collisions.length, 1);
      assert.isTrue(
        collisionEvents[0].collisions.some((c) => c.droppableId === droppable1.id)
      );
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
      await waitNextFrame();
      assert.isTrue(collisionEvents.length >= 2);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      dndContext.destroy();
      draggable.destroy();
      droppable1.destroy();
      droppable2.destroy();
      keyboardSensor.destroy();
      dragElement.remove();
      dropElement1.remove();
      dropElement2.remove();
    });
    it("should respect droppable accept criteria", async () => {
      const collisionEvents = [];
      const dragElement = createTestElement({
        left: "0px",
        top: "0px",
        width: "50px",
        height: "50px"
      });
      const dropElement = createTestElement({
        left: "0px",
        top: "0px",
        width: "50px",
        height: "50px"
      });
      const keyboardSensor = new KeyboardSensor(dragElement, { moveDistance: 10 });
      const draggable = new Draggable([keyboardSensor], {
        elements: () => [dragElement],
        group: "test"
      });
      const droppable = new Droppable(dropElement, {
        accept: ["other-group"]
      });
      const dndContext = new DndContext();
      dndContext.on("enter", () => {
        collisionEvents.push({ type: "enter" });
      });
      dndContext.addDraggables([draggable]);
      dndContext.addDroppables([droppable]);
      focusElement(dragElement);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      await waitNextFrame();
      assert.equal(collisionEvents.length, 0);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      dndContext.destroy();
      draggable.destroy();
      droppable.destroy();
      keyboardSensor.destroy();
      dragElement.remove();
      dropElement.remove();
    });
    it("should work with extended collision data", async () => {
      const customCollisionEvents = [];
      let customDetectorCalled = false;
      const dragElement = createTestElement({
        left: "0px",
        top: "0px",
        width: "50px",
        height: "50px"
      });
      const dropElement = createTestElement({
        left: "0px",
        top: "0px",
        width: "50px",
        height: "50px"
      });
      const keyboardSensor = new KeyboardSensor(dragElement, { moveDistance: 10 });
      const draggable = new Draggable([keyboardSensor], {
        elements: () => [dragElement],
        group: "test"
      });
      const droppable = new Droppable(dropElement, {
        accept: ["test"]
      });
      class TestDetector extends CollisionDetector {
        _createCollisionData() {
          const base = super._createCollisionData();
          base.customProp = "";
          return base;
        }
        _checkCollision(draggable2, droppable2, data) {
          customDetectorCalled = true;
          const result = super._checkCollision(draggable2, droppable2, data);
          if (!result) return null;
          result.customProp = "test-value";
          return result;
        }
      }
      const dndContext = new DndContext({
        collisionDetector: (ctx) => new TestDetector(ctx)
      });
      dndContext.on("enter", (data) => {
        const collision = data.collisions[0];
        customCollisionEvents.push({
          type: "enter",
          customProp: collision?.customProp
        });
      });
      dndContext.addDraggables([draggable]);
      dndContext.addDroppables([droppable]);
      focusElement(dragElement);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      await waitNextFrame();
      assert.isTrue(customDetectorCalled);
      assert.equal(customCollisionEvents.length, 1);
      assert.equal(customCollisionEvents[0].customProp, "test-value");
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      dndContext.destroy();
      draggable.destroy();
      droppable.destroy();
      keyboardSensor.destroy();
      dragElement.remove();
      dropElement.remove();
    });
    it("should update droppable client rects on scroll", async () => {
      const dragElement = createTestElement({
        left: "0px",
        top: "0px",
        width: "50px",
        height: "50px"
      });
      const dropElement = createTestElement({
        left: "0px",
        top: "0px",
        width: "50px",
        height: "50px"
      });
      const keyboardSensor = new KeyboardSensor(dragElement, { moveDistance: 10 });
      const draggable = new Draggable([keyboardSensor], {
        elements: () => [dragElement],
        group: "test"
      });
      const droppable = new Droppable(dropElement, {
        accept: ["test"]
      });
      const dndContext = new DndContext();
      dndContext.addDraggables([draggable]);
      dndContext.addDroppables([droppable]);
      const initialRect = droppable.getClientRect();
      focusElement(dragElement);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      await waitNextFrame();
      window.dispatchEvent(new Event("scroll"));
      await waitNextFrame();
      await new Promise((resolve) => setTimeout(resolve, 50));
      const updatedRect = droppable.getClientRect();
      assert.isObject(updatedRect);
      assert.equal(updatedRect.x, initialRect.x);
      assert.equal(updatedRect.y, initialRect.y);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      await waitNextFrame();
      dndContext.destroy();
      draggable.destroy();
      droppable.destroy();
      keyboardSensor.destroy();
      dragElement.remove();
      dropElement.remove();
    });
    it("should handle collision data correctly", async () => {
      let collisionData = null;
      const dragElement = createTestElement({
        left: "0px",
        top: "0px",
        width: "50px",
        height: "50px"
      });
      const dropElement = createTestElement({
        left: "0px",
        top: "0px",
        width: "50px",
        height: "50px"
      });
      const keyboardSensor = new KeyboardSensor(dragElement, { moveDistance: 10 });
      const draggable = new Draggable([keyboardSensor], {
        elements: () => [dragElement],
        group: "test"
      });
      const droppable = new Droppable(dropElement, {
        accept: ["test"]
      });
      const dndContext = new DndContext();
      dndContext.on("enter", (data) => {
        collisionData = data.collisions.find((c) => c.droppableId === droppable.id) || null;
      });
      dndContext.addDraggables([draggable]);
      dndContext.addDroppables([droppable]);
      focusElement(dragElement);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      await waitNextFrame();
      await new Promise((resolve) => setTimeout(resolve, 50));
      assert.isObject(collisionData);
      assert.equal(collisionData.droppableId, droppable.id);
      assert.isNumber(collisionData.droppableRect.x);
      assert.isNumber(collisionData.droppableRect.y);
      assert.isNumber(collisionData.droppableRect.width);
      assert.isNumber(collisionData.droppableRect.height);
      assert.isNumber(collisionData.intersectionScore);
      assert.isTrue(collisionData.intersectionScore > 0);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      await waitNextFrame();
      dndContext.destroy();
      draggable.destroy();
      droppable.destroy();
      keyboardSensor.destroy();
      dragElement.remove();
      dropElement.remove();
    });
  });
}

// tests/src/dnd-context/advanced-collision-detection.ts
function advancedCollisionDetection() {
  describe("advanced collision detection", () => {
    it("should compute collisions based on visible rects (clipped)", async () => {
      const collisionEvents = [];
      const container = createTestElement({
        left: "0px",
        top: "0px",
        width: "100px",
        height: "100px",
        overflow: "hidden"
      });
      const drag = createTestElement({ left: "80px", top: "80px", width: "50px", height: "50px" });
      container.appendChild(drag);
      const drop = createTestElement({ left: "60px", top: "60px", width: "50px", height: "50px" });
      container.appendChild(drop);
      const keyboard = new KeyboardSensor(drag, { moveDistance: 10 });
      const draggable = new Draggable([keyboard], { elements: () => [drag], group: "g" });
      const droppable = new Droppable(drop, { accept: ["g"] });
      const dnd = new DndContext({
        collisionDetector: (ctx) => new AdvancedCollisionDetector(ctx)
      });
      dnd.on("enter", (data) => {
        collisionEvents.push({ type: "enter", collisions: data.collisions });
      });
      dnd.addDraggables([draggable]);
      dnd.addDroppables([droppable]);
      focusElement(drag);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      await waitNextFrame();
      assert.equal(collisionEvents.length, 1);
      assert.equal(collisionEvents[0].collisions.length, 1);
      const cd = collisionEvents[0].collisions[0];
      assert.isAbove(cd.intersectionScore, 0);
      assert.isAtLeast(cd.draggableVisibleRect.width, 1);
      assert.isAtLeast(cd.droppableVisibleRect.width, 1);
      dnd.destroy();
      draggable.destroy();
      droppable.destroy();
      keyboard.destroy();
      container.remove();
    });
    it("should update cache on scroll and resize", async () => {
      const container = createTestElement({
        left: "0px",
        top: "0px",
        width: "100px",
        height: "100px",
        overflow: "hidden"
      });
      const drag = createTestElement({ left: "0px", top: "0px", width: "50px", height: "50px" });
      container.appendChild(drag);
      const drop = createTestElement({ left: "60px", top: "0px", width: "50px", height: "50px" });
      container.appendChild(drop);
      const keyboard = new KeyboardSensor(drag, { moveDistance: 10 });
      const draggable = new Draggable([keyboard], { elements: () => [drag], group: "g" });
      const droppable = new Droppable(drop, { accept: ["g"] });
      const dnd = new DndContext({
        collisionDetector: (ctx) => new AdvancedCollisionDetector(ctx)
      });
      dnd.addDraggables([draggable]);
      dnd.addDroppables([droppable]);
      focusElement(drag);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      await waitNextFrame();
      window.dispatchEvent(new Event("scroll"));
      window.dispatchEvent(new Event("resize"));
      await new Promise((r) => setTimeout(r, 50));
      dnd.destroy();
      draggable.destroy();
      droppable.destroy();
      keyboard.destroy();
      container.remove();
    });
    it("should sort ties by smaller droppable visible area first", async () => {
      const container = createTestElement({
        left: "0px",
        top: "0px",
        width: "100px",
        height: "100px",
        overflow: "hidden"
      });
      const drag = createTestElement({ left: "0px", top: "0px", width: "200px", height: "200px" });
      container.appendChild(drag);
      const dropA = createTestElement({ left: "0px", top: "0px", width: "80px", height: "80px" });
      container.appendChild(dropA);
      const dropB = createTestElement({ left: "60px", top: "0px", width: "80px", height: "80px" });
      container.appendChild(dropB);
      const keyboard = new KeyboardSensor(drag, { moveDistance: 10 });
      const draggable = new Draggable([keyboard], { elements: () => [drag], group: "g" });
      const droppableA = new Droppable(dropA, { accept: ["g"] });
      const droppableB = new Droppable(dropB, { accept: ["g"] });
      const dnd = new DndContext({
        collisionDetector: (ctx) => new AdvancedCollisionDetector(ctx)
      });
      let firstCollisionId = null;
      dnd.on("enter", (data) => {
        firstCollisionId = data.collisions[0]?.droppableId;
      });
      dnd.addDraggables([draggable]);
      dnd.addDroppables([droppableA, droppableB]);
      focusElement(drag);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      await waitNextFrame();
      assert.equal(firstCollisionId, droppableB.id);
      dnd.destroy();
      draggable.destroy();
      droppableA.destroy();
      droppableB.destroy();
      keyboard.destroy();
      container.remove();
    });
    it("should not collide when droppable is fully clipped", async () => {
      const collisionEvents = [];
      const container = createTestElement({
        left: "0px",
        top: "0px",
        width: "100px",
        height: "100px",
        overflow: "hidden"
      });
      const drag = createTestElement({ left: "0px", top: "0px", width: "80px", height: "80px" });
      container.appendChild(drag);
      const drop = createTestElement({ left: "150px", top: "0px", width: "50px", height: "50px" });
      container.appendChild(drop);
      const keyboard = new KeyboardSensor(drag, { moveDistance: 10 });
      const draggable = new Draggable([keyboard], { elements: () => [drag], group: "g" });
      const droppable = new Droppable(drop, { accept: ["g"] });
      const dnd = new DndContext({
        collisionDetector: (ctx) => new AdvancedCollisionDetector(ctx)
      });
      dnd.on("enter", (data) => {
        collisionEvents.push({ collisions: data.collisions });
      });
      dnd.addDraggables([draggable]);
      dnd.addDroppables([droppable]);
      focusElement(drag);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      await waitNextFrame();
      assert.equal(collisionEvents.length, 0);
      dnd.destroy();
      draggable.destroy();
      droppable.destroy();
      keyboard.destroy();
      container.remove();
    });
  });
}

// tests/src/dnd-context/droppables.ts
function droppables() {
  describe("droppables", () => {
    it("should accept draggables based on group string array", async () => {
      const events5 = [];
      const dragElement = createTestElement({
        left: "0px",
        top: "0px",
        width: "50px",
        height: "50px"
      });
      const dropElement = createTestElement({
        left: "60px",
        top: "0px",
        width: "50px",
        height: "50px"
      });
      const keyboardSensor = new KeyboardSensor(dragElement, { moveDistance: 70 });
      const draggable = new Draggable([keyboardSensor], {
        elements: () => [dragElement],
        group: "valid-group"
      });
      const droppable = new Droppable(dropElement, {
        accept: ["valid-group", "another-group"]
      });
      const dndContext = new DndContext();
      dndContext.on("enter", (data) => {
        events5.push({ type: "enter", targets: data.targets.size });
      });
      dndContext.addDraggables([draggable]);
      dndContext.addDroppables([droppable]);
      await startDrag(dragElement);
      await move("Right");
      await waitNextFrame();
      assert.equal(events5.length, 1);
      assert.equal(events5[0].type, "enter");
      assert.equal(events5[0].targets, 1);
      await endDrag();
      dndContext.destroy();
      draggable.destroy();
      droppable.destroy();
      keyboardSensor.destroy();
      dragElement.remove();
      dropElement.remove();
    });
    it("should reject draggables not in accept group array", async () => {
      const events5 = [];
      const dragElement = createTestElement({
        left: "0px",
        top: "0px",
        width: "50px",
        height: "50px"
      });
      const dropElement = createTestElement({
        left: "25px",
        top: "0px",
        width: "50px",
        height: "50px"
      });
      const keyboardSensor = new KeyboardSensor(dragElement, { moveDistance: 10 });
      const draggable = new Draggable([keyboardSensor], {
        elements: () => [dragElement],
        group: "invalid-group"
      });
      const droppable = new Droppable(dropElement, {
        accept: ["valid-group", "another-group"]
      });
      const dndContext = new DndContext();
      dndContext.on("enter", () => {
        events5.push({ type: "enter" });
      });
      dndContext.addDraggables([draggable]);
      dndContext.addDroppables([droppable]);
      await startDrag(dragElement);
      assert.equal(events5.length, 0);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      dndContext.destroy();
      draggable.destroy();
      droppable.destroy();
      keyboardSensor.destroy();
      dragElement.remove();
      dropElement.remove();
    });
    it("should accept draggables based on function predicate", async () => {
      const events5 = [];
      const dragElement = createTestElement({
        left: "0px",
        top: "0px",
        width: "50px",
        height: "50px"
      });
      const dropElement = createTestElement({
        left: "60px",
        top: "0px",
        width: "50px",
        height: "50px"
      });
      const keyboardSensor = new KeyboardSensor(dragElement, { moveDistance: 70 });
      const draggable = new Draggable([keyboardSensor], {
        elements: () => [dragElement],
        group: "test-group"
      });
      const droppable = new Droppable(dropElement, {
        accept: (draggable2) => {
          return draggable2.settings.group === "test-group";
        }
      });
      const dndContext = new DndContext();
      dndContext.on("enter", (data) => {
        events5.push({ type: "enter", targets: data.targets.size });
      });
      dndContext.addDraggables([draggable]);
      dndContext.addDroppables([droppable]);
      focusElement(dragElement);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      await waitNextFrame();
      await move("Right");
      await waitNextFrame();
      assert.equal(events5.length, 1);
      assert.equal(events5[0].type, "enter");
      assert.equal(events5[0].targets, 1);
      await endDrag();
      dndContext.destroy();
      draggable.destroy();
      droppable.destroy();
      keyboardSensor.destroy();
      dragElement.remove();
      dropElement.remove();
    });
    it("should reject draggables when function predicate returns false", async () => {
      const events5 = [];
      const dragElement = createTestElement({
        left: "0px",
        top: "0px",
        width: "50px",
        height: "50px"
      });
      const dropElement = createTestElement({
        left: "25px",
        top: "0px",
        width: "50px",
        height: "50px"
      });
      const keyboardSensor = new KeyboardSensor(dragElement, { moveDistance: 10 });
      const draggable = new Draggable([keyboardSensor], {
        elements: () => [dragElement],
        group: "test-group"
      });
      const droppable = new Droppable(dropElement, {
        accept: (draggable2) => {
          return draggable2.settings.group === "different-group";
        }
      });
      const dndContext = new DndContext();
      dndContext.on("enter", () => {
        events5.push({ type: "enter" });
      });
      dndContext.addDraggables([draggable]);
      dndContext.addDroppables([droppable]);
      await startDrag(dragElement);
      assert.equal(events5.length, 0);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      dndContext.destroy();
      draggable.destroy();
      droppable.destroy();
      keyboardSensor.destroy();
      dragElement.remove();
      dropElement.remove();
    });
    it("should not accept draggable when its element matches droppable element", async () => {
      const events5 = [];
      const element = createTestElement({
        left: "0px",
        top: "0px",
        width: "50px",
        height: "50px"
      });
      const keyboardSensor = new KeyboardSensor(element, { moveDistance: 10 });
      const draggable = new Draggable([keyboardSensor], {
        elements: () => [element],
        group: "test"
      });
      const droppable = new Droppable(element, {
        accept: ["test"]
      });
      const dndContext = new DndContext();
      dndContext.on("enter", () => {
        events5.push({ type: "enter" });
      });
      dndContext.addDraggables([draggable]);
      dndContext.addDroppables([droppable]);
      await startDrag(element);
      assert.equal(events5.length, 0);
      await endDrag();
      dndContext.destroy();
      draggable.destroy();
      droppable.destroy();
      keyboardSensor.destroy();
      element.remove();
    });
    it("should handle droppable data correctly", () => {
      const element = createTestElement();
      const droppable = new Droppable(element, {
        accept: ["test"],
        data: { custom: "value", id: 123 }
      });
      const dndContext = new DndContext();
      dndContext.addDroppables([droppable]);
      assert.deepEqual(droppable.data, { custom: "value", id: 123 });
      droppable.data.newProp = "added";
      assert.equal(droppable.data.newProp, "added");
      dndContext.destroy();
      droppable.destroy();
      element.remove();
    });
    it("should update client rect correctly", () => {
      const element = createTestElement({
        left: "50px",
        top: "75px",
        width: "100px",
        height: "150px"
      });
      const droppable = new Droppable(element, {
        accept: ["test"]
      });
      const dndContext = new DndContext();
      dndContext.addDroppables([droppable]);
      const rect = droppable.getClientRect();
      assert.equal(rect.x, 50);
      assert.equal(rect.y, 75);
      assert.equal(rect.width, 100);
      assert.equal(rect.height, 150);
      element.style.left = "100px";
      element.style.top = "200px";
      droppable.updateClientRect();
      const updatedRect = droppable.getClientRect();
      assert.equal(updatedRect.x, 100);
      assert.equal(updatedRect.y, 200);
      assert.equal(updatedRect.width, 100);
      assert.equal(updatedRect.height, 150);
      dndContext.destroy();
      droppable.destroy();
      element.remove();
    });
    it("should handle droppable removal during drag", async () => {
      const events5 = [];
      const dragElement = createTestElement({
        left: "0px",
        top: "0px",
        width: "50px",
        height: "50px"
      });
      const dropElement = createTestElement({
        left: "60px",
        top: "0px",
        width: "50px",
        height: "50px"
      });
      const keyboardSensor = new KeyboardSensor(dragElement, { moveDistance: 70 });
      const draggable = new Draggable([keyboardSensor], {
        elements: () => [dragElement],
        group: "test"
      });
      const droppable = new Droppable(dropElement, {
        accept: ["test"]
      });
      const dndContext = new DndContext();
      dndContext.on("enter", (data) => {
        events5.push({ type: "enter", collisions: data.collisions.length });
      });
      dndContext.on("leave", (data) => {
        events5.push({
          type: "leave",
          collisions: data.collisions.length,
          removedContacts: data.removedContacts.size
        });
      });
      dndContext.addDraggables([draggable]);
      dndContext.addDroppables([droppable]);
      await startDrag(dragElement);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
      await waitNextFrame();
      await waitNextFrame();
      assert.equal(events5.length, 1);
      assert.equal(events5[0].type, "enter");
      assert.equal(events5[0].collisions, 1);
      dndContext.removeDroppables([droppable]);
      await waitNextFrame();
      assert.equal(events5.length, 2);
      assert.equal(events5[1].type, "leave");
      assert.equal(events5[1].collisions, 0);
      assert.equal(events5[1].removedContacts, 1);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      dndContext.destroy();
      draggable.destroy();
      droppable.destroy();
      keyboardSensor.destroy();
      dragElement.remove();
      dropElement.remove();
    });
    it("should handle droppable destruction properly", () => {
      const destroyEvents = [];
      const element = createTestElement();
      const droppable = new Droppable(element, {
        accept: ["test"]
      });
      const dndContext = new DndContext();
      dndContext.on("removeDroppables", (data) => {
        const removed = Array.from(data.droppables);
        destroyEvents.push({ type: "removeDroppable", droppable: removed[0] });
      });
      dndContext.addDroppables([droppable]);
      droppable.destroy();
      assert.equal(destroyEvents.length, 1);
      assert.equal(destroyEvents[0].type, "removeDroppable");
      assert.equal(destroyEvents[0].droppable, droppable);
      assert.isFalse(dndContext.droppables.has(droppable.id));
      dndContext.destroy();
      element.remove();
    });
    it("should handle collide events each cycle with persistedContacts", async () => {
      const events5 = [];
      const dragElement = createTestElement({
        left: "0px",
        top: "0px",
        width: "50px",
        height: "50px"
      });
      const dropElement = createTestElement({
        left: "60px",
        top: "0px",
        width: "50px",
        height: "50px"
      });
      const keyboardSensor = new KeyboardSensor(dragElement, { moveDistance: 10 });
      const draggable = new Draggable([keyboardSensor], {
        elements: () => [dragElement],
        group: "test"
      });
      const droppable = new Droppable(dropElement, {
        accept: ["test"]
      });
      const dndContext = new DndContext();
      dndContext.on("enter", () => {
        events5.push({ type: "enter" });
      });
      dndContext.on("collide", (data) => {
        events5.push({
          type: "collide",
          persistedContacts: data.persistedContacts.size
        });
      });
      dndContext.addDraggables([draggable]);
      dndContext.addDroppables([droppable]);
      focusElement(dragElement);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      await waitNextFrame();
      await move("Right", 7);
      await move("Right");
      await waitNextFrame();
      assert.isTrue(events5.length >= 2);
      assert.equal(events5[0].type, "enter");
      const collideEvents = events5.slice(1).filter((e) => e.type === "collide");
      assert.isAtLeast(collideEvents.length, 1);
      assert.isTrue(collideEvents.some((e) => e.persistedContacts >= 1));
      await endDrag();
      dndContext.destroy();
      draggable.destroy();
      droppable.destroy();
      keyboardSensor.destroy();
      dragElement.remove();
      dropElement.remove();
    });
  });
}

// tests/src/dnd-context/methods.ts
function methods5() {
  describe("public methods", () => {
    it("on/off should add and remove listeners by id", async () => {
      const calls = [];
      const dragElement = createTestElement();
      const dropElement = createTestElement({
        left: "0px",
        top: "0px",
        width: "40px",
        height: "40px"
      });
      const sensor = new KeyboardSensor(dragElement, { moveDistance: 10 });
      const draggable = new Draggable([sensor], { elements: () => [dragElement], group: "g" });
      const droppable = new Droppable(dropElement, { accept: ["g"] });
      const ctx = new DndContext();
      ctx.addDraggables([draggable]);
      ctx.addDroppables([droppable]);
      const id1 = ctx.on("start", () => calls.push("a"));
      ctx.on("start", () => calls.push("b"));
      ctx.off("start", id1);
      await startDrag(dragElement);
      assert.deepEqual(calls, ["b"]);
      ctx.destroy();
      draggable.destroy();
      droppable.destroy();
      sensor.destroy();
      dragElement.remove();
      dropElement.remove();
    });
    it("detectCollisions(draggable) should queue collisions for a single drag", async () => {
      const events5 = [];
      const dragElement = createTestElement({
        left: "0px",
        top: "0px",
        width: "40px",
        height: "40px"
      });
      const dropElement = createTestElement({
        left: "0px",
        top: "0px",
        width: "40px",
        height: "40px"
      });
      const sensor = new KeyboardSensor(dragElement, { moveDistance: 1 });
      const draggable = new Draggable([sensor], { elements: () => [dragElement], group: "g" });
      const droppable = new Droppable(dropElement, { accept: ["g"] });
      const ctx = new DndContext();
      ctx.on("collide", () => events5.push("collide"));
      ctx.addDraggables([draggable]);
      ctx.addDroppables([droppable]);
      focusElement(dragElement);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      await waitNextFrame();
      events5.length = 0;
      ctx.detectCollisions(draggable);
      await waitNextFrame();
      assert.isTrue(events5.includes("collide"));
      ctx.destroy();
      draggable.destroy();
      droppable.destroy();
      sensor.destroy();
      dragElement.remove();
      dropElement.remove();
    });
    it("detectCollisions() without args should queue for all active drags", async () => {
      const events5 = [];
      const dragEl1 = createTestElement({ left: "0px", top: "0px", width: "40px", height: "40px" });
      const dragEl2 = createTestElement({
        left: "0px",
        top: "50px",
        width: "40px",
        height: "40px"
      });
      const dropEl1 = createTestElement({ left: "0px", top: "0px", width: "40px", height: "40px" });
      const dropEl2 = createTestElement({
        left: "0px",
        top: "50px",
        width: "40px",
        height: "40px"
      });
      const s1 = new KeyboardSensor(dragEl1, { moveDistance: 1 });
      const s2 = new KeyboardSensor(dragEl2, { moveDistance: 1 });
      const dr1 = new Draggable([s1], { elements: () => [dragEl1], group: "g" });
      const dr2 = new Draggable([s2], { elements: () => [dragEl2], group: "g" });
      const dp1 = new Droppable(dropEl1, { accept: ["g"] });
      const dp2 = new Droppable(dropEl2, { accept: ["g"] });
      const ctx = new DndContext();
      ctx.on("collide", ({ draggable }) => events5.push({ d: draggable }));
      ctx.addDraggables([dr1, dr2]);
      ctx.addDroppables([dp1, dp2]);
      focusElement(dragEl1);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      focusElement(dragEl2);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      await waitNextFrame();
      events5.length = 0;
      ctx.detectCollisions();
      await waitNextFrame();
      assert.isAtLeast(events5.length, 1);
      ctx.destroy();
      dr1.destroy();
      dr2.destroy();
      dp1.destroy();
      dp2.destroy();
      s1.destroy();
      s2.destroy();
      dragEl1.remove();
      dragEl2.remove();
      dropEl1.remove();
      dropEl2.remove();
    });
    it("updateDroppableClientRects should refresh cached rects", async () => {
      const el = createTestElement({ left: "0px", top: "0px", width: "50px", height: "50px" });
      const droppable = new Droppable(el, { accept: ["x"] });
      const ctx = new DndContext();
      ctx.addDroppables([droppable]);
      const before = droppable.getClientRect();
      el.style.left = "100px";
      el.style.top = "150px";
      await waitNextFrame();
      const expected = el.getBoundingClientRect();
      ctx.updateDroppableClientRects();
      const after = droppable.getClientRect();
      assert.equal(after.x, expected.x);
      assert.equal(after.y, expected.y);
      assert.equal(after.width, before.width);
      assert.equal(after.height, before.height);
      ctx.destroy();
      droppable.destroy();
      el.remove();
    });
  });
  describe("protected methods", () => {
    it("_isMatch should return false when dragged element equals droppable.element", async () => {
      const el = createTestElement({ left: "0px", top: "0px", width: "40px", height: "40px" });
      const sensor = new KeyboardSensor(el, { moveDistance: 10 });
      const draggable = new Draggable([sensor], { elements: () => [el], group: "g" });
      const droppable = new Droppable(el, { accept: ["g"] });
      const ctx = new DndContext();
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      await waitNextFrame();
      assert.isFalse(ctx["_isMatch"](draggable, droppable));
      ctx.destroy();
      draggable.destroy();
      droppable.destroy();
      sensor.destroy();
      el.remove();
    });
    it("_isMatch should respect droppable.accept function", async () => {
      const dragEl = createTestElement();
      const dropEl = createTestElement();
      const sensor = new KeyboardSensor(dragEl, { moveDistance: 10 });
      const draggable = new Draggable([sensor], { elements: () => [dragEl], group: "g" });
      const droppable = new Droppable(dropEl, { accept: () => false });
      const ctx = new DndContext();
      assert.isFalse(ctx["_isMatch"](draggable, droppable));
      droppable.accept = () => true;
      assert.isTrue(ctx["_isMatch"](draggable, droppable));
      ctx.destroy();
      draggable.destroy();
      droppable.destroy();
      sensor.destroy();
      dragEl.remove();
      dropEl.remove();
    });
  });
}

// tests/src/dnd-context/index.ts
describe("DndContext", () => {
  events4();
  collisionDetection();
  advancedCollisionDetection();
  droppables();
  methods5();
});
/*! Bundled license information:

chai/chai.js:
  (*!
   * Chai - flag utility
   * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   *)
  (*!
   * Chai - test utility
   * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   *)
  (*!
   * Chai - expectTypes utility
   * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   *)
  (*!
   * Chai - getActual utility
   * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   *)
  (*!
   * Chai - message composition utility
   * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   *)
  (*!
   * Chai - transferFlags utility
   * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   *)
  (*!
   * chai
   * http://chaijs.com
   * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   *)
  (*!
   * Chai - isProxyEnabled helper
   * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   *)
  (*!
   * Chai - addProperty utility
   * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   *)
  (*!
   * Chai - addLengthGuard utility
   * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   *)
  (*!
   * Chai - getProperties utility
   * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   *)
  (*!
   * Chai - proxify utility
   * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   *)
  (*!
   * Chai - addMethod utility
   * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   *)
  (*!
   * Chai - overwriteProperty utility
   * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   *)
  (*!
   * Chai - overwriteMethod utility
   * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   *)
  (*!
   * Chai - addChainingMethod utility
   * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   *)
  (*!
   * Chai - overwriteChainableMethod utility
   * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   *)
  (*!
   * Chai - compareByInspect utility
   * Copyright(c) 2011-2016 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   *)
  (*!
   * Chai - getOwnEnumerablePropertySymbols utility
   * Copyright(c) 2011-2016 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   *)
  (*!
   * Chai - getOwnEnumerableProperties utility
   * Copyright(c) 2011-2016 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   *)
  (*!
   * Chai - isNaN utility
   * Copyright(c) 2012-2015 Sakthipriyan Vairamani <thechargingvolcano@gmail.com>
   * MIT Licensed
   *)
  (*!
   * chai
   * Copyright(c) 2011 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   *)
  (*!
   * chai
   * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   *)
  (*! Bundled license information:
  
  deep-eql/index.js:
    (*!
     * deep-eql
     * Copyright(c) 2013 Jake Luer <jake@alogicalparadox.com>
     * MIT Licensed
     *)
    (*!
     * Check to see if the MemoizeMap has recorded a result of the two operands
     *
     * @param {Mixed} leftHandOperand
     * @param {Mixed} rightHandOperand
     * @param {MemoizeMap} memoizeMap
     * @returns {Boolean|null} result
    *)
    (*!
     * Set the result of the equality into the MemoizeMap
     *
     * @param {Mixed} leftHandOperand
     * @param {Mixed} rightHandOperand
     * @param {MemoizeMap} memoizeMap
     * @param {Boolean} result
    *)
    (*!
     * Primary Export
     *)
    (*!
     * The main logic of the `deepEqual` function.
     *
     * @param {Mixed} leftHandOperand
     * @param {Mixed} rightHandOperand
     * @param {Object} [options] (optional) Additional options
     * @param {Array} [options.comparator] (optional) Override default algorithm, determining custom equality.
     * @param {Array} [options.memoize] (optional) Provide a custom memoization object which will cache the results of
        complex objects for a speed boost. By passing `false` you can disable memoization, but this will cause circular
        references to blow the stack.
     * @return {Boolean} equal match
    *)
    (*!
     * Compare two Regular Expressions for equality.
     *
     * @param {RegExp} leftHandOperand
     * @param {RegExp} rightHandOperand
     * @return {Boolean} result
     *)
    (*!
     * Compare two Sets/Maps for equality. Faster than other equality functions.
     *
     * @param {Set} leftHandOperand
     * @param {Set} rightHandOperand
     * @param {Object} [options] (Optional)
     * @return {Boolean} result
     *)
    (*!
     * Simple equality for flat iterable objects such as Arrays, TypedArrays or Node.js buffers.
     *
     * @param {Iterable} leftHandOperand
     * @param {Iterable} rightHandOperand
     * @param {Object} [options] (Optional)
     * @return {Boolean} result
     *)
    (*!
     * Simple equality for generator objects such as those returned by generator functions.
     *
     * @param {Iterable} leftHandOperand
     * @param {Iterable} rightHandOperand
     * @param {Object} [options] (Optional)
     * @return {Boolean} result
     *)
    (*!
     * Determine if the given object has an @@iterator function.
     *
     * @param {Object} target
     * @return {Boolean} `true` if the object has an @@iterator function.
     *)
    (*!
     * Gets all iterator entries from the given Object. If the Object has no @@iterator function, returns an empty array.
     * This will consume the iterator - which could have side effects depending on the @@iterator implementation.
     *
     * @param {Object} target
     * @returns {Array} an array of entries from the @@iterator function
     *)
    (*!
     * Gets all entries from a Generator. This will consume the generator - which could have side effects.
     *
     * @param {Generator} target
     * @returns {Array} an array of entries from the Generator.
     *)
    (*!
     * Gets all own and inherited enumerable keys from a target.
     *
     * @param {Object} target
     * @returns {Array} an array of own and inherited enumerable keys from the target.
     *)
    (*!
     * Determines if two objects have matching values, given a set of keys. Defers to deepEqual for the equality check of
     * each key. If any value of the given key is not equal, the function will return false (early).
     *
     * @param {Mixed} leftHandOperand
     * @param {Mixed} rightHandOperand
     * @param {Array} keys An array of keys to compare the values of leftHandOperand and rightHandOperand against
     * @param {Object} [options] (Optional)
     * @return {Boolean} result
     *)
    (*!
     * Recursively check the equality of two Objects. Once basic sameness has been established it will defer to `deepEqual`
     * for each enumerable key in the object.
     *
     * @param {Mixed} leftHandOperand
     * @param {Mixed} rightHandOperand
     * @param {Object} [options] (Optional)
     * @return {Boolean} result
     *)
    (*!
     * Returns true if the argument is a primitive.
     *
     * This intentionally returns true for all objects that can be compared by reference,
     * including functions and symbols.
     *
     * @param {Mixed} value
     * @return {Boolean} result
     *)
  *)
*/
