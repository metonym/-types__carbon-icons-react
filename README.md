# @types\_\_carbon-icons-react

> **Warning**
> As of v11.29.x, the `@carbon/icons-react` package ships its own TypeScript definitions. As such, `@types/carbon__icons-react` is no longer needed and [has been removed](https://github.com/DefinitelyTyped/DefinitelyTyped/pull/67176). This repo is archived and will remain public for historical purposes.

This repo generates TypeScript definitions ([@types/carbon\_\_icons-react](https://www.npmjs.com/package/@types/carbon__icons-react)) for the [@carbon/icons-react](https://github.com/carbon-design-system/carbon/tree/main/packages/icons-react) icon library using the [@carbon/icons](https://www.npmjs.com/package/@carbon/icons) package.

## Prerequisites

This repo uses `bun`. See the docs for [installation instructions](https://bun.sh/docs/installation).

## Runbook

1. Manually upgrade the minor version of `@carbon/icons`.
2. Run `bun generate-types`.

- This will generate the source code in `dist/`.
- If there are changes, the `tests/index.test.ts` should expectedly fail. Fix the broken test and commit the changes.

If there are changes, perform the following steps to update the type definitions:

1. Fork https://github.com/DefinitelyTyped/DefinitelyTyped.
2. Create a new branch (e.g., `carbon-icons-react-<version>`).
3. Copy the generated files from `dist/` to `DefinitelyTyped/types/carbon__icons-react`.
