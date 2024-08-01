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
$ npx tailwind-atlas find ./tw-test/**/*.html
[
  "absolute",
  "hover:text-zinc-400",
  "ring-zinc-950/5",
  "text-zinc-700",
]
```

### Parse Candidates

The parse command will find the classes in your files and parse them, outputting candidate objects with information like variants and values.

```bash
$ npx tailwind-atlas parse ./tw-test/**/*.html
[
  {
    "kind": "static",
    "root": "absolute",
    "variants": [],
    "negative": false,
    "important": false
  },
  {
    "kind": "functional",
    "root": "text",
    "modifier": null,
    "value": {
      "kind": "named",
      "value": "zinc-400",
      "fraction": null
    },
    "variants": [
      {
        "kind": "static",
        "root": "hover",
        "compounds": true
      }
    ],
    "negative": false,
    "important": false
  },
  {
    "kind": "functional",
    "root": "ring",
    "modifier": {
      "kind": "named",
      "value": "5"
    },
    "value": {
      "kind": "named",
      "value": "zinc-950",
      "fraction": "950/5"
    },
    "variants": [],
    "negative": false,
    "important": false
  },
  {
    "kind": "functional",
    "root": "text",
    "modifier": null,
    "value": {
      "kind": "named",
      "value": "zinc-700",
      "fraction": null
    },
    "variants": [],
    "negative": false,
    "important": false
  }
]
```

### Safelist

If you want to generate a safelist, you can use the `safelist` command. This will find and parse the classes and then output the classes in a format that can be used in your `tailwind.config.js` file.

```bash
$ npx tailwind-atlas safelist ./tw-test/**/*.html
[
  "absolute",
  {
    "pattern": "/^text-(?:zinc-400|zinc-700)$/",
    "variants": [
      "hover"
    ]
  },
  {
    "pattern": "/^ring-(?:zinc-950)$/"
  }
]
```
