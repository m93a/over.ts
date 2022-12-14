import { useTypes } from "./index";

const types = {
  number: (x: unknown): x is number => typeof x === "number",
  string: (x: unknown): x is string => typeof x === "string",
  Date: (x: unknown): x is Date => x instanceof Date,
  Set: (x: unknown): x is Set<any> => x instanceof Set,
};

describe("index", () => {
  it("core functionality", () => {
    const typed = useTypes(types);
    const size = typed({
      "string -> number": (x) => x.length,
      "Date -> number": (x) => x.valueOf(),
      "Set -> number": (x) => x.size,
    });

    expect(size("asdf")).toBe(4);
    expect(size(new Date(123))).toBe(123);
    expect(size(new Set(["a", 2, 3]))).toBe(3);

    expect(() => size(42 as any)).toThrow(
      "arguments did not match any supported signature"
    );
  });

  it("check result", () => {
    const typed = useTypes(types, { checkResult: true });
    const concat = typed({
      "string, string -> string": (a, b) => a + b,
      "string, number -> string": (a, b) => a + b,
      "Date, Date -> Date": (a, b) => ("" + a + b) as any,
    });

    expect(concat("hello", "world")).toBe("helloworld");
    expect(concat("high", 5)).toBe("high5");
    expect(() => concat(new Date(), new Date(123))).toThrow(
      "returned value did not match the expected type"
    );
  });
});
