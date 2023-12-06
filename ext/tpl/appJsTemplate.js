const { codeTemplate } = require('./utils');

module.exports = (extensionName) => codeTemplate`
const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const port = 3001;

app.use(bodyParser.json());

app.get('/status', (req, res) => {
    res.status(200).send({
        status: 'OK',
        message: '${extensionName} API is running'
    })
});

app.listen(port, () => {
    console.log(\`${extensionName} API listening at http://localhost:\${port}\`);
});
`;
