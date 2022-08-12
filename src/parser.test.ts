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
  });
});

describe("return guard", () => {
  it("core functionality", () => {
    const num = signatureToReturnGuard(types, "string -> number");
    expect(num(42)).toBe(true);
    expect(num("str")).toBe(false);
    expect(num({})).toBe(false);

    const boid = signatureToReturnGuard(types, "number -> void");
    expect(boid('a')).toBe(false);
    expect(boid(undefined)).toBe(true);
    expect(boid(3)).toBe(false);
  });
});
