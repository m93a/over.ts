export const builtinTypes = {
  string: (x: unknown): x is string => typeof x === "string",
  number: (x: unknown): x is number => typeof x === "number",
  bigint: (x: unknown): x is bigint => typeof x === "bigint",
  boolean: (x: unknown): x is boolean => typeof x === "boolean",
  symbol: (x: unknown): x is symbol => typeof x === "symbol",
  object: (x: unknown): x is object => typeof x === "object",
  function: (x: unknown): x is (...a: any[]) => any => typeof x === "function",

  undefined: (x: unknown): x is undefined => x === undefined,
  null: (x: unknown): x is null => x === null,
  nullish: (x: unknown): x is null | undefined => x === null || x === undefined,
  NaN: (x: unknown): x is number => Number.isNaN(x),
  true: (x: unknown): x is true => x === true,
  false: (x: unknown): x is false => x === false,

  Array: (x: unknown): x is any[] => Array.isArray(x),
  Set: (x: unknown): x is Set<any> => x instanceof Set,
  Map: (x: unknown): x is Map<any, any> => x instanceof Map,
  WeakMap: (x: unknown): x is WeakMap<any, any> => x instanceof WeakMap,
  Date: (x: unknown): x is Date => x instanceof Date,
  Blob: (x: unknown): x is Blob => x instanceof Blob,

  Int8Array: (x: unknown): x is Int8Array => x instanceof Int8Array,
  Uint8Array: (x: unknown): x is Uint8Array => x instanceof Uint8Array,
  Uint8ClampedArray: (x: unknown): x is Uint8ClampedArray =>
    x instanceof Uint8ClampedArray,
  Int16Array: (x: unknown): x is Int16Array => x instanceof Int16Array,
  Uint16Array: (x: unknown): x is Uint16Array => x instanceof Uint16Array,
  Int32Array: (x: unknown): x is Int32Array => x instanceof Int32Array,
  Uint32Array: (x: unknown): x is Uint32Array => x instanceof Uint32Array,
  Float32Array: (x: unknown): x is Float32Array => x instanceof Float32Array,
  Float64Array: (x: unknown): x is Float64Array => x instanceof Float64Array,
  BigInt64Array: (x: unknown): x is BigInt64Array => x instanceof BigInt64Array,
  BigUint64Array: (x: unknown): x is BigUint64Array =>
    x instanceof BigUint64Array,
  TypedArray: isTypedArray,
};

type TypedArray =
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array
  | BigInt64Array
  | BigUint64Array;

function isTypedArray(x: unknown): x is TypedArray {
  return (
    x instanceof Int8Array ||
    x instanceof Uint8Array ||
    x instanceof Uint8ClampedArray ||
    x instanceof Int16Array ||
    x instanceof Uint16Array ||
    x instanceof Int32Array ||
    x instanceof Uint32Array ||
    x instanceof Float32Array ||
    x instanceof Float64Array ||
    x instanceof BigInt64Array ||
    x instanceof BigUint64Array
  );
}
