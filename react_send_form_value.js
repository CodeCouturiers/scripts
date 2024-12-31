// Функция для имитации события React
function setReactInputValue(element, value) {
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    'value'
  ).set;

  nativeInputValueSetter.call(element, value);

  const event = new Event('input', { bubbles: true });
  element.dispatchEvent(event);
}

// Заполняем поле email
const emailInput = document.querySelector('input[type="email"]');
if (emailInput) {
  setReactInputValue(emailInput, 'test@gmail.com');
} else {
  console.error('Поле ввода email не найдено');
}

// Имитируем отправку формы
const form = document.querySelector('form');
if (form) {
  const submitButton = form.querySelector('button[type="submit"]');
  if (submitButton) {
    submitButton.click(); // Нажатие на кнопку отправки
  } else {
    console.error('Кнопка отправки не найдена');
  }
} else {
  console.error('Форма не найдена');
}
