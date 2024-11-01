// ==UserScript==
// @name         Freelancehunt Project Rating with Employer Warning
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  Adds a rating based on budget, bids, and reviews to Freelancehunt projects, shows the last online time of the employer (including offline status) and reviews, and displays warning about employers who tend to not complete projects
// @author       You
// @match        *://*.freelancehunt.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=freelancehunt.com
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    const currencyCoefficients = {
        'UAH': 1,
        'USD': 40,
        'PLN': 10
    };

    // Кэш для хранения результатов запросов
    const cache = new Map();

    // Пул для ограничения одновременных запросов
    class RequestPool {
        constructor(maxConcurrent = 1000) {
            this.maxConcurrent = maxConcurrent;
            this.currentRequests = 0;
            this.queue = [];
            this.cache = new Map();
        }

        async add(requestFunction, cacheKey) {
            // Проверяем кэш
            if (cacheKey && this.cache.has(cacheKey)) {
                return this.cache.get(cacheKey);
            }

            if (this.currentRequests >= this.maxConcurrent) {
                await new Promise(resolve => this.queue.push(resolve));
            }
            this.currentRequests++;

            try {
                const result = await requestFunction();
                // Сохраняем в кэш
                if (cacheKey) {
                    this.cache.set(cacheKey, result);
                }
                return result;
            } finally {
                this.currentRequests--;
                if (this.queue.length > 0) {
                    const next = this.queue.shift();
                    next();
                }
            }
        }
    }

    const pool = new RequestPool(100);

    // Оптимизированный запрос
    function makeRequest(url) {
        // Используем кэш для одинаковых URL
        const cachedResponse = cache.get(url);
        if (cachedResponse) {
            return Promise.resolve(cachedResponse);
        }

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: response => {
                    if (response.status >= 200 && response.status < 300) {
                        // Кэшируем результат
                        cache.set(url, response.responseText);
                        resolve(response.responseText);
                    } else {
                        reject(new Error(`HTTP ${response.status}`));
                    }
                },
                onerror: error => reject(error)
            });
        });
    }

    // Оптимизированная проверка работодателя
    async function checkEmployerWarning(projectLink, projectElement) {
        try {
            // Извлекаем ID работодателя из URL, если возможно
            const employerId = projectLink.match(/employer\/(\d+)/)?.[1];
            const cacheKey = employerId ? `employer_${employerId}` : projectLink;

            const projectHtml = await pool.add(() => makeRequest(projectLink), cacheKey);
            const parser = new DOMParser();
            const projectDoc = parser.parseFromString(projectHtml, "text/html");

            const employerLink = projectDoc.querySelector('a[href*="/employer/"]')?.href;
            if (!employerLink) return false;

            const employerHtml = await pool.add(() => makeRequest(employerLink), `employer_page_${employerLink}`);
            const employerDoc = parser.parseFromString(employerHtml, "text/html");

            // Оптимизированный поиск предупреждения
            const warningElement = employerDoc.querySelector('#activity .alert.alert-danger');
            if (warningElement?.textContent.includes('тенденцію не завершувати')) {
                markProjectAsWarning(projectElement);
                return true;
            }
            return false;
        } catch (error) {
            console.error("Error checking employer:", error);
            return false;
        }
    }

    // Оптимизированная маркировка проекта
    function markProjectAsWarning(projectElement) {
        if (projectElement.classList.contains('marked-as-warning')) return;
        projectElement.classList.add('marked-as-warning');

        const projectTitle = projectElement.querySelector('a.visitable');
        if (!projectTitle) return;

        // Создаем все элементы за один раз
        const fragment = document.createDocumentFragment();

        const warningSpan = document.createElement('span');
        warningSpan.className = 'employer-warning';
        warningSpan.textContent = ' 🚨';
        warningSpan.title = 'Замовник має тенденцію не завершувати відкриті проєкти';
        warningSpan.style.cssText = 'color: red; font-size: 16px; vertical-align: middle;';

        const toggleButton = document.createElement('button');
        toggleButton.textContent = 'Приховати проєкт';
        toggleButton.className = 'toggle-project-btn';
        toggleButton.style.cssText = `
            margin-left: 10px;
            padding: 2px 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            background: #fff;
            cursor: pointer;
            font-size: 12px;
        `;

        // Применяем стили к проекту
        Object.assign(projectElement.style, {
            textDecoration: 'line-through',
            opacity: '0.7',
            background: '#ffebee'
        });

        // Добавляем обработчик события
        toggleButton.addEventListener('click', () => {
            const isHidden = projectElement.style.display === 'none';
            projectElement.style.display = isHidden ? '' : 'none';
            toggleButton.textContent = isHidden ? 'Приховати проєкт' : 'Показати проєкт';
        });

        fragment.appendChild(warningSpan);
        fragment.appendChild(toggleButton);
        projectTitle.parentNode.insertBefore(fragment, projectTitle.nextSibling);
    }

    function processEmployerInfo(projectHtml, projectElement) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(projectHtml, "text/html");

        const widgetElement = doc.querySelector('.widget');
        if (!widgetElement || !widgetElement.textContent.includes('Замовник')) return;

        // Обработка статуса
        let statusInfo = getEmployerStatus(widgetElement);

        // Обработка отзывов
        let reviewsInfo = getEmployerReviews(widgetElement);

        // Добавление информации на страницу
        addEmployerInfo(projectElement, statusInfo, reviewsInfo);

        // Обработка рейтинга проекта
        processProjectRating(projectElement, reviewsInfo.positiveReviews, reviewsInfo.negativeReviews);
    }

    // Получение статуса работодателя
    function getEmployerStatus(widgetElement) {
        const statusElement = widgetElement.querySelector('.profile-status');
        let statusText = '';
        let statusStyle = '';

        if (statusElement) {
            const isOffline = statusElement.classList.contains('offline');
            if (isOffline) {
                const lastSeenElement = widgetElement.querySelector('.avatar-container');
                if (lastSeenElement && lastSeenElement.title) {
                    statusText = ` - ${lastSeenElement.title}`;
                    statusStyle = 'color: #D1D1D6; font-size: 12px;';
                }
            } else {
                statusText = ` - Зараз онлайн`;
                statusStyle = 'color: #34C759; font-size: 12px;';
            }
        }

        return { text: statusText, style: statusStyle };
    }

    // Получение отзывов работодателя
    function getEmployerReviews(widgetElement) {
        let positiveReviews = 0;
        let negativeReviews = 0;
        let reviewsText = '';

        const reviewsElement = widgetElement.querySelector('.nowrap');
        if (reviewsElement) {
            const positiveReviewsElement = reviewsElement.querySelector('a .text-green');
            const negativeReviewsElement = reviewsElement.querySelector('a .text-red');

            positiveReviews = positiveReviewsElement ? parseInt(positiveReviewsElement.textContent.trim()) : 0;
            negativeReviews = negativeReviewsElement ? parseInt(negativeReviewsElement.textContent.trim()) : 0;

            let negativeColor = negativeReviews > 0 ? 'red' : 'gray';
            reviewsText = ` (<span style="color: #34C759;">${positiveReviews}</span>/<span style="color: ${negativeColor};">${negativeReviews}</span>)`;
        }

        return { positiveReviews, negativeReviews, text: reviewsText };
    }

    // Добавление информации о работодателе на страницу
    function addEmployerInfo(projectElement, statusInfo, reviewsInfo) {
        const insertBeforeElement = projectElement.querySelector('a.visitable') || projectElement.querySelector('.price');
        if (!insertBeforeElement) return;

        const statusSpan = document.createElement('span');
        statusSpan.textContent = statusInfo.text;
        statusSpan.style.cssText = statusInfo.style;

        const reviewsSpan = document.createElement('span');
        reviewsSpan.innerHTML = reviewsInfo.text;
        reviewsSpan.style.cssText = 'color: #6C757D; font-size: 12px;';

        insertBeforeElement.parentNode.insertBefore(statusSpan, insertBeforeElement.nextSibling);
        insertBeforeElement.parentNode.insertBefore(reviewsSpan, statusSpan.nextSibling);
    }

    function processProjectRating(projectElement, positiveReviews, negativeReviews) {
        const linkElement = projectElement.querySelector('a.visitable');
        if (!linkElement) return;

        const budgetElement = projectElement.querySelector('.price');
        if (!budgetElement) return;

        let budget = parseFloat(budgetElement.textContent.replace(/\s|UAH|PLN|USD/g, '')) || 0;
        const currencyMatch = budgetElement.textContent.match(/UAH|PLN|USD/);
        const currency = currencyMatch ? currencyMatch[0] : 'UAH';

        let bidsCount = 0;
        const bidsElement = projectElement.querySelector('small');
        if (bidsElement && bidsElement.textContent.match(/\d+/)) {
            bidsCount = parseInt(bidsElement.textContent.match(/\d+/)[0]);
        }

        const rating = calculateRating(budget, bidsCount, currency, positiveReviews, negativeReviews);
        const stars = displayRatingStars(rating, 10);

        const ratingElement = document.createElement('span');
        ratingElement.innerHTML = ` ${stars} (${rating.toFixed(1)}) ${currency}`;
        ratingElement.style.cssText = 'color: #FF9500; font-size: 14px; margin-left: 10px; font-weight: 500;';
        linkElement.parentNode.insertBefore(ratingElement, linkElement.nextSibling);
    }

    function calculateRating(budget, bidsCount, currency, positiveReviews, negativeReviews) {
        const normalizedBudget = budget * currencyCoefficients[currency];
        const reviewScore = (positiveReviews - negativeReviews) / (positiveReviews + negativeReviews + 1);
        const rating = Math.log10(normalizedBudget / (bidsCount + 1) + 1) * 2 * (1 + reviewScore);
        return Math.min(rating, 10);
    }

    function displayRatingStars(rating, maxStars = 10) {
        const fullStars = Math.floor(rating);
        const halfStar = rating - fullStars >= 0.5 ? 1 : 0;
        const emptyStars = maxStars - fullStars - halfStar;

        let starsHTML = '';
        for (let i = 0; i < fullStars; i++) starsHTML += '★';
        if (halfStar) starsHTML += '½';
        for (let i = 0; i < emptyStars; i++) starsHTML += '☆';
        return starsHTML;
    }

    // Оптимизированная обработка проекта
    async function processProject(projectElement) {
        const linkElement = projectElement.querySelector('a.visitable');
        if (!linkElement) return;

        try {
            const projectUrl = linkElement.href;
            const isWarning = await checkEmployerWarning(projectUrl, projectElement);

            if (!isWarning) {
                const projectHtml = await pool.add(() => makeRequest(projectUrl), projectUrl);
                await processEmployerInfo(projectHtml, projectElement);
            }
        } catch (error) {
            console.error('Error processing project:', error);
        }
    }

    // BatchProcessor для обработки проектов группами
    class BatchProcessor {
        constructor(batchSize = 10) {
            this.batchSize = batchSize;
            this.queue = [];
        }

        async process(items, processFn) {
            for (let i = 0; i < items.length; i += this.batchSize) {
                const batch = items.slice(i, i + this.batchSize);
                await Promise.all(batch.map(item => processFn(item)));
            }
        }
    }

    // Инициализация скрипта с оптимизированной загрузкой
    const batchProcessor = new BatchProcessor(10);

    // Функция для добавления стилей
    function addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .marked-as-warning {
                transition: all 0.3s ease;
            }
            .toggle-project-btn {
                transition: all 0.2s ease;
            }
            .toggle-project-btn:hover {
                background: #f5f5f5;
            }
        `;
        document.head.appendChild(style);
    }

    // Основная функция инициализации
    async function initialize() {
        addStyles();
        const projects = Array.from(document.querySelectorAll('.project-list tr'));
        await batchProcessor.process(projects, processProject);
    }

    // Запускаем скрипт после загрузки страницы
    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

})();
