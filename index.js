const spawn = require( 'child_process' ).spawn;
const platform = require( 'os' ).platform;
const splitToObject = require( 'split-cmd' ).splitToObject;

if ( ! Helper ) { // useful when testing
    var Helper = require( 'codeceptjs' ).helper;
}

/**
 * Command helper
 *
 * @author Thiago Delgado Pinto
 */
class CmdHelper extends Helper {

    /**
     * Constructor
     *
     * @param {object} config Configuration declared in the CodeceptJS configuration file.
     */
    constructor( config ) {

        super( config );

        const defaultOptions = {
            options: {
                // stdio: 'inherit', // <<< not working on windows!
                shell: true
            },
            showOutput: true
        };

        // Attributes
        this.options = Object.assign( defaultOptions, config ); // Copy from config
    }

    /**
     * Executes the given command.
     *
     * @param {string} command Command to execute.
     * @param {object} options Same options as in NodeJS' spawn(), plus `showOutput: boolean`. Optional. Default is `{ shell: true, showOutput: true }`.
     *
     * @returns Promise with the returning execution status code (0 means success)
     */
    runCommand( command, options ) {

        if ( 'string' !== typeof command ) {
            throw new Error( 'Command must be a string' );
        }

        if ( [ 'object', 'undefined', 'null' ].indexOf( typeof options ) < 0 ) {
            throw new Error( 'Options must be an object, undefined or null.' );
        }

        const optionsProperty = 'options';
        const showOutputProperty = 'showOutput';

        const cfg = {

            options: options || this.options[ optionsProperty ] || { shell: true },

            showOutput: ! options
                ? ( this.options[ showOutputProperty ] )
                : ( options[ showOutputProperty ] )
        };

        // Removes 'showOutput' from options, because it is not accepted by spawn()
        cfg.options[ showOutputProperty ] = undefined;

        // Fix problem with spawn() on Windows OSes
        if ( 'win32' === platform() ) {
            cfg.options[ 'shell' ] = true;
        }

        const cmdObj = splitToObject( command );

        return new Promise( ( resolve, reject ) => {

            const child = spawn( cmdObj.command, cmdObj.args, cfg.options );

            child.stdout.on( 'data', ( chunk ) => {
                if ( cfg.showOutput && ( chunk !== undefined && chunk !== null ) ) {
                    console.log( chunk.toString() );
                }
            } );

            child.stderr.on( 'data', ( chunk ) => {
                if ( cfg.showOutput && ( chunk !== undefined && chunk !== null ) ) {
                    console.warn( chunk.toString() );
                }
            } );

            child.on( 'exit', ( code ) => {
                resolve( code );
            } );

        } );

    }

}

module.exports = CmdHelper;
