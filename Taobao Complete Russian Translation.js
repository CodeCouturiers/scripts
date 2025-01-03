// ==UserScript==
// @name         Taobao Complete Russian Translation
// @namespace    http://tampermonkey.net/
// @version      1.1
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
    "亲，请登录": "Пожалуйста, войдите",

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
    "账号设置": "Настройки аккаунта",
    "安全设置": "Настройки безопасности",
    "个人资料": "Личные данные",
    "账号绑定": "Привязка аккаунта",
    "支付宝绑定": "Привязка Alipay",
    "所有订单": "Все заказы",
    "待付款": "Ожидают оплаты",
    "待发货": "Ожидают отправки",
    "待收货": "Ожидают получения",
    "待评价": "Ожидают отзыва",
    "分阶段": "Поэтапно",
    "订单回收站": "Корзина заказов",
    "再次购买": "Повторить заказ",
    "订单号": "Номер заказа",
    "我的收藏": "Мои избранные",
    "我的拍卖": "Мои аукционы",
    "官方集运": "Официальная доставка",
    "网页无障碍": "Доступность для всех",
    "账号管理": "Управление аккаунтом",
    "退出": "Выйти",
    "淘气值": "Баллы Taobao",
    "普通会员": "Обычный пользователь",
    "查看你的专属权益": "Посмотреть ваши привилегии",
    "修改头像、昵称": "Изменить аватар и никнейм",
    "修改登录密码": "Изменить пароль",
    "手机绑定": "Привязка телефона",
    "密保问题设置": "Настройка секретных вопросов",
    "其他": "Другое",
    "千牛卖家中心": "Центр продавца Qianniu",
    "开店入驻": "Регистрация магазина",
    "已卖出的Товар": "Проданные товары",
    "出售中的Товар": "Товары на продаже",
    "卖家服务": "Услуги для продавцов",
    "市场": "Рынок",
    "卖家培训中心": "Учебный центр для продавцов",
    "体检中心": "Центр проверки",
    "电商学习中心": "Центр e-commerce обучения",

    // 商品操作
    "商品操作": "Действия с товаром",

    // 宝贝
    "宝贝": "Товар",

    // 交易操作
    "交易操作": "Действия с заказом",

    // 交易状态
    "交易状态": "Статус заказа",
    "等待买家付款": "Ожидает оплаты покупателем",
    "付款确认中": "Подтверждение оплаты",
    "买家已付款": "Оплачено покупателем",

    // Статусы заказов
    "交易成功": "Заказ завершен",
    "等待付款": "Ожидает оплаты",
    "等待发货": "В обработке",
    "等待收货": "В доставке",
    "等待评价": "Ожидает отзыва",
    "交易关闭": "Заказ отменен",
    "退款中": "Возврат",
    "交易异常": "Проблема с заказом",
    "交易已关闭": "Заказ закрыт",

    // Детали заказа
    "订单详情": "Детали заказа",
    "收货地址": "Адрес доставки",
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
    "申请开票": "Запросить счет",
    "查看物流": "Отследить",
    "双方已评": "Обе стороны оставили отзыв",
    "违规举报": "Сообщить о нарушении",

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
    "暂无物流信息": "Нет информации о доставке",

    // Сообщения и уведомления
    "消息": "Сообщения",
    "系统通知": "Уведомления",
    "交易物流": "Статус доставки",
    "商家通知": "От продавца",
    "活动消息": "Акции",
    "全部消息": "Все сообщения",

    // Дополнительные функции
    "退款维权": "Споры и возвраты",
    "退款/退货": "Возврат денег/товара",
    "投诉管理": "Жалобы",
    "举报管理": "Нарушения",
    "安全设置": "Безопасность",
    "账户设置": "Настройки профиля",
    "绑定手机": "Привязать телефон",
    "支付宝账户": "Alipay аккаунт",
    "全部功能": "Все функции",

    // Поиск и фильтры
    "搜索": "Поиск",
    "筛选": "Фильтр",
    "价格": "Цена",
    "销量": "Продажи",
    "信用": "Рейтинг",
    "综合排序": "Сортировка",

    // Кнопки действий
    "确定": "Подтвердить",
    "取消": "Отмена",
    "保存": "Сохранить",
    "编辑": "Редактировать",
    "删除": "Удалить",
    "关闭": "Закрыть",
    "提交": "Отправить",

    // Футер и прочее
    "帮助中心": "Центр помощи",
    "联系我们": "Связаться с нами",
    "意见反馈": "Обратная связь",
    "返回顶部": "Наверх",
    "首页": "Главная",
    "更多": "Ещё",

       // Add these entries to the translations object:
"官方插件": "Официальные плагины",
"我的报价单": "Мой прайс-лист",
"先采后付": "Оплата после получения",
"官方客服": "Официальная поддержка",
"反馈": "Отзыв",
       // Основное
"关注店铺": "Подписаться на магазин",
"退款/售后": "Возврат/Сервис",
"规则协议": "Правила и соглашения",
"淘宝规则": "Правила Taobao",
"平台服务协议": "Пользовательское соглашение",
"官方客服": "Официальная поддержка",

// Раздел для новичков
"新手上路": "Для начинающих",
"0元开店": "Бесплатное открытие магазина",
"天猫开店": "Открыть магазин на Tmall",
"商家服务": "Услуги для продавцов",

// Способы оплаты
"付款方式": "Способы оплаты",
"快捷支付": "Быстрая оплата",
"余额宝": "Yu'ebao",
"蚂蚁花呗": "Huabei",

// Особенности Taobao
"淘宝特色": "Особенности Taobao",
"旺旺": "WangWang",
"旺信": "WangXin",

// Группа компаний
"阿里巴巴集团": "Группа Alibaba",
"淘宝": "Taobao",
"天猫": "Tmall",
"1688": "1688",
"一淘": "ETao",
"阿里健康": "Alibaba Health",
"全球速卖通": "AliExpress",
"阿里巴巴国际站": "Alibaba.com",
"高德": "Amap",
"飞猪": "Fliggy",
"优酷": "Youku",
"大麦": "Damai",
"阿里影业": "Alibaba Pictures",
"钉钉": "DingTalk",
"支付宝": "Alipay",
"阿里妈妈": "Alimama",
"阿里云": "Alibaba Cloud",

// Информация о компании
"关于淘宝": "О Taobao",
"营销中心": "Маркетинговый центр",
"廉政举报": "Сообщить о коррупции",
"开放平台": "Открытая платформа",
"诚征英才": "Вакансии",
"隐私权政策": "Политика конфиденциальности",
"法律声明": "Правовая информация",
"知识产权": "Интеллектуальная собственность",

// Официальная информация
"版权所有": "Все права защищены",
"增值电信业务经营许可证": "Лицензия на телекоммуникационные услуги",
"浙网文": "Лицензия на интернет-контент",
"网络订餐服务第三方平台备案": "Регистрация платформы доставки еды",
"互联网药品信息服务资格证书": "Лицензия на информационные услуги о лекарствах",
"短消息类服务接入代码使用证书": "Сертификат на использование SMS-сервисов",
"信息网络传播视听许可证": "Лицензия на аудио-видео контент",
"全国12315平台": "Национальная платформа защиты прав потребителей",
"浙江省互联网违法和不良信息举报中心": "Центр по борьбе с незаконным контентом",
"全网举报": "Сообщить о нарушении",
       // Разделы навигации
"全部": "Все",
"常逛": "Часто посещаемые",
"买过": "Купленные",

// Раздел подписок
"最近关注": "Недавно отмеченные",
"特别关注": "Особые отметки",
"有上新": "Есть новинки",
"我的订单": "Мои заказы",
       "退款管理": "Управление возвратами",
       "个人交易设置": "Настройки личных сделок",
"WangWang网页版设置": "Настройки веб-версии WangWang",
"应用授权": "Авторизация приложений",

"我的物流": "Моя доставка",
"加载失败，稍等再试试吧": "Ошибка загрузки, попробуйте позже",
"重试": "Повторить",
"猜你喜欢": "Рекомендации для вас",
"暂时没有数据": "Данные временно отсутствуют",
"红包": "Красный конверт",
"商家客服": "Поддержка продавца",

       "我的账号": "Мой аккаунт",
"抢大额官方补贴，限量发放": "Получите крупную официальную субсидию, ограниченное количество",
"元苹果惊喜券": "Купон-сюрприз Apple",
"最近搜过": "Недавние поиски",
"请输入搜索文字": "Введите текст для поиска",
       "回顶部": "Наверх",
"回顶部": "Наверх",
"举报中心": "Центр жалоб",

       "搜 索": "Поиск",
"基本资料": "Основная информация",
"头像照片": "Фото профиля",
"个人成长信息": "Информация о развитии профиля",
"设置": "Настройки",
"个人交易信息": "Информация о транзакциях",
"现在": "сейчас",
"【2022】0403-017号": "№【2022】0403-017",
"号【2016】00154-A01": "№【2016】00154-A01",
"1109364号": "№1109364",
"新出发浙备字第2024004号": "№2024004 рег. Чжэцзян",
"（浙）网药平台备字【2023】第000016-000号": "（浙）网药平台备字【2023】№000016-000",
"浙公网安备 33010002000078号": "浙公网安备 №33010002000078",

       // Заголовки и навигация
"海外集运": "Зарубежная доставка",
"合单转运咨询": "Консультация по объединению заказов",
"待集运订单": "Заказы для консолидации",
"海外物流订单": "Зарубежные логистические заказы",
"用户识别码": "Код пользователя",

// Статусы и информация о заказах
"计费重(含体积重)": "Расчётный вес (включая объёмный)",
"免租期": "Бесплатное хранение",
"仓库内暂无可合包的订单": "В настоящее время нет заказов для объединения",
"查看已合单订单": "Посмотреть объединённые заказы",
"合计重量": "Общий вес",
"不含优惠折扣，及异常件费用": "Без учёта скидок и платы за нестандартные товары",
"小结": "Итого",
"运费结算": "Расчёт стоимости доставки",

// Всплывающие подсказки
"在和物流服务商沟通时可以使用此识别码快速检索您在集运仓的所有包裹": "Используйте этот код для быстрого поиска всех ваших посылок при общении с логистическим оператором",
"物流服务商为包裹提供20个自然日的免费仓储服务，超过20个自然日后，将按1元/天的仓租费标准收取仓储费用": "Логистический оператор предоставляет 20 календарных дней бесплатного хранения. После этого срока взимается плата за хранение в размере 1 юаня в день",

// Новые элементы
"到库包裹体积重量": "Объёмный вес полученных посылок",
"已选择订单": "Выбрано заказов",
"机票酒店保险": "Авиабилеты, отели, страхование",
"新手引导": "Руководство для начинающих",
       // Управление и поддержка
"跨境物流管理": "Управление международной логистикой",
"海外消费者帮助": "Помощь зарубежным покупателям",
"全球": "Весь мир",

// Регионы и страны
"中国大陆": "Материковый Китай",
"中国香港": "Гонконг",
"中国台湾": "Тайвань",
"中国澳门": "Макао",
"韩国": "Южная Корея",
"马来西亚": "Малайзия",
"澳大利亚": "Австралия",
"新加坡": "Сингапур",
"新西兰": "Новая Зеландия",
"加拿大": "Канада",
"日本": "Япония",
"越南": "Вьетнам",
"泰国": "Таиланд",
"菲律宾": "Филиппины",
"柬埔寨": "Камбоджа",

       // Заказ и вес
"订单": "Заказ",
"计费重(含体积重)": "Расчетный вес (включая объемный)",

// Статусы и действия
"状态": "Статус",
"操作": "Действия",

// Сообщения о ценах
"，及异常件费用": " и стоимость нестандартных товаров",

// Меню разделов
"我的彩票": "Мои лотереи",
"我的游戏": "Мои игры",
"我的理财": "Мои финансы",
       "我的交易": "Мои сделки",
"我的积分": "Мои баллы",
       "卖家中心": "Центр продавца",


           // Additional menu items and navigation
    "看过的店铺": "Просмотренные магазины",
    "路线": "Маршрут",
    "消息提醒设置": "Настройки уведомлений",
    "隐私设置": "Настройки приватности",
    "微博绑定": "Привязка Weibo",
    "分享绑定": "Привязка для шеринга",

    // Additional account settings
    "账号授权": "Авторизация аккаунта",
    "账号认证": "Подтверждение аккаунта",
    "安全密码": "Безопасный пароль",

    // Additional messages
    "系统提示": "Системное уведомление",
    "交易提醒": "Уведомление о сделке",
    "物流提醒": "Уведомление о доставке",

    // Additional order statuses
    "配送中": "Доставляется",
    "已完成": "Завершено",
    "已取消": "Отменено",
    "退款完成": "Возврат завершен",

    // Additional logistics terms
    "物流追踪": "Отслеживание",
    "发货时间": "Время отправки",
    "预计到达": "Ожидаемое прибытие",
    "实际重量": "Фактический вес",

    // Additional footer links
    "使用帮助": "Помощь",
    "网站导航": "Карта сайта",
    "意见反馈": "Обратная связь",
    "商家入驻": "Для продавцов",
    "法律声明及隐私权政策": "Правовая информация и политика конфиденциальности",

    // Error messages
    "加载失败": "Ошибка загрузки",
    "请稍后重试": "Попробуйте позже",
    "系统繁忙": "Система занята",
    "参数错误": "Ошибка параметров",

        // Заголовок страницы
    "跨境集运": "Международная консолидация",

    // Меню навигации
    "展开导航": "Развернуть навигацию",

    // Сообщения о безопасности
    "网络订餐服务第三方平台备案": "Регистрация сторонней платформы для заказа еды",
    "互联网药品信息服务资格证书": "Сертификат на информационные услуги о лекарствах",
    "短消息类服务接入代码使用证书": "Сертификат на использование кодов SMS-сервисов",
    "信息网络传播视听许可证": "Лицензия на распространение аудио и видео в сети",

    // Группы компаний и сервисы
    "聚划算": "Juhuasuan",
    "淘宝旅行": "Taobao Travel",
    "阿里云计算": "Alibaba Cloud Computing",
    "云OS": "YunOS",
    "来往": "Laiwang",

    // Остальные элементы интерфейса
    "搜 索": "Поиск",
    "文网文": "Лицензия на контент",
    "互联网违法和不良信息举报电话": "Телефон для жалоб на незаконный контент",

    // Дополнительные пункты меню
    "咨询/回复": "Консультации/Ответы",
    "我的足迹": "Мои просмотры",
    "退款维权": "Возврат и защита прав",

    // Заголовки разделов
    "我的交易": "Мои сделки",

    // Элементы формы
    "请输入": "Введите",
    "提交中": "Отправка",
    "加载中": "Загрузка",

    // Статусы операций
    "操作成功": "Операция успешна",
    "操作失败": "Ошибка операции",

    // Кнопки действий
    "展开": "Развернуть",
    "收起": "Свернуть",
    "确认": "Подтвердить",
    "取消": "Отменить",

    // Заголовки разделов и статусы
    "待集运物流": "Заказы для консолидации",
    "退回卖家": "Возврат продавцу",
    "输入直送/集运": "Введите прямую доставку/консолидацию",
    "商品订": "Номер товара",
    "服务类型": "Тип услуги",

    // Компании и сайты
    "阿里巴巴中国站": "Alibaba China",
    "虾米": "Xiami",
    "万网": "HiChina",

    // Сервисы Taobao
    "关于Taobao": "О Taobao",
    "合作伙伴": "Партнеры",

    // Дополнительные элементы меню
    "查看帮助": "Посмотреть помощь",
    "我的": "Мой/Мои",

          "待集运": "Ожидает консолидации",

        // Заголовки и навигация
    "飞猪－我的机票订单": "Fliggy - Мои авиабилеты",
    "国内机票订单": "Заказы внутренних авиабилетов",
    "国际机票订单": "Заказы международных авиабилетов",
    "机票预约": "Бронирование билетов",
    "保险订单": "Заказы страховок",
    "酒店订单": "Заказы отелей",
    "办理登机手续": "Регистрация на рейс",

    // Форма поиска
    "预订日期": "Дата бронирования",
    "从": "С",
    "到": "По",
    "订单号": "Номер заказа",
    "订单状态": "Статус заказа",

    // Статусы заказов
    "全部": "Все",
    "等待买家付款": "Ожидает оплаты",
    "出票中": "Оформляется",
    "订票成功": "Забронировано успешно",
    "交易关闭": "Заказ закрыт",
    "确定出票": "Подтверждено",
    "座位确认中": "Подтверждение места",

    // Таблица заказов
    "行程": "Маршрут",
    "航班信息": "Информация о рейсе",
    "起飞时间": "Время вылета",
    "总价": "Общая стоимость",
    "卖家": "Продавец",
    "操作": "Действия",
    "备注": "Примечания",

    // Кнопки и действия
    "搜索": "Поиск",
    "关闭提示": "Закрыть подсказку",
    "显示提示": "Показать подсказку",
    "确认": "Подтвердить",
    "取消": "Отменить",
    "删除": "Удалить",

    // Системные сообщения
    "友情提醒": "Дружеское напоминание",
    "是否确认出票": "Подтвердить оформление билета?",
    "加载中": "Загрузка",
    "暂无数据": "Нет данных",

    // Поля ввода и формы
    "请输入": "Пожалуйста, введите",
    "选择日期": "Выберите дату",
    "选择状态": "Выберите статус",

    // Разделы меню
    "我的交易": "Мои операции",
    "订单管理": "Управление заказами",
    "账户设置": "Настройки аккаунта",
    "个人资料": "Личные данные",
    "安全设置": "Настройки безопасности",

    // Подсказки и предупреждения
    "由于航空公司有权取消未出票的预订，且机票价格时时变动，为确保您能购买成功，请按照购买流程及时订购": "Поскольку авиакомпании имеют право отменить бронирование без выписанного билета, а цены на билеты постоянно меняются, для успешной покупки, пожалуйста, своевременно оформляйте заказ согласно процедуре",
    "更多须知": "Подробнее",

    // Дополнительные элементы
    "共享航班": "Совместный рейс",
    "实际承运航空公司": "Фактический перевозчик",
    "分页": "Страница",
    "每页显示": "Показывать на странице"

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
