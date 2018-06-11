# codeceptjs-cmdhelper

> Let your CodeceptJS tests run commands in the console/terminal

This is a [Helper](https://codecept.io/helpers/) for [CodeceptJS](https://codecept.io/) that allows you to run commands in the console/terminal. **It is especially useful for preparing the execution environment before/after executing test cases.**

It uses NodeJS' [spawn](https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options).

## Install

```bash
npm install --save-dev codeceptjs-cmdhelper
```

## How to configure it

In your `codecept.json`, include **CmdHelper** in the property **helpers** :

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

#### Additional options

- `options: object`: Accepts the same parameters as [NodeJS' spawn](https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options), plus `showOutput: boolean`. Optional. Default is `{ shell: true, showOutput: true }`.

##### Example

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

## How to use it

The object `I` of your tests and events will have access to new methods. [See the API](#api).


### Example 1

```js
BeforeSuite( async ( I ) => {
    await I.runCommand( 'echo "Hello world!" >foo.txt' );
} );

AfterSuite( async ( I ) => {
    await I.runCommand( 'rm foo.txt' );
    // await I.runCommand( 'del foo.txt' ); // on Windows
} );

// ... your feature ...

// ... your scenarios ...
```

### Example 2

```js
Feature( 'Foo' );

Scenario( 'Bar', async ( I ) => {
    await I.runCommand( 'mkdir foo' );
} );
```

### Example 3

```js
Feature( 'Foo' );

Scenario( 'Bar', async ( I ) => {
    // Does not show output
    await I.runCommand( 'mkdir foo', { showOutput: false } );
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
 * @param {object} options Same options as in NodeJS' spawn(), plus `showOutput: boolean`. Optional. Default is `{ shell: true, showOutput: true }`.
 *
 * @returns Promise with the returning execution status code (0 means success)
 */
runCommand( command, options )
```


## See also

[codeceptjs-dbhelper](https://github.com/thiagodp/codeceptjs-dbhelper) - Connect to databases and run SQL commands


## License

MIT © [Thiago Delgado Pinto](https://github.com/thiagodp)