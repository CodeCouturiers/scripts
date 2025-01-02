// Получаем все внешние CSS файлы
const externalCSSFiles = Array.from(document.styleSheets)
    .filter(styleSheet => styleSheet.href)
    .map(styleSheet => styleSheet.href);

// Получаем все внешние JavaScript файлы
const externalJSFiles = Array.from(document.scripts)
    .filter(scriptElement => scriptElement.src)
    .map(scriptElement => scriptElement.src);

// Выводим результаты
console.log('Внешние CSS файлы:');
externalCSSFiles.forEach(cssFile => console.log(cssFile));

console.log('\nВнешние JavaScript файлы:');
externalJSFiles.forEach(jsFile => console.log(jsFile));

// Выводим общее количество
console.log(`\nВсего найдено:\nCSS файлов: ${externalCSSFiles.length}\nJavaScript файлов: ${externalJSFiles.length}`);
