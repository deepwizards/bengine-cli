const { codeTemplate } = require('./utils');

// Exporting the README template function using the tag
module.exports = (extensionName) => codeTemplate`
# bengine-${extensionName}

Welcome to \`bengine-${extensionName}\`, add your general description of the extension here.

## Features

- **Feature**: Add your list of features here

## Getting Started

### Cloning the Repository

Clone this repository to get started:

\`git clone https://github.com/deepwizards/bengine-${extensionName}.git\`

## Contribution Guidelines

Contribute to \`bengine-${extensionName}\` by following these steps:

1. **Create a Feature Branch**:
   \`git checkout -b feature/your-feature-name\`

2. **Commit Your Changes**:
   \`git commit -am "Add a new feature"\`

3. **Push to the Branch**:
   \`git push origin feature/your-feature-name\`

4. **Open a Pull Request**:
   Create a PR against the \`dev\` branch.

5. **Wait for Review and Approval**:
   A maintainer will review your PR.

6. **Merging to Main**:
   Approved PRs will be merged into the \`main\` branch.

## Contribution Best Practices

- Follow coding standards and best practices.
- Document new integrations or tools clearly.
- Test thoroughly before submitting a PR.
- Update relevant documentation with your changes.

## Support and Queries

For support or further inquiries, reach out to [ben@bengine.ai](mailto:ben@bengine.ai).

Thank you for contributing to \`bengine-${extensionName}\`!
`;
