'use strict';

module.exports = function (pattern, message, html) {
    console.log('');

    html = html || require('./getHtml');
    const matches = html.match(pattern);

    let currentLine = 1;

    matches.forEach(match => {
        const idx = html.indexOf(match);

        const htmlBeforeMatch = html.substr(0, idx);

        const linesBefore = htmlBeforeMatch.match(/\n/g);

        currentLine += linesBefore ? linesBefore.length : 0;

        console.log(`Ошибка в строке ${currentLine}. ${message}`);

        const linesInMatch = match.match(/\n/g);

        currentLine += linesInMatch ? linesInMatch.length : 0;

        const htmlToCut = html.substr(0, idx + match.length);

        html = html.replace(htmlToCut, '');
    });

    console.log('');
};
