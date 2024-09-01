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
  var flags = obj.__flags || (obj.__flags = /* @__PURE__ */ Object.create(null));
  if (arguments.length === 3) {
    flags[key] = value;
  } else {
    return flags[key];
  }
}
__name(flag, "flag");
function test(obj, args) {
  var negate = flag(obj, "negate"), expr = args[0];
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
  var flagMsg = flag(obj, "message");
  var ssfi = flag(obj, "ssfi");
  flagMsg = flagMsg ? flagMsg + ": " : "";
  obj = flag(obj, "object");
  types = types.map(function(t) {
    return t.toLowerCase();
  });
  types.sort();
  var str = types.map(function(t, index) {
    var art = ~["a", "e", "i", "o", "u"].indexOf(t.charAt(0)) ? "an" : "a";
    var or = types.length > 1 && index === types.length - 1 ? "or " : "";
    return or + art + " " + t;
  }).join(", ");
  var objType = type(obj).toLowerCase();
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
  const options = {
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
  if (options.colors) {
    options.stylize = colorise;
  }
  return options;
}
__name(normaliseOptions, "normaliseOptions");
function truncate(string, length, tail = truncator) {
  string = String(string);
  const tailLength = tail.length;
  const stringLength = string.length;
  if (tailLength > length && stringLength > tailLength) {
    return tail;
  }
  if (stringLength > length && stringLength > tailLength) {
    return `${string.slice(0, length - tailLength)}${tail}`;
  }
  return string;
}
__name(truncate, "truncate");
function inspectList(list, options, inspectItem, separator = ", ") {
  inspectItem = inspectItem || options.inspect;
  const size = list.length;
  if (size === 0)
    return "";
  const originalLength = options.truncate;
  let output = "";
  let peek = "";
  let truncated = "";
  for (let i = 0; i < size; i += 1) {
    const last = i + 1 === list.length;
    const secondToLast = i + 2 === list.length;
    truncated = `${truncator}(${list.length - i})`;
    const value = list[i];
    options.truncate = originalLength - output.length - (last ? 0 : separator.length);
    const string = peek || inspectItem(value, options) + (last ? "" : separator);
    const nextLength = output.length + string.length;
    const truncatedLength = nextLength + truncated.length;
    if (last && nextLength > originalLength && output.length + truncated.length <= originalLength) {
      break;
    }
    if (!last && !secondToLast && truncatedLength > originalLength) {
      break;
    }
    peek = last ? "" : inspectItem(list[i + 1], options) + (secondToLast ? "" : separator);
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
function inspectProperty([key, value], options) {
  options.truncate -= 2;
  if (typeof key === "string") {
    key = quoteComplexKey(key);
  } else if (typeof key !== "number") {
    key = `[${options.inspect(key, options)}]`;
  }
  options.truncate -= key.length;
  value = options.inspect(value, options);
  return `${key}: ${value}`;
}
__name(inspectProperty, "inspectProperty");
function inspectArray(array, options) {
  const nonIndexProperties = Object.keys(array).slice(array.length);
  if (!array.length && !nonIndexProperties.length)
    return "[]";
  options.truncate -= 4;
  const listContents = inspectList(array, options);
  options.truncate -= listContents.length;
  let propertyContents = "";
  if (nonIndexProperties.length) {
    propertyContents = inspectList(nonIndexProperties.map((key) => [key, array[key]]), options, inspectProperty);
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
function inspectTypedArray(array, options) {
  const name = getArrayName(array);
  options.truncate -= name.length + 4;
  const nonIndexProperties = Object.keys(array).slice(array.length);
  if (!array.length && !nonIndexProperties.length)
    return `${name}[]`;
  let output = "";
  for (let i = 0; i < array.length; i++) {
    const string = `${options.stylize(truncate(array[i], options.truncate), "number")}${i === array.length - 1 ? "" : ", "}`;
    options.truncate -= string.length;
    if (array[i] !== array.length && options.truncate <= 3) {
      output += `${truncator}(${array.length - array[i] + 1})`;
      break;
    }
    output += string;
  }
  let propertyContents = "";
  if (nonIndexProperties.length) {
    propertyContents = inspectList(nonIndexProperties.map((key) => [key, array[key]]), options, inspectProperty);
  }
  return `${name}[ ${output}${propertyContents ? `, ${propertyContents}` : ""} ]`;
}
__name(inspectTypedArray, "inspectTypedArray");
function inspectDate(dateObject, options) {
  const stringRepresentation = dateObject.toJSON();
  if (stringRepresentation === null) {
    return "Invalid Date";
  }
  const split = stringRepresentation.split("T");
  const date = split[0];
  return options.stylize(`${date}T${truncate(split[1], options.truncate - date.length - 1)}`, "date");
}
__name(inspectDate, "inspectDate");
function inspectFunction(func, options) {
  const functionType = func[Symbol.toStringTag] || "Function";
  const name = func.name;
  if (!name) {
    return options.stylize(`[${functionType}]`, "special");
  }
  return options.stylize(`[${functionType} ${truncate(name, options.truncate - 11)}]`, "special");
}
__name(inspectFunction, "inspectFunction");
function inspectMapEntry([key, value], options) {
  options.truncate -= 4;
  key = options.inspect(key, options);
  options.truncate -= key.length;
  value = options.inspect(value, options);
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
function inspectMap(map, options) {
  const size = map.size - 1;
  if (size <= 0) {
    return "Map{}";
  }
  options.truncate -= 7;
  return `Map{ ${inspectList(mapToEntries(map), options, inspectMapEntry)} }`;
}
__name(inspectMap, "inspectMap");
var isNaN = Number.isNaN || ((i) => i !== i);
function inspectNumber(number, options) {
  if (isNaN(number)) {
    return options.stylize("NaN", "number");
  }
  if (number === Infinity) {
    return options.stylize("Infinity", "number");
  }
  if (number === -Infinity) {
    return options.stylize("-Infinity", "number");
  }
  if (number === 0) {
    return options.stylize(1 / number === Infinity ? "+0" : "-0", "number");
  }
  return options.stylize(truncate(String(number), options.truncate), "number");
}
__name(inspectNumber, "inspectNumber");
function inspectBigInt(number, options) {
  let nums = truncate(number.toString(), options.truncate - 1);
  if (nums !== truncator)
    nums += "n";
  return options.stylize(nums, "bigint");
}
__name(inspectBigInt, "inspectBigInt");
function inspectRegExp(value, options) {
  const flags = value.toString().split("/")[2];
  const sourceLength = options.truncate - (2 + flags.length);
  const source = value.source;
  return options.stylize(`/${truncate(source, sourceLength)}/${flags}`, "regexp");
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
function inspectSet(set2, options) {
  if (set2.size === 0)
    return "Set{}";
  options.truncate -= 7;
  return `Set{ ${inspectList(arrayFromSet(set2), options)} }`;
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
function inspectString(string, options) {
  if (stringEscapeChars.test(string)) {
    string = string.replace(stringEscapeChars, escape);
  }
  return options.stylize(`'${truncate(string, options.truncate - 2)}'`, "string");
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
    getPromiseValue = /* @__PURE__ */ __name((value, options) => {
      const [state, innerValue] = getPromiseDetails(value);
      if (state === kPending) {
        return "Promise{<pending>}";
      }
      return `Promise${state === kRejected ? "!" : ""}{${options.inspect(innerValue, options)}}`;
    }, "getPromiseValue");
  }
} catch (notNode) {
}
var promise_default = getPromiseValue;
function inspectObject(object, options) {
  const properties = Object.getOwnPropertyNames(object);
  const symbols = Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols(object) : [];
  if (properties.length === 0 && symbols.length === 0) {
    return "{}";
  }
  options.truncate -= 4;
  options.seen = options.seen || [];
  if (options.seen.indexOf(object) >= 0) {
    return "[Circular]";
  }
  options.seen.push(object);
  const propertyContents = inspectList(properties.map((key) => [key, object[key]]), options, inspectProperty);
  const symbolContents = inspectList(symbols.map((key) => [key, object[key]]), options, inspectProperty);
  options.seen.pop();
  let sep = "";
  if (propertyContents && symbolContents) {
    sep = ", ";
  }
  return `{ ${propertyContents}${sep}${symbolContents} }`;
}
__name(inspectObject, "inspectObject");
var toStringTag = typeof Symbol !== "undefined" && Symbol.toStringTag ? Symbol.toStringTag : false;
function inspectClass(value, options) {
  let name = "";
  if (toStringTag && toStringTag in value) {
    name = value[toStringTag];
  }
  name = name || value.constructor.name;
  if (!name || name === "_class") {
    name = "<Anonymous Class>";
  }
  options.truncate -= name.length;
  return `${name}${inspectObject(value, options)}`;
}
__name(inspectClass, "inspectClass");
function inspectArguments(args, options) {
  if (args.length === 0)
    return "Arguments[]";
  options.truncate -= 13;
  return `Arguments[ ${inspectList(args, options)} ]`;
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
  "description"
];
function inspectObject2(error, options) {
  const properties = Object.getOwnPropertyNames(error).filter((key) => errorKeys.indexOf(key) === -1);
  const name = error.name;
  options.truncate -= name.length;
  let message = "";
  if (typeof error.message === "string") {
    message = truncate(error.message, options.truncate);
  } else {
    properties.unshift("message");
  }
  message = message ? `: ${message}` : "";
  options.truncate -= message.length + 5;
  const propertyContents = inspectList(properties.map((key) => [key, error[key]]), options, inspectProperty);
  return `${name}${message}${propertyContents ? ` { ${propertyContents} }` : ""}`;
}
__name(inspectObject2, "inspectObject");
function inspectAttribute([key, value], options) {
  options.truncate -= 3;
  if (!value) {
    return `${options.stylize(String(key), "yellow")}`;
  }
  return `${options.stylize(String(key), "yellow")}=${options.stylize(`"${value}"`, "string")}`;
}
__name(inspectAttribute, "inspectAttribute");
function inspectHTMLCollection(collection, options) {
  return inspectList(collection, options, inspectHTML, "\n");
}
__name(inspectHTMLCollection, "inspectHTMLCollection");
function inspectHTML(element, options) {
  const properties = element.getAttributeNames();
  const name = element.tagName.toLowerCase();
  const head = options.stylize(`<${name}`, "special");
  const headClose = options.stylize(`>`, "special");
  const tail = options.stylize(`</${name}>`, "special");
  options.truncate -= name.length * 2 + 5;
  let propertyContents = "";
  if (properties.length > 0) {
    propertyContents += " ";
    propertyContents += inspectList(properties.map((key) => [key, element.getAttribute(key)]), options, inspectAttribute, " ");
  }
  options.truncate -= propertyContents.length;
  const truncate2 = options.truncate;
  let children = inspectHTMLCollection(element.children, options);
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
  undefined: (value, options) => options.stylize("undefined", "undefined"),
  null: (value, options) => options.stylize("null", "null"),
  boolean: (value, options) => options.stylize(String(value), "boolean"),
  Boolean: (value, options) => options.stylize(String(value), "boolean"),
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
  WeakSet: (value, options) => options.stylize("WeakSet{\u2026}", "special"),
  WeakMap: (value, options) => options.stylize("WeakMap{\u2026}", "special"),
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
  Generator: () => "",
  DataView: () => "",
  ArrayBuffer: () => "",
  Error: inspectObject2,
  HTMLCollection: inspectHTMLCollection,
  NodeList: inspectHTMLCollection
};
var inspectCustom = /* @__PURE__ */ __name((value, options, type3) => {
  if (chaiInspect in value && typeof value[chaiInspect] === "function") {
    return value[chaiInspect](options);
  }
  if (nodeInspect && nodeInspect in value && typeof value[nodeInspect] === "function") {
    return value[nodeInspect](options.depth, options);
  }
  if ("inspect" in value && typeof value.inspect === "function") {
    return value.inspect(options.depth, options);
  }
  if ("constructor" in value && constructorMap.has(value.constructor)) {
    return constructorMap.get(value.constructor)(value, options);
  }
  if (stringTagMap[type3]) {
    return stringTagMap[type3](value, options);
  }
  return "";
}, "inspectCustom");
var toString = Object.prototype.toString;
function inspect(value, opts = {}) {
  const options = normaliseOptions(opts, inspect);
  const { customInspect } = options;
  let type3 = value === null ? "null" : typeof value;
  if (type3 === "object") {
    type3 = toString.call(value).slice(8, -1);
  }
  if (type3 in baseTypesMap) {
    return baseTypesMap[type3](value, options);
  }
  if (customInspect && value) {
    const output = inspectCustom(value, options, type3);
    if (output) {
      if (typeof output === "string")
        return output;
      return inspect(output, options);
    }
  }
  const proto = value ? Object.getPrototypeOf(value) : false;
  if (proto === Object.prototype || proto === null) {
    return inspectObject(value, options);
  }
  if (value && typeof HTMLElement === "function" && value instanceof HTMLElement) {
    return inspectHTML(value, options);
  }
  if ("constructor" in value) {
    if (value.constructor !== Object) {
      return inspectClass(value, options);
    }
    return inspectObject(value, options);
  }
  if (value === Object(value)) {
    return inspectObject(value, options);
  }
  return options.stylize(String(value), type3);
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
  var options = {
    colors,
    depth: typeof depth === "undefined" ? 2 : depth,
    showHidden,
    truncate: config.truncateThreshold ? config.truncateThreshold : Infinity
  };
  return inspect(obj, options);
}
__name(inspect2, "inspect");
function objDisplay(obj) {
  var str = inspect2(obj), type3 = Object.prototype.toString.call(obj);
  if (config.truncateThreshold && str.length >= config.truncateThreshold) {
    if (type3 === "[object Function]") {
      return !obj.name || obj.name === "" ? "[Function]" : "[Function: " + obj.name + "]";
    } else if (type3 === "[object Array]") {
      return "[ Array(" + obj.length + ") ]";
    } else if (type3 === "[object Object]") {
      var keys = Object.keys(obj), kstr = keys.length > 2 ? keys.splice(0, 2).join(", ") + ", ..." : keys.join(", ");
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
  var negate = flag(obj, "negate"), val = flag(obj, "object"), expected = args[3], actual = getActual(obj, args), msg = negate ? args[2] : args[1], flagMsg = flag(obj, "message");
  if (typeof msg === "function")
    msg = msg();
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
  var flags = assertion.__flags || (assertion.__flags = /* @__PURE__ */ Object.create(null));
  if (!object.__flags) {
    object.__flags = /* @__PURE__ */ Object.create(null);
  }
  includeAll = arguments.length === 3 ? includeAll : true;
  for (var flag3 in flags) {
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
function deepEqual(leftHandOperand, rightHandOperand, options) {
  if (options && options.comparator) {
    return extensiveDeepEqual(leftHandOperand, rightHandOperand, options);
  }
  var simpleResult = simpleEqual(leftHandOperand, rightHandOperand);
  if (simpleResult !== null) {
    return simpleResult;
  }
  return extensiveDeepEqual(leftHandOperand, rightHandOperand, options);
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
function extensiveDeepEqual(leftHandOperand, rightHandOperand, options) {
  options = options || {};
  options.memoize = options.memoize === false ? false : options.memoize || new MemoizeMap();
  var comparator = options && options.comparator;
  var memoizeResultLeft = memoizeCompare(leftHandOperand, rightHandOperand, options.memoize);
  if (memoizeResultLeft !== null) {
    return memoizeResultLeft;
  }
  var memoizeResultRight = memoizeCompare(rightHandOperand, leftHandOperand, options.memoize);
  if (memoizeResultRight !== null) {
    return memoizeResultRight;
  }
  if (comparator) {
    var comparatorResult = comparator(leftHandOperand, rightHandOperand);
    if (comparatorResult === false || comparatorResult === true) {
      memoizeSet(leftHandOperand, rightHandOperand, options.memoize, comparatorResult);
      return comparatorResult;
    }
    var simpleResult = simpleEqual(leftHandOperand, rightHandOperand);
    if (simpleResult !== null) {
      return simpleResult;
    }
  }
  var leftHandType = type2(leftHandOperand);
  if (leftHandType !== type2(rightHandOperand)) {
    memoizeSet(leftHandOperand, rightHandOperand, options.memoize, false);
    return false;
  }
  memoizeSet(leftHandOperand, rightHandOperand, options.memoize, true);
  var result = extensiveDeepEqualByType(leftHandOperand, rightHandOperand, leftHandType, options);
  memoizeSet(leftHandOperand, rightHandOperand, options.memoize, result);
  return result;
}
__name(extensiveDeepEqual, "extensiveDeepEqual");
function extensiveDeepEqualByType(leftHandOperand, rightHandOperand, leftHandType, options) {
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
      return keysEqual(leftHandOperand, rightHandOperand, ["name", "message", "code"], options);
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
      return iterableEqual(leftHandOperand, rightHandOperand, options);
    case "RegExp":
      return regexpEqual(leftHandOperand, rightHandOperand);
    case "Generator":
      return generatorEqual(leftHandOperand, rightHandOperand, options);
    case "DataView":
      return iterableEqual(new Uint8Array(leftHandOperand.buffer), new Uint8Array(rightHandOperand.buffer), options);
    case "ArrayBuffer":
      return iterableEqual(new Uint8Array(leftHandOperand), new Uint8Array(rightHandOperand), options);
    case "Set":
      return entriesEqual(leftHandOperand, rightHandOperand, options);
    case "Map":
      return entriesEqual(leftHandOperand, rightHandOperand, options);
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
      return objectEqual(leftHandOperand, rightHandOperand, options);
  }
}
__name(extensiveDeepEqualByType, "extensiveDeepEqualByType");
function regexpEqual(leftHandOperand, rightHandOperand) {
  return leftHandOperand.toString() === rightHandOperand.toString();
}
__name(regexpEqual, "regexpEqual");
function entriesEqual(leftHandOperand, rightHandOperand, options) {
  if (leftHandOperand.size !== rightHandOperand.size) {
    return false;
  }
  if (leftHandOperand.size === 0) {
    return true;
  }
  var leftHandItems = [];
  var rightHandItems = [];
  leftHandOperand.forEach(/* @__PURE__ */ __name(function gatherEntries(key, value) {
    leftHandItems.push([key, value]);
  }, "gatherEntries"));
  rightHandOperand.forEach(/* @__PURE__ */ __name(function gatherEntries(key, value) {
    rightHandItems.push([key, value]);
  }, "gatherEntries"));
  return iterableEqual(leftHandItems.sort(), rightHandItems.sort(), options);
}
__name(entriesEqual, "entriesEqual");
function iterableEqual(leftHandOperand, rightHandOperand, options) {
  var length = leftHandOperand.length;
  if (length !== rightHandOperand.length) {
    return false;
  }
  if (length === 0) {
    return true;
  }
  var index = -1;
  while (++index < length) {
    if (deepEqual(leftHandOperand[index], rightHandOperand[index], options) === false) {
      return false;
    }
  }
  return true;
}
__name(iterableEqual, "iterableEqual");
function generatorEqual(leftHandOperand, rightHandOperand, options) {
  return iterableEqual(getGeneratorEntries(leftHandOperand), getGeneratorEntries(rightHandOperand), options);
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
function keysEqual(leftHandOperand, rightHandOperand, keys, options) {
  var length = keys.length;
  if (length === 0) {
    return true;
  }
  for (var i = 0; i < length; i += 1) {
    if (deepEqual(leftHandOperand[keys[i]], rightHandOperand[keys[i]], options) === false) {
      return false;
    }
  }
  return true;
}
__name(keysEqual, "keysEqual");
function objectEqual(leftHandOperand, rightHandOperand, options) {
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
    return keysEqual(leftHandOperand, rightHandOperand, leftHandKeys, options);
  }
  var leftHandEntries = getIteratorEntries(leftHandOperand);
  var rightHandEntries = getIteratorEntries(rightHandOperand);
  if (leftHandEntries.length && leftHandEntries.length === rightHandEntries.length) {
    leftHandEntries.sort();
    rightHandEntries.sort();
    return iterableEqual(leftHandEntries, rightHandEntries, options);
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
function Assertion(obj, msg, ssfi, lockSsfi) {
  flag(this, "ssfi", ssfi || Assertion);
  flag(this, "lockSsfi", lockSsfi);
  flag(this, "object", obj);
  flag(this, "message", msg);
  flag(this, "eql", config.deepEqual || deep_eql_default);
  return proxify(this);
}
__name(Assertion, "Assertion");
Object.defineProperty(Assertion, "includeStack", {
  get: function() {
    console.warn("Assertion.includeStack is deprecated, use chai.config.includeStack instead.");
    return config.includeStack;
  },
  set: function(value) {
    console.warn("Assertion.includeStack is deprecated, use chai.config.includeStack instead.");
    config.includeStack = value;
  }
});
Object.defineProperty(Assertion, "showDiff", {
  get: function() {
    console.warn("Assertion.showDiff is deprecated, use chai.config.showDiff instead.");
    return config.showDiff;
  },
  set: function(value) {
    console.warn("Assertion.showDiff is deprecated, use chai.config.showDiff instead.");
    config.showDiff = value;
  }
});
Assertion.addProperty = function(name, fn) {
  addProperty(this.prototype, name, fn);
};
Assertion.addMethod = function(name, fn) {
  addMethod(this.prototype, name, fn);
};
Assertion.addChainableMethod = function(name, fn, chainingBehavior) {
  addChainableMethod(this.prototype, name, fn, chainingBehavior);
};
Assertion.overwriteProperty = function(name, fn) {
  overwriteProperty(this.prototype, name, fn);
};
Assertion.overwriteMethod = function(name, fn) {
  overwriteMethod(this.prototype, name, fn);
};
Assertion.overwriteChainableMethod = function(name, fn, chainingBehavior) {
  overwriteChainableMethod(this.prototype, name, fn, chainingBehavior);
};
Assertion.prototype.assert = function(expr, msg, negateMsg, expected, _actual, showDiff) {
  var ok = test(this, arguments);
  if (false !== showDiff)
    showDiff = true;
  if (void 0 === expected && void 0 === _actual)
    showDiff = false;
  if (true !== config.showDiff)
    showDiff = false;
  if (!ok) {
    msg = getMessage2(this, arguments);
    var actual = getActual(this, arguments);
    var assertionErrorObjectProperties = {
      actual,
      expected,
      showDiff
    };
    var operator = getOperator(this, arguments);
    if (operator) {
      assertionErrorObjectProperties.operator = operator;
    }
    throw new AssertionError(
      msg,
      assertionErrorObjectProperties,
      config.includeStack ? this.assert : flag(this, "ssfi")
    );
  }
};
Object.defineProperty(
  Assertion.prototype,
  "_obj",
  {
    get: function() {
      return flag(this, "object");
    },
    set: function(val) {
      flag(this, "object", val);
    }
  }
);
function isProxyEnabled() {
  return config.useProxy && typeof Proxy !== "undefined" && typeof Reflect !== "undefined";
}
__name(isProxyEnabled, "isProxyEnabled");
function addProperty(ctx, name, getter) {
  getter = getter === void 0 ? function() {
  } : getter;
  Object.defineProperty(
    ctx,
    name,
    {
      get: /* @__PURE__ */ __name(function propertyGetter() {
        if (!isProxyEnabled() && !flag(this, "lockSsfi")) {
          flag(this, "ssfi", propertyGetter);
        }
        var result = getter.call(this);
        if (result !== void 0)
          return result;
        var newAssertion = new Assertion();
        transferFlags(this, newAssertion);
        return newAssertion;
      }, "propertyGetter"),
      configurable: true
    }
  );
}
__name(addProperty, "addProperty");
var fnLengthDesc = Object.getOwnPropertyDescriptor(function() {
}, "length");
function addLengthGuard(fn, assertionName, isChainable) {
  if (!fnLengthDesc.configurable)
    return fn;
  Object.defineProperty(fn, "length", {
    get: function() {
      if (isChainable) {
        throw Error("Invalid Chai property: " + assertionName + '.length. Due to a compatibility issue, "length" cannot directly follow "' + assertionName + '". Use "' + assertionName + '.lengthOf" instead.');
      }
      throw Error("Invalid Chai property: " + assertionName + '.length. See docs for proper usage of "' + assertionName + '".');
    }
  });
  return fn;
}
__name(addLengthGuard, "addLengthGuard");
function getProperties(object) {
  var result = Object.getOwnPropertyNames(object);
  function addProperty2(property) {
    if (result.indexOf(property) === -1) {
      result.push(property);
    }
  }
  __name(addProperty2, "addProperty");
  var proto = Object.getPrototypeOf(object);
  while (proto !== null) {
    Object.getOwnPropertyNames(proto).forEach(addProperty2);
    proto = Object.getPrototypeOf(proto);
  }
  return result;
}
__name(getProperties, "getProperties");
var builtins = ["__flags", "__methods", "_obj", "assert"];
function proxify(obj, nonChainableMethodName) {
  if (!isProxyEnabled())
    return obj;
  return new Proxy(obj, {
    get: /* @__PURE__ */ __name(function proxyGetter(target, property) {
      if (typeof property === "string" && config.proxyExcludedKeys.indexOf(property) === -1 && !Reflect.has(target, property)) {
        if (nonChainableMethodName) {
          throw Error("Invalid Chai property: " + nonChainableMethodName + "." + property + '. See docs for proper usage of "' + nonChainableMethodName + '".');
        }
        var suggestion = null;
        var suggestionDistance = 4;
        getProperties(target).forEach(function(prop) {
          if (!Object.prototype.hasOwnProperty(prop) && builtins.indexOf(prop) === -1) {
            var dist = stringDistanceCapped(
              property,
              prop,
              suggestionDistance
            );
            if (dist < suggestionDistance) {
              suggestion = prop;
              suggestionDistance = dist;
            }
          }
        });
        if (suggestion !== null) {
          throw Error("Invalid Chai property: " + property + '. Did you mean "' + suggestion + '"?');
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
  var memo = [];
  for (var i = 0; i <= strA.length; i++) {
    memo[i] = Array(strB.length + 1).fill(0);
    memo[i][0] = i;
  }
  for (var j = 0; j < strB.length; j++) {
    memo[0][j] = j;
  }
  for (var i = 1; i <= strA.length; i++) {
    var ch = strA.charCodeAt(i - 1);
    for (var j = 1; j <= strB.length; j++) {
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
  var methodWrapper = /* @__PURE__ */ __name(function() {
    if (!flag(this, "lockSsfi")) {
      flag(this, "ssfi", methodWrapper);
    }
    var result = method.apply(this, arguments);
    if (result !== void 0)
      return result;
    var newAssertion = new Assertion();
    transferFlags(this, newAssertion);
    return newAssertion;
  }, "methodWrapper");
  addLengthGuard(methodWrapper, name, false);
  ctx[name] = proxify(methodWrapper, name);
}
__name(addMethod, "addMethod");
function overwriteProperty(ctx, name, getter) {
  var _get = Object.getOwnPropertyDescriptor(ctx, name), _super = /* @__PURE__ */ __name(function() {
  }, "_super");
  if (_get && "function" === typeof _get.get)
    _super = _get.get;
  Object.defineProperty(
    ctx,
    name,
    {
      get: /* @__PURE__ */ __name(function overwritingPropertyGetter() {
        if (!isProxyEnabled() && !flag(this, "lockSsfi")) {
          flag(this, "ssfi", overwritingPropertyGetter);
        }
        var origLockSsfi = flag(this, "lockSsfi");
        flag(this, "lockSsfi", true);
        var result = getter(_super).call(this);
        flag(this, "lockSsfi", origLockSsfi);
        if (result !== void 0) {
          return result;
        }
        var newAssertion = new Assertion();
        transferFlags(this, newAssertion);
        return newAssertion;
      }, "overwritingPropertyGetter"),
      configurable: true
    }
  );
}
__name(overwriteProperty, "overwriteProperty");
function overwriteMethod(ctx, name, method) {
  var _method = ctx[name], _super = /* @__PURE__ */ __name(function() {
    throw new Error(name + " is not a function");
  }, "_super");
  if (_method && "function" === typeof _method)
    _super = _method;
  var overwritingMethodWrapper = /* @__PURE__ */ __name(function() {
    if (!flag(this, "lockSsfi")) {
      flag(this, "ssfi", overwritingMethodWrapper);
    }
    var origLockSsfi = flag(this, "lockSsfi");
    flag(this, "lockSsfi", true);
    var result = method(_super).apply(this, arguments);
    flag(this, "lockSsfi", origLockSsfi);
    if (result !== void 0) {
      return result;
    }
    var newAssertion = new Assertion();
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
  var propDesc = Object.getOwnPropertyDescriptor(testFn, name);
  if (typeof propDesc !== "object")
    return true;
  return !propDesc.configurable;
});
var call = Function.prototype.call;
var apply = Function.prototype.apply;
function addChainableMethod(ctx, name, method, chainingBehavior) {
  if (typeof chainingBehavior !== "function") {
    chainingBehavior = /* @__PURE__ */ __name(function() {
    }, "chainingBehavior");
  }
  var chainableBehavior = {
    method,
    chainingBehavior
  };
  if (!ctx.__methods) {
    ctx.__methods = {};
  }
  ctx.__methods[name] = chainableBehavior;
  Object.defineProperty(
    ctx,
    name,
    {
      get: /* @__PURE__ */ __name(function chainableMethodGetter() {
        chainableBehavior.chainingBehavior.call(this);
        var chainableMethodWrapper = /* @__PURE__ */ __name(function() {
          if (!flag(this, "lockSsfi")) {
            flag(this, "ssfi", chainableMethodWrapper);
          }
          var result = chainableBehavior.method.apply(this, arguments);
          if (result !== void 0) {
            return result;
          }
          var newAssertion = new Assertion();
          transferFlags(this, newAssertion);
          return newAssertion;
        }, "chainableMethodWrapper");
        addLengthGuard(chainableMethodWrapper, name, true);
        if (canSetPrototype) {
          var prototype = Object.create(this);
          prototype.call = call;
          prototype.apply = apply;
          Object.setPrototypeOf(chainableMethodWrapper, prototype);
        } else {
          var asserterNames = Object.getOwnPropertyNames(ctx);
          asserterNames.forEach(function(asserterName) {
            if (excludeNames.indexOf(asserterName) !== -1) {
              return;
            }
            var pd = Object.getOwnPropertyDescriptor(ctx, asserterName);
            Object.defineProperty(chainableMethodWrapper, asserterName, pd);
          });
        }
        transferFlags(this, chainableMethodWrapper);
        return proxify(chainableMethodWrapper);
      }, "chainableMethodGetter"),
      configurable: true
    }
  );
}
__name(addChainableMethod, "addChainableMethod");
function overwriteChainableMethod(ctx, name, method, chainingBehavior) {
  var chainableBehavior = ctx.__methods[name];
  var _chainingBehavior = chainableBehavior.chainingBehavior;
  chainableBehavior.chainingBehavior = /* @__PURE__ */ __name(function overwritingChainableMethodGetter() {
    var result = chainingBehavior(_chainingBehavior).call(this);
    if (result !== void 0) {
      return result;
    }
    var newAssertion = new Assertion();
    transferFlags(this, newAssertion);
    return newAssertion;
  }, "overwritingChainableMethodGetter");
  var _method = chainableBehavior.method;
  chainableBehavior.method = /* @__PURE__ */ __name(function overwritingChainableMethodWrapper() {
    var result = method(_method).apply(this, arguments);
    if (result !== void 0) {
      return result;
    }
    var newAssertion = new Assertion();
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
  if (typeof Object.getOwnPropertySymbols !== "function")
    return [];
  return Object.getOwnPropertySymbols(obj).filter(function(sym) {
    return Object.getOwnPropertyDescriptor(obj, sym).enumerable;
  });
}
__name(getOwnEnumerablePropertySymbols, "getOwnEnumerablePropertySymbols");
function getOwnEnumerableProperties(obj) {
  return Object.keys(obj).concat(getOwnEnumerablePropertySymbols(obj));
}
__name(getOwnEnumerableProperties, "getOwnEnumerableProperties");
function _isNaN(value) {
  return value !== value;
}
__name(_isNaN, "_isNaN");
var isNaN2 = Number.isNaN || _isNaN;
function isObjectType(obj) {
  var objectType = type(obj);
  var objectTypes = ["Array", "Object", "Function"];
  return objectTypes.indexOf(objectType) !== -1;
}
__name(isObjectType, "isObjectType");
function getOperator(obj, args) {
  var operator = flag(obj, "operator");
  var negate = flag(obj, "negate");
  var expected = args[3];
  var msg = negate ? args[2] : args[1];
  if (operator) {
    return operator;
  }
  if (typeof msg === "function")
    msg = msg();
  msg = msg || "";
  if (!msg) {
    return void 0;
  }
  if (/\shave\s/.test(msg)) {
    return void 0;
  }
  var isObject = isObjectType(expected);
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
  "function": ["function", "asyncfunction", "generatorfunction", "asyncgeneratorfunction"],
  "asyncfunction": ["asyncfunction", "asyncgeneratorfunction"],
  "generatorfunction": ["generatorfunction", "asyncgeneratorfunction"],
  "asyncgeneratorfunction": ["asyncgeneratorfunction"]
};
function an(type3, msg) {
  if (msg)
    flag2(this, "message", msg);
  type3 = type3.toLowerCase();
  var obj = flag2(this, "object"), article = ~["a", "e", "i", "o", "u"].indexOf(type3.charAt(0)) ? "an " : "a ";
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
  if (msg)
    flag2(this, "message", msg);
  var obj = flag2(this, "object"), objType = type(obj).toLowerCase(), flagMsg = flag2(this, "message"), negate = flag2(this, "negate"), ssfi = flag2(this, "ssfi"), isDeep = flag2(this, "deep"), descriptor = isDeep ? "deep " : "", isEql = isDeep ? flag2(this, "eql") : SameValueZero;
  flagMsg = flagMsg ? flagMsg + ": " : "";
  var included = false;
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
    default:
      if (val !== Object(val)) {
        throw new AssertionError(
          flagMsg + "the given combination of arguments (" + objType + " and " + type(val).toLowerCase() + ") is invalid for this assertion. You can use an array, a map, an object, a set, a string, or a weakset instead of a " + type(val).toLowerCase(),
          void 0,
          ssfi
        );
      }
      var props = Object.keys(val), firstErr = null, numErrs = 0;
      props.forEach(function(prop) {
        var propAssertion = new Assertion(obj);
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
          if (firstErr === null)
            firstErr = err;
          numErrs++;
        }
      }, this);
      if (negate && props.length > 1 && numErrs === props.length) {
        throw firstErr;
      }
      return;
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
Assertion.addProperty("callable", function() {
  const val = flag2(this, "object");
  const ssfi = flag2(this, "ssfi");
  const message = flag2(this, "message");
  const msg = message ? `${message}: ` : "";
  const negate = flag2(this, "negate");
  const assertionMessage = negate ? `${msg}expected ${inspect2(val)} not to be a callable function` : `${msg}expected ${inspect2(val)} to be a callable function`;
  const isCallable = ["Function", "AsyncFunction", "GeneratorFunction", "AsyncGeneratorFunction"].includes(type(val));
  if (isCallable && negate || !isCallable && !negate) {
    throw new AssertionError(
      assertionMessage,
      void 0,
      ssfi
    );
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
  var val = flag2(this, "object");
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
  var val = flag2(this, "object"), ssfi = flag2(this, "ssfi"), flagMsg = flag2(this, "message"), itemsCount;
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
    case "function":
      var msg = flagMsg + ".empty was passed a function " + getName(val);
      throw new AssertionError(msg.trim(), void 0, ssfi);
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
  var obj = flag2(this, "object"), type3 = type(obj);
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
  if (msg)
    flag2(this, "message", msg);
  var obj = flag2(this, "object");
  if (flag2(this, "deep")) {
    var prevLockSsfi = flag2(this, "lockSsfi");
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
  if (msg)
    flag2(this, "message", msg);
  var eql = flag2(this, "eql");
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
  if (msg)
    flag2(this, "message", msg);
  var obj = flag2(this, "object"), doLength = flag2(this, "doLength"), flagMsg = flag2(this, "message"), msgPrefix = flagMsg ? flagMsg + ": " : "", ssfi = flag2(this, "ssfi"), objType = type(obj).toLowerCase(), nType = type(n).toLowerCase(), errorMessage, shouldThrow = true;
  if (doLength && objType !== "map" && objType !== "set") {
    new Assertion(obj, flagMsg, ssfi, true).to.have.property("length");
  }
  if (!doLength && (objType === "date" && nType !== "date")) {
    errorMessage = msgPrefix + "the argument to above must be a date";
  } else if (nType !== "number" && (doLength || objType === "number")) {
    errorMessage = msgPrefix + "the argument to above must be a number";
  } else if (!doLength && (objType !== "date" && objType !== "number")) {
    var printObj = objType === "string" ? "'" + obj + "'" : obj;
    errorMessage = msgPrefix + "expected " + printObj + " to be a number or a date";
  } else {
    shouldThrow = false;
  }
  if (shouldThrow) {
    throw new AssertionError(errorMessage, void 0, ssfi);
  }
  if (doLength) {
    var descriptor = "length", itemsCount;
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
  if (msg)
    flag2(this, "message", msg);
  var obj = flag2(this, "object"), doLength = flag2(this, "doLength"), flagMsg = flag2(this, "message"), msgPrefix = flagMsg ? flagMsg + ": " : "", ssfi = flag2(this, "ssfi"), objType = type(obj).toLowerCase(), nType = type(n).toLowerCase(), errorMessage, shouldThrow = true;
  if (doLength && objType !== "map" && objType !== "set") {
    new Assertion(obj, flagMsg, ssfi, true).to.have.property("length");
  }
  if (!doLength && (objType === "date" && nType !== "date")) {
    errorMessage = msgPrefix + "the argument to least must be a date";
  } else if (nType !== "number" && (doLength || objType === "number")) {
    errorMessage = msgPrefix + "the argument to least must be a number";
  } else if (!doLength && (objType !== "date" && objType !== "number")) {
    var printObj = objType === "string" ? "'" + obj + "'" : obj;
    errorMessage = msgPrefix + "expected " + printObj + " to be a number or a date";
  } else {
    shouldThrow = false;
  }
  if (shouldThrow) {
    throw new AssertionError(errorMessage, void 0, ssfi);
  }
  if (doLength) {
    var descriptor = "length", itemsCount;
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
  if (msg)
    flag2(this, "message", msg);
  var obj = flag2(this, "object"), doLength = flag2(this, "doLength"), flagMsg = flag2(this, "message"), msgPrefix = flagMsg ? flagMsg + ": " : "", ssfi = flag2(this, "ssfi"), objType = type(obj).toLowerCase(), nType = type(n).toLowerCase(), errorMessage, shouldThrow = true;
  if (doLength && objType !== "map" && objType !== "set") {
    new Assertion(obj, flagMsg, ssfi, true).to.have.property("length");
  }
  if (!doLength && (objType === "date" && nType !== "date")) {
    errorMessage = msgPrefix + "the argument to below must be a date";
  } else if (nType !== "number" && (doLength || objType === "number")) {
    errorMessage = msgPrefix + "the argument to below must be a number";
  } else if (!doLength && (objType !== "date" && objType !== "number")) {
    var printObj = objType === "string" ? "'" + obj + "'" : obj;
    errorMessage = msgPrefix + "expected " + printObj + " to be a number or a date";
  } else {
    shouldThrow = false;
  }
  if (shouldThrow) {
    throw new AssertionError(errorMessage, void 0, ssfi);
  }
  if (doLength) {
    var descriptor = "length", itemsCount;
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
  if (msg)
    flag2(this, "message", msg);
  var obj = flag2(this, "object"), doLength = flag2(this, "doLength"), flagMsg = flag2(this, "message"), msgPrefix = flagMsg ? flagMsg + ": " : "", ssfi = flag2(this, "ssfi"), objType = type(obj).toLowerCase(), nType = type(n).toLowerCase(), errorMessage, shouldThrow = true;
  if (doLength && objType !== "map" && objType !== "set") {
    new Assertion(obj, flagMsg, ssfi, true).to.have.property("length");
  }
  if (!doLength && (objType === "date" && nType !== "date")) {
    errorMessage = msgPrefix + "the argument to most must be a date";
  } else if (nType !== "number" && (doLength || objType === "number")) {
    errorMessage = msgPrefix + "the argument to most must be a number";
  } else if (!doLength && (objType !== "date" && objType !== "number")) {
    var printObj = objType === "string" ? "'" + obj + "'" : obj;
    errorMessage = msgPrefix + "expected " + printObj + " to be a number or a date";
  } else {
    shouldThrow = false;
  }
  if (shouldThrow) {
    throw new AssertionError(errorMessage, void 0, ssfi);
  }
  if (doLength) {
    var descriptor = "length", itemsCount;
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
  if (msg)
    flag2(this, "message", msg);
  var obj = flag2(this, "object"), doLength = flag2(this, "doLength"), flagMsg = flag2(this, "message"), msgPrefix = flagMsg ? flagMsg + ": " : "", ssfi = flag2(this, "ssfi"), objType = type(obj).toLowerCase(), startType = type(start).toLowerCase(), finishType = type(finish).toLowerCase(), errorMessage, shouldThrow = true, range = startType === "date" && finishType === "date" ? start.toISOString() + ".." + finish.toISOString() : start + ".." + finish;
  if (doLength && objType !== "map" && objType !== "set") {
    new Assertion(obj, flagMsg, ssfi, true).to.have.property("length");
  }
  if (!doLength && (objType === "date" && (startType !== "date" || finishType !== "date"))) {
    errorMessage = msgPrefix + "the arguments to within must be dates";
  } else if ((startType !== "number" || finishType !== "number") && (doLength || objType === "number")) {
    errorMessage = msgPrefix + "the arguments to within must be numbers";
  } else if (!doLength && (objType !== "date" && objType !== "number")) {
    var printObj = objType === "string" ? "'" + obj + "'" : obj;
    errorMessage = msgPrefix + "expected " + printObj + " to be a number or a date";
  } else {
    shouldThrow = false;
  }
  if (shouldThrow) {
    throw new AssertionError(errorMessage, void 0, ssfi);
  }
  if (doLength) {
    var descriptor = "length", itemsCount;
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
  if (msg)
    flag2(this, "message", msg);
  var target = flag2(this, "object");
  var ssfi = flag2(this, "ssfi");
  var flagMsg = flag2(this, "message");
  try {
    var isInstanceOf = target instanceof constructor;
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
  var name = getName(constructor);
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
  if (msg)
    flag2(this, "message", msg);
  var isNested = flag2(this, "nested"), isOwn = flag2(this, "own"), flagMsg = flag2(this, "message"), obj = flag2(this, "object"), ssfi = flag2(this, "ssfi"), nameType = typeof name;
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
  var isDeep = flag2(this, "deep"), negate = flag2(this, "negate"), pathInfo = isNested ? getPathInfo(obj, name) : null, value = isNested ? pathInfo.value : obj[name], isEql = isDeep ? flag2(this, "eql") : (val1, val2) => val1 === val2;
  var descriptor = "";
  if (isDeep)
    descriptor += "deep ";
  if (isOwn)
    descriptor += "own ";
  if (isNested)
    descriptor += "nested ";
  descriptor += "property ";
  var hasProperty2;
  if (isOwn)
    hasProperty2 = Object.prototype.hasOwnProperty.call(obj, name);
  else if (isNested)
    hasProperty2 = pathInfo.exists;
  else
    hasProperty2 = hasProperty(obj, name);
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
function assertOwnProperty(name, value, msg) {
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
  if (msg)
    flag2(this, "message", msg);
  var obj = flag2(this, "object");
  var actualDescriptor = Object.getOwnPropertyDescriptor(Object(obj), name);
  var eql = flag2(this, "eql");
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
  if (msg)
    flag2(this, "message", msg);
  var obj = flag2(this, "object"), objType = type(obj).toLowerCase(), flagMsg = flag2(this, "message"), ssfi = flag2(this, "ssfi"), descriptor = "length", itemsCount;
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
  if (msg)
    flag2(this, "message", msg);
  var obj = flag2(this, "object");
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
  if (msg)
    flag2(this, "message", msg);
  var obj = flag2(this, "object"), flagMsg = flag2(this, "message"), ssfi = flag2(this, "ssfi");
  new Assertion(obj, flagMsg, ssfi, true).is.a("string");
  this.assert(
    ~obj.indexOf(str),
    "expected #{this} to contain " + inspect2(str),
    "expected #{this} to not contain " + inspect2(str)
  );
});
function assertKeys(keys) {
  var obj = flag2(this, "object"), objType = type(obj), keysType = type(keys), ssfi = flag2(this, "ssfi"), isDeep = flag2(this, "deep"), str, deepStr = "", actual, ok = true, flagMsg = flag2(this, "message");
  flagMsg = flagMsg ? flagMsg + ": " : "";
  var mixedArgsMsg = flagMsg + "when testing keys against an object or an array you must give a single Array|Object|String argument or multiple String arguments";
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
  var len = keys.length, any = flag2(this, "any"), all = flag2(this, "all"), expected = keys, isEql = isDeep ? flag2(this, "eql") : (val1, val2) => val1 === val2;
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
    var last = keys.pop();
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
  if (msg)
    flag2(this, "message", msg);
  var obj = flag2(this, "object"), ssfi = flag2(this, "ssfi"), flagMsg = flag2(this, "message"), negate = flag2(this, "negate") || false;
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
  var everyArgIsUndefined = errorLike === void 0 && errMsgMatcher === void 0;
  var everyArgIsDefined = Boolean(errorLike && errMsgMatcher);
  var errorLikeFail = false;
  var errMsgMatcherFail = false;
  if (everyArgIsUndefined || !everyArgIsUndefined && !negate) {
    var errorLikeString = "an error";
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
      var isCompatibleInstance = check_error_exports.compatibleInstance(caughtErr, errorLike);
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
    var isCompatibleConstructor = check_error_exports.compatibleConstructor(caughtErr, errorLike);
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
    var placeholder = "including";
    if (isRegExp2(errMsgMatcher)) {
      placeholder = "matching";
    }
    var isCompatibleMessage = check_error_exports.compatibleMessage(caughtErr, errMsgMatcher);
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
  if (msg)
    flag2(this, "message", msg);
  var obj = flag2(this, "object"), itself = flag2(this, "itself"), context = "function" === typeof obj && !itself ? obj.prototype[method] : obj[method];
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
  if (msg)
    flag2(this, "message", msg);
  var obj = flag2(this, "object");
  var result = matcher(obj);
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
  if (msg)
    flag2(this, "message", msg);
  var obj = flag2(this, "object"), flagMsg = flag2(this, "message"), ssfi = flag2(this, "ssfi");
  new Assertion(obj, flagMsg, ssfi, true).is.a("number");
  if (typeof expected !== "number" || typeof delta !== "number") {
    flagMsg = flagMsg ? flagMsg + ": " : "";
    var deltaMessage = delta === void 0 ? ", and a delta is required" : "";
    throw new AssertionError(
      flagMsg + "the arguments to closeTo or approximately must be numbers" + deltaMessage,
      void 0,
      ssfi
    );
  }
  this.assert(
    Math.abs(obj - expected) <= delta,
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
    if (subset.length !== superset.length)
      return false;
    superset = superset.slice();
  }
  return subset.every(function(elem, idx) {
    if (ordered)
      return cmp ? cmp(elem, superset[idx]) : elem === superset[idx];
    if (!cmp) {
      var matchIdx = superset.indexOf(elem);
      if (matchIdx === -1)
        return false;
      if (!contains)
        superset.splice(matchIdx, 1);
      return true;
    }
    return superset.some(function(elem2, matchIdx2) {
      if (!cmp(elem, elem2))
        return false;
      if (!contains)
        superset.splice(matchIdx2, 1);
      return true;
    });
  });
}
__name(isSubsetOf, "isSubsetOf");
Assertion.addMethod("members", function(subset, msg) {
  if (msg)
    flag2(this, "message", msg);
  var obj = flag2(this, "object"), flagMsg = flag2(this, "message"), ssfi = flag2(this, "ssfi");
  new Assertion(obj, flagMsg, ssfi, true).to.be.iterable;
  new Assertion(subset, flagMsg, ssfi, true).to.be.iterable;
  var contains = flag2(this, "contains");
  var ordered = flag2(this, "ordered");
  var subject, failMsg, failNegateMsg;
  if (contains) {
    subject = ordered ? "an ordered superset" : "a superset";
    failMsg = "expected #{this} to be " + subject + " of #{exp}";
    failNegateMsg = "expected #{this} to not be " + subject + " of #{exp}";
  } else {
    subject = ordered ? "ordered members" : "members";
    failMsg = "expected #{this} to have the same " + subject + " as #{exp}";
    failNegateMsg = "expected #{this} to not have the same " + subject + " as #{exp}";
  }
  var cmp = flag2(this, "deep") ? flag2(this, "eql") : void 0;
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
  if (msg)
    flag2(this, "message", msg);
  var obj = flag2(this, "object");
  this.assert(
    obj != void 0 && obj[Symbol.iterator],
    "expected #{this} to be an iterable",
    "expected #{this} to not be an iterable",
    obj
  );
});
function oneOf(list, msg) {
  if (msg)
    flag2(this, "message", msg);
  var expected = flag2(this, "object"), flagMsg = flag2(this, "message"), ssfi = flag2(this, "ssfi"), contains = flag2(this, "contains"), isDeep = flag2(this, "deep"), eql = flag2(this, "eql");
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
  if (msg)
    flag2(this, "message", msg);
  var fn = flag2(this, "object"), flagMsg = flag2(this, "message"), ssfi = flag2(this, "ssfi");
  new Assertion(fn, flagMsg, ssfi, true).is.a("function");
  var initial;
  if (!prop) {
    new Assertion(subject, flagMsg, ssfi, true).is.a("function");
    initial = subject();
  } else {
    new Assertion(subject, flagMsg, ssfi, true).to.have.property(prop);
    initial = subject[prop];
  }
  fn();
  var final = prop === void 0 || prop === null ? subject() : subject[prop];
  var msgObj = prop === void 0 || prop === null ? initial : "." + prop;
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
  if (msg)
    flag2(this, "message", msg);
  var fn = flag2(this, "object"), flagMsg = flag2(this, "message"), ssfi = flag2(this, "ssfi");
  new Assertion(fn, flagMsg, ssfi, true).is.a("function");
  var initial;
  if (!prop) {
    new Assertion(subject, flagMsg, ssfi, true).is.a("function");
    initial = subject();
  } else {
    new Assertion(subject, flagMsg, ssfi, true).to.have.property(prop);
    initial = subject[prop];
  }
  new Assertion(initial, flagMsg, ssfi, true).is.a("number");
  fn();
  var final = prop === void 0 || prop === null ? subject() : subject[prop];
  var msgObj = prop === void 0 || prop === null ? initial : "." + prop;
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
  if (msg)
    flag2(this, "message", msg);
  var fn = flag2(this, "object"), flagMsg = flag2(this, "message"), ssfi = flag2(this, "ssfi");
  new Assertion(fn, flagMsg, ssfi, true).is.a("function");
  var initial;
  if (!prop) {
    new Assertion(subject, flagMsg, ssfi, true).is.a("function");
    initial = subject();
  } else {
    new Assertion(subject, flagMsg, ssfi, true).to.have.property(prop);
    initial = subject[prop];
  }
  new Assertion(initial, flagMsg, ssfi, true).is.a("number");
  fn();
  var final = prop === void 0 || prop === null ? subject() : subject[prop];
  var msgObj = prop === void 0 || prop === null ? initial : "." + prop;
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
  if (msg)
    flag2(this, "message", msg);
  var msgObj = flag2(this, "deltaMsgObj");
  var initial = flag2(this, "initialDeltaValue");
  var final = flag2(this, "finalDeltaValue");
  var behavior = flag2(this, "deltaBehavior");
  var realDelta = flag2(this, "realDelta");
  var expression;
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
  var obj = flag2(this, "object");
  var isExtensible = obj === Object(obj) && Object.isExtensible(obj);
  this.assert(
    isExtensible,
    "expected #{this} to be extensible",
    "expected #{this} to not be extensible"
  );
});
Assertion.addProperty("sealed", function() {
  var obj = flag2(this, "object");
  var isSealed = obj === Object(obj) ? Object.isSealed(obj) : true;
  this.assert(
    isSealed,
    "expected #{this} to be sealed",
    "expected #{this} to not be sealed"
  );
});
Assertion.addProperty("frozen", function() {
  var obj = flag2(this, "object");
  var isFrozen = obj === Object(obj) ? Object.isFrozen(obj) : true;
  this.assert(
    isFrozen,
    "expected #{this} to be frozen",
    "expected #{this} to not be frozen"
  );
});
Assertion.addProperty("finite", function(msg) {
  var obj = flag2(this, "object");
  this.assert(
    typeof obj === "number" && isFinite(obj),
    "expected #{this} to be a finite number",
    "expected #{this} to not be a finite number"
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
  throw new AssertionError(message, {
    actual,
    expected,
    operator
  }, expect.fail);
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
  var should2 = {};
  should2.fail = function(actual, expected, message, operator) {
    if (arguments.length < 2) {
      message = actual;
      actual = void 0;
    }
    message = message || "should.fail()";
    throw new AssertionError(message, {
      actual,
      expected,
      operator
    }, should2.fail);
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
  var test2 = new Assertion(null, null, assert, true);
  test2.assert(
    express,
    errmsg,
    "[ negation message unavailable ]"
  );
}
__name(assert, "assert");
assert.fail = function(actual, expected, message, operator) {
  if (arguments.length < 2) {
    message = actual;
    actual = void 0;
  }
  message = message || "assert.fail()";
  throw new AssertionError(message, {
    actual,
    expected,
    operator
  }, assert.fail);
};
assert.isOk = function(val, msg) {
  new Assertion(val, msg, assert.isOk, true).is.ok;
};
assert.isNotOk = function(val, msg) {
  new Assertion(val, msg, assert.isNotOk, true).is.not.ok;
};
assert.equal = function(act, exp, msg) {
  var test2 = new Assertion(act, msg, assert.equal, true);
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
  var test2 = new Assertion(act, msg, assert.notEqual, true);
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
  new Assertion(val, msg, assert.notInstanceOf, true).to.not.be.instanceOf(type3);
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
  new Assertion(exp, msg, assert.notNestedInclude, true).not.nested.include(inc);
};
assert.deepNestedInclude = function(exp, inc, msg) {
  new Assertion(exp, msg, assert.deepNestedInclude, true).deep.nested.include(inc);
};
assert.notDeepNestedInclude = function(exp, inc, msg) {
  new Assertion(exp, msg, assert.notDeepNestedInclude, true).not.deep.nested.include(inc);
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
  new Assertion(exp, msg, assert.notDeepOwnInclude, true).not.deep.own.include(inc);
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
  new Assertion(obj, msg, assert.notPropertyVal, true).to.not.have.property(prop, val);
};
assert.deepPropertyVal = function(obj, prop, val, msg) {
  new Assertion(obj, msg, assert.deepPropertyVal, true).to.have.deep.property(prop, val);
};
assert.notDeepPropertyVal = function(obj, prop, val, msg) {
  new Assertion(obj, msg, assert.notDeepPropertyVal, true).to.not.have.deep.property(prop, val);
};
assert.ownProperty = function(obj, prop, msg) {
  new Assertion(obj, msg, assert.ownProperty, true).to.have.own.property(prop);
};
assert.notOwnProperty = function(obj, prop, msg) {
  new Assertion(obj, msg, assert.notOwnProperty, true).to.not.have.own.property(prop);
};
assert.ownPropertyVal = function(obj, prop, value, msg) {
  new Assertion(obj, msg, assert.ownPropertyVal, true).to.have.own.property(prop, value);
};
assert.notOwnPropertyVal = function(obj, prop, value, msg) {
  new Assertion(obj, msg, assert.notOwnPropertyVal, true).to.not.have.own.property(prop, value);
};
assert.deepOwnPropertyVal = function(obj, prop, value, msg) {
  new Assertion(obj, msg, assert.deepOwnPropertyVal, true).to.have.deep.own.property(prop, value);
};
assert.notDeepOwnPropertyVal = function(obj, prop, value, msg) {
  new Assertion(obj, msg, assert.notDeepOwnPropertyVal, true).to.not.have.deep.own.property(prop, value);
};
assert.nestedProperty = function(obj, prop, msg) {
  new Assertion(obj, msg, assert.nestedProperty, true).to.have.nested.property(prop);
};
assert.notNestedProperty = function(obj, prop, msg) {
  new Assertion(obj, msg, assert.notNestedProperty, true).to.not.have.nested.property(prop);
};
assert.nestedPropertyVal = function(obj, prop, val, msg) {
  new Assertion(obj, msg, assert.nestedPropertyVal, true).to.have.nested.property(prop, val);
};
assert.notNestedPropertyVal = function(obj, prop, val, msg) {
  new Assertion(obj, msg, assert.notNestedPropertyVal, true).to.not.have.nested.property(prop, val);
};
assert.deepNestedPropertyVal = function(obj, prop, val, msg) {
  new Assertion(obj, msg, assert.deepNestedPropertyVal, true).to.have.deep.nested.property(prop, val);
};
assert.notDeepNestedPropertyVal = function(obj, prop, val, msg) {
  new Assertion(obj, msg, assert.notDeepNestedPropertyVal, true).to.not.have.deep.nested.property(prop, val);
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
  new Assertion(obj, msg, assert.containsAllKeys, true).to.contain.all.keys(keys);
};
assert.doesNotHaveAnyKeys = function(obj, keys, msg) {
  new Assertion(obj, msg, assert.doesNotHaveAnyKeys, true).to.not.have.any.keys(keys);
};
assert.doesNotHaveAllKeys = function(obj, keys, msg) {
  new Assertion(obj, msg, assert.doesNotHaveAllKeys, true).to.not.have.all.keys(keys);
};
assert.hasAnyDeepKeys = function(obj, keys, msg) {
  new Assertion(obj, msg, assert.hasAnyDeepKeys, true).to.have.any.deep.keys(keys);
};
assert.hasAllDeepKeys = function(obj, keys, msg) {
  new Assertion(obj, msg, assert.hasAllDeepKeys, true).to.have.all.deep.keys(keys);
};
assert.containsAllDeepKeys = function(obj, keys, msg) {
  new Assertion(obj, msg, assert.containsAllDeepKeys, true).to.contain.all.deep.keys(keys);
};
assert.doesNotHaveAnyDeepKeys = function(obj, keys, msg) {
  new Assertion(obj, msg, assert.doesNotHaveAnyDeepKeys, true).to.not.have.any.deep.keys(keys);
};
assert.doesNotHaveAllDeepKeys = function(obj, keys, msg) {
  new Assertion(obj, msg, assert.doesNotHaveAllDeepKeys, true).to.not.have.all.deep.keys(keys);
};
assert.throws = function(fn, errorLike, errMsgMatcher, msg) {
  if ("string" === typeof errorLike || errorLike instanceof RegExp) {
    errMsgMatcher = errorLike;
    errorLike = null;
  }
  var assertErr = new Assertion(fn, msg, assert.throws, true).to.throw(errorLike, errMsgMatcher);
  return flag(assertErr, "object");
};
assert.doesNotThrow = function(fn, errorLike, errMsgMatcher, message) {
  if ("string" === typeof errorLike || errorLike instanceof RegExp) {
    errMsgMatcher = errorLike;
    errorLike = null;
  }
  new Assertion(fn, message, assert.doesNotThrow, true).to.not.throw(errorLike, errMsgMatcher);
};
assert.operator = function(val, operator, val2, msg) {
  var ok;
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
  var test2 = new Assertion(ok, msg, assert.operator, true);
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
  new Assertion(act, msg, assert.approximately, true).to.be.approximately(exp, delta);
};
assert.sameMembers = function(set1, set2, msg) {
  new Assertion(set1, msg, assert.sameMembers, true).to.have.same.members(set2);
};
assert.notSameMembers = function(set1, set2, msg) {
  new Assertion(set1, msg, assert.notSameMembers, true).to.not.have.same.members(set2);
};
assert.sameDeepMembers = function(set1, set2, msg) {
  new Assertion(set1, msg, assert.sameDeepMembers, true).to.have.same.deep.members(set2);
};
assert.notSameDeepMembers = function(set1, set2, msg) {
  new Assertion(set1, msg, assert.notSameDeepMembers, true).to.not.have.same.deep.members(set2);
};
assert.sameOrderedMembers = function(set1, set2, msg) {
  new Assertion(set1, msg, assert.sameOrderedMembers, true).to.have.same.ordered.members(set2);
};
assert.notSameOrderedMembers = function(set1, set2, msg) {
  new Assertion(set1, msg, assert.notSameOrderedMembers, true).to.not.have.same.ordered.members(set2);
};
assert.sameDeepOrderedMembers = function(set1, set2, msg) {
  new Assertion(set1, msg, assert.sameDeepOrderedMembers, true).to.have.same.deep.ordered.members(set2);
};
assert.notSameDeepOrderedMembers = function(set1, set2, msg) {
  new Assertion(set1, msg, assert.notSameDeepOrderedMembers, true).to.not.have.same.deep.ordered.members(set2);
};
assert.includeMembers = function(superset, subset, msg) {
  new Assertion(superset, msg, assert.includeMembers, true).to.include.members(subset);
};
assert.notIncludeMembers = function(superset, subset, msg) {
  new Assertion(superset, msg, assert.notIncludeMembers, true).to.not.include.members(subset);
};
assert.includeDeepMembers = function(superset, subset, msg) {
  new Assertion(superset, msg, assert.includeDeepMembers, true).to.include.deep.members(subset);
};
assert.notIncludeDeepMembers = function(superset, subset, msg) {
  new Assertion(superset, msg, assert.notIncludeDeepMembers, true).to.not.include.deep.members(subset);
};
assert.includeOrderedMembers = function(superset, subset, msg) {
  new Assertion(superset, msg, assert.includeOrderedMembers, true).to.include.ordered.members(subset);
};
assert.notIncludeOrderedMembers = function(superset, subset, msg) {
  new Assertion(superset, msg, assert.notIncludeOrderedMembers, true).to.not.include.ordered.members(subset);
};
assert.includeDeepOrderedMembers = function(superset, subset, msg) {
  new Assertion(superset, msg, assert.includeDeepOrderedMembers, true).to.include.deep.ordered.members(subset);
};
assert.notIncludeDeepOrderedMembers = function(superset, subset, msg) {
  new Assertion(superset, msg, assert.notIncludeDeepOrderedMembers, true).to.not.include.deep.ordered.members(subset);
};
assert.oneOf = function(inList, list, msg) {
  new Assertion(inList, msg, assert.oneOf, true).to.be.oneOf(list);
};
assert.isIterable = function(obj, msg) {
  if (obj == void 0 || !obj[Symbol.iterator]) {
    msg = msg ? `${msg} expected ${inspect2(obj)} to be an iterable` : `expected ${inspect2(obj)} to be an iterable`;
    throw new AssertionError(
      msg,
      void 0,
      assert.isIterable
    );
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
    var tmpMsg = delta;
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
  return new Assertion(fn, msg, assert.doesNotChange, true).to.not.change(obj, prop);
};
assert.changesButNotBy = function(fn, obj, prop, delta, msg) {
  if (arguments.length === 4 && typeof obj === "function") {
    var tmpMsg = delta;
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
    var tmpMsg = delta;
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
  return new Assertion(fn, msg, assert.doesNotIncrease, true).to.not.increase(obj, prop);
};
assert.increasesButNotBy = function(fn, obj, prop, delta, msg) {
  if (arguments.length === 4 && typeof obj === "function") {
    var tmpMsg = delta;
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
    var tmpMsg = delta;
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
  return new Assertion(fn, msg, assert.doesNotDecrease, true).to.not.decrease(obj, prop);
};
assert.doesNotDecreaseBy = function(fn, obj, prop, delta, msg) {
  if (arguments.length === 4 && typeof obj === "function") {
    var tmpMsg = delta;
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
    var tmpMsg = delta;
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
(/* @__PURE__ */ __name(function alias(name, as) {
  assert[as] = assert[name];
  return alias;
}, "alias"))("isOk", "ok")("isNotOk", "notOk")("throws", "throw")("throws", "Throw")("isExtensible", "extensible")("isNotExtensible", "notExtensible")("isSealed", "sealed")("isNotSealed", "notSealed")("isFrozen", "frozen")("isNotFrozen", "notFrozen")("isEmpty", "empty")("isNotEmpty", "notEmpty")("isCallable", "isFunction")("isNotCallable", "isNotFunction");
var used = [];
function use(fn) {
  const exports = {
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

// src/constants.ts
var IS_BROWSER = typeof window !== "undefined" && typeof window.document !== "undefined";
var HAS_PASSIVE_EVENTS = (() => {
  let isPassiveEventsSupported = false;
  try {
    const passiveOpts = Object.defineProperty({}, "passive", {
      get: function() {
        isPassiveEventsSupported = true;
      }
    });
    window.addEventListener("testPassive", null, passiveOpts);
    window.removeEventListener("testPassive", null, passiveOpts);
  } catch (e) {
  }
  return isPassiveEventsSupported;
})();
var HAS_TOUCH_EVENTS = IS_BROWSER && "ontouchstart" in window;
var HAS_POINTER_EVENTS = IS_BROWSER && !!window.PointerEvent;
var IS_SAFARI = !!(IS_BROWSER && navigator.vendor && navigator.vendor.indexOf("Apple") > -1 && navigator.userAgent && navigator.userAgent.indexOf("CriOS") == -1 && navigator.userAgent.indexOf("FxiOS") == -1);

// src/utils/parse-listener-options.ts
function parseListenerOptions(options = {}) {
  const { capture = true, passive = true } = options;
  if (HAS_PASSIVE_EVENTS) {
    return { capture, passive };
  } else {
    return { capture };
  }
}

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
  constructor(element, options = {}) {
    const {
      listenerOptions = {},
      sourceEvents = "auto",
      startPredicate = (e) => "button" in e && e.button > 0 ? false : true
    } = options;
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
    const { move, end, cancel } = SOURCE_EVENTS[this._sourceEvents];
    window.addEventListener(move, this._onMove, this._listenerOptions);
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
      const { move, end, cancel } = SOURCE_EVENTS[this._sourceEvents];
      window.removeEventListener(move, this._onMove, this._listenerOptions);
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
  updateSettings(options) {
    if (this.isDestroyed) return;
    const { listenerOptions, sourceEvents, startPredicate } = options;
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
  constructor(element, options = {}) {
    super();
    const {
      moveDistance = keyboardSensorDefaults.moveDistance,
      cancelOnBlur = keyboardSensorDefaults.cancelOnBlur,
      cancelOnVisibilityChange = keyboardSensorDefaults.cancelOnVisibilityChange,
      startPredicate = keyboardSensorDefaults.startPredicate,
      movePredicate = keyboardSensorDefaults.movePredicate,
      cancelPredicate = keyboardSensorDefaults.cancelPredicate,
      endPredicate = keyboardSensorDefaults.endPredicate
    } = options;
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
  updateSettings(options = {}) {
    const {
      moveDistance,
      cancelOnBlur,
      cancelOnVisibilityChange,
      startPredicate,
      movePredicate,
      cancelPredicate,
      endPredicate
    } = options;
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
    this.cache = /* @__PURE__ */ new Map();
    this.validation = /* @__PURE__ */ new Map();
    this.cache = /* @__PURE__ */ new Map();
    this.validation = /* @__PURE__ */ new Map();
  }
  set(key, value) {
    this.cache.set(key, value);
    this.validation.set(key, void 0);
  }
  get(key) {
    return this.cache.get(key);
  }
  has(key) {
    return this.cache.has(key);
  }
  delete(key) {
    this.cache.delete(key);
    this.validation.delete(key);
  }
  isValid(key) {
    return this.validation.has(key);
  }
  invalidate(key) {
    if (key === void 0) {
      this.validation.clear();
    } else {
      this.validation.delete(key);
    }
  }
  clear() {
    this.cache.clear();
    this.validation.clear();
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
var MATRIX = new DOMMatrix();
function getWorldTransformMatrix(el, result = new DOMMatrix()) {
  let currentElement = el;
  resetMatrix(result);
  while (currentElement) {
    const { transform, transformOrigin } = getStyle(currentElement);
    if (transform && transform !== "none") {
      MATRIX.setMatrixValue(transform);
      if (!MATRIX.isIdentity) {
        const { x, y, z } = parseTransformOrigin(transformOrigin);
        if (z === 0) {
          MATRIX.setMatrixValue(
            `translate(${x}px, ${y}px) ${MATRIX} translate(${x * -1}px, ${y * -1}px)`
          );
        } else {
          MATRIX.setMatrixValue(
            `translate3d(${x}px, ${y}px, ${z}px) ${MATRIX} translate3d(${x * -1}px, ${y * -1}px, ${z * -1}px)`
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
var MEASURE_ELEMENT = createMeasureElement();
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
    this.data = {};
    this.element = element;
    this.elementTransformOrigin = parseTransformOrigin(style.transformOrigin);
    this.elementTransformMatrix = new DOMMatrix().setMatrixValue(style.transform);
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
var SCROLL_LISTENER_OPTIONS = HAS_PASSIVE_EVENTS ? { capture: true, passive: true } : true;
var POSITION_CHANGE = { x: 0, y: 0 };
var ELEMENT_MATRIX = new DOMMatrix();
var TEMP_MATRIX = new DOMMatrix();
var DraggableModifierPhase = {
  Start: "start",
  Move: "move",
  End: "end"
};
var DraggableApplyPositionPhase = {
  Start: "start",
  Move: "move",
  End: "end",
  Align: "align"
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
    const isEndPhase = phase === "end";
    const [containerMatrix, inverseContainerMatrix] = item.getContainerMatrix();
    const [_dragContainerMatrix, inverseDragContainerMatrix] = item.getDragContainerMatrix();
    const {
      position,
      alignmentOffset,
      containerOffset,
      elementTransformMatrix,
      elementTransformOrigin
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
    item.element.style.transform = `${ELEMENT_MATRIX}`;
  },
  positionModifiers: []
};
var Draggable = class {
  constructor(sensors, options = {}) {
    this.sensors = sensors;
    this.settings = this._parseSettings(options);
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
  _parseSettings(options, defaults = DraggableDefaultSettings) {
    const {
      container = defaults.container,
      startPredicate = defaults.startPredicate,
      elements = defaults.elements,
      frozenStyles = defaults.frozenStyles,
      positionModifiers = defaults.positionModifiers,
      applyPosition = defaults.applyPosition,
      onPrepareStart = defaults.onPrepareStart,
      onStart = defaults.onStart,
      onPrepareMove = defaults.onPrepareMove,
      onMove = defaults.onMove,
      onEnd = defaults.onEnd,
      onDestroy = defaults.onDestroy
    } = options || {};
    return {
      container,
      startPredicate,
      elements,
      frozenStyles,
      positionModifiers,
      applyPosition,
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
    this._startPhase = 2 /* StartPrepare */;
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
  }
  _applyStart() {
    const drag = this.drag;
    if (!drag) return;
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
          phase: DraggableApplyPositionPhase.Align,
          draggable: this,
          drag,
          item
        });
      }
    }
    window.addEventListener("scroll", this._onScroll, SCROLL_LISTENER_OPTIONS);
    this._startPhase = 3 /* FinishApply */;
    this._emit(DraggableEventType.Start, drag.startEvent);
    this.settings.onStart?.(drag, this);
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
    this.settings.onPrepareMove?.(drag, this);
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
    if (this._startPhase === 2 /* StartPrepare */) {
      this.off(DraggableEventType.Start, this._startId);
      this.on(DraggableEventType.Start, () => this.stop(), this._startId);
      return;
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
    drag["_clientOffsetCache"].clear();
    for (const item of drag.items) {
      if (item.elementContainer !== item.dragContainer) {
        const { x: startX, y: startY } = item.containerOffset;
        item["_updateContainerOffset"]();
        const { x: endX, y: endY } = item.containerOffset;
        item.alignmentOffset.x = startX - endX;
        item.alignmentOffset.y = startY - endY;
        item.containerOffset.x = 0;
        item.containerOffset.y = 0;
      }
    }
    this._applyModifiers(DraggableModifierPhase.End, 0, 0);
    for (const item of drag.items) {
      if (item.elementContainer !== item.dragContainer) {
        appendElement(item.element, item.elementContainer);
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
  updateSettings(options = {}) {
    this.settings = this._parseSettings(options, this.settings);
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

// src/pool.ts
var Pool = class {
  constructor(createObject, onPut) {
    this._data = [];
    this._createObject = createObject;
    this._onPut = onPut;
  }
  pick() {
    return this._data.length ? this._data.pop() : this._createObject();
  }
  put(object) {
    if (this._data.indexOf(object) === -1) {
      this._onPut && this._onPut(object);
      this._data.push(object);
    }
  }
  reset() {
    this._data.length = 0;
  }
};

// src/utils/get-distance.ts
import { getDistance as _getDistance } from "mezr";
var RECT_A = createFullRect();
var RECT_B = createFullRect();
function getDistance(a, b) {
  return _getDistance(createFullRect(a, RECT_A), createFullRect(b, RECT_B));
}

// src/utils/get-intersection.ts
function getIntersection(a, b, result = { width: 0, height: 0, x: 0, y: 0 }) {
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

// src/utils/get-intersection-area.ts
function getIntersectionArea(a, b) {
  const intersection = getIntersection(a, b);
  return intersection ? intersection.width * intersection.height : 0;
}

// src/utils/get-intersection-score.ts
function getIntersectionScore(a, b) {
  const area = getIntersectionArea(a, b);
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
var TEMP_RECT = {
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
  constructor(options = {}) {
    const { overlapCheckInterval = 150 } = options;
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
    this._requestPool = new Pool(
      () => new AutoScrollRequest(),
      (request) => request.reset()
    );
    this._actionPool = new Pool(
      () => new AutoScrollAction(),
      (action) => action.reset()
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
      request = this._requestPool.pick();
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
    this._requestPool.put(request);
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
        if (target.padding && isIntersecting(clientRect, getPaddedRect(testRect, target.padding, TEMP_RECT))) {
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
        if (!(padding && isIntersecting(clientRect, getPaddedRect(testRect, padding, TEMP_RECT)))) {
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
    if (!action) action = this._actionPool.pick();
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
      this._actionPool.put(this._actions[i]);
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
  updateSettings(options = {}) {
    const { overlapCheckInterval = this.settings.overlapCheckInterval } = options;
    this.settings.overlapCheckInterval = overlapCheckInterval;
  }
  destroy() {
    if (this._isDestroyed) return;
    const items = this.items.slice(0);
    let i = 0;
    for (; i < items.length; i++) {
      this.removeItem(items[i]);
    }
    this._actions.length = 0;
    this._requestPool.reset();
    this._actionPool.reset();
    this._isDestroyed = true;
  }
};

// src/singletons/auto-scroll.ts
var autoScroll = new AutoScroll();

// tests/src/BaseSensor.ts
describe("BaseSensor", () => {
  describe("drag property", () => {
    it(`should be null on init`, function() {
      const s = new BaseSensor();
      assert.equal(s.drag, null);
      s.destroy();
    });
  });
  describe("isDestroyed property", () => {
    it(`should be false on init`, function() {
      const s = new BaseSensor();
      assert.equal(s.isDestroyed, false);
      s.destroy();
    });
    it(`should be true after destroy method is called`, function() {
      const s = new BaseSensor();
      s.destroy();
      assert.equal(s.isDestroyed, true);
    });
  });
  describe("_start method", () => {
    it(`should create drag data`, function() {
      const s = new BaseSensor();
      s["_start"]({ type: "start", x: 1, y: 2 });
      assert.deepEqual(s.drag, { x: 1, y: 2 });
      s.destroy();
    });
    it(`should not modify isDestroyed property`, function() {
      const s = new BaseSensor();
      assert.equal(s.isDestroyed, false);
      s["_start"]({ type: "start", x: 1, y: 2 });
      assert.equal(s.isDestroyed, false);
      s.destroy();
    });
    it(`should emit "start" event with correct arguments after updating instance properties`, function() {
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
    it(`should not do anything if drag is already active`, function() {
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
    it(`should not do anything if instance is destroyed (isDestroyed is true)`, function() {
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
  describe("_move method", () => {
    it(`should update drag data to reflect the provided coordinates`, function() {
      const s = new BaseSensor();
      s["_start"]({ type: "start", x: 1, y: 2 });
      s["_move"]({ type: "move", x: 3, y: 4 });
      assert.deepEqual(s.drag, { x: 3, y: 4 });
      s.destroy();
    });
    it(`should not modify isDestroyed property`, function() {
      const s = new BaseSensor();
      s["_start"]({ type: "start", x: 1, y: 2 });
      assert.equal(s.isDestroyed, false);
      s["_move"]({ type: "move", x: 3, y: 4 });
      assert.equal(s.isDestroyed, false);
      s.destroy();
    });
    it(`should emit "move" event with correct arguments after updating instance properties`, function() {
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
    it(`should not do anything if drag is not active`, function() {
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
  describe("_cancel method", () => {
    it(`should reset drag data`, function() {
      const s = new BaseSensor();
      s["_start"]({ type: "start", x: 1, y: 2 });
      s["_cancel"]({ type: "cancel", x: 5, y: 6 });
      assert.equal(s.drag, null);
      s.destroy();
    });
    it(`should not modify isDestroyed property`, function() {
      const s = new BaseSensor();
      s["_start"]({ type: "start", x: 1, y: 2 });
      assert.equal(s.isDestroyed, false);
      s["_cancel"]({ type: "cancel", x: 5, y: 6 });
      assert.equal(s.isDestroyed, false);
      s.destroy();
    });
    it(`should emit "cancel" event with correct arguments after updating instance properties`, function() {
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
    it(`should not do anything if drag is not active`, function() {
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
  describe("_end method", () => {
    it(`should reset drag data`, function() {
      const s = new BaseSensor();
      s["_start"]({ type: "start", x: 1, y: 2 });
      s["_end"]({ type: "end", x: 5, y: 6 });
      assert.equal(s.drag, null);
      s.destroy();
    });
    it(`should not modify isDestroyed property`, function() {
      const s = new BaseSensor();
      s["_start"]({ type: "start", x: 1, y: 2 });
      assert.equal(s.isDestroyed, false);
      s["_end"]({ type: "end", x: 5, y: 6 });
      assert.equal(s.isDestroyed, false);
      s.destroy();
    });
    it(`should emit "end" event with correct arguments after updating instance properties`, function() {
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
    it(`should not do anything if drag is not active`, function() {
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
  describe("cancel method", () => {
    it(`should reset drag data`, function() {
      const s = new BaseSensor();
      s["_start"]({ type: "start", x: 1, y: 2 });
      s.cancel();
      assert.equal(s.drag, null);
      s.destroy();
    });
    it(`should not modify isDestroyed property`, function() {
      const s = new BaseSensor();
      s["_start"]({ type: "start", x: 1, y: 2 });
      assert.equal(s.isDestroyed, false);
      s.cancel();
      assert.equal(s.isDestroyed, false);
      s.destroy();
    });
    it(`should emit "cancel" event with correct arguments after updating instance properties`, function() {
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
    it(`should not do anything if drag is not active`, function() {
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
  describe("on method", () => {
    it("should return a unique symbol by default", () => {
      const s = new BaseSensor();
      const idA = s.on("start", () => {
      });
      const idB = s.on("start", () => {
      });
      assert.equal(typeof idA, "symbol");
      assert.notEqual(idA, idB);
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
    });
    it("should remove the existing listener and add the new one if the same id is used", () => {
      const s = new BaseSensor();
      let msg = "";
      s.on("start", () => void (msg += "a"), 1);
      s.on("start", () => void (msg += "b"), 2);
      s.on("start", () => void (msg += "c"), 1);
      s["_start"]({ type: "start", x: 1, y: 2 });
      assert.equal(msg, "bc");
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
    });
  });
  describe("off method", () => {
    it("should remove an event listener based on id", () => {
      const s = new BaseSensor();
      let msg = "";
      const idA = s.on("start", () => void (msg += "a"));
      s.on("start", () => void (msg += "b"));
      s.off("start", idA);
      s["_start"]({ type: "start", x: 1, y: 2 });
      assert.equal(msg, "b");
    });
  });
  describe("destroy method", () => {
    it(`should (if drag is active):
          1. set isDestroyed property to true
          2. emit "cancel" event with the current x/y coordinates
          3. reset drag data
          4. emit "destroy" event
          5. remove all listeners from the internal emitter
       `, function() {
      const s = new BaseSensor();
      const startArgs = { type: "start", x: 1, y: 2 };
      let events = [];
      s["_start"](startArgs);
      s.on("start", (data) => void events.push(data.type));
      s.on("move", (data) => void events.push(data.type));
      s.on("end", (data) => void events.push(data.type));
      s.on("cancel", (data) => {
        assert.deepEqual(s.drag, { x: startArgs.x, y: startArgs.y });
        assert.equal(s.isDestroyed, true);
        assert.deepEqual(data, {
          type: "cancel",
          x: startArgs.x,
          y: startArgs.y
        });
        events.push(data.type);
      });
      s.on("destroy", (data) => {
        assert.equal(s.drag, null);
        assert.equal(s.isDestroyed, true);
        assert.deepEqual(data, {
          type: "destroy"
        });
        events.push(data.type);
      });
      assert.equal(s["_emitter"].listenerCount(), 5);
      s.destroy();
      assert.equal(s.drag, null);
      assert.equal(s.isDestroyed, true);
      assert.deepEqual(events, ["cancel", "destroy"]);
      assert.equal(s["_emitter"].listenerCount(), 0);
    });
    it(`should (if drag is not active):
          1. set isDestroyed property to true
          2. emit "destroy" event
          3. remove all listeners from the internal emitter
       `, function() {
      const s = new BaseSensor();
      let events = [];
      s.on("start", (data) => void events.push(data.type));
      s.on("move", (data) => void events.push(data.type));
      s.on("end", (data) => void events.push(data.type));
      s.on("cancel", (data) => void events.push(data.type));
      s.on("destroy", (data) => {
        assert.equal(s.drag, null);
        assert.equal(s.isDestroyed, true);
        assert.deepEqual(data, {
          type: "destroy"
        });
        events.push(data.type);
      });
      assert.equal(s["_emitter"].listenerCount(), 5);
      s.destroy();
      assert.equal(s.drag, null);
      assert.equal(s.isDestroyed, true);
      assert.deepEqual(events, ["destroy"]);
      assert.equal(s["_emitter"].listenerCount(), 0);
    });
    it("should not do anything if the sensor is already destroyed", () => {
      const s = new BaseSensor();
      s.destroy();
      let events = [];
      s.on("start", (data) => void events.push(data.type));
      s.on("move", (data) => void events.push(data.type));
      s.on("end", (data) => void events.push(data.type));
      s.on("cancel", (data) => void events.push(data.type));
      s.on("destroy", (data) => void events.push(data.type));
      s.destroy();
      assert.equal(s.drag, null);
      assert.equal(s.isDestroyed, true);
      assert.deepEqual(events, []);
    });
  });
});

// tests/src/utils/FakeTouch.ts
var FakeTouch = class {
  constructor(options = {}) {
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
    } = options;
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
  constructor(type3, options = {}) {
    const {
      altKey = false,
      ctrlKey = false,
      metaKey = false,
      shiftKey = false,
      touches = [],
      targetTouches = [],
      changedTouches = [],
      ...parentOptions
    } = options;
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

// tests/src/utils/createFakeTouchEvent.ts
function createFakeTouchEvent(type3, options = {}) {
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
  } = options;
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

// tests/src/utils/createFakeDrag.ts
var idCounter = 100;
async function createFakeDrag(steps, options) {
  const {
    eventType = "mouse",
    stepDuration = 16,
    extraSteps = 0,
    cancelAtEnd = false,
    pointerId = ++idCounter,
    pointerType = "touch",
    onAfterStep
  } = options;
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

// tests/src/utils/createTestElement.ts
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

// tests/src/utils/focusElement.ts
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

// tests/src/utils/wait.ts
function wait(time) {
  return new Promise((resolve) => {
    window.setTimeout(() => {
      resolve(void 0);
    }, time);
  });
}

// tests/src/Draggable.ts
describe("Draggable", () => {
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
    await wait(100);
    rect = el.getBoundingClientRect();
    assert.equal(rect.x, 1);
    assert.equal(rect.y, 0);
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
    await wait(100);
    assert.equal(draggable.drag, null);
    await wait(100);
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
    await wait(100);
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
      transform: "scale(1.2) translate(-5px, -6px) rotate(33deg) skew(31deg, 43deg)",
      transformOrigin: "21px 22px"
    });
    const container = createTestElement({
      transform: "scale(0.5) translate(3px, 4px) rotate(77deg) skew(11deg, 22deg)",
      transformOrigin: "12px 13px"
    });
    const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
    const draggable = new Draggable([keyboardSensor], { elements: () => [el] });
    container.appendChild(el);
    const startRect = el.getBoundingClientRect();
    focusElement(el);
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
    await wait(100);
    const endRect = el.getBoundingClientRect();
    assert.equal(Math.round((endRect.x - startRect.x) * 1e3) / 1e3, 1, "x");
    assert.equal(Math.round((endRect.y - startRect.y) * 1e3) / 1e3, 1, "y");
    draggable.destroy();
    keyboardSensor.destroy();
    el.remove();
    container.remove();
  });
  describe("options", () => {
    describe("container", () => {
      it("should define the drag container", async () => {
        const container = createTestElement();
        const el = createTestElement();
        const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
        const draggable = new Draggable([keyboardSensor], { container, elements: () => [el] });
        const originalContainer = el.parentNode;
        focusElement(el);
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
        await wait(100);
        assert.notEqual(draggable.drag, null);
        assert.ok(container.contains(el));
        assert.equal(el.parentElement, container);
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
        await wait(100);
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
            await wait(100);
            assert.ok(container.contains(el), "3: " + assertMsg);
            let rect = el.getBoundingClientRect();
            assert.equal(rect.x, elRect.x, "4: " + assertMsg);
            assert.equal(rect.y, elRect.y, "5: " + assertMsg);
            document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
            await wait(100);
            rect = el.getBoundingClientRect();
            assert.equal(rect.x, elRect.x + 1, "6: " + assertMsg);
            assert.equal(rect.y, elRect.y, "7: " + assertMsg);
            document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
            await wait(100);
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
        const container = createTestElement({
          transform: "scale(0.5) translate(3px, 4px) rotate(77deg) skew(11deg, 22deg)",
          transformOrigin: "12px 13px"
        });
        const dragContainer = createTestElement({
          transform: "scale(0.75) translate(-30px, 79px) rotate(31deg) skew(3deg, 4deg)",
          transformOrigin: "120px 130px"
        });
        const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
        const draggable = new Draggable([keyboardSensor], {
          elements: () => [el],
          container: dragContainer
        });
        container.appendChild(el);
        const startRect = el.getBoundingClientRect();
        focusElement(el);
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
        await wait(100);
        const endRect = el.getBoundingClientRect();
        assert.equal(Math.round((endRect.x - startRect.x) * 1e3) / 1e3, 1, "x");
        assert.equal(Math.round((endRect.y - startRect.y) * 1e3) / 1e3, 1, "y");
        draggable.destroy();
        keyboardSensor.destroy();
        el.remove();
        container.remove();
        dragContainer.remove();
      });
    });
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
        await wait(100);
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
  });
  describe("events", () => {
    describe("preparestart", () => {
    });
    describe("start", () => {
    });
    describe("preparemove", () => {
    });
    describe("move", () => {
    });
    describe("end", () => {
    });
    describe("destroy", () => {
    });
  });
});

// tests/src/utils/defaultPageStyles.ts
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

// tests/src/PointerSensor.ts
describe("PointerSensor", () => {
  beforeEach(() => {
    addDefaultPageStyles(document);
    return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });
  afterEach(() => {
    removeDefaultPageStyles(document);
    return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });
  describe("drag property", () => {
    it(`should be null on init`, function() {
      const s = new PointerSensor(document.body);
      assert.equal(s.drag, null);
      s.destroy();
    });
  });
  describe("isDestroyed property", () => {
    it(`should be false on init`, function() {
      const s = new PointerSensor(document.body);
      assert.equal(s.isDestroyed, false);
      s.destroy();
    });
  });
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
  describe("sourceEvents option", () => {
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
  describe("startPredicate option", () => {
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
  describe("updateSettings method", () => {
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
  describe("start event", () => {
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
  describe("move event", () => {
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
  describe("end event", () => {
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
  describe("cancel event", () => {
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
});

// tests/src/utils/blurElement.ts
function blurElement(element) {
  if (element === document.activeElement) {
    element.blur();
    element.dispatchEvent(new FocusEvent("blur"));
  }
}

// tests/src/KeyboardSensor.ts
describe("KeyboardSensor", () => {
  beforeEach(() => {
    addDefaultPageStyles(document);
    return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });
  afterEach(() => {
    removeDefaultPageStyles(document);
    return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });
  describe("settings", () => {
    describe("moveDistance", () => {
      it("should define the drag movement distance", () => {
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
    });
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
  });
  describe("properties", () => {
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
    });
  });
  describe("events", () => {
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
    });
  });
  describe("methods", () => {
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
      });
    });
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
  });
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
