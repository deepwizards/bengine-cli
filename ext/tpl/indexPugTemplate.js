const { codeTemplate } = require('./utils');

module.exports = (extensionName) => codeTemplate`
extends ../../../common/_layout

block content
    .container-fluid
        h1 ${extensionName}
`;
