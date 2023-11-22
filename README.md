# Bengine CLI

Bengine CLI is a command-line interface for managing Bengine extensions and core functionalities. This tool simplifies tasks such as creating, packing, deploying extensions, and cloning the Bengine core repository.

## Installation

To install Bengine CLI, follow these steps:

1. Clone the repository:
   `git clone https://github.com/yourusername/bengine-cli.git`

2. Navigate to the cloned directory:
   `cd bengine`

3. Install the dependencies:
   `npm install`

4. Link the CLI for global usage:
   `npm link`

## Usage

Once installed, you can use the `bengine` command to perform various operations. Below are the available commands:

### Creating a New Extension

To create a new extension:

`bengine ext new <extension-name>`

This command creates a new directory for the extension with all the necessary files and structure.

### Packing an Extension

To pack an existing extension:

`bengine ext pack <extension-name>`

This command packs the specified extension into a zip file and places it in the `_releases` directory.

### Deploying an Extension

To deploy an extension:

`bengine ext deploy <extension-name>`

This command deploys the specified extension to the GitHub repository under the specified version.

### Cloning the Bengine Core

To clone the Bengine core repository:

`bengine core new`

This command clones the Bengine core repository to your local machine.

### Getting Help

For help and a list of available commands:

`bengine --help`

### Checking the Version

To check the current version of Bengine CLI:

`bengine --version`

## Contributing

Contributions to the Bengine CLI are welcome. Please follow the standard GitHub pull request process to submit your changes.

## Support and Queries

For support or further inquiries, reach out to [support@bengine.ai](mailto:support@bengine.ai).

Thank you for using and contributing to Bengine CLI!
