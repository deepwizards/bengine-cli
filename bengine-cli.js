#!/usr/bin/env node

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const createExtension = require('./createExtension');
const packExtension = require('./packExtension');
const deployExtension = require('./deployExtension');
const cloneCore = require('./cloneCore');

yargs(hideBin(process.argv))
	.command('ext new <name>', 'Create a new extension', (yargs) => {
		yargs.positional('name', {
			describe: 'Name of the new extension',
			type: 'string'
		});
	}, (argv) => {
		createExtension(argv.name);
	})
	.command('ext pack <name>', 'Pack an existing extension', (yargs) => {
		yargs.positional('name', {
			describe: 'Name of the extension to pack',
			type: 'string'
		});
	}, (argv) => {
		packExtension(argv.name);
	})
	.command('ext deploy <name>', 'Deploy an extension', (yargs) => {
		yargs.positional('name', {
			describe: 'Name of the extension to deploy',
			type: 'string'
		});
	}, (argv) => {
		deployExtension(argv.name);
	})
	.command('core new', 'Clone the bengine core repository', () => {
		cloneCore();
	})
	.version() // Automatically infer the version from package.json
	.help() // Automatically generate help text
	.alias('version', 'v') // Allow -v as an alias for version
	.alias('help', 'h') // Allow -h as an alias for help
	.demandCommand(1, 'You need at least one command before moving on')
	.recommendCommands() // Suggest similar commands if the user makes a typo
	.strict() // Requires that one of the known commands is used
	.showHelpOnFail(true, 'Specify --help for available options') // Show help text on failur
	.argv;
