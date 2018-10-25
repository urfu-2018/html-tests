'use strict';

require('should');

const html = require('./getHtml');
const error = require('./error-output');
const regExps = require('./staff/regExps');
const utils = require('./staff/utils');

describe('Сodestyle.', () => {
    it('Не должно быть пробелов после открывающих тегов.', () => {
        const pattern = regExps.spaceAfterTag();
        const hasViolation = pattern.test(html);

        if (hasViolation) {
            error(pattern, 'Открывающий тег, после которого стоит пробел.');
        }

        hasViolation.should.be.eql(false);
    });

    it('Не должно быть пробелов перед закрывающими тегами.', () => {
        const pattern = regExps.spaceBeforeClosingTag();
        const hasViolation = pattern.test(html);

        if (hasViolation) {
            error(pattern, 'Лишний пробел после слова, за которым идет закрывающий тег.');
        }

        hasViolation.should.be.eql(false);
    });

    it('Не должно быть пробелов после символа <.', () => {
        const pattern = regExps.spaceAfterLessSign();
        const hasViolation = pattern.test(html);

        if (hasViolation) {
            error(pattern, 'Лишний пробел после символа "<".');
        }

        hasViolation.should.be.eql(false);
    });

    it('Не должно быть пробелов перед символом >.', () => {
        const pattern = regExps.spaceBeforeLessSign();
        const hasViolation = pattern.test(html);

        if (hasViolation) {
            error(pattern, 'Лишний пробел после символа "<".');
        }

        hasViolation.should.be.eql(false);
    });

    describe('Использование и оформление атрибутов.', () => {
        it('Не должно быть пробелов после = при использовании атрибутов.', () => {
            const pattern = regExps.spaceAfterEquals();
            const hasViolation = pattern.test(html);

            if (hasViolation) {
                error(pattern, 'Пробел после "=".');
            }

            hasViolation.should.be.eql(false);
        });

        it('Не должно быть пробелов перед = при использовании атрибутов.', () => {
            const pattern = regExps.spaceBeforeEquals();
            const hasViolation = pattern.test(html);

            if (hasViolation) {
                error(pattern, 'Пробел перед "=".');
            }

            hasViolation.should.be.eql(false);
        });
    });

    it('Не должно быть двух и более идущих подряд пустых строк.', () => {
        const pattern = regExps.twoLineBreaksInARow();
        const hasViolation = pattern.test(html);

        if (hasViolation) {
            error(pattern, 'После нее идут две или более пустые строки.');
        }

        hasViolation.should.be.eql(false);
    });

    describe('Проверка корректности вложенности блоков.', () => {
        it('Не должно быть блочных тегов внутри строчных.', () => {
            utils.getBlockInsideInline(html).should.be.eql(0);
        });

        it('Не должно быть блочных тегов внутри параграфов (<p>).', () => {
            utils.getBlockInsideP(html).should.be.eql(0);
        });
    });
});
