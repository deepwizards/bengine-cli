const { codeTemplate } = require('./utils');

module.exports = (extensionName) => codeTemplate`
const router = require('express').Router();

router.get('/', async (req, res) => {
    res.render('${extensionName}/views/index', {
        title: '${extensionName}'
    });
});

module.exports = router;
`;
