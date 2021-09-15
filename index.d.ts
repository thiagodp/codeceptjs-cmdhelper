export = CmdHelper;
/**
 * Command helper
 *
 * @author Thiago Delgado Pinto
 */
declare class CmdHelper {
    /**
     * Constructor
     *
     * @param {object} config Configuration declared in the CodeceptJS configuration file.
     */
    constructor(config: object);
    options: any;
    /**
     * Executes the given command.
     *
     * @param {string} command Command to execute.
     * @param {object} [options] Same options as in NodeJS' spawn(), plus `showOutput: boolean`. Optional. Default is `{ shell: true, showOutput: true }`.
     *
     * @returns Promise with the returning execution status code (0 means success)
     */
    runCommand(command: string, options?: object): any;
}
