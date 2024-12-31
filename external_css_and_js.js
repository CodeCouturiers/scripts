// Получаем все внешние CSS файлы
const stylesheets = Array.from(document.styleSheets)
    .filter(stylesheet => stylesheet.href)
    .map(stylesheet => stylesheet.href);

// Получаем все внешние JavaScript файлы
const scripts = Array.from(document.scripts)
    .filter(script => script.src)
    .map(script => script.src);

// Выводим результаты
console.log('Внешние CSS файлы:');
stylesheets.forEach(href => console.log(href));

console.log('\nВнешние JavaScript файлы:');
scripts.forEach(src => console.log(src));

// Выводим общее количество
console.log(`\nВсего найдено:\nCSS файлов: ${stylesheets.length}\nJavaScript файлов: ${scripts.length}`);
