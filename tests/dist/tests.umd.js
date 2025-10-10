(function(factory) {
  
  typeof define === 'function' && define.amd ? define([], factory) :
  factory();
})(function() {

//#region node_modules/chai/index.js
var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", {
	value,
	configurable: true
});
var __export = (target, all) => {
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
};
var utils_exports = {};
__export(utils_exports, {
	addChainableMethod: () => addChainableMethod,
	addLengthGuard: () => addLengthGuard,
	addMethod: () => addMethod,
	addProperty: () => addProperty,
	checkError: () => check_error_exports,
	compareByInspect: () => compareByInspect,
	eql: () => deep_eql_default,
	events: () => events$4,
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
	if (isErrorInstance(errorLike)) return thrown.constructor === errorLike.constructor || thrown instanceof errorLike.constructor;
	else if ((typeof errorLike === "object" || typeof errorLike === "function") && errorLike.prototype) return thrown.constructor === errorLike || thrown instanceof errorLike;
	return false;
}
__name(compatibleConstructor, "compatibleConstructor");
function compatibleMessage(thrown, errMatcher) {
	const comparisonString = typeof thrown === "string" ? thrown : thrown.message;
	if (isRegExp(errMatcher)) return errMatcher.test(comparisonString);
	else if (typeof errMatcher === "string") return comparisonString.indexOf(errMatcher) !== -1;
	return false;
}
__name(compatibleMessage, "compatibleMessage");
function getConstructorName(errorLike) {
	let constructorName = errorLike;
	if (isErrorInstance(errorLike)) constructorName = errorLike.constructor.name;
	else if (typeof errorLike === "function") {
		constructorName = errorLike.name;
		if (constructorName === "") constructorName = new errorLike().name || constructorName;
	}
	return constructorName;
}
__name(getConstructorName, "getConstructorName");
function getMessage(errorLike) {
	let msg = "";
	if (errorLike && errorLike.message) msg = errorLike.message;
	else if (typeof errorLike === "string") msg = errorLike;
	return msg;
}
__name(getMessage, "getMessage");
function flag(obj, key, value) {
	let flags = obj.__flags || (obj.__flags = /* @__PURE__ */ Object.create(null));
	if (arguments.length === 3) flags[key] = value;
	else return flags[key];
}
__name(flag, "flag");
function test(obj, args) {
	let negate = flag(obj, "negate"), expr = args[0];
	return negate ? !expr : expr;
}
__name(test, "test");
function type(obj) {
	if (typeof obj === "undefined") return "undefined";
	if (obj === null) return "null";
	const stringTag = obj[Symbol.toStringTag];
	if (typeof stringTag === "string") return stringTag;
	return Object.prototype.toString.call(obj).slice(8, -1);
}
__name(type, "type");
var canElideFrames = "captureStackTrace" in Error;
var AssertionError = class _AssertionError extends Error {
	static {
		__name(this, "AssertionError");
	}
	message;
	get name() {
		return "AssertionError";
	}
	get ok() {
		return false;
	}
	constructor(message = "Unspecified AssertionError", props, ssf) {
		super(message);
		this.message = message;
		if (canElideFrames) Error.captureStackTrace(this, ssf || _AssertionError);
		for (const key in props) if (!(key in this)) this[key] = props[key];
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
};
function expectTypes(obj, types) {
	let flagMsg = flag(obj, "message");
	let ssfi = flag(obj, "ssfi");
	flagMsg = flagMsg ? flagMsg + ": " : "";
	obj = flag(obj, "object");
	types = types.map(function(t$6) {
		return t$6.toLowerCase();
	});
	types.sort();
	let str = types.map(function(t$6, index) {
		let art = ~[
			"a",
			"e",
			"i",
			"o",
			"u"
		].indexOf(t$6.charAt(0)) ? "an" : "a";
		return (types.length > 1 && index === types.length - 1 ? "or " : "") + art + " " + t$6;
	}).join(", ");
	let objType = type(obj).toLowerCase();
	if (!types.some(function(expected) {
		return objType === expected;
	})) throw new AssertionError(flagMsg + "object tested must be " + str + ", but " + objType + " given", void 0, ssfi);
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
	inverse: ["7", "27"],
	hidden: ["8", "28"],
	strike: ["9", "29"],
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
var truncator = "…";
function colorise(value, styleType) {
	const color = ansiColors[styles[styleType]] || ansiColors[styleType] || "";
	if (!color) return String(value);
	return `\x1B[${color[0]}m${String(value)}\x1B[${color[1]}m`;
}
__name(colorise, "colorise");
function normaliseOptions({ showHidden = false, depth = 2, colors = false, customInspect = true, showProxy = false, maxArrayLength = Infinity, breakLength = Infinity, seen = [], truncate: truncate2 = Infinity, stylize = String } = {}, inspect3) {
	const options$3 = {
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
	if (options$3.colors) options$3.stylize = colorise;
	return options$3;
}
__name(normaliseOptions, "normaliseOptions");
function isHighSurrogate(char) {
	return char >= "\ud800" && char <= "\udbff";
}
__name(isHighSurrogate, "isHighSurrogate");
function truncate(string, length, tail = truncator) {
	string = String(string);
	const tailLength = tail.length;
	const stringLength = string.length;
	if (tailLength > length && stringLength > tailLength) return tail;
	if (stringLength > length && stringLength > tailLength) {
		let end = length - tailLength;
		if (end > 0 && isHighSurrogate(string[end - 1])) end = end - 1;
		return `${string.slice(0, end)}${tail}`;
	}
	return string;
}
__name(truncate, "truncate");
function inspectList(list, options$3, inspectItem, separator = ", ") {
	inspectItem = inspectItem || options$3.inspect;
	const size = list.length;
	if (size === 0) return "";
	const originalLength = options$3.truncate;
	let output = "";
	let peek = "";
	let truncated = "";
	for (let i$2 = 0; i$2 < size; i$2 += 1) {
		const last = i$2 + 1 === list.length;
		const secondToLast = i$2 + 2 === list.length;
		truncated = `${truncator}(${list.length - i$2})`;
		const value = list[i$2];
		options$3.truncate = originalLength - output.length - (last ? 0 : separator.length);
		const string = peek || inspectItem(value, options$3) + (last ? "" : separator);
		const nextLength = output.length + string.length;
		const truncatedLength = nextLength + truncated.length;
		if (last && nextLength > originalLength && output.length + truncated.length <= originalLength) break;
		if (!last && !secondToLast && truncatedLength > originalLength) break;
		peek = last ? "" : inspectItem(list[i$2 + 1], options$3) + (secondToLast ? "" : separator);
		if (!last && secondToLast && truncatedLength > originalLength && nextLength + peek.length > originalLength) break;
		output += string;
		if (!last && !secondToLast && nextLength + peek.length >= originalLength) {
			truncated = `${truncator}(${list.length - i$2 - 1})`;
			break;
		}
		truncated = "";
	}
	return `${output}${truncated}`;
}
__name(inspectList, "inspectList");
function quoteComplexKey(key) {
	if (key.match(/^[a-zA-Z_][a-zA-Z_0-9]*$/)) return key;
	return JSON.stringify(key).replace(/'/g, "\\'").replace(/\\"/g, "\"").replace(/(^"|"$)/g, "'");
}
__name(quoteComplexKey, "quoteComplexKey");
function inspectProperty([key, value], options$3) {
	options$3.truncate -= 2;
	if (typeof key === "string") key = quoteComplexKey(key);
	else if (typeof key !== "number") key = `[${options$3.inspect(key, options$3)}]`;
	options$3.truncate -= key.length;
	value = options$3.inspect(value, options$3);
	return `${key}: ${value}`;
}
__name(inspectProperty, "inspectProperty");
function inspectArray(array, options$3) {
	const nonIndexProperties = Object.keys(array).slice(array.length);
	if (!array.length && !nonIndexProperties.length) return "[]";
	options$3.truncate -= 4;
	const listContents = inspectList(array, options$3);
	options$3.truncate -= listContents.length;
	let propertyContents = "";
	if (nonIndexProperties.length) propertyContents = inspectList(nonIndexProperties.map((key) => [key, array[key]]), options$3, inspectProperty);
	return `[ ${listContents}${propertyContents ? `, ${propertyContents}` : ""} ]`;
}
__name(inspectArray, "inspectArray");
var getArrayName = /* @__PURE__ */ __name((array) => {
	if (typeof Buffer === "function" && array instanceof Buffer) return "Buffer";
	if (array[Symbol.toStringTag]) return array[Symbol.toStringTag];
	return array.constructor.name;
}, "getArrayName");
function inspectTypedArray(array, options$3) {
	const name = getArrayName(array);
	options$3.truncate -= name.length + 4;
	const nonIndexProperties = Object.keys(array).slice(array.length);
	if (!array.length && !nonIndexProperties.length) return `${name}[]`;
	let output = "";
	for (let i$2 = 0; i$2 < array.length; i$2++) {
		const string = `${options$3.stylize(truncate(array[i$2], options$3.truncate), "number")}${i$2 === array.length - 1 ? "" : ", "}`;
		options$3.truncate -= string.length;
		if (array[i$2] !== array.length && options$3.truncate <= 3) {
			output += `${truncator}(${array.length - array[i$2] + 1})`;
			break;
		}
		output += string;
	}
	let propertyContents = "";
	if (nonIndexProperties.length) propertyContents = inspectList(nonIndexProperties.map((key) => [key, array[key]]), options$3, inspectProperty);
	return `${name}[ ${output}${propertyContents ? `, ${propertyContents}` : ""} ]`;
}
__name(inspectTypedArray, "inspectTypedArray");
function inspectDate(dateObject, options$3) {
	const stringRepresentation = dateObject.toJSON();
	if (stringRepresentation === null) return "Invalid Date";
	const split = stringRepresentation.split("T");
	const date = split[0];
	return options$3.stylize(`${date}T${truncate(split[1], options$3.truncate - date.length - 1)}`, "date");
}
__name(inspectDate, "inspectDate");
function inspectFunction(func, options$3) {
	const functionType = func[Symbol.toStringTag] || "Function";
	const name = func.name;
	if (!name) return options$3.stylize(`[${functionType}]`, "special");
	return options$3.stylize(`[${functionType} ${truncate(name, options$3.truncate - 11)}]`, "special");
}
__name(inspectFunction, "inspectFunction");
function inspectMapEntry([key, value], options$3) {
	options$3.truncate -= 4;
	key = options$3.inspect(key, options$3);
	options$3.truncate -= key.length;
	value = options$3.inspect(value, options$3);
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
function inspectMap(map, options$3) {
	if (map.size === 0) return "Map{}";
	options$3.truncate -= 7;
	return `Map{ ${inspectList(mapToEntries(map), options$3, inspectMapEntry)} }`;
}
__name(inspectMap, "inspectMap");
var isNaN = Number.isNaN || ((i$2) => i$2 !== i$2);
function inspectNumber(number, options$3) {
	if (isNaN(number)) return options$3.stylize("NaN", "number");
	if (number === Infinity) return options$3.stylize("Infinity", "number");
	if (number === -Infinity) return options$3.stylize("-Infinity", "number");
	if (number === 0) return options$3.stylize(1 / number === Infinity ? "+0" : "-0", "number");
	return options$3.stylize(truncate(String(number), options$3.truncate), "number");
}
__name(inspectNumber, "inspectNumber");
function inspectBigInt(number, options$3) {
	let nums = truncate(number.toString(), options$3.truncate - 1);
	if (nums !== truncator) nums += "n";
	return options$3.stylize(nums, "bigint");
}
__name(inspectBigInt, "inspectBigInt");
function inspectRegExp(value, options$3) {
	const flags = value.toString().split("/")[2];
	const sourceLength = options$3.truncate - (2 + flags.length);
	const source = value.source;
	return options$3.stylize(`/${truncate(source, sourceLength)}/${flags}`, "regexp");
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
function inspectSet(set2, options$3) {
	if (set2.size === 0) return "Set{}";
	options$3.truncate -= 7;
	return `Set{ ${inspectList(arrayFromSet(set2), options$3)} }`;
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
function inspectString(string, options$3) {
	if (stringEscapeChars.test(string)) string = string.replace(stringEscapeChars, escape);
	return options$3.stylize(`'${truncate(string, options$3.truncate - 2)}'`, "string");
}
__name(inspectString, "inspectString");
function inspectSymbol(value) {
	if ("description" in Symbol.prototype) return value.description ? `Symbol(${value.description})` : "Symbol()";
	return value.toString();
}
__name(inspectSymbol, "inspectSymbol");
var promise_default = /* @__PURE__ */ __name(() => "Promise{…}", "getPromiseValue");
function inspectObject(object, options$3) {
	const properties$3 = Object.getOwnPropertyNames(object);
	const symbols = Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols(object) : [];
	if (properties$3.length === 0 && symbols.length === 0) return "{}";
	options$3.truncate -= 4;
	options$3.seen = options$3.seen || [];
	if (options$3.seen.includes(object)) return "[Circular]";
	options$3.seen.push(object);
	const propertyContents = inspectList(properties$3.map((key) => [key, object[key]]), options$3, inspectProperty);
	const symbolContents = inspectList(symbols.map((key) => [key, object[key]]), options$3, inspectProperty);
	options$3.seen.pop();
	let sep = "";
	if (propertyContents && symbolContents) sep = ", ";
	return `{ ${propertyContents}${sep}${symbolContents} }`;
}
__name(inspectObject, "inspectObject");
var toStringTag = typeof Symbol !== "undefined" && Symbol.toStringTag ? Symbol.toStringTag : false;
function inspectClass(value, options$3) {
	let name = "";
	if (toStringTag && toStringTag in value) name = value[toStringTag];
	name = name || value.constructor.name;
	if (!name || name === "_class") name = "<Anonymous Class>";
	options$3.truncate -= name.length;
	return `${name}${inspectObject(value, options$3)}`;
}
__name(inspectClass, "inspectClass");
function inspectArguments(args, options$3) {
	if (args.length === 0) return "Arguments[]";
	options$3.truncate -= 13;
	return `Arguments[ ${inspectList(args, options$3)} ]`;
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
function inspectObject2(error, options$3) {
	const properties$3 = Object.getOwnPropertyNames(error).filter((key) => errorKeys.indexOf(key) === -1);
	const name = error.name;
	options$3.truncate -= name.length;
	let message = "";
	if (typeof error.message === "string") message = truncate(error.message, options$3.truncate);
	else properties$3.unshift("message");
	message = message ? `: ${message}` : "";
	options$3.truncate -= message.length + 5;
	options$3.seen = options$3.seen || [];
	if (options$3.seen.includes(error)) return "[Circular]";
	options$3.seen.push(error);
	const propertyContents = inspectList(properties$3.map((key) => [key, error[key]]), options$3, inspectProperty);
	return `${name}${message}${propertyContents ? ` { ${propertyContents} }` : ""}`;
}
__name(inspectObject2, "inspectObject");
function inspectAttribute([key, value], options$3) {
	options$3.truncate -= 3;
	if (!value) return `${options$3.stylize(String(key), "yellow")}`;
	return `${options$3.stylize(String(key), "yellow")}=${options$3.stylize(`"${value}"`, "string")}`;
}
__name(inspectAttribute, "inspectAttribute");
function inspectNodeCollection(collection, options$3) {
	return inspectList(collection, options$3, inspectNode, "\n");
}
__name(inspectNodeCollection, "inspectNodeCollection");
function inspectNode(node, options$3) {
	switch (node.nodeType) {
		case 1: return inspectHTML(node, options$3);
		case 3: return options$3.inspect(node.data, options$3);
		default: return options$3.inspect(node, options$3);
	}
}
__name(inspectNode, "inspectNode");
function inspectHTML(element, options$3) {
	const properties$3 = element.getAttributeNames();
	const name = element.tagName.toLowerCase();
	const head = options$3.stylize(`<${name}`, "special");
	const headClose = options$3.stylize(`>`, "special");
	const tail = options$3.stylize(`</${name}>`, "special");
	options$3.truncate -= name.length * 2 + 5;
	let propertyContents = "";
	if (properties$3.length > 0) {
		propertyContents += " ";
		propertyContents += inspectList(properties$3.map((key) => [key, element.getAttribute(key)]), options$3, inspectAttribute, " ");
	}
	options$3.truncate -= propertyContents.length;
	const truncate2 = options$3.truncate;
	let children = inspectNodeCollection(element.children, options$3);
	if (children && children.length > truncate2) children = `${truncator}(${element.children.length})`;
	return `${head}${propertyContents}${headClose}${children}${tail}`;
}
__name(inspectHTML, "inspectHTML");
var chaiInspect = typeof Symbol === "function" && typeof Symbol.for === "function" ? Symbol.for("chai/inspect") : "@@chai/inspect";
var nodeInspect = Symbol.for("nodejs.util.inspect.custom");
var constructorMap = /* @__PURE__ */ new WeakMap();
var stringTagMap = {};
var baseTypesMap = {
	undefined: /* @__PURE__ */ __name((value, options$3) => options$3.stylize("undefined", "undefined"), "undefined"),
	null: /* @__PURE__ */ __name((value, options$3) => options$3.stylize("null", "null"), "null"),
	boolean: /* @__PURE__ */ __name((value, options$3) => options$3.stylize(String(value), "boolean"), "boolean"),
	Boolean: /* @__PURE__ */ __name((value, options$3) => options$3.stylize(String(value), "boolean"), "Boolean"),
	number: inspectNumber,
	Number: inspectNumber,
	bigint: inspectBigInt,
	BigInt: inspectBigInt,
	string: inspectString,
	String: inspectString,
	function: inspectFunction,
	Function: inspectFunction,
	symbol: inspectSymbol,
	Symbol: inspectSymbol,
	Array: inspectArray,
	Date: inspectDate,
	Map: inspectMap,
	Set: inspectSet,
	RegExp: inspectRegExp,
	Promise: promise_default,
	WeakSet: /* @__PURE__ */ __name((value, options$3) => options$3.stylize("WeakSet{…}", "special"), "WeakSet"),
	WeakMap: /* @__PURE__ */ __name((value, options$3) => options$3.stylize("WeakMap{…}", "special"), "WeakMap"),
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
	HTMLCollection: inspectNodeCollection,
	NodeList: inspectNodeCollection
};
var inspectCustom = /* @__PURE__ */ __name((value, options$3, type3, inspectFn) => {
	if (chaiInspect in value && typeof value[chaiInspect] === "function") return value[chaiInspect](options$3);
	if (nodeInspect in value && typeof value[nodeInspect] === "function") return value[nodeInspect](options$3.depth, options$3, inspectFn);
	if ("inspect" in value && typeof value.inspect === "function") return value.inspect(options$3.depth, options$3);
	if ("constructor" in value && constructorMap.has(value.constructor)) return constructorMap.get(value.constructor)(value, options$3);
	if (stringTagMap[type3]) return stringTagMap[type3](value, options$3);
	return "";
}, "inspectCustom");
var toString = Object.prototype.toString;
function inspect(value, opts = {}) {
	const options$3 = normaliseOptions(opts, inspect);
	const { customInspect } = options$3;
	let type3 = value === null ? "null" : typeof value;
	if (type3 === "object") type3 = toString.call(value).slice(8, -1);
	if (type3 in baseTypesMap) return baseTypesMap[type3](value, options$3);
	if (customInspect && value) {
		const output = inspectCustom(value, options$3, type3, inspect);
		if (output) {
			if (typeof output === "string") return output;
			return inspect(output, options$3);
		}
	}
	const proto = value ? Object.getPrototypeOf(value) : false;
	if (proto === Object.prototype || proto === null) return inspectObject(value, options$3);
	if (value && typeof HTMLElement === "function" && value instanceof HTMLElement) return inspectHTML(value, options$3);
	if ("constructor" in value) {
		if (value.constructor !== Object) return inspectClass(value, options$3);
		return inspectObject(value, options$3);
	}
	if (value === Object(value)) return inspectObject(value, options$3);
	return options$3.stylize(String(value), type3);
}
__name(inspect, "inspect");
var config = {
	includeStack: false,
	showDiff: true,
	truncateThreshold: 40,
	useProxy: true,
	proxyExcludedKeys: [
		"then",
		"catch",
		"inspect",
		"toJSON"
	],
	deepEqual: null
};
function inspect2(obj, showHidden, depth, colors) {
	return inspect(obj, {
		colors,
		depth: typeof depth === "undefined" ? 2 : depth,
		showHidden,
		truncate: config.truncateThreshold ? config.truncateThreshold : Infinity
	});
}
__name(inspect2, "inspect");
function objDisplay(obj) {
	let str = inspect2(obj), type3 = Object.prototype.toString.call(obj);
	if (config.truncateThreshold && str.length >= config.truncateThreshold) if (type3 === "[object Function]") return !obj.name || obj.name === "" ? "[Function]" : "[Function: " + obj.name + "]";
	else if (type3 === "[object Array]") return "[ Array(" + obj.length + ") ]";
	else if (type3 === "[object Object]") {
		let keys = Object.keys(obj);
		return "{ Object (" + (keys.length > 2 ? keys.splice(0, 2).join(", ") + ", ..." : keys.join(", ")) + ") }";
	} else return str;
	else return str;
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
	if (!object.__flags) object.__flags = /* @__PURE__ */ Object.create(null);
	includeAll = arguments.length === 3 ? includeAll : true;
	for (let flag3 in flags) if (includeAll || flag3 !== "object" && flag3 !== "ssfi" && flag3 !== "lockSsfi" && flag3 != "message") object.__flags[flag3] = flags[flag3];
}
__name(transferFlags, "transferFlags");
function type2(obj) {
	if (typeof obj === "undefined") return "undefined";
	if (obj === null) return "null";
	const stringTag = obj[Symbol.toStringTag];
	if (typeof stringTag === "string") return stringTag;
	return Object.prototype.toString.call(obj).slice(8, -1);
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
		if (Object.isExtensible(key)) Object.defineProperty(key, this._key, {
			value,
			configurable: true
		});
	}, "set")
};
var MemoizeMap = typeof WeakMap === "function" ? WeakMap : FakeMap;
function memoizeCompare(leftHandOperand, rightHandOperand, memoizeMap) {
	if (!memoizeMap || isPrimitive(leftHandOperand) || isPrimitive(rightHandOperand)) return null;
	var leftHandMap = memoizeMap.get(leftHandOperand);
	if (leftHandMap) {
		var result = leftHandMap.get(rightHandOperand);
		if (typeof result === "boolean") return result;
	}
	return null;
}
__name(memoizeCompare, "memoizeCompare");
function memoizeSet(leftHandOperand, rightHandOperand, memoizeMap, result) {
	if (!memoizeMap || isPrimitive(leftHandOperand) || isPrimitive(rightHandOperand)) return;
	var leftHandMap = memoizeMap.get(leftHandOperand);
	if (leftHandMap) leftHandMap.set(rightHandOperand, result);
	else {
		leftHandMap = new MemoizeMap();
		leftHandMap.set(rightHandOperand, result);
		memoizeMap.set(leftHandOperand, leftHandMap);
	}
}
__name(memoizeSet, "memoizeSet");
var deep_eql_default = deepEqual;
function deepEqual(leftHandOperand, rightHandOperand, options$3) {
	if (options$3 && options$3.comparator) return extensiveDeepEqual(leftHandOperand, rightHandOperand, options$3);
	var simpleResult = simpleEqual(leftHandOperand, rightHandOperand);
	if (simpleResult !== null) return simpleResult;
	return extensiveDeepEqual(leftHandOperand, rightHandOperand, options$3);
}
__name(deepEqual, "deepEqual");
function simpleEqual(leftHandOperand, rightHandOperand) {
	if (leftHandOperand === rightHandOperand) return leftHandOperand !== 0 || 1 / leftHandOperand === 1 / rightHandOperand;
	if (leftHandOperand !== leftHandOperand && rightHandOperand !== rightHandOperand) return true;
	if (isPrimitive(leftHandOperand) || isPrimitive(rightHandOperand)) return false;
	return null;
}
__name(simpleEqual, "simpleEqual");
function extensiveDeepEqual(leftHandOperand, rightHandOperand, options$3) {
	options$3 = options$3 || {};
	options$3.memoize = options$3.memoize === false ? false : options$3.memoize || new MemoizeMap();
	var comparator = options$3 && options$3.comparator;
	var memoizeResultLeft = memoizeCompare(leftHandOperand, rightHandOperand, options$3.memoize);
	if (memoizeResultLeft !== null) return memoizeResultLeft;
	var memoizeResultRight = memoizeCompare(rightHandOperand, leftHandOperand, options$3.memoize);
	if (memoizeResultRight !== null) return memoizeResultRight;
	if (comparator) {
		var comparatorResult = comparator(leftHandOperand, rightHandOperand);
		if (comparatorResult === false || comparatorResult === true) {
			memoizeSet(leftHandOperand, rightHandOperand, options$3.memoize, comparatorResult);
			return comparatorResult;
		}
		var simpleResult = simpleEqual(leftHandOperand, rightHandOperand);
		if (simpleResult !== null) return simpleResult;
	}
	var leftHandType = type2(leftHandOperand);
	if (leftHandType !== type2(rightHandOperand)) {
		memoizeSet(leftHandOperand, rightHandOperand, options$3.memoize, false);
		return false;
	}
	memoizeSet(leftHandOperand, rightHandOperand, options$3.memoize, true);
	var result = extensiveDeepEqualByType(leftHandOperand, rightHandOperand, leftHandType, options$3);
	memoizeSet(leftHandOperand, rightHandOperand, options$3.memoize, result);
	return result;
}
__name(extensiveDeepEqual, "extensiveDeepEqual");
function extensiveDeepEqualByType(leftHandOperand, rightHandOperand, leftHandType, options$3) {
	switch (leftHandType) {
		case "String":
		case "Number":
		case "Boolean":
		case "Date": return deepEqual(leftHandOperand.valueOf(), rightHandOperand.valueOf());
		case "Promise":
		case "Symbol":
		case "function":
		case "WeakMap":
		case "WeakSet": return leftHandOperand === rightHandOperand;
		case "Error": return keysEqual(leftHandOperand, rightHandOperand, [
			"name",
			"message",
			"code"
		], options$3);
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
		case "Array": return iterableEqual(leftHandOperand, rightHandOperand, options$3);
		case "RegExp": return regexpEqual(leftHandOperand, rightHandOperand);
		case "Generator": return generatorEqual(leftHandOperand, rightHandOperand, options$3);
		case "DataView": return iterableEqual(new Uint8Array(leftHandOperand.buffer), new Uint8Array(rightHandOperand.buffer), options$3);
		case "ArrayBuffer": return iterableEqual(new Uint8Array(leftHandOperand), new Uint8Array(rightHandOperand), options$3);
		case "Set": return entriesEqual(leftHandOperand, rightHandOperand, options$3);
		case "Map": return entriesEqual(leftHandOperand, rightHandOperand, options$3);
		case "Temporal.PlainDate":
		case "Temporal.PlainTime":
		case "Temporal.PlainDateTime":
		case "Temporal.Instant":
		case "Temporal.ZonedDateTime":
		case "Temporal.PlainYearMonth":
		case "Temporal.PlainMonthDay": return leftHandOperand.equals(rightHandOperand);
		case "Temporal.Duration": return leftHandOperand.total("nanoseconds") === rightHandOperand.total("nanoseconds");
		case "Temporal.TimeZone":
		case "Temporal.Calendar": return leftHandOperand.toString() === rightHandOperand.toString();
		default: return objectEqual(leftHandOperand, rightHandOperand, options$3);
	}
}
__name(extensiveDeepEqualByType, "extensiveDeepEqualByType");
function regexpEqual(leftHandOperand, rightHandOperand) {
	return leftHandOperand.toString() === rightHandOperand.toString();
}
__name(regexpEqual, "regexpEqual");
function entriesEqual(leftHandOperand, rightHandOperand, options$3) {
	try {
		if (leftHandOperand.size !== rightHandOperand.size) return false;
		if (leftHandOperand.size === 0) return true;
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
	return iterableEqual(leftHandItems.sort(), rightHandItems.sort(), options$3);
}
__name(entriesEqual, "entriesEqual");
function iterableEqual(leftHandOperand, rightHandOperand, options$3) {
	var length = leftHandOperand.length;
	if (length !== rightHandOperand.length) return false;
	if (length === 0) return true;
	var index = -1;
	while (++index < length) if (deepEqual(leftHandOperand[index], rightHandOperand[index], options$3) === false) return false;
	return true;
}
__name(iterableEqual, "iterableEqual");
function generatorEqual(leftHandOperand, rightHandOperand, options$3) {
	return iterableEqual(getGeneratorEntries(leftHandOperand), getGeneratorEntries(rightHandOperand), options$3);
}
__name(generatorEqual, "generatorEqual");
function hasIteratorFunction(target) {
	return typeof Symbol !== "undefined" && typeof target === "object" && typeof Symbol.iterator !== "undefined" && typeof target[Symbol.iterator] === "function";
}
__name(hasIteratorFunction, "hasIteratorFunction");
function getIteratorEntries(target) {
	if (hasIteratorFunction(target)) try {
		return getGeneratorEntries(target[Symbol.iterator]());
	} catch (iteratorError) {
		return [];
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
	for (var key in target) keys.push(key);
	return keys;
}
__name(getEnumerableKeys, "getEnumerableKeys");
function getEnumerableSymbols(target) {
	var keys = [];
	var allKeys = Object.getOwnPropertySymbols(target);
	for (var i$2 = 0; i$2 < allKeys.length; i$2 += 1) {
		var key = allKeys[i$2];
		if (Object.getOwnPropertyDescriptor(target, key).enumerable) keys.push(key);
	}
	return keys;
}
__name(getEnumerableSymbols, "getEnumerableSymbols");
function keysEqual(leftHandOperand, rightHandOperand, keys, options$3) {
	var length = keys.length;
	if (length === 0) return true;
	for (var i$2 = 0; i$2 < length; i$2 += 1) if (deepEqual(leftHandOperand[keys[i$2]], rightHandOperand[keys[i$2]], options$3) === false) return false;
	return true;
}
__name(keysEqual, "keysEqual");
function objectEqual(leftHandOperand, rightHandOperand, options$3) {
	var leftHandKeys = getEnumerableKeys(leftHandOperand);
	var rightHandKeys = getEnumerableKeys(rightHandOperand);
	var leftHandSymbols = getEnumerableSymbols(leftHandOperand);
	var rightHandSymbols = getEnumerableSymbols(rightHandOperand);
	leftHandKeys = leftHandKeys.concat(leftHandSymbols);
	rightHandKeys = rightHandKeys.concat(rightHandSymbols);
	if (leftHandKeys.length && leftHandKeys.length === rightHandKeys.length) {
		if (iterableEqual(mapSymbols(leftHandKeys).sort(), mapSymbols(rightHandKeys).sort()) === false) return false;
		return keysEqual(leftHandOperand, rightHandOperand, leftHandKeys, options$3);
	}
	var leftHandEntries = getIteratorEntries(leftHandOperand);
	var rightHandEntries = getIteratorEntries(rightHandOperand);
	if (leftHandEntries.length && leftHandEntries.length === rightHandEntries.length) {
		leftHandEntries.sort();
		rightHandEntries.sort();
		return iterableEqual(leftHandEntries, rightHandEntries, options$3);
	}
	if (leftHandKeys.length === 0 && leftHandEntries.length === 0 && rightHandKeys.length === 0 && rightHandEntries.length === 0) return true;
	return false;
}
__name(objectEqual, "objectEqual");
function isPrimitive(value) {
	return value === null || typeof value !== "object";
}
__name(isPrimitive, "isPrimitive");
function mapSymbols(arr) {
	return arr.map(/* @__PURE__ */ __name(function mapSymbol(entry) {
		if (typeof entry === "symbol") return entry.toString();
		return entry;
	}, "mapSymbol"));
}
__name(mapSymbols, "mapSymbols");
function hasProperty(obj, name) {
	if (typeof obj === "undefined" || obj === null) return false;
	return name in Object(obj);
}
__name(hasProperty, "hasProperty");
function parsePath(path) {
	return path.replace(/([^\\])\[/g, "$1.[").match(/(\\\.|[^.]+?)+/g).map((value) => {
		if (value === "constructor" || value === "__proto__" || value === "prototype") return {};
		const mArr = /^\[(\d+)\]$/.exec(value);
		let parsed = null;
		if (mArr) parsed = { i: parseFloat(mArr[1]) };
		else parsed = { p: value.replace(/\\([.[\]])/g, "$1") };
		return parsed;
	});
}
__name(parsePath, "parsePath");
function internalGetPathValue(obj, parsed, pathDepth) {
	let temporaryValue = obj;
	let res = null;
	pathDepth = typeof pathDepth === "undefined" ? parsed.length : pathDepth;
	for (let i$2 = 0; i$2 < pathDepth; i$2++) {
		const part = parsed[i$2];
		if (temporaryValue) {
			if (typeof part.p === "undefined") temporaryValue = temporaryValue[part.i];
			else temporaryValue = temporaryValue[part.p];
			if (i$2 === pathDepth - 1) res = temporaryValue;
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
var Assertion = class _Assertion {
	static {
		__name(this, "Assertion");
	}
	/** @type {{}} */
	__flags = {};
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
		flag(this, "ssfi", ssfi || _Assertion);
		flag(this, "lockSsfi", lockSsfi);
		flag(this, "object", obj);
		flag(this, "message", msg);
		flag(this, "eql", config.deepEqual || deep_eql_default);
		return proxify(this);
	}
	/** @returns {boolean} */
	static get includeStack() {
		console.warn("Assertion.includeStack is deprecated, use chai.config.includeStack instead.");
		return config.includeStack;
	}
	/** @param {boolean} value */
	static set includeStack(value) {
		console.warn("Assertion.includeStack is deprecated, use chai.config.includeStack instead.");
		config.includeStack = value;
	}
	/** @returns {boolean} */
	static get showDiff() {
		console.warn("Assertion.showDiff is deprecated, use chai.config.showDiff instead.");
		return config.showDiff;
	}
	/** @param {boolean} value */
	static set showDiff(value) {
		console.warn("Assertion.showDiff is deprecated, use chai.config.showDiff instead.");
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
			const assertionErrorObjectProperties = {
				actual: getActual(this, arguments),
				expected,
				showDiff
			};
			const operator = getOperator(this, arguments);
			if (operator) assertionErrorObjectProperties.operator = operator;
			throw new AssertionError(msg, assertionErrorObjectProperties, config.includeStack ? this.assert : flag(this, "ssfi"));
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
};
var events$4 = new EventTarget();
var PluginEvent = class extends Event {
	static {
		__name(this, "PluginEvent");
	}
	constructor(type3, name, fn) {
		super(type3);
		this.name = String(name);
		this.fn = fn;
	}
};
function isProxyEnabled() {
	return config.useProxy && typeof Proxy !== "undefined" && typeof Reflect !== "undefined";
}
__name(isProxyEnabled, "isProxyEnabled");
function addProperty(ctx, name, getter) {
	getter = getter === void 0 ? function() {} : getter;
	Object.defineProperty(ctx, name, {
		get: /* @__PURE__ */ __name(function propertyGetter() {
			if (!isProxyEnabled() && !flag(this, "lockSsfi")) flag(this, "ssfi", propertyGetter);
			let result = getter.call(this);
			if (result !== void 0) return result;
			let newAssertion = new Assertion();
			transferFlags(this, newAssertion);
			return newAssertion;
		}, "propertyGetter"),
		configurable: true
	});
	events$4.dispatchEvent(new PluginEvent("addProperty", name, getter));
}
__name(addProperty, "addProperty");
var fnLengthDesc = Object.getOwnPropertyDescriptor(function() {}, "length");
function addLengthGuard(fn, assertionName, isChainable) {
	if (!fnLengthDesc.configurable) return fn;
	Object.defineProperty(fn, "length", { get: /* @__PURE__ */ __name(function() {
		if (isChainable) throw Error("Invalid Chai property: " + assertionName + ".length. Due to a compatibility issue, \"length\" cannot directly follow \"" + assertionName + "\". Use \"" + assertionName + ".lengthOf\" instead.");
		throw Error("Invalid Chai property: " + assertionName + ".length. See docs for proper usage of \"" + assertionName + "\".");
	}, "get") });
	return fn;
}
__name(addLengthGuard, "addLengthGuard");
function getProperties(object) {
	let result = Object.getOwnPropertyNames(object);
	function addProperty2(property) {
		if (result.indexOf(property) === -1) result.push(property);
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
var builtins = [
	"__flags",
	"__methods",
	"_obj",
	"assert"
];
function proxify(obj, nonChainableMethodName) {
	if (!isProxyEnabled()) return obj;
	return new Proxy(obj, { get: /* @__PURE__ */ __name(function proxyGetter(target, property) {
		if (typeof property === "string" && config.proxyExcludedKeys.indexOf(property) === -1 && !Reflect.has(target, property)) {
			if (nonChainableMethodName) throw Error("Invalid Chai property: " + nonChainableMethodName + "." + property + ". See docs for proper usage of \"" + nonChainableMethodName + "\".");
			let suggestion = null;
			let suggestionDistance = 4;
			getProperties(target).forEach(function(prop) {
				if (!Object.prototype.hasOwnProperty(prop) && builtins.indexOf(prop) === -1) {
					let dist = stringDistanceCapped(property, prop, suggestionDistance);
					if (dist < suggestionDistance) {
						suggestion = prop;
						suggestionDistance = dist;
					}
				}
			});
			if (suggestion !== null) throw Error("Invalid Chai property: " + property + ". Did you mean \"" + suggestion + "\"?");
			else throw Error("Invalid Chai property: " + property);
		}
		if (builtins.indexOf(property) === -1 && !flag(target, "lockSsfi")) flag(target, "ssfi", proxyGetter);
		return Reflect.get(target, property);
	}, "proxyGetter") });
}
__name(proxify, "proxify");
function stringDistanceCapped(strA, strB, cap) {
	if (Math.abs(strA.length - strB.length) >= cap) return cap;
	let memo = [];
	for (let i$2 = 0; i$2 <= strA.length; i$2++) {
		memo[i$2] = Array(strB.length + 1).fill(0);
		memo[i$2][0] = i$2;
	}
	for (let j$1 = 0; j$1 < strB.length; j$1++) memo[0][j$1] = j$1;
	for (let i$2 = 1; i$2 <= strA.length; i$2++) {
		let ch = strA.charCodeAt(i$2 - 1);
		for (let j$1 = 1; j$1 <= strB.length; j$1++) {
			if (Math.abs(i$2 - j$1) >= cap) {
				memo[i$2][j$1] = cap;
				continue;
			}
			memo[i$2][j$1] = Math.min(memo[i$2 - 1][j$1] + 1, memo[i$2][j$1 - 1] + 1, memo[i$2 - 1][j$1 - 1] + (ch === strB.charCodeAt(j$1 - 1) ? 0 : 1));
		}
	}
	return memo[strA.length][strB.length];
}
__name(stringDistanceCapped, "stringDistanceCapped");
function addMethod(ctx, name, method) {
	let methodWrapper = /* @__PURE__ */ __name(function() {
		if (!flag(this, "lockSsfi")) flag(this, "ssfi", methodWrapper);
		let result = method.apply(this, arguments);
		if (result !== void 0) return result;
		let newAssertion = new Assertion();
		transferFlags(this, newAssertion);
		return newAssertion;
	}, "methodWrapper");
	addLengthGuard(methodWrapper, name, false);
	ctx[name] = proxify(methodWrapper, name);
	events$4.dispatchEvent(new PluginEvent("addMethod", name, method));
}
__name(addMethod, "addMethod");
function overwriteProperty(ctx, name, getter) {
	let _get = Object.getOwnPropertyDescriptor(ctx, name), _super = /* @__PURE__ */ __name(function() {}, "_super");
	if (_get && "function" === typeof _get.get) _super = _get.get;
	Object.defineProperty(ctx, name, {
		get: /* @__PURE__ */ __name(function overwritingPropertyGetter() {
			if (!isProxyEnabled() && !flag(this, "lockSsfi")) flag(this, "ssfi", overwritingPropertyGetter);
			let origLockSsfi = flag(this, "lockSsfi");
			flag(this, "lockSsfi", true);
			let result = getter(_super).call(this);
			flag(this, "lockSsfi", origLockSsfi);
			if (result !== void 0) return result;
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
		if (!flag(this, "lockSsfi")) flag(this, "ssfi", overwritingMethodWrapper);
		let origLockSsfi = flag(this, "lockSsfi");
		flag(this, "lockSsfi", true);
		let result = method(_super).apply(this, arguments);
		flag(this, "lockSsfi", origLockSsfi);
		if (result !== void 0) return result;
		let newAssertion = new Assertion();
		transferFlags(this, newAssertion);
		return newAssertion;
	}, "overwritingMethodWrapper");
	addLengthGuard(overwritingMethodWrapper, name, false);
	ctx[name] = proxify(overwritingMethodWrapper, name);
}
__name(overwriteMethod, "overwriteMethod");
var canSetPrototype = typeof Object.setPrototypeOf === "function";
var testFn = /* @__PURE__ */ __name(function() {}, "testFn");
var excludeNames = Object.getOwnPropertyNames(testFn).filter(function(name) {
	let propDesc = Object.getOwnPropertyDescriptor(testFn, name);
	if (typeof propDesc !== "object") return true;
	return !propDesc.configurable;
});
var call = Function.prototype.call;
var apply = Function.prototype.apply;
var PluginAddChainableMethodEvent = class extends PluginEvent {
	static {
		__name(this, "PluginAddChainableMethodEvent");
	}
	constructor(type3, name, fn, chainingBehavior) {
		super(type3, name, fn);
		this.chainingBehavior = chainingBehavior;
	}
};
function addChainableMethod(ctx, name, method, chainingBehavior) {
	if (typeof chainingBehavior !== "function") chainingBehavior = /* @__PURE__ */ __name(function() {}, "chainingBehavior");
	let chainableBehavior = {
		method,
		chainingBehavior
	};
	if (!ctx.__methods) ctx.__methods = {};
	ctx.__methods[name] = chainableBehavior;
	Object.defineProperty(ctx, name, {
		get: /* @__PURE__ */ __name(function chainableMethodGetter() {
			chainableBehavior.chainingBehavior.call(this);
			let chainableMethodWrapper = /* @__PURE__ */ __name(function() {
				if (!flag(this, "lockSsfi")) flag(this, "ssfi", chainableMethodWrapper);
				let result = chainableBehavior.method.apply(this, arguments);
				if (result !== void 0) return result;
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
			} else Object.getOwnPropertyNames(ctx).forEach(function(asserterName) {
				if (excludeNames.indexOf(asserterName) !== -1) return;
				let pd = Object.getOwnPropertyDescriptor(ctx, asserterName);
				Object.defineProperty(chainableMethodWrapper, asserterName, pd);
			});
			transferFlags(this, chainableMethodWrapper);
			return proxify(chainableMethodWrapper);
		}, "chainableMethodGetter"),
		configurable: true
	});
	events$4.dispatchEvent(new PluginAddChainableMethodEvent("addChainableMethod", name, method, chainingBehavior));
}
__name(addChainableMethod, "addChainableMethod");
function overwriteChainableMethod(ctx, name, method, chainingBehavior) {
	let chainableBehavior = ctx.__methods[name];
	let _chainingBehavior = chainableBehavior.chainingBehavior;
	chainableBehavior.chainingBehavior = /* @__PURE__ */ __name(function overwritingChainableMethodGetter() {
		let result = chainingBehavior(_chainingBehavior).call(this);
		if (result !== void 0) return result;
		let newAssertion = new Assertion();
		transferFlags(this, newAssertion);
		return newAssertion;
	}, "overwritingChainableMethodGetter");
	let _method = chainableBehavior.method;
	chainableBehavior.method = /* @__PURE__ */ __name(function overwritingChainableMethodWrapper() {
		let result = method(_method).apply(this, arguments);
		if (result !== void 0) return result;
		let newAssertion = new Assertion();
		transferFlags(this, newAssertion);
		return newAssertion;
	}, "overwritingChainableMethodWrapper");
}
__name(overwriteChainableMethod, "overwriteChainableMethod");
function compareByInspect(a$2, b$1) {
	return inspect2(a$2) < inspect2(b$1) ? -1 : 1;
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
	return [
		"Array",
		"Object",
		"Function"
	].indexOf(objectType) !== -1;
}
__name(isObjectType, "isObjectType");
function getOperator(obj, args) {
	let operator = flag(obj, "operator");
	let negate = flag(obj, "negate");
	let expected = args[3];
	let msg = negate ? args[2] : args[1];
	if (operator) return operator;
	if (typeof msg === "function") msg = msg();
	msg = msg || "";
	if (!msg) return;
	if (/\shave\s/.test(msg)) return;
	let isObject = isObjectType(expected);
	if (/\snot\s/.test(msg)) return isObject ? "notDeepStrictEqual" : "notStrictEqual";
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
	let obj = flag2(this, "object"), article = ~[
		"a",
		"e",
		"i",
		"o",
		"u"
	].indexOf(type3.charAt(0)) ? "an " : "a ";
	const detectedType = type(obj).toLowerCase();
	if (functionTypes["function"].includes(type3)) this.assert(functionTypes[type3].includes(detectedType), "expected #{this} to be " + article + type3, "expected #{this} not to be " + article + type3);
	else this.assert(type3 === detectedType, "expected #{this} to be " + article + type3, "expected #{this} not to be " + article + type3);
}
__name(an, "an");
Assertion.addChainableMethod("an", an);
Assertion.addChainableMethod("a", an);
function SameValueZero(a$2, b$1) {
	return isNaN2(a$2) && isNaN2(b$1) || a$2 === b$1;
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
			if (isDeep) throw new AssertionError(flagMsg + "unable to use .deep.include with WeakSet", void 0, ssfi);
			included = obj.has(val);
			break;
		case "map":
			obj.forEach(function(item) {
				included = included || isEql(item, val);
			});
			break;
		case "set":
			if (isDeep) obj.forEach(function(item) {
				included = included || isEql(item, val);
			});
			else included = obj.has(val);
			break;
		case "array":
			if (isDeep) included = obj.some(function(item) {
				return isEql(item, val);
			});
			else included = obj.indexOf(val) !== -1;
			break;
		default: {
			if (val !== Object(val)) throw new AssertionError(flagMsg + "the given combination of arguments (" + objType + " and " + type(val).toLowerCase() + ") is invalid for this assertion. You can use an array, a map, an object, a set, a string, or a weakset instead of a " + type(val).toLowerCase(), void 0, ssfi);
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
					if (!check_error_exports.compatibleConstructor(err, AssertionError)) throw err;
					if (firstErr === null) firstErr = err;
					numErrs++;
				}
			}, this);
			if (negate && props.length > 1 && numErrs === props.length) throw firstErr;
			return;
		}
	}
	this.assert(included, "expected #{this} to " + descriptor + "include " + inspect2(val), "expected #{this} to not " + descriptor + "include " + inspect2(val));
}
__name(include, "include");
Assertion.addChainableMethod("include", include, includeChainingBehavior);
Assertion.addChainableMethod("contain", include, includeChainingBehavior);
Assertion.addChainableMethod("contains", include, includeChainingBehavior);
Assertion.addChainableMethod("includes", include, includeChainingBehavior);
Assertion.addProperty("ok", function() {
	this.assert(flag2(this, "object"), "expected #{this} to be truthy", "expected #{this} to be falsy");
});
Assertion.addProperty("true", function() {
	this.assert(true === flag2(this, "object"), "expected #{this} to be true", "expected #{this} to be false", flag2(this, "negate") ? false : true);
});
Assertion.addProperty("numeric", function() {
	const object = flag2(this, "object");
	this.assert(["Number", "BigInt"].includes(type(object)), "expected #{this} to be numeric", "expected #{this} to not be numeric", flag2(this, "negate") ? false : true);
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
	if (isCallable && negate || !isCallable && !negate) throw new AssertionError(assertionMessage, void 0, ssfi);
});
Assertion.addProperty("false", function() {
	this.assert(false === flag2(this, "object"), "expected #{this} to be false", "expected #{this} to be true", flag2(this, "negate") ? true : false);
});
Assertion.addProperty("null", function() {
	this.assert(null === flag2(this, "object"), "expected #{this} to be null", "expected #{this} not to be null");
});
Assertion.addProperty("undefined", function() {
	this.assert(void 0 === flag2(this, "object"), "expected #{this} to be undefined", "expected #{this} not to be undefined");
});
Assertion.addProperty("NaN", function() {
	this.assert(isNaN2(flag2(this, "object")), "expected #{this} to be NaN", "expected #{this} not to be NaN");
});
function assertExist() {
	let val = flag2(this, "object");
	this.assert(val !== null && val !== void 0, "expected #{this} to exist", "expected #{this} to not exist");
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
		case "weakset": throw new AssertionError(flagMsg + ".empty was passed a weak collection", void 0, ssfi);
		case "function": throw new AssertionError((flagMsg + ".empty was passed a function " + getName(val)).trim(), void 0, ssfi);
		default:
			if (val !== Object(val)) throw new AssertionError(flagMsg + ".empty was passed non-string primitive " + inspect2(val), void 0, ssfi);
			itemsCount = Object.keys(val).length;
	}
	this.assert(0 === itemsCount, "expected #{this} to be empty", "expected #{this} not to be empty");
});
function checkArguments() {
	let type3 = type(flag2(this, "object"));
	this.assert("Arguments" === type3, "expected #{this} to be arguments but got " + type3, "expected #{this} to not be arguments");
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
	} else this.assert(val === obj, "expected #{this} to equal #{exp}", "expected #{this} to not equal #{exp}", val, this._obj, true);
}
__name(assertEqual, "assertEqual");
Assertion.addMethod("equal", assertEqual);
Assertion.addMethod("equals", assertEqual);
Assertion.addMethod("eq", assertEqual);
function assertEql(obj, msg) {
	if (msg) flag2(this, "message", msg);
	let eql = flag2(this, "eql");
	this.assert(eql(obj, flag2(this, "object")), "expected #{this} to deeply equal #{exp}", "expected #{this} to not deeply equal #{exp}", obj, this._obj, true);
}
__name(assertEql, "assertEql");
Assertion.addMethod("eql", assertEql);
Assertion.addMethod("eqls", assertEql);
function assertAbove(n$7, msg) {
	if (msg) flag2(this, "message", msg);
	let obj = flag2(this, "object"), doLength = flag2(this, "doLength"), flagMsg = flag2(this, "message"), msgPrefix = flagMsg ? flagMsg + ": " : "", ssfi = flag2(this, "ssfi"), objType = type(obj).toLowerCase(), nType = type(n$7).toLowerCase();
	if (doLength && objType !== "map" && objType !== "set") new Assertion(obj, flagMsg, ssfi, true).to.have.property("length");
	if (!doLength && objType === "date" && nType !== "date") throw new AssertionError(msgPrefix + "the argument to above must be a date", void 0, ssfi);
	else if (!isNumeric(n$7) && (doLength || isNumeric(obj))) throw new AssertionError(msgPrefix + "the argument to above must be a number", void 0, ssfi);
	else if (!doLength && objType !== "date" && !isNumeric(obj)) {
		let printObj = objType === "string" ? "'" + obj + "'" : obj;
		throw new AssertionError(msgPrefix + "expected " + printObj + " to be a number or a date", void 0, ssfi);
	}
	if (doLength) {
		let descriptor = "length", itemsCount;
		if (objType === "map" || objType === "set") {
			descriptor = "size";
			itemsCount = obj.size;
		} else itemsCount = obj.length;
		this.assert(itemsCount > n$7, "expected #{this} to have a " + descriptor + " above #{exp} but got #{act}", "expected #{this} to not have a " + descriptor + " above #{exp}", n$7, itemsCount);
	} else this.assert(obj > n$7, "expected #{this} to be above #{exp}", "expected #{this} to be at most #{exp}", n$7);
}
__name(assertAbove, "assertAbove");
Assertion.addMethod("above", assertAbove);
Assertion.addMethod("gt", assertAbove);
Assertion.addMethod("greaterThan", assertAbove);
function assertLeast(n$7, msg) {
	if (msg) flag2(this, "message", msg);
	let obj = flag2(this, "object"), doLength = flag2(this, "doLength"), flagMsg = flag2(this, "message"), msgPrefix = flagMsg ? flagMsg + ": " : "", ssfi = flag2(this, "ssfi"), objType = type(obj).toLowerCase(), nType = type(n$7).toLowerCase(), errorMessage, shouldThrow = true;
	if (doLength && objType !== "map" && objType !== "set") new Assertion(obj, flagMsg, ssfi, true).to.have.property("length");
	if (!doLength && objType === "date" && nType !== "date") errorMessage = msgPrefix + "the argument to least must be a date";
	else if (!isNumeric(n$7) && (doLength || isNumeric(obj))) errorMessage = msgPrefix + "the argument to least must be a number";
	else if (!doLength && objType !== "date" && !isNumeric(obj)) {
		let printObj = objType === "string" ? "'" + obj + "'" : obj;
		errorMessage = msgPrefix + "expected " + printObj + " to be a number or a date";
	} else shouldThrow = false;
	if (shouldThrow) throw new AssertionError(errorMessage, void 0, ssfi);
	if (doLength) {
		let descriptor = "length", itemsCount;
		if (objType === "map" || objType === "set") {
			descriptor = "size";
			itemsCount = obj.size;
		} else itemsCount = obj.length;
		this.assert(itemsCount >= n$7, "expected #{this} to have a " + descriptor + " at least #{exp} but got #{act}", "expected #{this} to have a " + descriptor + " below #{exp}", n$7, itemsCount);
	} else this.assert(obj >= n$7, "expected #{this} to be at least #{exp}", "expected #{this} to be below #{exp}", n$7);
}
__name(assertLeast, "assertLeast");
Assertion.addMethod("least", assertLeast);
Assertion.addMethod("gte", assertLeast);
Assertion.addMethod("greaterThanOrEqual", assertLeast);
function assertBelow(n$7, msg) {
	if (msg) flag2(this, "message", msg);
	let obj = flag2(this, "object"), doLength = flag2(this, "doLength"), flagMsg = flag2(this, "message"), msgPrefix = flagMsg ? flagMsg + ": " : "", ssfi = flag2(this, "ssfi"), objType = type(obj).toLowerCase(), nType = type(n$7).toLowerCase(), errorMessage, shouldThrow = true;
	if (doLength && objType !== "map" && objType !== "set") new Assertion(obj, flagMsg, ssfi, true).to.have.property("length");
	if (!doLength && objType === "date" && nType !== "date") errorMessage = msgPrefix + "the argument to below must be a date";
	else if (!isNumeric(n$7) && (doLength || isNumeric(obj))) errorMessage = msgPrefix + "the argument to below must be a number";
	else if (!doLength && objType !== "date" && !isNumeric(obj)) {
		let printObj = objType === "string" ? "'" + obj + "'" : obj;
		errorMessage = msgPrefix + "expected " + printObj + " to be a number or a date";
	} else shouldThrow = false;
	if (shouldThrow) throw new AssertionError(errorMessage, void 0, ssfi);
	if (doLength) {
		let descriptor = "length", itemsCount;
		if (objType === "map" || objType === "set") {
			descriptor = "size";
			itemsCount = obj.size;
		} else itemsCount = obj.length;
		this.assert(itemsCount < n$7, "expected #{this} to have a " + descriptor + " below #{exp} but got #{act}", "expected #{this} to not have a " + descriptor + " below #{exp}", n$7, itemsCount);
	} else this.assert(obj < n$7, "expected #{this} to be below #{exp}", "expected #{this} to be at least #{exp}", n$7);
}
__name(assertBelow, "assertBelow");
Assertion.addMethod("below", assertBelow);
Assertion.addMethod("lt", assertBelow);
Assertion.addMethod("lessThan", assertBelow);
function assertMost(n$7, msg) {
	if (msg) flag2(this, "message", msg);
	let obj = flag2(this, "object"), doLength = flag2(this, "doLength"), flagMsg = flag2(this, "message"), msgPrefix = flagMsg ? flagMsg + ": " : "", ssfi = flag2(this, "ssfi"), objType = type(obj).toLowerCase(), nType = type(n$7).toLowerCase(), errorMessage, shouldThrow = true;
	if (doLength && objType !== "map" && objType !== "set") new Assertion(obj, flagMsg, ssfi, true).to.have.property("length");
	if (!doLength && objType === "date" && nType !== "date") errorMessage = msgPrefix + "the argument to most must be a date";
	else if (!isNumeric(n$7) && (doLength || isNumeric(obj))) errorMessage = msgPrefix + "the argument to most must be a number";
	else if (!doLength && objType !== "date" && !isNumeric(obj)) {
		let printObj = objType === "string" ? "'" + obj + "'" : obj;
		errorMessage = msgPrefix + "expected " + printObj + " to be a number or a date";
	} else shouldThrow = false;
	if (shouldThrow) throw new AssertionError(errorMessage, void 0, ssfi);
	if (doLength) {
		let descriptor = "length", itemsCount;
		if (objType === "map" || objType === "set") {
			descriptor = "size";
			itemsCount = obj.size;
		} else itemsCount = obj.length;
		this.assert(itemsCount <= n$7, "expected #{this} to have a " + descriptor + " at most #{exp} but got #{act}", "expected #{this} to have a " + descriptor + " above #{exp}", n$7, itemsCount);
	} else this.assert(obj <= n$7, "expected #{this} to be at most #{exp}", "expected #{this} to be above #{exp}", n$7);
}
__name(assertMost, "assertMost");
Assertion.addMethod("most", assertMost);
Assertion.addMethod("lte", assertMost);
Assertion.addMethod("lessThanOrEqual", assertMost);
Assertion.addMethod("within", function(start, finish, msg) {
	if (msg) flag2(this, "message", msg);
	let obj = flag2(this, "object"), doLength = flag2(this, "doLength"), flagMsg = flag2(this, "message"), msgPrefix = flagMsg ? flagMsg + ": " : "", ssfi = flag2(this, "ssfi"), objType = type(obj).toLowerCase(), startType = type(start).toLowerCase(), finishType = type(finish).toLowerCase(), errorMessage, shouldThrow = true, range = startType === "date" && finishType === "date" ? start.toISOString() + ".." + finish.toISOString() : start + ".." + finish;
	if (doLength && objType !== "map" && objType !== "set") new Assertion(obj, flagMsg, ssfi, true).to.have.property("length");
	if (!doLength && objType === "date" && (startType !== "date" || finishType !== "date")) errorMessage = msgPrefix + "the arguments to within must be dates";
	else if ((!isNumeric(start) || !isNumeric(finish)) && (doLength || isNumeric(obj))) errorMessage = msgPrefix + "the arguments to within must be numbers";
	else if (!doLength && objType !== "date" && !isNumeric(obj)) {
		let printObj = objType === "string" ? "'" + obj + "'" : obj;
		errorMessage = msgPrefix + "expected " + printObj + " to be a number or a date";
	} else shouldThrow = false;
	if (shouldThrow) throw new AssertionError(errorMessage, void 0, ssfi);
	if (doLength) {
		let descriptor = "length", itemsCount;
		if (objType === "map" || objType === "set") {
			descriptor = "size";
			itemsCount = obj.size;
		} else itemsCount = obj.length;
		this.assert(itemsCount >= start && itemsCount <= finish, "expected #{this} to have a " + descriptor + " within " + range, "expected #{this} to not have a " + descriptor + " within " + range);
	} else this.assert(obj >= start && obj <= finish, "expected #{this} to be within " + range, "expected #{this} to not be within " + range);
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
			throw new AssertionError(flagMsg + "The instanceof assertion needs a constructor but " + type(constructor) + " was given.", void 0, ssfi);
		}
		throw err;
	}
	let name = getName(constructor);
	if (name == null) name = "an unnamed constructor";
	this.assert(isInstanceOf, "expected #{this} to be an instance of " + name, "expected #{this} to not be an instance of " + name);
}
__name(assertInstanceOf, "assertInstanceOf");
Assertion.addMethod("instanceof", assertInstanceOf);
Assertion.addMethod("instanceOf", assertInstanceOf);
function assertProperty(name, val, msg) {
	if (msg) flag2(this, "message", msg);
	let isNested = flag2(this, "nested"), isOwn = flag2(this, "own"), flagMsg = flag2(this, "message"), obj = flag2(this, "object"), ssfi = flag2(this, "ssfi"), nameType = typeof name;
	flagMsg = flagMsg ? flagMsg + ": " : "";
	if (isNested) {
		if (nameType !== "string") throw new AssertionError(flagMsg + "the argument to property must be a string when using nested syntax", void 0, ssfi);
	} else if (nameType !== "string" && nameType !== "number" && nameType !== "symbol") throw new AssertionError(flagMsg + "the argument to property must be a string, number, or symbol", void 0, ssfi);
	if (isNested && isOwn) throw new AssertionError(flagMsg + "The \"nested\" and \"own\" flags cannot be combined.", void 0, ssfi);
	if (obj === null || obj === void 0) throw new AssertionError(flagMsg + "Target cannot be null or undefined.", void 0, ssfi);
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
	if (!negate || arguments.length === 1) this.assert(hasProperty2, "expected #{this} to have " + descriptor + inspect2(name), "expected #{this} to not have " + descriptor + inspect2(name));
	if (arguments.length > 1) this.assert(hasProperty2 && isEql(val, value), "expected #{this} to have " + descriptor + inspect2(name) + " of #{exp}, but got #{act}", "expected #{this} to not have " + descriptor + inspect2(name) + " of #{act}", val, value);
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
	if (actualDescriptor && descriptor) this.assert(eql(descriptor, actualDescriptor), "expected the own property descriptor for " + inspect2(name) + " on #{this} to match " + inspect2(descriptor) + ", got " + inspect2(actualDescriptor), "expected the own property descriptor for " + inspect2(name) + " on #{this} to not match " + inspect2(descriptor), descriptor, actualDescriptor, true);
	else this.assert(actualDescriptor, "expected #{this} to have an own property descriptor for " + inspect2(name), "expected #{this} to not have an own property descriptor for " + inspect2(name));
	flag2(this, "object", actualDescriptor);
}
__name(assertOwnPropertyDescriptor, "assertOwnPropertyDescriptor");
Assertion.addMethod("ownPropertyDescriptor", assertOwnPropertyDescriptor);
Assertion.addMethod("haveOwnPropertyDescriptor", assertOwnPropertyDescriptor);
function assertLengthChain() {
	flag2(this, "doLength", true);
}
__name(assertLengthChain, "assertLengthChain");
function assertLength(n$7, msg) {
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
	this.assert(itemsCount == n$7, "expected #{this} to have a " + descriptor + " of #{exp} but got #{act}", "expected #{this} to not have a " + descriptor + " of #{act}", n$7, itemsCount);
}
__name(assertLength, "assertLength");
Assertion.addChainableMethod("length", assertLength, assertLengthChain);
Assertion.addChainableMethod("lengthOf", assertLength, assertLengthChain);
function assertMatch(re, msg) {
	if (msg) flag2(this, "message", msg);
	let obj = flag2(this, "object");
	this.assert(re.exec(obj), "expected #{this} to match " + re, "expected #{this} not to match " + re);
}
__name(assertMatch, "assertMatch");
Assertion.addMethod("match", assertMatch);
Assertion.addMethod("matches", assertMatch);
Assertion.addMethod("string", function(str, msg) {
	if (msg) flag2(this, "message", msg);
	let obj = flag2(this, "object");
	new Assertion(obj, flag2(this, "message"), flag2(this, "ssfi"), true).is.a("string");
	this.assert(~obj.indexOf(str), "expected #{this} to contain " + inspect2(str), "expected #{this} to not contain " + inspect2(str));
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
		if (keysType !== "Array") keys = Array.prototype.slice.call(arguments);
	} else {
		actual = getOwnEnumerableProperties(obj);
		switch (keysType) {
			case "Array":
				if (arguments.length > 1) throw new AssertionError(mixedArgsMsg, void 0, ssfi);
				break;
			case "Object":
				if (arguments.length > 1) throw new AssertionError(mixedArgsMsg, void 0, ssfi);
				keys = Object.keys(keys);
				break;
			default: keys = Array.prototype.slice.call(arguments);
		}
		keys = keys.map(function(val) {
			return typeof val === "symbol" ? val : String(val);
		});
	}
	if (!keys.length) throw new AssertionError(flagMsg + "keys required", void 0, ssfi);
	let len = keys.length, any = flag2(this, "any"), all = flag2(this, "all"), expected = keys, isEql = isDeep ? flag2(this, "eql") : (val1, val2) => val1 === val2;
	if (!any && !all) all = true;
	if (any) ok = expected.some(function(expectedKey) {
		return actual.some(function(actualKey) {
			return isEql(expectedKey, actualKey);
		});
	});
	if (all) {
		ok = expected.every(function(expectedKey) {
			return actual.some(function(actualKey) {
				return isEql(expectedKey, actualKey);
			});
		});
		if (!flag2(this, "contains")) ok = ok && keys.length == actual.length;
	}
	if (len > 1) {
		keys = keys.map(function(key) {
			return inspect2(key);
		});
		let last = keys.pop();
		if (all) str = keys.join(", ") + ", and " + last;
		if (any) str = keys.join(", ") + ", or " + last;
	} else str = inspect2(keys[0]);
	str = (len > 1 ? "keys " : "key ") + str;
	str = (flag2(this, "contains") ? "contain " : "have ") + str;
	this.assert(ok, "expected #{this} to " + deepStr + str, "expected #{this} to not " + deepStr + str, expected.slice(0).sort(compareByInspect), actual.sort(compareByInspect), true);
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
		if (errorLike instanceof Error) errorLikeString = "#{exp}";
		else if (errorLike) errorLikeString = check_error_exports.getConstructorName(errorLike);
		let actual = caughtErr;
		if (caughtErr instanceof Error) actual = caughtErr.toString();
		else if (typeof caughtErr === "string") actual = caughtErr;
		else if (caughtErr && (typeof caughtErr === "object" || typeof caughtErr === "function")) try {
			actual = check_error_exports.getConstructorName(caughtErr);
		} catch (_err) {}
		this.assert(errorWasThrown, "expected #{this} to throw " + errorLikeString, "expected #{this} to not throw an error but #{act} was thrown", errorLike && errorLike.toString(), actual);
	}
	if (errorLike && caughtErr) {
		if (errorLike instanceof Error) {
			if (check_error_exports.compatibleInstance(caughtErr, errorLike) === negate) if (everyArgIsDefined && negate) errorLikeFail = true;
			else this.assert(negate, "expected #{this} to throw #{exp} but #{act} was thrown", "expected #{this} to not throw #{exp}" + (caughtErr && !negate ? " but #{act} was thrown" : ""), errorLike.toString(), caughtErr.toString());
		}
		if (check_error_exports.compatibleConstructor(caughtErr, errorLike) === negate) if (everyArgIsDefined && negate) errorLikeFail = true;
		else this.assert(negate, "expected #{this} to throw #{exp} but #{act} was thrown", "expected #{this} to not throw #{exp}" + (caughtErr ? " but #{act} was thrown" : ""), errorLike instanceof Error ? errorLike.toString() : errorLike && check_error_exports.getConstructorName(errorLike), caughtErr instanceof Error ? caughtErr.toString() : caughtErr && check_error_exports.getConstructorName(caughtErr));
	}
	if (caughtErr && errMsgMatcher !== void 0 && errMsgMatcher !== null) {
		let placeholder = "including";
		if (isRegExp2(errMsgMatcher)) placeholder = "matching";
		if (check_error_exports.compatibleMessage(caughtErr, errMsgMatcher) === negate) if (everyArgIsDefined && negate) errMsgMatcherFail = true;
		else this.assert(negate, "expected #{this} to throw error " + placeholder + " #{exp} but got #{act}", "expected #{this} to throw error not " + placeholder + " #{exp}", errMsgMatcher, check_error_exports.getMessage(caughtErr));
	}
	if (errorLikeFail && errMsgMatcherFail) this.assert(negate, "expected #{this} to throw #{exp} but #{act} was thrown", "expected #{this} to not throw #{exp}" + (caughtErr ? " but #{act} was thrown" : ""), errorLike instanceof Error ? errorLike.toString() : errorLike && check_error_exports.getConstructorName(errorLike), caughtErr instanceof Error ? caughtErr.toString() : caughtErr && check_error_exports.getConstructorName(caughtErr));
	flag2(this, "object", caughtErr);
}
__name(assertThrows, "assertThrows");
Assertion.addMethod("throw", assertThrows);
Assertion.addMethod("throws", assertThrows);
Assertion.addMethod("Throw", assertThrows);
function respondTo(method, msg) {
	if (msg) flag2(this, "message", msg);
	let obj = flag2(this, "object"), itself = flag2(this, "itself"), context = "function" === typeof obj && !itself ? obj.prototype[method] : obj[method];
	this.assert("function" === typeof context, "expected #{this} to respond to " + inspect2(method), "expected #{this} to not respond to " + inspect2(method));
}
__name(respondTo, "respondTo");
Assertion.addMethod("respondTo", respondTo);
Assertion.addMethod("respondsTo", respondTo);
Assertion.addProperty("itself", function() {
	flag2(this, "itself", true);
});
function satisfy(matcher, msg) {
	if (msg) flag2(this, "message", msg);
	let result = matcher(flag2(this, "object"));
	this.assert(result, "expected #{this} to satisfy " + objDisplay(matcher), "expected #{this} to not satisfy" + objDisplay(matcher), flag2(this, "negate") ? false : true, result);
}
__name(satisfy, "satisfy");
Assertion.addMethod("satisfy", satisfy);
Assertion.addMethod("satisfies", satisfy);
function closeTo(expected, delta, msg) {
	if (msg) flag2(this, "message", msg);
	let obj = flag2(this, "object"), flagMsg = flag2(this, "message"), ssfi = flag2(this, "ssfi");
	new Assertion(obj, flagMsg, ssfi, true).is.numeric;
	let message = "A `delta` value is required for `closeTo`";
	if (delta == void 0) throw new AssertionError(flagMsg ? `${flagMsg}: ${message}` : message, void 0, ssfi);
	new Assertion(delta, flagMsg, ssfi, true).is.numeric;
	message = "A `expected` value is required for `closeTo`";
	if (expected == void 0) throw new AssertionError(flagMsg ? `${flagMsg}: ${message}` : message, void 0, ssfi);
	new Assertion(expected, flagMsg, ssfi, true).is.numeric;
	const abs = /* @__PURE__ */ __name((x$1) => x$1 < 0n ? -x$1 : x$1, "abs");
	const strip = /* @__PURE__ */ __name((number) => parseFloat(parseFloat(number).toPrecision(12)), "strip");
	this.assert(strip(abs(obj - expected)) <= delta, "expected #{this} to be close to " + expected + " +/- " + delta, "expected #{this} not to be close to " + expected + " +/- " + delta);
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
	this.assert(isSubsetOf(subset, obj, cmp, contains, ordered), failMsg, failNegateMsg, subset, obj, true);
});
Assertion.addProperty("iterable", function(msg) {
	if (msg) flag2(this, "message", msg);
	let obj = flag2(this, "object");
	this.assert(obj != void 0 && obj[Symbol.iterator], "expected #{this} to be an iterable", "expected #{this} to not be an iterable", obj);
});
function oneOf(list, msg) {
	if (msg) flag2(this, "message", msg);
	let expected = flag2(this, "object"), flagMsg = flag2(this, "message"), ssfi = flag2(this, "ssfi"), contains = flag2(this, "contains"), isDeep = flag2(this, "deep"), eql = flag2(this, "eql");
	new Assertion(list, flagMsg, ssfi, true).to.be.an("array");
	if (contains) this.assert(list.some(function(possibility) {
		return expected.indexOf(possibility) > -1;
	}), "expected #{this} to contain one of #{exp}", "expected #{this} to not contain one of #{exp}", list, expected);
	else if (isDeep) this.assert(list.some(function(possibility) {
		return eql(expected, possibility);
	}), "expected #{this} to deeply equal one of #{exp}", "expected #{this} to deeply equal one of #{exp}", list, expected);
	else this.assert(list.indexOf(expected) > -1, "expected #{this} to be one of #{exp}", "expected #{this} to not be one of #{exp}", list, expected);
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
	this.assert(initial !== final, "expected " + msgObj + " to change", "expected " + msgObj + " to not change");
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
	this.assert(final - initial > 0, "expected " + msgObj + " to increase", "expected " + msgObj + " to not increase");
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
	this.assert(final - initial < 0, "expected " + msgObj + " to decrease", "expected " + msgObj + " to not decrease");
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
	if (behavior === "change") expression = Math.abs(final - initial) === Math.abs(delta);
	else expression = realDelta === Math.abs(delta);
	this.assert(expression, "expected " + msgObj + " to " + behavior + " by " + delta, "expected " + msgObj + " to not " + behavior + " by " + delta);
}
__name(assertDelta, "assertDelta");
Assertion.addMethod("by", assertDelta);
Assertion.addProperty("extensible", function() {
	let obj = flag2(this, "object");
	let isExtensible = obj === Object(obj) && Object.isExtensible(obj);
	this.assert(isExtensible, "expected #{this} to be extensible", "expected #{this} to not be extensible");
});
Assertion.addProperty("sealed", function() {
	let obj = flag2(this, "object");
	let isSealed = obj === Object(obj) ? Object.isSealed(obj) : true;
	this.assert(isSealed, "expected #{this} to be sealed", "expected #{this} to not be sealed");
});
Assertion.addProperty("frozen", function() {
	let obj = flag2(this, "object");
	let isFrozen = obj === Object(obj) ? Object.isFrozen(obj) : true;
	this.assert(isFrozen, "expected #{this} to be frozen", "expected #{this} to not be frozen");
});
Assertion.addProperty("finite", function(_msg) {
	let obj = flag2(this, "object");
	this.assert(typeof obj === "number" && isFinite(obj), "expected #{this} to be a finite number", "expected #{this} to not be a finite number");
});
function compareSubset(expected, actual) {
	if (expected === actual) return true;
	if (typeof actual !== typeof expected) return false;
	if (typeof expected !== "object" || expected === null) return expected === actual;
	if (!actual) return false;
	if (Array.isArray(expected)) {
		if (!Array.isArray(actual)) return false;
		return expected.every(function(exp) {
			return actual.some(function(act) {
				return compareSubset(exp, act);
			});
		});
	}
	if (expected instanceof Date) if (actual instanceof Date) return expected.getTime() === actual.getTime();
	else return false;
	return Object.keys(expected).every(function(key) {
		let expectedValue = expected[key];
		let actualValue = actual[key];
		if (typeof expectedValue === "object" && expectedValue !== null && actualValue !== null) return compareSubset(expectedValue, actualValue);
		if (typeof expectedValue === "function") return expectedValue(actualValue);
		return actualValue === expectedValue;
	});
}
__name(compareSubset, "compareSubset");
Assertion.addMethod("containSubset", function(expected) {
	const actual = flag(this, "object");
	const showDiff = config.showDiff;
	this.assert(compareSubset(expected, actual), "expected #{act} to contain subset #{exp}", "expected #{act} to not contain subset #{exp}", expected, actual, showDiff);
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
		if (this instanceof String || this instanceof Number || this instanceof Boolean || typeof Symbol === "function" && this instanceof Symbol || typeof BigInt === "function" && this instanceof BigInt) return new Assertion(this.valueOf(), null, shouldGetter);
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
	new Assertion(null, null, assert, true).assert(express, errmsg, "[ negation message unavailable ]");
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
	let test2 = new Assertion(act, msg, assert.equal, true);
	test2.assert(exp == flag(test2, "object"), "expected #{this} to equal #{exp}", "expected #{this} to not equal #{act}", exp, act, true);
};
assert.notEqual = function(act, exp, msg) {
	let test2 = new Assertion(act, msg, assert.notEqual, true);
	test2.assert(exp != flag(test2, "object"), "expected #{this} to not equal #{exp}", "expected #{this} to equal #{act}", exp, act, true);
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
	return flag(new Assertion(fn, msg, assert.throws, true).to.throw(errorLike, errMsgMatcher), "object");
};
assert.doesNotThrow = function(fn, errorLike, errMsgMatcher, message) {
	if ("string" === typeof errorLike || errorLike instanceof RegExp) {
		errMsgMatcher = errorLike;
		errorLike = null;
	}
	new Assertion(fn, message, assert.doesNotThrow, true).to.not.throw(errorLike, errMsgMatcher);
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
			throw new AssertionError(msg + "Invalid operator \"" + operator + "\"", void 0, assert.operator);
	}
	let test2 = new Assertion(ok, msg, assert.operator, true);
	test2.assert(true === flag(test2, "object"), "expected " + inspect2(val) + " to be " + operator + " " + inspect2(val2), "expected " + inspect2(val) + " to not be " + operator + " " + inspect2(val2));
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
	return new Assertion(fn, msg, assert.doesNotChange, true).to.not.change(obj, prop);
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
	return new Assertion(fn, msg, assert.doesNotIncrease, true).to.not.increase(obj, prop);
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
	return new Assertion(fn, msg, assert.doesNotDecrease, true).to.not.decrease(obj, prop);
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
	if (val) throw val;
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
for (const [name, as] of [
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
]) assert[as] = assert[name];
var used = [];
function use(fn) {
	const exports$1 = {
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
		fn(exports$1, utils_exports);
		used.push(fn);
	}
	return exports$1;
}
__name(use, "use");
/*!
* Chai - flag utility
* Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
* MIT Licensed
*/
/*!
* Chai - test utility
* Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
* MIT Licensed
*/
/*!
* Chai - expectTypes utility
* Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
* MIT Licensed
*/
/*!
* Chai - getActual utility
* Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
* MIT Licensed
*/
/*!
* Chai - message composition utility
* Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
* MIT Licensed
*/
/*!
* Chai - transferFlags utility
* Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
* MIT Licensed
*/
/*!
* chai
* http://chaijs.com
* Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
* MIT Licensed
*/
/*!
* Chai - events utility
* Copyright(c) 2011-2016 Jake Luer <jake@alogicalparadox.com>
* MIT Licensed
*/
/*!
* Chai - isProxyEnabled helper
* Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
* MIT Licensed
*/
/*!
* Chai - addProperty utility
* Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
* MIT Licensed
*/
/*!
* Chai - addLengthGuard utility
* Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
* MIT Licensed
*/
/*!
* Chai - getProperties utility
* Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
* MIT Licensed
*/
/*!
* Chai - proxify utility
* Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
* MIT Licensed
*/
/*!
* Chai - addMethod utility
* Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
* MIT Licensed
*/
/*!
* Chai - overwriteProperty utility
* Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
* MIT Licensed
*/
/*!
* Chai - overwriteMethod utility
* Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
* MIT Licensed
*/
/*!
* Chai - addChainingMethod utility
* Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
* MIT Licensed
*/
/*!
* Chai - overwriteChainableMethod utility
* Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
* MIT Licensed
*/
/*!
* Chai - compareByInspect utility
* Copyright(c) 2011-2016 Jake Luer <jake@alogicalparadox.com>
* MIT Licensed
*/
/*!
* Chai - getOwnEnumerablePropertySymbols utility
* Copyright(c) 2011-2016 Jake Luer <jake@alogicalparadox.com>
* MIT Licensed
*/
/*!
* Chai - getOwnEnumerableProperties utility
* Copyright(c) 2011-2016 Jake Luer <jake@alogicalparadox.com>
* MIT Licensed
*/
/*!
* Chai - isNaN utility
* Copyright(c) 2012-2015 Sakthipriyan Vairamani <thechargingvolcano@gmail.com>
* MIT Licensed
*/
/*!
* chai
* Copyright(c) 2011 Jake Luer <jake@alogicalparadox.com>
* MIT Licensed
*/
/*!
* chai
* Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
* MIT Licensed
*/
/*! Bundled license information:

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
*/

//#endregion
//#region dist/sensor-TzqXogk2.js
const e$2 = {
	Start: `start`,
	Move: `move`,
	Cancel: `cancel`,
	End: `end`,
	Destroy: `destroy`
};

//#endregion
//#region node_modules/eventti/dist/index.js
var E$1 = {
	ADD: "add",
	UPDATE: "update",
	IGNORE: "ignore",
	THROW: "throw"
}, r$2, v$1 = class {
	constructor(t$6 = {}) {
		this.dedupe = t$6.dedupe || E$1.ADD, this.getId = t$6.getId || (() => Symbol()), this._events = /* @__PURE__ */ new Map();
	}
	_getListeners(t$6) {
		let n$7 = this._events.get(t$6);
		return n$7 ? n$7.l || (n$7.l = [...n$7.m.values()]) : null;
	}
	on(t$6, n$7, e$5) {
		let i$2 = this._events, s$4 = i$2.get(t$6);
		s$4 || (s$4 = {
			m: /* @__PURE__ */ new Map(),
			l: null
		}, i$2.set(t$6, s$4));
		let o$2 = s$4.m;
		if (e$5 = e$5 === r$2 ? this.getId(n$7) : e$5, o$2.has(e$5)) switch (this.dedupe) {
			case E$1.THROW: throw new Error("Eventti: duplicate listener id!");
			case E$1.IGNORE: return e$5;
			case E$1.UPDATE:
				s$4.l = null;
				break;
			default: o$2.delete(e$5), s$4.l = null;
		}
		return o$2.set(e$5, n$7), s$4.l?.push(n$7), e$5;
	}
	once(t$6, n$7, e$5) {
		let i$2 = 0;
		return e$5 = e$5 === r$2 ? this.getId(n$7) : e$5, this.on(t$6, (...s$4) => {
			i$2 || (i$2 = 1, this.off(t$6, e$5), n$7(...s$4));
		}, e$5);
	}
	off(t$6, n$7) {
		if (t$6 === r$2) {
			this._events.clear();
			return;
		}
		if (n$7 === r$2) {
			this._events.delete(t$6);
			return;
		}
		let e$5 = this._events.get(t$6);
		e$5?.m.delete(n$7) && (e$5.l = null, e$5.m.size || this._events.delete(t$6));
	}
	emit(t$6, ...n$7) {
		let e$5 = this._getListeners(t$6);
		if (e$5) {
			let i$2 = e$5.length, s$4 = 0;
			if (n$7.length) for (; s$4 < i$2; s$4++) e$5[s$4](...n$7);
			else for (; s$4 < i$2; s$4++) e$5[s$4]();
		}
	}
	listenerCount(t$6) {
		if (t$6 === r$2) {
			let n$7 = 0;
			return this._events.forEach((e$5) => {
				n$7 += e$5.m.size;
			}), n$7;
		}
		return this._events.get(t$6)?.m.size || 0;
	}
};

//#endregion
//#region dist/base-sensor-cUrlV0_m.js
var n$5 = class {
	constructor() {
		this.drag = null, this.isDestroyed = !1, this._emitter = new v$1();
	}
	_createDragData(e$5) {
		return {
			x: e$5.x,
			y: e$5.y
		};
	}
	_updateDragData(e$5) {
		this.drag && (this.drag.x = e$5.x, this.drag.y = e$5.y);
	}
	_resetDragData() {
		this.drag = null;
	}
	_start(t$6) {
		this.isDestroyed || this.drag || (this.drag = this._createDragData(t$6), this._emitter.emit(e$2.Start, t$6));
	}
	_move(t$6) {
		this.drag && (this._updateDragData(t$6), this._emitter.emit(e$2.Move, t$6));
	}
	_end(t$6) {
		this.drag && (this._updateDragData(t$6), this._emitter.emit(e$2.End, t$6), this._resetDragData());
	}
	_cancel(t$6) {
		this.drag && (this._updateDragData(t$6), this._emitter.emit(e$2.Cancel, t$6), this._resetDragData());
	}
	on(e$5, t$6, n$7) {
		return this._emitter.on(e$5, t$6, n$7);
	}
	off(e$5, t$6) {
		this._emitter.off(e$5, t$6);
	}
	cancel() {
		this.drag && this._cancel({
			type: e$2.Cancel,
			x: this.drag.x,
			y: this.drag.y
		});
	}
	destroy() {
		this.isDestroyed || (this.isDestroyed = !0, this.cancel(), this._emitter.emit(e$2.Destroy, { type: e$2.Destroy }), this._emitter.off());
	}
};

//#endregion
//#region tests/src/base-sensor/methods/_cancel.ts
function methodProtectedCancel() {
	describe("_cancel", () => {
		it(`should reset drag data`, () => {
			const s$4 = new n$5();
			s$4["_start"]({
				type: "start",
				x: 1,
				y: 2
			});
			s$4["_cancel"]({
				type: "cancel",
				x: 5,
				y: 6
			});
			assert.equal(s$4.drag, null);
			s$4.destroy();
		});
		it(`should not modify isDestroyed property`, () => {
			const s$4 = new n$5();
			s$4["_start"]({
				type: "start",
				x: 1,
				y: 2
			});
			assert.equal(s$4.isDestroyed, false);
			s$4["_cancel"]({
				type: "cancel",
				x: 5,
				y: 6
			});
			assert.equal(s$4.isDestroyed, false);
			s$4.destroy();
		});
		it(`should emit "cancel" event with correct arguments after updating instance properties`, () => {
			const s$4 = new n$5();
			const cancelArgs = {
				type: "cancel",
				x: 5,
				y: 6
			};
			let emitCount = 0;
			s$4.on("cancel", (data) => {
				assert.deepEqual(s$4.drag, {
					x: data.x,
					y: data.y
				});
				assert.equal(s$4.isDestroyed, false);
				assert.deepEqual(data, cancelArgs);
				++emitCount;
			});
			s$4["_start"]({
				type: "start",
				x: 1,
				y: 2
			});
			s$4["_cancel"](cancelArgs);
			assert.equal(emitCount, 1);
			s$4.destroy();
		});
		it(`should not do anything if drag is not active`, () => {
			const s$4 = new n$5();
			const { drag, isDestroyed } = s$4;
			let emitCount = 0;
			s$4.on("cancel", () => void ++emitCount);
			s$4["_cancel"]({
				type: "cancel",
				x: 3,
				y: 4
			});
			assert.deepEqual(s$4.drag, drag);
			assert.equal(s$4.isDestroyed, isDestroyed);
			assert.equal(emitCount, 0);
			s$4.destroy();
		});
	});
}

//#endregion
//#region tests/src/base-sensor/methods/_end.ts
function methodProtectedEnd() {
	describe("_end", () => {
		it(`should reset drag data`, () => {
			const s$4 = new n$5();
			s$4["_start"]({
				type: "start",
				x: 1,
				y: 2
			});
			s$4["_end"]({
				type: "end",
				x: 5,
				y: 6
			});
			assert.equal(s$4.drag, null);
			s$4.destroy();
		});
		it(`should not modify isDestroyed property`, () => {
			const s$4 = new n$5();
			s$4["_start"]({
				type: "start",
				x: 1,
				y: 2
			});
			assert.equal(s$4.isDestroyed, false);
			s$4["_end"]({
				type: "end",
				x: 5,
				y: 6
			});
			assert.equal(s$4.isDestroyed, false);
			s$4.destroy();
		});
		it(`should emit "end" event with correct arguments after updating instance properties`, () => {
			const s$4 = new n$5();
			const endArgs = {
				type: "end",
				x: 5,
				y: 6
			};
			let emitCount = 0;
			s$4.on("end", (data) => {
				assert.deepEqual(s$4.drag, {
					x: data.x,
					y: data.y
				});
				assert.equal(s$4.isDestroyed, false);
				assert.deepEqual(data, endArgs);
				++emitCount;
			});
			s$4["_start"]({
				type: "start",
				x: 1,
				y: 2
			});
			s$4["_end"](endArgs);
			assert.equal(emitCount, 1);
			s$4.destroy();
		});
		it(`should not do anything if drag is not active`, () => {
			const s$4 = new n$5();
			const { drag, isDestroyed } = s$4;
			let emitCount = 0;
			s$4.on("end", () => void ++emitCount);
			s$4["_end"]({
				type: "end",
				x: 3,
				y: 4
			});
			assert.deepEqual(s$4.drag, drag);
			assert.equal(s$4.isDestroyed, isDestroyed);
			assert.equal(emitCount, 0);
			s$4.destroy();
		});
	});
}

//#endregion
//#region tests/src/base-sensor/methods/_move.ts
function methodProtectedMove() {
	describe("_move", () => {
		it(`should update drag data to reflect the provided coordinates`, () => {
			const s$4 = new n$5();
			s$4["_start"]({
				type: "start",
				x: 1,
				y: 2
			});
			s$4["_move"]({
				type: "move",
				x: 3,
				y: 4
			});
			assert.deepEqual(s$4.drag, {
				x: 3,
				y: 4
			});
			s$4.destroy();
		});
		it(`should not modify isDestroyed property`, () => {
			const s$4 = new n$5();
			s$4["_start"]({
				type: "start",
				x: 1,
				y: 2
			});
			assert.equal(s$4.isDestroyed, false);
			s$4["_move"]({
				type: "move",
				x: 3,
				y: 4
			});
			assert.equal(s$4.isDestroyed, false);
			s$4.destroy();
		});
		it(`should emit "move" event with correct arguments after updating instance properties`, () => {
			const s$4 = new n$5();
			const moveArgs = {
				type: "move",
				x: 3,
				y: 4
			};
			let emitCount = 0;
			s$4.on("move", (data) => {
				assert.deepEqual(s$4.drag, {
					x: data.x,
					y: data.y
				});
				assert.equal(s$4.isDestroyed, false);
				assert.deepEqual(data, moveArgs);
				++emitCount;
			});
			s$4["_start"]({
				type: "start",
				x: 1,
				y: 2
			});
			s$4["_move"](moveArgs);
			assert.equal(emitCount, 1);
			s$4.destroy();
		});
		it(`should not do anything if drag is not active`, () => {
			const s$4 = new n$5();
			const { drag, isDestroyed } = s$4;
			let emitCount = 0;
			s$4.on("move", () => void ++emitCount);
			s$4["_move"]({
				type: "move",
				x: 3,
				y: 4
			});
			assert.deepEqual(s$4.drag, drag);
			assert.equal(s$4.isDestroyed, isDestroyed);
			assert.equal(emitCount, 0);
			s$4.destroy();
		});
	});
}

//#endregion
//#region tests/src/base-sensor/methods/_start.ts
function methodProtectedStart() {
	describe("_start", () => {
		it(`should create drag data`, () => {
			const s$4 = new n$5();
			s$4["_start"]({
				type: "start",
				x: 1,
				y: 2
			});
			assert.deepEqual(s$4.drag, {
				x: 1,
				y: 2
			});
			s$4.destroy();
		});
		it(`should not modify isDestroyed property`, () => {
			const s$4 = new n$5();
			assert.equal(s$4.isDestroyed, false);
			s$4["_start"]({
				type: "start",
				x: 1,
				y: 2
			});
			assert.equal(s$4.isDestroyed, false);
			s$4.destroy();
		});
		it(`should emit "start" event with correct arguments after updating instance properties`, () => {
			const s$4 = new n$5();
			const startArgs = {
				type: "start",
				x: 1,
				y: 2
			};
			let emitCount = 0;
			s$4.on("start", (data) => {
				assert.deepEqual(s$4.drag, {
					x: data.x,
					y: data.y
				});
				assert.equal(s$4.isDestroyed, false);
				assert.deepEqual(data, startArgs);
				++emitCount;
			});
			s$4["_start"](startArgs);
			assert.equal(emitCount, 1);
			s$4.destroy();
		});
		it(`should not do anything if drag is already active`, () => {
			const s$4 = new n$5();
			let emitCount = 0;
			s$4.on("start", () => void ++emitCount);
			s$4["_start"]({
				type: "start",
				x: 1,
				y: 2
			});
			const isDestroyed = s$4.isDestroyed;
			const { drag } = s$4;
			s$4["_start"]({
				type: "start",
				x: 3,
				y: 4
			});
			assert.deepEqual(s$4.drag, drag);
			assert.equal(s$4.isDestroyed, isDestroyed);
			assert.equal(emitCount, 1);
			s$4.destroy();
		});
		it(`should not do anything if instance is destroyed (isDestroyed is true)`, () => {
			const s$4 = new n$5();
			let emitCount = 0;
			s$4.on("start", () => void ++emitCount);
			s$4.destroy();
			const { drag, isDestroyed } = s$4;
			s$4["_start"]({
				type: "start",
				x: 3,
				y: 4
			});
			assert.deepEqual(s$4.drag, drag);
			assert.equal(s$4.isDestroyed, isDestroyed);
			assert.equal(emitCount, 0);
			s$4.destroy();
		});
	});
}

//#endregion
//#region tests/src/base-sensor/methods/cancel.ts
function methodCancel$2() {
	describe("cancel", () => {
		it(`should reset drag data`, () => {
			const s$4 = new n$5();
			s$4["_start"]({
				type: "start",
				x: 1,
				y: 2
			});
			s$4.cancel();
			assert.equal(s$4.drag, null);
			s$4.destroy();
		});
		it(`should not modify isDestroyed property`, () => {
			const s$4 = new n$5();
			s$4["_start"]({
				type: "start",
				x: 1,
				y: 2
			});
			assert.equal(s$4.isDestroyed, false);
			s$4.cancel();
			assert.equal(s$4.isDestroyed, false);
			s$4.destroy();
		});
		it(`should emit "cancel" event with correct arguments after updating instance properties`, () => {
			const s$4 = new n$5();
			let emitCount = 0;
			s$4.on("cancel", (data) => {
				assert.deepEqual(s$4.drag, {
					x: data.x,
					y: data.y
				});
				assert.equal(s$4.isDestroyed, false);
				assert.deepEqual(data, {
					type: "cancel",
					x: 1,
					y: 2
				});
				++emitCount;
			});
			s$4["_start"]({
				type: "start",
				x: 1,
				y: 2
			});
			s$4.cancel();
			assert.equal(emitCount, 1);
			s$4.destroy();
		});
		it(`should not do anything if drag is not active`, () => {
			const s$4 = new n$5();
			const { drag, isDestroyed } = s$4;
			let emitCount = 0;
			s$4.on("cancel", () => void ++emitCount);
			s$4.cancel();
			assert.deepEqual(s$4.drag, drag);
			assert.equal(s$4.isDestroyed, isDestroyed);
			assert.equal(emitCount, 0);
			s$4.destroy();
		});
	});
}

//#endregion
//#region tests/src/base-sensor/methods/destroy.ts
function methodDestroy$3() {
	describe("destroy", () => {
		it(`should (if drag is active):
       1. set isDestroyed property to true
       2. emit "cancel" event with the current x/y coordinates
       3. reset drag data
       4. emit "destroy" event
       5. remove all listeners from the internal emitter`, () => {
			const s$4 = new n$5();
			s$4["_start"]({
				type: "start",
				x: 1,
				y: 2
			});
			let msgs = [];
			s$4.on("cancel", () => void msgs.push("cancel"));
			s$4.on("destroy", () => void msgs.push("destroy"));
			s$4.destroy();
			assert.equal(s$4.isDestroyed, true);
			assert.equal(s$4.drag, null);
			assert.deepEqual(msgs, ["cancel", "destroy"]);
		});
		it(`should (if drag is not active):
       1. set isDestroyed property to true
       2. emit "destroy" event
       3. remove all listeners from the internal emitter`, () => {
			const s$4 = new n$5();
			let msgs = [];
			s$4.on("cancel", () => void msgs.push("cancel"));
			s$4.on("destroy", () => void msgs.push("destroy"));
			s$4.destroy();
			assert.equal(s$4.isDestroyed, true);
			assert.equal(s$4.drag, null);
			assert.deepEqual(msgs, ["destroy"]);
		});
		it(`should not do anything if the sensor is already destroyed`, () => {
			const s$4 = new n$5();
			s$4.destroy();
			const { drag, isDestroyed } = s$4;
			s$4.destroy();
			assert.deepEqual(s$4.drag, drag);
			assert.equal(s$4.isDestroyed, isDestroyed);
		});
	});
}

//#endregion
//#region tests/src/base-sensor/methods/off.ts
function methodOff$3() {
	describe("off", () => {
		it("should remove an event listener based on id", () => {
			const s$4 = new n$5();
			let msg = "";
			const idA = s$4.on("start", () => void (msg += "a"));
			s$4.on("start", () => void (msg += "b"));
			s$4.off("start", idA);
			s$4["_start"]({
				type: "start",
				x: 1,
				y: 2
			});
			assert.equal(msg, "b");
			s$4.destroy();
		});
	});
}

//#endregion
//#region tests/src/base-sensor/methods/on.ts
function methodOn$3() {
	describe("on", () => {
		it("should return a unique symbol by default", () => {
			const s$4 = new n$5();
			const idA = s$4.on("start", () => {});
			const idB = s$4.on("start", () => {});
			assert.equal(typeof idA, "symbol");
			assert.notEqual(idA, idB);
			s$4.destroy();
		});
		it("should allow duplicate event listeners", () => {
			const s$4 = new n$5();
			let counter = 0;
			const listener = () => {
				++counter;
			};
			s$4.on("start", listener);
			s$4.on("start", listener);
			s$4["_start"]({
				type: "start",
				x: 1,
				y: 2
			});
			assert.equal(counter, 2);
			s$4.destroy();
		});
		it("should remove the existing listener and add the new one if the same id is used", () => {
			const s$4 = new n$5();
			let msg = "";
			s$4.on("start", () => void (msg += "a"), 1);
			s$4.on("start", () => void (msg += "b"), 2);
			s$4.on("start", () => void (msg += "c"), 1);
			s$4["_start"]({
				type: "start",
				x: 1,
				y: 2
			});
			assert.equal(msg, "bc");
			s$4.destroy();
		});
		it("should allow defining a custom id (string/symbol/number) for the event listener via third argument", () => {
			const s$4 = new n$5();
			const idA = Symbol();
			assert.equal(s$4.on("start", () => {}, idA), idA);
			const idB = 1;
			assert.equal(s$4.on("start", () => {}, idB), idB);
			const idC = "foo";
			assert.equal(s$4.on("start", () => {}, idC), idC);
			s$4.destroy();
		});
	});
}

//#endregion
//#region tests/src/base-sensor/methods/index.ts
function methods$4() {
	describe("methods", () => {
		methodProtectedCancel();
		methodProtectedEnd();
		methodProtectedMove();
		methodProtectedStart();
		methodCancel$2();
		methodDestroy$3();
		methodOff$3();
		methodOn$3();
	});
}

//#endregion
//#region tests/src/base-sensor/properties/drag.ts
function propDrag$2() {
	describe("drag", () => {
		it(`should be null on init`, () => {
			const s$4 = new n$5();
			assert.equal(s$4.drag, null);
			s$4.destroy();
		});
		it(`should contain drag data during drag`, () => {
			const s$4 = new n$5();
			s$4["_start"]({
				type: "start",
				x: 0,
				y: 0
			});
			assert.deepEqual(s$4.drag, {
				x: 0,
				y: 0
			});
			s$4.destroy();
		});
	});
}

//#endregion
//#region tests/src/base-sensor/properties/is-destroyed.ts
function propIsDestroyed$2() {
	describe("isDestroyed", () => {
		it(`should be false on init`, () => {
			const s$4 = new n$5();
			assert.equal(s$4.isDestroyed, false);
			s$4.destroy();
		});
		it(`should be true after destroy method is called`, () => {
			const s$4 = new n$5();
			s$4.destroy();
			assert.equal(s$4.isDestroyed, true);
		});
	});
}

//#endregion
//#region tests/src/base-sensor/properties/index.ts
function properties$2() {
	describe("properties", () => {
		propDrag$2();
		propIsDestroyed$2();
	});
}

//#endregion
//#region tests/src/base-sensor/index.ts
describe("BaseSensor", () => {
	methods$4();
	properties$2();
});

//#endregion
//#region tests/src/utils/create-test-element.ts
const defaultStyles = {
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
function createTestElement(styles$1 = {}) {
	const el = document.createElement("div");
	el.tabIndex = 0;
	Object.assign(el.style, {
		...defaultStyles,
		...styles$1
	});
	document.body.appendChild(el);
	return el;
}

//#endregion
//#region tests/src/utils/focus-element.ts
function focusElement(element) {
	if (document.activeElement !== element) {
		element.focus({ preventScroll: true });
		element.dispatchEvent(new FocusEvent("focus", {
			bubbles: false,
			cancelable: true
		}));
	}
}

//#endregion
//#region tests/src/utils/wait-next-frame.ts
function waitNextFrame() {
	return new Promise((resolve) => {
		window.requestAnimationFrame(() => {
			resolve(void 0);
		});
	});
}

//#endregion
//#region node_modules/tikki/dist/index.js
var _$2 = E$1, o$1 = class {
	constructor(e$5 = {}) {
		let { phases: t$6 = [], dedupe: r$3, getId: s$4 } = e$5;
		this._phases = t$6, this._emitter = new v$1({
			getId: s$4,
			dedupe: r$3
		}), this._queue = [], this.tick = this.tick.bind(this), this._getListeners = this._emitter._getListeners.bind(this._emitter);
	}
	get phases() {
		return this._phases;
	}
	set phases(e$5) {
		this._phases = e$5;
	}
	get dedupe() {
		return this._emitter.dedupe;
	}
	set dedupe(e$5) {
		this._emitter.dedupe = e$5;
	}
	get getId() {
		return this._emitter.getId;
	}
	set getId(e$5) {
		this._emitter.getId = e$5;
	}
	tick(...e$5) {
		this._assertEmptyQueue(), this._fillQueue(), this._processQueue(...e$5);
	}
	on(e$5, t$6, r$3) {
		return this._emitter.on(e$5, t$6, r$3);
	}
	once(e$5, t$6, r$3) {
		return this._emitter.once(e$5, t$6, r$3);
	}
	off(e$5, t$6) {
		return this._emitter.off(e$5, t$6);
	}
	count(e$5) {
		return this._emitter.listenerCount(e$5);
	}
	_assertEmptyQueue() {
		if (this._queue.length) throw new Error("Ticker: Can't tick before the previous tick has finished!");
	}
	_fillQueue() {
		let e$5 = this._queue, t$6 = this._phases, r$3 = this._getListeners, s$4 = 0, a$2 = t$6.length, n$7;
		for (; s$4 < a$2; s$4++) n$7 = r$3(t$6[s$4]), n$7 && e$5.push(n$7);
		return e$5;
	}
	_processQueue(...e$5) {
		let t$6 = this._queue, r$3 = t$6.length;
		if (!r$3) return;
		let s$4 = 0, a$2 = 0, n$7, c$4;
		for (; s$4 < r$3; s$4++) for (n$7 = t$6[s$4], a$2 = 0, c$4 = n$7.length; a$2 < c$4; a$2++) n$7[a$2](...e$5);
		t$6.length = 0;
	}
};
function u$4(i$2 = 60) {
	if (typeof requestAnimationFrame == "function" && typeof cancelAnimationFrame == "function") return (e$5) => {
		let t$6 = requestAnimationFrame(e$5);
		return () => cancelAnimationFrame(t$6);
	};
	{
		let e$5 = 1e3 / i$2, t$6 = typeof performance > "u" ? () => Date.now() : () => performance.now();
		return (r$3) => {
			let s$4 = setTimeout(() => r$3(t$6()), e$5);
			return () => clearTimeout(s$4);
		};
	}
}
var l$4 = class extends o$1 {
	constructor(e$5 = {}) {
		let { paused: t$6 = !1, onDemand: r$3 = !1, requestFrame: s$4 = u$4(),...a$2 } = e$5;
		super(a$2), this._paused = t$6, this._onDemand = r$3, this._requestFrame = s$4, this._cancelFrame = null, this._empty = !0, !t$6 && !r$3 && this._request();
	}
	get phases() {
		return this._phases;
	}
	set phases(e$5) {
		this._phases = e$5, e$5.length ? (this._empty = !1, this._request()) : this._empty = !0;
	}
	get paused() {
		return this._paused;
	}
	set paused(e$5) {
		this._paused = e$5, e$5 ? this._cancel() : this._request();
	}
	get onDemand() {
		return this._onDemand;
	}
	set onDemand(e$5) {
		this._onDemand = e$5, e$5 || this._request();
	}
	get requestFrame() {
		return this._requestFrame;
	}
	set requestFrame(e$5) {
		this._requestFrame !== e$5 && (this._requestFrame = e$5, this._cancelFrame && (this._cancel(), this._request()));
	}
	tick(...e$5) {
		if (this._assertEmptyQueue(), this._cancelFrame = null, this._onDemand || this._request(), !this._empty) {
			if (!this._fillQueue().length) {
				this._empty = !0;
				return;
			}
			this._onDemand && this._request(), this._processQueue(...e$5);
		}
	}
	on(e$5, t$6, r$3) {
		let s$4 = super.on(e$5, t$6, r$3);
		return this._empty = !1, this._request(), s$4;
	}
	once(e$5, t$6, r$3) {
		let s$4 = super.once(e$5, t$6, r$3);
		return this._empty = !1, this._request(), s$4;
	}
	_request() {
		this._paused || this._cancelFrame || (this._cancelFrame = this._requestFrame(this.tick));
	}
	_cancel() {
		this._cancelFrame && (this._cancelFrame(), this._cancelFrame = null);
	}
};

//#endregion
//#region dist/ticker-EaCO7G8S.js
const t$2 = {
	read: Symbol(),
	write: Symbol()
};
let n$2 = new l$4({ phases: [t$2.read, t$2.write] });

//#endregion
//#region dist/constants-BG0DGMmK.js
const e$3 = typeof window < `u` && window.document !== void 0, t$5 = e$3 && `ontouchstart` in window, n$4 = e$3 && !!window.PointerEvent;
e$3 && navigator.vendor && navigator.vendor.indexOf(`Apple`) > -1 && navigator.userAgent && navigator.userAgent.indexOf(`CriOS`) == -1 && navigator.userAgent.indexOf(`FxiOS`);

//#endregion
//#region dist/get-style-e3zfxW9-.js
const e$4 = /* @__PURE__ */ new WeakMap();
function t(t$6) {
	let n$7 = e$4.get(t$6)?.deref();
	return n$7 || (n$7 = window.getComputedStyle(t$6, null), e$4.set(t$6, new WeakRef(n$7))), n$7;
}

//#endregion
//#region node_modules/mezr/dist/esm/utils/getStyle.js
const STYLE_DECLARATION_CACHE = /* @__PURE__ */ new WeakMap();
function getStyle(e$5, t$6) {
	if (t$6) return window.getComputedStyle(e$5, t$6);
	let C$1 = STYLE_DECLARATION_CACHE.get(e$5)?.deref();
	return C$1 || (C$1 = window.getComputedStyle(e$5, null), STYLE_DECLARATION_CACHE.set(e$5, new WeakRef(C$1))), C$1;
}

//#endregion
//#region node_modules/mezr/dist/esm/utils/constants.js
const IS_BROWSER = "undefined" != typeof window && void 0 !== window.document;
const IS_SAFARI = !!(IS_BROWSER && navigator.vendor && navigator.vendor.indexOf("Apple") > -1 && navigator.userAgent && -1 == navigator.userAgent.indexOf("CriOS") && -1 == navigator.userAgent.indexOf("FxiOS"));
const BOX_EDGE = {
	content: "content",
	padding: "padding",
	scrollbar: "scrollbar",
	border: "border",
	margin: "margin"
};
const INCLUDE_WINDOW_SCROLLBAR = {
	[BOX_EDGE.content]: !1,
	[BOX_EDGE.padding]: !1,
	[BOX_EDGE.scrollbar]: !0,
	[BOX_EDGE.border]: !0,
	[BOX_EDGE.margin]: !0
};
const SCROLLABLE_OVERFLOWS = new Set(["auto", "scroll"]);
const IS_CHROMIUM = (() => {
	try {
		return window.navigator.userAgentData.brands.some((({ brand: n$7 }) => "Chromium" === n$7));
	} catch (n$7) {
		return !1;
	}
})();

//#endregion
//#region node_modules/mezr/dist/esm/utils/isBlockElement.js
function isBlockElement(e$5) {
	switch (getStyle(e$5).display) {
		case "none": return null;
		case "inline":
		case "contents": return !1;
		default: return !0;
	}
}

//#endregion
//#region node_modules/mezr/dist/esm/utils/isContainingBlockForFixedElement.js
function isContainingBlockForFixedElement(n$7) {
	const t$6 = getStyle(n$7);
	if (!IS_SAFARI) {
		const { filter: n$8 } = t$6;
		if (n$8 && "none" !== n$8) return !0;
		const { backdropFilter: e$6 } = t$6;
		if (e$6 && "none" !== e$6) return !0;
		const { willChange: i$3 } = t$6;
		if (i$3 && (i$3.indexOf("filter") > -1 || i$3.indexOf("backdrop-filter") > -1)) return !0;
	}
	const e$5 = isBlockElement(n$7);
	if (!e$5) return e$5;
	const { transform: i$2 } = t$6;
	if (i$2 && "none" !== i$2) return !0;
	const { perspective: r$3 } = t$6;
	if (r$3 && "none" !== r$3) return !0;
	const { contentVisibility: o$2 } = t$6;
	if (o$2 && "auto" === o$2) return !0;
	const { contain: f$2 } = t$6;
	if (f$2 && ("strict" === f$2 || "content" === f$2 || f$2.indexOf("paint") > -1 || f$2.indexOf("layout") > -1)) return !0;
	const { willChange: c$4 } = t$6;
	return !(!c$4 || !(c$4.indexOf("transform") > -1 || c$4.indexOf("perspective") > -1 || c$4.indexOf("contain") > -1)) || !!(IS_SAFARI && c$4 && c$4.indexOf("filter") > -1);
}

//#endregion
//#region node_modules/mezr/dist/esm/utils/isContainingBlockForAbsoluteElement.js
function isContainingBlockForAbsoluteElement(t$6) {
	return "static" !== getStyle(t$6).position || isContainingBlockForFixedElement(t$6);
}

//#endregion
//#region node_modules/mezr/dist/esm/utils/isDocumentElement.js
function isDocumentElement(e$5) {
	return e$5 instanceof HTMLHtmlElement;
}

//#endregion
//#region node_modules/mezr/dist/esm/getContainingBlock.js
function getContainingBlock(e$5, t$6 = {}) {
	if (isDocumentElement(e$5)) return e$5.ownerDocument.defaultView;
	const n$7 = t$6.position || getStyle(e$5).position, { skipDisplayNone: i$2, container: o$2 } = t$6;
	switch (n$7) {
		case "static":
		case "relative":
		case "sticky":
		case "-webkit-sticky": {
			let t$7 = o$2 || e$5.parentElement;
			for (; t$7;) {
				const e$6 = isBlockElement(t$7);
				if (e$6) return t$7;
				if (null === e$6 && !i$2) return null;
				t$7 = t$7.parentElement;
			}
			return e$5.ownerDocument.documentElement;
		}
		case "absolute":
		case "fixed": {
			const t$7 = "fixed" === n$7;
			let l$5 = o$2 || e$5.parentElement;
			for (; l$5;) {
				const e$6 = t$7 ? isContainingBlockForFixedElement(l$5) : isContainingBlockForAbsoluteElement(l$5);
				if (!0 === e$6) return l$5;
				if (null === e$6 && !i$2) return null;
				l$5 = l$5.parentElement;
			}
			return e$5.ownerDocument.defaultView;
		}
		default: return null;
	}
}

//#endregion
//#region node_modules/mezr/dist/esm/utils/isWindow.js
function isWindow(n$7) {
	return n$7 instanceof Window;
}

//#endregion
//#region node_modules/mezr/dist/esm/getOffsetContainer.js
function getOffsetContainer(n$7, t$6 = {}) {
	const { display: o$2 } = getStyle(n$7);
	if ("none" === o$2 || "contents" === o$2) return null;
	const e$5 = t$6.position || getStyle(n$7).position, { skipDisplayNone: s$4, container: r$3 } = t$6;
	switch (e$5) {
		case "relative": return n$7;
		case "fixed": return getContainingBlock(n$7, {
			container: r$3,
			position: e$5,
			skipDisplayNone: s$4
		});
		case "absolute": {
			const t$7 = getContainingBlock(n$7, {
				container: r$3,
				position: e$5,
				skipDisplayNone: s$4
			});
			return isWindow(t$7) ? n$7.ownerDocument : t$7;
		}
		default: return null;
	}
}

//#endregion
//#region dist/draggable-CAyDmcAi.js
var s$3 = class {
	constructor() {
		this._cache = /* @__PURE__ */ new Map(), this._validation = /* @__PURE__ */ new Map();
	}
	set(e$5, t$6) {
		this._cache.set(e$5, t$6), this._validation.set(e$5, void 0);
	}
	get(e$5) {
		return this._cache.get(e$5);
	}
	has(e$5) {
		return this._cache.has(e$5);
	}
	delete(e$5) {
		this._cache.delete(e$5), this._validation.delete(e$5);
	}
	isValid(e$5) {
		return this._validation.has(e$5);
	}
	invalidate(e$5) {
		e$5 === void 0 ? this._validation.clear() : this._validation.delete(e$5);
	}
	clear() {
		this._cache.clear(), this._validation.clear();
	}
}, c$3 = class {
	constructor(e$5, t$6) {
		this.sensor = e$5, this.startEvent = t$6, this.prevMoveEvent = t$6, this.moveEvent = t$6, this.endEvent = null, this.items = [], this.isEnded = !1, this._matrixCache = new s$3(), this._clientOffsetCache = new s$3();
	}
};
function l$3(e$5, t$6 = {
	x: 0,
	y: 0
}) {
	if (t$6.x = 0, t$6.y = 0, e$5 instanceof Window) return t$6;
	if (e$5 instanceof Document) return t$6.x = window.scrollX * -1, t$6.y = window.scrollY * -1, t$6;
	let { x: n$7, y: r$3 } = e$5.getBoundingClientRect(), a$2 = t(e$5);
	return t$6.x = n$7 + (parseFloat(a$2.borderLeftWidth) || 0), t$6.y = r$3 + (parseFloat(a$2.borderTopWidth) || 0), t$6;
}
function u$3(e$5) {
	return typeof e$5 == `object` && !!e$5 && `x` in e$5 && `y` in e$5;
}
const d$1 = {
	x: 0,
	y: 0
}, f$1 = {
	x: 0,
	y: 0
};
function p$1(e$5, t$6, n$7 = {
	x: 0,
	y: 0
}) {
	let r$3 = u$3(e$5) ? e$5 : l$3(e$5, d$1), i$2 = u$3(t$6) ? t$6 : l$3(t$6, f$1);
	return n$7.x = i$2.x - r$3.x, n$7.y = i$2.y - r$3.y, n$7;
}
function m$1(e$5) {
	let t$6 = t(e$5), n$7 = parseFloat(t$6.height) || 0;
	return t$6.boxSizing === `border-box` ? n$7 : (n$7 += parseFloat(t$6.borderTopWidth) || 0, n$7 += parseFloat(t$6.borderBottomWidth) || 0, n$7 += parseFloat(t$6.paddingTop) || 0, n$7 += parseFloat(t$6.paddingBottom) || 0, e$5 instanceof HTMLElement && (n$7 += e$5.offsetHeight - e$5.clientHeight), n$7);
}
function h$1(e$5) {
	let t$6 = t(e$5), n$7 = parseFloat(t$6.width) || 0;
	return t$6.boxSizing === `border-box` ? n$7 : (n$7 += parseFloat(t$6.borderLeftWidth) || 0, n$7 += parseFloat(t$6.borderRightWidth) || 0, n$7 += parseFloat(t$6.paddingLeft) || 0, n$7 += parseFloat(t$6.paddingRight) || 0, e$5 instanceof HTMLElement && (n$7 += e$5.offsetWidth - e$5.clientWidth), n$7);
}
function g$1(e$5, t$6 = !1) {
	let { translate: n$7, rotate: r$3, scale: a$2, transform: o$2 } = t(e$5), s$4 = ``;
	if (n$7 && n$7 !== `none`) {
		let [t$7 = `0px`, r$4 = `0px`, i$2] = n$7.split(` `);
		t$7.includes(`%`) && (t$7 = `${parseFloat(t$7) / 100 * h$1(e$5)}px`), r$4.includes(`%`) && (r$4 = `${parseFloat(r$4) / 100 * m$1(e$5)}px`), i$2 ? s$4 += `translate3d(${t$7},${r$4},${i$2})` : s$4 += `translate(${t$7},${r$4})`;
	}
	if (r$3 && r$3 !== `none`) {
		let e$6 = r$3.split(` `);
		e$6.length > 1 ? s$4 += `rotate3d(${e$6.join(`,`)})` : s$4 += `rotate(${e$6.join(`,`)})`;
	}
	if (a$2 && a$2 !== `none`) {
		let e$6 = a$2.split(` `);
		e$6.length === 3 ? s$4 += `scale3d(${e$6.join(`,`)})` : s$4 += `scale(${e$6.join(`,`)})`;
	}
	return !t$6 && o$2 && o$2 !== `none` && (s$4 += o$2), s$4;
}
function _$1(e$5) {
	let t$6 = e$5.split(` `), n$7 = ``, r$3 = ``, i$2 = ``;
	return t$6.length === 1 ? n$7 = r$3 = t$6[0] : t$6.length === 2 ? [n$7, r$3] = t$6 : [n$7, r$3, i$2] = t$6, {
		x: parseFloat(n$7) || 0,
		y: parseFloat(r$3) || 0,
		z: parseFloat(i$2) || 0
	};
}
function v$2(e$5) {
	return e$5.setMatrixValue(`scale(1, 1)`);
}
const y$1 = e$3 ? new DOMMatrix() : null;
function b(e$5, t$6 = new DOMMatrix()) {
	let n$7 = e$5;
	for (v$2(t$6); n$7;) {
		let e$6 = g$1(n$7);
		if (e$6 && (y$1.setMatrixValue(e$6), !y$1.isIdentity)) {
			let { transformOrigin: e$7 } = t(n$7), { x: r$3, y: a$2, z: o$2 } = _$1(e$7);
			o$2 === 0 ? y$1.setMatrixValue(`translate(${r$3}px,${a$2}px) ${y$1} translate(${r$3 * -1}px,${a$2 * -1}px)`) : y$1.setMatrixValue(`translate3d(${r$3}px,${a$2}px,${o$2}px) ${y$1} translate3d(${r$3 * -1}px,${a$2 * -1}px,${o$2 * -1}px)`), t$6.preMultiplySelf(y$1);
		}
		n$7 = n$7.parentElement;
	}
	return t$6;
}
function x(e$5, t$6, n$7 = !1) {
	let { style: r$3 } = e$5;
	for (let e$6 in t$6) r$3.setProperty(e$6, t$6[e$6], n$7 ? `important` : ``);
}
function S() {
	let e$5 = document.createElement(`div`);
	return e$5.classList.add(`dragdoll-measure`), x(e$5, {
		display: `block`,
		position: `absolute`,
		inset: `0px`,
		padding: `0px`,
		margin: `0px`,
		border: `none`,
		opacity: `0`,
		transform: `none`,
		"transform-origin": `0 0`,
		transition: `none`,
		animation: `none`,
		"pointer-events": `none`
	}, !0), e$5;
}
function C(e$5) {
	return e$5.m11 !== 1 || e$5.m12 !== 0 || e$5.m13 !== 0 || e$5.m14 !== 0 || e$5.m21 !== 0 || e$5.m22 !== 1 || e$5.m23 !== 0 || e$5.m24 !== 0 || e$5.m31 !== 0 || e$5.m32 !== 0 || e$5.m33 !== 1 || e$5.m34 !== 0 || e$5.m43 !== 0 || e$5.m44 !== 1;
}
const w = e$3 ? S() : null;
var T = class {
	constructor(e$5, t$6) {
		if (!e$5.isConnected) throw Error(`Element is not connected`);
		let { drag: n$7 } = t$6;
		if (!n$7) throw Error(`Drag is not defined`);
		let r$3 = t(e$5), a$2 = e$5.getBoundingClientRect(), s$4 = g$1(e$5, !0);
		this.data = {}, this.element = e$5, this.elementTransformOrigin = _$1(r$3.transformOrigin), this.elementTransformMatrix = new DOMMatrix().setMatrixValue(s$4 + r$3.transform), this.elementOffsetMatrix = new DOMMatrix(s$4).invertSelf(), this.frozenStyles = null, this.unfrozenStyles = null, this.position = {
			x: 0,
			y: 0
		}, this.containerOffset = {
			x: 0,
			y: 0
		}, this.alignmentOffset = {
			x: 0,
			y: 0
		}, this._moveDiff = {
			x: 0,
			y: 0
		}, this._alignDiff = {
			x: 0,
			y: 0
		}, this._matrixCache = n$7._matrixCache, this._clientOffsetCache = n$7._clientOffsetCache;
		let c$4 = e$5.parentElement;
		if (!c$4) throw Error(`Dragged element does not have a parent element.`);
		this.elementContainer = c$4;
		let l$5 = t$6.settings.container || c$4;
		if (this.dragContainer = l$5, c$4 !== l$5) {
			let { position: e$6 } = r$3;
			if (e$6 !== `fixed` && e$6 !== `absolute`) throw Error(`Dragged element has "${e$6}" position, but only "fixed" or "absolute" are allowed when using a custom drag container.`);
		}
		let u$5 = getOffsetContainer(e$5) || e$5;
		this.elementOffsetContainer = u$5, this.dragOffsetContainer = l$5 === c$4 ? u$5 : getOffsetContainer(e$5, { container: l$5 });
		{
			let { width: e$6, height: t$7, x: n$8, y: r$4 } = a$2;
			this.clientRect = {
				width: e$6,
				height: t$7,
				x: n$8,
				y: r$4
			};
		}
		this._updateContainerMatrices(), this._updateContainerOffset();
		let d$2 = t$6.settings.frozenStyles({
			draggable: t$6,
			drag: n$7,
			item: this,
			style: r$3
		});
		if (Array.isArray(d$2)) if (d$2.length) {
			let e$6 = {};
			for (let t$7 of d$2) e$6[t$7] = r$3[t$7];
			this.frozenStyles = e$6;
		} else this.frozenStyles = null;
		else this.frozenStyles = d$2;
		if (this.frozenStyles) {
			let t$7 = {};
			for (let n$8 in this.frozenStyles) this.frozenStyles.hasOwnProperty(n$8) && (t$7[n$8] = e$5.style[n$8]);
			this.unfrozenStyles = t$7;
		}
	}
	_updateContainerMatrices() {
		[this.elementContainer, this.dragContainer].forEach((e$5) => {
			if (!this._matrixCache.isValid(e$5)) {
				let t$6 = this._matrixCache.get(e$5) || [new DOMMatrix(), new DOMMatrix()], [n$7, r$3] = t$6;
				b(e$5, n$7), r$3.setMatrixValue(n$7.toString()).invertSelf(), this._matrixCache.set(e$5, t$6);
			}
		});
	}
	_updateContainerOffset() {
		let { elementOffsetContainer: e$5, elementContainer: t$6, dragOffsetContainer: n$7, dragContainer: r$3, containerOffset: i$2, _clientOffsetCache: a$2, _matrixCache: o$2 } = this;
		if (e$5 !== n$7) {
			let [s$4, c$4] = [[r$3, n$7], [t$6, e$5]].map(([e$6, t$7]) => {
				let n$8 = a$2.get(t$7) || {
					x: 0,
					y: 0
				};
				if (!a$2.isValid(t$7)) {
					let r$4 = o$2.get(e$6);
					t$7 instanceof HTMLElement && r$4 && !r$4[0].isIdentity ? C(r$4[0]) ? (w.style.setProperty(`transform`, r$4[1].toString(), `important`), t$7.append(w), l$3(w, n$8), w.remove()) : (l$3(t$7, n$8), n$8.x -= r$4[0].m41, n$8.y -= r$4[0].m42) : l$3(t$7, n$8);
				}
				return a$2.set(t$7, n$8), n$8;
			});
			p$1(s$4, c$4, i$2);
		} else i$2.x = 0, i$2.y = 0;
	}
	getContainerMatrix() {
		return this._matrixCache.get(this.elementContainer);
	}
	getDragContainerMatrix() {
		return this._matrixCache.get(this.dragContainer);
	}
	updateSize(e$5) {
		if (e$5) this.clientRect.width = e$5.width, this.clientRect.height = e$5.height;
		else {
			let { width: e$6, height: t$6 } = this.element.getBoundingClientRect();
			this.clientRect.width = e$6, this.clientRect.height = t$6;
		}
	}
};
function E(e$5, t$6, n$7 = null) {
	if (`moveBefore` in e$5 && e$5.isConnected === t$6.isConnected) try {
		e$5.moveBefore(t$6, n$7);
		return;
	} catch {}
	let r$3 = document.activeElement, i$2 = t$6.contains(r$3);
	e$5.insertBefore(t$6, n$7), i$2 && document.activeElement !== r$3 && r$3 instanceof HTMLElement && r$3.focus({ preventScroll: !0 });
}
function D(e$5, t$6 = 0) {
	let n$7 = 10 ** t$6;
	return Math.round((e$5 + 2 ** -52) * n$7) / n$7;
}
function O(e$5, t$6) {
	return e$5.isIdentity && t$6.isIdentity ? !0 : e$5.is2D && t$6.is2D ? e$5.a === t$6.a && e$5.b === t$6.b && e$5.c === t$6.c && e$5.d === t$6.d && e$5.e === t$6.e && e$5.f === t$6.f : e$5.m11 === t$6.m11 && e$5.m12 === t$6.m12 && e$5.m13 === t$6.m13 && e$5.m14 === t$6.m14 && e$5.m21 === t$6.m21 && e$5.m22 === t$6.m22 && e$5.m23 === t$6.m23 && e$5.m24 === t$6.m24 && e$5.m31 === t$6.m31 && e$5.m32 === t$6.m32 && e$5.m33 === t$6.m33 && e$5.m34 === t$6.m34 && e$5.m41 === t$6.m41 && e$5.m42 === t$6.m42 && e$5.m43 === t$6.m43 && e$5.m44 === t$6.m44;
}
const k = {
	capture: !0,
	passive: !0
}, A = {
	x: 0,
	y: 0
}, j = e$3 ? new DOMMatrix() : null, M = e$3 ? new DOMMatrix() : null;
var N = function(e$5) {
	return e$5[e$5.None = 0] = `None`, e$5[e$5.Init = 1] = `Init`, e$5[e$5.Prepare = 2] = `Prepare`, e$5[e$5.FinishPrepare = 3] = `FinishPrepare`, e$5[e$5.Apply = 4] = `Apply`, e$5[e$5.FinishApply = 5] = `FinishApply`, e$5;
}(N || {}), P = function(e$5) {
	return e$5[e$5.Pending = 0] = `Pending`, e$5[e$5.Resolved = 1] = `Resolved`, e$5[e$5.Rejected = 2] = `Rejected`, e$5;
}(P || {});
const F = {
	Start: `start`,
	Move: `move`,
	End: `end`
}, I = {
	Start: `start`,
	StartAlign: `start-align`,
	Move: `move`,
	Align: `align`,
	End: `end`,
	EndAlign: `end-align`
}, L = {
	PrepareStart: `preparestart`,
	Start: `start`,
	PrepareMove: `preparemove`,
	Move: `move`,
	End: `end`,
	Destroy: `destroy`
}, R = {
	container: null,
	startPredicate: () => !0,
	elements: () => null,
	frozenStyles: () => null,
	applyPosition: ({ item: e$5, phase: t$6 }) => {
		let n$7 = t$6 === I.End || t$6 === I.EndAlign, [r$3, i$2] = e$5.getContainerMatrix(), [a$2, o$2] = e$5.getDragContainerMatrix(), { position: s$4, alignmentOffset: c$4, containerOffset: l$5, elementTransformMatrix: u$5, elementTransformOrigin: d$2, elementOffsetMatrix: f$2 } = e$5, { x: p$2, y: m$2, z: h$2 } = d$2, g$2 = !u$5.isIdentity && (p$2 !== 0 || m$2 !== 0 || h$2 !== 0), _$3 = s$4.x + c$4.x + l$5.x, y$2 = s$4.y + c$4.y + l$5.y;
		v$2(j), g$2 && (h$2 === 0 ? j.translateSelf(-p$2, -m$2) : j.translateSelf(-p$2, -m$2, -h$2)), n$7 ? i$2.isIdentity || j.multiplySelf(i$2) : o$2.isIdentity || j.multiplySelf(o$2), v$2(M).translateSelf(_$3, y$2), j.multiplySelf(M), r$3.isIdentity || j.multiplySelf(r$3), g$2 && (v$2(M).translateSelf(p$2, m$2, h$2), j.multiplySelf(M)), u$5.isIdentity || j.multiplySelf(u$5), f$2.isIdentity || j.preMultiplySelf(f$2), e$5.element.style.transform = `${j}`;
	},
	computeClientRect: ({ drag: e$5 }) => e$5.items[0].clientRect || null,
	positionModifiers: [],
	group: null
};
var z = class {
	constructor(t$6, n$7 = {}) {
		let { id: r$3 = Symbol(),...i$2 } = n$7;
		this.id = r$3, this.sensors = t$6, this.settings = this._parseSettings(i$2), this.plugins = {}, this.drag = null, this.isDestroyed = !1, this._sensorData = /* @__PURE__ */ new Map(), this._emitter = new v$1(), this._startPhase = N.None, this._startId = Symbol(), this._moveId = Symbol(), this._alignId = Symbol(), this._onMove = this._onMove.bind(this), this._onScroll = this._onScroll.bind(this), this._onEnd = this._onEnd.bind(this), this._prepareStart = this._prepareStart.bind(this), this._applyStart = this._applyStart.bind(this), this._prepareMove = this._prepareMove.bind(this), this._applyMove = this._applyMove.bind(this), this._prepareAlign = this._prepareAlign.bind(this), this._applyAlign = this._applyAlign.bind(this), this.sensors.forEach((t$7) => {
			this._sensorData.set(t$7, {
				predicateState: P.Pending,
				predicateEvent: null,
				onMove: (e$5) => this._onMove(e$5, t$7),
				onEnd: (e$5) => this._onEnd(e$5, t$7)
			});
			let { onMove: n$8, onEnd: r$4 } = this._sensorData.get(t$7);
			t$7.on(e$2.Start, n$8, n$8), t$7.on(e$2.Move, n$8, n$8), t$7.on(e$2.Cancel, r$4, r$4), t$7.on(e$2.End, r$4, r$4), t$7.on(e$2.Destroy, r$4, r$4);
		});
	}
	_parseSettings(e$5, t$6 = R) {
		let { container: n$7 = t$6.container, startPredicate: r$3 = t$6.startPredicate, elements: i$2 = t$6.elements, frozenStyles: a$2 = t$6.frozenStyles, positionModifiers: o$2 = t$6.positionModifiers, applyPosition: s$4 = t$6.applyPosition, computeClientRect: c$4 = t$6.computeClientRect, group: l$5 = t$6.group, onPrepareStart: u$5 = t$6.onPrepareStart, onStart: d$2 = t$6.onStart, onPrepareMove: f$2 = t$6.onPrepareMove, onMove: p$2 = t$6.onMove, onEnd: m$2 = t$6.onEnd, onDestroy: h$2 = t$6.onDestroy } = e$5 || {};
		return {
			container: n$7,
			startPredicate: r$3,
			elements: i$2,
			frozenStyles: a$2,
			positionModifiers: o$2,
			applyPosition: s$4,
			computeClientRect: c$4,
			group: l$5,
			onPrepareStart: u$5,
			onStart: d$2,
			onPrepareMove: f$2,
			onMove: p$2,
			onEnd: m$2,
			onDestroy: h$2
		};
	}
	_emit(e$5, ...t$6) {
		this._emitter.emit(e$5, ...t$6);
	}
	_onMove(e$5, r$3) {
		let i$2 = this._sensorData.get(r$3);
		if (i$2) switch (i$2.predicateState) {
			case P.Pending: {
				i$2.predicateEvent = e$5;
				let t$6 = this.settings.startPredicate({
					draggable: this,
					sensor: r$3,
					event: e$5
				});
				t$6 === !0 ? this.resolveStartPredicate(r$3) : t$6 === !1 && this.rejectStartPredicate(r$3);
				break;
			}
			case P.Resolved:
				this.drag && (this.drag.moveEvent = e$5, n$2.once(t$2.read, this._prepareMove, this._moveId), n$2.once(t$2.write, this._applyMove, this._moveId));
				break;
		}
	}
	_onScroll() {
		this.align();
	}
	_onEnd(e$5, t$6) {
		let n$7 = this._sensorData.get(t$6);
		n$7 && (this.drag ? n$7.predicateState === P.Resolved && (this.drag.endEvent = e$5, this._sensorData.forEach((e$6) => {
			e$6.predicateState = P.Pending, e$6.predicateEvent = null;
		}), this.stop()) : (n$7.predicateState = P.Pending, n$7.predicateEvent = null));
	}
	_prepareStart() {
		let e$5 = this.drag;
		e$5 && (this._startPhase = N.Prepare, e$5.items = (this.settings.elements({
			draggable: this,
			drag: e$5
		}) || []).map((e$6) => new T(e$6, this)), this._applyModifiers(F.Start, 0, 0), this._emit(L.PrepareStart, e$5.startEvent), this.settings.onPrepareStart?.(e$5, this), this._startPhase = N.FinishPrepare);
	}
	_applyStart() {
		let e$5 = this.drag;
		if (e$5) {
			this._startPhase = N.Apply;
			for (let t$6 of e$5.items) t$6.dragContainer !== t$6.elementContainer && E(t$6.dragContainer, t$6.element), t$6.frozenStyles && Object.assign(t$6.element.style, t$6.frozenStyles), this.settings.applyPosition({
				phase: I.Start,
				draggable: this,
				drag: e$5,
				item: t$6
			});
			for (let t$6 of e$5.items) {
				let e$6 = t$6.getContainerMatrix()[0], n$7 = t$6.getDragContainerMatrix()[0];
				if (O(e$6, n$7) || !C(e$6) && !C(n$7)) continue;
				let r$3 = t$6.element.getBoundingClientRect(), { alignmentOffset: i$2 } = t$6;
				i$2.x += D(t$6.clientRect.x - r$3.x, 3), i$2.y += D(t$6.clientRect.y - r$3.y, 3);
			}
			for (let t$6 of e$5.items) {
				let { alignmentOffset: n$7 } = t$6;
				(n$7.x !== 0 || n$7.y !== 0) && this.settings.applyPosition({
					phase: I.StartAlign,
					draggable: this,
					drag: e$5,
					item: t$6
				});
			}
			window.addEventListener(`scroll`, this._onScroll, k), this._emit(L.Start, e$5.startEvent), this.settings.onStart?.(e$5, this), this._startPhase = N.FinishApply;
		}
	}
	_prepareMove() {
		let e$5 = this.drag;
		if (!e$5) return;
		let { moveEvent: t$6, prevMoveEvent: n$7 } = e$5;
		t$6 !== n$7 && (this._applyModifiers(F.Move, t$6.x - n$7.x, t$6.y - n$7.y), this._emit(L.PrepareMove, t$6), !e$5.isEnded && (this.settings.onPrepareMove?.(e$5, this), !e$5.isEnded && (e$5.prevMoveEvent = t$6)));
	}
	_applyMove() {
		let e$5 = this.drag;
		if (e$5) {
			for (let t$6 of e$5.items) t$6._moveDiff.x = 0, t$6._moveDiff.y = 0, this.settings.applyPosition({
				phase: I.Move,
				draggable: this,
				drag: e$5,
				item: t$6
			});
			this._emit(L.Move, e$5.moveEvent), !e$5.isEnded && this.settings.onMove?.(e$5, this);
		}
	}
	_prepareAlign() {
		let { drag: e$5 } = this;
		if (e$5) for (let t$6 of e$5.items) {
			let { x: e$6, y: n$7 } = t$6.element.getBoundingClientRect(), r$3 = t$6.clientRect.x - t$6._moveDiff.x - e$6;
			t$6.alignmentOffset.x = t$6.alignmentOffset.x - t$6._alignDiff.x + r$3, t$6._alignDiff.x = r$3;
			let i$2 = t$6.clientRect.y - t$6._moveDiff.y - n$7;
			t$6.alignmentOffset.y = t$6.alignmentOffset.y - t$6._alignDiff.y + i$2, t$6._alignDiff.y = i$2;
		}
	}
	_applyAlign() {
		let { drag: e$5 } = this;
		if (e$5) for (let t$6 of e$5.items) t$6._alignDiff.x = 0, t$6._alignDiff.y = 0, this.settings.applyPosition({
			phase: I.Align,
			draggable: this,
			drag: e$5,
			item: t$6
		});
	}
	_applyModifiers(e$5, t$6, n$7) {
		let { drag: r$3 } = this;
		if (!r$3) return;
		let { positionModifiers: i$2 } = this.settings;
		for (let a$2 of r$3.items) {
			let o$2 = A;
			o$2.x = t$6, o$2.y = n$7;
			for (let t$7 of i$2) o$2 = t$7(o$2, {
				draggable: this,
				drag: r$3,
				item: a$2,
				phase: e$5
			});
			a$2.position.x += o$2.x, a$2.position.y += o$2.y, a$2.clientRect.x += o$2.x, a$2.clientRect.y += o$2.y, e$5 === `move` && (a$2._moveDiff.x += o$2.x, a$2._moveDiff.y += o$2.y);
		}
	}
	on(e$5, t$6, n$7) {
		return this._emitter.on(e$5, t$6, n$7);
	}
	off(e$5, t$6) {
		this._emitter.off(e$5, t$6);
	}
	resolveStartPredicate(e$5, r$3) {
		let i$2 = this._sensorData.get(e$5);
		if (!i$2) return;
		let a$2 = r$3 || i$2.predicateEvent;
		i$2.predicateState === P.Pending && a$2 && (this._startPhase = N.Init, i$2.predicateState = P.Resolved, i$2.predicateEvent = null, this.drag = new c$3(e$5, a$2), this._sensorData.forEach((t$6, n$7) => {
			n$7 !== e$5 && (t$6.predicateState = P.Rejected, t$6.predicateEvent = null);
		}), n$2.once(t$2.read, this._prepareStart, this._startId), n$2.once(t$2.write, this._applyStart, this._startId));
	}
	rejectStartPredicate(e$5) {
		let t$6 = this._sensorData.get(e$5);
		t$6?.predicateState === P.Pending && (t$6.predicateState = P.Rejected, t$6.predicateEvent = null);
	}
	stop() {
		let e$5 = this.drag;
		if (!e$5 || e$5.isEnded) return;
		let r$3 = this._startPhase;
		if (r$3 === N.Prepare || r$3 === N.Apply) throw Error(`Cannot stop drag start process at this point`);
		if (this._startPhase = N.None, e$5.isEnded = !0, n$2.off(t$2.read, this._startId), n$2.off(t$2.write, this._startId), n$2.off(t$2.read, this._moveId), n$2.off(t$2.write, this._moveId), n$2.off(t$2.read, this._alignId), n$2.off(t$2.write, this._alignId), window.removeEventListener(`scroll`, this._onScroll, k), r$3 > N.Init && this._applyModifiers(F.End, 0, 0), r$3 === N.FinishApply) {
			for (let t$6 of e$5.items) {
				if (t$6.elementContainer !== t$6.dragContainer && (E(t$6.elementContainer, t$6.element), t$6.alignmentOffset.x = 0, t$6.alignmentOffset.y = 0, t$6.containerOffset.x = 0, t$6.containerOffset.y = 0), t$6.unfrozenStyles) for (let e$6 in t$6.unfrozenStyles) t$6.element.style[e$6] = t$6.unfrozenStyles[e$6] || ``;
				this.settings.applyPosition({
					phase: I.End,
					draggable: this,
					drag: e$5,
					item: t$6
				});
			}
			for (let t$6 of e$5.items) if (t$6.elementContainer !== t$6.dragContainer) {
				let e$6 = t$6.element.getBoundingClientRect();
				t$6.alignmentOffset.x = D(t$6.clientRect.x - e$6.x, 3), t$6.alignmentOffset.y = D(t$6.clientRect.y - e$6.y, 3);
			}
			for (let t$6 of e$5.items) t$6.elementContainer !== t$6.dragContainer && (t$6.alignmentOffset.x !== 0 || t$6.alignmentOffset.y !== 0) && this.settings.applyPosition({
				phase: I.EndAlign,
				draggable: this,
				drag: e$5,
				item: t$6
			});
		} else if (r$3 === N.FinishPrepare) for (let t$6 of e$5.items) t$6.clientRect.x -= t$6.position.x, t$6.clientRect.y -= t$6.position.y, t$6.position.x = 0, t$6.position.y = 0, t$6.elementContainer !== t$6.dragContainer && (t$6.alignmentOffset.x = 0, t$6.alignmentOffset.y = 0, t$6.containerOffset.x = 0, t$6.containerOffset.y = 0);
		this._emit(L.End, e$5.endEvent), this.settings.onEnd?.(e$5, this), this.drag = null;
	}
	align(e$5 = !1) {
		this.drag && (e$5 ? (this._prepareAlign(), this._applyAlign()) : (n$2.once(t$2.read, this._prepareAlign, this._alignId), n$2.once(t$2.write, this._applyAlign, this._alignId)));
	}
	getClientRect() {
		let { drag: e$5, settings: t$6 } = this;
		return e$5 && t$6.computeClientRect?.({
			draggable: this,
			drag: e$5
		}) || null;
	}
	updateSettings(e$5 = {}) {
		this.settings = this._parseSettings(e$5, this.settings);
	}
	use(e$5) {
		return e$5(this);
	}
	destroy() {
		this.isDestroyed || (this.isDestroyed = !0, this.stop(), this._sensorData.forEach(({ onMove: t$6, onEnd: n$7 }, r$3) => {
			r$3.off(e$2.Start, t$6), r$3.off(e$2.Move, t$6), r$3.off(e$2.Cancel, n$7), r$3.off(e$2.End, n$7), r$3.off(e$2.Destroy, n$7);
		}), this._sensorData.clear(), this._emit(L.Destroy), this.settings.onDestroy?.(this), this._emitter.off());
	}
};

//#endregion
//#region dist/sensors/keyboard.js
const n$6 = {
	moveDistance: 25,
	cancelOnBlur: !0,
	cancelOnVisibilityChange: !0,
	startPredicate: (e$5, t$6) => {
		if (t$6.element && (e$5.key === `Enter` || e$5.key === ` `) && document.activeElement === t$6.element) {
			let { x: e$6, y: n$7 } = t$6.element.getBoundingClientRect();
			return {
				x: e$6,
				y: n$7
			};
		}
		return null;
	},
	movePredicate: (e$5, t$6) => {
		if (!t$6.drag) return null;
		switch (e$5.key) {
			case `ArrowLeft`: return {
				x: t$6.drag.x - t$6.moveDistance.x,
				y: t$6.drag.y
			};
			case `ArrowRight`: return {
				x: t$6.drag.x + t$6.moveDistance.x,
				y: t$6.drag.y
			};
			case `ArrowUp`: return {
				x: t$6.drag.x,
				y: t$6.drag.y - t$6.moveDistance.y
			};
			case `ArrowDown`: return {
				x: t$6.drag.x,
				y: t$6.drag.y + t$6.moveDistance.y
			};
			default: return null;
		}
	},
	cancelPredicate: (e$5, t$6) => {
		if (t$6.drag && e$5.key === `Escape`) {
			let { x: e$6, y: n$7 } = t$6.drag;
			return {
				x: e$6,
				y: n$7
			};
		}
		return null;
	},
	endPredicate: (e$5, t$6) => {
		if (t$6.drag && (e$5.key === `Enter` || e$5.key === ` `)) {
			let { x: e$6, y: n$7 } = t$6.drag;
			return {
				x: e$6,
				y: n$7
			};
		}
		return null;
	}
};
var r = class extends n$5 {
	constructor(e$5, t$6 = {}) {
		super();
		let { moveDistance: r$3 = n$6.moveDistance, cancelOnBlur: i$2 = n$6.cancelOnBlur, cancelOnVisibilityChange: a$2 = n$6.cancelOnVisibilityChange, startPredicate: o$2 = n$6.startPredicate, movePredicate: s$4 = n$6.movePredicate, cancelPredicate: c$4 = n$6.cancelPredicate, endPredicate: l$5 = n$6.endPredicate } = t$6;
		this.element = e$5, this.moveDistance = typeof r$3 == `number` ? {
			x: r$3,
			y: r$3
		} : { ...r$3 }, this._cancelOnBlur = i$2, this._cancelOnVisibilityChange = a$2, this._startPredicate = o$2, this._movePredicate = s$4, this._cancelPredicate = c$4, this._endPredicate = l$5, this._onKeyDown = this._onKeyDown.bind(this), this._internalCancel = this._internalCancel.bind(this), this._blurCancelHandler = this._blurCancelHandler.bind(this), document.addEventListener(`keydown`, this._onKeyDown), i$2 && e$5?.addEventListener(`blur`, this._blurCancelHandler), a$2 && document.addEventListener(`visibilitychange`, this._internalCancel);
	}
	_internalCancel() {
		this.cancel();
	}
	_blurCancelHandler() {
		queueMicrotask(() => {
			document.activeElement !== this.element && this.cancel();
		});
	}
	_onKeyDown(t$6) {
		if (!this.drag) {
			let n$8 = this._startPredicate(t$6, this);
			n$8 && (t$6.preventDefault(), this._start({
				type: e$2.Start,
				x: n$8.x,
				y: n$8.y,
				srcEvent: t$6
			}));
			return;
		}
		let n$7 = this._cancelPredicate(t$6, this);
		if (n$7) {
			t$6.preventDefault(), this._cancel({
				type: e$2.Cancel,
				x: n$7.x,
				y: n$7.y,
				srcEvent: t$6
			});
			return;
		}
		let r$3 = this._endPredicate(t$6, this);
		if (r$3) {
			t$6.preventDefault(), this._end({
				type: e$2.End,
				x: r$3.x,
				y: r$3.y,
				srcEvent: t$6
			});
			return;
		}
		let i$2 = this._movePredicate(t$6, this);
		if (i$2) {
			t$6.preventDefault(), this._move({
				type: e$2.Move,
				x: i$2.x,
				y: i$2.y,
				srcEvent: t$6
			});
			return;
		}
	}
	updateSettings(e$5 = {}) {
		let { moveDistance: t$6, cancelOnBlur: n$7, cancelOnVisibilityChange: r$3, startPredicate: i$2, movePredicate: a$2, cancelPredicate: o$2, endPredicate: s$4 } = e$5;
		t$6 !== void 0 && (typeof t$6 == `number` ? this.moveDistance.x = this.moveDistance.y = t$6 : (this.moveDistance.x = t$6.x, this.moveDistance.y = t$6.y)), n$7 !== void 0 && this._cancelOnBlur !== n$7 && (this._cancelOnBlur = n$7, n$7 ? this.element?.addEventListener(`blur`, this._blurCancelHandler) : this.element?.removeEventListener(`blur`, this._blurCancelHandler)), r$3 !== void 0 && this._cancelOnVisibilityChange !== r$3 && (this._cancelOnVisibilityChange = r$3, r$3 ? document.addEventListener(`visibilitychange`, this._internalCancel) : document.removeEventListener(`visibilitychange`, this._internalCancel)), i$2 && (this._startPredicate = i$2), a$2 && (this._movePredicate = a$2), o$2 && (this._cancelPredicate = o$2), s$4 && (this._endPredicate = s$4);
	}
	destroy() {
		this.isDestroyed || (super.destroy(), document.removeEventListener(`keydown`, this._onKeyDown), this._cancelOnBlur && this.element?.removeEventListener(`blur`, this._blurCancelHandler), this._cancelOnVisibilityChange && document.removeEventListener(`visibilitychange`, this._internalCancel));
	}
};

//#endregion
//#region tests/src/draggable/events.ts
function events$3() {
	describe("events", () => {
		it("should be called at the right time with the right arguments", async () => {
			let events$5 = [];
			let currentKeyboardEvent = null;
			const el = createTestElement();
			const keyboardSensor = new r(el, { moveDistance: 1 });
			const draggable = new z([keyboardSensor], { elements: () => [el] });
			draggable.on("preparestart", (...args) => {
				assert.equal(args.length, 1);
				assert.equal(args[0].type, "start");
				assert.equal(args[0].srcEvent, currentKeyboardEvent);
				events$5.push("preparestart");
			});
			draggable.on("start", (...args) => {
				assert.equal(args.length, 1);
				assert.equal(args[0].type, "start");
				assert.equal(args[0].srcEvent, currentKeyboardEvent);
				events$5.push("start");
			});
			draggable.on("preparemove", (...args) => {
				assert.equal(args.length, 1);
				assert.equal(args[0].type, "move");
				assert.equal(args[0].srcEvent, currentKeyboardEvent);
				events$5.push("preparemove");
			});
			draggable.on("move", (...args) => {
				assert.equal(args.length, 1);
				assert.equal(args[0].type, "move");
				assert.equal(args[0].srcEvent, currentKeyboardEvent);
				events$5.push("move");
			});
			draggable.on("end", (...args) => {
				assert.equal(args.length, 1);
				assert.equal(args[0]?.type, "end");
				assert.equal(args[0]?.srcEvent, currentKeyboardEvent);
				events$5.push("end");
			});
			draggable.on("destroy", (...args) => {
				assert.equal(args.length, 0);
				events$5.push("destroy");
			});
			focusElement(el);
			currentKeyboardEvent = new KeyboardEvent("keydown", { key: "Enter" });
			document.dispatchEvent(currentKeyboardEvent);
			await waitNextFrame();
			assert.deepEqual(events$5, ["preparestart", "start"]);
			events$5.length = 0;
			currentKeyboardEvent = new KeyboardEvent("keydown", { key: "ArrowRight" });
			document.dispatchEvent(currentKeyboardEvent);
			await waitNextFrame();
			assert.deepEqual(events$5, ["preparemove", "move"]);
			events$5.length = 0;
			currentKeyboardEvent = new KeyboardEvent("keydown", { key: "Enter" });
			document.dispatchEvent(currentKeyboardEvent);
			assert.deepEqual(events$5, ["end"]);
			events$5.length = 0;
			draggable.destroy();
			assert.deepEqual(events$5, ["destroy"]);
			keyboardSensor.destroy();
			el.remove();
		});
	});
}

//#endregion
//#region tests/src/draggable/methods/align.ts
function methodAlign() {
	describe("align", () => {
		it("should align the element visually", async () => {
			const el = createTestElement();
			const keyboardSensor = new r(el, { moveDistance: 1 });
			const draggable = new z([keyboardSensor], { elements: () => [el] });
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

//#endregion
//#region tests/src/draggable/methods/destroy.ts
function methodDestroy$2() {
	describe("destroy", () => {
		it("should destroy the draggable instance", async () => {
			const el = createTestElement();
			const keyboardSensor = new r(el, { moveDistance: 1 });
			const draggable = new z([keyboardSensor], { elements: () => [el] });
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

//#endregion
//#region tests/src/draggable/methods/off.ts
function methodOff$2() {
	describe("off", () => {
		it("should remove an event listener based on id", async () => {
			const el = createTestElement();
			const keyboardSensor = new r(el, { moveDistance: 1 });
			const draggable = new z([keyboardSensor], { elements: () => [el] });
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

//#endregion
//#region tests/src/draggable/methods/on.ts
function methodOn$2() {
	describe("on", () => {
		it("should return a unique symbol by default", () => {
			const el = createTestElement();
			const keyboardSensor = new r(el, { moveDistance: 1 });
			const draggable = new z([keyboardSensor], { elements: () => [el] });
			const idA = draggable.on("start", () => {});
			const idB = draggable.on("start", () => {});
			assert.equal(typeof idA, "symbol");
			assert.notEqual(idA, idB);
			keyboardSensor.destroy();
			draggable.destroy();
			el.remove();
		});
		it("should allow duplicate event listeners", async () => {
			const el = createTestElement();
			const keyboardSensor = new r(el, { moveDistance: 1 });
			const draggable = new z([keyboardSensor], { elements: () => [el] });
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
			const keyboardSensor = new r(el, { moveDistance: 1 });
			const draggable = new z([keyboardSensor], { elements: () => [el] });
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
			const keyboardSensor = new r(el, { moveDistance: 1 });
			const draggable = new z([keyboardSensor], { elements: () => [el] });
			const idA = Symbol();
			assert.equal(draggable.on("start", () => {}, idA), idA);
			const idB = 1;
			assert.equal(draggable.on("start", () => {}, idB), idB);
			const idC = "foo";
			assert.equal(draggable.on("start", () => {}, idC), idC);
			keyboardSensor.destroy();
			draggable.destroy();
			el.remove();
		});
	});
}

//#endregion
//#region tests/src/draggable/methods/stop.ts
function methodStop() {
	describe("stop", () => {
		it("should stop the drag after it has started", async () => {
			const el = createTestElement();
			const elRect = el.getBoundingClientRect();
			const keyboardSensor = new r(el, { moveDistance: 1 });
			const draggable = new z([keyboardSensor], {
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
			assert.deepEqual(elRect, el.getBoundingClientRect(), "Element's bounding client rect should not change after stopping the drag");
			draggable.destroy();
			keyboardSensor.destroy();
			el.remove();
		});
		it("should stop the drag synchronously after it is triggered to be start", async () => {
			const el = createTestElement();
			const elRect = el.getBoundingClientRect();
			const keyboardSensor = new r(el, { moveDistance: 1 });
			const draggable = new z([keyboardSensor], {
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
			assert.deepEqual(elRect, el.getBoundingClientRect(), "Element's bounding client rect should not change after stopping the drag");
			draggable.destroy();
			keyboardSensor.destroy();
			el.remove();
		});
	});
}

//#endregion
//#region tests/src/draggable/methods/update-settings.ts
function methodUpdateSettings$2() {
	describe("updateSettings", () => {
		it("should update the container setting", () => {
			const el = createTestElement();
			const keyboardSensor = new r(el, { moveDistance: 1 });
			const draggable = new z([keyboardSensor], { elements: () => [el] });
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
			const keyboardSensor = new r(el, { moveDistance: 1 });
			const draggable = new z([keyboardSensor], { elements: () => [el] });
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
			const keyboardSensor = new r(elA, { moveDistance: 1 });
			const draggable = new z([keyboardSensor], { elements: () => [elA] });
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
			const keyboardSensor = new r(el, { moveDistance: 1 });
			const draggable = new z([keyboardSensor], { elements: () => [el] });
			const newFrozenStyles = () => ({ position: "absolute" });
			draggable.updateSettings({ frozenStyles: newFrozenStyles });
			assert.equal(draggable.settings.frozenStyles, newFrozenStyles);
			draggable.destroy();
			keyboardSensor.destroy();
			el.remove();
		});
		it("should update the positionModifiers setting", () => {
			const el = createTestElement();
			const keyboardSensor = new r(el, { moveDistance: 1 });
			const draggable = new z([keyboardSensor], { elements: () => [el] });
			const newPositionModifiers = [(change) => ({
				x: change.x + 10,
				y: change.y + 10
			})];
			draggable.updateSettings({ positionModifiers: newPositionModifiers });
			assert.deepEqual(draggable.settings.positionModifiers, newPositionModifiers);
			draggable.destroy();
			keyboardSensor.destroy();
			el.remove();
		});
		it("should update the applyPosition setting", () => {
			const el = createTestElement();
			const keyboardSensor = new r(el, { moveDistance: 1 });
			const draggable = new z([keyboardSensor], { elements: () => [el] });
			const newApplyPosition = () => {};
			draggable.updateSettings({ applyPosition: newApplyPosition });
			assert.equal(draggable.settings.applyPosition, newApplyPosition);
			draggable.destroy();
			keyboardSensor.destroy();
			el.remove();
		});
		it("should update the onPrepareStart setting", () => {
			const el = createTestElement();
			const keyboardSensor = new r(el, { moveDistance: 1 });
			const draggable = new z([keyboardSensor], { elements: () => [el] });
			const newOnPrepareStart = () => {};
			draggable.updateSettings({ onPrepareStart: newOnPrepareStart });
			assert.equal(draggable.settings.onPrepareStart, newOnPrepareStart);
			draggable.destroy();
			keyboardSensor.destroy();
			el.remove();
		});
		it("should update the onStart setting", () => {
			const el = createTestElement();
			const keyboardSensor = new r(el, { moveDistance: 1 });
			const draggable = new z([keyboardSensor], { elements: () => [el] });
			const newOnStart = () => {};
			draggable.updateSettings({ onStart: newOnStart });
			assert.equal(draggable.settings.onStart, newOnStart);
			draggable.destroy();
			keyboardSensor.destroy();
			el.remove();
		});
		it("should update the onPrepareMove setting", () => {
			const el = createTestElement();
			const keyboardSensor = new r(el, { moveDistance: 1 });
			const draggable = new z([keyboardSensor], { elements: () => [el] });
			const newOnPrepareMove = () => {};
			draggable.updateSettings({ onPrepareMove: newOnPrepareMove });
			assert.equal(draggable.settings.onPrepareMove, newOnPrepareMove);
			draggable.destroy();
			keyboardSensor.destroy();
			el.remove();
		});
		it("should update the onMove setting", () => {
			const el = createTestElement();
			const keyboardSensor = new r(el, { moveDistance: 1 });
			const draggable = new z([keyboardSensor], { elements: () => [el] });
			const newOnMove = () => {};
			draggable.updateSettings({ onMove: newOnMove });
			assert.equal(draggable.settings.onMove, newOnMove);
			draggable.destroy();
			keyboardSensor.destroy();
			el.remove();
		});
		it("should update the onEnd setting", () => {
			const el = createTestElement();
			const keyboardSensor = new r(el, { moveDistance: 1 });
			const draggable = new z([keyboardSensor], { elements: () => [el] });
			const newOnEnd = () => {};
			draggable.updateSettings({ onEnd: newOnEnd });
			assert.equal(draggable.settings.onEnd, newOnEnd);
			draggable.destroy();
			keyboardSensor.destroy();
			el.remove();
		});
		it("should update the onDestroy setting", () => {
			const el = createTestElement();
			const keyboardSensor = new r(el, { moveDistance: 1 });
			const draggable = new z([keyboardSensor], { elements: () => [el] });
			const newOnDestroy = () => {};
			draggable.updateSettings({ onDestroy: newOnDestroy });
			assert.equal(draggable.settings.onDestroy, newOnDestroy);
			draggable.destroy();
			keyboardSensor.destroy();
			el.remove();
		});
	});
}

//#endregion
//#region tests/src/draggable/methods/use.ts
function methodUse() {
	describe("use", () => {
		it("should register a plugin", () => {
			const el = createTestElement();
			const keyboardSensor = new r(el, { moveDistance: 1 });
			const draggable = new z([keyboardSensor], { elements: () => [el] });
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

//#endregion
//#region tests/src/draggable/methods/index.ts
function methods$3() {
	describe("methods", () => {
		methodAlign();
		methodDestroy$2();
		methodOff$2();
		methodOn$2();
		methodStop();
		methodUpdateSettings$2();
		methodUse();
	});
}

//#endregion
//#region tests/src/draggable/options/apply-position.ts
function optionApplyPosition() {
	describe("applyPosition", () => {
		it("should receive the correct arguments", async () => {
			let callCount = 0;
			let expectedPhase = "";
			const el = createTestElement();
			const keyboardSensor = new r(el, { moveDistance: 1 });
			const draggable = new z([keyboardSensor], {
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

//#endregion
//#region tests/src/draggable/options/callbacks.ts
function optionCallbacks() {
	describe("callbacks", () => {
		it("should be called at the right time with the right arguments", async () => {
			let events$5 = [];
			let currentKeyboardEvent = null;
			const el = createTestElement();
			const keyboardSensor = new r(el, { moveDistance: 1 });
			const draggable = new z([keyboardSensor], {
				elements: () => [el],
				onPrepareStart(...args) {
					assert.equal(args.length, 2);
					assert.equal(args[0], draggable.drag);
					assert.equal(args[1], draggable);
					assert.equal(args[0].startEvent.srcEvent, currentKeyboardEvent);
					assert.equal(args[0].prevMoveEvent.srcEvent, currentKeyboardEvent);
					assert.equal(args[0].moveEvent.srcEvent, currentKeyboardEvent);
					events$5.push("onPrepareStart");
				},
				onStart(...args) {
					assert.equal(args.length, 2);
					assert.equal(args[0], draggable.drag);
					assert.equal(args[1], draggable);
					assert.equal(args[0].startEvent.srcEvent, currentKeyboardEvent);
					assert.equal(args[0].prevMoveEvent.srcEvent, currentKeyboardEvent);
					assert.equal(args[0].moveEvent.srcEvent, currentKeyboardEvent);
					events$5.push("onStart");
				},
				onPrepareMove(...args) {
					assert.equal(args.length, 2);
					assert.equal(args[0], draggable.drag);
					assert.equal(args[1], draggable);
					assert.equal(args[0].moveEvent.srcEvent, currentKeyboardEvent);
					events$5.push("onPrepareMove");
				},
				onMove(...args) {
					assert.equal(args.length, 2);
					assert.equal(args[0], draggable.drag);
					assert.equal(args[1], draggable);
					assert.equal(args[0].moveEvent.srcEvent, currentKeyboardEvent);
					events$5.push("onMove");
				},
				onEnd(...args) {
					assert.equal(args.length, 2);
					assert.equal(args[0], draggable.drag);
					assert.equal(args[1], draggable);
					assert.equal(args[0].endEvent?.srcEvent, currentKeyboardEvent);
					events$5.push("onEnd");
				},
				onDestroy(...args) {
					assert.equal(args.length, 1);
					assert.equal(args[0], draggable);
					events$5.push("onDestroy");
				}
			});
			draggable.on("preparestart", () => {
				events$5.push("preparestart");
			});
			draggable.on("start", () => {
				events$5.push("start");
			});
			draggable.on("preparemove", () => {
				events$5.push("preparemove");
			});
			draggable.on("move", () => {
				events$5.push("move");
			});
			draggable.on("end", () => {
				events$5.push("end");
			});
			draggable.on("destroy", () => {
				events$5.push("destroy");
			});
			focusElement(el);
			currentKeyboardEvent = new KeyboardEvent("keydown", { key: "Enter" });
			document.dispatchEvent(currentKeyboardEvent);
			await waitNextFrame();
			assert.deepEqual(events$5, [
				"preparestart",
				"onPrepareStart",
				"start",
				"onStart"
			]);
			events$5.length = 0;
			currentKeyboardEvent = new KeyboardEvent("keydown", { key: "ArrowRight" });
			document.dispatchEvent(currentKeyboardEvent);
			await waitNextFrame();
			assert.deepEqual(events$5, [
				"preparemove",
				"onPrepareMove",
				"move",
				"onMove"
			]);
			events$5.length = 0;
			currentKeyboardEvent = new KeyboardEvent("keydown", { key: "Enter" });
			document.dispatchEvent(currentKeyboardEvent);
			assert.deepEqual(events$5, ["end", "onEnd"]);
			events$5.length = 0;
			draggable.destroy();
			assert.deepEqual(events$5, ["destroy", "onDestroy"]);
			keyboardSensor.destroy();
			el.remove();
		});
	});
}

//#endregion
//#region tests/src/utils/round-number.ts
function roundNumber(value, decimals = 0) {
	const multiplier = Math.pow(10, decimals);
	return Math.round((value + Number.EPSILON) * multiplier) / multiplier;
}

//#endregion
//#region tests/src/draggable/options/container.ts
function optionContainer() {
	describe("container", () => {
		it("should define the drag container", async () => {
			const container = createTestElement();
			const el = createTestElement();
			const keyboardSensor = new r(el, { moveDistance: 1 });
			const draggable = new z([keyboardSensor], {
				container,
				elements: () => [el]
			});
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
			const containerPositions = [
				"static",
				"relative",
				"fixed",
				"absolute"
			];
			const elPositions = ["fixed", "absolute"];
			for (const containerPosition of containerPositions) for (const elPosition of elPositions) {
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
				const keyboardSensor = new r(el, { moveDistance: 1 });
				const draggable = new z([keyboardSensor], {
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
			const keyboardSensor = new r(el, { moveDistance: 1 });
			const draggable = new z([keyboardSensor], {
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
			assert.equal(roundNumber(moveRect.x - startRect.x, 3), 1, "x");
			assert.equal(roundNumber(moveRect.y - startRect.y, 3), 1, "y");
			document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
			const endRect = el.getBoundingClientRect();
			assert.equal(roundNumber(endRect.x - startRect.x, 3), 1, "x");
			assert.equal(roundNumber(endRect.y - startRect.y, 3), 1, "y");
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

//#endregion
//#region tests/src/draggable/options/elements.ts
function optionElements() {
	describe("elements", () => {
		it("should be a function that returns an array of the dragged elements", async () => {
			const elA = createTestElement();
			const elB = createTestElement();
			const elC = createTestElement();
			const keyboardSensor = new r(elA, { moveDistance: 1 });
			const draggable = new z([keyboardSensor], { elements: () => [elB, elC] });
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

//#endregion
//#region tests/src/draggable/options/frozen-styles.ts
function optionFrozenStyles() {
	describe("frozenStyles", async () => {
		it("should receive the correct arguments", async () => {
			let callCount = 0;
			const el = createTestElement();
			const keyboardSensor = new r(el, { moveDistance: 1 });
			const draggable = new z([keyboardSensor], {
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
			const keyboardSensor = new r(el, { moveDistance: 1 });
			const draggable = new z([keyboardSensor], {
				container,
				elements: () => [el],
				frozenStyles: () => {
					return [
						"width",
						"height",
						"left",
						"top"
					];
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
			const keyboardSensor = new r(el, { moveDistance: 1 });
			const draggable = new z([keyboardSensor], {
				container,
				elements: () => [el],
				frozenStyles: () => {
					return {
						width: "10px",
						height: "20px",
						left: "30px",
						top: "40px"
					};
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

//#endregion
//#region tests/src/draggable/options/position-modifiers.ts
function optionPositionModifiers() {
	describe("positionModifiers", () => {
		it("should modify the dragged element position", async () => {
			let phaseCounter = {
				start: 0,
				move: 0,
				end: 0
			};
			const el = createTestElement();
			const keyboardSensor = new r(el, { moveDistance: 1 });
			const draggable = new z([keyboardSensor], {
				elements: () => [el],
				positionModifiers: [(position, args) => {
					assert.equal(args.draggable, draggable);
					assert.equal(args.drag, draggable.drag);
					assert.equal(args.item, draggable.drag?.items[0]);
					switch (args.phase) {
						case "start":
							++phaseCounter.start;
							position.x += 1;
							position.y += 1;
							break;
						case "move":
							++phaseCounter.move;
							position.x += 2;
							position.y += 2;
							break;
						case "end":
							++phaseCounter.end;
							position.x += 3;
							position.y += 3;
							break;
					}
					return position;
				}]
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

//#endregion
//#region tests/src/draggable/options/start-predicate.ts
function optionStartPredicate$2() {
	describe("startPredicate", () => {
		it("should be called only on start and move events of the sensors", async () => {
			let callCount = 0;
			const el = createTestElement();
			const keyboardSensor = new r(el, { moveDistance: 1 });
			const draggable = new z([keyboardSensor], {
				elements: () => [el],
				startPredicate: () => {
					++callCount;
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
			const keyboardSensor = new r(el, { moveDistance: 1 });
			const draggable = new z([keyboardSensor], {
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
			const keyboardSensor = new r(el, { moveDistance: 1 });
			const draggable = new z([keyboardSensor], {
				elements: () => [el],
				startPredicate: () => {
					++callCount;
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
			const keyboardSensor = new r(el, { moveDistance: 1 });
			const draggable = new z([keyboardSensor], {
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
			const keyboardSensor = new r(el, { moveDistance: 1 });
			const draggable = new z([keyboardSensor], {
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

//#endregion
//#region tests/src/draggable/options/index.ts
function options$2() {
	describe("options", () => {
		optionApplyPosition();
		optionCallbacks();
		optionContainer();
		optionElements();
		optionFrozenStyles();
		optionPositionModifiers();
		optionStartPredicate$2();
	});
}

//#endregion
//#region tests/src/utils/fake-touch.ts
var FakeTouch = class {
	constructor(options$3 = {}) {
		const { identifier = 0, target = null, clientX = 0, clientY = 0, screenX = 0, screenY = 0, radiusX = 0, radiusY = 0, rotationAngle = 0, force = 0 } = options$3;
		const mouseEvent = new MouseEvent("mousedown", {
			clientX,
			clientY,
			screenX,
			screenY
		});
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
	constructor(type$1, options$3 = {}) {
		const { altKey = false, ctrlKey = false, metaKey = false, shiftKey = false, touches = [], targetTouches = [], changedTouches = [],...parentOptions } = options$3;
		super(type$1, parentOptions);
		this.altKey = altKey;
		this.ctrlKey = ctrlKey;
		this.metaKey = metaKey;
		this.shiftKey = shiftKey;
		this.touches = touches;
		this.targetTouches = targetTouches;
		this.changedTouches = changedTouches;
	}
};

//#endregion
//#region tests/src/utils/create-fake-touch-event.ts
function createFakeTouchEvent(type$1, options$3 = {}) {
	const { identifier, target, clientX, clientY, screenX, screenY, radiusX, radiusY, rotationAngle, force,...eventOptions } = options$3;
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
	return new FakeTouchEvent(type$1, {
		...eventOptions,
		touches: [touch],
		changedTouches: [touch],
		targetTouches: [touch]
	});
}

//#endregion
//#region tests/src/utils/create-fake-drag.ts
let idCounter = 100;
async function createFakeDrag(steps, options$3) {
	const { eventType = "mouse", stepDuration = 16, extraSteps = 0, cancelAtEnd = false, pointerId = ++idCounter, pointerType = "touch", onAfterStep } = options$3;
	const finalSteps = [...steps];
	if (extraSteps > 0) {
		const stepTo = finalSteps.pop();
		const stepFrom = finalSteps.pop();
		finalSteps.push(stepFrom);
		for (let i$2 = 0; i$2 < extraSteps; i$2++) {
			const alpha = (i$2 + 1) / (extraSteps + 1);
			const x$1 = stepFrom.x + (stepTo.x - stepFrom.x) * alpha;
			const y$2 = stepFrom.y + (stepTo.y - stepFrom.y) * alpha;
			finalSteps.push({
				x: Math.round(x$1),
				y: Math.round(y$2)
			});
		}
		finalSteps.push(stepTo);
	}
	for (let i$2 = 0; i$2 < finalSteps.length; i$2++) {
		const isStart = i$2 === 0;
		const isEnd = i$2 === finalSteps.length - 1;
		const { x: x$1, y: y$2 } = finalSteps[i$2];
		if (!isStart && !isEnd) {
			const prevStep = finalSteps[i$2 - 1];
			if (prevStep.x === x$1 && prevStep.y === y$2) continue;
		}
		if (!isStart && stepDuration > 0) await new Promise((resolve) => setTimeout(resolve, stepDuration));
		const target = document.elementFromPoint(x$1, y$2);
		if (!target) throw new Error("No event target found!");
		switch (eventType) {
			case "mouse": {
				const eventName = isStart ? "mousedown" : isEnd ? "mouseup" : "mousemove";
				const event = new MouseEvent(eventName, {
					clientX: x$1,
					clientY: y$2,
					bubbles: true,
					cancelable: true,
					view: window
				});
				target.dispatchEvent(event);
				if (onAfterStep) onAfterStep(event);
				break;
			}
			case "touch": {
				const event = createFakeTouchEvent(isStart ? "touchstart" : isEnd ? cancelAtEnd ? "touchcancel" : "touchend" : "touchmove", {
					clientX: x$1,
					clientY: y$2,
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
					clientX: x$1,
					clientY: y$2,
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

//#endregion
//#region dist/pointer-sensor-DZDIojjB.js
function i$1(e$5, t$6) {
	if (`pointerId` in e$5) return e$5.pointerId === t$6 ? e$5 : null;
	if (`changedTouches` in e$5) {
		let n$7 = 0;
		for (; n$7 < e$5.changedTouches.length; n$7++) if (e$5.changedTouches[n$7].identifier === t$6) return e$5.changedTouches[n$7];
		return null;
	}
	return e$5;
}
function a$1(e$5) {
	return `pointerType` in e$5 ? e$5.pointerType : `touches` in e$5 ? `touch` : `mouse`;
}
function o(e$5) {
	return `pointerId` in e$5 ? e$5.pointerId : `changedTouches` in e$5 ? e$5.changedTouches[0] ? e$5.changedTouches[0].identifier : null : -1;
}
function s$2(e$5 = {}) {
	let { capture: t$6 = !0, passive: n$7 = !0 } = e$5;
	return {
		capture: t$6,
		passive: n$7
	};
}
function c$2(e$5) {
	return e$5 === `auto` || e$5 === void 0 ? n$4 ? `pointer` : t$5 ? `touch` : `mouse` : e$5;
}
const l$2 = {
	pointer: {
		start: `pointerdown`,
		move: `pointermove`,
		cancel: `pointercancel`,
		end: `pointerup`
	},
	touch: {
		start: `touchstart`,
		move: `touchmove`,
		cancel: `touchcancel`,
		end: `touchend`
	},
	mouse: {
		start: `mousedown`,
		move: `mousemove`,
		cancel: ``,
		end: `mouseup`
	}
};
var u$2 = class {
	constructor(e$5, t$6 = {}) {
		let { listenerOptions: n$7 = {}, sourceEvents: i$2 = `auto`, startPredicate: a$2 = (e$6) => !(`button` in e$6 && e$6.button > 0) } = t$6;
		this.element = e$5, this.drag = null, this.isDestroyed = !1, this._areWindowListenersBound = !1, this._startPredicate = a$2, this._listenerOptions = s$2(n$7), this._sourceEvents = c$2(i$2), this._emitter = new v$1(), this._onStart = this._onStart.bind(this), this._onMove = this._onMove.bind(this), this._onCancel = this._onCancel.bind(this), this._onEnd = this._onEnd.bind(this), e$5.addEventListener(l$2[this._sourceEvents].start, this._onStart, this._listenerOptions);
	}
	_getTrackedPointerEventData(e$5) {
		return this.drag ? i$1(e$5, this.drag.pointerId) : null;
	}
	_onStart(t$6) {
		if (this.isDestroyed || this.drag || !this._startPredicate(t$6)) return;
		let n$7 = o(t$6);
		if (n$7 === null) return;
		let r$3 = i$1(t$6, n$7);
		if (r$3 === null) return;
		let s$4 = {
			pointerId: n$7,
			pointerType: a$1(t$6),
			x: r$3.clientX,
			y: r$3.clientY
		};
		this.drag = s$4;
		let c$4 = {
			...s$4,
			type: e$2.Start,
			srcEvent: t$6,
			target: r$3.target
		};
		this._emitter.emit(c$4.type, c$4), this.drag && this._bindWindowListeners();
	}
	_onMove(t$6) {
		if (!this.drag) return;
		let n$7 = this._getTrackedPointerEventData(t$6);
		if (!n$7) return;
		this.drag.x = n$7.clientX, this.drag.y = n$7.clientY;
		let r$3 = {
			type: e$2.Move,
			srcEvent: t$6,
			target: n$7.target,
			...this.drag
		};
		this._emitter.emit(r$3.type, r$3);
	}
	_onCancel(t$6) {
		if (!this.drag) return;
		let n$7 = this._getTrackedPointerEventData(t$6);
		if (!n$7) return;
		this.drag.x = n$7.clientX, this.drag.y = n$7.clientY;
		let r$3 = {
			type: e$2.Cancel,
			srcEvent: t$6,
			target: n$7.target,
			...this.drag
		};
		this._emitter.emit(r$3.type, r$3), this._resetDrag();
	}
	_onEnd(t$6) {
		if (!this.drag) return;
		let n$7 = this._getTrackedPointerEventData(t$6);
		if (!n$7) return;
		this.drag.x = n$7.clientX, this.drag.y = n$7.clientY;
		let r$3 = {
			type: e$2.End,
			srcEvent: t$6,
			target: n$7.target,
			...this.drag
		};
		this._emitter.emit(r$3.type, r$3), this._resetDrag();
	}
	_bindWindowListeners() {
		if (this._areWindowListenersBound) return;
		let { move: e$5, end: t$6, cancel: n$7 } = l$2[this._sourceEvents];
		window.addEventListener(e$5, this._onMove, this._listenerOptions), window.addEventListener(t$6, this._onEnd, this._listenerOptions), n$7 && window.addEventListener(n$7, this._onCancel, this._listenerOptions), this._areWindowListenersBound = !0;
	}
	_unbindWindowListeners() {
		if (this._areWindowListenersBound) {
			let { move: e$5, end: t$6, cancel: n$7 } = l$2[this._sourceEvents];
			window.removeEventListener(e$5, this._onMove, this._listenerOptions), window.removeEventListener(t$6, this._onEnd, this._listenerOptions), n$7 && window.removeEventListener(n$7, this._onCancel, this._listenerOptions), this._areWindowListenersBound = !1;
		}
	}
	_resetDrag() {
		this.drag = null, this._unbindWindowListeners();
	}
	cancel() {
		if (!this.drag) return;
		let t$6 = {
			type: e$2.Cancel,
			srcEvent: null,
			target: null,
			...this.drag
		};
		this._emitter.emit(t$6.type, t$6), this._resetDrag();
	}
	updateSettings(e$5) {
		if (this.isDestroyed) return;
		let { listenerOptions: t$6, sourceEvents: n$7, startPredicate: r$3 } = e$5, i$2 = c$2(n$7), a$2 = s$2(t$6);
		r$3 && this._startPredicate !== r$3 && (this._startPredicate = r$3), (t$6 && (this._listenerOptions.capture !== a$2.capture || this._listenerOptions.passive === a$2.passive) || n$7 && this._sourceEvents !== i$2) && (this.element.removeEventListener(l$2[this._sourceEvents].start, this._onStart, this._listenerOptions), this._unbindWindowListeners(), this.cancel(), n$7 && (this._sourceEvents = i$2), t$6 && a$2 && (this._listenerOptions = a$2), this.element.addEventListener(l$2[this._sourceEvents].start, this._onStart, this._listenerOptions));
	}
	on(e$5, t$6, n$7) {
		return this._emitter.on(e$5, t$6, n$7);
	}
	off(e$5, t$6) {
		this._emitter.off(e$5, t$6);
	}
	destroy() {
		this.isDestroyed || (this.isDestroyed = !0, this.cancel(), this._emitter.emit(e$2.Destroy, { type: e$2.Destroy }), this._emitter.off(), this.element.removeEventListener(l$2[this._sourceEvents].start, this._onStart, this._listenerOptions));
	}
};

//#endregion
//#region tests/src/draggable/misc.ts
function misc$1() {
	describe("misc", () => {
		it("should drag an element using the provided sensors", async () => {
			const el = createTestElement();
			const pointerSensor = new u$2(el, { sourceEvents: "mouse" });
			const keyboardSensor = new r(el, { moveDistance: 1 });
			const draggable = new z([pointerSensor, keyboardSensor], { elements: () => [el] });
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
			await createFakeDrag([
				{
					x: 1,
					y: 1
				},
				{
					x: 2,
					y: 2
				},
				{
					x: 3,
					y: 3
				},
				{
					x: 3,
					y: 3
				}
			], {
				eventType: "mouse",
				stepDuration: 50
			});
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
			const keyboardSensor = new r(el, { moveDistance: 1 });
			const draggable = new z([keyboardSensor], { elements: () => [el] });
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
			assert.equal(roundNumber(endRect.x - startRect.x, 3), 1, "x");
			assert.equal(roundNumber(endRect.y - startRect.y, 3), 1, "y");
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
			const keyboardSensor = new r(el, { moveDistance: 1 });
			const draggable = new z([keyboardSensor], { elements: () => [el] });
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
			assert.equal(roundNumber(endRect.x - startRect.x, 3), 1, "x");
			assert.equal(roundNumber(endRect.y - startRect.y, 3), 1, "y");
			draggable.destroy();
			keyboardSensor.destroy();
			el.remove();
			container1.remove();
			container2.remove();
			container3.remove();
		});
	});
}

//#endregion
//#region tests/src/draggable/index.ts
describe("Draggable", () => {
	events$3();
	options$2();
	methods$3();
	misc$1();
});

//#endregion
//#region tests/src/utils/default-page-styles.ts
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

//#endregion
//#region tests/src/pointer-sensor/events/cancel.ts
function eventCancel$1() {
	describe("cancel", () => {
		it(`should be triggered correctly on pointercancel`, function() {
			const el = createTestElement();
			const s$4 = new u$2(el, { sourceEvents: "pointer" });
			let cancelEvent = null;
			let sourceEvent;
			s$4.on("cancel", (e$5) => {
				if (cancelEvent === null) cancelEvent = e$5;
				else assert.fail("cancel event listener called twice");
			});
			createFakeDrag([
				{
					x: 1,
					y: 1
				},
				{
					x: 2,
					y: 2
				},
				{
					x: 2,
					y: 2
				}
			], {
				eventType: "pointer",
				stepDuration: 0,
				cancelAtEnd: true,
				onAfterStep: (e$5) => {
					if (e$5.type === "pointercancel") sourceEvent = e$5;
				}
			});
			assert.deepEqual(cancelEvent, {
				type: "cancel",
				srcEvent: sourceEvent,
				target: el,
				pointerId: sourceEvent.pointerId,
				pointerType: sourceEvent.pointerType,
				x: 2,
				y: 2
			});
			s$4.destroy();
			el.remove();
		});
		it(`should be triggered correctly on touchcancel`, function() {
			const el = createTestElement();
			const s$4 = new u$2(el, { sourceEvents: "touch" });
			let cancelEvent = null;
			let sourceEvent;
			s$4.on("cancel", (e$5) => {
				if (cancelEvent === null) cancelEvent = e$5;
				else assert.fail("cancel event listener called twice");
			});
			createFakeDrag([
				{
					x: 1,
					y: 1
				},
				{
					x: 2,
					y: 2
				},
				{
					x: 2,
					y: 2
				}
			], {
				eventType: "touch",
				stepDuration: 0,
				cancelAtEnd: true,
				onAfterStep: (e$5) => {
					if (e$5.type === "touchcancel") sourceEvent = e$5;
				}
			});
			assert.deepEqual(cancelEvent, {
				type: "cancel",
				srcEvent: sourceEvent,
				target: el,
				pointerId: sourceEvent.changedTouches[0].identifier,
				pointerType: "touch",
				x: 2,
				y: 2
			});
			s$4.destroy();
			el.remove();
		});
	});
}

//#endregion
//#region tests/src/pointer-sensor/events/destroy.ts
function eventDestroy$1() {
	describe("destroy", () => {
		it(`should be triggered on destroy`, function() {
			const el = createTestElement();
			const s$4 = new u$2(el);
			let destroyEventCount = 0;
			s$4.on("destroy", (e$5) => {
				++destroyEventCount;
				assert.deepEqual(e$5, { type: "destroy" });
			});
			s$4.destroy();
			assert.equal(destroyEventCount, 1);
			el.remove();
		});
	});
}

//#endregion
//#region tests/src/pointer-sensor/events/end.ts
function eventEnd$1() {
	describe("end", () => {
		it(`should be triggered correctly on mouseup`, function() {
			const el = createTestElement();
			const s$4 = new u$2(el, { sourceEvents: "mouse" });
			let endEvent = null;
			let sourceEvent;
			s$4.on("end", (e$5) => {
				if (endEvent === null) endEvent = e$5;
				else assert.fail("end event listener called twice");
			});
			createFakeDrag([
				{
					x: 1,
					y: 1
				},
				{
					x: 2,
					y: 2
				},
				{
					x: 2,
					y: 2
				}
			], {
				eventType: "mouse",
				stepDuration: 0,
				onAfterStep: (e$5) => {
					if (e$5.type === "mouseup") sourceEvent = e$5;
				}
			});
			assert.deepEqual(endEvent, {
				type: "end",
				srcEvent: sourceEvent,
				target: el,
				pointerId: -1,
				pointerType: "mouse",
				x: 2,
				y: 2
			});
			s$4.destroy();
			el.remove();
		});
		it(`should be triggered correctly on pointerup`, function() {
			const el = createTestElement();
			const s$4 = new u$2(el, { sourceEvents: "pointer" });
			let endEvent = null;
			let sourceEvent;
			s$4.on("end", (e$5) => {
				if (endEvent === null) endEvent = e$5;
				else assert.fail("end event listener called twice");
			});
			createFakeDrag([
				{
					x: 1,
					y: 1
				},
				{
					x: 2,
					y: 2
				},
				{
					x: 2,
					y: 2
				}
			], {
				eventType: "pointer",
				stepDuration: 0,
				onAfterStep: (e$5) => {
					if (e$5.type === "pointerup") sourceEvent = e$5;
				}
			});
			assert.deepEqual(endEvent, {
				type: "end",
				srcEvent: sourceEvent,
				target: el,
				pointerId: sourceEvent.pointerId,
				pointerType: sourceEvent.pointerType,
				x: 2,
				y: 2
			});
			s$4.destroy();
			el.remove();
		});
		it(`should be triggered correctly on touchend`, function() {
			const el = createTestElement();
			const s$4 = new u$2(el, { sourceEvents: "touch" });
			let endEvent = null;
			let sourceEvent;
			s$4.on("end", (e$5) => {
				if (endEvent === null) endEvent = e$5;
				else assert.fail("end event listener called twice");
			});
			createFakeDrag([
				{
					x: 1,
					y: 1
				},
				{
					x: 2,
					y: 2
				},
				{
					x: 2,
					y: 2
				}
			], {
				eventType: "touch",
				stepDuration: 0,
				onAfterStep: (e$5) => {
					if (e$5.type === "touchend") sourceEvent = e$5;
				}
			});
			assert.deepEqual(endEvent, {
				type: "end",
				srcEvent: sourceEvent,
				target: el,
				pointerId: sourceEvent.changedTouches[0].identifier,
				pointerType: "touch",
				x: 2,
				y: 2
			});
			s$4.destroy();
			el.remove();
		});
	});
}

//#endregion
//#region tests/src/pointer-sensor/events/move.ts
function eventMove$1() {
	describe("move", () => {
		it(`should be triggered correctly on mousemove`, function() {
			const el = createTestElement();
			const s$4 = new u$2(el, { sourceEvents: "mouse" });
			let moveEvent = null;
			let sourceEvent;
			s$4.on("move", (e$5) => {
				if (moveEvent === null) moveEvent = e$5;
				else assert.fail("move event listener called twice");
			});
			createFakeDrag([
				{
					x: 1,
					y: 1
				},
				{
					x: 2,
					y: 2
				},
				{
					x: 2,
					y: 2
				}
			], {
				eventType: "mouse",
				stepDuration: 0,
				onAfterStep: (e$5) => {
					if (e$5.type === "mousemove") sourceEvent = e$5;
				}
			});
			assert.deepEqual(moveEvent, {
				type: "move",
				srcEvent: sourceEvent,
				target: el,
				pointerId: -1,
				pointerType: "mouse",
				x: 2,
				y: 2
			});
			s$4.destroy();
			el.remove();
		});
		it(`should be triggered correctly on pointermove`, function() {
			const el = createTestElement();
			const s$4 = new u$2(el, { sourceEvents: "pointer" });
			let moveEvent = null;
			let sourceEvent;
			s$4.on("move", (e$5) => {
				if (moveEvent === null) moveEvent = e$5;
				else assert.fail("move event listener called twice");
			});
			createFakeDrag([
				{
					x: 1,
					y: 1
				},
				{
					x: 2,
					y: 2
				},
				{
					x: 2,
					y: 2
				}
			], {
				eventType: "pointer",
				stepDuration: 0,
				onAfterStep: (e$5) => {
					if (e$5.type === "pointermove") sourceEvent = e$5;
				}
			});
			assert.deepEqual(moveEvent, {
				type: "move",
				srcEvent: sourceEvent,
				target: el,
				pointerId: sourceEvent.pointerId,
				pointerType: sourceEvent.pointerType,
				x: 2,
				y: 2
			});
			s$4.destroy();
			el.remove();
		});
		it(`should be triggered correctly on touchmove`, function() {
			const el = createTestElement();
			const s$4 = new u$2(el, { sourceEvents: "touch" });
			let moveEvent = null;
			let sourceEvent;
			s$4.on("move", (e$5) => {
				if (moveEvent === null) moveEvent = e$5;
				else assert.fail("start event listener called twice");
			});
			createFakeDrag([
				{
					x: 1,
					y: 1
				},
				{
					x: 2,
					y: 2
				},
				{
					x: 2,
					y: 2
				}
			], {
				eventType: "touch",
				stepDuration: 0,
				onAfterStep: (e$5) => {
					if (e$5.type === "touchmove") sourceEvent = e$5;
				}
			});
			assert.deepEqual(moveEvent, {
				type: "move",
				srcEvent: sourceEvent,
				target: el,
				pointerId: sourceEvent.changedTouches[0].identifier,
				pointerType: "touch",
				x: 2,
				y: 2
			});
			s$4.destroy();
			el.remove();
		});
	});
}

//#endregion
//#region tests/src/pointer-sensor/events/start.ts
function eventStart$1() {
	describe("start", () => {
		it(`should be triggered correctly on mousedown`, function() {
			const el = createTestElement();
			const s$4 = new u$2(el, { sourceEvents: "mouse" });
			let startEvent = null;
			let sourceEvent;
			s$4.on("start", (e$5) => {
				if (startEvent === null) startEvent = e$5;
				else assert.fail("start event listener called twice");
			});
			createFakeDrag([
				{
					x: 1,
					y: 1
				},
				{
					x: 2,
					y: 2
				},
				{
					x: 2,
					y: 2
				}
			], {
				eventType: "mouse",
				stepDuration: 0,
				onAfterStep: (e$5) => {
					if (e$5.type === "mousedown") sourceEvent = e$5;
				}
			});
			assert.deepEqual(startEvent, {
				type: "start",
				srcEvent: sourceEvent,
				target: el,
				pointerId: -1,
				pointerType: "mouse",
				x: 1,
				y: 1
			});
			s$4.destroy();
			el.remove();
		});
		it(`should be triggered correctly on pointerdown`, function() {
			const el = createTestElement();
			const s$4 = new u$2(el, { sourceEvents: "pointer" });
			let startEvent = null;
			let sourceEvent;
			s$4.on("start", (e$5) => {
				if (startEvent === null) startEvent = e$5;
				else assert.fail("start event listener called twice");
			});
			createFakeDrag([
				{
					x: 1,
					y: 1
				},
				{
					x: 2,
					y: 2
				},
				{
					x: 2,
					y: 2
				}
			], {
				eventType: "pointer",
				stepDuration: 0,
				onAfterStep: (e$5) => {
					if (e$5.type === "pointerdown") sourceEvent = e$5;
				}
			});
			assert.deepEqual(startEvent, {
				type: "start",
				srcEvent: sourceEvent,
				target: el,
				pointerId: sourceEvent.pointerId,
				pointerType: sourceEvent.pointerType,
				x: 1,
				y: 1
			});
			s$4.destroy();
			el.remove();
		});
		it(`should be triggered correctly on touchstart`, function() {
			const el = createTestElement();
			const s$4 = new u$2(el, { sourceEvents: "touch" });
			let startEvent = null;
			let sourceEvent;
			s$4.on("start", (e$5) => {
				if (startEvent === null) startEvent = e$5;
				else assert.fail("start event listener called twice");
			});
			createFakeDrag([
				{
					x: 1,
					y: 1
				},
				{
					x: 2,
					y: 2
				},
				{
					x: 2,
					y: 2
				}
			], {
				eventType: "touch",
				stepDuration: 0,
				onAfterStep: (e$5) => {
					if (e$5.type === "touchstart") sourceEvent = e$5;
				}
			});
			assert.deepEqual(startEvent, {
				type: "start",
				srcEvent: sourceEvent,
				target: el,
				pointerId: sourceEvent.changedTouches[0].identifier,
				pointerType: "touch",
				x: 1,
				y: 1
			});
			s$4.destroy();
			el.remove();
		});
	});
}

//#endregion
//#region tests/src/pointer-sensor/events/index.ts
function events$2() {
	describe("events", () => {
		eventCancel$1();
		eventDestroy$1();
		eventEnd$1();
		eventMove$1();
		eventStart$1();
	});
}

//#endregion
//#region tests/src/pointer-sensor/methods/cancel.ts
function methodCancel$1() {
	describe("cancel", () => {
		it(`should cancel active drag forcefully`, () => {
			const el = createTestElement();
			const s$4 = new u$2(el, { sourceEvents: "pointer" });
			let cancelEventCount = 0;
			s$4.on("cancel", () => {
				++cancelEventCount;
			});
			createFakeDrag([
				{
					x: 1,
					y: 1
				},
				{
					x: 2,
					y: 2
				},
				{
					x: 2,
					y: 2
				}
			], {
				eventType: "pointer",
				stepDuration: 0,
				onAfterStep: () => {
					assert.notEqual(s$4.drag, null);
					s$4.cancel();
				}
			});
			assert.equal(s$4.drag, null);
			assert.equal(cancelEventCount, 1);
			s$4.destroy();
			el.remove();
		});
	});
}

//#endregion
//#region tests/src/pointer-sensor/methods/destroy.ts
function methodDestroy$1() {
	describe("destroy", () => {
		it(`should destroy the sensor`, () => {
			const el = createTestElement();
			const s$4 = new u$2(el, { sourceEvents: "pointer" });
			let cancelEventCount = 0;
			let destroyEventCount = 0;
			s$4.on("cancel", () => {
				++cancelEventCount;
			});
			s$4.on("destroy", () => {
				++destroyEventCount;
			});
			s$4.destroy();
			assert.equal(s$4.isDestroyed, true);
			assert.equal(destroyEventCount, 1);
			assert.equal(cancelEventCount, 0);
			el.remove();
		});
		it(`should destroy the sensor during drag`, () => {
			const el = createTestElement();
			const s$4 = new u$2(el, { sourceEvents: "pointer" });
			let cancelEventCount = 0;
			let destroyEventCount = 0;
			s$4.on("cancel", () => {
				++cancelEventCount;
			});
			s$4.on("destroy", () => {
				++destroyEventCount;
			});
			createFakeDrag([
				{
					x: 1,
					y: 1
				},
				{
					x: 2,
					y: 2
				},
				{
					x: 2,
					y: 2
				}
			], {
				eventType: "pointer",
				stepDuration: 0,
				onAfterStep: () => {
					assert.notEqual(s$4.drag, null);
					s$4.destroy();
				}
			});
			assert.equal(s$4.drag, null);
			assert.equal(s$4.isDestroyed, true);
			assert.equal(destroyEventCount, 1);
			assert.equal(cancelEventCount, 1);
			el.remove();
		});
	});
}

//#endregion
//#region tests/src/pointer-sensor/methods/off.ts
function methodOff$1() {
	describe("off", () => {
		it("should remove an event listener based on id", () => {
			const el = createTestElement();
			const s$4 = new u$2(el, { sourceEvents: "mouse" });
			let msg = "";
			const idA = s$4.on("start", () => void (msg += "a"));
			s$4.on("start", () => void (msg += "b"));
			s$4.off("start", idA);
			el.dispatchEvent(new MouseEvent("mousedown", {
				clientX: 0,
				clientY: 0,
				bubbles: true,
				cancelable: true,
				view: window
			}));
			assert.equal(msg, "b");
			s$4.destroy();
			el.remove();
		});
	});
}

//#endregion
//#region tests/src/pointer-sensor/methods/on.ts
function methodOn$1() {
	describe("on", () => {
		it("should return a unique symbol by default", () => {
			const el = createTestElement();
			const s$4 = new u$2(el);
			const idA = s$4.on("start", () => {});
			const idB = s$4.on("start", () => {});
			assert.equal(typeof idA, "symbol");
			assert.notEqual(idA, idB);
			el.remove();
			s$4.destroy();
		});
		it("should allow duplicate event listeners", () => {
			const el = createTestElement();
			const s$4 = new u$2(el, { sourceEvents: "mouse" });
			let counter = 0;
			const listener = () => {
				++counter;
			};
			s$4.on("start", listener);
			s$4.on("start", listener);
			el.dispatchEvent(new MouseEvent("mousedown", {
				clientX: 0,
				clientY: 0,
				bubbles: true,
				cancelable: true,
				view: window
			}));
			assert.equal(counter, 2);
			el.remove();
			s$4.destroy();
		});
		it("should remove the existing listener and add the new one if the same id is used", () => {
			const el = createTestElement();
			const s$4 = new u$2(el, { sourceEvents: "mouse" });
			let msg = "";
			s$4.on("start", () => void (msg += "a"), 1);
			s$4.on("start", () => void (msg += "b"), 2);
			s$4.on("start", () => void (msg += "c"), 1);
			el.dispatchEvent(new MouseEvent("mousedown", {
				clientX: 0,
				clientY: 0,
				bubbles: true,
				cancelable: true,
				view: window
			}));
			assert.equal(msg, "bc");
			el.remove();
			s$4.destroy();
		});
		it("should allow defining a custom id (string/symbol/number) for the event listener via third argument", () => {
			const el = createTestElement();
			const s$4 = new u$2(el);
			const idA = Symbol();
			assert.equal(s$4.on("start", () => {}, idA), idA);
			const idB = 1;
			assert.equal(s$4.on("start", () => {}, idB), idB);
			const idC = "foo";
			assert.equal(s$4.on("start", () => {}, idC), idC);
			el.remove();
			s$4.destroy();
		});
	});
}

//#endregion
//#region tests/src/pointer-sensor/methods/update-settings.ts
function methodUpdateSettings$1() {
	describe("updateSettings", () => {
		it(`should update startPredicate setting`, function() {
			const s$4 = new u$2(document.body, {
				sourceEvents: "mouse",
				startPredicate: () => false
			});
			document.body.dispatchEvent(new MouseEvent("mousedown"));
			assert.equal(s$4.drag, null);
			s$4.updateSettings({ startPredicate: () => true });
			document.body.dispatchEvent(new MouseEvent("mousedown"));
			assert.notEqual(s$4.drag, null);
		});
		it(`should update sourceEvents setting`, function() {
			const s$4 = new u$2(document.body, {
				sourceEvents: "pointer",
				startPredicate: () => true
			});
			document.body.dispatchEvent(new MouseEvent("mousedown"));
			assert.equal(s$4.drag, null);
			s$4.updateSettings({ sourceEvents: "mouse" });
			document.body.dispatchEvent(new MouseEvent("mousedown"));
			assert.notEqual(s$4.drag, null);
		});
	});
}

//#endregion
//#region tests/src/pointer-sensor/methods/index.ts
function methods$2() {
	describe("methods", () => {
		methodCancel$1();
		methodDestroy$1();
		methodOff$1();
		methodOn$1();
		methodUpdateSettings$1();
	});
}

//#endregion
//#region tests/src/pointer-sensor/options/source-events.ts
function optionSourceEvents() {
	describe("sourceEvents", () => {
		it("should listen to mouse/pointer/touch events when set to \"mouse\"/\"pointer\"/\"touch\"", function() {
			const mouseSensor = new u$2(document.body, { sourceEvents: "mouse" });
			const pointerSensor = new u$2(document.body, { sourceEvents: "pointer" });
			const touchSensor = new u$2(document.body, { sourceEvents: "touch" });
			const mouseList = [];
			const pointerList = [];
			const touchList = [];
			mouseSensor.on("start", (e$5) => mouseList.push(e$5.type));
			mouseSensor.on("move", (e$5) => mouseList.push(e$5.type));
			mouseSensor.on("end", (e$5) => mouseList.push(e$5.type));
			pointerSensor.on("start", (e$5) => pointerList.push(e$5.type));
			pointerSensor.on("move", (e$5) => pointerList.push(e$5.type));
			pointerSensor.on("end", (e$5) => pointerList.push(e$5.type));
			touchSensor.on("start", (e$5) => touchList.push(e$5.type));
			touchSensor.on("move", (e$5) => touchList.push(e$5.type));
			touchSensor.on("end", (e$5) => touchList.push(e$5.type));
			createFakeDrag([
				{
					x: 1,
					y: 1
				},
				{
					x: 2,
					y: 2
				},
				{
					x: 2,
					y: 2
				}
			], {
				eventType: "mouse",
				stepDuration: 0
			});
			assert.deepEqual(mouseList, [
				"start",
				"move",
				"end"
			]);
			assert.deepEqual(pointerList, []);
			assert.deepEqual(touchList, []);
			mouseList.length = 0;
			createFakeDrag([
				{
					x: 1,
					y: 1
				},
				{
					x: 2,
					y: 2
				},
				{
					x: 2,
					y: 2
				}
			], {
				eventType: "pointer",
				stepDuration: 0
			});
			assert.deepEqual(mouseList, []);
			assert.deepEqual(pointerList, [
				"start",
				"move",
				"end"
			]);
			assert.deepEqual(touchList, []);
			pointerList.length = 0;
			createFakeDrag([
				{
					x: 1,
					y: 1
				},
				{
					x: 2,
					y: 2
				},
				{
					x: 2,
					y: 2
				}
			], {
				eventType: "touch",
				stepDuration: 0
			});
			assert.deepEqual(mouseList, []);
			assert.deepEqual(pointerList, []);
			assert.deepEqual(touchList, [
				"start",
				"move",
				"end"
			]);
			mouseSensor.destroy();
			pointerSensor.destroy();
			touchSensor.destroy();
		});
	});
}

//#endregion
//#region tests/src/pointer-sensor/options/start-predicate.ts
function optionStartPredicate$1() {
	describe("startPredicate", () => {
		it("should allow start only when e.button is 0 by default", function() {
			const s$4 = new u$2(document.body, { sourceEvents: "mouse" });
			document.body.dispatchEvent(new MouseEvent("mousedown", { button: 1 }));
			assert.equal(s$4.drag, null);
			document.body.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));
			assert.notEqual(s$4.drag, null);
			s$4.destroy();
		});
		it("should allow start when true is returned and prevent start when false is returned", function() {
			const s1 = new u$2(document.body, {
				sourceEvents: "mouse",
				startPredicate: () => true
			});
			const s2 = new u$2(document.body, {
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

//#endregion
//#region tests/src/pointer-sensor/options/index.ts
function options$1() {
	describe("options", () => {
		optionSourceEvents();
		optionStartPredicate$1();
	});
}

//#endregion
//#region tests/src/pointer-sensor/properties/drag.ts
function propDrag$1() {
	describe("drag", () => {
		it(`should be null on init`, function() {
			const s$4 = new u$2(document.body);
			assert.equal(s$4.drag, null);
			s$4.destroy();
		});
		it(`should contain drag data during drag`, function() {
			const el = createTestElement();
			const s$4 = new u$2(el, { sourceEvents: "pointer" });
			let dragEventCount = 0;
			createFakeDrag([
				{
					x: 1,
					y: 1
				},
				{
					x: 2,
					y: 2
				},
				{
					x: 2,
					y: 2
				}
			], {
				eventType: "pointer",
				pointerId: 1,
				pointerType: "touch",
				stepDuration: 0,
				onAfterStep: (e$5) => {
					++dragEventCount;
					if (e$5.type === "start") assert.deepEqual(s$4.drag, {
						pointerId: 1,
						pointerType: "touch",
						x: 1,
						y: 1
					});
					else if (e$5.type === "move") assert.deepEqual(s$4.drag, {
						pointerId: 1,
						pointerType: "touch",
						x: 2,
						y: 2
					});
					else if (e$5.type === "end") assert.equal(s$4.drag, null);
				}
			});
			assert.equal(dragEventCount, 3);
			s$4.destroy();
			el.remove();
		});
	});
}

//#endregion
//#region tests/src/pointer-sensor/properties/is-destroyed.ts
function propIsDestroyed$1() {
	describe("isDestroyed", () => {
		it(`should be false on init`, function() {
			const s$4 = new u$2(document.body);
			assert.equal(s$4.isDestroyed, false);
			s$4.destroy();
		});
		it(`should be true after destroy method is called`, function() {
			const s$4 = new u$2(document.body);
			s$4.destroy();
			assert.equal(s$4.isDestroyed, true);
		});
		it(`should prevent drag from starting when true`, () => {
			const el = createTestElement();
			const s$4 = new u$2(el, { sourceEvents: "mouse" });
			s$4.destroy();
			createFakeDrag([
				{
					x: 1,
					y: 1
				},
				{
					x: 2,
					y: 2
				},
				{
					x: 2,
					y: 2
				}
			], {
				eventType: "mouse",
				stepDuration: 0,
				onAfterStep: () => {
					assert.equal(s$4.drag, null);
				}
			});
			assert.equal(s$4.drag, null);
			el.remove();
		});
	});
}

//#endregion
//#region tests/src/pointer-sensor/properties/index.ts
function properties$1() {
	describe("properties", () => {
		propDrag$1();
		propIsDestroyed$1();
	});
}

//#endregion
//#region tests/src/pointer-sensor/misc.ts
function misc() {
	describe("misc", () => {
		describe("target element parameter", () => {
			it("should accept document.documentElement", function() {
				const s$4 = new u$2(document.documentElement, { sourceEvents: "mouse" });
				document.documentElement.dispatchEvent(new MouseEvent("mousedown"));
				assert.notEqual(s$4.drag, null);
				s$4.destroy();
			});
			it("should accept document.body", function() {
				const s$4 = new u$2(document.body, { sourceEvents: "mouse" });
				document.body.dispatchEvent(new MouseEvent("mousedown"));
				assert.notEqual(s$4.drag, null);
				s$4.destroy();
			});
			it("should accept a descendant of document.body", function() {
				const el = createTestElement();
				const s$4 = new u$2(el, { sourceEvents: "mouse" });
				el.dispatchEvent(new MouseEvent("mousedown"));
				assert.notEqual(s$4.drag, null);
				el.remove();
				s$4.destroy();
			});
		});
	});
}

//#endregion
//#region tests/src/pointer-sensor/index.ts
describe("PointerSensor", () => {
	beforeEach(() => {
		addDefaultPageStyles(document);
		return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
	});
	afterEach(() => {
		removeDefaultPageStyles(document);
		return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
	});
	events$2();
	methods$2();
	options$1();
	properties$1();
	misc();
});

//#endregion
//#region tests/src/utils/blur-element.ts
function blurElement(element) {
	if (element === document.activeElement) {
		element.blur();
		element.dispatchEvent(new FocusEvent("blur"));
	}
}

//#endregion
//#region tests/src/utils/wait.ts
function wait(time) {
	return new Promise((resolve) => {
		window.setTimeout(() => {
			resolve(void 0);
		}, time);
	});
}

//#endregion
//#region tests/src/keyboard-sensor/options/cancel-on-blur.ts
function optionCancelOnBlur() {
	describe("cancelOnBlur", () => {
		it("should cancel drag on blur when true", async () => {
			const el = createTestElement();
			const s$4 = new r(el, { cancelOnBlur: true });
			assert.equal(s$4["_cancelOnBlur"], true);
			let cancelEvents = 0;
			s$4.on("cancel", () => {
				++cancelEvents;
			});
			let endEvents = 0;
			s$4.on("end", () => {
				++endEvents;
			});
			focusElement(el);
			document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
			assert.notEqual(s$4.drag, null);
			blurElement(el);
			await wait(1);
			assert.equal(s$4.drag, null);
			assert.equal(cancelEvents, 1);
			assert.equal(endEvents, 0);
			el.remove();
			s$4.destroy();
		});
		it("should not cancel drag on blur when false", () => {
			const el = createTestElement();
			const s$4 = new r(el, { cancelOnBlur: false });
			assert.equal(s$4["_cancelOnBlur"], false);
			focusElement(el);
			document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
			assert.notEqual(s$4.drag, null);
			blurElement(el);
			assert.notEqual(s$4.drag, null);
			el.remove();
			s$4.destroy();
		});
	});
}

//#endregion
//#region tests/src/keyboard-sensor/options/cancel-predicate.ts
function optionCancelPredicate() {
	describe("cancelPredicate", () => {
		it("should define the cancel predicate", () => {
			let returnValue = null;
			const el = createTestElement();
			const s$4 = new r(el, { cancelPredicate: (e$5, sensor) => {
				assert.equal(e$5.type, "keydown");
				assert.equal(sensor, s$4);
				return returnValue;
			} });
			focusElement(el);
			document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
			returnValue = null;
			document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
			assert.notEqual(s$4.drag, null);
			returnValue = void 0;
			document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
			assert.notEqual(s$4.drag, null);
			returnValue = {
				x: 1,
				y: 1
			};
			document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
			assert.equal(s$4.drag, null);
			el.remove();
			s$4.destroy();
		});
		it(`should cancel drag with Escape by default`, function() {
			const el = createTestElement();
			const s$4 = new r(el);
			const srcEvent = new KeyboardEvent("keydown", { key: "Escape" });
			focusElement(el);
			document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
			assert.deepEqual(s$4.drag, {
				x: 0,
				y: 0
			});
			document.dispatchEvent(srcEvent);
			assert.equal(s$4.drag, null);
			s$4.destroy();
			el.remove();
		});
	});
}

//#endregion
//#region tests/src/keyboard-sensor/options/end-predicate.ts
function optionEndPredicate() {
	describe("endPredicate", () => {
		it("should define the end predicate", () => {
			let returnValue = null;
			const el = createTestElement();
			const s$4 = new r(el, { endPredicate: (e$5, sensor) => {
				assert.equal(e$5.type, "keydown");
				assert.equal(sensor, s$4);
				return returnValue;
			} });
			focusElement(el);
			document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
			returnValue = null;
			document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
			assert.notEqual(s$4.drag, null);
			returnValue = void 0;
			document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
			assert.notEqual(s$4.drag, null);
			returnValue = {
				x: 1,
				y: 1
			};
			document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
			assert.equal(s$4.drag, null);
			el.remove();
			s$4.destroy();
		});
		it(`should end drag with Enter and Space by default when the target element is focused`, function() {
			["Enter", " "].forEach((key) => {
				const el = createTestElement();
				const s$4 = new r(el);
				focusElement(el);
				document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
				assert.deepEqual(s$4.drag, {
					x: 0,
					y: 0
				});
				document.dispatchEvent(new KeyboardEvent("keydown", { key }));
				assert.equal(s$4.drag, null);
				s$4.destroy();
				el.remove();
			});
		});
	});
}

//#endregion
//#region tests/src/keyboard-sensor/options/move-distance.ts
function optionMoveDistance() {
	describe("moveDistance", () => {
		it("should define the drag movement distance for x-axis and y-axis separately with an object", () => {
			const el = createTestElement();
			const s$4 = new r(el, { moveDistance: {
				x: 7,
				y: 9
			} });
			assert.deepEqual(s$4.moveDistance, {
				x: 7,
				y: 9
			});
			focusElement(el);
			document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
			assert.deepEqual(s$4.drag, {
				x: 0,
				y: 0
			});
			document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
			assert.deepEqual(s$4.drag, {
				x: 7,
				y: 0
			});
			document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
			assert.deepEqual(s$4.drag, {
				x: 7,
				y: 9
			});
			document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft" }));
			assert.deepEqual(s$4.drag, {
				x: 0,
				y: 9
			});
			document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp" }));
			assert.deepEqual(s$4.drag, {
				x: 0,
				y: 0
			});
			el.remove();
			s$4.destroy();
		});
		it("should define the drag movement distance for both axes with a number", () => {
			const el = createTestElement();
			const s$4 = new r(el, { moveDistance: 5 });
			assert.deepEqual(s$4.moveDistance, {
				x: 5,
				y: 5
			});
			focusElement(el);
			document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
			assert.deepEqual(s$4.drag, {
				x: 0,
				y: 0
			});
			document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
			assert.deepEqual(s$4.drag, {
				x: 5,
				y: 0
			});
			document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
			assert.deepEqual(s$4.drag, {
				x: 5,
				y: 5
			});
			document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft" }));
			assert.deepEqual(s$4.drag, {
				x: 0,
				y: 5
			});
			document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp" }));
			assert.deepEqual(s$4.drag, {
				x: 0,
				y: 0
			});
			el.remove();
			s$4.destroy();
		});
	});
}

//#endregion
//#region tests/src/keyboard-sensor/options/move-predicate.ts
function optionMovePredicate() {
	describe("movePredicate", () => {
		it("should define the move predicate", () => {
			let returnValue = null;
			const el = createTestElement();
			const s$4 = new r(el, { movePredicate: (e$5, sensor) => {
				assert.equal(e$5.type, "keydown");
				assert.equal(sensor, s$4);
				return returnValue;
			} });
			focusElement(el);
			document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
			returnValue = null;
			document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
			assert.deepEqual(s$4.drag, {
				x: 0,
				y: 0
			});
			returnValue = void 0;
			document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
			assert.deepEqual(s$4.drag, {
				x: 0,
				y: 0
			});
			returnValue = {
				x: 1,
				y: 1
			};
			document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
			assert.deepEqual(s$4.drag, returnValue);
			el.remove();
			s$4.destroy();
		});
		it(`should move drag with arrow keys by default`, function() {
			[
				"ArrowLeft",
				"ArrowRight",
				"ArrowUp",
				"ArrowDown"
			].forEach((key) => {
				const el = createTestElement();
				const s$4 = new r(el, { moveDistance: 1 });
				const srcEvent = new KeyboardEvent("keydown", { key });
				focusElement(el);
				document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
				document.dispatchEvent(srcEvent);
				switch (key) {
					case "ArrowLeft":
						assert.deepEqual(s$4.drag, {
							x: -1,
							y: 0
						});
						break;
					case "ArrowRight":
						assert.deepEqual(s$4.drag, {
							x: 1,
							y: 0
						});
						break;
					case "ArrowUp":
						assert.deepEqual(s$4.drag, {
							x: 0,
							y: -1
						});
						break;
					case "ArrowDown":
						assert.deepEqual(s$4.drag, {
							x: 0,
							y: 1
						});
						break;
				}
				s$4.destroy();
				el.remove();
			});
		});
	});
}

//#endregion
//#region tests/src/keyboard-sensor/options/start-predicate.ts
function optionStartPredicate() {
	describe("startPredicate", () => {
		it("should define the start predicate", () => {
			let returnValue = null;
			const el = createTestElement();
			const s$4 = new r(el, { startPredicate: (e$5, sensor) => {
				assert.equal(e$5.type, "keydown");
				assert.equal(sensor, s$4);
				return returnValue;
			} });
			returnValue = null;
			document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
			assert.equal(s$4.drag, null);
			returnValue = void 0;
			document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
			assert.equal(s$4.drag, null);
			returnValue = {
				x: 10,
				y: 20
			};
			document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
			assert.deepEqual(s$4.drag, {
				x: 10,
				y: 20
			});
			el.remove();
			s$4.destroy();
		});
		it(`should start drag with Enter and Space by default when the target element is focused`, function() {
			["Enter", " "].forEach((key) => {
				const el = createTestElement();
				const elDecoy = createTestElement();
				const s$4 = new r(el);
				const srcEvent = new KeyboardEvent("keydown", { key });
				document.dispatchEvent(srcEvent);
				assert.equal(s$4.drag, null);
				focusElement(elDecoy);
				document.dispatchEvent(srcEvent);
				assert.equal(s$4.drag, null);
				focusElement(el);
				document.dispatchEvent(srcEvent);
				assert.deepEqual(s$4.drag, {
					x: 0,
					y: 0
				});
				s$4.destroy();
				el.remove();
				elDecoy.remove();
			});
		});
	});
}

//#endregion
//#region tests/src/keyboard-sensor/options/index.ts
function options() {
	describe("options", () => {
		optionCancelOnBlur();
		optionCancelPredicate();
		optionEndPredicate();
		optionMoveDistance();
		optionMovePredicate();
		optionStartPredicate();
	});
}

//#endregion
//#region tests/src/keyboard-sensor/properties/drag.ts
function propDrag() {
	describe("drag", () => {
		it(`should be null on init`, function() {
			const el = createTestElement();
			const s$4 = new r(el);
			assert.equal(s$4.drag, null);
			el.remove();
			s$4.destroy();
		});
		it(`should be null after destroy method is called`, function() {
			const el = createTestElement();
			const s$4 = new r(el);
			focusElement(el);
			document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
			assert.notEqual(s$4.drag, null);
			s$4.destroy();
			assert.equal(s$4.drag, null);
			el.remove();
		});
		it(`should match the current drag position`, function() {
			const el = createTestElement();
			const s$4 = new r(el, { moveDistance: 1 });
			focusElement(el);
			document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
			assert.deepEqual(s$4.drag, {
				x: 0,
				y: 0
			});
			document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
			assert.deepEqual(s$4.drag, {
				x: 1,
				y: 0
			});
			document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
			assert.deepEqual(s$4.drag, {
				x: 1,
				y: 1
			});
			document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft" }));
			assert.deepEqual(s$4.drag, {
				x: 0,
				y: 1
			});
			document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp" }));
			assert.deepEqual(s$4.drag, {
				x: 0,
				y: 0
			});
			s$4.destroy();
			el.remove();
		});
	});
}

//#endregion
//#region tests/src/keyboard-sensor/properties/is-destroyed.ts
function propIsDestroyed() {
	describe("isDestroyed", () => {
		it(`should be false on init`, function() {
			const el = createTestElement();
			const s$4 = new r(el);
			assert.equal(s$4.isDestroyed, false);
			el.remove();
			s$4.destroy();
		});
		it(`should be true after destroy method is called`, function() {
			const el = createTestElement();
			const s$4 = new r(el);
			s$4.destroy();
			assert.equal(s$4.isDestroyed, true);
			el.remove();
		});
		it(`should prevent drag from starting when true`, () => {
			const el = createTestElement();
			const s$4 = new r(el);
			s$4.destroy();
			focusElement(el);
			document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
			assert.equal(s$4.drag, null);
			el.remove();
		});
	});
}

//#endregion
//#region tests/src/keyboard-sensor/properties/index.ts
function properties() {
	describe("properties", () => {
		propDrag();
		propIsDestroyed();
	});
}

//#endregion
//#region tests/src/keyboard-sensor/methods/cancel.ts
function methodCancel() {
	describe("cancel", () => {
		it(`should emit "cancel" event with correct arguments after updating instance properties`, () => {
			const el = createTestElement();
			const s$4 = new r(el);
			let events$5 = [];
			s$4.on("start", (data) => void events$5.push(data.type));
			s$4.on("move", (data) => void events$5.push(data.type));
			s$4.on("end", (data) => void events$5.push(data.type));
			s$4.on("destroy", (data) => void events$5.push(data.type));
			s$4.on("cancel", (data) => {
				assert.deepEqual(data, {
					type: "cancel",
					x: s$4.drag.x,
					y: s$4.drag.y
				});
				events$5.push(data.type);
			});
			focusElement(el);
			document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
			assert.notEqual(s$4.drag, null);
			s$4.cancel();
			assert.equal(s$4.drag, null);
			assert.deepEqual(events$5, ["start", "cancel"]);
			s$4.destroy();
			el.remove();
		});
		it(`should not do anything if drag is not active`, () => {
			const el = createTestElement();
			const s$4 = new r(el);
			let events$5 = [];
			s$4.on("start", (data) => void events$5.push(data.type));
			s$4.on("move", (data) => void events$5.push(data.type));
			s$4.on("end", (data) => void events$5.push(data.type));
			s$4.on("destroy", (data) => void events$5.push(data.type));
			s$4.on("cancel", (data) => void events$5.push(data.type));
			s$4.cancel();
			assert.deepEqual(events$5, []);
			s$4.destroy();
			el.remove();
		});
	});
}

//#endregion
//#region tests/src/keyboard-sensor/methods/destroy.ts
function methodDestroy() {
	describe("destroy", () => {
		it("should allow destroying only once", () => {
			const el = createTestElement();
			const s$4 = new r(el);
			let events$5 = [];
			s$4.destroy();
			s$4.on("destroy", (data) => void events$5.push(data.type));
			s$4.destroy();
			assert.deepEqual(events$5, []);
			el.remove();
		});
		describe("if drag active", () => {
			it(`should set isDestroyed property to true, emit "cancel" event with the current x/y coordinates, reset drag data, emit "destroy" event and remove all listeners`, () => {
				const el = createTestElement();
				const s$4 = new r(el);
				let events$5 = [];
				s$4.on("start", (data) => void events$5.push(data.type));
				s$4.on("move", (data) => void events$5.push(data.type));
				s$4.on("end", (data) => void events$5.push(data.type));
				s$4.on("cancel", (data) => {
					assert.notEqual(s$4.drag, null);
					assert.equal(s$4.isDestroyed, true);
					assert.deepEqual(data, {
						type: "cancel",
						x: s$4.drag.x,
						y: s$4.drag.y
					});
					events$5.push(data.type);
				});
				s$4.on("destroy", (data) => {
					assert.equal(s$4.drag, null);
					assert.equal(s$4.isDestroyed, true);
					assert.deepEqual(data, { type: "destroy" });
					events$5.push(data.type);
				});
				assert.equal(s$4["_emitter"].listenerCount(), 5);
				focusElement(el);
				document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
				s$4.destroy();
				el.remove();
				assert.equal(s$4.drag, null);
				assert.equal(s$4.isDestroyed, true);
				assert.deepEqual(events$5, [
					"start",
					"cancel",
					"destroy"
				]);
				assert.equal(s$4["_emitter"].listenerCount(), 0);
			});
		});
		describe("if drag is not active", () => {
			it(`should set isDestroyed property to true, emit "destroy" event and remove all listeners`, () => {
				const el = createTestElement();
				const s$4 = new r(el);
				let events$5 = [];
				s$4.on("start", (data) => void events$5.push(data.type));
				s$4.on("move", (data) => void events$5.push(data.type));
				s$4.on("end", (data) => void events$5.push(data.type));
				s$4.on("cancel", (data) => void events$5.push(data.type));
				s$4.on("destroy", (data) => {
					assert.equal(s$4.drag, null);
					assert.equal(s$4.isDestroyed, true);
					assert.deepEqual(data, { type: "destroy" });
					events$5.push(data.type);
				});
				assert.equal(s$4["_emitter"].listenerCount(), 5);
				s$4.destroy();
				el.remove();
				assert.equal(s$4.drag, null);
				assert.equal(s$4.isDestroyed, true);
				assert.deepEqual(events$5, ["destroy"]);
				assert.equal(s$4["_emitter"].listenerCount(), 0);
			});
		});
	});
}

//#endregion
//#region tests/src/keyboard-sensor/methods/off.ts
function methodOff() {
	describe("off", () => {
		it("should remove an event listener based on id", () => {
			const el = createTestElement();
			const s$4 = new r(el);
			let msg = "";
			const idA = s$4.on("start", () => void (msg += "a"));
			s$4.on("start", () => void (msg += "b"));
			s$4.off("start", idA);
			focusElement(el);
			document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
			assert.equal(msg, "b");
			s$4.destroy();
			el.remove();
		});
	});
}

//#endregion
//#region tests/src/keyboard-sensor/methods/on.ts
function methodOn() {
	describe("on", () => {
		it("should return a unique symbol by default", () => {
			const el = createTestElement();
			const s$4 = new r(el);
			const idA = s$4.on("start", () => {});
			const idB = s$4.on("start", () => {});
			assert.equal(typeof idA, "symbol");
			assert.notEqual(idA, idB);
			el.remove();
			s$4.destroy();
		});
		it("should allow duplicate event listeners", () => {
			const el = createTestElement();
			const s$4 = new r(el);
			let counter = 0;
			const listener = () => {
				++counter;
			};
			s$4.on("start", listener);
			s$4.on("start", listener);
			focusElement(el);
			document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
			assert.equal(counter, 2);
			el.remove();
			s$4.destroy();
		});
		it("should remove the existing listener and add the new one if the same id is used", () => {
			const el = createTestElement();
			const s$4 = new r(el);
			let msg = "";
			s$4.on("start", () => void (msg += "a"), 1);
			s$4.on("start", () => void (msg += "b"), 2);
			s$4.on("start", () => void (msg += "c"), 1);
			focusElement(el);
			document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
			assert.equal(msg, "bc");
			el.remove();
			s$4.destroy();
		});
		it("should allow defining a custom id (string/symbol/number) for the event listener via third argument", () => {
			const el = createTestElement();
			const s$4 = new r(el);
			const idA = Symbol();
			assert.equal(s$4.on("start", () => {}, idA), idA);
			const idB = 1;
			assert.equal(s$4.on("start", () => {}, idB), idB);
			const idC = "foo";
			assert.equal(s$4.on("start", () => {}, idC), idC);
			el.remove();
			s$4.destroy();
		});
	});
}

//#endregion
//#region tests/src/keyboard-sensor/methods/update-settings.ts
function methodUpdateSettings() {
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
			const s$4 = new r(el, initSettings);
			assert.equal(s$4.moveDistance.x, initSettings.moveDistance);
			assert.equal(s$4.moveDistance.y, initSettings.moveDistance);
			assert.equal(s$4["_cancelOnBlur"], initSettings.cancelOnBlur);
			assert.equal(s$4["_cancelOnVisibilityChange"], initSettings.cancelOnVisibilityChange);
			assert.equal(s$4["_startPredicate"], initSettings.startPredicate);
			assert.equal(s$4["_movePredicate"], initSettings.movePredicate);
			assert.equal(s$4["_cancelPredicate"], initSettings.cancelPredicate);
			assert.equal(s$4["_endPredicate"], initSettings.endPredicate);
			s$4.updateSettings(updatedSettings);
			assert.equal(s$4.moveDistance.x, updatedSettings.moveDistance);
			assert.equal(s$4.moveDistance.y, updatedSettings.moveDistance);
			assert.equal(s$4["_cancelOnBlur"], updatedSettings.cancelOnBlur);
			assert.equal(s$4["_cancelOnVisibilityChange"], updatedSettings.cancelOnVisibilityChange);
			assert.equal(s$4["_startPredicate"], updatedSettings.startPredicate);
			assert.equal(s$4["_movePredicate"], updatedSettings.movePredicate);
			assert.equal(s$4["_cancelPredicate"], updatedSettings.cancelPredicate);
			assert.equal(s$4["_endPredicate"], updatedSettings.endPredicate);
			s$4.destroy();
			el.remove();
		});
	});
}

//#endregion
//#region tests/src/keyboard-sensor/methods/index.ts
function methods$1() {
	describe("methods", () => {
		methodCancel();
		methodDestroy();
		methodOff();
		methodOn();
		methodUpdateSettings();
	});
}

//#endregion
//#region tests/src/keyboard-sensor/events/cancel.ts
function eventCancel() {
	describe("cancel", () => {
		it("should be triggered on drag cancel", () => {
			const el = createTestElement();
			const s$4 = new r(el);
			const cancelEvent = {
				type: "cancel",
				x: 0,
				y: 0,
				srcEvent: new KeyboardEvent("keydown", { key: "Escape" })
			};
			let cancelEventCount = 0;
			s$4.on("cancel", (e$5) => {
				assert.deepEqual(e$5, cancelEvent);
				++cancelEventCount;
			});
			focusElement(el);
			document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
			document.dispatchEvent(cancelEvent.srcEvent);
			assert.equal(cancelEventCount, 1);
			el.remove();
			s$4.destroy();
		});
	});
}

//#endregion
//#region tests/src/keyboard-sensor/events/destroy.ts
function eventDestroy() {
	describe("destroy", () => {
		it("should be triggered on destroy", () => {
			const el = createTestElement();
			const s$4 = new r(el);
			let destroyEventCount = 0;
			s$4.on("destroy", (e$5) => {
				assert.deepEqual(e$5, { type: "destroy" });
				++destroyEventCount;
			});
			s$4.destroy();
			assert.equal(destroyEventCount, 1);
			el.remove();
		});
	});
}

//#endregion
//#region tests/src/keyboard-sensor/events/end.ts
function eventEnd() {
	describe("end", () => {
		it("should be triggered on drag end", () => {
			const el = createTestElement();
			const s$4 = new r(el);
			const endEvent = {
				type: "end",
				x: 0,
				y: 0,
				srcEvent: new KeyboardEvent("keydown", { key: "Enter" })
			};
			let endEventCount = 0;
			s$4.on("end", (e$5) => {
				assert.deepEqual(e$5, endEvent);
				++endEventCount;
			});
			focusElement(el);
			document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
			document.dispatchEvent(endEvent.srcEvent);
			assert.equal(endEventCount, 1);
			el.remove();
			s$4.destroy();
		});
	});
}

//#endregion
//#region tests/src/keyboard-sensor/events/move.ts
function eventMove() {
	describe("move", () => {
		it("should be triggered on drag move", () => {
			const el = createTestElement();
			const s$4 = new r(el, { moveDistance: 1 });
			let expectedEvent;
			let moveEventCount = 0;
			s$4.on("move", (e$5) => {
				assert.deepEqual(e$5, expectedEvent);
				++moveEventCount;
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
			s$4.destroy();
		});
	});
}

//#endregion
//#region tests/src/keyboard-sensor/events/start.ts
function eventStart() {
	describe("start", () => {
		it(`should be triggered on drag start`, function() {
			const el = createTestElement({
				left: "10px",
				top: "20px"
			});
			const s$4 = new r(el);
			const expectedEvent = {
				type: "start",
				x: 10,
				y: 20,
				srcEvent: new KeyboardEvent("keydown", { key: "Enter" })
			};
			let startEventCount = 0;
			s$4.on("start", (e$5) => {
				assert.deepEqual(e$5, expectedEvent);
				++startEventCount;
			});
			focusElement(el);
			document.dispatchEvent(expectedEvent.srcEvent);
			assert.equal(startEventCount, 1);
			el.remove();
			s$4.destroy();
		});
	});
}

//#endregion
//#region tests/src/keyboard-sensor/events/index.ts
function events$1() {
	describe("events", () => {
		eventCancel();
		eventDestroy();
		eventEnd();
		eventMove();
		eventStart();
	});
}

//#endregion
//#region tests/src/keyboard-sensor/index.ts
describe("KeyboardSensor", () => {
	beforeEach(() => {
		addDefaultPageStyles(document);
		return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
	});
	afterEach(() => {
		removeDefaultPageStyles(document);
		return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
	});
	options();
	properties();
	methods$1();
	events$1();
});

//#endregion
//#region tests/src/utils/keyboard-helpers.ts
const press = (key) => document.dispatchEvent(new KeyboardEvent("keydown", { key }));
const startDrag = async (el) => {
	focusElement(el);
	press("Enter");
	await waitNextFrame();
};
const endDrag = async () => {
	press("Enter");
	await waitNextFrame();
};
const move = async (direction, times = 1) => {
	for (let i$2 = 0; i$2 < times; i$2++) {
		press(`Arrow${direction}`);
		await waitNextFrame();
	}
};

//#endregion
//#region dist/get-intersection-score-nMuj0vta.js
function e$1(e$5, t$6, n$7 = {
	width: 0,
	height: 0,
	x: 0,
	y: 0
}) {
	let r$3 = Math.max(e$5.x, t$6.x), i$2 = Math.min(e$5.x + e$5.width, t$6.x + t$6.width);
	if (i$2 <= r$3) return null;
	let a$2 = Math.max(e$5.y, t$6.y), o$2 = Math.min(e$5.y + e$5.height, t$6.y + t$6.height);
	return o$2 <= a$2 ? null : (n$7.x = r$3, n$7.y = a$2, n$7.width = i$2 - r$3, n$7.height = o$2 - a$2, n$7);
}
const t$4 = {
	width: 0,
	height: 0,
	x: 0,
	y: 0
};
function n$1(n$7, r$3, i$2) {
	if (i$2 ||= e$1(n$7, r$3, t$4), !i$2) return 0;
	let a$2 = i$2.width * i$2.height;
	return a$2 ? a$2 / (Math.min(n$7.width, r$3.width) * Math.min(n$7.height, r$3.height)) * 100 : 0;
}

//#endregion
//#region dist/droppable-BAFZw0DQ.js
const t$3 = { Destroy: `destroy` };
var n = class {
	constructor(t$6, n$7 = {}) {
		let { id: r$3 = Symbol(), accept: i$2 = () => !0, data: a$2 = {} } = n$7;
		this.id = r$3, this.element = t$6, this.accept = i$2, this.data = a$2, this.isDestroyed = !1, this._clientRect = {
			x: 0,
			y: 0,
			width: 0,
			height: 0
		}, this._emitter = new v$1(), this.updateClientRect();
	}
	on(e$5, t$6, n$7) {
		return this._emitter.on(e$5, t$6, n$7);
	}
	off(e$5, t$6) {
		this._emitter.off(e$5, t$6);
	}
	getClientRect() {
		return this._clientRect;
	}
	updateClientRect(e$5) {
		let t$6 = e$5 || this.element.getBoundingClientRect(), { _clientRect: n$7 } = this;
		n$7.x = t$6.x, n$7.y = t$6.y, n$7.width = t$6.width, n$7.height = t$6.height;
	}
	destroy() {
		this.isDestroyed || (this.isDestroyed = !0, this._emitter.emit(t$3.Destroy), this._emitter.off());
	}
};

//#endregion
//#region dist/collision-detector-Dl1FQ6MW.js
var n$3 = class {
	constructor(e$5) {
		this._items = [], this._index = 0, this._getItem = e$5;
	}
	get(...e$5) {
		return this._index >= this._items.length ? this._items[this._index++] = this._getItem(void 0, ...e$5) : this._getItem(this._items[this._index++], ...e$5);
	}
	resetPointer() {
		this._index = 0;
	}
	resetItems(e$5 = 0) {
		let t$6 = Math.max(0, Math.min(e$5, this._items.length));
		this._index = Math.min(this._index, t$6), this._items.length = t$6;
	}
};
function r$1(e$5, t$6 = {
	width: 0,
	height: 0,
	x: 0,
	y: 0
}) {
	return e$5 && (t$6.width = e$5.width, t$6.height = e$5.height, t$6.x = e$5.x, t$6.y = e$5.y), t$6;
}
const i = Symbol();
var a = class {
	constructor(e$5) {
		this._listenerId = Symbol(), this._dndContext = e$5, this._collisionDataPoolCache = [], this._collisionDataPoolMap = /* @__PURE__ */ new Map();
	}
	_checkCollision(n$7, i$2, a$2) {
		let o$2 = n$7.getClientRect(), s$4 = i$2.getClientRect();
		if (!o$2) return null;
		let c$4 = e$1(o$2, s$4, a$2.intersectionRect);
		if (c$4 === null) return null;
		let l$5 = n$1(o$2, s$4, c$4);
		return l$5 <= 0 ? null : (a$2.droppableId = i$2.id, r$1(s$4, a$2.droppableRect), r$1(o$2, a$2.draggableRect), a$2.intersectionScore = l$5, a$2);
	}
	_sortCollisions(e$5, t$6) {
		return t$6.sort((e$6, t$7) => {
			let n$7 = t$7.intersectionScore - e$6.intersectionScore;
			return n$7 === 0 ? e$6.droppableRect.width * e$6.droppableRect.height - t$7.droppableRect.width * t$7.droppableRect.height : n$7;
		});
	}
	_createCollisionData() {
		return {
			droppableId: i,
			droppableRect: r$1(),
			draggableRect: r$1(),
			intersectionRect: r$1(),
			intersectionScore: 0
		};
	}
	getCollisionDataPool(e$5) {
		let t$6 = this._collisionDataPoolMap.get(e$5);
		return t$6 || (t$6 = this._collisionDataPoolCache.pop() || new n$3((e$6) => e$6 || this._createCollisionData()), this._collisionDataPoolMap.set(e$5, t$6)), t$6;
	}
	removeCollisionDataPool(e$5) {
		let t$6 = this._collisionDataPoolMap.get(e$5);
		t$6 && (t$6.resetItems(20), t$6.resetPointer(), this._collisionDataPoolCache.push(t$6), this._collisionDataPoolMap.delete(e$5));
	}
	detectCollisions(e$5, t$6, n$7) {
		if (n$7.length = 0, !t$6.size) return;
		let r$3 = this.getCollisionDataPool(e$5), i$2 = null, a$2 = t$6.values();
		for (let t$7 of a$2) i$2 ||= r$3.get(), this._checkCollision(e$5, t$7, i$2) && (n$7.push(i$2), i$2 = null);
		n$7.length > 1 && this._sortCollisions(e$5, n$7), r$3.resetPointer();
	}
	destroy() {
		this._collisionDataPoolMap.forEach((e$5) => {
			e$5.resetItems();
		});
	}
};

//#endregion
//#region dist/dnd-context.js
var s$1 = function(e$5) {
	return e$5[e$5.Idle = 0] = `Idle`, e$5[e$5.Computing = 1] = `Computing`, e$5[e$5.Computed = 2] = `Computed`, e$5[e$5.Emitting = 3] = `Emitting`, e$5;
}(s$1 || {});
const c$1 = {
	capture: !0,
	passive: !0
}, l$1 = {
	Start: `start`,
	Move: `move`,
	Enter: `enter`,
	Leave: `leave`,
	Collide: `collide`,
	End: `end`,
	AddDraggables: `addDraggables`,
	RemoveDraggables: `removeDraggables`,
	AddDroppables: `addDroppables`,
	RemoveDroppables: `removeDroppables`,
	Destroy: `destroy`
};
var u = class {
	constructor(e$5 = {}) {
		this._onScroll = () => {
			this._drags.size !== 0 && (n$2.once(t$2.read, () => {
				this.updateDroppableClientRects();
			}, this._listenerId), this.detectCollisions());
		};
		let { collisionDetector: r$3 } = e$5;
		this.draggables = /* @__PURE__ */ new Map(), this.droppables = /* @__PURE__ */ new Map(), this.isDestroyed = !1, this._drags = /* @__PURE__ */ new Map(), this._listenerId = Symbol(), this._emitter = new v$1(), this._onScroll = this._onScroll.bind(this), this._collisionDetector = r$3 ? r$3(this) : new a(this);
	}
	get drags() {
		return this._drags;
	}
	_isMatch(e$5, t$6) {
		let n$7 = typeof t$6.accept == `function` ? t$6.accept(e$5) : t$6.accept.includes(e$5.settings.group);
		if (n$7 && e$5.drag) {
			let n$8 = e$5.drag.items;
			for (let e$6 = 0; e$6 < n$8.length; e$6++) if (n$8[e$6].element === t$6.element) return !1;
		}
		return n$7;
	}
	_getTargets(e$5) {
		let t$6 = this._drags.get(e$5);
		if (t$6?._targets) return t$6._targets;
		let n$7 = /* @__PURE__ */ new Map();
		for (let t$7 of this.droppables.values()) this._isMatch(e$5, t$7) && n$7.set(t$7.id, t$7);
		return t$6 && (t$6._targets = n$7), n$7;
	}
	_onDragPrepareStart(e$5) {
		this.draggables.has(e$5.id) && (this._drags.get(e$5) || (this._drags.set(e$5, {
			isEnded: !1,
			data: {},
			_targets: null,
			_cd: {
				phase: s$1.Idle,
				tickerId: Symbol(),
				targets: /* @__PURE__ */ new Map(),
				collisions: [],
				contacts: /* @__PURE__ */ new Set(),
				prevContacts: /* @__PURE__ */ new Set(),
				addedContacts: /* @__PURE__ */ new Set(),
				persistedContacts: /* @__PURE__ */ new Set()
			}
		}), this._drags.size === 1 && this.updateDroppableClientRects(), this._computeCollisions(e$5), this._drags.size === 1 && window.addEventListener(`scroll`, this._onScroll, c$1)));
	}
	_onDragStart(e$5) {
		let t$6 = this._drags.get(e$5);
		if (!(!t$6 || t$6.isEnded)) {
			if (this._emitter.listenerCount(l$1.Start)) {
				let t$7 = this._getTargets(e$5);
				this._emitter.emit(l$1.Start, {
					draggable: e$5,
					targets: t$7
				});
			}
			this._emitCollisions(e$5);
		}
	}
	_onDragPrepareMove(e$5) {
		let t$6 = this._drags.get(e$5);
		!t$6 || t$6.isEnded || this._computeCollisions(e$5);
	}
	_onDragMove(e$5) {
		let t$6 = this._drags.get(e$5);
		if (!(!t$6 || t$6.isEnded)) {
			if (this._emitter.listenerCount(l$1.Move)) {
				let t$7 = this._getTargets(e$5);
				this._emitter.emit(l$1.Move, {
					draggable: e$5,
					targets: t$7
				});
			}
			this._emitCollisions(e$5);
		}
	}
	_onDragEnd(e$5) {
		this._stopDrag(e$5);
	}
	_onDragCancel(e$5) {
		this._stopDrag(e$5, !0);
	}
	_onDraggableDestroy(e$5) {
		this.removeDraggables([e$5]);
	}
	_stopDrag(e$5, t$6 = !1) {
		let n$7 = this._drags.get(e$5);
		if (!n$7 || n$7.isEnded) return !1;
		n$7.isEnded = !0;
		let r$3 = n$7._cd.phase === s$1.Emitting;
		r$3 || (this._computeCollisions(e$5, !0), this._emitCollisions(e$5, !0));
		let { targets: i$2, collisions: a$2, contacts: o$2 } = n$7._cd;
		return this._emitter.listenerCount(l$1.End) && this._emitter.emit(l$1.End, {
			canceled: t$6,
			draggable: e$5,
			targets: i$2,
			collisions: a$2,
			contacts: o$2
		}), r$3 ? (window.queueMicrotask(() => {
			this._finalizeStopDrag(e$5);
		}), !0) : (this._finalizeStopDrag(e$5), !1);
	}
	_finalizeStopDrag(e$5) {
		let r$3 = this._drags.get(e$5);
		!r$3 || !r$3.isEnded || (this._drags.delete(e$5), this._collisionDetector.removeCollisionDataPool(e$5), n$2.off(t$2.read, r$3._cd.tickerId), n$2.off(t$2.write, r$3._cd.tickerId), this._drags.size || (n$2.off(t$2.read, this._listenerId), window.removeEventListener(`scroll`, this._onScroll, c$1)));
	}
	_computeCollisions(e$5, t$6 = !1) {
		let n$7 = this._drags.get(e$5);
		if (!n$7 || !t$6 && n$7.isEnded) return;
		let r$3 = n$7._cd;
		switch (r$3.phase) {
			case s$1.Computing: throw Error(`Collisions are being computed.`);
			case s$1.Emitting: throw Error(`Collisions are being emitted.`);
			default: break;
		}
		r$3.phase = s$1.Computing, r$3.targets = this._getTargets(e$5), this._collisionDetector.detectCollisions(e$5, r$3.targets, r$3.collisions), r$3.phase = s$1.Computed;
	}
	_emitCollisions(e$5, t$6 = !1) {
		let n$7 = this._drags.get(e$5);
		if (!n$7 || !t$6 && n$7.isEnded) return;
		let r$3 = n$7._cd;
		switch (r$3.phase) {
			case s$1.Computing: throw Error(`Collisions are being computed.`);
			case s$1.Emitting: throw Error(`Collisions are being emitted.`);
			case s$1.Idle: return;
			default: break;
		}
		r$3.phase = s$1.Emitting;
		let i$2 = this._emitter, a$2 = r$3.collisions, o$2 = r$3.targets, c$4 = r$3.addedContacts, u$5 = r$3.persistedContacts, d$2 = r$3.contacts, f$2 = r$3.prevContacts;
		r$3.prevContacts = d$2, r$3.contacts = f$2;
		let p$2 = d$2;
		c$4.clear(), u$5.clear(), f$2.clear();
		for (let e$6 of a$2) {
			let t$7 = o$2.get(e$6.droppableId);
			t$7 && (f$2.add(t$7), d$2.has(t$7) ? (u$5.add(t$7), d$2.delete(t$7)) : c$4.add(t$7));
		}
		d$2.size && i$2.listenerCount(l$1.Leave) && i$2.emit(l$1.Leave, {
			draggable: e$5,
			targets: o$2,
			collisions: a$2,
			contacts: f$2,
			removedContacts: p$2
		}), c$4.size && i$2.listenerCount(l$1.Enter) && i$2.emit(l$1.Enter, {
			draggable: e$5,
			targets: o$2,
			collisions: a$2,
			contacts: f$2,
			addedContacts: c$4
		}), i$2.listenerCount(l$1.Collide) && (f$2.size || p$2.size) && i$2.emit(l$1.Collide, {
			draggable: e$5,
			targets: o$2,
			collisions: a$2,
			contacts: f$2,
			addedContacts: c$4,
			removedContacts: p$2,
			persistedContacts: u$5
		}), c$4.clear(), u$5.clear(), d$2.clear(), r$3.phase = s$1.Idle;
	}
	on(e$5, t$6, n$7) {
		return this._emitter.on(e$5, t$6, n$7);
	}
	off(e$5, t$6) {
		this._emitter.off(e$5, t$6);
	}
	updateDroppableClientRects() {
		for (let e$5 of this.droppables.values()) e$5.updateClientRect();
	}
	clearTargets(e$5) {
		if (e$5) {
			let t$6 = this._drags.get(e$5);
			t$6 && (t$6._targets = null);
		} else for (let e$6 of this._drags.values()) e$6._targets = null;
	}
	detectCollisions(e$5) {
		if (!this.isDestroyed) if (e$5) {
			let r$3 = this._drags.get(e$5);
			if (!r$3 || r$3.isEnded) return;
			n$2.once(t$2.read, () => this._computeCollisions(e$5), r$3._cd.tickerId), n$2.once(t$2.write, () => this._emitCollisions(e$5), r$3._cd.tickerId);
		} else for (let [e$6, r$3] of this._drags) r$3.isEnded || (n$2.once(t$2.read, () => this._computeCollisions(e$6), r$3._cd.tickerId), n$2.once(t$2.write, () => this._emitCollisions(e$6), r$3._cd.tickerId));
	}
	addDraggables(t$6) {
		if (this.isDestroyed) return;
		let n$7 = /* @__PURE__ */ new Set();
		for (let i$2 of t$6) this.draggables.has(i$2.id) || (n$7.add(i$2), this.draggables.set(i$2.id, i$2), i$2.on(L.PrepareStart, () => {
			this._onDragPrepareStart(i$2);
		}, this._listenerId), i$2.on(L.Start, () => {
			this._onDragStart(i$2);
		}, this._listenerId), i$2.on(L.PrepareMove, () => {
			this._onDragPrepareMove(i$2);
		}, this._listenerId), i$2.on(L.Move, () => {
			this._onDragMove(i$2);
		}, this._listenerId), i$2.on(L.End, (t$7) => {
			t$7?.type === e$2.End ? this._onDragEnd(i$2) : t$7?.type === e$2.Cancel && this._onDragCancel(i$2);
		}, this._listenerId), i$2.on(L.Destroy, () => {
			this._onDraggableDestroy(i$2);
		}, this._listenerId));
		if (n$7.size) {
			this._emitter.listenerCount(l$1.AddDraggables) && this._emitter.emit(l$1.AddDraggables, { draggables: n$7 });
			for (let e$5 of n$7) if (!this.isDestroyed && e$5.drag && !e$5.drag.isEnded) {
				let t$7 = e$5._startPhase;
				t$7 >= 2 && this._onDragPrepareStart(e$5), t$7 >= 4 && this._onDragStart(e$5);
			}
		}
	}
	removeDraggables(e$5) {
		if (this.isDestroyed) return;
		let t$6 = /* @__PURE__ */ new Set();
		for (let n$7 of e$5) this.draggables.has(n$7.id) && (t$6.add(n$7), this.draggables.delete(n$7.id), n$7.off(L.PrepareStart, this._listenerId), n$7.off(L.Start, this._listenerId), n$7.off(L.PrepareMove, this._listenerId), n$7.off(L.Move, this._listenerId), n$7.off(L.End, this._listenerId), n$7.off(L.Destroy, this._listenerId));
		for (let e$6 of t$6) this._stopDrag(e$6, !0);
		this._emitter.listenerCount(l$1.RemoveDraggables) && this._emitter.emit(l$1.RemoveDraggables, { draggables: t$6 });
	}
	addDroppables(e$5) {
		if (this.isDestroyed) return;
		let t$6 = /* @__PURE__ */ new Set();
		for (let n$7 of e$5) this.droppables.has(n$7.id) || (t$6.add(n$7), this.droppables.set(n$7.id, n$7), n$7.on(t$3.Destroy, () => {
			this.removeDroppables([n$7]);
		}, this._listenerId), this._drags.forEach(({ _targets: e$6 }, t$7) => {
			e$6 && this._isMatch(t$7, n$7) && (e$6.set(n$7.id, n$7), this.detectCollisions(t$7));
		}));
		t$6.size && this._emitter.listenerCount(l$1.AddDroppables) && this._emitter.emit(l$1.AddDroppables, { droppables: t$6 });
	}
	removeDroppables(e$5) {
		if (this.isDestroyed) return;
		let t$6 = /* @__PURE__ */ new Set();
		for (let n$7 of e$5) this.droppables.has(n$7.id) && (this.droppables.delete(n$7.id), t$6.add(n$7), n$7.off(t$3.Destroy, this._listenerId), this._drags.forEach(({ _targets: e$6 }, t$7) => {
			e$6 && e$6.has(n$7.id) && (e$6.delete(n$7.id), this.detectCollisions(t$7));
		}));
		t$6.size && this._emitter.listenerCount(l$1.RemoveDroppables) && this._emitter.emit(l$1.RemoveDroppables, { droppables: t$6 });
	}
	destroy() {
		if (this.isDestroyed) return;
		this.isDestroyed = !0, this.draggables.forEach((e$6) => {
			e$6.off(L.PrepareStart, this._listenerId), e$6.off(L.Start, this._listenerId), e$6.off(L.PrepareMove, this._listenerId), e$6.off(L.Move, this._listenerId), e$6.off(L.End, this._listenerId), e$6.off(L.Destroy, this._listenerId);
		}), this.droppables.forEach((e$6) => {
			e$6.off(t$3.Destroy, this._listenerId);
		});
		let e$5 = this._drags.keys();
		for (let t$6 of e$5) this._stopDrag(t$6, !0);
		this._emitter.emit(l$1.Destroy), this._emitter.off(), this._collisionDetector.destroy(), this.draggables.clear(), this.droppables.clear();
	}
};

//#endregion
//#region tests/src/dnd-context/events.ts
function events() {
	describe("events", () => {
		it("should emit start and end events during drag lifecycle", async () => {
			const events$5 = [];
			const dragElement = createTestElement({
				left: "0px",
				top: "0px"
			});
			const dropElement = createTestElement({
				left: "200px",
				top: "0px"
			});
			const keyboardSensor = new r(dragElement, { moveDistance: 10 });
			const draggable = new z([keyboardSensor], {
				elements: () => [dragElement],
				group: "test"
			});
			const droppable = new n(dropElement, { accept: ["test"] });
			const dndContext = new u();
			dndContext.on("start", (data) => {
				assert.equal(data.draggable, draggable);
				assert.instanceOf(data.targets, Map);
				assert.equal(data.targets.size, 1);
				assert.isTrue(data.targets.has(droppable.id));
				events$5.push("start");
			});
			dndContext.on("end", (data) => {
				assert.equal(data.draggable, draggable);
				assert.instanceOf(data.targets, Map);
				assert.equal(data.targets.size, 1);
				assert.isTrue(data.targets.has(droppable.id));
				events$5.push("end");
			});
			dndContext.addDraggables([draggable]);
			dndContext.addDroppables([droppable]);
			await startDrag(dragElement);
			assert.deepEqual(events$5, ["start"]);
			events$5.length = 0;
			await endDrag();
			assert.deepEqual(events$5, ["end"]);
			dndContext.destroy();
			draggable.destroy();
			droppable.destroy();
			keyboardSensor.destroy();
			dragElement.remove();
			dropElement.remove();
		});
		it("should emit move events during drag movement", async () => {
			const events$5 = [];
			const dragElement = createTestElement({
				left: "0px",
				top: "0px"
			});
			const dropElement = createTestElement({
				left: "200px",
				top: "0px"
			});
			const keyboardSensor = new r(dragElement, { moveDistance: 10 });
			const draggable = new z([keyboardSensor], {
				elements: () => [dragElement],
				group: "test"
			});
			const droppable = new n(dropElement, { accept: ["test"] });
			const dndContext = new u();
			dndContext.on("move", (data) => {
				assert.equal(data.draggable, draggable);
				assert.instanceOf(data.targets, Map);
				events$5.push("move");
			});
			dndContext.addDraggables([draggable]);
			dndContext.addDroppables([droppable]);
			await startDrag(dragElement);
			await move("Right");
			assert.equal(events$5.length, 1);
			assert.equal(events$5[0], "move");
			await endDrag();
			dndContext.destroy();
			draggable.destroy();
			droppable.destroy();
			keyboardSensor.destroy();
			dragElement.remove();
			dropElement.remove();
		});
		it("should emit enter and leave events when draggable enters/leaves droppable", async () => {
			const events$5 = [];
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
			const keyboardSensor = new r(dragElement, { moveDistance: 101 });
			const draggable = new z([keyboardSensor], {
				elements: () => [dragElement],
				group: "test"
			});
			const droppable = new n(dropElement, { accept: ["test"] });
			const dndContext = new u();
			dndContext.on("enter", (data) => {
				events$5.push({
					type: "enter",
					collisions: data.collisions.length,
					addedContacts: data.addedContacts.size
				});
			});
			dndContext.on("leave", (data) => {
				events$5.push({
					type: "leave",
					collisions: data.collisions.length,
					removedContacts: data.removedContacts.size
				});
			});
			dndContext.addDraggables([draggable]);
			dndContext.addDroppables([droppable]);
			await startDrag(dragElement);
			await move("Right");
			assert.equal(events$5.length, 1);
			assert.equal(events$5[0].type, "enter");
			assert.equal(events$5[0].collisions, 1);
			assert.equal(events$5[0].addedContacts, 1);
			await move("Right");
			assert.equal(events$5.length, 2);
			assert.equal(events$5[1].type, "leave");
			assert.equal(events$5[1].collisions, 0);
			assert.equal(events$5[1].removedContacts, 1);
			await endDrag();
			dndContext.destroy();
			draggable.destroy();
			droppable.destroy();
			keyboardSensor.destroy();
			dragElement.remove();
			dropElement.remove();
		});
		it("should include collisions in end event when draggable ends over droppable", async () => {
			const events$5 = [];
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
			const keyboardSensor = new r(dragElement, { moveDistance: 10 });
			const draggable = new z([keyboardSensor], {
				elements: () => [dragElement],
				group: "test"
			});
			const droppable = new n(dropElement, { accept: ["test"] });
			const dndContext = new u();
			dndContext.on("end", (data) => {
				assert.equal(data.draggable, draggable);
				assert.equal(data.collisions.length, 1);
				assert.isTrue(data.collisions.some((c$4) => c$4.droppableId === droppable.id));
				events$5.push("end");
			});
			dndContext.addDraggables([draggable]);
			dndContext.addDroppables([droppable]);
			await startDrag(dragElement);
			await endDrag();
			assert.equal(events$5.length, 1);
			assert.equal(events$5[0], "end");
			dndContext.destroy();
			draggable.destroy();
			droppable.destroy();
			keyboardSensor.destroy();
			dragElement.remove();
			dropElement.remove();
		});
		it("should emit addDraggables and removeDraggables events", () => {
			const events$5 = [];
			const dragElement = createTestElement();
			const keyboardSensor = new r(dragElement, { moveDistance: 10 });
			const draggable = new z([keyboardSensor], {
				elements: () => [dragElement],
				group: "test"
			});
			const dndContext = new u();
			dndContext.on("addDraggables", (data) => {
				events$5.push({
					type: "addDraggables",
					draggables: data.draggables
				});
			});
			dndContext.on("removeDraggables", (data) => {
				events$5.push({
					type: "removeDraggables",
					draggables: data.draggables
				});
			});
			dndContext.addDraggables([draggable]);
			assert.equal(events$5.length, 1);
			assert.equal(events$5[0].type, "addDraggables");
			assert.equal(events$5[0].draggables.has(draggable), true);
			dndContext.removeDraggables([draggable]);
			assert.equal(events$5.length, 2);
			assert.equal(events$5[1].type, "removeDraggables");
			assert.equal(events$5[1].draggables.has(draggable), true);
			dndContext.destroy();
			draggable.destroy();
			keyboardSensor.destroy();
			dragElement.remove();
		});
		it("should emit addDroppable and removeDroppable events", () => {
			const events$5 = [];
			const dropElement = createTestElement();
			const droppable = new n(dropElement, { accept: ["test"] });
			const dndContext = new u();
			dndContext.on("addDroppables", (data) => {
				data.droppables.forEach((droppable$1) => {
					events$5.push({
						type: "addDroppable",
						droppable: droppable$1
					});
				});
			});
			dndContext.on("removeDroppables", (data) => {
				data.droppables.forEach((droppable$1) => {
					events$5.push({
						type: "removeDroppable",
						droppable: droppable$1
					});
				});
			});
			dndContext.addDroppables([droppable]);
			assert.equal(events$5.length, 1);
			assert.equal(events$5[0].type, "addDroppable");
			assert.equal(events$5[0].droppable, droppable);
			dndContext.removeDroppables([droppable]);
			assert.equal(events$5.length, 2);
			assert.equal(events$5[1].type, "removeDroppable");
			assert.equal(events$5[1].droppable, droppable);
			dndContext.destroy();
			droppable.destroy();
			dropElement.remove();
		});
		it("should emit end with canceled=true when drag is cancelled", async () => {
			const events$5 = [];
			const dragElement = createTestElement();
			const keyboardSensor = new r(dragElement, { moveDistance: 10 });
			const draggable = new z([keyboardSensor], {
				elements: () => [dragElement],
				group: "test"
			});
			const dndContext = new u();
			dndContext.on("end", (data) => {
				assert.equal(data.draggable, draggable);
				assert.isTrue(data.canceled);
				events$5.push("end");
			});
			dndContext.addDraggables([draggable]);
			await startDrag(dragElement);
			document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
			assert.equal(events$5.length, 1);
			assert.equal(events$5[0], "end");
			dndContext.destroy();
			draggable.destroy();
			keyboardSensor.destroy();
			dragElement.remove();
		});
		it("should emit destroy event when context is destroyed", () => {
			const events$5 = [];
			const dndContext = new u();
			dndContext.on("destroy", () => {
				events$5.push("destroy");
			});
			dndContext.destroy();
			assert.equal(events$5.length, 1);
			assert.equal(events$5[0], "destroy");
		});
	});
	describe("event flow and ordering", () => {
		it("should emit leave → enter → collide in order when transitioning between droppables", async () => {
			const order = [];
			const dragEl = createTestElement({
				left: "0px",
				top: "0px",
				width: "40px",
				height: "40px"
			});
			const dropA = createTestElement({
				left: "0px",
				top: "0px",
				width: "40px",
				height: "40px"
			});
			const dropB = createTestElement({
				left: "50px",
				top: "0px",
				width: "40px",
				height: "40px"
			});
			const sensor = new r(dragEl, { moveDistance: 60 });
			const draggable = new z([sensor], {
				elements: () => [dragEl],
				group: "g"
			});
			const droppableA = new n(dropA, { accept: ["g"] });
			const droppableB = new n(dropB, { accept: ["g"] });
			const ctx = new u();
			ctx.on("leave", () => order.push("leave"));
			ctx.on("enter", () => order.push("enter"));
			ctx.on("collide", () => order.push("collide"));
			ctx.addDraggables([draggable]);
			ctx.addDroppables([droppableA, droppableB]);
			await startDrag(dragEl);
			order.length = 0;
			await move("Right");
			assert.isTrue(order.includes("enter"));
			if (order.includes("leave")) assert.isBelow(order.indexOf("leave"), order.indexOf("enter"));
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
			const events$5 = [];
			const dragEl = createTestElement({
				left: "0px",
				top: "0px",
				width: "40px",
				height: "40px"
			});
			const dropEl = createTestElement({
				left: "0px",
				top: "0px",
				width: "40px",
				height: "40px"
			});
			const sensor = new r(dragEl, { moveDistance: 10 });
			const draggable = new z([sensor], {
				elements: () => [dragEl],
				group: "g"
			});
			const droppable = new n(dropEl, { accept: ["g"] });
			const ctx = new u();
			let gotEnter = false;
			ctx.on("enter", ({ collisions }) => {
				events$5.push("enter");
				gotEnter = true;
				assert.isAtLeast(collisions.length, 1);
			});
			ctx.on("end", ({ canceled, collisions }) => {
				events$5.push("end");
				assert.isFalse(canceled);
				assert.isAtLeast(collisions.length, 1);
			});
			ctx.addDraggables([draggable]);
			ctx.addDroppables([droppable]);
			await startDrag(dragEl);
			await waitNextFrame();
			assert.isTrue(gotEnter);
			await endDrag();
			assert.deepEqual(events$5, ["enter", "end"]);
			ctx.destroy();
			draggable.destroy();
			droppable.destroy();
			sensor.destroy();
			dragEl.remove();
			dropEl.remove();
		});
		it("should honor clearTargets when accept changes mid-drag", async () => {
			const events$5 = [];
			const dragEl = createTestElement({
				left: "0px",
				top: "0px",
				width: "40px",
				height: "40px"
			});
			const dropEl = createTestElement({
				left: "0px",
				top: "0px",
				width: "40px",
				height: "40px"
			});
			let accepts = false;
			const sensor = new r(dragEl, { moveDistance: 10 });
			const draggable = new z([sensor], {
				elements: () => [dragEl],
				group: "g"
			});
			const droppable = new n(dropEl, { accept: () => accepts });
			const ctx = new u();
			ctx.on("enter", () => events$5.push("enter"));
			ctx.addDraggables([draggable]);
			ctx.addDroppables([droppable]);
			await startDrag(dragEl);
			assert.equal(events$5.length, 0);
			accepts = true;
			ctx.clearTargets(draggable);
			ctx.detectCollisions(draggable);
			await waitNextFrame();
			assert.deepEqual(events$5, ["enter"]);
			ctx.destroy();
			draggable.destroy();
			droppable.destroy();
			sensor.destroy();
			dragEl.remove();
			dropEl.remove();
		});
		it("should tolerate removing a droppable during enter emission", async () => {
			const events$5 = [];
			const dragEl = createTestElement({
				left: "0px",
				top: "0px",
				width: "40px",
				height: "40px"
			});
			const dropEl = createTestElement({
				left: "0px",
				top: "0px",
				width: "40px",
				height: "40px"
			});
			const sensor = new r(dragEl, { moveDistance: 10 });
			const draggable = new z([sensor], {
				elements: () => [dragEl],
				group: "g"
			});
			const droppable = new n(dropEl, { accept: ["g"] });
			const ctx = new u();
			let shouldRemove = false;
			ctx.on("enter", () => {
				events$5.push("enter");
				shouldRemove = true;
			});
			ctx.on("end", () => {
				events$5.push("end");
			});
			ctx.addDraggables([draggable]);
			ctx.addDroppables([droppable]);
			await startDrag(dragEl);
			if (shouldRemove) ctx.removeDroppables([droppable]);
			await waitNextFrame();
			await endDrag();
			assert.deepEqual(events$5, ["enter", "end"]);
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
			const dragEl = createTestElement({
				left: "0px",
				top: "0px",
				width: "40px",
				height: "40px"
			});
			const dropEl = createTestElement({
				left: "60px",
				top: "0px",
				width: "40px",
				height: "40px"
			});
			const sensor = new r(dragEl, { moveDistance: 10 });
			const draggable = new z([sensor], {
				elements: () => [dragEl],
				group: "g"
			});
			const droppable = new n(dropEl, { accept: ["g"] });
			const ctx = new u();
			ctx.on("start", () => {
				const data = ctx.drags.get(draggable);
				data.data.counter = 1;
				seen.push({
					phase: "start",
					value: data.data.counter
				});
			});
			ctx.on("move", () => {
				const data = ctx.drags.get(draggable);
				data.data.counter += 1;
				seen.push({
					phase: "move",
					value: data.data.counter
				});
			});
			ctx.on("end", () => {
				const data = ctx.drags.get(draggable);
				assert.isNotNull(data);
				seen.push({
					phase: "end",
					value: data.data.counter
				});
			});
			ctx.addDraggables([draggable]);
			ctx.addDroppables([droppable]);
			await startDrag(dragEl);
			await move("Right");
			await endDrag();
			assert.deepEqual(seen.map((s$4) => s$4.phase), [
				"start",
				"move",
				"end"
			]);
			assert.deepEqual(seen.map((s$4) => s$4.value), [
				1,
				2,
				2
			]);
			ctx.destroy();
			draggable.destroy();
			droppable.destroy();
			sensor.destroy();
			dragEl.remove();
			dropEl.remove();
		});
	});
}

//#endregion
//#region tests/src/dnd-context/collision-detection.ts
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
			const keyboardSensor = new r(dragElement, { moveDistance: 10 });
			const draggable = new z([keyboardSensor], {
				elements: () => [dragElement],
				group: "test"
			});
			const droppable = new n(dropElement, { accept: ["test"] });
			const dndContext = new u();
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
			const keyboardSensor = new r(dragElement, { moveDistance: 10 });
			const draggable = new z([keyboardSensor], {
				elements: () => [dragElement],
				group: "test"
			});
			const droppable = new n(dropElement, { accept: ["test"] });
			const dndContext = new u();
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
			const keyboardSensor = new r(dragElement, { moveDistance: 70 });
			const draggable = new z([keyboardSensor], {
				elements: () => [dragElement],
				group: "test"
			});
			const droppable = new n(dropElement, { accept: ["test"] });
			const dndContext = new u();
			dndContext.on("enter", (data) => {
				collisionEvents.push({
					type: "enter",
					collisions: data.collisions.length
				});
			});
			dndContext.on("leave", (data) => {
				collisionEvents.push({
					type: "leave",
					collisions: data.collisions.length
				});
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
			const keyboardSensor = new r(dragElement, { moveDistance: 60 });
			const draggable = new z([keyboardSensor], {
				elements: () => [dragElement],
				group: "test"
			});
			const droppable1 = new n(dropElement1, { accept: ["test"] });
			const droppable2 = new n(dropElement2, { accept: ["test"] });
			const dndContext = new u();
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
			assert.isTrue(collisionEvents[0].collisions.some((c$4) => c$4.droppableId === droppable1.id));
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
			const keyboardSensor = new r(dragElement, { moveDistance: 10 });
			const draggable = new z([keyboardSensor], {
				elements: () => [dragElement],
				group: "test"
			});
			const droppable = new n(dropElement, { accept: ["other-group"] });
			const dndContext = new u();
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
			const keyboardSensor = new r(dragElement, { moveDistance: 10 });
			const draggable = new z([keyboardSensor], {
				elements: () => [dragElement],
				group: "test"
			});
			const droppable = new n(dropElement, { accept: ["test"] });
			class TestDetector extends a {
				_createCollisionData() {
					const base = super._createCollisionData();
					base.customProp = "";
					return base;
				}
				_checkCollision(draggable$1, droppable$1, data) {
					customDetectorCalled = true;
					const result = super._checkCollision(draggable$1, droppable$1, data);
					if (!result) return null;
					result.customProp = "test-value";
					return result;
				}
			}
			const dndContext = new u({ collisionDetector: (ctx) => new TestDetector(ctx) });
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
			const keyboardSensor = new r(dragElement, { moveDistance: 10 });
			const draggable = new z([keyboardSensor], {
				elements: () => [dragElement],
				group: "test"
			});
			const droppable = new n(dropElement, { accept: ["test"] });
			const dndContext = new u();
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
			const keyboardSensor = new r(dragElement, { moveDistance: 10 });
			const draggable = new z([keyboardSensor], {
				elements: () => [dragElement],
				group: "test"
			});
			const droppable = new n(dropElement, { accept: ["test"] });
			const dndContext = new u();
			dndContext.on("enter", (data) => {
				collisionData = data.collisions.find((c$4) => c$4.droppableId === droppable.id) || null;
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

//#endregion
//#region dist/is-document-BqbrfopC.js
function e(e$5) {
	return e$5 instanceof Document;
}

//#endregion
//#region node_modules/mezr/dist/esm/utils/isDocument.js
function isDocument(n$7) {
	return n$7 instanceof Document;
}

//#endregion
//#region node_modules/mezr/dist/esm/utils/getPreciseScrollbarSize.js
const SUBPIXEL_OFFSET = /* @__PURE__ */ new Map();
let testStyleElement = null, testParentElement = null, testChildElement = null;
function getSubpixelScrollbarSize(t$6, e$5) {
	const n$7 = t$6.split(".");
	let l$5 = SUBPIXEL_OFFSET.get(n$7[1]);
	if (void 0 === l$5) {
		testStyleElement || (testStyleElement = document.createElement("style")), testStyleElement.innerHTML = `\n      #mezr-scrollbar-test::-webkit-scrollbar {\n        width: ${t$6} !important;\n      }\n    `, testParentElement && testChildElement || (testParentElement = document.createElement("div"), testChildElement = document.createElement("div"), testParentElement.appendChild(testChildElement), testParentElement.id = "mezr-scrollbar-test", testParentElement.style.cssText = "\n        all: unset !important;\n        position: fixed !important;\n        top: -200px !important;\n        left: 0px !important;\n        width: 100px !important;\n        height: 100px !important;\n        overflow: scroll !important;\n        pointer-events: none !important;\n        visibility: hidden !important;\n      ", testChildElement.style.cssText = "\n        all: unset !important;\n        position: absolute !important;\n        inset: 0 !important;\n      "), document.body.appendChild(testStyleElement), document.body.appendChild(testParentElement);
		l$5 = testParentElement.getBoundingClientRect().width - testChildElement.getBoundingClientRect().width - e$5, SUBPIXEL_OFFSET.set(n$7[1], l$5), document.body.removeChild(testParentElement), document.body.removeChild(testStyleElement);
	}
	return e$5 + l$5;
}
function getPreciseScrollbarSize(t$6, e$5, n$7) {
	if (n$7 <= 0) return 0;
	if (IS_CHROMIUM) {
		const n$8 = getStyle(t$6, "::-webkit-scrollbar"), l$5 = "x" === e$5 ? n$8.height : n$8.width, i$2 = parseFloat(l$5);
		if (!Number.isNaN(i$2) && !Number.isInteger(i$2)) return getSubpixelScrollbarSize(l$5, i$2);
	}
	return n$7;
}

//#endregion
//#region node_modules/mezr/dist/esm/utils/getWindowWidth.js
function getWindowWidth(e$5, r$3 = !1) {
	if (r$3) return e$5.innerWidth;
	const { innerWidth: t$6, document: i$2 } = e$5, { documentElement: n$7 } = i$2, { clientWidth: c$4 } = n$7;
	return t$6 - getPreciseScrollbarSize(n$7, "y", t$6 - c$4);
}

//#endregion
//#region node_modules/mezr/dist/esm/utils/getDocumentWidth.js
function getDocumentWidth({ documentElement: t$6 }) {
	return Math.max(t$6.scrollWidth, t$6.clientWidth, t$6.getBoundingClientRect().width);
}

//#endregion
//#region node_modules/mezr/dist/esm/utils/getElementWidth.js
function getElementWidth(t$6, e$5 = BOX_EDGE.border) {
	let { width: r$3 } = t$6.getBoundingClientRect();
	if (e$5 === BOX_EDGE.border) return r$3;
	const o$2 = getStyle(t$6);
	return e$5 === BOX_EDGE.margin ? (r$3 += Math.max(0, parseFloat(o$2.marginLeft) || 0), r$3 += Math.max(0, parseFloat(o$2.marginRight) || 0), r$3) : (r$3 -= parseFloat(o$2.borderLeftWidth) || 0, r$3 -= parseFloat(o$2.borderRightWidth) || 0, e$5 === BOX_EDGE.scrollbar ? r$3 : (!isDocumentElement(t$6) && SCROLLABLE_OVERFLOWS.has(o$2.overflowY) && (r$3 -= getPreciseScrollbarSize(t$6, "y", Math.round(r$3) - t$6.clientWidth)), e$5 === BOX_EDGE.padding || (r$3 -= parseFloat(o$2.paddingLeft) || 0, r$3 -= parseFloat(o$2.paddingRight) || 0), r$3));
}

//#endregion
//#region node_modules/mezr/dist/esm/getWidth.js
function getWidth(t$6, i$2 = BOX_EDGE.border) {
	return isWindow(t$6) ? getWindowWidth(t$6, INCLUDE_WINDOW_SCROLLBAR[i$2]) : isDocument(t$6) ? getDocumentWidth(t$6) : getElementWidth(t$6, i$2);
}

//#endregion
//#region node_modules/mezr/dist/esm/utils/getWindowHeight.js
function getWindowHeight(e$5, r$3 = !1) {
	if (r$3) return e$5.innerHeight;
	const { innerHeight: t$6, document: i$2 } = e$5, { documentElement: n$7 } = i$2, { clientHeight: c$4 } = n$7;
	return t$6 - getPreciseScrollbarSize(n$7, "x", t$6 - c$4);
}

//#endregion
//#region node_modules/mezr/dist/esm/utils/getDocumentHeight.js
function getDocumentHeight({ documentElement: t$6 }) {
	return Math.max(t$6.scrollHeight, t$6.clientHeight, t$6.getBoundingClientRect().height);
}

//#endregion
//#region node_modules/mezr/dist/esm/utils/getElementHeight.js
function getElementHeight(t$6, e$5 = BOX_EDGE.border) {
	let { height: r$3 } = t$6.getBoundingClientRect();
	if (e$5 === BOX_EDGE.border) return r$3;
	const o$2 = getStyle(t$6);
	return e$5 === BOX_EDGE.margin ? (r$3 += Math.max(0, parseFloat(o$2.marginTop) || 0), r$3 += Math.max(0, parseFloat(o$2.marginBottom) || 0), r$3) : (r$3 -= parseFloat(o$2.borderTopWidth) || 0, r$3 -= parseFloat(o$2.borderBottomWidth) || 0, e$5 === BOX_EDGE.scrollbar ? r$3 : (!isDocumentElement(t$6) && SCROLLABLE_OVERFLOWS.has(o$2.overflowX) && (r$3 -= getPreciseScrollbarSize(t$6, "x", Math.round(r$3) - t$6.clientHeight)), e$5 === BOX_EDGE.padding || (r$3 -= parseFloat(o$2.paddingTop) || 0, r$3 -= parseFloat(o$2.paddingBottom) || 0), r$3));
}

//#endregion
//#region node_modules/mezr/dist/esm/getHeight.js
function getHeight(t$6, e$5 = BOX_EDGE.border) {
	return isWindow(t$6) ? getWindowHeight(t$6, INCLUDE_WINDOW_SCROLLBAR[e$5]) : isDocument(t$6) ? getDocumentHeight(t$6) : getElementHeight(t$6, e$5);
}

//#endregion
//#region node_modules/mezr/dist/esm/utils/isRectObject.js
function isRectObject(t$6) {
	return t$6?.constructor === Object;
}

//#endregion
//#region node_modules/mezr/dist/esm/utils/getOffsetFromDocument.js
function getOffsetFromDocument(t$6, o$2 = BOX_EDGE.border) {
	const e$5 = {
		left: 0,
		top: 0
	};
	if (isDocument(t$6)) return e$5;
	if (isWindow(t$6)) return e$5.left += t$6.scrollX || 0, e$5.top += t$6.scrollY || 0, e$5;
	const r$3 = t$6.ownerDocument.defaultView;
	r$3 && (e$5.left += r$3.scrollX || 0, e$5.top += r$3.scrollY || 0);
	const n$7 = t$6.getBoundingClientRect();
	if (e$5.left += n$7.left, e$5.top += n$7.top, o$2 === BOX_EDGE.border) return e$5;
	const l$5 = getStyle(t$6);
	return o$2 === BOX_EDGE.margin ? (e$5.left -= Math.max(0, parseFloat(l$5.marginLeft) || 0), e$5.top -= Math.max(0, parseFloat(l$5.marginTop) || 0), e$5) : (e$5.left += parseFloat(l$5.borderLeftWidth) || 0, e$5.top += parseFloat(l$5.borderTopWidth) || 0, o$2 === BOX_EDGE.scrollbar || o$2 === BOX_EDGE.padding || (e$5.left += parseFloat(l$5.paddingLeft) || 0, e$5.top += parseFloat(l$5.paddingTop) || 0), e$5);
}

//#endregion
//#region node_modules/mezr/dist/esm/getOffset.js
function getOffset(t$6, e$5) {
	const o$2 = isRectObject(t$6) ? {
		left: t$6.left,
		top: t$6.top
	} : Array.isArray(t$6) ? getOffsetFromDocument(...t$6) : getOffsetFromDocument(t$6);
	if (e$5 && !isDocument(e$5)) {
		const t$7 = isRectObject(e$5) ? e$5 : Array.isArray(e$5) ? getOffsetFromDocument(e$5[0], e$5[1]) : getOffsetFromDocument(e$5);
		o$2.left -= t$7.left, o$2.top -= t$7.top;
	}
	return o$2;
}

//#endregion
//#region node_modules/mezr/dist/esm/getRect.js
function getRect(t$6, e$5) {
	let i$2 = 0, g$2 = 0;
	isRectObject(t$6) ? (i$2 = t$6.width, g$2 = t$6.height) : Array.isArray(t$6) ? (i$2 = getWidth(...t$6), g$2 = getHeight(...t$6)) : (i$2 = getWidth(t$6), g$2 = getHeight(t$6));
	const r$3 = getOffset(t$6, e$5);
	return {
		width: i$2,
		height: g$2,
		...r$3,
		right: r$3.left + i$2,
		bottom: r$3.top + g$2
	};
}

//#endregion
//#region dist/get-rect-rpTuZ8DC.js
function t$1(...t$6) {
	let { width: n$7, height: r$3, left: i$2, top: a$2 } = getRect(...t$6);
	return {
		width: n$7,
		height: r$3,
		x: i$2,
		y: a$2
	};
}

//#endregion
//#region dist/dnd-context/advanced-collision-detector.js
const s = `visible`;
function c(n$7, r$3, i$2 = []) {
	let a$2 = r$3 ? n$7 : n$7?.parentNode;
	for (i$2.length = 0; a$2 && !e(a$2);) if (a$2 instanceof Element) {
		let t$6 = t(a$2);
		t$6.overflowY === s || t$6.overflowX === s || i$2.push(a$2), a$2 = a$2.parentNode;
	} else a$2 = a$2 instanceof ShadowRoot ? a$2.host : a$2.parentNode;
	return i$2.push(window), i$2;
}
let l;
const u$1 = r$1(), d = {
	width: 2 ** 53 - 1,
	height: 2 ** 53 - 1,
	x: (2 ** 53 - 1) * -.5,
	y: (2 ** 53 - 1) * -.5
}, f = [], p = [], m = [], h = [];
function g(e$5) {
	if (!f.length) {
		let t$6 = e$5.drag?.items?.[0]?.dragContainer;
		t$6 ? c(t$6, !0, f) : f.push(window);
	}
}
function _(e$5) {
	p.length || c(e$5.element, !1, p);
}
function v(e$5, t$6 = r$1()) {
	r$1(e$5.length ? t$1([e$5[0], `padding`], window) : d, t$6);
	for (let r$3 = 1; r$3 < e$5.length; r$3++) {
		let a$2 = e$5[r$3];
		if (!e$1(t$6, t$1([a$2, `padding`], window), t$6)) {
			r$1(u$1, t$6);
			break;
		}
	}
	return t$6;
}
var y = class extends a {
	constructor(e$5, t$6) {
		super(e$5), this._dragStates = /* @__PURE__ */ new Map(), this._visibilityLogic = t$6?.visibilityLogic || `relative`, this._listenersAttached = !1, this._clearCache = () => this.clearCache();
	}
	_checkCollision(e$5, t$6, i$2) {
		let a$2 = this._dragStates.get(e$5);
		if (!a$2) return null;
		let s$4 = e$5.getClientRect(), c$4 = t$6.getClientRect();
		if (!s$4 || !c$4) return null;
		let u$5 = a$2.clipMaskKeyMap.get(t$6);
		if (!u$5) {
			let n$7 = this._visibilityLogic === `relative`;
			if (p.length = 0, m.length = 0, h.length = 0, _(t$6), u$5 = p[0] || window, a$2.clipMaskKeyMap.set(t$6, u$5), !a$2.clipMaskMap.has(u$5)) {
				if (g(e$5), n$7) {
					let e$6 = window;
					for (let t$8 of p) if (f.includes(t$8)) {
						e$6 = t$8;
						break;
					}
					for (let t$8 of f) {
						if (t$8 === e$6) break;
						m.push(t$8);
					}
					for (let t$8 of p) {
						if (t$8 === e$6) break;
						h.push(t$8);
					}
				} else m.push(...f), h.push(...p);
				let t$7 = n$7 || !l ? v(m) : r$1(l), r$3 = v(h);
				!n$7 && !l && (l = t$7), a$2.clipMaskMap.set(u$5, [t$7, r$3]);
			}
			p.length = 0, m.length = 0, h.length = 0;
		}
		let [d$2, y$2] = a$2.clipMaskMap.get(u$5) || [];
		if (!d$2 || !y$2 || !e$1(s$4, d$2, i$2.draggableVisibleRect) || !e$1(c$4, y$2, i$2.droppableVisibleRect) || !e$1(i$2.draggableVisibleRect, i$2.droppableVisibleRect, i$2.intersectionRect)) return null;
		let b$1 = n$1(i$2.draggableVisibleRect, i$2.droppableVisibleRect, i$2.intersectionRect);
		return b$1 <= 0 ? null : (i$2.droppableId = t$6.id, r$1(c$4, i$2.droppableRect), r$1(s$4, i$2.draggableRect), i$2.intersectionScore = b$1, i$2);
	}
	_sortCollisions(e$5, t$6) {
		return t$6.sort((e$6, t$7) => {
			let n$7 = t$7.intersectionScore - e$6.intersectionScore;
			return n$7 === 0 ? e$6.droppableVisibleRect.width * e$6.droppableVisibleRect.height - t$7.droppableVisibleRect.width * t$7.droppableVisibleRect.height : n$7;
		});
	}
	_createCollisionData() {
		let e$5 = super._createCollisionData();
		return e$5.droppableVisibleRect = r$1(), e$5.draggableVisibleRect = r$1(), e$5;
	}
	_getDragState(e$5) {
		let t$6 = this._dragStates.get(e$5);
		return t$6 || (t$6 = {
			clipMaskKeyMap: /* @__PURE__ */ new Map(),
			clipMaskMap: /* @__PURE__ */ new Map(),
			cacheDirty: !0
		}, this._dragStates.set(e$5, t$6), this._listenersAttached ||= (window.addEventListener(`scroll`, this._clearCache, {
			capture: !0,
			passive: !0
		}), window.addEventListener(`resize`, this._clearCache, { passive: !0 }), !0), t$6);
	}
	getCollisionDataPool(e$5) {
		return this._getDragState(e$5), super.getCollisionDataPool(e$5);
	}
	removeCollisionDataPool(e$5) {
		this._dragStates.delete(e$5) && this._dndContext.drags.size <= 0 && (this._listenersAttached &&= (window.removeEventListener(`scroll`, this._clearCache, { capture: !0 }), window.removeEventListener(`resize`, this._clearCache), !1)), super.removeCollisionDataPool(e$5);
	}
	detectCollisions(e$5, t$6, n$7) {
		f.length = 0, l = null;
		let r$3 = this._getDragState(e$5);
		r$3.cacheDirty &&= (r$3.clipMaskKeyMap.clear(), r$3.clipMaskMap.clear(), !1), super.detectCollisions(e$5, t$6, n$7), f.length = 0, l = null;
	}
	clearCache(e$5) {
		if (e$5) {
			let t$6 = this._dragStates.get(e$5);
			t$6 && (t$6.cacheDirty = !0);
		} else this._dragStates.forEach((e$6) => {
			e$6.cacheDirty = !0;
		});
	}
};

//#endregion
//#region tests/src/dnd-context/advanced-collision-detection.ts
function advancedCollisionDetection() {
	describe("advanced collision detection", () => {
		describe("relative visibility logic", () => {
			it("should not clip if draggable and droppable are within the same clip container", async () => {
				const collisionEvents = [];
				const containerElement = createTestElement({
					left: "0px",
					top: "0px",
					width: "100px",
					height: "100px",
					overflow: "hidden"
				});
				const draggableElement = createTestElement({
					left: "-100px",
					top: "-100px",
					width: "100px",
					height: "100px"
				});
				const droppableElement = createTestElement({
					left: "-100px",
					top: "-100px",
					width: "100px",
					height: "100px"
				});
				containerElement.appendChild(draggableElement);
				containerElement.appendChild(droppableElement);
				const keyboard = new r(draggableElement);
				const draggable = new z([keyboard], {
					elements: () => [draggableElement],
					group: "g"
				});
				const droppable = new n(droppableElement, { accept: ["g"] });
				const dndContext = new u({ collisionDetector: (ctx) => new y(ctx) });
				dndContext.addDraggables([draggable]);
				dndContext.addDroppables([droppable]);
				dndContext.on("collide", (data) => {
					collisionEvents.push({
						type: "enter",
						collisions: data.collisions
					});
				});
				focusElement(draggableElement);
				document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
				await waitNextFrame();
				assert.equal(collisionEvents.length, 1);
				assert.equal(collisionEvents[0].collisions.length, 1);
				const firstCollision = collisionEvents[0].collisions[0];
				assert.deepEqual(firstCollision.draggableVisibleRect, {
					x: -100,
					y: -100,
					width: 100,
					height: 100
				});
				assert.deepEqual(firstCollision.droppableVisibleRect, {
					x: -100,
					y: -100,
					width: 100,
					height: 100
				});
				dndContext.destroy();
				draggable.destroy();
				droppable.destroy();
				keyboard.destroy();
				draggableElement.remove();
				droppableElement.remove();
				containerElement.remove();
			});
			it("should clip to the clip containers that are not shared by the draggable and droppable", async () => {
				const collisionEvents = [];
				const containerElement = createTestElement({
					left: "-50px",
					top: "-50px",
					width: "100px",
					height: "100px",
					overflow: "hidden"
				});
				const draggableElement = createTestElement({
					left: "0px",
					top: "0px",
					width: "100px",
					height: "100px"
				});
				const droppableElement = createTestElement({
					left: "50px",
					top: "50px",
					width: "100px",
					height: "100px"
				});
				containerElement.appendChild(droppableElement);
				const keyboard = new r(draggableElement, { moveDistance: 50 });
				const draggable = new z([keyboard], {
					elements: () => [draggableElement],
					group: "g"
				});
				const droppable = new n(droppableElement, { accept: ["g"] });
				const dndContext = new u({ collisionDetector: (ctx) => new y(ctx) });
				dndContext.addDraggables([draggable]);
				dndContext.addDroppables([droppable]);
				dndContext.on("collide", (data) => {
					collisionEvents.push({
						type: "enter",
						collisions: data.collisions
					});
				});
				focusElement(draggableElement);
				document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
				await waitNextFrame();
				assert.equal(collisionEvents.length, 1);
				assert.equal(collisionEvents[0].collisions.length, 1);
				const firstCollision = collisionEvents[0].collisions[0];
				assert.deepEqual(firstCollision.draggableVisibleRect, {
					x: 0,
					y: 0,
					width: 100,
					height: 100
				});
				assert.deepEqual(firstCollision.droppableVisibleRect, {
					x: 0,
					y: 0,
					width: 50,
					height: 50
				});
				dndContext.destroy();
				draggable.destroy();
				droppable.destroy();
				keyboard.destroy();
				draggableElement.remove();
				droppableElement.remove();
				containerElement.remove();
			});
		});
		describe("absolute visibility logic", () => {
			it("should always compute collisions from the perspective of the user regardless of clip containers", async () => {
				const collisionEvents = [];
				const containerElement = createTestElement({
					left: "-50px",
					top: "-50px",
					width: "100px",
					height: "100px",
					overflow: "hidden"
				});
				const draggableElement = createTestElement({
					left: "0px",
					top: "0px",
					width: "100px",
					height: "100px"
				});
				const droppableElement = createTestElement({
					left: "0px",
					top: "0px",
					width: "100px",
					height: "100px"
				});
				containerElement.appendChild(draggableElement);
				containerElement.appendChild(droppableElement);
				const keyboard = new r(draggableElement, { moveDistance: 50 });
				const draggable = new z([keyboard], {
					elements: () => [draggableElement],
					group: "g"
				});
				const droppable = new n(droppableElement, { accept: ["g"] });
				const dndContext = new u({ collisionDetector: (ctx) => new y(ctx, { visibilityLogic: "absolute" }) });
				dndContext.addDraggables([draggable]);
				dndContext.addDroppables([droppable]);
				dndContext.on("collide", (data) => {
					collisionEvents.push({
						type: "enter",
						collisions: data.collisions
					});
				});
				focusElement(draggableElement);
				document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
				await waitNextFrame();
				assert.equal(collisionEvents.length, 1);
				assert.equal(collisionEvents[0].collisions.length, 1);
				const firstCollision = collisionEvents[0].collisions[0];
				assert.deepEqual(firstCollision.draggableVisibleRect, {
					x: 0,
					y: 0,
					width: 50,
					height: 50
				});
				assert.deepEqual(firstCollision.droppableVisibleRect, {
					x: 0,
					y: 0,
					width: 50,
					height: 50
				});
				dndContext.destroy();
				draggable.destroy();
				droppable.destroy();
				keyboard.destroy();
				draggableElement.remove();
				droppableElement.remove();
				containerElement.remove();
			});
		});
	});
}

//#endregion
//#region tests/src/dnd-context/droppables.ts
function droppables() {
	describe("droppables", () => {
		it("should accept draggables based on group string array", async () => {
			const events$5 = [];
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
			const keyboardSensor = new r(dragElement, { moveDistance: 70 });
			const draggable = new z([keyboardSensor], {
				elements: () => [dragElement],
				group: "valid-group"
			});
			const droppable = new n(dropElement, { accept: ["valid-group", "another-group"] });
			const dndContext = new u();
			dndContext.on("enter", (data) => {
				events$5.push({
					type: "enter",
					targets: data.targets.size
				});
			});
			dndContext.addDraggables([draggable]);
			dndContext.addDroppables([droppable]);
			await startDrag(dragElement);
			await move("Right");
			await waitNextFrame();
			assert.equal(events$5.length, 1);
			assert.equal(events$5[0].type, "enter");
			assert.equal(events$5[0].targets, 1);
			await endDrag();
			dndContext.destroy();
			draggable.destroy();
			droppable.destroy();
			keyboardSensor.destroy();
			dragElement.remove();
			dropElement.remove();
		});
		it("should reject draggables not in accept group array", async () => {
			const events$5 = [];
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
			const keyboardSensor = new r(dragElement, { moveDistance: 10 });
			const draggable = new z([keyboardSensor], {
				elements: () => [dragElement],
				group: "invalid-group"
			});
			const droppable = new n(dropElement, { accept: ["valid-group", "another-group"] });
			const dndContext = new u();
			dndContext.on("enter", () => {
				events$5.push({ type: "enter" });
			});
			dndContext.addDraggables([draggable]);
			dndContext.addDroppables([droppable]);
			await startDrag(dragElement);
			assert.equal(events$5.length, 0);
			document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
			dndContext.destroy();
			draggable.destroy();
			droppable.destroy();
			keyboardSensor.destroy();
			dragElement.remove();
			dropElement.remove();
		});
		it("should accept draggables based on function predicate", async () => {
			const events$5 = [];
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
			const keyboardSensor = new r(dragElement, { moveDistance: 70 });
			const draggable = new z([keyboardSensor], {
				elements: () => [dragElement],
				group: "test-group"
			});
			const droppable = new n(dropElement, { accept: (draggable$1) => {
				return draggable$1.settings.group === "test-group";
			} });
			const dndContext = new u();
			dndContext.on("enter", (data) => {
				events$5.push({
					type: "enter",
					targets: data.targets.size
				});
			});
			dndContext.addDraggables([draggable]);
			dndContext.addDroppables([droppable]);
			focusElement(dragElement);
			document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
			await waitNextFrame();
			await move("Right");
			await waitNextFrame();
			assert.equal(events$5.length, 1);
			assert.equal(events$5[0].type, "enter");
			assert.equal(events$5[0].targets, 1);
			await endDrag();
			dndContext.destroy();
			draggable.destroy();
			droppable.destroy();
			keyboardSensor.destroy();
			dragElement.remove();
			dropElement.remove();
		});
		it("should reject draggables when function predicate returns false", async () => {
			const events$5 = [];
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
			const keyboardSensor = new r(dragElement, { moveDistance: 10 });
			const draggable = new z([keyboardSensor], {
				elements: () => [dragElement],
				group: "test-group"
			});
			const droppable = new n(dropElement, { accept: (draggable$1) => {
				return draggable$1.settings.group === "different-group";
			} });
			const dndContext = new u();
			dndContext.on("enter", () => {
				events$5.push({ type: "enter" });
			});
			dndContext.addDraggables([draggable]);
			dndContext.addDroppables([droppable]);
			await startDrag(dragElement);
			assert.equal(events$5.length, 0);
			document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
			dndContext.destroy();
			draggable.destroy();
			droppable.destroy();
			keyboardSensor.destroy();
			dragElement.remove();
			dropElement.remove();
		});
		it("should not accept draggable when its element matches droppable element", async () => {
			const events$5 = [];
			const element = createTestElement({
				left: "0px",
				top: "0px",
				width: "50px",
				height: "50px"
			});
			const keyboardSensor = new r(element, { moveDistance: 10 });
			const draggable = new z([keyboardSensor], {
				elements: () => [element],
				group: "test"
			});
			const droppable = new n(element, { accept: ["test"] });
			const dndContext = new u();
			dndContext.on("enter", () => {
				events$5.push({ type: "enter" });
			});
			dndContext.addDraggables([draggable]);
			dndContext.addDroppables([droppable]);
			await startDrag(element);
			assert.equal(events$5.length, 0);
			await endDrag();
			dndContext.destroy();
			draggable.destroy();
			droppable.destroy();
			keyboardSensor.destroy();
			element.remove();
		});
		it("should handle droppable data correctly", () => {
			const element = createTestElement();
			const droppable = new n(element, {
				accept: ["test"],
				data: {
					custom: "value",
					id: 123
				}
			});
			const dndContext = new u();
			dndContext.addDroppables([droppable]);
			assert.deepEqual(droppable.data, {
				custom: "value",
				id: 123
			});
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
			const droppable = new n(element, { accept: ["test"] });
			const dndContext = new u();
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
			const events$5 = [];
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
			const keyboardSensor = new r(dragElement, { moveDistance: 70 });
			const draggable = new z([keyboardSensor], {
				elements: () => [dragElement],
				group: "test"
			});
			const droppable = new n(dropElement, { accept: ["test"] });
			const dndContext = new u();
			dndContext.on("enter", (data) => {
				events$5.push({
					type: "enter",
					collisions: data.collisions.length
				});
			});
			dndContext.on("leave", (data) => {
				events$5.push({
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
			assert.equal(events$5.length, 1);
			assert.equal(events$5[0].type, "enter");
			assert.equal(events$5[0].collisions, 1);
			dndContext.removeDroppables([droppable]);
			await waitNextFrame();
			assert.equal(events$5.length, 2);
			assert.equal(events$5[1].type, "leave");
			assert.equal(events$5[1].collisions, 0);
			assert.equal(events$5[1].removedContacts, 1);
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
			const droppable = new n(element, { accept: ["test"] });
			const dndContext = new u();
			dndContext.on("removeDroppables", (data) => {
				const removed = Array.from(data.droppables);
				destroyEvents.push({
					type: "removeDroppable",
					droppable: removed[0]
				});
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
			const events$5 = [];
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
			const keyboardSensor = new r(dragElement, { moveDistance: 10 });
			const draggable = new z([keyboardSensor], {
				elements: () => [dragElement],
				group: "test"
			});
			const droppable = new n(dropElement, { accept: ["test"] });
			const dndContext = new u();
			dndContext.on("enter", () => {
				events$5.push({ type: "enter" });
			});
			dndContext.on("collide", (data) => {
				events$5.push({
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
			assert.isTrue(events$5.length >= 2);
			assert.equal(events$5[0].type, "enter");
			const collideEvents = events$5.slice(1).filter((e$5) => e$5.type === "collide");
			assert.isAtLeast(collideEvents.length, 1);
			assert.isTrue(collideEvents.some((e$5) => e$5.persistedContacts >= 1));
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

//#endregion
//#region tests/src/dnd-context/methods.ts
function methods() {
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
			const sensor = new r(dragElement, { moveDistance: 10 });
			const draggable = new z([sensor], {
				elements: () => [dragElement],
				group: "g"
			});
			const droppable = new n(dropElement, { accept: ["g"] });
			const ctx = new u();
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
			const events$5 = [];
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
			const sensor = new r(dragElement, { moveDistance: 1 });
			const draggable = new z([sensor], {
				elements: () => [dragElement],
				group: "g"
			});
			const droppable = new n(dropElement, { accept: ["g"] });
			const ctx = new u();
			ctx.on("collide", () => events$5.push("collide"));
			ctx.addDraggables([draggable]);
			ctx.addDroppables([droppable]);
			focusElement(dragElement);
			document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
			await waitNextFrame();
			events$5.length = 0;
			ctx.detectCollisions(draggable);
			await waitNextFrame();
			assert.isTrue(events$5.includes("collide"));
			ctx.destroy();
			draggable.destroy();
			droppable.destroy();
			sensor.destroy();
			dragElement.remove();
			dropElement.remove();
		});
		it("detectCollisions() without args should queue for all active drags", async () => {
			const events$5 = [];
			const dragEl1 = createTestElement({
				left: "0px",
				top: "0px",
				width: "40px",
				height: "40px"
			});
			const dragEl2 = createTestElement({
				left: "0px",
				top: "50px",
				width: "40px",
				height: "40px"
			});
			const dropEl1 = createTestElement({
				left: "0px",
				top: "0px",
				width: "40px",
				height: "40px"
			});
			const dropEl2 = createTestElement({
				left: "0px",
				top: "50px",
				width: "40px",
				height: "40px"
			});
			const s1 = new r(dragEl1, { moveDistance: 1 });
			const s2 = new r(dragEl2, { moveDistance: 1 });
			const dr1 = new z([s1], {
				elements: () => [dragEl1],
				group: "g"
			});
			const dr2 = new z([s2], {
				elements: () => [dragEl2],
				group: "g"
			});
			const dp1 = new n(dropEl1, { accept: ["g"] });
			const dp2 = new n(dropEl2, { accept: ["g"] });
			const ctx = new u();
			ctx.on("collide", ({ draggable }) => events$5.push({ d: draggable }));
			ctx.addDraggables([dr1, dr2]);
			ctx.addDroppables([dp1, dp2]);
			focusElement(dragEl1);
			document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
			focusElement(dragEl2);
			document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
			await waitNextFrame();
			events$5.length = 0;
			ctx.detectCollisions();
			await waitNextFrame();
			assert.isAtLeast(events$5.length, 1);
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
			const el = createTestElement({
				left: "0px",
				top: "0px",
				width: "50px",
				height: "50px"
			});
			const droppable = new n(el, { accept: ["x"] });
			const ctx = new u();
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
			const el = createTestElement({
				left: "0px",
				top: "0px",
				width: "40px",
				height: "40px"
			});
			const sensor = new r(el, { moveDistance: 10 });
			const draggable = new z([sensor], {
				elements: () => [el],
				group: "g"
			});
			const droppable = new n(el, { accept: ["g"] });
			const ctx = new u();
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
			const sensor = new r(dragEl, { moveDistance: 10 });
			const draggable = new z([sensor], {
				elements: () => [dragEl],
				group: "g"
			});
			const droppable = new n(dropEl, { accept: () => false });
			const ctx = new u();
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

//#endregion
//#region tests/src/dnd-context/index.ts
describe("DndContext", () => {
	events();
	collisionDetection();
	advancedCollisionDetection();
	droppables();
	methods();
});

//#endregion
});