# Bengine CLI

Bengine CLI is a command-line interface for managing Bengine extensions and core functionalities. It streamlines processes such as creating, packing, deploying, installing, and uninstalling extensions, along with basic management of the Bengine core.

## Prerequisites

Before installing Bengine CLI, ensure you have the following prerequisites installed:

- **Node.js**: Bengine CLI is built on Node.js. If you don't have Node.js installed, download and install it from the Node.js official website: https://nodejs.org/

- **Docker**: Some functionalities of Bengine CLI require Docker. Download and install Docker from the official Docker website: https://www.docker.com/get-started

Ensure that both Node.js and Docker are properly installed and configured on your system by running `node -v` and `docker -v` in your command line.

## Installation

Bengine CLI can be installed either via npm (recommended for most users) or manually for development and contribution purposes.

### NPM Installation (Recommended)

1. Install the Bengine CLI globally using npm:
   `npm install bengine-cli -g`

### Manual Installation

1. Clone the repository:
   `git clone git@github.com:deepwizards/bengine-cli.git`

2. Navigate to the cloned directory:
   `cd bengine-cli`

3. Install dependencies:
   `npm install`

4. Link the CLI for global use:
   `npm link`

## Usage

Once installed, the `bengine` command is available for various operations.

### Extension Management

- **Create a New Extension**:
  - Command: `bengine ext new <extension-name>`
  - Description: Initializes a new extension with the given name, creating a directory and the necessary boilerplate files.

- **Pack an Extension**:
  - Command: `bengine ext pack <extension-name>`
  - Description: Compresses the specified extension into a zip file for distribution, placing it in the `_releases` directory.

- **Deploy an Extension**:
  - Command: `bengine ext deploy <extension-name>`
  - Description: Deploys the specified extension to a remote server or repository, typically for distribution or testing.

- **Install an Extension**:
  - Command: `bengine ext install <extension-name>`
  - Description: Installs an extension into your Bengine environment, making it available for use.

- **Uninstall an Extension**:
  - Command: `bengine ext uninstall <extension-name>`
  - Description: Removes an installed extension from your Bengine environment.

- **List All Extensions**:
  - Command: `bengine ext ls`
  - Description: Displays a list of all currently installed extensions, along with their version and status.

### Core Management

- **Clone the Bengine Core**:
  - Command: `bengine core clone`
  - Description: Clones the Bengine core repository to your local machine for development or customization.

- **Install the Bengine Core**:
  - Command: `bengine core install`
  - Description: Installs the Bengine core components, setting up the necessary environment and dependencies.

- **Update the Bengine Core**:
  - Command: `bengine core update`
  - Description: Updates the Bengine core to the latest version, pulling changes from the central repository.

- **Start Bengine Core Services**:
  - Command: `bengine core start`
  - Description: Starts the core Bengine services, initiating any background processes or servers.

- **Stop Bengine Core Services**:
  - Command: `bengine core stop`
  - Description: Stops all running Bengine core services, effectively shutting down the Bengine environment.

- **List Bengine Core Activities**:
  - Command: `bengine core ls`
  - Description: Lists all active Bengine core processes and services, providing a snapshot of the current system state.

### CLI Updates

- **Update the Bengine CLI**:
  - Command: `bengine cli update`
  - Description: Updates the Bengine CLI tool to the latest version, ensuring access to the latest features and fixes.

### General Commands

- **Get Help**:
  - Command: `bengine --help`
  - Description: Displays help information, listing all commands and their brief descriptions.

- **Check CLI Version**:
  - Command: `bengine --version`
  - Description: Displays the current version of the Bengine CLI.

## Contributing

Contributions to Bengine CLI are welcome. Please follow the standard GitHub pull request process to submit your changes.

## Support and Queries

For support or further inquiries, reach out to [support@bengine.ai](mailto:support@bengine.ai).

Thank you for using and contributing to Bengine CLI!
