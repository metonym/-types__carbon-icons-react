import { expect, test } from "bun:test";
import { genCarbonIconsReactTypes } from "../src";

test("genCarbonIconsReactTypes", () => {
  const result = genCarbonIconsReactTypes();
  expect(result.total).toEqual(2159);
});
