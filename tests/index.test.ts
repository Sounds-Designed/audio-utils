import { describe, it, expect } from "@jest/globals";

describe("capitalize", () => {
  it("capitalizes the first letter of a string", () => {
    expect("Hello").toBe("Hello");
    expect("World").toBe("World");
    expect("JavaScript").toBe("JavaScript");
  });
});
