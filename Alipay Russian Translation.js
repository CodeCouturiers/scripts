// ==UserScript==
// @name         Alipay Russian Translation
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Полный русский перевод Alipay
// @author       Your name
// @match        *://*.alipay.com/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';
    const translations = {
        // Заголовок и мета
        "我的支付宝 － 支付宝": "Мой Alipay - Alipay",

        // Верхнее меню
        "生活好助手": "Помощник для жизни",
        "我的应用": "Мои приложения",
        "收起": "Свернуть",
        "展开": "Развернуть",
        "立即下载": "Скачать сейчас",
        "支付宝钱包": "Кошелек Alipay",
        "随时随地使用应用": "Используйте приложения в любое время и в любом месте",

        // Баннер и профиль
        "晚上好": "Добрый вечер",
        "账户名": "Имя аккаунта",
        "未认证": "Не подтверждено",
        "已认证": "Подтверждено",
        "上次登录时间": "Последний вход",
        "补充身份信息": "Дополнить информацию",
        "了解更多": "Узнать больше",
        "查看全部消息": "Просмотреть все сообщения",
        "转账看头像，安全有保障": "Безопасные переводы с аватаром",
        "修改头像": "Изменить аватар",

        // Основной счет
        "账户余额": "Баланс счета",
        "余额支付": "Платеж с баланса",
        "已开启": "Включено",
        "充值": "Пополнить",
        "提现": "Вывести",
        "转账": "Перевести",
        "点击显示金额": "Нажмите чтобы показать сумму",

        // Другие счета
        "其他账户": "Другие счета",
        "更多": "Ещё",
        "银行卡": "Банковские карты",
        "阿里账户": "Счет Alibaba",
        "管理": "Управление",
        "进入账户通": "Войти в центр счетов",

        // Yu'ebao и другие продукты
        "余额宝": "Yu'ebao",
        "什么是余额宝": "Что такое Yu'ebao",
        "详细介绍": "Подробнее",
        "转入": "Пополнить",
        "随取随用": "Доступно в любое время",
        "天天可赚收益": "Ежедневный доход",
        "被盗全额赔付": "Полная компенсация при краже",
        "教你用余额宝": "Как использовать Yu'ebao",
        "详情": "Подробности",

        // Транзакции и записи
        "交易记录": "История транзакций",
        "充值记录": "История пополнений",
        "提现记录": "История выводов",
        "退款记录": "История возвратов",
        "查看所有交易记录": "Посмотреть всю историю",
        "余额收支明细": "Детали баланса",
        "余额宝收支明细": "Детали Yu'ebao",
        "花呗额度明细": "Детали кредитного лимита Huabei",

        // Рекомендации
        "小二推荐": "Рекомендации",
        "关闭": "Закрыть",

        // Футер
        "诚征英才": "Вакансии",
        "联系我们": "Связаться с нами",
        "International Business": "Международный бизнес",

        // Безопасность и статусы
        "安全设置": "Настройки безопасности",
        "实名认证": "Подтверждение личности",
        "密保问题": "Контрольные вопросы",
        "支付密码": "Платежный пароль",
        "绑定手机": "Привязка телефона",
        "已绑定手机": "Телефон привязан",
        "未绑定手机": "Телефон не привязан",
        "手机已验证": "Телефон подтвержден",
        "手机未验证": "Телефон не подтвержден",
        "设置": "Настройки",
        "修改": "Изменить",

        // Дополнительные элементы
        "集分宝": "Баллы JFB",
        "个": "шт.",
        "红包": "Red Packets",
        "支付宝购物卡": "Подарочная карта Alipay",

        // Системные сообщения
        "加载失败，稍等再试试吧": "Ошибка загрузки, попробуйте позже",
        "重试": "Повторить",
        "暂时没有数据": "Данные временно отсутствуют",
        "请输入搜索文字": "Введите текст для поиска",

        // Уведомления и подсказки
        "申请实名认证后，可享受更多特权": "После подтверждения личности вы получите больше привилегий",
        "您已绑定手机": "Ваш телефон привязан",
        "立即认证": "Подтвердить сейчас",

        // Разделы приложений
        "全部": "Все",
        "常逛": "Часто используемые",
        "买过": "Купленные",
        "最近关注": "Недавно отмеченные",
        "特别关注": "Особые отметки",
        "有上新": "Есть новинки",

        // Счета и операции
        "我的订单": "Мои заказы",
        "退款管理": "Управление возвратами",
        "个人交易设置": "Настройки личных сделок",
        "WangWang网页版设置": "Настройки веб-версии WangWang",
        "应用授权": "Авторизация приложений",
        // Системные уведомления и ошибки
"您现在使用的浏览器版本过低，可能会导致部分图片和信息的缺失": "Версия вашего браузера устарела, это может привести к потере части изображений и информации",
"请立即": "Пожалуйста, немедленно",
"免费升级": "бесплатно обновите",
"或下载使用": "или загрузите",
"安全更放心": "для большей безопасности",
"查看帮助": "Смотреть справку",
"加载中...": "Загрузка...",
"loading-bounce": "Загрузка",
"您的浏览器版本太低，为保障信息的安全": "Версия вашего браузера слишком старая, для обеспечения безопасности информации",
"请于2月28日前升级浏览器": "обновите браузер до 28 февраля",

// Технические элементы
"seajs以及插件": "seajs и плагины",
"seajs config 配置": "Конфигурация seajs",
"兼容原有的 plugin-i18n 写法": "Совместимость с существующим написанием plugin-i18n",
"路由旧 ID": "Маршрутизация старых ID",
"monitor 防错代码": "Код предотвращения ошибок монитора",

// Служебные сообщения
"干掉载入 plugin-i18n.js，避免 404": "Удалить загрузку plugin-i18n.js, чтобы избежать 404",
"获取原有fontFace节点": "Получить существующий узел fontFace",
"避免用户重复请求时，重复添加": "Избежать повторного добавления при повторных запросах пользователя",
"获取cookie": "Получить cookie",
"展示升级公告": "Показать объявление об обновлении",
"删除升级公告": "Удалить объявление об обновлении",

// Элементы навигации и меню
"全站广告": "Реклама на всем сайте",
"全站公告": "Объявления на всем сайте",
"全站 tracker 开关": "Переключатель tracker для всего сайта",
"网站改版导航新老版本切换开关": "Переключатель между новой и старой версиями навигации сайта",
"设置ab位": "Установить позиции ab",
"云客服匹配": "Сопоставление облачной службы поддержки",
"云客服通用样式": "Общие стили облачной службы поддержки",

// Функциональные элементы интерфейса
"在线客服默认图片": "Изображение по умолчанию для онлайн-поддержки",
"小二推荐": "Рекомендации помощника",
"生活好助手": "Помощник для жизни",
"展开": "Развернуть",
"收起": "Свернуть",
"我的应用": "Мои приложения",
"立即下载": "Скачать сейчас",
"随时随地使用应用": "Используйте приложения в любое время и в любом месте",

// Информация об аккаунте
"账户名": "Имя аккаунта",
"已认证": "Подтверждено",
"未认证": "Не подтверждено",
"上次登录时间": "Время последнего входа",
"补充身份信息": "Дополнить информацию",
"了解更多": "Узнать больше",
"转账看头像，安全有保障": "Безопасные переводы с аватаром",
"修改头像": "Изменить аватар",

// Управление безопасностью
"安全设置": "Настройки безопасности",
"实名认证": "Подтверждение личности",
"密保问题": "Контрольные вопросы",
"支付密码": "Платежный пароль",
"绑定手机": "Привязать телефон",
"已绑定手机": "Телефон привязан",
"未绑定手机": "Телефон не привязан",
"手机已验证": "Телефон подтвержден",
"手机未验证": "Телефон не подтвержден",

// Финансовая информация
"账户余额": "Баланс счета",
"余额支付": "Платеж с баланса",
"已开启": "Включено",
"充值": "Пополнить",
"提现": "Вывести",
"转账": "Перевести",
"点击显示金额": "Нажмите, чтобы показать сумму",
"银行卡": "Банковские карты",
"阿里账户": "Счет Alibaba",
"管理": "Управление",

// Yu'ebao и финансовые продукты
"余额宝": "Yu'ebao",
"什么是余额宝": "Что такое Yu'ebao",
"详细介绍": "Подробное описание",
"转入": "Пополнить",
"随取随用": "Доступно в любое время",
"天天可赚收益": "Ежедневный доход",
"被盗全额赔付": "Полная компенсация при краже",

// Операции и транзакции
"交易记录": "История транзакций",
"充值记录": "История пополнений",
"提现记录": "История выводов",
"退款记录": "История возвратов",
"资金明细": "Детали движения средств",
"余额收支明细": "Детали баланса",
"余额宝收支明细": "Детали Yu'ebao",
"花呗额度明细": "Детали кредитного лимита Huabei",

// Дополнительные функции
"集分宝": "Баллы JFB",
"红包": "Красные конверты",
"支付宝购物卡": "Подарочная карта Alipay",
"商家服务": "Услуги для продавцов",
"我的订单": "Мои заказы",
"退款管理": "Управление возвратами",
"个人交易设置": "Настройки личных сделок",

// Интерфейс и навигация
"全部应用": "Все приложения",
"常用应用": "Часто используемые",
"应用管理": "Управление приложениями",
"搜索应用": "Поиск приложений",
"返回顶部": "Вернуться наверх",
"展开导航": "Развернуть навигацию",
"收起导航": "Свернуть навигацию",

// Сообщения и уведомления
"消息中心": "Центр сообщений",
"系统消息": "Системные сообщения",
"交易消息": "Сообщения о транзакциях",
"服务消息": "Сервисные сообщения",
"未读消息": "Непрочитанные сообщения",
"全部消息": "Все сообщения",

// Помощь и поддержка
"帮助中心": "Центр помощи",
"在线客服": "Онлайн поддержка",
"意见反馈": "Обратная связь",
"投诉中心": "Центр жалоб",
"常见问题": "Частые вопросы",

// Безопасность и аутентификация
"安全验证": "Проверка безопасности",
"身份认证": "Идентификация личности",
"实名认证状态": "Статус подтверждения личности",
"更改绑定手机": "Изменить привязанный телефон",
"修改登录密码": "Изменить пароль для входа",
"设置支付密码": "Установить платежный пароль",

// Управление счетом
"账户信息": "Информация о счете",
"账户设置": "Настройки счета",
"账户安全": "Безопасность счета",
"注销账户": "Удалить аккаунт",
"冻结账户": "Заморозить аккаунт",
"解冻账户": "Разморозить аккаунт",

// Партнерская программа
"我的推荐": "Мои рекомендации",
"推荐奖励": "Награды за рекомендации",
"邀请好友": "Пригласить друзей",
"推广链接": "Реферальные ссылки",

// Статусы и состояния
"处理中": "В обработке",
"已完成": "Завершено",
"已取消": "Отменено",
"待处理": "Ожидает обработки",
"已过期": "Истекло",
"审核中": "На проверке",
"审核通过": "Проверка пройдена",
"审核失败": "Проверка не пройдена",

// Интерфейс мобильного приложения
"支付宝钱包": "Кошелек Alipay",
"扫一扫": "Сканировать",
"付款码": "Код оплаты",
"收款码": "Код для получения",
"手机充值": "Пополнение мобильного",
"生活缴费": "Оплата услуг",

// Финансовые услуги
"理财产品": "Финансовые продукты",
"基金": "Фонды",
"股票": "Акции",
"保险": "Страхование",
"黄金": "Золото",
"理财收益": "Доход от инвестиций",

// Дополнительные сервисы
"信用服务": "Кредитные услуги",
"芝麻信用": "Кредитный рейтинг Zhima",
"蚂蚁借呗": "Кредит Ant",
"花呗": "Huabei",
"网商贷": "Бизнес-кредит",

// Платформа и партнеры
"淘宝网": "Taobao",
"天猫": "Tmall",
"蚂蚁金服": "Ant Financial",
"支付宝国际": "Alipay International",
"口碑": "Koubei",
"饿了么": "Ele.me"
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
