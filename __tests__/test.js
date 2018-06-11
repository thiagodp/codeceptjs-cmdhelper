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

} );