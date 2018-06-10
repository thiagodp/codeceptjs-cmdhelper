let spawn = require( 'child_process' ).spawn;
let platform = require( 'os' ).platform;

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
                ? ( this.options[ showOutputProperty ] || true )
                : ( options[ showOutputProperty ] || true )
        };

        // Removes 'showOutput' from options, because it is not accepted by spawn()
        cfg.options[ showOutputProperty ] = undefined;

        // Fix problem with span() on Windows OSes
        if ( 'win32' === platform() ) {
            cfg.options[ 'shell' ] = true;
        }

        // Splits the command into pieces to pass to the process;
        //  mapping function simply removes quotes from each piece
        let cmds = command.match( /[^"\s]+|"(?:\\"|[^"])+"/g )
            .map( expr => {
                return expr.charAt( 0 ) === '"' && expr.charAt( expr.length - 1 ) === '"' ? expr.slice( 1, -1 ) : expr;
            } );

        const runCMD = cmds[ 0 ];
        cmds.shift();

        return new Promise( ( resolve, reject ) => {

            const child = spawn( runCMD, cmds, cfg.options );

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
