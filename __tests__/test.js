const CmdHelper = require( '..' );

describe( 'CmdHelper', () => {

    it( 'can run command', async () => {
        let helper = new CmdHelper();
        await helper.runCommand( 'echo "foo"' );
    } );

    it( 'can run command with options', async () => {
        let helper = new CmdHelper();
        await helper.runCommand( 'echo "bar"', { showOutput: false } );
    } );

    it( 'does not emit DEP0190 when running a command with arguments (shell: true)', ( done ) => {
        // Run in a subprocess so the warning is not suppressed by Node's once-per-process dedup
        const { spawn } = require( 'child_process' );
        const script = `
            const CmdHelper = require( '.' );
            const helper = new CmdHelper();
            helper.runCommand( 'echo hello world', { showOutput: false } ).then( () => process.exit( 0 ) );
        `;
        const child = spawn( process.execPath, [ '-e', script ], { cwd: require( 'path' ).join( __dirname, '..' ) } );
        let stderr = '';
        child.stderr.on( 'data', ( chunk ) => { stderr += chunk; } );
        child.on( 'exit', () => {
            if ( stderr.includes( 'DEP0190' ) ) {
                done( new Error( `Unexpected DEP0190 warning emitted:\n${stderr}` ) );
            } else {
                done();
            }
        } );
    } );

} );