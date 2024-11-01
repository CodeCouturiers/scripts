// ==UserScript==
// @name         Taobao Complete Russian Translation
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Полный русский перевод Taobao
// @author       Your name
// @match        *://*.taobao.com/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    const translations = {
        // Верхнее меню и навигация
        "请登录": "Войти",
        "手机逛淘宝": "Мобильное приложение",
        "淘宝网首页": "Главная",
        "我的淘宝": "Личный кабинет",
        "购物车": "Корзина",
        "收藏夹": "Избранное",
        "商品分类": "Категории товаров",
        "免费开店": "Открыть магазин",
        "联系客服": "Служба поддержки",
        "网站导航": "Навигация по сайту",

        // Личный кабинет
        "我的足迹": "История просмотров",
        "已买到的宝贝": "Мои заказы",
        "我的购物车": "Моя корзина",
        "购买过的店铺": "История покупок",
        "收藏的宝贝": "Избранные товары",
        "收藏的店铺": "Избранные магазины",
        "我的卡券包": "Мои купоны",
        "我的发票": "Счета и чеки",
        "评价管理": "Мои отзывы",

        // Статусы заказов
        "交易成功": "Заказ завершен",
        "等待付款": "Ожидает оплаты",
        "等待发货": "В обработке",
        "等待收货": "В доставке",
        "等待评价": "Ожидает отзыв",
        "交易关闭": "Заказ отменен",
        "退款中": "Возврат",
        "交易异常": "Проблема с заказом",

        // Детали заказа
        "订单详情": "Детали заказа",
        "收货地址": "Адрес доставки",
        "订单编号": "Номер заказа",
        "实付款": "Итоговая сумма",
        "运费": "Доставка",
        "优惠": "Скидка",
        "数量": "Количество",
        "单价": "Цена",
        "合计": "Итого",

        // Действия с заказами
        "申请售后": "Вернуть товар",
        "查看详情": "Подробнее",
        "删除订单": "Удалить",
        "投诉卖家": "Пожаловаться",
        "确认收货": "Подтвердить получение",
        "立即付款": "Оплатить",
        "追加评论": "Добавить отзыв",
        "取消订单": "Отменить заказ",

        // Параметры товара
        "颜色分类": "Цвет",
        "尺码": "Размер",
        "型号": "Модель",
        "规格": "Спецификация",
        "款式": "Стиль",
        "材质": "Материал",

        // Информация о доставке
        "物流信息": "Информация о доставке",
        "运单号": "Трек-номер",
        "已发货": "Отправлено",
        "运输中": "В пути",
        "已签收": "Получено",

        // Сообщения и уведомления
        "消息": "Сообщения",
        "系统通知": "Уведомления",
        "交易物流": "Статус доставки",
        "商家通知": "От продавца",
        "活动消息": "Акции",

        // Дополнительные функции
        "退款维权": "Споры и возвраты",
        "退款/退货": "Возврат денег/товара",
        "投诉管理": "Жалобы",
        "举报管理": "Нарушения",
        "安全设置": "Безопасность",
        "账户设置": "Настройки профиля",
        "绑定手机": "Привязать телефон",
        "支付宝账户": "Alipay аккаунт",
    };

    // Функция для безопасной замены текста без влияния на JS
    function safeTranslate(node) {
        if (node.nodeType === 3) { // Текстовый узел
            let text = node.nodeValue;
            let translated = false;

            for (let [key, value] of Object.entries(translations)) {
                if (text.includes(key)) {
                    text = text.replace(new RegExp(key, 'g'), value);
                    translated = true;
                }
            }

            if (translated) {
                node.nodeValue = text;
            }
        } else if (node.nodeType === 1) { // Элемент
            // Пропускаем скрипты и стили
            if (node.nodeName !== 'SCRIPT' &&
                node.nodeName !== 'STYLE' &&
                !node.classList.contains('no-translate')) {

                // Переводим title и placeholder если есть
                if (node.hasAttribute('title')) {
                    let title = node.getAttribute('title');
                    for (let [key, value] of Object.entries(translations)) {
                        if (title.includes(key)) {
                            node.setAttribute('title', title.replace(key, value));
                        }
                    }
                }

                if (node.hasAttribute('placeholder')) {
                    let placeholder = node.getAttribute('placeholder');
                    for (let [key, value] of Object.entries(translations)) {
                        if (placeholder.includes(key)) {
                            node.setAttribute('placeholder', placeholder.replace(key, value));
                        }
                    }
                }

                // Рекурсивно обрабатываем дочерние узлы
                Array.from(node.childNodes).forEach(safeTranslate);
            }
        }
    }

    // Функция для запуска перевода
    function startTranslation() {
        safeTranslate(document.body);
    }

    // Наблюдатель за изменениями DOM
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) {
                        safeTranslate(node);
                    }
                });
            }
        });
    });

    // Запускаем наблюдатель
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Запускаем начальный перевод
    startTranslation();

    // Периодически проверяем новые элементы
    setInterval(startTranslation, 2000);

})();
