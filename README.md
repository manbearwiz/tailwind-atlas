# tailwind-atlas

[![npm](https://img.shields.io/npm/v/tailwind-atlas?style=flat-square)](https://www.npmjs.com/package/tailwind-atlas?activeTab=versions)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/tailwind-atlas?style=flat-square)](https://bundlephobia.com/package/tailwind-atlas)
[![NPM](https://img.shields.io/npm/l/tailwind-atlas?style=flat-square)](https://raw.githubusercontent.com/manbearwiz/tailwind-atlas/master/LICENSE)
[![npm](https://img.shields.io/npm/dt/tailwind-atlas?style=flat-square)](https://www.npmjs.com/package/tailwind-atlas)
[![GitHub issues](https://img.shields.io/github/issues/manbearwiz/tailwind-atlas?style=flat-square)](https://github.com/manbearwiz/tailwind-atlas/issues)
[![semantic-release: angular](https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release&style=flat-square)](https://github.com/semantic-release/semantic-release)

`tailwind-atlas` is a tool to help you find and safelist the tailwindcss classes that are actually used in your html files. This is useful to me in a micro-frontend architecture where I want to include some core tailwindcss classes in the shared css bundle, but I want allow each micro-frontend to include additional classes as needed without duplicating the core classes.

## Usage

### Find Candidates

The find command is a simple wrapper around `@tailwindcss/oxide` to find all the symbols that could potentially be tailwindcss classes in your html files. This might be useful for debugging or if you need to do some additional filtering or processing on the classes before you safelist them.

```bash
npx tailwind-atlas find ./tw-test/**/*.html
```

### Parse Candidates

If you only are concerned with valid tailwind classes, you can use the `parse` command. This will use `@tailwindcss/oxide` to find the tokens and then `tailwind` to validate and parse the tokens to find the classes that are actually used.

```bash
npx tailwind-atlas parse ./tw-test/**/*.html
```

### Safelist

If you want to generate a safelist, you can use the `safelist` command. This will find and parse the classes and then output the classes in a format that can be used in your `tailwind.config.js` file.

```bash
npx tailwind-atlas safelist ./tw-test/**/*.html
```
