import { expect, test } from "vitest";
import { genCarbonIconsReactTypes } from "../src";

test("genCarbonIconsReactTypes", () => {
  expect(genCarbonIconsReactTypes()).toMatchInlineSnapshot(`
    {
      "sizes": [
        16,
        20,
        24,
        32,
        "glyph",
      ],
      "total": 2110,
    }
  `);
});
