# Statoscope CLI

[![npm version](https://badge.fury.io/js/%40statoscope%2Fcli.svg)](https://badge.fury.io/js/%40statoscope%2Fcli)
[![Support](https://img.shields.io/badge/-Support-blue)](https://opencollective.com/statoscope)

This package supplies Statoscope as CLI tool

## Installation

```sh
npm i @statoscope/cli -g
```

## Usage

```sh
statoscope [command] [...args]
```

## Commands

### validate

Validate or compare webpack stats.

`validate [...args]`

- `--input` (`-i`) - path to a stats.json
- `--reference` (`-r`) - path to a stats-file to compare with (optional)
- `--config` (`-c`) - path to statoscope config (by default `{pwd}/statoscope.config.js` has used)
- `--warn-as-error` (`-w`) - treat warnings as errors

**Example:**

1. Install webpack-plugin for the validator:

`npm install --save-dev @statoscope/stats-validator-plugin-webpack @statoscope/stats-validator-reporter-console @statoscope/stats-validator-reporter-stats-report`


2. Create a statosope-config:

**statoscope.config.js**
```js
module.exports = {
  validate: {
    // add webpack plugin with rules
    plugins: ['@statoscope/webpack'],
    reporters: [
      // console-reporter to output results into console (enabled by default)
      '@statoscope/console',
      // reporter that generates UI-report with validation-results
      ['@statoscope/stats-report', {open: true}],
    ],
    // rules to validate your stats (use all of them or only specific rules)
    rules: {      
      // ensures that the build time has not exceeded the limit (10 sec)
      '@statoscope/webpack/build-time-limits': ['error', 10000],
      // ensures that bundle doesn't use specified packages
      '@statoscope/webpack/restricted-packages': ['error', ['lodash', 'browserify-crypto']],
      // ensures that bundle hasn't package duplicates
      '@statoscope/webpack/no-packages-dups': ['error'],
      // ensure that the download time of entrypoints is not over the limit (3 sec)
      '@statoscope/webpack/entry-download-time-limits': ['error', { global: { maxDownloadTime: 3000 } }],
      // ensure that the download size of entrypoints is not over the limit (3 mb)
      '@statoscope/webpack/entry-download-size-limits': ['error', { global: { maxSize: 3 * 1024 * 1024 } }],
      // diff download size of entrypoints between input and reference stats. Fails if size diff is over the limit (3 kb)
      '@statoscope/webpack/diff-entry-download-size-limits': [
        'error',
        { global: { maxSizeDiff: 3*1024 } },
      ],
      // compares usage of specified packages usage between input and reference stats. Fails if rxjs usage has increased
      '@statoscope/webpack/diff-deprecated-packages': ['error', ['rxjs']],
    }
  }
}
```

3. Exec the command:

```sh
statoscope validate --input path/to/stats.json
```

4. Analyze results in the console or generated UI-report

> Learn more on [@staoscope/stats-validator](/packages/stats-validator) and [@statoscope/stats-validator-plugin-webpack](/packages/stats-validator-plugin-webpack)

### serve

Start HTTP-server and serve JSON-stats as HTML report

`serve input [...args]`

- `--input` (`-i`) - path to one or more webpack stats
- `--host` (`-h`) - server host
- `--port` (`-p`) - server port
- `--open` (`-o`) - open browser after server start

**Example:**

```sh
statoscope serve path/to/stats.json -o
```

Start server and open browser.

### generate

Generate HTML report from JSON-stats.

`generate input output [...args]`

- `--input` (`-i`) - path to one or more webpack stats
- `--output` (`-t`) - path to generated HTML
- `--open` (`-o`) - open browser after generate

**Example:**

```sh
statoscope generate path/to/stats.json path/to/report.html -o
```

Create statoscope report, save it to `path/to/report.html` and open

## Support

If you are an engineer or a company that is interested in Statoscope improvements, you may support Statoscope by
financial contribution at [OpenCollective](https://opencollective.com/statoscope).
