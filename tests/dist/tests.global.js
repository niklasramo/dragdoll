"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined")
      return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require2() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // node_modules/assertion-error/index.js
  var require_assertion_error = __commonJS({
    "node_modules/assertion-error/index.js"(exports, module) {
      "use strict";
      function exclude() {
        var excludes = [].slice.call(arguments);
        function excludeProps(res, obj) {
          Object.keys(obj).forEach(function(key) {
            if (!~excludes.indexOf(key))
              res[key] = obj[key];
          });
        }
        return function extendExclude() {
          var args = [].slice.call(arguments), i = 0, res = {};
          for (; i < args.length; i++) {
            excludeProps(res, args[i]);
          }
          return res;
        };
      }
      module.exports = AssertionError2;
      function AssertionError2(message, _props, ssf) {
        var extend = exclude("name", "message", "stack", "constructor", "toJSON"), props = extend(_props || {});
        this.message = message || "Unspecified AssertionError";
        this.showDiff = false;
        for (var key in props) {
          this[key] = props[key];
        }
        ssf = ssf || AssertionError2;
        if (Error.captureStackTrace) {
          Error.captureStackTrace(this, ssf);
        } else {
          try {
            throw new Error();
          } catch (e) {
            this.stack = e.stack;
          }
        }
      }
      AssertionError2.prototype = Object.create(Error.prototype);
      AssertionError2.prototype.name = "AssertionError";
      AssertionError2.prototype.constructor = AssertionError2;
      AssertionError2.prototype.toJSON = function(stack) {
        var extend = exclude("constructor", "toJSON", "stack"), props = extend({ name: this.name }, this);
        if (false !== stack && this.stack) {
          props.stack = this.stack;
        }
        return props;
      };
    }
  });

  // node_modules/pathval/index.js
  var require_pathval = __commonJS({
    "node_modules/pathval/index.js"(exports, module) {
      "use strict";
      function hasProperty(obj, name) {
        if (typeof obj === "undefined" || obj === null) {
          return false;
        }
        return name in Object(obj);
      }
      function parsePath(path) {
        var str = path.replace(/([^\\])\[/g, "$1.[");
        var parts = str.match(/(\\\.|[^.]+?)+/g);
        return parts.map(function mapMatches(value) {
          if (value === "constructor" || value === "__proto__" || value === "prototype") {
            return {};
          }
          var regexp = /^\[(\d+)\]$/;
          var mArr = regexp.exec(value);
          var parsed = null;
          if (mArr) {
            parsed = { i: parseFloat(mArr[1]) };
          } else {
            parsed = { p: value.replace(/\\([.[\]])/g, "$1") };
          }
          return parsed;
        });
      }
      function internalGetPathValue(obj, parsed, pathDepth) {
        var temporaryValue = obj;
        var res = null;
        pathDepth = typeof pathDepth === "undefined" ? parsed.length : pathDepth;
        for (var i = 0; i < pathDepth; i++) {
          var part = parsed[i];
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
      function internalSetPathValue(obj, val, parsed) {
        var tempObj = obj;
        var pathDepth = parsed.length;
        var part = null;
        for (var i = 0; i < pathDepth; i++) {
          var propName = null;
          var propVal = null;
          part = parsed[i];
          if (i === pathDepth - 1) {
            propName = typeof part.p === "undefined" ? part.i : part.p;
            tempObj[propName] = val;
          } else if (typeof part.p !== "undefined" && tempObj[part.p]) {
            tempObj = tempObj[part.p];
          } else if (typeof part.i !== "undefined" && tempObj[part.i]) {
            tempObj = tempObj[part.i];
          } else {
            var next = parsed[i + 1];
            propName = typeof part.p === "undefined" ? part.i : part.p;
            propVal = typeof next.p === "undefined" ? [] : {};
            tempObj[propName] = propVal;
            tempObj = tempObj[propName];
          }
        }
      }
      function getPathInfo(obj, path) {
        var parsed = parsePath(path);
        var last = parsed[parsed.length - 1];
        var info = {
          parent: parsed.length > 1 ? internalGetPathValue(obj, parsed, parsed.length - 1) : obj,
          name: last.p || last.i,
          value: internalGetPathValue(obj, parsed)
        };
        info.exists = hasProperty(info.parent, info.name);
        return info;
      }
      function getPathValue(obj, path) {
        var info = getPathInfo(obj, path);
        return info.value;
      }
      function setPathValue(obj, path, val) {
        var parsed = parsePath(path);
        internalSetPathValue(obj, val, parsed);
        return obj;
      }
      module.exports = {
        hasProperty,
        getPathInfo,
        getPathValue,
        setPathValue
      };
    }
  });

  // node_modules/chai/lib/chai/utils/flag.js
  var require_flag = __commonJS({
    "node_modules/chai/lib/chai/utils/flag.js"(exports, module) {
      "use strict";
      module.exports = function flag(obj, key, value) {
        var flags = obj.__flags || (obj.__flags = /* @__PURE__ */ Object.create(null));
        if (arguments.length === 3) {
          flags[key] = value;
        } else {
          return flags[key];
        }
      };
    }
  });

  // node_modules/chai/lib/chai/utils/test.js
  var require_test = __commonJS({
    "node_modules/chai/lib/chai/utils/test.js"(exports, module) {
      "use strict";
      var flag = require_flag();
      module.exports = function test(obj, args) {
        var negate = flag(obj, "negate"), expr = args[0];
        return negate ? !expr : expr;
      };
    }
  });

  // node_modules/type-detect/type-detect.js
  var require_type_detect = __commonJS({
    "node_modules/type-detect/type-detect.js"(exports, module) {
      "use strict";
      (function(global2, factory) {
        typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : global2.typeDetect = factory();
      })(exports, function() {
        "use strict";
        var promiseExists = typeof Promise === "function";
        var globalObject = typeof self === "object" ? self : global;
        var symbolExists = typeof Symbol !== "undefined";
        var mapExists = typeof Map !== "undefined";
        var setExists = typeof Set !== "undefined";
        var weakMapExists = typeof WeakMap !== "undefined";
        var weakSetExists = typeof WeakSet !== "undefined";
        var dataViewExists = typeof DataView !== "undefined";
        var symbolIteratorExists = symbolExists && typeof Symbol.iterator !== "undefined";
        var symbolToStringTagExists = symbolExists && typeof Symbol.toStringTag !== "undefined";
        var setEntriesExists = setExists && typeof Set.prototype.entries === "function";
        var mapEntriesExists = mapExists && typeof Map.prototype.entries === "function";
        var setIteratorPrototype = setEntriesExists && Object.getPrototypeOf((/* @__PURE__ */ new Set()).entries());
        var mapIteratorPrototype = mapEntriesExists && Object.getPrototypeOf((/* @__PURE__ */ new Map()).entries());
        var arrayIteratorExists = symbolIteratorExists && typeof Array.prototype[Symbol.iterator] === "function";
        var arrayIteratorPrototype = arrayIteratorExists && Object.getPrototypeOf([][Symbol.iterator]());
        var stringIteratorExists = symbolIteratorExists && typeof String.prototype[Symbol.iterator] === "function";
        var stringIteratorPrototype = stringIteratorExists && Object.getPrototypeOf(""[Symbol.iterator]());
        var toStringLeftSliceLength = 8;
        var toStringRightSliceLength = -1;
        function typeDetect(obj) {
          var typeofObj = typeof obj;
          if (typeofObj !== "object") {
            return typeofObj;
          }
          if (obj === null) {
            return "null";
          }
          if (obj === globalObject) {
            return "global";
          }
          if (Array.isArray(obj) && (symbolToStringTagExists === false || !(Symbol.toStringTag in obj))) {
            return "Array";
          }
          if (typeof window === "object" && window !== null) {
            if (typeof window.location === "object" && obj === window.location) {
              return "Location";
            }
            if (typeof window.document === "object" && obj === window.document) {
              return "Document";
            }
            if (typeof window.navigator === "object") {
              if (typeof window.navigator.mimeTypes === "object" && obj === window.navigator.mimeTypes) {
                return "MimeTypeArray";
              }
              if (typeof window.navigator.plugins === "object" && obj === window.navigator.plugins) {
                return "PluginArray";
              }
            }
            if ((typeof window.HTMLElement === "function" || typeof window.HTMLElement === "object") && obj instanceof window.HTMLElement) {
              if (obj.tagName === "BLOCKQUOTE") {
                return "HTMLQuoteElement";
              }
              if (obj.tagName === "TD") {
                return "HTMLTableDataCellElement";
              }
              if (obj.tagName === "TH") {
                return "HTMLTableHeaderCellElement";
              }
            }
          }
          var stringTag = symbolToStringTagExists && obj[Symbol.toStringTag];
          if (typeof stringTag === "string") {
            return stringTag;
          }
          var objPrototype = Object.getPrototypeOf(obj);
          if (objPrototype === RegExp.prototype) {
            return "RegExp";
          }
          if (objPrototype === Date.prototype) {
            return "Date";
          }
          if (promiseExists && objPrototype === Promise.prototype) {
            return "Promise";
          }
          if (setExists && objPrototype === Set.prototype) {
            return "Set";
          }
          if (mapExists && objPrototype === Map.prototype) {
            return "Map";
          }
          if (weakSetExists && objPrototype === WeakSet.prototype) {
            return "WeakSet";
          }
          if (weakMapExists && objPrototype === WeakMap.prototype) {
            return "WeakMap";
          }
          if (dataViewExists && objPrototype === DataView.prototype) {
            return "DataView";
          }
          if (mapExists && objPrototype === mapIteratorPrototype) {
            return "Map Iterator";
          }
          if (setExists && objPrototype === setIteratorPrototype) {
            return "Set Iterator";
          }
          if (arrayIteratorExists && objPrototype === arrayIteratorPrototype) {
            return "Array Iterator";
          }
          if (stringIteratorExists && objPrototype === stringIteratorPrototype) {
            return "String Iterator";
          }
          if (objPrototype === null) {
            return "Object";
          }
          return Object.prototype.toString.call(obj).slice(toStringLeftSliceLength, toStringRightSliceLength);
        }
        return typeDetect;
      });
    }
  });

  // node_modules/chai/lib/chai/utils/expectTypes.js
  var require_expectTypes = __commonJS({
    "node_modules/chai/lib/chai/utils/expectTypes.js"(exports, module) {
      "use strict";
      var AssertionError2 = require_assertion_error();
      var flag = require_flag();
      var type = require_type_detect();
      module.exports = function expectTypes(obj, types) {
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
          throw new AssertionError2(
            flagMsg + "object tested must be " + str + ", but " + objType + " given",
            void 0,
            ssfi
          );
        }
      };
    }
  });

  // node_modules/chai/lib/chai/utils/getActual.js
  var require_getActual = __commonJS({
    "node_modules/chai/lib/chai/utils/getActual.js"(exports, module) {
      "use strict";
      module.exports = function getActual(obj, args) {
        return args.length > 4 ? args[4] : obj._obj;
      };
    }
  });

  // node_modules/get-func-name/index.js
  var require_get_func_name = __commonJS({
    "node_modules/get-func-name/index.js"(exports, module) {
      "use strict";
      var toString2 = Function.prototype.toString;
      var functionNameMatch = /\s*function(?:\s|\s*\/\*[^(?:*\/)]+\*\/\s*)*([^\s\(\/]+)/;
      var maxFunctionSourceLength = 512;
      function getFuncName3(aFunc) {
        if (typeof aFunc !== "function") {
          return null;
        }
        var name = "";
        if (typeof Function.prototype.name === "undefined" && typeof aFunc.name === "undefined") {
          var functionSource = toString2.call(aFunc);
          if (functionSource.indexOf("(") > maxFunctionSourceLength) {
            return name;
          }
          var match = functionSource.match(functionNameMatch);
          if (match) {
            name = match[1];
          }
        } else {
          name = aFunc.name;
        }
        return name;
      }
      module.exports = getFuncName3;
    }
  });

  // node_modules/loupe/lib/helpers.js
  function colorise(value, styleType) {
    const color = ansiColors[styles[styleType]] || ansiColors[styleType];
    if (!color) {
      return String(value);
    }
    return `\x1B[${color[0]}m${String(value)}\x1B[${color[1]}m`;
  }
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
  } = {}) {
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
      stylize
    };
    if (options.colors) {
      options.stylize = colorise;
    }
    return options;
  }
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
  function quoteComplexKey(key) {
    if (key.match(/^[a-zA-Z_][a-zA-Z_0-9]*$/)) {
      return key;
    }
    return JSON.stringify(key).replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'");
  }
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
  var ansiColors, styles, truncator;
  var init_helpers = __esm({
    "node_modules/loupe/lib/helpers.js"() {
      "use strict";
      ansiColors = {
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
      styles = {
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
      truncator = "\u2026";
    }
  });

  // node_modules/loupe/lib/array.js
  function inspectArray(array, options) {
    const nonIndexProperties = Object.keys(array).slice(array.length);
    if (!array.length && !nonIndexProperties.length)
      return "[]";
    options.truncate -= 4;
    const listContents = inspectList(array, options);
    options.truncate -= listContents.length;
    let propertyContents = "";
    if (nonIndexProperties.length) {
      propertyContents = inspectList(
        nonIndexProperties.map((key) => [key, array[key]]),
        options,
        inspectProperty
      );
    }
    return `[ ${listContents}${propertyContents ? `, ${propertyContents}` : ""} ]`;
  }
  var init_array = __esm({
    "node_modules/loupe/lib/array.js"() {
      "use strict";
      init_helpers();
    }
  });

  // node_modules/loupe/lib/typedarray.js
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
      propertyContents = inspectList(
        nonIndexProperties.map((key) => [key, array[key]]),
        options,
        inspectProperty
      );
    }
    return `${name}[ ${output}${propertyContents ? `, ${propertyContents}` : ""} ]`;
  }
  var import_get_func_name, getArrayName;
  var init_typedarray = __esm({
    "node_modules/loupe/lib/typedarray.js"() {
      "use strict";
      import_get_func_name = __toESM(require_get_func_name());
      init_helpers();
      getArrayName = (array) => {
        if (typeof Buffer === "function" && array instanceof Buffer) {
          return "Buffer";
        }
        if (array[Symbol.toStringTag]) {
          return array[Symbol.toStringTag];
        }
        return (0, import_get_func_name.default)(array.constructor);
      };
    }
  });

  // node_modules/loupe/lib/date.js
  function inspectDate(dateObject, options) {
    const stringRepresentation = dateObject.toJSON();
    if (stringRepresentation === null) {
      return "Invalid Date";
    }
    const split = stringRepresentation.split("T");
    const date = split[0];
    return options.stylize(`${date}T${truncate(split[1], options.truncate - date.length - 1)}`, "date");
  }
  var init_date = __esm({
    "node_modules/loupe/lib/date.js"() {
      "use strict";
      init_helpers();
    }
  });

  // node_modules/loupe/lib/function.js
  function inspectFunction(func, options) {
    const name = (0, import_get_func_name2.default)(func);
    if (!name) {
      return options.stylize("[Function]", "special");
    }
    return options.stylize(`[Function ${truncate(name, options.truncate - 11)}]`, "special");
  }
  var import_get_func_name2;
  var init_function = __esm({
    "node_modules/loupe/lib/function.js"() {
      "use strict";
      import_get_func_name2 = __toESM(require_get_func_name());
      init_helpers();
    }
  });

  // node_modules/loupe/lib/map.js
  function inspectMapEntry([key, value], options) {
    options.truncate -= 4;
    key = options.inspect(key, options);
    options.truncate -= key.length;
    value = options.inspect(value, options);
    return `${key} => ${value}`;
  }
  function mapToEntries(map) {
    const entries = [];
    map.forEach((value, key) => {
      entries.push([key, value]);
    });
    return entries;
  }
  function inspectMap(map, options) {
    const size = map.size - 1;
    if (size <= 0) {
      return "Map{}";
    }
    options.truncate -= 7;
    return `Map{ ${inspectList(mapToEntries(map), options, inspectMapEntry)} }`;
  }
  var init_map = __esm({
    "node_modules/loupe/lib/map.js"() {
      "use strict";
      init_helpers();
    }
  });

  // node_modules/loupe/lib/number.js
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
    return options.stylize(truncate(number, options.truncate), "number");
  }
  var isNaN;
  var init_number = __esm({
    "node_modules/loupe/lib/number.js"() {
      "use strict";
      init_helpers();
      isNaN = Number.isNaN || ((i) => i !== i);
    }
  });

  // node_modules/loupe/lib/bigint.js
  function inspectBigInt(number, options) {
    let nums = truncate(number.toString(), options.truncate - 1);
    if (nums !== truncator)
      nums += "n";
    return options.stylize(nums, "bigint");
  }
  var init_bigint = __esm({
    "node_modules/loupe/lib/bigint.js"() {
      "use strict";
      init_helpers();
    }
  });

  // node_modules/loupe/lib/regexp.js
  function inspectRegExp(value, options) {
    const flags = value.toString().split("/")[2];
    const sourceLength = options.truncate - (2 + flags.length);
    const source = value.source;
    return options.stylize(`/${truncate(source, sourceLength)}/${flags}`, "regexp");
  }
  var init_regexp = __esm({
    "node_modules/loupe/lib/regexp.js"() {
      "use strict";
      init_helpers();
    }
  });

  // node_modules/loupe/lib/set.js
  function arrayFromSet(set2) {
    const values = [];
    set2.forEach((value) => {
      values.push(value);
    });
    return values;
  }
  function inspectSet(set2, options) {
    if (set2.size === 0)
      return "Set{}";
    options.truncate -= 7;
    return `Set{ ${inspectList(arrayFromSet(set2), options)} }`;
  }
  var init_set = __esm({
    "node_modules/loupe/lib/set.js"() {
      "use strict";
      init_helpers();
    }
  });

  // node_modules/loupe/lib/string.js
  function escape(char) {
    return escapeCharacters[char] || `\\u${`0000${char.charCodeAt(0).toString(hex)}`.slice(-unicodeLength)}`;
  }
  function inspectString(string, options) {
    if (stringEscapeChars.test(string)) {
      string = string.replace(stringEscapeChars, escape);
    }
    return options.stylize(`'${truncate(string, options.truncate - 2)}'`, "string");
  }
  var stringEscapeChars, escapeCharacters, hex, unicodeLength;
  var init_string = __esm({
    "node_modules/loupe/lib/string.js"() {
      "use strict";
      init_helpers();
      stringEscapeChars = new RegExp(
        "['\\u0000-\\u001f\\u007f-\\u009f\\u00ad\\u0600-\\u0604\\u070f\\u17b4\\u17b5\\u200c-\\u200f\\u2028-\\u202f\\u2060-\\u206f\\ufeff\\ufff0-\\uffff]",
        "g"
      );
      escapeCharacters = {
        "\b": "\\b",
        "	": "\\t",
        "\n": "\\n",
        "\f": "\\f",
        "\r": "\\r",
        "'": "\\'",
        "\\": "\\\\"
      };
      hex = 16;
      unicodeLength = 4;
    }
  });

  // node_modules/loupe/lib/symbol.js
  function inspectSymbol(value) {
    if ("description" in Symbol.prototype) {
      return value.description ? `Symbol(${value.description})` : "Symbol()";
    }
    return value.toString();
  }
  var init_symbol = __esm({
    "node_modules/loupe/lib/symbol.js"() {
      "use strict";
    }
  });

  // node_modules/loupe/lib/promise.js
  var getPromiseValue, promise_default;
  var init_promise = __esm({
    "node_modules/loupe/lib/promise.js"() {
      "use strict";
      getPromiseValue = () => "Promise{\u2026}";
      try {
        const { getPromiseDetails, kPending, kRejected } = process.binding("util");
        if (Array.isArray(getPromiseDetails(Promise.resolve()))) {
          getPromiseValue = (value, options) => {
            const [state, innerValue] = getPromiseDetails(value);
            if (state === kPending) {
              return "Promise{<pending>}";
            }
            return `Promise${state === kRejected ? "!" : ""}{${options.inspect(innerValue, options)}}`;
          };
        }
      } catch (notNode) {
      }
      promise_default = getPromiseValue;
    }
  });

  // node_modules/loupe/lib/object.js
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
    const propertyContents = inspectList(
      properties.map((key) => [key, object[key]]),
      options,
      inspectProperty
    );
    const symbolContents = inspectList(
      symbols.map((key) => [key, object[key]]),
      options,
      inspectProperty
    );
    options.seen.pop();
    let sep = "";
    if (propertyContents && symbolContents) {
      sep = ", ";
    }
    return `{ ${propertyContents}${sep}${symbolContents} }`;
  }
  var init_object = __esm({
    "node_modules/loupe/lib/object.js"() {
      "use strict";
      init_helpers();
    }
  });

  // node_modules/loupe/lib/class.js
  function inspectClass(value, options) {
    let name = "";
    if (toStringTag && toStringTag in value) {
      name = value[toStringTag];
    }
    name = name || (0, import_get_func_name3.default)(value.constructor);
    if (!name || name === "_class") {
      name = "<Anonymous Class>";
    }
    options.truncate -= name.length;
    return `${name}${inspectObject(value, options)}`;
  }
  var import_get_func_name3, toStringTag;
  var init_class = __esm({
    "node_modules/loupe/lib/class.js"() {
      "use strict";
      import_get_func_name3 = __toESM(require_get_func_name());
      init_object();
      toStringTag = typeof Symbol !== "undefined" && Symbol.toStringTag ? Symbol.toStringTag : false;
    }
  });

  // node_modules/loupe/lib/arguments.js
  function inspectArguments(args, options) {
    if (args.length === 0)
      return "Arguments[]";
    options.truncate -= 13;
    return `Arguments[ ${inspectList(args, options)} ]`;
  }
  var init_arguments = __esm({
    "node_modules/loupe/lib/arguments.js"() {
      "use strict";
      init_helpers();
    }
  });

  // node_modules/loupe/lib/error.js
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
    const propertyContents = inspectList(
      properties.map((key) => [key, error[key]]),
      options,
      inspectProperty
    );
    return `${name}${message}${propertyContents ? ` { ${propertyContents} }` : ""}`;
  }
  var errorKeys;
  var init_error = __esm({
    "node_modules/loupe/lib/error.js"() {
      "use strict";
      init_helpers();
      errorKeys = [
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
    }
  });

  // node_modules/loupe/lib/html.js
  function inspectAttribute([key, value], options) {
    options.truncate -= 3;
    if (!value) {
      return `${options.stylize(key, "yellow")}`;
    }
    return `${options.stylize(key, "yellow")}=${options.stylize(`"${value}"`, "string")}`;
  }
  function inspectHTMLCollection(collection, options) {
    return inspectList(collection, options, inspectHTML, "\n");
  }
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
      propertyContents += inspectList(
        properties.map((key) => [key, element.getAttribute(key)]),
        options,
        inspectAttribute,
        " "
      );
    }
    options.truncate -= propertyContents.length;
    const truncate2 = options.truncate;
    let children = inspectHTMLCollection(element.children, options);
    if (children && children.length > truncate2) {
      children = `${truncator}(${element.children.length})`;
    }
    return `${head}${propertyContents}${headClose}${children}${tail}`;
  }
  var init_html = __esm({
    "node_modules/loupe/lib/html.js"() {
      "use strict";
      init_helpers();
    }
  });

  // node_modules/loupe/index.js
  var loupe_exports = {};
  __export(loupe_exports, {
    custom: () => custom,
    default: () => loupe_default,
    inspect: () => inspect,
    registerConstructor: () => registerConstructor,
    registerStringTag: () => registerStringTag
  });
  function FakeMap() {
    this.key = "chai/loupe__" + Math.random() + Date.now();
  }
  function inspect(value, options) {
    options = normaliseOptions(options);
    options.inspect = inspect;
    const { customInspect } = options;
    let type = value === null ? "null" : typeof value;
    if (type === "object") {
      type = toString.call(value).slice(8, -1);
    }
    if (baseTypesMap[type]) {
      return baseTypesMap[type](value, options);
    }
    if (customInspect && value) {
      const output = inspectCustom(value, options, type);
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
    return options.stylize(String(value), type);
  }
  function registerConstructor(constructor, inspector) {
    if (constructorMap.has(constructor)) {
      return false;
    }
    constructorMap.set(constructor, inspector);
    return true;
  }
  function registerStringTag(stringTag, inspector) {
    if (stringTag in stringTagMap) {
      return false;
    }
    stringTagMap[stringTag] = inspector;
    return true;
  }
  var symbolsSupported, chaiInspect, nodeInspect, constructorMap, stringTagMap, baseTypesMap, inspectCustom, toString, custom, loupe_default;
  var init_loupe = __esm({
    "node_modules/loupe/index.js"() {
      "use strict";
      init_array();
      init_typedarray();
      init_date();
      init_function();
      init_map();
      init_number();
      init_bigint();
      init_regexp();
      init_set();
      init_string();
      init_symbol();
      init_promise();
      init_class();
      init_object();
      init_arguments();
      init_error();
      init_html();
      init_helpers();
      symbolsSupported = typeof Symbol === "function" && typeof Symbol.for === "function";
      chaiInspect = symbolsSupported ? Symbol.for("chai/inspect") : "@@chai/inspect";
      nodeInspect = false;
      try {
        const nodeUtil = __require("util");
        nodeInspect = nodeUtil.inspect ? nodeUtil.inspect.custom : false;
      } catch (noNodeInspect) {
        nodeInspect = false;
      }
      FakeMap.prototype = {
        // eslint-disable-next-line object-shorthand
        get: function get(key) {
          return key[this.key];
        },
        // eslint-disable-next-line object-shorthand
        has: function has(key) {
          return this.key in key;
        },
        // eslint-disable-next-line object-shorthand
        set: function set(key, value) {
          if (Object.isExtensible(key)) {
            Object.defineProperty(key, this.key, {
              // eslint-disable-next-line object-shorthand
              value,
              configurable: true
            });
          }
        }
      };
      constructorMap = new (typeof WeakMap === "function" ? WeakMap : FakeMap)();
      stringTagMap = {};
      baseTypesMap = {
        undefined: (value, options) => options.stylize("undefined", "undefined"),
        null: (value, options) => options.stylize(null, "null"),
        boolean: (value, options) => options.stylize(value, "boolean"),
        Boolean: (value, options) => options.stylize(value, "boolean"),
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
      inspectCustom = (value, options, type) => {
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
        if (stringTagMap[type]) {
          return stringTagMap[type](value, options);
        }
        return "";
      };
      toString = Object.prototype.toString;
      custom = chaiInspect;
      loupe_default = inspect;
    }
  });

  // node_modules/chai/lib/chai/config.js
  var require_config = __commonJS({
    "node_modules/chai/lib/chai/config.js"(exports, module) {
      "use strict";
      module.exports = {
        /**
         * ### config.includeStack
         *
         * User configurable property, influences whether stack trace
         * is included in Assertion error message. Default of false
         * suppresses stack trace in the error message.
         *
         *     chai.config.includeStack = true;  // enable stack on error
         *
         * @param {Boolean}
         * @api public
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
         * @param {Boolean}
         * @api public
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
         * @param {Number}
         * @api public
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
         * @param {Boolean}
         * @api public
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
         * @api public
         */
        proxyExcludedKeys: ["then", "catch", "inspect", "toJSON"]
      };
    }
  });

  // node_modules/chai/lib/chai/utils/inspect.js
  var require_inspect = __commonJS({
    "node_modules/chai/lib/chai/utils/inspect.js"(exports, module) {
      "use strict";
      var getName = require_get_func_name();
      var loupe = (init_loupe(), __toCommonJS(loupe_exports));
      var config2 = require_config();
      module.exports = inspect2;
      function inspect2(obj, showHidden, depth, colors) {
        var options = {
          colors,
          depth: typeof depth === "undefined" ? 2 : depth,
          showHidden,
          truncate: config2.truncateThreshold ? config2.truncateThreshold : Infinity
        };
        return loupe.inspect(obj, options);
      }
    }
  });

  // node_modules/chai/lib/chai/utils/objDisplay.js
  var require_objDisplay = __commonJS({
    "node_modules/chai/lib/chai/utils/objDisplay.js"(exports, module) {
      "use strict";
      var inspect2 = require_inspect();
      var config2 = require_config();
      module.exports = function objDisplay(obj) {
        var str = inspect2(obj), type = Object.prototype.toString.call(obj);
        if (config2.truncateThreshold && str.length >= config2.truncateThreshold) {
          if (type === "[object Function]") {
            return !obj.name || obj.name === "" ? "[Function]" : "[Function: " + obj.name + "]";
          } else if (type === "[object Array]") {
            return "[ Array(" + obj.length + ") ]";
          } else if (type === "[object Object]") {
            var keys = Object.keys(obj), kstr = keys.length > 2 ? keys.splice(0, 2).join(", ") + ", ..." : keys.join(", ");
            return "{ Object (" + kstr + ") }";
          } else {
            return str;
          }
        } else {
          return str;
        }
      };
    }
  });

  // node_modules/chai/lib/chai/utils/getMessage.js
  var require_getMessage = __commonJS({
    "node_modules/chai/lib/chai/utils/getMessage.js"(exports, module) {
      "use strict";
      var flag = require_flag();
      var getActual = require_getActual();
      var objDisplay = require_objDisplay();
      module.exports = function getMessage(obj, args) {
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
      };
    }
  });

  // node_modules/chai/lib/chai/utils/transferFlags.js
  var require_transferFlags = __commonJS({
    "node_modules/chai/lib/chai/utils/transferFlags.js"(exports, module) {
      "use strict";
      module.exports = function transferFlags(assertion, object, includeAll) {
        var flags = assertion.__flags || (assertion.__flags = /* @__PURE__ */ Object.create(null));
        if (!object.__flags) {
          object.__flags = /* @__PURE__ */ Object.create(null);
        }
        includeAll = arguments.length === 3 ? includeAll : true;
        for (var flag in flags) {
          if (includeAll || flag !== "object" && flag !== "ssfi" && flag !== "lockSsfi" && flag != "message") {
            object.__flags[flag] = flags[flag];
          }
        }
      };
    }
  });

  // node_modules/deep-eql/index.js
  var require_deep_eql = __commonJS({
    "node_modules/deep-eql/index.js"(exports, module) {
      "use strict";
      var type = require_type_detect();
      function FakeMap2() {
        this._key = "chai/deep-eql__" + Math.random() + Date.now();
      }
      FakeMap2.prototype = {
        get: function get2(key) {
          return key[this._key];
        },
        set: function set2(key, value) {
          if (Object.isExtensible(key)) {
            Object.defineProperty(key, this._key, {
              value,
              configurable: true
            });
          }
        }
      };
      var MemoizeMap = typeof WeakMap === "function" ? WeakMap : FakeMap2;
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
      module.exports = deepEqual;
      module.exports.MemoizeMap = MemoizeMap;
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
        var leftHandType = type(leftHandOperand);
        if (leftHandType !== type(rightHandOperand)) {
          memoizeSet(leftHandOperand, rightHandOperand, options.memoize, false);
          return false;
        }
        memoizeSet(leftHandOperand, rightHandOperand, options.memoize, true);
        var result = extensiveDeepEqualByType(leftHandOperand, rightHandOperand, leftHandType, options);
        memoizeSet(leftHandOperand, rightHandOperand, options.memoize, result);
        return result;
      }
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
      function regexpEqual(leftHandOperand, rightHandOperand) {
        return leftHandOperand.toString() === rightHandOperand.toString();
      }
      function entriesEqual(leftHandOperand, rightHandOperand, options) {
        if (leftHandOperand.size !== rightHandOperand.size) {
          return false;
        }
        if (leftHandOperand.size === 0) {
          return true;
        }
        var leftHandItems = [];
        var rightHandItems = [];
        leftHandOperand.forEach(function gatherEntries(key, value) {
          leftHandItems.push([key, value]);
        });
        rightHandOperand.forEach(function gatherEntries(key, value) {
          rightHandItems.push([key, value]);
        });
        return iterableEqual(leftHandItems.sort(), rightHandItems.sort(), options);
      }
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
      function generatorEqual(leftHandOperand, rightHandOperand, options) {
        return iterableEqual(getGeneratorEntries(leftHandOperand), getGeneratorEntries(rightHandOperand), options);
      }
      function hasIteratorFunction(target) {
        return typeof Symbol !== "undefined" && typeof target === "object" && typeof Symbol.iterator !== "undefined" && typeof target[Symbol.iterator] === "function";
      }
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
      function getGeneratorEntries(generator) {
        var generatorResult = generator.next();
        var accumulator = [generatorResult.value];
        while (generatorResult.done === false) {
          generatorResult = generator.next();
          accumulator.push(generatorResult.value);
        }
        return accumulator;
      }
      function getEnumerableKeys(target) {
        var keys = [];
        for (var key in target) {
          keys.push(key);
        }
        return keys;
      }
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
      function isPrimitive(value) {
        return value === null || typeof value !== "object";
      }
      function mapSymbols(arr) {
        return arr.map(function mapSymbol(entry) {
          if (typeof entry === "symbol") {
            return entry.toString();
          }
          return entry;
        });
      }
    }
  });

  // node_modules/chai/lib/chai/utils/isProxyEnabled.js
  var require_isProxyEnabled = __commonJS({
    "node_modules/chai/lib/chai/utils/isProxyEnabled.js"(exports, module) {
      "use strict";
      var config2 = require_config();
      module.exports = function isProxyEnabled() {
        return config2.useProxy && typeof Proxy !== "undefined" && typeof Reflect !== "undefined";
      };
    }
  });

  // node_modules/chai/lib/chai/utils/addProperty.js
  var require_addProperty = __commonJS({
    "node_modules/chai/lib/chai/utils/addProperty.js"(exports, module) {
      "use strict";
      var chai2 = require_chai();
      var flag = require_flag();
      var isProxyEnabled = require_isProxyEnabled();
      var transferFlags = require_transferFlags();
      module.exports = function addProperty(ctx, name, getter) {
        getter = getter === void 0 ? function() {
        } : getter;
        Object.defineProperty(
          ctx,
          name,
          {
            get: function propertyGetter() {
              if (!isProxyEnabled() && !flag(this, "lockSsfi")) {
                flag(this, "ssfi", propertyGetter);
              }
              var result = getter.call(this);
              if (result !== void 0)
                return result;
              var newAssertion = new chai2.Assertion();
              transferFlags(this, newAssertion);
              return newAssertion;
            },
            configurable: true
          }
        );
      };
    }
  });

  // node_modules/chai/lib/chai/utils/addLengthGuard.js
  var require_addLengthGuard = __commonJS({
    "node_modules/chai/lib/chai/utils/addLengthGuard.js"(exports, module) {
      "use strict";
      var fnLengthDesc = Object.getOwnPropertyDescriptor(function() {
      }, "length");
      module.exports = function addLengthGuard(fn, assertionName, isChainable) {
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
      };
    }
  });

  // node_modules/chai/lib/chai/utils/getProperties.js
  var require_getProperties = __commonJS({
    "node_modules/chai/lib/chai/utils/getProperties.js"(exports, module) {
      "use strict";
      module.exports = function getProperties(object) {
        var result = Object.getOwnPropertyNames(object);
        function addProperty(property) {
          if (result.indexOf(property) === -1) {
            result.push(property);
          }
        }
        var proto = Object.getPrototypeOf(object);
        while (proto !== null) {
          Object.getOwnPropertyNames(proto).forEach(addProperty);
          proto = Object.getPrototypeOf(proto);
        }
        return result;
      };
    }
  });

  // node_modules/chai/lib/chai/utils/proxify.js
  var require_proxify = __commonJS({
    "node_modules/chai/lib/chai/utils/proxify.js"(exports, module) {
      "use strict";
      var config2 = require_config();
      var flag = require_flag();
      var getProperties = require_getProperties();
      var isProxyEnabled = require_isProxyEnabled();
      var builtins = ["__flags", "__methods", "_obj", "assert"];
      module.exports = function proxify(obj, nonChainableMethodName) {
        if (!isProxyEnabled())
          return obj;
        return new Proxy(obj, {
          get: function proxyGetter(target, property) {
            if (typeof property === "string" && config2.proxyExcludedKeys.indexOf(property) === -1 && !Reflect.has(target, property)) {
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
          }
        });
      };
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
    }
  });

  // node_modules/chai/lib/chai/utils/addMethod.js
  var require_addMethod = __commonJS({
    "node_modules/chai/lib/chai/utils/addMethod.js"(exports, module) {
      "use strict";
      var addLengthGuard = require_addLengthGuard();
      var chai2 = require_chai();
      var flag = require_flag();
      var proxify = require_proxify();
      var transferFlags = require_transferFlags();
      module.exports = function addMethod(ctx, name, method) {
        var methodWrapper = function() {
          if (!flag(this, "lockSsfi")) {
            flag(this, "ssfi", methodWrapper);
          }
          var result = method.apply(this, arguments);
          if (result !== void 0)
            return result;
          var newAssertion = new chai2.Assertion();
          transferFlags(this, newAssertion);
          return newAssertion;
        };
        addLengthGuard(methodWrapper, name, false);
        ctx[name] = proxify(methodWrapper, name);
      };
    }
  });

  // node_modules/chai/lib/chai/utils/overwriteProperty.js
  var require_overwriteProperty = __commonJS({
    "node_modules/chai/lib/chai/utils/overwriteProperty.js"(exports, module) {
      "use strict";
      var chai2 = require_chai();
      var flag = require_flag();
      var isProxyEnabled = require_isProxyEnabled();
      var transferFlags = require_transferFlags();
      module.exports = function overwriteProperty(ctx, name, getter) {
        var _get = Object.getOwnPropertyDescriptor(ctx, name), _super = function() {
        };
        if (_get && "function" === typeof _get.get)
          _super = _get.get;
        Object.defineProperty(
          ctx,
          name,
          {
            get: function overwritingPropertyGetter() {
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
              var newAssertion = new chai2.Assertion();
              transferFlags(this, newAssertion);
              return newAssertion;
            },
            configurable: true
          }
        );
      };
    }
  });

  // node_modules/chai/lib/chai/utils/overwriteMethod.js
  var require_overwriteMethod = __commonJS({
    "node_modules/chai/lib/chai/utils/overwriteMethod.js"(exports, module) {
      "use strict";
      var addLengthGuard = require_addLengthGuard();
      var chai2 = require_chai();
      var flag = require_flag();
      var proxify = require_proxify();
      var transferFlags = require_transferFlags();
      module.exports = function overwriteMethod(ctx, name, method) {
        var _method = ctx[name], _super = function() {
          throw new Error(name + " is not a function");
        };
        if (_method && "function" === typeof _method)
          _super = _method;
        var overwritingMethodWrapper = function() {
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
          var newAssertion = new chai2.Assertion();
          transferFlags(this, newAssertion);
          return newAssertion;
        };
        addLengthGuard(overwritingMethodWrapper, name, false);
        ctx[name] = proxify(overwritingMethodWrapper, name);
      };
    }
  });

  // node_modules/chai/lib/chai/utils/addChainableMethod.js
  var require_addChainableMethod = __commonJS({
    "node_modules/chai/lib/chai/utils/addChainableMethod.js"(exports, module) {
      "use strict";
      var addLengthGuard = require_addLengthGuard();
      var chai2 = require_chai();
      var flag = require_flag();
      var proxify = require_proxify();
      var transferFlags = require_transferFlags();
      var canSetPrototype = typeof Object.setPrototypeOf === "function";
      var testFn = function() {
      };
      var excludeNames = Object.getOwnPropertyNames(testFn).filter(function(name) {
        var propDesc = Object.getOwnPropertyDescriptor(testFn, name);
        if (typeof propDesc !== "object")
          return true;
        return !propDesc.configurable;
      });
      var call = Function.prototype.call;
      var apply = Function.prototype.apply;
      module.exports = function addChainableMethod(ctx, name, method, chainingBehavior) {
        if (typeof chainingBehavior !== "function") {
          chainingBehavior = function() {
          };
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
            get: function chainableMethodGetter() {
              chainableBehavior.chainingBehavior.call(this);
              var chainableMethodWrapper = function() {
                if (!flag(this, "lockSsfi")) {
                  flag(this, "ssfi", chainableMethodWrapper);
                }
                var result = chainableBehavior.method.apply(this, arguments);
                if (result !== void 0) {
                  return result;
                }
                var newAssertion = new chai2.Assertion();
                transferFlags(this, newAssertion);
                return newAssertion;
              };
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
            },
            configurable: true
          }
        );
      };
    }
  });

  // node_modules/chai/lib/chai/utils/overwriteChainableMethod.js
  var require_overwriteChainableMethod = __commonJS({
    "node_modules/chai/lib/chai/utils/overwriteChainableMethod.js"(exports, module) {
      "use strict";
      var chai2 = require_chai();
      var transferFlags = require_transferFlags();
      module.exports = function overwriteChainableMethod(ctx, name, method, chainingBehavior) {
        var chainableBehavior = ctx.__methods[name];
        var _chainingBehavior = chainableBehavior.chainingBehavior;
        chainableBehavior.chainingBehavior = function overwritingChainableMethodGetter() {
          var result = chainingBehavior(_chainingBehavior).call(this);
          if (result !== void 0) {
            return result;
          }
          var newAssertion = new chai2.Assertion();
          transferFlags(this, newAssertion);
          return newAssertion;
        };
        var _method = chainableBehavior.method;
        chainableBehavior.method = function overwritingChainableMethodWrapper() {
          var result = method(_method).apply(this, arguments);
          if (result !== void 0) {
            return result;
          }
          var newAssertion = new chai2.Assertion();
          transferFlags(this, newAssertion);
          return newAssertion;
        };
      };
    }
  });

  // node_modules/chai/lib/chai/utils/compareByInspect.js
  var require_compareByInspect = __commonJS({
    "node_modules/chai/lib/chai/utils/compareByInspect.js"(exports, module) {
      "use strict";
      var inspect2 = require_inspect();
      module.exports = function compareByInspect(a, b) {
        return inspect2(a) < inspect2(b) ? -1 : 1;
      };
    }
  });

  // node_modules/chai/lib/chai/utils/getOwnEnumerablePropertySymbols.js
  var require_getOwnEnumerablePropertySymbols = __commonJS({
    "node_modules/chai/lib/chai/utils/getOwnEnumerablePropertySymbols.js"(exports, module) {
      "use strict";
      module.exports = function getOwnEnumerablePropertySymbols(obj) {
        if (typeof Object.getOwnPropertySymbols !== "function")
          return [];
        return Object.getOwnPropertySymbols(obj).filter(function(sym) {
          return Object.getOwnPropertyDescriptor(obj, sym).enumerable;
        });
      };
    }
  });

  // node_modules/chai/lib/chai/utils/getOwnEnumerableProperties.js
  var require_getOwnEnumerableProperties = __commonJS({
    "node_modules/chai/lib/chai/utils/getOwnEnumerableProperties.js"(exports, module) {
      "use strict";
      var getOwnEnumerablePropertySymbols = require_getOwnEnumerablePropertySymbols();
      module.exports = function getOwnEnumerableProperties(obj) {
        return Object.keys(obj).concat(getOwnEnumerablePropertySymbols(obj));
      };
    }
  });

  // node_modules/check-error/index.js
  var require_check_error = __commonJS({
    "node_modules/check-error/index.js"(exports, module) {
      "use strict";
      var getFunctionName2 = require_get_func_name();
      function compatibleInstance(thrown, errorLike) {
        return errorLike instanceof Error && thrown === errorLike;
      }
      function compatibleConstructor(thrown, errorLike) {
        if (errorLike instanceof Error) {
          return thrown.constructor === errorLike.constructor || thrown instanceof errorLike.constructor;
        } else if (errorLike.prototype instanceof Error || errorLike === Error) {
          return thrown.constructor === errorLike || thrown instanceof errorLike;
        }
        return false;
      }
      function compatibleMessage(thrown, errMatcher) {
        var comparisonString = typeof thrown === "string" ? thrown : thrown.message;
        if (errMatcher instanceof RegExp) {
          return errMatcher.test(comparisonString);
        } else if (typeof errMatcher === "string") {
          return comparisonString.indexOf(errMatcher) !== -1;
        }
        return false;
      }
      function getConstructorName(errorLike) {
        var constructorName = errorLike;
        if (errorLike instanceof Error) {
          constructorName = getFunctionName2(errorLike.constructor);
        } else if (typeof errorLike === "function") {
          constructorName = getFunctionName2(errorLike);
          if (constructorName === "") {
            var newConstructorName = getFunctionName2(new errorLike());
            constructorName = newConstructorName || constructorName;
          }
        }
        return constructorName;
      }
      function getMessage(errorLike) {
        var msg = "";
        if (errorLike && errorLike.message) {
          msg = errorLike.message;
        } else if (typeof errorLike === "string") {
          msg = errorLike;
        }
        return msg;
      }
      module.exports = {
        compatibleInstance,
        compatibleConstructor,
        compatibleMessage,
        getMessage,
        getConstructorName
      };
    }
  });

  // node_modules/chai/lib/chai/utils/isNaN.js
  var require_isNaN = __commonJS({
    "node_modules/chai/lib/chai/utils/isNaN.js"(exports, module) {
      "use strict";
      function isNaN2(value) {
        return value !== value;
      }
      module.exports = Number.isNaN || isNaN2;
    }
  });

  // node_modules/chai/lib/chai/utils/getOperator.js
  var require_getOperator = __commonJS({
    "node_modules/chai/lib/chai/utils/getOperator.js"(exports, module) {
      "use strict";
      var type = require_type_detect();
      var flag = require_flag();
      function isObjectType(obj) {
        var objectType = type(obj);
        var objectTypes = ["Array", "Object", "function"];
        return objectTypes.indexOf(objectType) !== -1;
      }
      module.exports = function getOperator(obj, args) {
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
      };
    }
  });

  // node_modules/chai/lib/chai/utils/index.js
  var require_utils = __commonJS({
    "node_modules/chai/lib/chai/utils/index.js"(exports) {
      "use strict";
      var pathval = require_pathval();
      exports.test = require_test();
      exports.type = require_type_detect();
      exports.expectTypes = require_expectTypes();
      exports.getMessage = require_getMessage();
      exports.getActual = require_getActual();
      exports.inspect = require_inspect();
      exports.objDisplay = require_objDisplay();
      exports.flag = require_flag();
      exports.transferFlags = require_transferFlags();
      exports.eql = require_deep_eql();
      exports.getPathInfo = pathval.getPathInfo;
      exports.hasProperty = pathval.hasProperty;
      exports.getName = require_get_func_name();
      exports.addProperty = require_addProperty();
      exports.addMethod = require_addMethod();
      exports.overwriteProperty = require_overwriteProperty();
      exports.overwriteMethod = require_overwriteMethod();
      exports.addChainableMethod = require_addChainableMethod();
      exports.overwriteChainableMethod = require_overwriteChainableMethod();
      exports.compareByInspect = require_compareByInspect();
      exports.getOwnEnumerablePropertySymbols = require_getOwnEnumerablePropertySymbols();
      exports.getOwnEnumerableProperties = require_getOwnEnumerableProperties();
      exports.checkError = require_check_error();
      exports.proxify = require_proxify();
      exports.addLengthGuard = require_addLengthGuard();
      exports.isProxyEnabled = require_isProxyEnabled();
      exports.isNaN = require_isNaN();
      exports.getOperator = require_getOperator();
    }
  });

  // node_modules/chai/lib/chai/assertion.js
  var require_assertion = __commonJS({
    "node_modules/chai/lib/chai/assertion.js"(exports, module) {
      "use strict";
      var config2 = require_config();
      module.exports = function(_chai, util2) {
        var AssertionError2 = _chai.AssertionError, flag = util2.flag;
        _chai.Assertion = Assertion2;
        function Assertion2(obj, msg, ssfi, lockSsfi) {
          flag(this, "ssfi", ssfi || Assertion2);
          flag(this, "lockSsfi", lockSsfi);
          flag(this, "object", obj);
          flag(this, "message", msg);
          return util2.proxify(this);
        }
        Object.defineProperty(Assertion2, "includeStack", {
          get: function() {
            console.warn("Assertion.includeStack is deprecated, use chai.config.includeStack instead.");
            return config2.includeStack;
          },
          set: function(value) {
            console.warn("Assertion.includeStack is deprecated, use chai.config.includeStack instead.");
            config2.includeStack = value;
          }
        });
        Object.defineProperty(Assertion2, "showDiff", {
          get: function() {
            console.warn("Assertion.showDiff is deprecated, use chai.config.showDiff instead.");
            return config2.showDiff;
          },
          set: function(value) {
            console.warn("Assertion.showDiff is deprecated, use chai.config.showDiff instead.");
            config2.showDiff = value;
          }
        });
        Assertion2.addProperty = function(name, fn) {
          util2.addProperty(this.prototype, name, fn);
        };
        Assertion2.addMethod = function(name, fn) {
          util2.addMethod(this.prototype, name, fn);
        };
        Assertion2.addChainableMethod = function(name, fn, chainingBehavior) {
          util2.addChainableMethod(this.prototype, name, fn, chainingBehavior);
        };
        Assertion2.overwriteProperty = function(name, fn) {
          util2.overwriteProperty(this.prototype, name, fn);
        };
        Assertion2.overwriteMethod = function(name, fn) {
          util2.overwriteMethod(this.prototype, name, fn);
        };
        Assertion2.overwriteChainableMethod = function(name, fn, chainingBehavior) {
          util2.overwriteChainableMethod(this.prototype, name, fn, chainingBehavior);
        };
        Assertion2.prototype.assert = function(expr, msg, negateMsg, expected, _actual, showDiff) {
          var ok = util2.test(this, arguments);
          if (false !== showDiff)
            showDiff = true;
          if (void 0 === expected && void 0 === _actual)
            showDiff = false;
          if (true !== config2.showDiff)
            showDiff = false;
          if (!ok) {
            msg = util2.getMessage(this, arguments);
            var actual = util2.getActual(this, arguments);
            var assertionErrorObjectProperties = {
              actual,
              expected,
              showDiff
            };
            var operator = util2.getOperator(this, arguments);
            if (operator) {
              assertionErrorObjectProperties.operator = operator;
            }
            throw new AssertionError2(
              msg,
              assertionErrorObjectProperties,
              config2.includeStack ? this.assert : flag(this, "ssfi")
            );
          }
        };
        Object.defineProperty(
          Assertion2.prototype,
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
      };
    }
  });

  // node_modules/chai/lib/chai/core/assertions.js
  var require_assertions = __commonJS({
    "node_modules/chai/lib/chai/core/assertions.js"(exports, module) {
      "use strict";
      module.exports = function(chai2, _) {
        var Assertion2 = chai2.Assertion, AssertionError2 = chai2.AssertionError, flag = _.flag;
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
          Assertion2.addProperty(chain);
        });
        Assertion2.addProperty("not", function() {
          flag(this, "negate", true);
        });
        Assertion2.addProperty("deep", function() {
          flag(this, "deep", true);
        });
        Assertion2.addProperty("nested", function() {
          flag(this, "nested", true);
        });
        Assertion2.addProperty("own", function() {
          flag(this, "own", true);
        });
        Assertion2.addProperty("ordered", function() {
          flag(this, "ordered", true);
        });
        Assertion2.addProperty("any", function() {
          flag(this, "any", true);
          flag(this, "all", false);
        });
        Assertion2.addProperty("all", function() {
          flag(this, "all", true);
          flag(this, "any", false);
        });
        function an(type, msg) {
          if (msg)
            flag(this, "message", msg);
          type = type.toLowerCase();
          var obj = flag(this, "object"), article = ~["a", "e", "i", "o", "u"].indexOf(type.charAt(0)) ? "an " : "a ";
          this.assert(
            type === _.type(obj).toLowerCase(),
            "expected #{this} to be " + article + type,
            "expected #{this} not to be " + article + type
          );
        }
        Assertion2.addChainableMethod("an", an);
        Assertion2.addChainableMethod("a", an);
        function SameValueZero(a, b) {
          return _.isNaN(a) && _.isNaN(b) || a === b;
        }
        function includeChainingBehavior() {
          flag(this, "contains", true);
        }
        function include(val, msg) {
          if (msg)
            flag(this, "message", msg);
          var obj = flag(this, "object"), objType = _.type(obj).toLowerCase(), flagMsg = flag(this, "message"), negate = flag(this, "negate"), ssfi = flag(this, "ssfi"), isDeep = flag(this, "deep"), descriptor = isDeep ? "deep " : "";
          flagMsg = flagMsg ? flagMsg + ": " : "";
          var included = false;
          switch (objType) {
            case "string":
              included = obj.indexOf(val) !== -1;
              break;
            case "weakset":
              if (isDeep) {
                throw new AssertionError2(
                  flagMsg + "unable to use .deep.include with WeakSet",
                  void 0,
                  ssfi
                );
              }
              included = obj.has(val);
              break;
            case "map":
              var isEql = isDeep ? _.eql : SameValueZero;
              obj.forEach(function(item) {
                included = included || isEql(item, val);
              });
              break;
            case "set":
              if (isDeep) {
                obj.forEach(function(item) {
                  included = included || _.eql(item, val);
                });
              } else {
                included = obj.has(val);
              }
              break;
            case "array":
              if (isDeep) {
                included = obj.some(function(item) {
                  return _.eql(item, val);
                });
              } else {
                included = obj.indexOf(val) !== -1;
              }
              break;
            default:
              if (val !== Object(val)) {
                throw new AssertionError2(
                  flagMsg + "the given combination of arguments (" + objType + " and " + _.type(val).toLowerCase() + ") is invalid for this assertion. You can use an array, a map, an object, a set, a string, or a weakset instead of a " + _.type(val).toLowerCase(),
                  void 0,
                  ssfi
                );
              }
              var props = Object.keys(val), firstErr = null, numErrs = 0;
              props.forEach(function(prop) {
                var propAssertion = new Assertion2(obj);
                _.transferFlags(this, propAssertion, true);
                flag(propAssertion, "lockSsfi", true);
                if (!negate || props.length === 1) {
                  propAssertion.property(prop, val[prop]);
                  return;
                }
                try {
                  propAssertion.property(prop, val[prop]);
                } catch (err) {
                  if (!_.checkError.compatibleConstructor(err, AssertionError2)) {
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
            "expected #{this} to " + descriptor + "include " + _.inspect(val),
            "expected #{this} to not " + descriptor + "include " + _.inspect(val)
          );
        }
        Assertion2.addChainableMethod("include", include, includeChainingBehavior);
        Assertion2.addChainableMethod("contain", include, includeChainingBehavior);
        Assertion2.addChainableMethod("contains", include, includeChainingBehavior);
        Assertion2.addChainableMethod("includes", include, includeChainingBehavior);
        Assertion2.addProperty("ok", function() {
          this.assert(
            flag(this, "object"),
            "expected #{this} to be truthy",
            "expected #{this} to be falsy"
          );
        });
        Assertion2.addProperty("true", function() {
          this.assert(
            true === flag(this, "object"),
            "expected #{this} to be true",
            "expected #{this} to be false",
            flag(this, "negate") ? false : true
          );
        });
        Assertion2.addProperty("false", function() {
          this.assert(
            false === flag(this, "object"),
            "expected #{this} to be false",
            "expected #{this} to be true",
            flag(this, "negate") ? true : false
          );
        });
        Assertion2.addProperty("null", function() {
          this.assert(
            null === flag(this, "object"),
            "expected #{this} to be null",
            "expected #{this} not to be null"
          );
        });
        Assertion2.addProperty("undefined", function() {
          this.assert(
            void 0 === flag(this, "object"),
            "expected #{this} to be undefined",
            "expected #{this} not to be undefined"
          );
        });
        Assertion2.addProperty("NaN", function() {
          this.assert(
            _.isNaN(flag(this, "object")),
            "expected #{this} to be NaN",
            "expected #{this} not to be NaN"
          );
        });
        function assertExist() {
          var val = flag(this, "object");
          this.assert(
            val !== null && val !== void 0,
            "expected #{this} to exist",
            "expected #{this} to not exist"
          );
        }
        Assertion2.addProperty("exist", assertExist);
        Assertion2.addProperty("exists", assertExist);
        Assertion2.addProperty("empty", function() {
          var val = flag(this, "object"), ssfi = flag(this, "ssfi"), flagMsg = flag(this, "message"), itemsCount;
          flagMsg = flagMsg ? flagMsg + ": " : "";
          switch (_.type(val).toLowerCase()) {
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
              throw new AssertionError2(
                flagMsg + ".empty was passed a weak collection",
                void 0,
                ssfi
              );
            case "function":
              var msg = flagMsg + ".empty was passed a function " + _.getName(val);
              throw new AssertionError2(msg.trim(), void 0, ssfi);
            default:
              if (val !== Object(val)) {
                throw new AssertionError2(
                  flagMsg + ".empty was passed non-string primitive " + _.inspect(val),
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
          var obj = flag(this, "object"), type = _.type(obj);
          this.assert(
            "Arguments" === type,
            "expected #{this} to be arguments but got " + type,
            "expected #{this} to not be arguments"
          );
        }
        Assertion2.addProperty("arguments", checkArguments);
        Assertion2.addProperty("Arguments", checkArguments);
        function assertEqual(val, msg) {
          if (msg)
            flag(this, "message", msg);
          var obj = flag(this, "object");
          if (flag(this, "deep")) {
            var prevLockSsfi = flag(this, "lockSsfi");
            flag(this, "lockSsfi", true);
            this.eql(val);
            flag(this, "lockSsfi", prevLockSsfi);
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
        Assertion2.addMethod("equal", assertEqual);
        Assertion2.addMethod("equals", assertEqual);
        Assertion2.addMethod("eq", assertEqual);
        function assertEql(obj, msg) {
          if (msg)
            flag(this, "message", msg);
          this.assert(
            _.eql(obj, flag(this, "object")),
            "expected #{this} to deeply equal #{exp}",
            "expected #{this} to not deeply equal #{exp}",
            obj,
            this._obj,
            true
          );
        }
        Assertion2.addMethod("eql", assertEql);
        Assertion2.addMethod("eqls", assertEql);
        function assertAbove(n, msg) {
          if (msg)
            flag(this, "message", msg);
          var obj = flag(this, "object"), doLength = flag(this, "doLength"), flagMsg = flag(this, "message"), msgPrefix = flagMsg ? flagMsg + ": " : "", ssfi = flag(this, "ssfi"), objType = _.type(obj).toLowerCase(), nType = _.type(n).toLowerCase(), errorMessage, shouldThrow = true;
          if (doLength && objType !== "map" && objType !== "set") {
            new Assertion2(obj, flagMsg, ssfi, true).to.have.property("length");
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
            throw new AssertionError2(errorMessage, void 0, ssfi);
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
        Assertion2.addMethod("above", assertAbove);
        Assertion2.addMethod("gt", assertAbove);
        Assertion2.addMethod("greaterThan", assertAbove);
        function assertLeast(n, msg) {
          if (msg)
            flag(this, "message", msg);
          var obj = flag(this, "object"), doLength = flag(this, "doLength"), flagMsg = flag(this, "message"), msgPrefix = flagMsg ? flagMsg + ": " : "", ssfi = flag(this, "ssfi"), objType = _.type(obj).toLowerCase(), nType = _.type(n).toLowerCase(), errorMessage, shouldThrow = true;
          if (doLength && objType !== "map" && objType !== "set") {
            new Assertion2(obj, flagMsg, ssfi, true).to.have.property("length");
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
            throw new AssertionError2(errorMessage, void 0, ssfi);
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
        Assertion2.addMethod("least", assertLeast);
        Assertion2.addMethod("gte", assertLeast);
        Assertion2.addMethod("greaterThanOrEqual", assertLeast);
        function assertBelow(n, msg) {
          if (msg)
            flag(this, "message", msg);
          var obj = flag(this, "object"), doLength = flag(this, "doLength"), flagMsg = flag(this, "message"), msgPrefix = flagMsg ? flagMsg + ": " : "", ssfi = flag(this, "ssfi"), objType = _.type(obj).toLowerCase(), nType = _.type(n).toLowerCase(), errorMessage, shouldThrow = true;
          if (doLength && objType !== "map" && objType !== "set") {
            new Assertion2(obj, flagMsg, ssfi, true).to.have.property("length");
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
            throw new AssertionError2(errorMessage, void 0, ssfi);
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
        Assertion2.addMethod("below", assertBelow);
        Assertion2.addMethod("lt", assertBelow);
        Assertion2.addMethod("lessThan", assertBelow);
        function assertMost(n, msg) {
          if (msg)
            flag(this, "message", msg);
          var obj = flag(this, "object"), doLength = flag(this, "doLength"), flagMsg = flag(this, "message"), msgPrefix = flagMsg ? flagMsg + ": " : "", ssfi = flag(this, "ssfi"), objType = _.type(obj).toLowerCase(), nType = _.type(n).toLowerCase(), errorMessage, shouldThrow = true;
          if (doLength && objType !== "map" && objType !== "set") {
            new Assertion2(obj, flagMsg, ssfi, true).to.have.property("length");
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
            throw new AssertionError2(errorMessage, void 0, ssfi);
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
        Assertion2.addMethod("most", assertMost);
        Assertion2.addMethod("lte", assertMost);
        Assertion2.addMethod("lessThanOrEqual", assertMost);
        Assertion2.addMethod("within", function(start, finish, msg) {
          if (msg)
            flag(this, "message", msg);
          var obj = flag(this, "object"), doLength = flag(this, "doLength"), flagMsg = flag(this, "message"), msgPrefix = flagMsg ? flagMsg + ": " : "", ssfi = flag(this, "ssfi"), objType = _.type(obj).toLowerCase(), startType = _.type(start).toLowerCase(), finishType = _.type(finish).toLowerCase(), errorMessage, shouldThrow = true, range = startType === "date" && finishType === "date" ? start.toISOString() + ".." + finish.toISOString() : start + ".." + finish;
          if (doLength && objType !== "map" && objType !== "set") {
            new Assertion2(obj, flagMsg, ssfi, true).to.have.property("length");
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
            throw new AssertionError2(errorMessage, void 0, ssfi);
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
            flag(this, "message", msg);
          var target = flag(this, "object");
          var ssfi = flag(this, "ssfi");
          var flagMsg = flag(this, "message");
          try {
            var isInstanceOf = target instanceof constructor;
          } catch (err) {
            if (err instanceof TypeError) {
              flagMsg = flagMsg ? flagMsg + ": " : "";
              throw new AssertionError2(
                flagMsg + "The instanceof assertion needs a constructor but " + _.type(constructor) + " was given.",
                void 0,
                ssfi
              );
            }
            throw err;
          }
          var name = _.getName(constructor);
          if (name === null) {
            name = "an unnamed constructor";
          }
          this.assert(
            isInstanceOf,
            "expected #{this} to be an instance of " + name,
            "expected #{this} to not be an instance of " + name
          );
        }
        ;
        Assertion2.addMethod("instanceof", assertInstanceOf);
        Assertion2.addMethod("instanceOf", assertInstanceOf);
        function assertProperty(name, val, msg) {
          if (msg)
            flag(this, "message", msg);
          var isNested = flag(this, "nested"), isOwn = flag(this, "own"), flagMsg = flag(this, "message"), obj = flag(this, "object"), ssfi = flag(this, "ssfi"), nameType = typeof name;
          flagMsg = flagMsg ? flagMsg + ": " : "";
          if (isNested) {
            if (nameType !== "string") {
              throw new AssertionError2(
                flagMsg + "the argument to property must be a string when using nested syntax",
                void 0,
                ssfi
              );
            }
          } else {
            if (nameType !== "string" && nameType !== "number" && nameType !== "symbol") {
              throw new AssertionError2(
                flagMsg + "the argument to property must be a string, number, or symbol",
                void 0,
                ssfi
              );
            }
          }
          if (isNested && isOwn) {
            throw new AssertionError2(
              flagMsg + 'The "nested" and "own" flags cannot be combined.',
              void 0,
              ssfi
            );
          }
          if (obj === null || obj === void 0) {
            throw new AssertionError2(
              flagMsg + "Target cannot be null or undefined.",
              void 0,
              ssfi
            );
          }
          var isDeep = flag(this, "deep"), negate = flag(this, "negate"), pathInfo = isNested ? _.getPathInfo(obj, name) : null, value = isNested ? pathInfo.value : obj[name];
          var descriptor = "";
          if (isDeep)
            descriptor += "deep ";
          if (isOwn)
            descriptor += "own ";
          if (isNested)
            descriptor += "nested ";
          descriptor += "property ";
          var hasProperty;
          if (isOwn)
            hasProperty = Object.prototype.hasOwnProperty.call(obj, name);
          else if (isNested)
            hasProperty = pathInfo.exists;
          else
            hasProperty = _.hasProperty(obj, name);
          if (!negate || arguments.length === 1) {
            this.assert(
              hasProperty,
              "expected #{this} to have " + descriptor + _.inspect(name),
              "expected #{this} to not have " + descriptor + _.inspect(name)
            );
          }
          if (arguments.length > 1) {
            this.assert(
              hasProperty && (isDeep ? _.eql(val, value) : val === value),
              "expected #{this} to have " + descriptor + _.inspect(name) + " of #{exp}, but got #{act}",
              "expected #{this} to not have " + descriptor + _.inspect(name) + " of #{act}",
              val,
              value
            );
          }
          flag(this, "object", value);
        }
        Assertion2.addMethod("property", assertProperty);
        function assertOwnProperty(name, value, msg) {
          flag(this, "own", true);
          assertProperty.apply(this, arguments);
        }
        Assertion2.addMethod("ownProperty", assertOwnProperty);
        Assertion2.addMethod("haveOwnProperty", assertOwnProperty);
        function assertOwnPropertyDescriptor(name, descriptor, msg) {
          if (typeof descriptor === "string") {
            msg = descriptor;
            descriptor = null;
          }
          if (msg)
            flag(this, "message", msg);
          var obj = flag(this, "object");
          var actualDescriptor = Object.getOwnPropertyDescriptor(Object(obj), name);
          if (actualDescriptor && descriptor) {
            this.assert(
              _.eql(descriptor, actualDescriptor),
              "expected the own property descriptor for " + _.inspect(name) + " on #{this} to match " + _.inspect(descriptor) + ", got " + _.inspect(actualDescriptor),
              "expected the own property descriptor for " + _.inspect(name) + " on #{this} to not match " + _.inspect(descriptor),
              descriptor,
              actualDescriptor,
              true
            );
          } else {
            this.assert(
              actualDescriptor,
              "expected #{this} to have an own property descriptor for " + _.inspect(name),
              "expected #{this} to not have an own property descriptor for " + _.inspect(name)
            );
          }
          flag(this, "object", actualDescriptor);
        }
        Assertion2.addMethod("ownPropertyDescriptor", assertOwnPropertyDescriptor);
        Assertion2.addMethod("haveOwnPropertyDescriptor", assertOwnPropertyDescriptor);
        function assertLengthChain() {
          flag(this, "doLength", true);
        }
        function assertLength(n, msg) {
          if (msg)
            flag(this, "message", msg);
          var obj = flag(this, "object"), objType = _.type(obj).toLowerCase(), flagMsg = flag(this, "message"), ssfi = flag(this, "ssfi"), descriptor = "length", itemsCount;
          switch (objType) {
            case "map":
            case "set":
              descriptor = "size";
              itemsCount = obj.size;
              break;
            default:
              new Assertion2(obj, flagMsg, ssfi, true).to.have.property("length");
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
        Assertion2.addChainableMethod("length", assertLength, assertLengthChain);
        Assertion2.addChainableMethod("lengthOf", assertLength, assertLengthChain);
        function assertMatch(re, msg) {
          if (msg)
            flag(this, "message", msg);
          var obj = flag(this, "object");
          this.assert(
            re.exec(obj),
            "expected #{this} to match " + re,
            "expected #{this} not to match " + re
          );
        }
        Assertion2.addMethod("match", assertMatch);
        Assertion2.addMethod("matches", assertMatch);
        Assertion2.addMethod("string", function(str, msg) {
          if (msg)
            flag(this, "message", msg);
          var obj = flag(this, "object"), flagMsg = flag(this, "message"), ssfi = flag(this, "ssfi");
          new Assertion2(obj, flagMsg, ssfi, true).is.a("string");
          this.assert(
            ~obj.indexOf(str),
            "expected #{this} to contain " + _.inspect(str),
            "expected #{this} to not contain " + _.inspect(str)
          );
        });
        function assertKeys(keys) {
          var obj = flag(this, "object"), objType = _.type(obj), keysType = _.type(keys), ssfi = flag(this, "ssfi"), isDeep = flag(this, "deep"), str, deepStr = "", actual, ok = true, flagMsg = flag(this, "message");
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
            actual = _.getOwnEnumerableProperties(obj);
            switch (keysType) {
              case "Array":
                if (arguments.length > 1) {
                  throw new AssertionError2(mixedArgsMsg, void 0, ssfi);
                }
                break;
              case "Object":
                if (arguments.length > 1) {
                  throw new AssertionError2(mixedArgsMsg, void 0, ssfi);
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
            throw new AssertionError2(flagMsg + "keys required", void 0, ssfi);
          }
          var len = keys.length, any = flag(this, "any"), all = flag(this, "all"), expected = keys;
          if (!any && !all) {
            all = true;
          }
          if (any) {
            ok = expected.some(function(expectedKey) {
              return actual.some(function(actualKey) {
                if (isDeep) {
                  return _.eql(expectedKey, actualKey);
                } else {
                  return expectedKey === actualKey;
                }
              });
            });
          }
          if (all) {
            ok = expected.every(function(expectedKey) {
              return actual.some(function(actualKey) {
                if (isDeep) {
                  return _.eql(expectedKey, actualKey);
                } else {
                  return expectedKey === actualKey;
                }
              });
            });
            if (!flag(this, "contains")) {
              ok = ok && keys.length == actual.length;
            }
          }
          if (len > 1) {
            keys = keys.map(function(key) {
              return _.inspect(key);
            });
            var last = keys.pop();
            if (all) {
              str = keys.join(", ") + ", and " + last;
            }
            if (any) {
              str = keys.join(", ") + ", or " + last;
            }
          } else {
            str = _.inspect(keys[0]);
          }
          str = (len > 1 ? "keys " : "key ") + str;
          str = (flag(this, "contains") ? "contain " : "have ") + str;
          this.assert(
            ok,
            "expected #{this} to " + deepStr + str,
            "expected #{this} to not " + deepStr + str,
            expected.slice(0).sort(_.compareByInspect),
            actual.sort(_.compareByInspect),
            true
          );
        }
        Assertion2.addMethod("keys", assertKeys);
        Assertion2.addMethod("key", assertKeys);
        function assertThrows(errorLike, errMsgMatcher, msg) {
          if (msg)
            flag(this, "message", msg);
          var obj = flag(this, "object"), ssfi = flag(this, "ssfi"), flagMsg = flag(this, "message"), negate = flag(this, "negate") || false;
          new Assertion2(obj, flagMsg, ssfi, true).is.a("function");
          if (errorLike instanceof RegExp || typeof errorLike === "string") {
            errMsgMatcher = errorLike;
            errorLike = null;
          }
          var caughtErr;
          try {
            obj();
          } catch (err) {
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
              errorLikeString = _.checkError.getConstructorName(errorLike);
            }
            this.assert(
              caughtErr,
              "expected #{this} to throw " + errorLikeString,
              "expected #{this} to not throw an error but #{act} was thrown",
              errorLike && errorLike.toString(),
              caughtErr instanceof Error ? caughtErr.toString() : typeof caughtErr === "string" ? caughtErr : caughtErr && _.checkError.getConstructorName(caughtErr)
            );
          }
          if (errorLike && caughtErr) {
            if (errorLike instanceof Error) {
              var isCompatibleInstance = _.checkError.compatibleInstance(caughtErr, errorLike);
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
            var isCompatibleConstructor = _.checkError.compatibleConstructor(caughtErr, errorLike);
            if (isCompatibleConstructor === negate) {
              if (everyArgIsDefined && negate) {
                errorLikeFail = true;
              } else {
                this.assert(
                  negate,
                  "expected #{this} to throw #{exp} but #{act} was thrown",
                  "expected #{this} to not throw #{exp}" + (caughtErr ? " but #{act} was thrown" : ""),
                  errorLike instanceof Error ? errorLike.toString() : errorLike && _.checkError.getConstructorName(errorLike),
                  caughtErr instanceof Error ? caughtErr.toString() : caughtErr && _.checkError.getConstructorName(caughtErr)
                );
              }
            }
          }
          if (caughtErr && errMsgMatcher !== void 0 && errMsgMatcher !== null) {
            var placeholder = "including";
            if (errMsgMatcher instanceof RegExp) {
              placeholder = "matching";
            }
            var isCompatibleMessage = _.checkError.compatibleMessage(caughtErr, errMsgMatcher);
            if (isCompatibleMessage === negate) {
              if (everyArgIsDefined && negate) {
                errMsgMatcherFail = true;
              } else {
                this.assert(
                  negate,
                  "expected #{this} to throw error " + placeholder + " #{exp} but got #{act}",
                  "expected #{this} to throw error not " + placeholder + " #{exp}",
                  errMsgMatcher,
                  _.checkError.getMessage(caughtErr)
                );
              }
            }
          }
          if (errorLikeFail && errMsgMatcherFail) {
            this.assert(
              negate,
              "expected #{this} to throw #{exp} but #{act} was thrown",
              "expected #{this} to not throw #{exp}" + (caughtErr ? " but #{act} was thrown" : ""),
              errorLike instanceof Error ? errorLike.toString() : errorLike && _.checkError.getConstructorName(errorLike),
              caughtErr instanceof Error ? caughtErr.toString() : caughtErr && _.checkError.getConstructorName(caughtErr)
            );
          }
          flag(this, "object", caughtErr);
        }
        ;
        Assertion2.addMethod("throw", assertThrows);
        Assertion2.addMethod("throws", assertThrows);
        Assertion2.addMethod("Throw", assertThrows);
        function respondTo(method, msg) {
          if (msg)
            flag(this, "message", msg);
          var obj = flag(this, "object"), itself = flag(this, "itself"), context = "function" === typeof obj && !itself ? obj.prototype[method] : obj[method];
          this.assert(
            "function" === typeof context,
            "expected #{this} to respond to " + _.inspect(method),
            "expected #{this} to not respond to " + _.inspect(method)
          );
        }
        Assertion2.addMethod("respondTo", respondTo);
        Assertion2.addMethod("respondsTo", respondTo);
        Assertion2.addProperty("itself", function() {
          flag(this, "itself", true);
        });
        function satisfy(matcher, msg) {
          if (msg)
            flag(this, "message", msg);
          var obj = flag(this, "object");
          var result = matcher(obj);
          this.assert(
            result,
            "expected #{this} to satisfy " + _.objDisplay(matcher),
            "expected #{this} to not satisfy" + _.objDisplay(matcher),
            flag(this, "negate") ? false : true,
            result
          );
        }
        Assertion2.addMethod("satisfy", satisfy);
        Assertion2.addMethod("satisfies", satisfy);
        function closeTo(expected, delta, msg) {
          if (msg)
            flag(this, "message", msg);
          var obj = flag(this, "object"), flagMsg = flag(this, "message"), ssfi = flag(this, "ssfi");
          new Assertion2(obj, flagMsg, ssfi, true).is.a("number");
          if (typeof expected !== "number" || typeof delta !== "number") {
            flagMsg = flagMsg ? flagMsg + ": " : "";
            var deltaMessage = delta === void 0 ? ", and a delta is required" : "";
            throw new AssertionError2(
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
        Assertion2.addMethod("closeTo", closeTo);
        Assertion2.addMethod("approximately", closeTo);
        function isSubsetOf(subset, superset, cmp, contains, ordered) {
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
        Assertion2.addMethod("members", function(subset, msg) {
          if (msg)
            flag(this, "message", msg);
          var obj = flag(this, "object"), flagMsg = flag(this, "message"), ssfi = flag(this, "ssfi");
          new Assertion2(obj, flagMsg, ssfi, true).to.be.an("array");
          new Assertion2(subset, flagMsg, ssfi, true).to.be.an("array");
          var contains = flag(this, "contains");
          var ordered = flag(this, "ordered");
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
          var cmp = flag(this, "deep") ? _.eql : void 0;
          this.assert(
            isSubsetOf(subset, obj, cmp, contains, ordered),
            failMsg,
            failNegateMsg,
            subset,
            obj,
            true
          );
        });
        function oneOf(list, msg) {
          if (msg)
            flag(this, "message", msg);
          var expected = flag(this, "object"), flagMsg = flag(this, "message"), ssfi = flag(this, "ssfi"), contains = flag(this, "contains"), isDeep = flag(this, "deep");
          new Assertion2(list, flagMsg, ssfi, true).to.be.an("array");
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
                  return _.eql(expected, possibility);
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
        Assertion2.addMethod("oneOf", oneOf);
        function assertChanges(subject, prop, msg) {
          if (msg)
            flag(this, "message", msg);
          var fn = flag(this, "object"), flagMsg = flag(this, "message"), ssfi = flag(this, "ssfi");
          new Assertion2(fn, flagMsg, ssfi, true).is.a("function");
          var initial;
          if (!prop) {
            new Assertion2(subject, flagMsg, ssfi, true).is.a("function");
            initial = subject();
          } else {
            new Assertion2(subject, flagMsg, ssfi, true).to.have.property(prop);
            initial = subject[prop];
          }
          fn();
          var final = prop === void 0 || prop === null ? subject() : subject[prop];
          var msgObj = prop === void 0 || prop === null ? initial : "." + prop;
          flag(this, "deltaMsgObj", msgObj);
          flag(this, "initialDeltaValue", initial);
          flag(this, "finalDeltaValue", final);
          flag(this, "deltaBehavior", "change");
          flag(this, "realDelta", final !== initial);
          this.assert(
            initial !== final,
            "expected " + msgObj + " to change",
            "expected " + msgObj + " to not change"
          );
        }
        Assertion2.addMethod("change", assertChanges);
        Assertion2.addMethod("changes", assertChanges);
        function assertIncreases(subject, prop, msg) {
          if (msg)
            flag(this, "message", msg);
          var fn = flag(this, "object"), flagMsg = flag(this, "message"), ssfi = flag(this, "ssfi");
          new Assertion2(fn, flagMsg, ssfi, true).is.a("function");
          var initial;
          if (!prop) {
            new Assertion2(subject, flagMsg, ssfi, true).is.a("function");
            initial = subject();
          } else {
            new Assertion2(subject, flagMsg, ssfi, true).to.have.property(prop);
            initial = subject[prop];
          }
          new Assertion2(initial, flagMsg, ssfi, true).is.a("number");
          fn();
          var final = prop === void 0 || prop === null ? subject() : subject[prop];
          var msgObj = prop === void 0 || prop === null ? initial : "." + prop;
          flag(this, "deltaMsgObj", msgObj);
          flag(this, "initialDeltaValue", initial);
          flag(this, "finalDeltaValue", final);
          flag(this, "deltaBehavior", "increase");
          flag(this, "realDelta", final - initial);
          this.assert(
            final - initial > 0,
            "expected " + msgObj + " to increase",
            "expected " + msgObj + " to not increase"
          );
        }
        Assertion2.addMethod("increase", assertIncreases);
        Assertion2.addMethod("increases", assertIncreases);
        function assertDecreases(subject, prop, msg) {
          if (msg)
            flag(this, "message", msg);
          var fn = flag(this, "object"), flagMsg = flag(this, "message"), ssfi = flag(this, "ssfi");
          new Assertion2(fn, flagMsg, ssfi, true).is.a("function");
          var initial;
          if (!prop) {
            new Assertion2(subject, flagMsg, ssfi, true).is.a("function");
            initial = subject();
          } else {
            new Assertion2(subject, flagMsg, ssfi, true).to.have.property(prop);
            initial = subject[prop];
          }
          new Assertion2(initial, flagMsg, ssfi, true).is.a("number");
          fn();
          var final = prop === void 0 || prop === null ? subject() : subject[prop];
          var msgObj = prop === void 0 || prop === null ? initial : "." + prop;
          flag(this, "deltaMsgObj", msgObj);
          flag(this, "initialDeltaValue", initial);
          flag(this, "finalDeltaValue", final);
          flag(this, "deltaBehavior", "decrease");
          flag(this, "realDelta", initial - final);
          this.assert(
            final - initial < 0,
            "expected " + msgObj + " to decrease",
            "expected " + msgObj + " to not decrease"
          );
        }
        Assertion2.addMethod("decrease", assertDecreases);
        Assertion2.addMethod("decreases", assertDecreases);
        function assertDelta(delta, msg) {
          if (msg)
            flag(this, "message", msg);
          var msgObj = flag(this, "deltaMsgObj");
          var initial = flag(this, "initialDeltaValue");
          var final = flag(this, "finalDeltaValue");
          var behavior = flag(this, "deltaBehavior");
          var realDelta = flag(this, "realDelta");
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
        Assertion2.addMethod("by", assertDelta);
        Assertion2.addProperty("extensible", function() {
          var obj = flag(this, "object");
          var isExtensible = obj === Object(obj) && Object.isExtensible(obj);
          this.assert(
            isExtensible,
            "expected #{this} to be extensible",
            "expected #{this} to not be extensible"
          );
        });
        Assertion2.addProperty("sealed", function() {
          var obj = flag(this, "object");
          var isSealed = obj === Object(obj) ? Object.isSealed(obj) : true;
          this.assert(
            isSealed,
            "expected #{this} to be sealed",
            "expected #{this} to not be sealed"
          );
        });
        Assertion2.addProperty("frozen", function() {
          var obj = flag(this, "object");
          var isFrozen = obj === Object(obj) ? Object.isFrozen(obj) : true;
          this.assert(
            isFrozen,
            "expected #{this} to be frozen",
            "expected #{this} to not be frozen"
          );
        });
        Assertion2.addProperty("finite", function(msg) {
          var obj = flag(this, "object");
          this.assert(
            typeof obj === "number" && isFinite(obj),
            "expected #{this} to be a finite number",
            "expected #{this} to not be a finite number"
          );
        });
      };
    }
  });

  // node_modules/chai/lib/chai/interface/expect.js
  var require_expect = __commonJS({
    "node_modules/chai/lib/chai/interface/expect.js"(exports, module) {
      "use strict";
      module.exports = function(chai2, util2) {
        chai2.expect = function(val, message) {
          return new chai2.Assertion(val, message);
        };
        chai2.expect.fail = function(actual, expected, message, operator) {
          if (arguments.length < 2) {
            message = actual;
            actual = void 0;
          }
          message = message || "expect.fail()";
          throw new chai2.AssertionError(message, {
            actual,
            expected,
            operator
          }, chai2.expect.fail);
        };
      };
    }
  });

  // node_modules/chai/lib/chai/interface/should.js
  var require_should = __commonJS({
    "node_modules/chai/lib/chai/interface/should.js"(exports, module) {
      "use strict";
      module.exports = function(chai2, util2) {
        var Assertion2 = chai2.Assertion;
        function loadShould() {
          function shouldGetter() {
            if (this instanceof String || this instanceof Number || this instanceof Boolean || typeof Symbol === "function" && this instanceof Symbol || typeof BigInt === "function" && this instanceof BigInt) {
              return new Assertion2(this.valueOf(), null, shouldGetter);
            }
            return new Assertion2(this, null, shouldGetter);
          }
          function shouldSetter(value) {
            Object.defineProperty(this, "should", {
              value,
              enumerable: true,
              configurable: true,
              writable: true
            });
          }
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
            throw new chai2.AssertionError(message, {
              actual,
              expected,
              operator
            }, should2.fail);
          };
          should2.equal = function(val1, val2, msg) {
            new Assertion2(val1, msg).to.equal(val2);
          };
          should2.Throw = function(fn, errt, errs, msg) {
            new Assertion2(fn, msg).to.Throw(errt, errs);
          };
          should2.exist = function(val, msg) {
            new Assertion2(val, msg).to.exist;
          };
          should2.not = {};
          should2.not.equal = function(val1, val2, msg) {
            new Assertion2(val1, msg).to.not.equal(val2);
          };
          should2.not.Throw = function(fn, errt, errs, msg) {
            new Assertion2(fn, msg).to.not.Throw(errt, errs);
          };
          should2.not.exist = function(val, msg) {
            new Assertion2(val, msg).to.not.exist;
          };
          should2["throw"] = should2["Throw"];
          should2.not["throw"] = should2.not["Throw"];
          return should2;
        }
        ;
        chai2.should = loadShould;
        chai2.Should = loadShould;
      };
    }
  });

  // node_modules/chai/lib/chai/interface/assert.js
  var require_assert = __commonJS({
    "node_modules/chai/lib/chai/interface/assert.js"(exports, module) {
      "use strict";
      module.exports = function(chai2, util2) {
        var Assertion2 = chai2.Assertion, flag = util2.flag;
        var assert2 = chai2.assert = function(express, errmsg) {
          var test = new Assertion2(null, null, chai2.assert, true);
          test.assert(
            express,
            errmsg,
            "[ negation message unavailable ]"
          );
        };
        assert2.fail = function(actual, expected, message, operator) {
          if (arguments.length < 2) {
            message = actual;
            actual = void 0;
          }
          message = message || "assert.fail()";
          throw new chai2.AssertionError(message, {
            actual,
            expected,
            operator
          }, assert2.fail);
        };
        assert2.isOk = function(val, msg) {
          new Assertion2(val, msg, assert2.isOk, true).is.ok;
        };
        assert2.isNotOk = function(val, msg) {
          new Assertion2(val, msg, assert2.isNotOk, true).is.not.ok;
        };
        assert2.equal = function(act, exp, msg) {
          var test = new Assertion2(act, msg, assert2.equal, true);
          test.assert(
            exp == flag(test, "object"),
            "expected #{this} to equal #{exp}",
            "expected #{this} to not equal #{act}",
            exp,
            act,
            true
          );
        };
        assert2.notEqual = function(act, exp, msg) {
          var test = new Assertion2(act, msg, assert2.notEqual, true);
          test.assert(
            exp != flag(test, "object"),
            "expected #{this} to not equal #{exp}",
            "expected #{this} to equal #{act}",
            exp,
            act,
            true
          );
        };
        assert2.strictEqual = function(act, exp, msg) {
          new Assertion2(act, msg, assert2.strictEqual, true).to.equal(exp);
        };
        assert2.notStrictEqual = function(act, exp, msg) {
          new Assertion2(act, msg, assert2.notStrictEqual, true).to.not.equal(exp);
        };
        assert2.deepEqual = assert2.deepStrictEqual = function(act, exp, msg) {
          new Assertion2(act, msg, assert2.deepEqual, true).to.eql(exp);
        };
        assert2.notDeepEqual = function(act, exp, msg) {
          new Assertion2(act, msg, assert2.notDeepEqual, true).to.not.eql(exp);
        };
        assert2.isAbove = function(val, abv, msg) {
          new Assertion2(val, msg, assert2.isAbove, true).to.be.above(abv);
        };
        assert2.isAtLeast = function(val, atlst, msg) {
          new Assertion2(val, msg, assert2.isAtLeast, true).to.be.least(atlst);
        };
        assert2.isBelow = function(val, blw, msg) {
          new Assertion2(val, msg, assert2.isBelow, true).to.be.below(blw);
        };
        assert2.isAtMost = function(val, atmst, msg) {
          new Assertion2(val, msg, assert2.isAtMost, true).to.be.most(atmst);
        };
        assert2.isTrue = function(val, msg) {
          new Assertion2(val, msg, assert2.isTrue, true).is["true"];
        };
        assert2.isNotTrue = function(val, msg) {
          new Assertion2(val, msg, assert2.isNotTrue, true).to.not.equal(true);
        };
        assert2.isFalse = function(val, msg) {
          new Assertion2(val, msg, assert2.isFalse, true).is["false"];
        };
        assert2.isNotFalse = function(val, msg) {
          new Assertion2(val, msg, assert2.isNotFalse, true).to.not.equal(false);
        };
        assert2.isNull = function(val, msg) {
          new Assertion2(val, msg, assert2.isNull, true).to.equal(null);
        };
        assert2.isNotNull = function(val, msg) {
          new Assertion2(val, msg, assert2.isNotNull, true).to.not.equal(null);
        };
        assert2.isNaN = function(val, msg) {
          new Assertion2(val, msg, assert2.isNaN, true).to.be.NaN;
        };
        assert2.isNotNaN = function(val, msg) {
          new Assertion2(val, msg, assert2.isNotNaN, true).not.to.be.NaN;
        };
        assert2.exists = function(val, msg) {
          new Assertion2(val, msg, assert2.exists, true).to.exist;
        };
        assert2.notExists = function(val, msg) {
          new Assertion2(val, msg, assert2.notExists, true).to.not.exist;
        };
        assert2.isUndefined = function(val, msg) {
          new Assertion2(val, msg, assert2.isUndefined, true).to.equal(void 0);
        };
        assert2.isDefined = function(val, msg) {
          new Assertion2(val, msg, assert2.isDefined, true).to.not.equal(void 0);
        };
        assert2.isFunction = function(val, msg) {
          new Assertion2(val, msg, assert2.isFunction, true).to.be.a("function");
        };
        assert2.isNotFunction = function(val, msg) {
          new Assertion2(val, msg, assert2.isNotFunction, true).to.not.be.a("function");
        };
        assert2.isObject = function(val, msg) {
          new Assertion2(val, msg, assert2.isObject, true).to.be.a("object");
        };
        assert2.isNotObject = function(val, msg) {
          new Assertion2(val, msg, assert2.isNotObject, true).to.not.be.a("object");
        };
        assert2.isArray = function(val, msg) {
          new Assertion2(val, msg, assert2.isArray, true).to.be.an("array");
        };
        assert2.isNotArray = function(val, msg) {
          new Assertion2(val, msg, assert2.isNotArray, true).to.not.be.an("array");
        };
        assert2.isString = function(val, msg) {
          new Assertion2(val, msg, assert2.isString, true).to.be.a("string");
        };
        assert2.isNotString = function(val, msg) {
          new Assertion2(val, msg, assert2.isNotString, true).to.not.be.a("string");
        };
        assert2.isNumber = function(val, msg) {
          new Assertion2(val, msg, assert2.isNumber, true).to.be.a("number");
        };
        assert2.isNotNumber = function(val, msg) {
          new Assertion2(val, msg, assert2.isNotNumber, true).to.not.be.a("number");
        };
        assert2.isFinite = function(val, msg) {
          new Assertion2(val, msg, assert2.isFinite, true).to.be.finite;
        };
        assert2.isBoolean = function(val, msg) {
          new Assertion2(val, msg, assert2.isBoolean, true).to.be.a("boolean");
        };
        assert2.isNotBoolean = function(val, msg) {
          new Assertion2(val, msg, assert2.isNotBoolean, true).to.not.be.a("boolean");
        };
        assert2.typeOf = function(val, type, msg) {
          new Assertion2(val, msg, assert2.typeOf, true).to.be.a(type);
        };
        assert2.notTypeOf = function(val, type, msg) {
          new Assertion2(val, msg, assert2.notTypeOf, true).to.not.be.a(type);
        };
        assert2.instanceOf = function(val, type, msg) {
          new Assertion2(val, msg, assert2.instanceOf, true).to.be.instanceOf(type);
        };
        assert2.notInstanceOf = function(val, type, msg) {
          new Assertion2(val, msg, assert2.notInstanceOf, true).to.not.be.instanceOf(type);
        };
        assert2.include = function(exp, inc, msg) {
          new Assertion2(exp, msg, assert2.include, true).include(inc);
        };
        assert2.notInclude = function(exp, inc, msg) {
          new Assertion2(exp, msg, assert2.notInclude, true).not.include(inc);
        };
        assert2.deepInclude = function(exp, inc, msg) {
          new Assertion2(exp, msg, assert2.deepInclude, true).deep.include(inc);
        };
        assert2.notDeepInclude = function(exp, inc, msg) {
          new Assertion2(exp, msg, assert2.notDeepInclude, true).not.deep.include(inc);
        };
        assert2.nestedInclude = function(exp, inc, msg) {
          new Assertion2(exp, msg, assert2.nestedInclude, true).nested.include(inc);
        };
        assert2.notNestedInclude = function(exp, inc, msg) {
          new Assertion2(exp, msg, assert2.notNestedInclude, true).not.nested.include(inc);
        };
        assert2.deepNestedInclude = function(exp, inc, msg) {
          new Assertion2(exp, msg, assert2.deepNestedInclude, true).deep.nested.include(inc);
        };
        assert2.notDeepNestedInclude = function(exp, inc, msg) {
          new Assertion2(exp, msg, assert2.notDeepNestedInclude, true).not.deep.nested.include(inc);
        };
        assert2.ownInclude = function(exp, inc, msg) {
          new Assertion2(exp, msg, assert2.ownInclude, true).own.include(inc);
        };
        assert2.notOwnInclude = function(exp, inc, msg) {
          new Assertion2(exp, msg, assert2.notOwnInclude, true).not.own.include(inc);
        };
        assert2.deepOwnInclude = function(exp, inc, msg) {
          new Assertion2(exp, msg, assert2.deepOwnInclude, true).deep.own.include(inc);
        };
        assert2.notDeepOwnInclude = function(exp, inc, msg) {
          new Assertion2(exp, msg, assert2.notDeepOwnInclude, true).not.deep.own.include(inc);
        };
        assert2.match = function(exp, re, msg) {
          new Assertion2(exp, msg, assert2.match, true).to.match(re);
        };
        assert2.notMatch = function(exp, re, msg) {
          new Assertion2(exp, msg, assert2.notMatch, true).to.not.match(re);
        };
        assert2.property = function(obj, prop, msg) {
          new Assertion2(obj, msg, assert2.property, true).to.have.property(prop);
        };
        assert2.notProperty = function(obj, prop, msg) {
          new Assertion2(obj, msg, assert2.notProperty, true).to.not.have.property(prop);
        };
        assert2.propertyVal = function(obj, prop, val, msg) {
          new Assertion2(obj, msg, assert2.propertyVal, true).to.have.property(prop, val);
        };
        assert2.notPropertyVal = function(obj, prop, val, msg) {
          new Assertion2(obj, msg, assert2.notPropertyVal, true).to.not.have.property(prop, val);
        };
        assert2.deepPropertyVal = function(obj, prop, val, msg) {
          new Assertion2(obj, msg, assert2.deepPropertyVal, true).to.have.deep.property(prop, val);
        };
        assert2.notDeepPropertyVal = function(obj, prop, val, msg) {
          new Assertion2(obj, msg, assert2.notDeepPropertyVal, true).to.not.have.deep.property(prop, val);
        };
        assert2.ownProperty = function(obj, prop, msg) {
          new Assertion2(obj, msg, assert2.ownProperty, true).to.have.own.property(prop);
        };
        assert2.notOwnProperty = function(obj, prop, msg) {
          new Assertion2(obj, msg, assert2.notOwnProperty, true).to.not.have.own.property(prop);
        };
        assert2.ownPropertyVal = function(obj, prop, value, msg) {
          new Assertion2(obj, msg, assert2.ownPropertyVal, true).to.have.own.property(prop, value);
        };
        assert2.notOwnPropertyVal = function(obj, prop, value, msg) {
          new Assertion2(obj, msg, assert2.notOwnPropertyVal, true).to.not.have.own.property(prop, value);
        };
        assert2.deepOwnPropertyVal = function(obj, prop, value, msg) {
          new Assertion2(obj, msg, assert2.deepOwnPropertyVal, true).to.have.deep.own.property(prop, value);
        };
        assert2.notDeepOwnPropertyVal = function(obj, prop, value, msg) {
          new Assertion2(obj, msg, assert2.notDeepOwnPropertyVal, true).to.not.have.deep.own.property(prop, value);
        };
        assert2.nestedProperty = function(obj, prop, msg) {
          new Assertion2(obj, msg, assert2.nestedProperty, true).to.have.nested.property(prop);
        };
        assert2.notNestedProperty = function(obj, prop, msg) {
          new Assertion2(obj, msg, assert2.notNestedProperty, true).to.not.have.nested.property(prop);
        };
        assert2.nestedPropertyVal = function(obj, prop, val, msg) {
          new Assertion2(obj, msg, assert2.nestedPropertyVal, true).to.have.nested.property(prop, val);
        };
        assert2.notNestedPropertyVal = function(obj, prop, val, msg) {
          new Assertion2(obj, msg, assert2.notNestedPropertyVal, true).to.not.have.nested.property(prop, val);
        };
        assert2.deepNestedPropertyVal = function(obj, prop, val, msg) {
          new Assertion2(obj, msg, assert2.deepNestedPropertyVal, true).to.have.deep.nested.property(prop, val);
        };
        assert2.notDeepNestedPropertyVal = function(obj, prop, val, msg) {
          new Assertion2(obj, msg, assert2.notDeepNestedPropertyVal, true).to.not.have.deep.nested.property(prop, val);
        };
        assert2.lengthOf = function(exp, len, msg) {
          new Assertion2(exp, msg, assert2.lengthOf, true).to.have.lengthOf(len);
        };
        assert2.hasAnyKeys = function(obj, keys, msg) {
          new Assertion2(obj, msg, assert2.hasAnyKeys, true).to.have.any.keys(keys);
        };
        assert2.hasAllKeys = function(obj, keys, msg) {
          new Assertion2(obj, msg, assert2.hasAllKeys, true).to.have.all.keys(keys);
        };
        assert2.containsAllKeys = function(obj, keys, msg) {
          new Assertion2(obj, msg, assert2.containsAllKeys, true).to.contain.all.keys(keys);
        };
        assert2.doesNotHaveAnyKeys = function(obj, keys, msg) {
          new Assertion2(obj, msg, assert2.doesNotHaveAnyKeys, true).to.not.have.any.keys(keys);
        };
        assert2.doesNotHaveAllKeys = function(obj, keys, msg) {
          new Assertion2(obj, msg, assert2.doesNotHaveAllKeys, true).to.not.have.all.keys(keys);
        };
        assert2.hasAnyDeepKeys = function(obj, keys, msg) {
          new Assertion2(obj, msg, assert2.hasAnyDeepKeys, true).to.have.any.deep.keys(keys);
        };
        assert2.hasAllDeepKeys = function(obj, keys, msg) {
          new Assertion2(obj, msg, assert2.hasAllDeepKeys, true).to.have.all.deep.keys(keys);
        };
        assert2.containsAllDeepKeys = function(obj, keys, msg) {
          new Assertion2(obj, msg, assert2.containsAllDeepKeys, true).to.contain.all.deep.keys(keys);
        };
        assert2.doesNotHaveAnyDeepKeys = function(obj, keys, msg) {
          new Assertion2(obj, msg, assert2.doesNotHaveAnyDeepKeys, true).to.not.have.any.deep.keys(keys);
        };
        assert2.doesNotHaveAllDeepKeys = function(obj, keys, msg) {
          new Assertion2(obj, msg, assert2.doesNotHaveAllDeepKeys, true).to.not.have.all.deep.keys(keys);
        };
        assert2.throws = function(fn, errorLike, errMsgMatcher, msg) {
          if ("string" === typeof errorLike || errorLike instanceof RegExp) {
            errMsgMatcher = errorLike;
            errorLike = null;
          }
          var assertErr = new Assertion2(fn, msg, assert2.throws, true).to.throw(errorLike, errMsgMatcher);
          return flag(assertErr, "object");
        };
        assert2.doesNotThrow = function(fn, errorLike, errMsgMatcher, msg) {
          if ("string" === typeof errorLike || errorLike instanceof RegExp) {
            errMsgMatcher = errorLike;
            errorLike = null;
          }
          new Assertion2(fn, msg, assert2.doesNotThrow, true).to.not.throw(errorLike, errMsgMatcher);
        };
        assert2.operator = function(val, operator, val2, msg) {
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
              throw new chai2.AssertionError(
                msg + 'Invalid operator "' + operator + '"',
                void 0,
                assert2.operator
              );
          }
          var test = new Assertion2(ok, msg, assert2.operator, true);
          test.assert(
            true === flag(test, "object"),
            "expected " + util2.inspect(val) + " to be " + operator + " " + util2.inspect(val2),
            "expected " + util2.inspect(val) + " to not be " + operator + " " + util2.inspect(val2)
          );
        };
        assert2.closeTo = function(act, exp, delta, msg) {
          new Assertion2(act, msg, assert2.closeTo, true).to.be.closeTo(exp, delta);
        };
        assert2.approximately = function(act, exp, delta, msg) {
          new Assertion2(act, msg, assert2.approximately, true).to.be.approximately(exp, delta);
        };
        assert2.sameMembers = function(set1, set2, msg) {
          new Assertion2(set1, msg, assert2.sameMembers, true).to.have.same.members(set2);
        };
        assert2.notSameMembers = function(set1, set2, msg) {
          new Assertion2(set1, msg, assert2.notSameMembers, true).to.not.have.same.members(set2);
        };
        assert2.sameDeepMembers = function(set1, set2, msg) {
          new Assertion2(set1, msg, assert2.sameDeepMembers, true).to.have.same.deep.members(set2);
        };
        assert2.notSameDeepMembers = function(set1, set2, msg) {
          new Assertion2(set1, msg, assert2.notSameDeepMembers, true).to.not.have.same.deep.members(set2);
        };
        assert2.sameOrderedMembers = function(set1, set2, msg) {
          new Assertion2(set1, msg, assert2.sameOrderedMembers, true).to.have.same.ordered.members(set2);
        };
        assert2.notSameOrderedMembers = function(set1, set2, msg) {
          new Assertion2(set1, msg, assert2.notSameOrderedMembers, true).to.not.have.same.ordered.members(set2);
        };
        assert2.sameDeepOrderedMembers = function(set1, set2, msg) {
          new Assertion2(set1, msg, assert2.sameDeepOrderedMembers, true).to.have.same.deep.ordered.members(set2);
        };
        assert2.notSameDeepOrderedMembers = function(set1, set2, msg) {
          new Assertion2(set1, msg, assert2.notSameDeepOrderedMembers, true).to.not.have.same.deep.ordered.members(set2);
        };
        assert2.includeMembers = function(superset, subset, msg) {
          new Assertion2(superset, msg, assert2.includeMembers, true).to.include.members(subset);
        };
        assert2.notIncludeMembers = function(superset, subset, msg) {
          new Assertion2(superset, msg, assert2.notIncludeMembers, true).to.not.include.members(subset);
        };
        assert2.includeDeepMembers = function(superset, subset, msg) {
          new Assertion2(superset, msg, assert2.includeDeepMembers, true).to.include.deep.members(subset);
        };
        assert2.notIncludeDeepMembers = function(superset, subset, msg) {
          new Assertion2(superset, msg, assert2.notIncludeDeepMembers, true).to.not.include.deep.members(subset);
        };
        assert2.includeOrderedMembers = function(superset, subset, msg) {
          new Assertion2(superset, msg, assert2.includeOrderedMembers, true).to.include.ordered.members(subset);
        };
        assert2.notIncludeOrderedMembers = function(superset, subset, msg) {
          new Assertion2(superset, msg, assert2.notIncludeOrderedMembers, true).to.not.include.ordered.members(subset);
        };
        assert2.includeDeepOrderedMembers = function(superset, subset, msg) {
          new Assertion2(superset, msg, assert2.includeDeepOrderedMembers, true).to.include.deep.ordered.members(subset);
        };
        assert2.notIncludeDeepOrderedMembers = function(superset, subset, msg) {
          new Assertion2(superset, msg, assert2.notIncludeDeepOrderedMembers, true).to.not.include.deep.ordered.members(subset);
        };
        assert2.oneOf = function(inList, list, msg) {
          new Assertion2(inList, msg, assert2.oneOf, true).to.be.oneOf(list);
        };
        assert2.changes = function(fn, obj, prop, msg) {
          if (arguments.length === 3 && typeof obj === "function") {
            msg = prop;
            prop = null;
          }
          new Assertion2(fn, msg, assert2.changes, true).to.change(obj, prop);
        };
        assert2.changesBy = function(fn, obj, prop, delta, msg) {
          if (arguments.length === 4 && typeof obj === "function") {
            var tmpMsg = delta;
            delta = prop;
            msg = tmpMsg;
          } else if (arguments.length === 3) {
            delta = prop;
            prop = null;
          }
          new Assertion2(fn, msg, assert2.changesBy, true).to.change(obj, prop).by(delta);
        };
        assert2.doesNotChange = function(fn, obj, prop, msg) {
          if (arguments.length === 3 && typeof obj === "function") {
            msg = prop;
            prop = null;
          }
          return new Assertion2(fn, msg, assert2.doesNotChange, true).to.not.change(obj, prop);
        };
        assert2.changesButNotBy = function(fn, obj, prop, delta, msg) {
          if (arguments.length === 4 && typeof obj === "function") {
            var tmpMsg = delta;
            delta = prop;
            msg = tmpMsg;
          } else if (arguments.length === 3) {
            delta = prop;
            prop = null;
          }
          new Assertion2(fn, msg, assert2.changesButNotBy, true).to.change(obj, prop).but.not.by(delta);
        };
        assert2.increases = function(fn, obj, prop, msg) {
          if (arguments.length === 3 && typeof obj === "function") {
            msg = prop;
            prop = null;
          }
          return new Assertion2(fn, msg, assert2.increases, true).to.increase(obj, prop);
        };
        assert2.increasesBy = function(fn, obj, prop, delta, msg) {
          if (arguments.length === 4 && typeof obj === "function") {
            var tmpMsg = delta;
            delta = prop;
            msg = tmpMsg;
          } else if (arguments.length === 3) {
            delta = prop;
            prop = null;
          }
          new Assertion2(fn, msg, assert2.increasesBy, true).to.increase(obj, prop).by(delta);
        };
        assert2.doesNotIncrease = function(fn, obj, prop, msg) {
          if (arguments.length === 3 && typeof obj === "function") {
            msg = prop;
            prop = null;
          }
          return new Assertion2(fn, msg, assert2.doesNotIncrease, true).to.not.increase(obj, prop);
        };
        assert2.increasesButNotBy = function(fn, obj, prop, delta, msg) {
          if (arguments.length === 4 && typeof obj === "function") {
            var tmpMsg = delta;
            delta = prop;
            msg = tmpMsg;
          } else if (arguments.length === 3) {
            delta = prop;
            prop = null;
          }
          new Assertion2(fn, msg, assert2.increasesButNotBy, true).to.increase(obj, prop).but.not.by(delta);
        };
        assert2.decreases = function(fn, obj, prop, msg) {
          if (arguments.length === 3 && typeof obj === "function") {
            msg = prop;
            prop = null;
          }
          return new Assertion2(fn, msg, assert2.decreases, true).to.decrease(obj, prop);
        };
        assert2.decreasesBy = function(fn, obj, prop, delta, msg) {
          if (arguments.length === 4 && typeof obj === "function") {
            var tmpMsg = delta;
            delta = prop;
            msg = tmpMsg;
          } else if (arguments.length === 3) {
            delta = prop;
            prop = null;
          }
          new Assertion2(fn, msg, assert2.decreasesBy, true).to.decrease(obj, prop).by(delta);
        };
        assert2.doesNotDecrease = function(fn, obj, prop, msg) {
          if (arguments.length === 3 && typeof obj === "function") {
            msg = prop;
            prop = null;
          }
          return new Assertion2(fn, msg, assert2.doesNotDecrease, true).to.not.decrease(obj, prop);
        };
        assert2.doesNotDecreaseBy = function(fn, obj, prop, delta, msg) {
          if (arguments.length === 4 && typeof obj === "function") {
            var tmpMsg = delta;
            delta = prop;
            msg = tmpMsg;
          } else if (arguments.length === 3) {
            delta = prop;
            prop = null;
          }
          return new Assertion2(fn, msg, assert2.doesNotDecreaseBy, true).to.not.decrease(obj, prop).by(delta);
        };
        assert2.decreasesButNotBy = function(fn, obj, prop, delta, msg) {
          if (arguments.length === 4 && typeof obj === "function") {
            var tmpMsg = delta;
            delta = prop;
            msg = tmpMsg;
          } else if (arguments.length === 3) {
            delta = prop;
            prop = null;
          }
          new Assertion2(fn, msg, assert2.decreasesButNotBy, true).to.decrease(obj, prop).but.not.by(delta);
        };
        assert2.ifError = function(val) {
          if (val) {
            throw val;
          }
        };
        assert2.isExtensible = function(obj, msg) {
          new Assertion2(obj, msg, assert2.isExtensible, true).to.be.extensible;
        };
        assert2.isNotExtensible = function(obj, msg) {
          new Assertion2(obj, msg, assert2.isNotExtensible, true).to.not.be.extensible;
        };
        assert2.isSealed = function(obj, msg) {
          new Assertion2(obj, msg, assert2.isSealed, true).to.be.sealed;
        };
        assert2.isNotSealed = function(obj, msg) {
          new Assertion2(obj, msg, assert2.isNotSealed, true).to.not.be.sealed;
        };
        assert2.isFrozen = function(obj, msg) {
          new Assertion2(obj, msg, assert2.isFrozen, true).to.be.frozen;
        };
        assert2.isNotFrozen = function(obj, msg) {
          new Assertion2(obj, msg, assert2.isNotFrozen, true).to.not.be.frozen;
        };
        assert2.isEmpty = function(val, msg) {
          new Assertion2(val, msg, assert2.isEmpty, true).to.be.empty;
        };
        assert2.isNotEmpty = function(val, msg) {
          new Assertion2(val, msg, assert2.isNotEmpty, true).to.not.be.empty;
        };
        (function alias(name, as) {
          assert2[as] = assert2[name];
          return alias;
        })("isOk", "ok")("isNotOk", "notOk")("throws", "throw")("throws", "Throw")("isExtensible", "extensible")("isNotExtensible", "notExtensible")("isSealed", "sealed")("isNotSealed", "notSealed")("isFrozen", "frozen")("isNotFrozen", "notFrozen")("isEmpty", "empty")("isNotEmpty", "notEmpty");
      };
    }
  });

  // node_modules/chai/lib/chai.js
  var require_chai = __commonJS({
    "node_modules/chai/lib/chai.js"(exports) {
      "use strict";
      var used = [];
      exports.version = "4.3.8";
      exports.AssertionError = require_assertion_error();
      var util2 = require_utils();
      exports.use = function(fn) {
        if (!~used.indexOf(fn)) {
          fn(exports, util2);
          used.push(fn);
        }
        return exports;
      };
      exports.util = util2;
      var config2 = require_config();
      exports.config = config2;
      var assertion = require_assertion();
      exports.use(assertion);
      var core2 = require_assertions();
      exports.use(core2);
      var expect2 = require_expect();
      exports.use(expect2);
      var should2 = require_should();
      exports.use(should2);
      var assert2 = require_assert();
      exports.use(assert2);
    }
  });

  // node_modules/chai/index.js
  var require_chai2 = __commonJS({
    "node_modules/chai/index.js"(exports, module) {
      "use strict";
      module.exports = require_chai();
    }
  });

  // node_modules/chai/index.mjs
  var import_index = __toESM(require_chai2(), 1);
  var expect = import_index.default.expect;
  var version = import_index.default.version;
  var Assertion = import_index.default.Assertion;
  var AssertionError = import_index.default.AssertionError;
  var util = import_index.default.util;
  var config = import_index.default.config;
  var use = import_index.default.use;
  var should = import_index.default.should;
  var assert = import_index.default.assert;
  var core = import_index.default.core;

  // src/sensors/sensor.ts
  var SensorEventType = {
    start: "start",
    move: "move",
    cancel: "cancel",
    end: "end",
    destroy: "destroy"
  };

  // node_modules/eventti/dist/eventti.js
  function getOrCreateEventData(e, t) {
    let i = e.get(t);
    return i || (i = new EventData(), e.set(t, i)), i;
  }
  var EventData = class {
    constructor() {
      this.idMap = /* @__PURE__ */ new Map(), this.fnMap = /* @__PURE__ */ new Map(), this.onceList = /* @__PURE__ */ new Set(), this.emitList = null;
    }
    add(e, t, i, s, n) {
      if (!n && this.fnMap.has(e))
        throw new Error("Emitter: tried to add an existing event listener to an event!");
      if (this.idMap.has(i))
        switch (s) {
          case "throw":
            throw new Error("Emitter: tried to add an existing event listener id to an event!");
          case "ignore":
            return i;
          default:
            this.delId(i, "update" === s);
        }
      let r = this.fnMap.get(e);
      return r || (r = /* @__PURE__ */ new Set(), this.fnMap.set(e, r)), r.add(i), this.idMap.set(i, e), t && this.onceList.add(i), this.emitList && this.emitList.push(e), i;
    }
    delId(e, t = false) {
      const i = this.idMap.get(e);
      if (!i)
        return;
      const s = this.fnMap.get(i);
      t || this.idMap.delete(e), this.onceList.delete(e), s.delete(e), s.size || this.fnMap.delete(i), this.emitList = null;
    }
    delFn(e) {
      const t = this.fnMap.get(e);
      t && (t.forEach((e2) => {
        this.onceList.delete(e2), this.idMap.delete(e2);
      }), this.fnMap.delete(e), this.emitList = null);
    }
  };
  var Emitter = class {
    constructor(e = {}) {
      const { idDedupeMode: t = "replace", allowDuplicateListeners: i = true } = e;
      this.idDedupeMode = t, this.allowDuplicateListeners = i, this._events = /* @__PURE__ */ new Map();
    }
    _getListeners(e) {
      const t = this._events.get(e);
      if (!t)
        return null;
      const { idMap: i, onceList: s } = t;
      if (!i.size)
        return null;
      const n = t.emitList || [...i.values()];
      if (s.size)
        if (s.size === i.size)
          this._events.delete(e);
        else
          for (const e2 of s)
            t.delId(e2);
      else
        t.emitList = n;
      return n;
    }
    on(e, t, i = Symbol()) {
      return getOrCreateEventData(this._events, e).add(t, false, i, this.idDedupeMode, this.allowDuplicateListeners);
    }
    once(e, t, i = Symbol()) {
      return getOrCreateEventData(this._events, e).add(t, true, i, this.idDedupeMode, this.allowDuplicateListeners);
    }
    off(e, t) {
      if (void 0 === e)
        return void this._events.clear();
      if (void 0 === t)
        return void this._events.delete(e);
      const i = this._events.get(e);
      i && ("function" == typeof t ? i.delFn(t) : i.delId(t), i.idMap.size || this._events.delete(e));
    }
    emit(e, ...t) {
      const i = this._getListeners(e);
      if (!i)
        return;
      let s = 0, n = i.length;
      for (; s < n; s++)
        i[s](...t);
    }
    listenerCount(e) {
      var t;
      if (void 0 === e) {
        let e2 = 0;
        return this._events.forEach((t2, i) => {
          e2 += this.listenerCount(i);
        }), e2;
      }
      return (null === (t = this._events.get(e)) || void 0 === t ? void 0 : t.idMap.size) || 0;
    }
  };

  // src/sensors/base-sensor.ts
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
      if (!this.drag)
        return;
      this.drag.x = data.x;
      this.drag.y = data.y;
    }
    _resetDragData() {
      this.drag = null;
    }
    _start(data) {
      if (this.isDestroyed || this.drag)
        return;
      this.drag = this._createDragData(data);
      this._emitter.emit(SensorEventType.start, data);
    }
    _move(data) {
      if (!this.drag)
        return;
      this._updateDragData(data);
      this._emitter.emit(SensorEventType.move, data);
    }
    _end(data) {
      if (!this.drag)
        return;
      this._updateDragData(data);
      this._emitter.emit(SensorEventType.end, data);
      this._resetDragData();
    }
    _cancel(data) {
      if (!this.drag)
        return;
      this._updateDragData(data);
      this._emitter.emit(SensorEventType.cancel, data);
      this._resetDragData();
    }
    on(eventName, listener, listenerId) {
      return this._emitter.on(eventName, listener, listenerId);
    }
    off(eventName, listener) {
      this._emitter.off(eventName, listener);
    }
    cancel() {
      if (!this.drag)
        return;
      this._emitter.emit(SensorEventType.cancel, {
        type: SensorEventType.cancel,
        x: this.drag.x,
        y: this.drag.y
      });
      this._resetDragData();
    }
    destroy() {
      if (this.isDestroyed)
        return;
      this.isDestroyed = true;
      this.cancel();
      this._emitter.emit(SensorEventType.destroy, {
        type: SensorEventType.destroy
      });
      this._emitter.off();
    }
  };

  // node_modules/tikki/dist/tikki.js
  function createRequestFrame(e = 60) {
    if ("function" == typeof requestAnimationFrame && "function" == typeof cancelAnimationFrame)
      return (e2) => {
        const t = requestAnimationFrame(e2);
        return () => cancelAnimationFrame(t);
      };
    {
      const t = 1e3 / e, i = "undefined" == typeof performance ? () => Date.now() : () => performance.now();
      return (e2) => {
        const r = setTimeout(() => e2(i()), t);
        return () => clearTimeout(r);
      };
    }
  }
  var AutoTickState;
  !function(e) {
    e[e.PAUSED = 1] = "PAUSED", e[e.ON_DEMAND = 2] = "ON_DEMAND", e[e.CONTINUOUS = 3] = "CONTINUOUS";
  }(AutoTickState || (AutoTickState = {}));
  var Ticker = class {
    constructor(e = {}) {
      const { phases: t = [], autoTick: i = AutoTickState.ON_DEMAND, allowDuplicateListeners: r = true, idDedupeMode: s = "replace", requestFrame: n = createRequestFrame() } = e;
      this.phases = t, this._autoTick = i, this._requestFrame = n, this._cancelFrame = null, this._queue = [], this._emitter = new Emitter({ allowDuplicateListeners: r, idDedupeMode: s }), this.tick = this.tick.bind(this);
    }
    get requestFrame() {
      return this._requestFrame;
    }
    set requestFrame(e) {
      this._requestFrame = e, this._kickstart();
    }
    get autoTick() {
      return this._autoTick;
    }
    set autoTick(e) {
      this._autoTick = e, this._kickstart();
    }
    get allowDuplicateListeners() {
      return this._emitter.allowDuplicateListeners;
    }
    set allowDuplicateListeners(e) {
      this._emitter.allowDuplicateListeners = e;
    }
    get idDedupeMode() {
      return this._emitter.idDedupeMode;
    }
    set idDedupeMode(e) {
      this._emitter.idDedupeMode = e;
    }
    tick(...e) {
      this._cancelFrame = null;
      const { _queue: t } = this;
      if (t.length)
        throw new Error("Ticker: Can't tick before the previous tick has finished!");
      this._request();
      const { phases: i, _emitter: r } = this;
      let s, n, a, c, u, o;
      for (s = 0, a = i.length; s < a; s++)
        o = r._getListeners(i[s]), o && t.push(o);
      for (s = 0, a = t.length; s < a; s++)
        for (u = t[s], n = 0, c = u.length; n < c; n++)
          u[n](...e);
      t.length = 0, this._autoTick !== AutoTickState.ON_DEMAND || r.listenerCount() || this._cancel();
    }
    on(e, t, i) {
      const r = this._emitter.on(e, t, i);
      return this._request(), r;
    }
    once(e, t, i) {
      const r = this._emitter.once(e, t, i);
      return this._request(), r;
    }
    off(e, t) {
      return this._emitter.off(e, t);
    }
    listenerCount(e) {
      return this._emitter.listenerCount(e);
    }
    _request() {
      this._requestFrame && !this._cancelFrame && this._autoTick >= AutoTickState.ON_DEMAND && (this._cancelFrame = this._requestFrame(this.tick));
    }
    _cancel() {
      this._cancelFrame && (this._cancelFrame(), this._cancelFrame = null);
    }
    _kickstart() {
      this._autoTick === AutoTickState.ON_DEMAND ? this._emitter.listenerCount() && this._request() : this._autoTick === AutoTickState.CONTINUOUS ? this._request() : this._cancel();
    }
  };

  // src/singletons/ticker.ts
  var tickerReadPhase = Symbol();
  var tickerWritePhase = Symbol();
  var ticker = new Ticker({ phases: [tickerReadPhase, tickerWritePhase] });

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
    if ("pointerId" in e)
      return e.pointerId;
    if ("changedTouches" in e)
      return e.changedTouches[0] ? e.changedTouches[0].identifier : null;
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
      this._emitter = new Emitter();
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
      if (this.isDestroyed || this.drag)
        return;
      if (!this._startPredicate(e))
        return;
      const pointerId = getPointerId(e);
      if (pointerId === null)
        return;
      const pointerEventData = getPointerEventData(e, pointerId);
      if (pointerEventData === null)
        return;
      const dragData = {
        pointerId,
        pointerType: getPointerType(e),
        x: pointerEventData.clientX,
        y: pointerEventData.clientY
      };
      this.drag = dragData;
      const eventData = {
        ...dragData,
        type: SensorEventType.start,
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
      if (!this.drag)
        return;
      const pointerEventData = this._getTrackedPointerEventData(e);
      if (!pointerEventData)
        return;
      this.drag.x = pointerEventData.clientX;
      this.drag.y = pointerEventData.clientY;
      const eventData = {
        type: SensorEventType.move,
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
      if (!this.drag)
        return;
      const pointerEventData = this._getTrackedPointerEventData(e);
      if (!pointerEventData)
        return;
      this.drag.x = pointerEventData.clientX;
      this.drag.y = pointerEventData.clientY;
      const eventData = {
        type: SensorEventType.cancel,
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
      if (!this.drag)
        return;
      const pointerEventData = this._getTrackedPointerEventData(e);
      if (!pointerEventData)
        return;
      this.drag.x = pointerEventData.clientX;
      this.drag.y = pointerEventData.clientY;
      const eventData = {
        type: SensorEventType.end,
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
      if (this._areWindowListenersBound)
        return;
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
      if (!this.drag)
        return;
      const eventData = {
        type: SensorEventType.cancel,
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
      if (this.isDestroyed)
        return;
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
    on(eventName, listener, listenerId) {
      return this._emitter.on(eventName, listener, listenerId);
    }
    /**
     * Unbind a drag event listener.
     */
    off(eventName, listener) {
      this._emitter.off(eventName, listener);
    }
    /**
     * Destroy the instance and unbind all drag event listeners.
     */
    destroy() {
      if (this.isDestroyed)
        return;
      this.isDestroyed = true;
      this.cancel();
      this._emitter.emit(SensorEventType.destroy, {
        type: SensorEventType.destroy
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
  var KeyboardSensor = class extends BaseSensor {
    constructor(options = {}) {
      super();
      const {
        moveDistance = 25,
        startPredicate = (e) => {
          if (e.key === "Enter" || e.key === " ") {
            if (document.activeElement && document.activeElement !== document.body) {
              const { left, top } = document.activeElement.getBoundingClientRect();
              return { x: left, y: top };
            }
          }
          return null;
        },
        movePredicate = (e, sensor, moveDistance2) => {
          if (!sensor.drag)
            return null;
          switch (e.key) {
            case "ArrowLeft": {
              return {
                x: sensor.drag.x - moveDistance2,
                y: sensor.drag.y
              };
            }
            case "ArrowRight": {
              return {
                x: sensor.drag.x + moveDistance2,
                y: sensor.drag.y
              };
            }
            case "ArrowUp": {
              return {
                x: sensor.drag.x,
                y: sensor.drag.y - moveDistance2
              };
            }
            case "ArrowDown": {
              return {
                x: sensor.drag.x,
                y: sensor.drag.y + moveDistance2
              };
            }
            default: {
              return null;
            }
          }
        },
        cancelPredicate = (e, sensor) => {
          if (sensor.drag && e.key === "Escape") {
            return { x: sensor.drag.x, y: sensor.drag.y };
          }
          return null;
        },
        endPredicate = (e, sensor) => {
          if (sensor.drag && (e.key === "Enter" || e.key === " ")) {
            return { x: sensor.drag.x, y: sensor.drag.y };
          }
          return null;
        }
      } = options;
      this._moveDistance = moveDistance;
      this._startPredicate = startPredicate;
      this._movePredicate = movePredicate;
      this._cancelPredicate = cancelPredicate;
      this._endPredicate = endPredicate;
      this.cancel = this.cancel.bind(this);
      this._onKeyDown = this._onKeyDown.bind(this);
      document.addEventListener("keydown", this._onKeyDown);
      window.addEventListener("blur", this.cancel);
      window.addEventListener("visibilitychange", this.cancel);
    }
    _onKeyDown(e) {
      if (!this.drag) {
        const startPosition = this._startPredicate(e, this, this._moveDistance);
        if (startPosition) {
          e.preventDefault();
          this._start({
            type: "start",
            x: startPosition.x,
            y: startPosition.y,
            srcEvent: e
          });
        }
        return;
      }
      const cancelPosition = this._cancelPredicate(e, this, this._moveDistance);
      if (cancelPosition) {
        e.preventDefault();
        this._cancel({
          type: "cancel",
          x: cancelPosition.x,
          y: cancelPosition.y,
          srcEvent: e
        });
        return;
      }
      const endPosition = this._endPredicate(e, this, this._moveDistance);
      if (endPosition) {
        e.preventDefault();
        this._end({
          type: "end",
          x: endPosition.x,
          y: endPosition.y,
          srcEvent: e
        });
        return;
      }
      const movePosition = this._movePredicate(e, this, this._moveDistance);
      if (movePosition) {
        e.preventDefault();
        this._move({
          type: "move",
          x: movePosition.x,
          y: movePosition.y,
          srcEvent: e
        });
        return;
      }
    }
    updateSettings(options = {}) {
      if (options.moveDistance !== void 0) {
        this._moveDistance = options.moveDistance;
      }
      if (options.startPredicate !== void 0) {
        this._startPredicate = options.startPredicate;
      }
      if (options.movePredicate !== void 0) {
        this._movePredicate = options.movePredicate;
      }
      if (options.cancelPredicate !== void 0) {
        this._cancelPredicate = options.cancelPredicate;
      }
      if (options.endPredicate !== void 0) {
        this._endPredicate = options.endPredicate;
      }
    }
    destroy() {
      if (this.isDestroyed)
        return;
      super.destroy();
      document.removeEventListener("keydown", this._onKeyDown);
      window.removeEventListener("blur", this.cancel);
      window.removeEventListener("visibilitychange", this.cancel);
    }
  };

  // node_modules/mezr/dist/esm/utils/getStyle.js
  var STYLE_DECLARATION_CACHE = /* @__PURE__ */ new WeakMap();
  function getStyle(e, t) {
    if (t)
      return window.getComputedStyle(e, t);
    let C = STYLE_DECLARATION_CACHE.get(e)?.deref();
    return C || (C = window.getComputedStyle(e, null), STYLE_DECLARATION_CACHE.set(e, new WeakRef(C))), C;
  }

  // node_modules/mezr/dist/esm/utils/constants.js
  var IS_BROWSER2 = "undefined" != typeof window && void 0 !== window.document;
  var IS_SAFARI2 = !!(IS_BROWSER2 && navigator.vendor && navigator.vendor.indexOf("Apple") > -1 && navigator.userAgent && -1 == navigator.userAgent.indexOf("CriOS") && -1 == navigator.userAgent.indexOf("FxiOS"));
  var BOX_EDGE = { content: "content", padding: "padding", scrollbar: "scrollbar", border: "border", margin: "margin" };
  var INCLUDE_WINDOW_SCROLLBAR = { [BOX_EDGE.content]: false, [BOX_EDGE.padding]: false, [BOX_EDGE.scrollbar]: true, [BOX_EDGE.border]: true, [BOX_EDGE.margin]: true };
  var SCROLLABLE_OVERFLOWS = /* @__PURE__ */ new Set(["auto", "scroll"]);
  var IS_CHROMIUM = (() => {
    try {
      return window.navigator.userAgentData.brands.some(({ brand: n }) => "Chromium" === n);
    } catch (n) {
      return false;
    }
  })();

  // node_modules/mezr/dist/esm/utils/isDocumentElement.js
  function isDocumentElement(e) {
    return e instanceof HTMLHtmlElement;
  }

  // node_modules/mezr/dist/esm/utils/isIntersecting.js
  function isIntersecting(t, e) {
    return !(t.left + t.width <= e.left || e.left + e.width <= t.left || t.top + t.height <= e.top || e.top + e.height <= t.top);
  }

  // node_modules/mezr/dist/esm/utils/getDistanceBetweenPoints.js
  function getDistanceBetweenPoints(t, e, n, o) {
    return Math.sqrt(Math.pow(n - t, 2) + Math.pow(o - e, 2));
  }

  // node_modules/mezr/dist/esm/utils/getDistanceBetweenRects.js
  function getDistanceBetweenRects(t, e) {
    if (isIntersecting(t, e))
      return null;
    const n = t.left + t.width, i = t.top + t.height, o = e.left + e.width, s = e.top + e.height;
    return n <= e.left ? i <= e.top ? getDistanceBetweenPoints(n, i, e.left, e.top) : t.top >= s ? getDistanceBetweenPoints(n, t.top, e.left, s) : e.left - n : t.left >= o ? i <= e.top ? getDistanceBetweenPoints(t.left, i, o, e.top) : t.top >= s ? getDistanceBetweenPoints(t.left, t.top, o, s) : t.left - o : i <= e.top ? e.top - i : t.top - s;
  }

  // node_modules/mezr/dist/esm/utils/isWindow.js
  function isWindow(n) {
    return n instanceof Window;
  }

  // node_modules/mezr/dist/esm/utils/isDocument.js
  function isDocument(n) {
    return n instanceof Document;
  }

  // node_modules/mezr/dist/esm/utils/getPreciseScrollbarSize.js
  var SUBPIXEL_OFFSET = /* @__PURE__ */ new Map();
  var testStyleElement = null;
  var testParentElement = null;
  var testChildElement = null;
  function getSubpixelScrollbarSize(t, e) {
    const n = t.split(".");
    let l = SUBPIXEL_OFFSET.get(n[1]);
    if (void 0 === l) {
      testStyleElement || (testStyleElement = document.createElement("style")), testStyleElement.innerHTML = `
      #mezr-scrollbar-test::-webkit-scrollbar {
        width: ${t} !important;
      }
    `, testParentElement && testChildElement || (testParentElement = document.createElement("div"), testChildElement = document.createElement("div"), testParentElement.appendChild(testChildElement), testParentElement.id = "mezr-scrollbar-test", testParentElement.style.cssText = "\n        all: unset !important;\n        position: fixed !important;\n        top: -200px !important;\n        left: 0px !important;\n        width: 100px !important;\n        height: 100px !important;\n        overflow: scroll !important;\n        pointer-events: none !important;\n        visibility: hidden !important;\n      ", testChildElement.style.cssText = "\n        all: unset !important;\n        position: absolute !important;\n        inset: 0 !important;\n      "), document.body.appendChild(testStyleElement), document.body.appendChild(testParentElement);
      l = testParentElement.getBoundingClientRect().width - testChildElement.getBoundingClientRect().width - e, SUBPIXEL_OFFSET.set(n[1], l), document.body.removeChild(testParentElement), document.body.removeChild(testStyleElement);
    }
    return e + l;
  }
  function getPreciseScrollbarSize(t, e, n) {
    if (n <= 0)
      return 0;
    if (IS_CHROMIUM) {
      const n2 = getStyle(t, "::-webkit-scrollbar"), l = "x" === e ? n2.height : n2.width, i = parseFloat(l);
      if (!Number.isNaN(i) && !Number.isInteger(i))
        return getSubpixelScrollbarSize(l, i);
    }
    return n;
  }

  // node_modules/mezr/dist/esm/utils/getWindowWidth.js
  function getWindowWidth(e, r = false) {
    if (r)
      return e.innerWidth;
    const { innerWidth: t, document: i } = e, { documentElement: n } = i, { clientWidth: c } = n;
    return t - getPreciseScrollbarSize(n, "y", t - c);
  }

  // node_modules/mezr/dist/esm/utils/getDocumentWidth.js
  function getDocumentWidth({ documentElement: t }) {
    return Math.max(t.scrollWidth, t.clientWidth, t.getBoundingClientRect().width);
  }

  // node_modules/mezr/dist/esm/utils/getElementWidth.js
  function getElementWidth(t, e = BOX_EDGE.border) {
    let { width: r } = t.getBoundingClientRect();
    if (e === BOX_EDGE.border)
      return r;
    const o = getStyle(t);
    return e === BOX_EDGE.margin ? (r += Math.max(0, parseFloat(o.marginLeft) || 0), r += Math.max(0, parseFloat(o.marginRight) || 0), r) : (r -= parseFloat(o.borderLeftWidth) || 0, r -= parseFloat(o.borderRightWidth) || 0, e === BOX_EDGE.scrollbar ? r : (!isDocumentElement(t) && SCROLLABLE_OVERFLOWS.has(o.overflowY) && (r -= getPreciseScrollbarSize(t, "y", Math.round(r) - t.clientWidth)), e === BOX_EDGE.padding || (r -= parseFloat(o.paddingLeft) || 0, r -= parseFloat(o.paddingRight) || 0), r));
  }

  // node_modules/mezr/dist/esm/getWidth.js
  function getWidth(t, i = BOX_EDGE.border) {
    return isWindow(t) ? getWindowWidth(t, INCLUDE_WINDOW_SCROLLBAR[i]) : isDocument(t) ? getDocumentWidth(t) : getElementWidth(t, i);
  }

  // node_modules/mezr/dist/esm/utils/getWindowHeight.js
  function getWindowHeight(e, r = false) {
    if (r)
      return e.innerHeight;
    const { innerHeight: t, document: i } = e, { documentElement: n } = i, { clientHeight: c } = n;
    return t - getPreciseScrollbarSize(n, "x", t - c);
  }

  // node_modules/mezr/dist/esm/utils/getDocumentHeight.js
  function getDocumentHeight({ documentElement: t }) {
    return Math.max(t.scrollHeight, t.clientHeight, t.getBoundingClientRect().height);
  }

  // node_modules/mezr/dist/esm/utils/getElementHeight.js
  function getElementHeight(t, e = BOX_EDGE.border) {
    let { height: r } = t.getBoundingClientRect();
    if (e === BOX_EDGE.border)
      return r;
    const o = getStyle(t);
    return e === BOX_EDGE.margin ? (r += Math.max(0, parseFloat(o.marginTop) || 0), r += Math.max(0, parseFloat(o.marginBottom) || 0), r) : (r -= parseFloat(o.borderTopWidth) || 0, r -= parseFloat(o.borderBottomWidth) || 0, e === BOX_EDGE.scrollbar ? r : (!isDocumentElement(t) && SCROLLABLE_OVERFLOWS.has(o.overflowX) && (r -= getPreciseScrollbarSize(t, "x", Math.round(r) - t.clientHeight)), e === BOX_EDGE.padding || (r -= parseFloat(o.paddingTop) || 0, r -= parseFloat(o.paddingBottom) || 0), r));
  }

  // node_modules/mezr/dist/esm/getHeight.js
  function getHeight(t, e = BOX_EDGE.border) {
    return isWindow(t) ? getWindowHeight(t, INCLUDE_WINDOW_SCROLLBAR[e]) : isDocument(t) ? getDocumentHeight(t) : getElementHeight(t, e);
  }

  // node_modules/mezr/dist/esm/utils/isRectObject.js
  function isRectObject(t) {
    return t?.constructor === Object;
  }

  // node_modules/mezr/dist/esm/utils/getOffsetFromDocument.js
  function getOffsetFromDocument(t, o = BOX_EDGE.border) {
    const e = { left: 0, top: 0 };
    if (isDocument(t))
      return e;
    if (isWindow(t))
      return e.left += t.scrollX || 0, e.top += t.scrollY || 0, e;
    const r = t.ownerDocument.defaultView;
    r && (e.left += r.scrollX || 0, e.top += r.scrollY || 0);
    const n = t.getBoundingClientRect();
    if (e.left += n.left, e.top += n.top, o === BOX_EDGE.border)
      return e;
    const l = getStyle(t);
    return o === BOX_EDGE.margin ? (e.left -= Math.max(0, parseFloat(l.marginLeft) || 0), e.top -= Math.max(0, parseFloat(l.marginTop) || 0), e) : (e.left += parseFloat(l.borderLeftWidth) || 0, e.top += parseFloat(l.borderTopWidth) || 0, o === BOX_EDGE.scrollbar || o === BOX_EDGE.padding || (e.left += parseFloat(l.paddingLeft) || 0, e.top += parseFloat(l.paddingTop) || 0), e);
  }

  // node_modules/mezr/dist/esm/getOffset.js
  function getOffset(t, e) {
    const o = isRectObject(t) ? { left: t.left, top: t.top } : Array.isArray(t) ? getOffsetFromDocument(...t) : getOffsetFromDocument(t);
    if (e && !isDocument(e)) {
      const t2 = isRectObject(e) ? e : Array.isArray(e) ? getOffsetFromDocument(e[0], e[1]) : getOffsetFromDocument(e);
      o.left -= t2.left, o.top -= t2.top;
    }
    return o;
  }

  // node_modules/mezr/dist/esm/getRect.js
  function getRect(t, e) {
    let i = 0, g = 0;
    isRectObject(t) ? (i = t.width, g = t.height) : Array.isArray(t) ? (i = getWidth(...t), g = getHeight(...t)) : (i = getWidth(t), g = getHeight(t));
    const r = getOffset(t, e);
    return { width: i, height: g, ...r, right: r.left + i, bottom: r.top + g };
  }

  // node_modules/mezr/dist/esm/utils/getNormalizedRect.js
  function getNormalizedRect(t) {
    return isRectObject(t) ? t : getRect(t);
  }

  // node_modules/mezr/dist/esm/getDistance.js
  function getDistance(e, t) {
    const c = getNormalizedRect(e), i = getNormalizedRect(t);
    return getDistanceBetweenRects(c, i);
  }

  // node_modules/mezr/dist/esm/getIntersection.js
  function getIntersection(t, ...e) {
    const o = { ...getNormalizedRect(t), right: 0, bottom: 0 };
    for (const t2 of e) {
      const e2 = getNormalizedRect(t2), i = Math.max(o.left, e2.left), h = Math.min(o.left + o.width, e2.left + e2.width);
      if (h <= i)
        return null;
      const r = Math.max(o.top, e2.top), l = Math.min(o.top + o.height, e2.height + e2.top);
      if (l <= r)
        return null;
      o.left = i, o.top = r, o.width = h - i, o.height = l - r;
    }
    return o.right = o.left + o.width, o.bottom = o.top + o.height, o;
  }

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

  // src/utils/get-intersection-area.ts
  function getIntersectionArea(a, b) {
    const intersection = getIntersection(a, b);
    return intersection ? intersection.width * intersection.height : 0;
  }

  // src/utils/get-intersection-score.ts
  function getIntersectionScore(a, b) {
    const area = getIntersectionArea(a, b);
    if (!area)
      return 0;
    const maxArea = Math.min(a.width, b.width) * Math.min(a.height, b.height);
    return area / maxArea * 100;
  }

  // src/utils/is-window.ts
  function isWindow2(value) {
    return value instanceof Window;
  }

  // src/utils/get-scroll-element.ts
  function getScrollElement(element) {
    if (isWindow2(element) || element === document.documentElement || element === document.body) {
      return window;
    } else {
      return element;
    }
  }

  // src/utils/get-scroll-left.ts
  function getScrollLeft(element) {
    return isWindow2(element) ? element.pageXOffset : element.scrollLeft;
  }

  // src/utils/get-scroll-left-max.ts
  function getScrollLeftMax(element) {
    if (isWindow2(element))
      element = document.documentElement;
    return element.scrollWidth - element.clientWidth;
  }

  // src/utils/get-scroll-top.ts
  function getScrollTop(element) {
    return isWindow2(element) ? element.pageYOffset : element.scrollTop;
  }

  // src/utils/get-scroll-top-max.ts
  function getScrollTopMax(element) {
    if (isWindow2(element))
      element = document.documentElement;
    return element.scrollHeight - element.clientHeight;
  }

  // src/utils/is-intersecting.ts
  function isIntersecting2(a, b) {
    return !(a.right <= b.left || b.right <= a.left || a.bottom <= b.top || b.bottom <= a.top);
  }

  // src/auto-scroll/auto-scroll.ts
  var R1 = {
    width: 0,
    height: 0,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  };
  var R2 = { ...R1 };
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
    result.left = rect.left - left;
    result.top = rect.top - top;
    result.right = rect.right + right;
    result.bottom = rect.bottom + bottom;
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
      if (this.requestX)
        this.requestX.action = null;
      if (this.requestY)
        this.requestY.action = null;
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
      if (!this.element)
        return;
      this.scrollLeft = this.requestX ? this.requestX.value : getScrollLeft(this.element);
      this.scrollTop = this.requestY ? this.requestY.value : getScrollTop(this.element);
    }
    scroll() {
      if (!this.element)
        return;
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
      if (this.isActive)
        this.onStop();
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
      if (!this.element)
        return 0;
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
      if (!this.item || !this.element)
        return 0;
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
      if (!this.item || !this.element)
        return;
      const { onStart } = this.item;
      if (typeof onStart === "function") {
        onStart(this.element, getDirectionAsString(this.direction));
      }
    }
    onStop() {
      if (!this.item || !this.element)
        return;
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
      this._emitter = new Emitter();
      this._frameRead = this._frameRead.bind(this);
      this._frameWrite = this._frameWrite.bind(this);
    }
    _frameRead(time) {
      if (this._isDestroyed)
        return;
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
      if (this._isDestroyed)
        return;
      this._applyActions();
    }
    _startTicking() {
      if (this._isTicking)
        return;
      this._isTicking = true;
      ticker.on(tickerReadPhase, this._frameRead);
      ticker.on(tickerWritePhase, this._frameWrite);
    }
    _stopTicking() {
      if (!this._isTicking)
        return;
      this._isTicking = false;
      this._tickTime = 0;
      this._tickDeltaTime = 0;
      ticker.off(tickerReadPhase, this._frameRead);
      ticker.off(tickerWritePhase, this._frameWrite);
    }
    _getItemClientRect(item, result = { width: 0, height: 0, left: 0, right: 0, top: 0, bottom: 0 }) {
      const { clientRect } = item;
      result.left = clientRect.left;
      result.top = clientRect.top;
      result.width = clientRect.width;
      result.height = clientRect.height;
      result.right = clientRect.left + clientRect.width;
      result.bottom = clientRect.top + clientRect.height;
      return result;
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
      if (!request)
        return;
      if (request.action)
        request.action.removeRequest(request);
      this._requestPool.put(request);
      reqMap.delete(item);
    }
    _checkItemOverlap(item, checkX, checkY) {
      const { inertAreaSize, targets } = item;
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
      const itemRect = this._getItemClientRect(item, R1);
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
        if (testMaxScrollX <= 0 && testMaxScrollY <= 0)
          continue;
        const testRect = getRect([testElement, "padding"], window);
        let testScore = getIntersectionScore(itemRect, testRect) || -Infinity;
        if (testScore === -Infinity) {
          if (target.padding && isIntersecting2(itemRect, getPaddedRect(testRect, target.padding, R2))) {
            testScore = -(getDistance(itemRect, testRect) || 0);
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
            itemRect.width,
            testRect.width
          );
          if (moveDirectionX === AUTO_SCROLL_DIRECTION.right) {
            testDistance = testRect.right + testEdgeOffset - itemRect.right;
            if (testDistance <= testThreshold && !isScrolledToMax(getScrollLeft(testElement), testMaxScrollX)) {
              testDirection = AUTO_SCROLL_DIRECTION.right;
            }
          } else if (moveDirectionX === AUTO_SCROLL_DIRECTION.left) {
            testDistance = itemRect.left - (testRect.left - testEdgeOffset);
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
            itemRect.height,
            testRect.height
          );
          if (moveDirectionY === AUTO_SCROLL_DIRECTION.down) {
            testDistance = testRect.bottom + testEdgeOffset - itemRect.bottom;
            if (testDistance <= testThreshold && !isScrolledToMax(getScrollTop(testElement), testMaxScrollY)) {
              testDirection = AUTO_SCROLL_DIRECTION.down;
            }
          } else if (moveDirectionY === AUTO_SCROLL_DIRECTION.up) {
            testDistance = itemRect.top - (testRect.top - testEdgeOffset);
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
      const { inertAreaSize, smoothStop, targets } = item;
      const itemRect = this._getItemClientRect(item, R1);
      let hasReachedEnd = null;
      let i = 0;
      for (; i < targets.length; i++) {
        const target = targets[i];
        const testElement = getScrollElement(target.element || target);
        if (testElement !== scrollRequest.element)
          continue;
        const testIsAxisX = !!(AUTO_SCROLL_AXIS.x & scrollRequest.direction);
        if (testIsAxisX) {
          if (target.axis === "y")
            continue;
        } else {
          if (target.axis === "x")
            continue;
        }
        const testMaxScroll = testIsAxisX ? getScrollLeftMax(testElement) : getScrollTopMax(testElement);
        if (testMaxScroll <= 0) {
          break;
        }
        const testRect = getRect([testElement, "padding"], window);
        const testScore = getIntersectionScore(itemRect, testRect) || -Infinity;
        if (testScore === -Infinity) {
          const padding = target.scrollPadding || target.padding;
          if (!(padding && isIntersecting2(itemRect, getPaddedRect(testRect, padding, R2)))) {
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
          testIsAxisX ? itemRect.width : itemRect.height,
          testIsAxisX ? testRect.width : testRect.height
        );
        let testDistance = 0;
        if (scrollRequest.direction === AUTO_SCROLL_DIRECTION.left) {
          testDistance = itemRect.left - (testRect.left - testEdgeOffset);
        } else if (scrollRequest.direction === AUTO_SCROLL_DIRECTION.right) {
          testDistance = testRect.right + testEdgeOffset - itemRect.right;
        } else if (scrollRequest.direction === AUTO_SCROLL_DIRECTION.up) {
          testDistance = itemRect.top - (testRect.top - testEdgeOffset);
        } else {
          testDistance = testRect.bottom + testEdgeOffset - itemRect.bottom;
        }
        if (testDistance > testThreshold) {
          break;
        }
        const testScroll = testIsAxisX ? getScrollLeft(testElement) : getScrollTop(testElement);
        hasReachedEnd = AUTO_SCROLL_AXIS_DIRECTION.forward & scrollRequest.direction ? isScrolledToMax(testScroll, testMaxScroll) : testScroll <= 0;
        if (hasReachedEnd)
          break;
        scrollRequest.maxValue = testMaxScroll;
        scrollRequest.threshold = testThreshold;
        scrollRequest.distance = testDistance;
        scrollRequest.isEnding = false;
        return true;
      }
      if (smoothStop === true && scrollRequest.speed > 0) {
        if (hasReachedEnd === null)
          hasReachedEnd = scrollRequest.hasReachedEnd();
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
      if (!action)
        action = this._actionPool.pick();
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
        if (reqX)
          this._requestAction(reqX, AUTO_SCROLL_AXIS.x);
        if (reqY)
          this._requestAction(reqY, AUTO_SCROLL_AXIS.y);
      }
      for (i = 0; i < this._actions.length; i++) {
        this._actions[i].computeScrollValues();
      }
    }
    _applyActions() {
      if (!this._actions.length)
        return;
      this._emitter.emit("beforescroll");
      let i = 0;
      for (i = 0; i < this._actions.length; i++) {
        this._actions[i].scroll();
        this._actionPool.put(this._actions[i]);
      }
      this._actions.length = 0;
      let item;
      for (i = 0; i < this.items.length; i++) {
        item = this.items[i];
        if (item.onPrepareScrollEffect) {
          item.onPrepareScrollEffect();
        }
      }
      for (i = 0; i < this.items.length; i++) {
        item = this.items[i];
        if (item.onApplyScrollEffect) {
          item.onApplyScrollEffect();
        }
      }
      this._emitter.emit("afterscroll");
    }
    /**
     * Bind a listener.
     */
    on(eventName, listener) {
      return this._emitter.on(eventName, listener);
    }
    /**
     * Unbind a listener.
     */
    off(eventName, listener) {
      this._emitter.off(eventName, listener);
    }
    addItem(item) {
      if (this._isDestroyed || this._itemData.has(item))
        return;
      const { x, y } = item.position;
      const itemData = new AutoScrollItemData();
      itemData.positionX = x;
      itemData.positionY = y;
      itemData.directionX = AUTO_SCROLL_DIRECTION.none;
      itemData.directionY = AUTO_SCROLL_DIRECTION.none;
      itemData.overlapCheckRequestTime = this._tickTime;
      this._itemData.set(item, itemData);
      this.items.push(item);
      if (!this._isTicking)
        this._startTicking();
    }
    removeItem(item) {
      if (this._isDestroyed)
        return;
      const index = this.items.indexOf(item);
      if (index === -1)
        return;
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
      if (this._isDestroyed)
        return;
      const items = this.items.slice(0);
      let i = 0;
      for (; i < items.length; i++) {
        this.removeItem(items[i]);
      }
      this._actions.length = 0;
      this._requestPool.reset();
      this._actionPool.reset();
      this._emitter.off();
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
    });
    describe("_emitter", () => {
      it("should allow duplicate listeners by default", () => {
        const s = new BaseSensor();
        assert.equal(s["_emitter"].allowDuplicateListeners, true);
      });
      it("should replace event listeners with duplicate ids by default", () => {
        const s = new BaseSensor();
        assert.equal(s["_emitter"].idDedupeMode, "replace");
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
      it("should return a symbol (by default) which acts as an id for removing the event listener", () => {
        const s = new BaseSensor();
        const idA = s.on("start", () => {
        });
        assert.equal(typeof idA, "symbol");
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
      it("should remove event listeners based on the listener callback", () => {
        const s = new BaseSensor();
        let msg = "";
        const listenerA = () => void (msg += "a");
        const listenerB = () => void (msg += "b");
        s.on("start", listenerA);
        s.on("start", listenerB);
        s.on("start", listenerB);
        s.on("start", listenerA);
        s.off("start", listenerA);
        s["_start"]({ type: "start", x: 1, y: 2 });
        assert.equal(msg, "bb");
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
    constructor(type, options = {}) {
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
      super(type, parentOptions);
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
  function createFakeTouchEvent(type, options = {}) {
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
    const touchEvent = new FakeTouchEvent(type, {
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
      if (!target)
        throw new Error("No event target found!");
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
          if (onAfterStep)
            onAfterStep(event);
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
          if (onAfterStep)
            onAfterStep(event);
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
          if (onAfterStep)
            onAfterStep(event);
          break;
        }
      }
    }
  }

  // tests/src/utils/defaultPageStyles.ts
  function addDefaultPageStyles(doc) {
    if (doc.getElementById("default-page-styles"))
      return;
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
      if (IS_BROWSER) {
        addDefaultPageStyles(document);
        return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      }
      return;
    });
    afterEach(() => {
      if (IS_BROWSER) {
        removeDefaultPageStyles(document);
        return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      }
      return;
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
        if (!IS_BROWSER)
          this.skip();
        const s = new PointerSensor(document.documentElement, { sourceEvents: "mouse" });
        document.documentElement.dispatchEvent(new MouseEvent("mousedown"));
        assert.notEqual(s.drag, null);
        s.destroy();
      });
      it("should accept document.body", function() {
        if (!IS_BROWSER)
          this.skip();
        const s = new PointerSensor(document.body, { sourceEvents: "mouse" });
        document.body.dispatchEvent(new MouseEvent("mousedown"));
        assert.notEqual(s.drag, null);
        s.destroy();
      });
      it("should accept a descendant of document.body", function() {
        if (!IS_BROWSER)
          this.skip();
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
        if (!IS_BROWSER)
          this.skip();
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
            { x: 3, y: 3 }
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
            { x: 3, y: 3 }
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
            { x: 3, y: 3 }
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
        if (!IS_BROWSER)
          this.skip();
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
            { x: 3, y: 3 }
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
        if (!IS_BROWSER)
          this.skip();
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
            { x: 3, y: 3 }
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
        if (!IS_BROWSER)
          this.skip();
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
            { x: 3, y: 3 }
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
        if (!IS_BROWSER)
          this.skip();
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
            { x: 3, y: 3 }
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
        if (!IS_BROWSER)
          this.skip();
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
            { x: 3, y: 3 }
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
        if (!IS_BROWSER)
          this.skip();
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
            { x: 3, y: 3 }
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
        if (!IS_BROWSER)
          this.skip();
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
            { x: 3, y: 3 }
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
          x: 3,
          y: 3
        });
        s.destroy();
        el.remove();
      });
      it(`should be triggered correctly on pointerup`, function() {
        if (!IS_BROWSER)
          this.skip();
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
            { x: 3, y: 3 }
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
          x: 3,
          y: 3
        });
        s.destroy();
        el.remove();
      });
      it(`should be triggered correctly on touchend`, function() {
        if (!IS_BROWSER)
          this.skip();
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
            { x: 3, y: 3 }
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
          x: 3,
          y: 3
        });
        s.destroy();
        el.remove();
      });
    });
    describe("cancel event", () => {
      it(`should be triggered correctly on pointercancel`, function() {
        if (!IS_BROWSER)
          this.skip();
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
            { x: 3, y: 3 }
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
          x: 3,
          y: 3
        });
        s.destroy();
        el.remove();
      });
      it(`should be triggered correctly on touchcancel`, function() {
        if (!IS_BROWSER)
          this.skip();
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
            { x: 3, y: 3 }
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
          x: 3,
          y: 3
        });
        s.destroy();
        el.remove();
      });
    });
  });

  // tests/src/KeyboardSensor.ts
  describe("KeyboardSensor", () => {
    beforeEach(() => {
      if (IS_BROWSER) {
        addDefaultPageStyles(document);
        return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      }
      return;
    });
    afterEach(() => {
      if (IS_BROWSER) {
        removeDefaultPageStyles(document);
        return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      }
      return;
    });
    describe("drag property", () => {
      it(`should be null on init`, function() {
        const s = new KeyboardSensor();
        assert.equal(s.drag, null);
        s.destroy();
      });
    });
    describe("isDestroyed property", () => {
      it(`should be false on init`, function() {
        const s = new KeyboardSensor();
        assert.equal(s.isDestroyed, false);
        s.destroy();
      });
    });
    describe("start event", () => {
      it(`should be triggered correctly on Enter`, function() {
        if (!IS_BROWSER)
          this.skip();
        const el = createTestElement({ left: "10px", top: "20px" });
        const s = new KeyboardSensor();
        let startEvent = null;
        s.on("start", (e) => {
          if (startEvent === null) {
            startEvent = e;
          } else {
            assert.fail("start event listener called twice");
          }
        });
        const srcEvent = new KeyboardEvent("keydown", { key: "Enter" });
        document.dispatchEvent(srcEvent);
        assert.equal(s.drag, null);
        el.focus();
        document.dispatchEvent(srcEvent);
        assert.deepEqual(startEvent, {
          type: "start",
          srcEvent,
          x: 10,
          y: 20
        });
        s.destroy();
        el.remove();
      });
    });
  });
})();
/*! Bundled license information:

assertion-error/index.js:
  (*!
   * assertion-error
   * Copyright(c) 2013 Jake Luer <jake@qualiancy.com>
   * MIT Licensed
   *)
  (*!
   * Return a function that will copy properties from
   * one object to another excluding any originally
   * listed. Returned function will create a new `{}`.
   *
   * @param {String} excluded properties ...
   * @return {Function}
   *)
  (*!
   * Primary Exports
   *)
  (*!
   * Inherit from Error.prototype
   *)
  (*!
   * Statically set name
   *)
  (*!
   * Ensure correct constructor
   *)

chai/lib/chai/utils/flag.js:
  (*!
   * Chai - flag utility
   * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   *)

chai/lib/chai/utils/test.js:
  (*!
   * Chai - test utility
   * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   *)
  (*!
   * Module dependencies
   *)

chai/lib/chai/utils/expectTypes.js:
  (*!
   * Chai - expectTypes utility
   * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   *)

chai/lib/chai/utils/getActual.js:
  (*!
   * Chai - getActual utility
   * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   *)

chai/lib/chai/utils/objDisplay.js:
  (*!
   * Chai - flag utility
   * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   *)
  (*!
   * Module dependencies
   *)

chai/lib/chai/utils/getMessage.js:
  (*!
   * Chai - message composition utility
   * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   *)
  (*!
   * Module dependencies
   *)

chai/lib/chai/utils/transferFlags.js:
  (*!
   * Chai - transferFlags utility
   * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   *)

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

chai/lib/chai/utils/isProxyEnabled.js:
  (*!
   * Chai - isProxyEnabled helper
   * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   *)

chai/lib/chai/utils/addProperty.js:
  (*!
   * Chai - addProperty utility
   * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   *)

chai/lib/chai/utils/addLengthGuard.js:
  (*!
   * Chai - addLengthGuard utility
   * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   *)

chai/lib/chai/utils/getProperties.js:
  (*!
   * Chai - getProperties utility
   * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   *)

chai/lib/chai/utils/proxify.js:
  (*!
   * Chai - proxify utility
   * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   *)

chai/lib/chai/utils/addMethod.js:
  (*!
   * Chai - addMethod utility
   * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   *)

chai/lib/chai/utils/overwriteProperty.js:
  (*!
   * Chai - overwriteProperty utility
   * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   *)

chai/lib/chai/utils/overwriteMethod.js:
  (*!
   * Chai - overwriteMethod utility
   * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   *)

chai/lib/chai/utils/addChainableMethod.js:
  (*!
   * Chai - addChainingMethod utility
   * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   *)
  (*!
   * Module dependencies
   *)
  (*!
   * Module variables
   *)

chai/lib/chai/utils/overwriteChainableMethod.js:
  (*!
   * Chai - overwriteChainableMethod utility
   * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   *)

chai/lib/chai/utils/compareByInspect.js:
  (*!
   * Chai - compareByInspect utility
   * Copyright(c) 2011-2016 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   *)
  (*!
   * Module dependencies
   *)

chai/lib/chai/utils/getOwnEnumerablePropertySymbols.js:
  (*!
   * Chai - getOwnEnumerablePropertySymbols utility
   * Copyright(c) 2011-2016 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   *)

chai/lib/chai/utils/getOwnEnumerableProperties.js:
  (*!
   * Chai - getOwnEnumerableProperties utility
   * Copyright(c) 2011-2016 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   *)
  (*!
   * Module dependencies
   *)

chai/lib/chai/utils/isNaN.js:
  (*!
   * Chai - isNaN utility
   * Copyright(c) 2012-2015 Sakthipriyan Vairamani <thechargingvolcano@gmail.com>
   * MIT Licensed
   *)

chai/lib/chai/utils/index.js:
  (*!
   * chai
   * Copyright(c) 2011 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   *)
  (*!
   * Dependencies that are used for multiple exports are required here only once
   *)
  (*!
   * test utility
   *)
  (*!
   * type utility
   *)
  (*!
   * expectTypes utility
   *)
  (*!
   * message utility
   *)
  (*!
   * actual utility
   *)
  (*!
   * Inspect util
   *)
  (*!
   * Object Display util
   *)
  (*!
   * Flag utility
   *)
  (*!
   * Flag transferring utility
   *)
  (*!
   * Deep equal utility
   *)
  (*!
   * Deep path info
   *)
  (*!
   * Check if a property exists
   *)
  (*!
   * Function name
   *)
  (*!
   * add Property
   *)
  (*!
   * add Method
   *)
  (*!
   * overwrite Property
   *)
  (*!
   * overwrite Method
   *)
  (*!
   * Add a chainable method
   *)
  (*!
   * Overwrite chainable method
   *)
  (*!
   * Compare by inspect method
   *)
  (*!
   * Get own enumerable property symbols method
   *)
  (*!
   * Get own enumerable properties method
   *)
  (*!
   * Checks error against a given set of criteria
   *)
  (*!
   * Proxify util
   *)
  (*!
   * addLengthGuard util
   *)
  (*!
   * isProxyEnabled helper
   *)
  (*!
   * isNaN method
   *)
  (*!
   * getOperator method
   *)

chai/lib/chai/assertion.js:
  (*!
   * chai
   * http://chaijs.com
   * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   *)
  (*!
   * Module dependencies.
   *)
  (*!
   * Module export.
   *)
  (*!
   * Assertion Constructor
   *
   * Creates object for chaining.
   *
   * `Assertion` objects contain metadata in the form of flags. Three flags can
   * be assigned during instantiation by passing arguments to this constructor:
   *
   * - `object`: This flag contains the target of the assertion. For example, in
   *   the assertion `expect(numKittens).to.equal(7);`, the `object` flag will
   *   contain `numKittens` so that the `equal` assertion can reference it when
   *   needed.
   *
   * - `message`: This flag contains an optional custom error message to be
   *   prepended to the error message that's generated by the assertion when it
   *   fails.
   *
   * - `ssfi`: This flag stands for "start stack function indicator". It
   *   contains a function reference that serves as the starting point for
   *   removing frames from the stack trace of the error that's created by the
   *   assertion when it fails. The goal is to provide a cleaner stack trace to
   *   end users by removing Chai's internal functions. Note that it only works
   *   in environments that support `Error.captureStackTrace`, and only when
   *   `Chai.config.includeStack` hasn't been set to `false`.
   *
   * - `lockSsfi`: This flag controls whether or not the given `ssfi` flag
   *   should retain its current value, even as assertions are chained off of
   *   this object. This is usually set to `true` when creating a new assertion
   *   from within another assertion. It's also temporarily set to `true` before
   *   an overwritten assertion gets called by the overwriting assertion.
   *
   * @param {Mixed} obj target of the assertion
   * @param {String} msg (optional) custom error message
   * @param {Function} ssfi (optional) starting point for removing stack frames
   * @param {Boolean} lockSsfi (optional) whether or not the ssfi flag is locked
   * @api private
   *)
  (*!
   * ### ._obj
   *
   * Quick reference to stored `actual` value for plugin developers.
   *
   * @api private
   *)

chai/lib/chai/core/assertions.js:
  (*!
   * chai
   * http://chaijs.com
   * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   *)

chai/lib/chai/interface/expect.js:
  (*!
   * chai
   * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   *)

chai/lib/chai/interface/should.js:
  (*!
   * chai
   * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   *)

chai/lib/chai/interface/assert.js:
  (*!
   * chai
   * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   *)
  (*!
   * Chai dependencies.
   *)
  (*!
   * Module export.
   *)
  (*!
   * ### .ifError(object)
   *
   * Asserts if value is not a false value, and throws if it is a true value.
   * This is added to allow for chai to be a drop-in replacement for Node's
   * assert class.
   *
   *     var err = new Error('I am a custom error');
   *     assert.ifError(err); // Rethrows err!
   *
   * @name ifError
   * @param {Object} object
   * @namespace Assert
   * @api public
   *)
  (*!
   * Aliases.
   *)

chai/lib/chai.js:
  (*!
   * chai
   * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   *)
  (*!
   * Chai version
   *)
  (*!
   * Assertion Error
   *)
  (*!
   * Utils for plugins (not exported)
   *)
  (*!
   * Utility Functions
   *)
  (*!
   * Configuration
   *)
  (*!
   * Primary `Assertion` prototype
   *)
  (*!
   * Core Assertions
   *)
  (*!
   * Expect interface
   *)
  (*!
   * Should interface
   *)
  (*!
   * Assert interface
   *)
*/
