# codeceptjs-cmdhelper

[![npm version](https://badge.fury.io/js/codeceptjs-cmdhelper.svg)](https://badge.fury.io/js/codeceptjs-cmdhelper)
[![Downloads](https://img.shields.io/npm/dt/codeceptjs-cmdhelper.svg)](https://npmjs.org/package/codeceptjs-cmdhelper)

> Let your CodeceptJS tests run commands in the console/terminal

This is a [Helper](https://codecept.io/helpers/) for [CodeceptJS](https://codecept.io/) that allows you to run commands in the console/terminal. **It is especially useful for preparing the execution environment before/after executing test cases.**

👉 It works with CodeceptJS 1, 2, and 3.

## Install

```bash
npm i -D codeceptjs-cmdhelper
```

## Configure

In your configuration file (_e.g._, `codecept.conf.js`, `codecept.json`), include **CmdHelper** in the property **helpers** :

```js
  ...
  "helpers": {
    ...
    "CmdHelper": {
      "require": "./node_modules/codeceptjs-cmdhelper"
    }
  },
  ...
```

### Options

Optionally, you can set an `options` property with an object that accepts the same parameters as [NodeJS spawn](https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options)'s, plus `showOutput: boolean`. The default value is `{ shell: true, showOutput: true }`.

Example:

```js
  ...
  "helpers": {
    ...
    "CmdHelper": {
      "require": "./node_modules/codeceptjs-cmdhelper",
      "options": {
          "showOutput": false
      },
    }
  },
  ...
```

## Usage

### Syntax differences between CodeceptJS 2 and CodeceptJS 3
In CodeceptJS 2, your callbacks receive `I` as argument:

```javascript
Scenario('test something', async ( I ) => {   // CodeceptJS 2 notation
   /* ... */
} );
```

In CodeceptJS 3, your callbacks receive an object with `I` - that is, `{ I }`:

```javascript
Scenario('test something', async ( { I } ) => {   // CodeceptJS 3 notation
   /* ... */
} );
```

See the [CodeceptJS docs](https://github.com/codeceptjs/CodeceptJS/wiki/Upgrading-to-CodeceptJS-3) for more information on how to upgrade your codebase.

### Examples

> The following examples are written with **CodeceptJS 3**.

Now the object `I` (of your callbacks) has [new methods](#api).


#### Example 1

```js
BeforeSuite( async ( { I } ) => {
    await I.runCommand( 'echo "Hello world!" >foo.txt' );
} );

AfterSuite( async ( { I } ) => {
    await I.runCommand( 'rm foo.txt' );
    // await I.runCommand( 'del foo.txt' ); // on Windows
} );

// ... your feature ...

// ... your scenarios ...
```

#### Example 2

```js
Feature( 'Foo' );

Scenario( 'Bar', async ( { I } ) => {
    await I.runCommand( 'mkdir foo' );
    await I.runCommand( 'mkdir bar', { showOutput: false } );
} );
```

### Note

Make sure to handle errors properly, with `try`..`catch`.

```js
    try {
        const code = await I.runCommand( 'mkdir foo' );
        console.log( 0 === code ? 'success' : 'some problem occurred' );
    } catch ( e ) {
        console.warn( e );
    }
```


## API

```js
/**
 * Executes the given command.
 *
 * @param {string} command Command to execute.
 * @param {object} [options] Same options as in NodeJS' spawn(), plus `showOutput: boolean`. Optional. Default is `{ shell: true, showOutput: true }`.
 *
 * @returns {Promise< number >} Promise with the returning execution status code (0 means success).
 */
runCommand( command, options )
```


## See also

[codeceptjs-dbhelper](https://github.com/thiagodp/codeceptjs-dbhelper) - Connect to databases and run SQL commands


## License

MIT © [Thiago Delgado Pinto](https://github.com/thiagodp)
