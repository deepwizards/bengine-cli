function codeTemplate(strings, ...expressions) {
    return strings.reduce((accumulator, part, i) => {
        return accumulator + part + (expressions[i] || '');
    }, '');
}

module.exports = {
    codeTemplate
};
