'use strict';

require('should');

const regExps = require('../task-stub/test/staff/regExps');
const utils = require('../task-stub/test/staff/utils');
const fs = require('fs');

const largeHtml = fs.readFileSync('test/html/large.html', 'utf-8');

describe('Пустые строки.', () => {
    it('Должны обнаруживаться две пустые строки подряд.', () => {
        const pattern = regExps.twoLineBreaksInARow();
        const html = `${largeHtml}\n\n<div>слово</div>`;

        pattern.test(html).should.be.eql(true);
    });

    it('Должны обнаруживаться две пустые строки подряд в перемешку с пробелами.', () => {
        const pattern = regExps.twoLineBreaksInARow();
        const html = `${largeHtml}\n  \n  <div>слово</div>`;

        pattern.test(html).should.be.eql(true);
    });

    it('Не должны обнаруживаться две пустые строки подряд, если их нет.', () => {
        const pattern = regExps.twoLineBreaksInARow();
        const html = `${largeHtml}<div> \n  \n <div>слово</div>`;

        pattern.test(html).should.be.eql(false);
    });
});

describe('Поиск пробелов в неположенных местах.', () => {
    describe('Выражение для поиска пробелов после открывающих тегов.', () => {
        const pattern = regExps.spaceAfterTag();

        it('Должен обнаруживаться пробел после открывающего тега-1.', () => {
            const html = `${largeHtml}\n<p> Слово</p>`;

            pattern.test(html).should.be.eql(true);
        });

        it('Должен обнаруживаться пробел после открывающего тега-2.', () => {
            const html = `${largeHtml}\n<p>Слово<span> тест</span></p>`;

            pattern.test(html).should.be.eql(true);
        });

        it('Не должены обнаруживаться пробелы после открывающихся тегов, если таких пробелов нет.', () => {
            const html = `${largeHtml}\n< p >\nСлово< span >тест< /span >< /p >`;

            pattern.test(html).should.be.eql(false);
        });
    });

    describe('Выражение для поиска пробелов перед закрывающими тегами.', () => {
        it('Должен обнаруживаться пробел перед закрывающи тегом-1.', () => {
            const pattern = regExps.spaceBeforeClosingTag();
            const html = `${largeHtml}\n<p>Слово </p>`;

            pattern.test(html).should.be.eql(true);
        });

        it('Должен обнаруживаться пробел перед закрывающи тегом-2.', () => {
            const pattern = regExps.spaceBeforeClosingTag();
            const html = `${largeHtml}\n<p>Слово<span>тест </span></p>`;

            pattern.test(html).should.be.eql(true);
        });

        it('Не должены обнаруживаться пробелы перед закрывающими тегами, если таких пробелов нет.', () => {
            const pattern = regExps.spaceBeforeClosingTag();
            const html = `${largeHtml}\n< p >Слово< span >тест< /span >< /p >`;

            pattern.test(html).should.be.eql(false);
        });
    });

    describe('Пробелы после символа <.', () => {
        it('Должен обнаруживаться пробел после символа <.', () => {
            const pattern = regExps.spaceAfterLessSign();
            const html = `${largeHtml}\n< p>Слово</p>`;

            pattern.test(html).should.be.eql(true);
        });

        it('Должен обнаруживаться перенос строки после символа <.', () => {
            const pattern = regExps.spaceAfterLessSign();
            const html = `${largeHtml}\n<\np>Слово</p>`;

            const found = pattern.test(html);

            found.should.be.eql(true);
        });

        it('Не должен обнаруживаться пробел после &lt;', () => {
            const pattern = regExps.spaceAfterLessSign();
            const html = `${largeHtml}\n&lt; слово`;

            pattern.test(html).should.be.eql(false);
        });
    });
});

describe('Использование и оформление атрибутов.', () => {
    describe('Обнаружение запрещенных атрибутов.', () => {
        it('Обнаружение атрибута style.', () => {
            const html = `${largeHtml}\n<p style="color: #000;">Слово </p>`;
            const pattern = regExps.attrs('style');

            pattern.test(html).should.be.eql(true);
        });

        describe('Обнаружение атрибута border.', () => {
            it('border="1"', () => {
                const html = `${largeHtml}\n<img border="1">`;
                const pattern = regExps.attrs('border');

                pattern.test(html).should.be.eql(true);
            });

            it('border=\'1\'', () => {
                const html = `${largeHtml}\n<img border='1'>`;
                const pattern = regExps.attrs('border');

                pattern.test(html).should.be.eql(true);
            });

            it('border=1', () => {
                const html = `${largeHtml}\n<img border=1>`;
                const pattern = regExps.attrs('border');

                pattern.test(html).should.be.eql(true);
            });

            it('border не должен обнаруживаться в различных ситуациях', () => {
                const html = `${largeHtml}\n<table class="border" style="border: 1px solid #000;">border</table>`;
                const pattern = regExps.attrs('border');

                pattern.test(html).should.be.eql(false);
            });
        });
    });

    describe('Обнаружение неправильного оформления атрибутов.', () => {
        describe('Пробелы при написании атрибутов.', () => {
            it('Должен обнаруживаться пробел перед =', () => {
                const pattern = regExps.spaceBeforeEquals();
                const html = `${largeHtml}<p data-some="some" class ="some">Слово</p>`;

                pattern.test(html).should.be.eql(true);
            });

            it('Не должен обнаруживаться пробел перед =, если его нет', () => {
                const pattern = regExps.spaceBeforeEquals();
                const html = `${largeHtml}<p data-some="some" class="some">Слово</p>`;

                pattern.test(html).should.be.eql(false);
            });

            it('Не должен обнаруживаться пробел перед = вне тегов', () => {
                const pattern = regExps.spaceBeforeEquals();
                const html = `${largeHtml}<p data-some="some" class="some">Слово = слово</p>`;

                pattern.test(html).should.be.eql(false);
            });

            it('Должен обнаруживаться пробел после =', () => {
                const pattern = regExps.spaceAfterEquals();
                const html = `${largeHtml}<p data-some="some" class= "some">Слово</p>`;

                pattern.test(html).should.be.eql(true);
            });

            it('Не должен обнаруживаться пробел после =, если его нет', () => {
                const pattern = regExps.spaceAfterEquals();
                const html = `${largeHtml}<p data-some="some" class="some">Слово</p>`;

                pattern.test(html).should.be.eql(false);
            });

            it('Не должно обнаруживаться пробел после =, если = находится внутри значения атрибута.', () => {
                const pattern = regExps.spaceAfterEquals();
                const html = `${largeHtml}<video src="https://ya.ru?ratebypass= \n"`;

                pattern.test(html).should.be.eql(false);
            });

            it('Не должен обнаруживаться пробел перед = вне тегов', () => {
                const pattern = regExps.spaceAfterEquals();
                const html = `${largeHtml}<p data-some="some" class="some">Слово</p>`;

                pattern.test(html).should.be.eql(false);
            });
        });
    });
});

describe('Неправильная вложенность тегов.', () => {
    describe('Обнаружение блочных тегов внутри строчных.', () => {
        it('Должен обнаруживаться <div> в <span> в простых ситуациях', () => {
            const html = 'Начало строки\n<span><div>bad</div></span>\n' +
                '\nКонец строки<div>Слово</div>' +
                '\n<span>\n<div></div></span>';

            utils.getBlockInsideInline(html, false).should.be.eql(1);
        });

        it('Должен обнаруживаться <div> в <span> в сложных ситуациях.', () => {
            const html = `${largeHtml}\n<span>\n  Некий текст<div>Слово</div></span>`;

            utils.getBlockInsideInline(html, false).should.be.eql(1);
        });
    });

    describe('Обнаружение блочных теги внутри параграфов.', () => {
        it('Должен обнаруживаться <div> внутри <p>.', () => {
            const html = `${largeHtml}\n<p>\n  Некий текст<div>Слово</div></p>`;

            utils.getBlockInsideP(html, false).should.be.eql(1);
        });

        it('Должен обнаруживаться <table> внутри <p>.', () => {
            const html = `${largeHtml}\n<p>\n  Некий текст<table>Слово</table></p>`;

            utils.getBlockInsideP(html, false).should.be.eql(1);
        });

        it('Не должег обнаруживаться <table> внутри <p>, если его нет.', () => {
            const html = `${largeHtml}\n<p>\n  Некий текст</p><table>Слово</table>`;

            utils.getBlockInsideP(html, false).should.be.eql(0);
        });
    });
});
