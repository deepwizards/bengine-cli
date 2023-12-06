#!/usr/bin/env node

const { program } = require('commander');
const createExtension = require('./ext/createExtension');
const packExtension = require('./ext/packExtension');
const deployExtension = require('./ext/deployExtension');
const installExtension = require('./ext/installExtension');
const uninstallExtension = require('./ext/uninstallExtension');
const listExtensions = require('./ext/listExtensions');
const newCore = require('./core/newCore');
const startCore = require('./core/startCore');
const stopCore = require('./core/stopCore');
const listBengineActivity = require('./core/listBengineActivity');

program
    .version('Bengine CLI: v' + require('./package.json').version, '-v, --version')
    .description('Bengine CLI Tool - A comprehensive command-line interface for managing Bengine extensions and core functionalities.');

program.command('cli update')
.description('Update the Bengine CLI to the latest version')
.action(() => {
    updateCLI();
});

const ext = program.command('ext')
    .description('Manage extensions for Bengine');

ext.command('new <name>')
    .description('Create a new extension')
    .action((name) => {
        createExtension(name);
    });

ext.command('pack <name>')
    .description('Pack an existing extension')
    .action((name) => {
        packExtension(name);
    });

ext.command('deploy <name>')
    .description('Deploy an extension')
    .action((name) => {
        deployExtension(name);
    });

ext.command('install <name>')
    .description('Install an extension')
    .action((name) => {
        installExtension(name);
    });

ext.command('uninstall <name>')
    .description('Uninstall an extension')
    .action((name) => {
        uninstallExtension(name);
    });

ext.command('ls')
    .description('List all extensions and their information')
    .action(() => {
        listExtensions();
    });

const core = program.command('core')
    .description('Manage the Bengine core functionalities');

core.command('new')
    .description('Download and install a new bengine core instance')
    .action(() => {
        newCore();
    });

core.command('update')
    .description('Update the Bengine core to the latest version')
    .action(() => {
        updateCore();
    });

core.command('start')
    .description('Start the Bengine core services')
    .action(() => {
        startCore();
    });

core.command('stop')
    .description('Stop the Bengine core services')
    .action(() => {
        stopCore();
    });

core.command('ls')
    .description('List Bengine core activities and running services')
    .action(() => {
        listBengineActivity();
    });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
    program.outputHelp();
}
