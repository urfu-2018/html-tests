'use strict';

const blockElements = [
    'address', 'article', 'aside', 'blockquote', 'canvas', 'dd', 'div', 'dl',
    'fieldset', 'figcaption', 'figure',
    'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hgroup',
    'hr', 'main', 'nav', 'noscript',
    'ol', 'output', 'p', 'pre', 'section', 'table', 'tfoot', 'ul', 'video'
];

const inlineElements = [
    'b', 'big', 'i', 'small', 'tt', 'abbr', 'cite', 'code', 'dfn', 'em', 'kbd',
    'strong', 'samp', 'var', 'a', 'bdo',
    'br', 'img', 'map', 'object', 'q', 'script', 'span', 'sub', 'sup', 'button',
    'input', 'label', 'select', 'textarea',
    'image'
];

const emptyElements = [
    'link', ' track', 'param', 'area', 'command', 'col', 'base', 'meta', 'hr',
    'source', 'img', 'keygen', 'br', 'wbr', 'input'
];

const error = require('../error-output');

exports.wrongSpacesChecker = function (html, showMessage) {
    let found = 0;

    html.split('\n').forEach((line, i) => {
        const spaces = line.match(/^[^\t\S]+/);

        if (!spaces) {
            return;
        }

        if (spaces[0].length % 4 !== 0) {
            found += 1;

            if (showMessage) {
                console.error(`    Ошибка. Строка ${i + 1}. Кол-во пробелов в отступе не кратно четырем.`);
            }
        }
    });

    return found;
};

exports.getClosedEmptyElements = function (html, showMessage) {
    let found = 0;

    emptyElements.forEach(emptyElem => {
        const pattern = new RegExp(`<\\s*${emptyElem}[^>/]*/>`, 'g');

        if (pattern.test(html)) {
            found += 1;

            if (showMessage !== false) {
                const msg = `Закрытый одиночный тег ${emptyElem}.`;

                error(pattern, msg, html);
            }
        }
    });

    return found;
};

exports.getBlockInsideInline = function (html, showMessage) {
    const msg = showMessage === false ? false : 'Строчный тег {{elem}}, в который вложен блочный {{prohibited}}.';

    return checkIncorrectBlocksLocation(html, inlineElements, blockElements, msg);
};

exports.getBlockInsideP = function (html, showMessage) {
    const msg = showMessage === false ? false : 'Блочный элемент {{prohibited}} внутри тега <p>.';

    return checkIncorrectBlocksLocation(html, ['p'], blockElements, msg);
};

exports.findImagesWithoutAlt = function (html, showMessage) {
    const pattern = /<\s*img[^>]*>/ig;
    const images = html.match(pattern) || [];
    let found = 0;

    images.forEach(image => {
        const hasAlt = /\salt=(?!(""|''))/.test(image);

        if (!hasAlt) {
            if (showMessage !== false) {
                error(pattern, 'Картинка с отсутствующим или пустым атрибутом alt.', html);
            }

            found += 1;
        }
    });

    return found;
};

function checkIncorrectBlocksLocation(html, parents, prohibitedChildren, message) {
    let count = 0;

    parents.forEach(elem => {
        prohibitedChildren.forEach(prohibited => {

            const pattern = new RegExp(`<\\s*${elem}[^><]*>[^<]*<\\s*(${prohibited
            })[^>]*>.*</\\1>.*</${elem}>`, 'g');

            if (pattern.test(html)) {
                count += 1;

                if (message) {
                    message = message.replace('{{elem}}', `<${elem}>`);
                    message = message.replace('{{prohibited}}', `<${prohibited}>`);
                    error(pattern, message, html);
                }
            }
        });
    });

    return count;
}
