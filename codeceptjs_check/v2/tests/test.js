Feature( 'Foo' );

Scenario( 'Bar', async ( I ) => {
    await I.runCommand( 'echo "--- WORKING AS EXPECTED ---"' );
} );