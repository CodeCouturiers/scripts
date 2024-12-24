// ==UserScript==
// @name         Claude Premium Japanese Dark Theme
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  Premium Japanese-inspired dark theme for Claude.ai with professional aesthetics
// @author       Your name
// @match        https://claude.ai/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    const darkStyle = document.createElement('style');
    darkStyle.textContent = `
        /* Foundation Variables - Japanese Design System */
        :root {
            /* Core Colors - Based on traditional Japanese colors */
            --kuro: #1a1a1d;          /* 黒 - Pure black */
            --sumizumi: #1f1f23;      /* 墨墨 - Ink black */
            --yanagizome: #2c2c30;    /* 柳染 - Willow dye */
            --shirozakura: #f0f0f0;   /* 白桜 - White cherry blossom */
            --ginnezumi: #9c9c9c;     /* 銀鼠 - Silver grey */
            --bengara: #9b4e4e;       /* 弁柄 - Oxide red */
            --momoshiocha: #b25959;   /* 百塩茶 - Peach salt tea */
            --matcha: #687d5c;        /* 抹茶 - Green tea */
            --akane: #a65d57;         /* 茜 - Deep red */
            --kogecha: #c17f59;       /* 濃茶 - Dark tea */

            /* Functional Colors */
            --dark-bg-primary: var(--kuro);
            --dark-bg-secondary: var(--sumizumi);
            --dark-bg-tertiary: var(--yanagizome);
            --dark-bg-hover: #35353a;
            --dark-text-primary: var(--shirozakura);
            --dark-text-secondary: var(--ginnezumi);
            --dark-border: rgba(255, 255, 255, 0.1);
            --dark-accent: var(--bengara);
            --dark-accent-hover: var(--momoshiocha);
            --dark-success: var(--matcha);
            --dark-error: var(--akane);
            --dark-warning: var(--kogecha);

            /* Advanced Effects */
            --dark-shadow-subtle: 0 2px 4px rgba(0, 0, 0, 0.1);
            --dark-shadow-medium: 0 4px 8px rgba(0, 0, 0, 0.15);
            --dark-shadow-strong: 0 8px 16px rgba(0, 0, 0, 0.2);
            --dark-gradient-subtle: linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0) 100%);
            --dark-blur-effect: blur(8px);

            /* Animations */
            --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
            --transition-normal: 250ms cubic-bezier(0.4, 0, 0.2, 1);
            --transition-slow: 350ms cubic-bezier(0.4, 0, 0.2, 1);

            /* Layout */
            --spacing-xs: 4px;
            --spacing-sm: 8px;
            --spacing-md: 16px;
            --spacing-lg: 24px;
            --spacing-xl: 32px;

            /* Typography */
            --font-family-base: -apple-system, BlinkMacSystemFont, "Segoe UI", "Yu Gothic", "Hiragino Sans", sans-serif;
            --font-family-code: "JetBrains Mono", "Fira Code", monospace;
        }

        /* Global Reset & Base Styles */
        *, *::before, *::after {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            transition: all var(--transition-normal);
        }

        body {
            background: var(--dark-bg-primary);
            color: var(--dark-text-primary);
            font-family: var(--font-family-base);
            line-height: 1.6;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }

        /* Typography Enhancement */
        h1, h2, h3, h4, h5, h6 {
            color: var(--dark-text-primary);
            font-weight: 500;
            letter-spacing: 0.03em;
            line-height: 1.3;
            margin-bottom: var(--spacing-md);
        }

        h1 { font-size: 2.5rem; }
        h2 { font-size: 2rem; }
        h3 { font-size: 1.75rem; }
        h4 { font-size: 1.5rem; }
        h5 { font-size: 1.25rem; }
        h6 { font-size: 1rem; }

        /* Chat Interface Enhancement */
        .chat-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: var(--spacing-xl);
            background: var(--dark-gradient-subtle);
        }

        .message-human, .message-assistant {
            padding: var(--spacing-lg);
            margin: var(--spacing-md) 0;
            border-radius: 8px;
            border: 1px solid var(--dark-border);
            background: var(--dark-bg-secondary);
            box-shadow: var(--dark-shadow-subtle);
            transition: all var(--transition-normal);
        }

        .message-human:hover, .message-assistant:hover {
            transform: translateY(-1px);
            box-shadow: var(--dark-shadow-medium);
            border-color: var(--dark-accent);
        }

        /* Input Area Enhancement */
        .input-container {
            position: relative;
            margin-top: var(--spacing-xl);
        }

        textarea, input {
            width: 100%;
            padding: var(--spacing-md);
            background: var(--dark-bg-secondary);
            color: var(--dark-text-primary);
            border: 1px solid var(--dark-border);
            border-radius: 8px;
            font-family: var(--font-family-base);
            font-size: 1rem;
            line-height: 1.6;
            resize: vertical;
            transition: all var(--transition-normal);
        }

        textarea:focus, input:focus {
            outline: none;
            border-color: var(--dark-accent);
            box-shadow: 0 0 0 3px rgba(155, 78, 78, 0.1);
        }

        /* Button Enhancement */
        button {
            padding: var(--spacing-sm) var(--spacing-md);
            background: var(--dark-bg-tertiary);
            color: var(--dark-text-primary);
            border: 1px solid var(--dark-border);
            border-radius: 6px;
            font-family: var(--font-family-base);
            font-size: 0.9rem;
            font-weight: 500;
            cursor: pointer;
            transition: all var(--transition-normal);
        }

        button:hover {
            background: var(--dark-accent);
            border-color: var(--dark-accent);
            transform: translateY(-1px);
            box-shadow: var(--dark-shadow-subtle);
        }

        button:active {
            transform: translateY(0);
        }

        /* Code Block Enhancement */
        .code-block {
            background: var(--dark-bg-secondary);
            border-radius: 8px;
            margin: var(--spacing-md) 0;
            overflow: hidden;
        }

        .code-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: var(--spacing-sm) var(--spacing-md);
            background: rgba(0, 0, 0, 0.2);
            border-bottom: 1px solid var(--dark-border);
        }

        .code-content {
            padding: var(--spacing-md);
            font-family: var(--font-family-code);
            font-size: 0.9rem;
            line-height: 1.5;
            overflow-x: auto;
        }

        /* Scrollbar Refinement */
        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }

        ::-webkit-scrollbar-track {
            background: var(--dark-bg-primary);
        }

        ::-webkit-scrollbar-thumb {
            background: var(--dark-bg-tertiary);
            border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: var(--dark-accent);
        }

        /* Link Enhancement */
        a {
            color: var(--dark-accent);
            text-decoration: none;
            border-bottom: 1px dotted var(--dark-accent);
            transition: all var(--transition-normal);
        }

        a:hover {
            color: var(--dark-accent-hover);
            border-bottom-style: solid;
        }

        /* Selection Style */
        ::selection {
            background: var(--dark-accent);
            color: var(--dark-text-primary);
        }

        /* Animations */
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .fade-in {
            animation: fadeIn var(--transition-normal) ease-out forwards;
        }

        /* Loading States */
        .loading {
            position: relative;
            opacity: 0.7;
        }

        .loading::after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
            animation: loading 1.5s infinite;
        }

        @keyframes loading {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            .chat-container {
                padding: var(--spacing-md);
            }

            h1 { font-size: 2rem; }
            h2 { font-size: 1.75rem; }
            h3 { font-size: 1.5rem; }
            h4 { font-size: 1.25rem; }
            h5 { font-size: 1rem; }
            h6 { font-size: 0.875rem; }
        }
    `;

    // Enhanced Style Insertion
    const insertStyle = () => {
        const existingStyle = document.getElementById('japanese-dark-theme');
        if (existingStyle) {
            existingStyle.remove();
        }
        darkStyle.id = 'japanese-dark-theme';
        document.head.appendChild(darkStyle);
    };

    // Initialization
    if (document.head) {
        insertStyle();
    } else {
        document.addEventListener('DOMContentLoaded', insertStyle);
    }

    // Theme Application
    document.addEventListener('DOMContentLoaded', () => {
        document.body.classList.add('dark-theme-japanese');
        console.log('Japanese Dark Theme Applied Successfully');
    });
})();
