import { expect, test } from "vitest";
import { add } from "./index";

test("addiert 1 + 2 zu 3", () => {
  expect(add("1", 2)).toBe(3);
});
