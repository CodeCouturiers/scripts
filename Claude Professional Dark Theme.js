// ==UserScript==
// @name         Claude Professional Dark Theme
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  Professional dark theme for Claude.ai with improved contrast and visual hierarchy
// @author       Your name
// @match        https://claude.ai/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    const darkStyle = document.createElement('style');
    darkStyle.textContent = `
        /* Root Variables */
        :root {
            --dark-bg-primary: #1a1b1e;
            --dark-bg-secondary: #25262b;
            --dark-bg-tertiary: #2c2e33;
            --dark-bg-hover: #31333a;
            --dark-text-primary: #e0e1e5;
            --dark-text-secondary: #a1a3a9;
            --dark-border: #383a40;
            --dark-accent: #5c7cfa;
            --dark-accent-hover: #4c6ef5;
            --dark-success: #40c057;
            --dark-error: #fa5252;
            --dark-warning: #fd7e14;
            --dark-shadow: rgba(0, 0, 0, 0.2);
            --dark-code-bg: #282c34;
            --dark-code-text: #abb2bf;
        }

        /* Global Styles */
        body {
            background: var(--dark-bg-primary) !important;
            color: var(--dark-text-primary) !important;
            background-image: none !important;
        }

        /* Typography */
        h1, h2, h3, h4, h5, h6 {
            color: var(--dark-text-primary) !important;
        }

        p, div {
            color: var(--dark-text-secondary) !important;
        }

        span {
            color: inherit !important;
        }

        /* Main Layout */
        .flex.min-h-screen,
        .from-bg-200,
        .to-bg-100 {
            background: var(--dark-bg-primary) !important;
            background-image: none !important;
        }

        /* Code Block Container */
        .relative.flex.flex-col.rounded-lg {
            background: var(--dark-code-bg) !important;
            margin: 1rem 0 !important;
            border-radius: 8px !important;
            overflow: hidden !important;
        }

        /* Code Language Label */
        .text-text-300.absolute {
            color: var(--dark-text-secondary) !important;
            background: var(--dark-code-bg) !important;
            z-index: 1 !important;
        }

        /* Code Block */
        .code-block__code {
            background: var(--dark-code-bg) !important;
            color: var(--dark-code-text) !important;
            font-family: 'Fira Code', 'JetBrains Mono', monospace !important;
            padding: 1.5rem 1rem 1rem !important;
            margin: 0 !important;
            border: none !important;
            border-radius: 0 !important;
            font-weight: normal !important;
        }

        /* Code Inside Code Blocks */
        .code-block__code code {
            background: transparent !important;
            padding: 0 !important;
            border: none !important;
            font-family: inherit !important;
        }

        /* Copy Button */
        .pointer-events-auto button {
            background: var(--dark-bg-tertiary) !important;
            border: 1px solid var(--dark-border) !important;
        }

        /* Highlighted Text */
        .bg-text-200\\/5.border.border-0\\.5.border-border-300.text-danger-000,
        [class*="text-danger-000"] {
            background-color: rgba(255, 107, 107, 0.03) !important;
            border: 0.5px solid rgba(56, 58, 64, 0.3) !important;
            color: #ff8585 !important;
            font-weight: normal !important;
            padding: 0.1rem 0.3rem !important;
            border-radius: 0.3rem !important;
            font-size: 0.9rem !important;
            opacity: 0.85 !important;
        }

        /* Sidebar Navigation */
        nav {
            background: var(--dark-bg-secondary) !important;
            border-right: 1px solid var(--dark-border) !important;
            box-shadow: 2px 0 8px var(--dark-shadow) !important;
        }

        nav a {
            color: var(--dark-text-secondary) !important;
            transition: all 0.2s ease !important;
        }

        nav a:hover {
            background: var(--dark-bg-hover) !important;
            color: var(--dark-text-primary) !important;
        }

        /* Chat Interface */
        .chat-container {
            background: var(--dark-bg-primary) !important;
        }

        .message-human {
            background: var(--dark-bg-secondary) !important;
            border: 1px solid var(--dark-border) !important;
            border-radius: 8px !important;
            padding: 16px !important;
            margin: 8px 0 !important;
        }

        .message-assistant {
            background: var(--dark-bg-tertiary) !important;
            border: 1px solid var(--dark-border) !important;
            border-radius: 8px !important;
            padding: 16px !important;
            margin: 8px 0 !important;
        }

        /* Input Area */
        textarea, input {
            background: var(--dark-bg-secondary) !important;
            color: var(--dark-text-primary) !important;
            border: 1px solid var(--dark-border) !important;
            border-radius: 8px !important;
            padding: 12px !important;
            transition: all 0.2s ease !important;
        }

        textarea:focus, input:focus {
            border-color: var(--dark-accent) !important;
            box-shadow: 0 0 0 2px rgba(92, 124, 250, 0.2) !important;
            outline: none !important;
        }

        /* Buttons */
        button {
            background: var(--dark-bg-tertiary) !important;
            color: var(--dark-text-primary) !important;
            border: 1px solid var(--dark-border) !important;
            border-radius: 6px !important;
            padding: 8px 16px !important;
            transition: all 0.2s ease !important;
        }

        button:hover {
            background: var(--dark-bg-hover) !important;
            border-color: var(--dark-accent) !important;
        }

        button:active {
            transform: translateY(1px) !important;
        }

        /* Links */
        a {
            color: var(--dark-accent) !important;
            text-decoration: none !important;
            transition: all 0.2s ease !important;
        }

        a:hover {
            color: var(--dark-accent-hover) !important;
            text-decoration: underline !important;
        }

        /* Scrollbars */
        ::-webkit-scrollbar {
            width: 12px !important;
            height: 12px !important;
        }

        ::-webkit-scrollbar-track {
            background: var(--dark-bg-primary) !important;
        }

        ::-webkit-scrollbar-thumb {
            background: var(--dark-bg-tertiary) !important;
            border: 3px solid var(--dark-bg-primary) !important;
            border-radius: 6px !important;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: var(--dark-bg-hover) !important;
        }

        /* Status Indicators */
        .status-success {
            color: var(--dark-success) !important;
        }

        .status-error {
            color: var(--dark-error) !important;
        }

        .status-warning {
            color: var(--dark-warning) !important;
        }

        /* Tooltips and Popups */
        .tooltip, .popup {
            background: var(--dark-bg-tertiary) !important;
            border: 1px solid var(--dark-border) !important;
            border-radius: 6px !important;
            box-shadow: 0 4px 12px var(--dark-shadow) !important;
        }

        /* Tables */
        table {
            border-collapse: separate !important;
            border-spacing: 0 !important;
            width: 100% !important;
        }

        th, td {
            background: var(--dark-bg-secondary) !important;
            border: 1px solid var(--dark-border) !important;
            padding: 12px !important;
        }

        th {
            background: var(--dark-bg-tertiary) !important;
            font-weight: 600 !important;
        }

        /* Selection */
        ::selection {
            background: var(--dark-accent) !important;
            color: var(--dark-text-primary) !important;
        }

        /* Animations */
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        .fade-in {
            animation: fadeIn 0.3s ease-in-out;
        }
    `;

    // Insert style as early as possible
    const insertStyle = () => {
        document.head.appendChild(darkStyle);
    };

    // Try to insert immediately
    if (document.head) {
        insertStyle();
    } else {
        // If document.head is not available yet, wait for it
        document.addEventListener('DOMContentLoaded', insertStyle);
    }

    // Optional: Add class to body for any JavaScript-dependent styles
    document.addEventListener('DOMContentLoaded', () => {
        document.body.classList.add('dark-theme');
    });
})();
