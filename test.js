const { expect } = require('chai');
const { execSync } = require('child_process');

describe('Bengine CLI', () => {
    const cliPath = 'node ./bengine-cli.js'; // Adjusted to call the CLI from the root of the repository

    describe('General CLI Tests', () => {
        it('should display version', () => {
            const output = execSync(`${cliPath} -v`).toString();
            expect(output).to.match(/Bengine CLI: v[\d.]+/);
        });

        it('should display help information', () => {
            const output = execSync(`${cliPath} --help`).toString();
            expect(output).to.include('Bengine CLI Tool');
        });

        // it('should update CLI', () => {
        //     const output = execSync(`${cliPath} cli update`).toString();
        //     expect(output).to.include('CLI updated successfully'); // Modify expected output based on actual implementation
        // });
    });

    // describe('Extension Management Tests', () => {
    //     const extensionName = 'testExtension'; // Test extension name

    //     it('should create a new extension', () => {
    //         const output = execSync(`${cliPath} ext new ${extensionName}`).toString();
    //         expect(output).to.include(`Extension ${extensionName} created successfully`);
    //     });

    //     it('should pack an extension', () => {
    //         const output = execSync(`${cliPath} ext pack ${extensionName}`).toString();
    //         expect(output).to.include(`Extension ${extensionName} packed successfully`);
    //     });

    //     it('should deploy an extension', () => {
    //         const output = execSync(`${cliPath} ext deploy ${extensionName}`).toString();
    //         expect(output).to.include(`Extension ${extensionName} deployed successfully`);
    //     });

    //     it('should install an extension', () => {
    //         const output = execSync(`${cliPath} ext install ${extensionName}`).toString();
    //         expect(output).to.include(`Extension ${extensionName} installed successfully`);
    //     });

    //     it('should uninstall an extension', () => {
    //         const output = execSync(`${cliPath} ext uninstall ${extensionName}`).toString();
    //         expect(output).to.include(`Extension ${extensionName} uninstalled successfully`);
    //     });

    //     it('should list all extensions', () => {
    //         const output = execSync(`${cliPath} ext ls`).toString();
    //         expect(output).to.include('List of installed extensions');
    //     });
    // });

    // describe('Core Management Tests', () => {
    //     it('should download and install a new core instance', () => {
    //         const output = execSync(`${cliPath} core new`).toString();
    //         expect(output).to.include('New bengine core instance installed successfully');
    //     });

    //     it('should update the core', () => {
    //         const output = execSync(`${cliPath} core update`).toString();
    //         expect(output).to.include('Bengine core updated successfully');
    //     });

    //     it('should start the core services', () => {
    //         const output = execSync(`${cliPath} core start`).toString();
    //         expect(output).to.include('Bengine core services started successfully');
    //     });

    //     it('should stop the core services', () => {
    //         const output = execSync(`${cliPath} core stop`).toString();
    //         expect(output).to.include('Bengine core services stopped successfully');
    //     });

    //     it('should list core activities and running services', () => {
    //         const output = execSync(`${cliPath} core ls`).toString();
    //         expect(output).to.include('List of Bengine core activities');
    //     });
    // });
});
