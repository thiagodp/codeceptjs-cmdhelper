
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

        this.options = {
            // stdio: 'inherit', // <<< not working on windows!
            shell: true
        };

        if ( config && config.options ) {
            this.options = config.options;
        }
    }

    /**
     * Executes the given command.
     *
     * @param {string} command Command to execute.
     * @param {object} options Same options as in NodeJS' spawn(). Optional. Default is `{ shell: true }`.
     *
     * @returns Promise with the returning execution status code (0 means success)
     */
    runCommand( command, options ) {

        const options = options || this.options;
        const showOutput = this.showOutput || true;

        // Splits the command into pieces to pass to the process;
        //  mapping function simply removes quotes from each piece
        let cmds = command.match( /[^"\s]+|"(?:\\"|[^"])+"/g )
            .map( expr => {
                return expr.charAt( 0 ) === '"' && expr.charAt( expr.length - 1 ) === '"' ? expr.slice( 1, -1 ) : expr;
            } );

        const runCMD = cmds[ 0 ];
        cmds.shift();

        return new Promise( ( resolve, reject ) => {

            const child = childProcess.spawn( runCMD, cmds, options );

            child.stdout.on( 'data', ( chunk ) => {
                if ( showOutput ) {
                    console.log( chunk.toString() );
                }
            } );

            child.stderr.on( 'data', ( chunk ) => {
                if ( showOutput ) {
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