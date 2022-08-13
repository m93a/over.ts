import { signatureToArgumentGuard, signatureToReturnGuard } from "./parser";

const types = {
  number: (x: any): x is number => typeof x === "number",
  string: (x: any): x is string => typeof x === "string",
  void: (x: any): x is void => x === undefined,
};

describe("argument guard", () => {
  it("core functionality", () => {
    const num = signatureToArgumentGuard(types, "number -> void");
    expect(num([42])).toBe(true);
    expect(num(["str"])).toBe(false);
    expect(num([{}])).toBe(false);

    const str = signatureToArgumentGuard(types, "string -> number");
    expect(str([42])).toBe(false);
    expect(str(["str"])).toBe(true);
    expect(str([{}])).toBe(false);

    const multi = signatureToArgumentGuard(
      types,
      "number, string, number -> void"
    );
    expect(multi([3.1, "a", -2])).toBe(true);
    expect(multi(["b", 8, "c"])).toBe(false);
    expect(multi([3.1, "a", "-2"])).toBe(false);
    expect(multi(["3.1", "a", -2])).toBe(false);
    expect(multi([Infinity, "xD", NaN])).toBe(true);

    const none = signatureToArgumentGuard(types, "-> number");
    expect(none([])).toBe(true);
    expect(none([42])).toBe(false);
  });

  it("errors", () => {
    expect(() => signatureToArgumentGuard(types, ", number -> void")).toThrow(
      "Unexpected comma"
    );
    expect(() =>
      signatureToArgumentGuard(types, "string,, number -> void")
    ).toThrow("Duplicit comma");
    expect(() => signatureToArgumentGuard(types, "string, -> void")).toThrow(
      "Unexpected trailing comma"
    );
    expect(() => signatureToArgumentGuard(types, "%number -> void")).toThrow(
      "Unexpected character"
    );
    expect(() => signatureToArgumentGuard(types, "number% -> void")).toThrow(
      "Unexpected character"
    );
    expect(() => signatureToArgumentGuard(types, "number, % -> void")).toThrow(
      "Unexpected character"
    );
    expect(() => signatureToArgumentGuard(types, "boolean -> void")).toThrow(
      "Unknown type"
    );
    expect(() =>
      signatureToArgumentGuard(types, "number number -> void")
    ).toThrow("Unexpected identifier");
    expect(() => signatureToArgumentGuard(types, "number, number")).toThrow(
      "Unexpected end of string"
    );
  });

  it("whitespace resilient", () => {
    const v = [3.1, "a", -2];
    let g = signatureToArgumentGuard(types, "  number, string, number -> void");
    expect(g(v)).toBe(true);

    g = signatureToArgumentGuard(types, "number  , string,  number  ->  void");
    expect(g(v)).toBe(true);

    g = signatureToArgumentGuard(types, "number,string,number->void");
    expect(g(v)).toBe(true);
  });
});

describe("return guard", () => {
  it("core functionality", () => {
    const num = signatureToReturnGuard(types, "string -> number");
    expect(num(42)).toBe(true);
    expect(num("str")).toBe(false);
    expect(num({})).toBe(false);

    const boid = signatureToReturnGuard(types, "number -> void");
    expect(boid("a")).toBe(false);
    expect(boid(undefined)).toBe(true);
    expect(boid(3)).toBe(false);
  });

  it("errors", () => {
    expect(() => signatureToReturnGuard(types, "number")).toThrow(
      "Unexpected end of string"
    );
    expect(() => signatureToReturnGuard(types, "number -> ")).toThrow(
      "Unexpected end of string"
    );
    expect(() => signatureToReturnGuard(types, "number -> bool")).toThrow(
      "Unknown type"
    );
  });

  it("whitespace resilient", () => {
    let g = signatureToReturnGuard(types, "string->number");
    expect(g(42)).toBe(true);

    g = signatureToReturnGuard(types, "number  ->   void");
    expect(g(undefined)).toBe(true);

    g = signatureToReturnGuard(types, "string -> string   ");
    expect(g("a")).toBe(true);
  });
});
