import { test, expect } from "vitest";
import { genCarbonIconsReactTypes } from "../src/carbon-icons-react";

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
      "total": 1949,
    }
  `);
});
