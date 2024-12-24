// ==UserScript==
// @name         Claude Sumi-e Premium Dark Theme
// @namespace    http://tampermonkey.net/
// @version      3.0.0
// @description  Refined Japanese ink-inspired premium dark theme for Claude.ai
// @author       Your name
// @match        https://claude.ai/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    const THEME_ID = 'sumi-e-premium';
    const THEME_CLASS = 'sumi-e-refined';

    // Premium Japanese design system
    const themeConfig = {
        colors: {
            // 墨絵 (Sumi-e) - Core shades
            sumi: {
                void:    '#010102',
                deepest: '#020203',
                darker:  '#040405',
                dark:    '#060607',
                medium:  '#080809',
                light:   '#0a0a0c',
                pale:    '#0c0c0e',
            },
            // 和紙 (Washi) - Paper tones
            washi: {
                bright:  '#f0f0f0',
                white:   '#e8e8e8',
                pearl:   '#e0e0e0',
                soft:    '#d8d8d8',
                gray:    '#b0b0b0',
            },
            // 伝統色 (Dentō-shoku) - Traditional accents
            accent: {
                primary:  '#582424',
                hover:   '#683030',
                active:  '#783838',
                success: '#234023',
                info:    '#243850',
                warning: '#5d4023',
                border:  '#161618',
            }
        },
        borders: {
            width: {
                hair:   '1px',
                thin:   '1.5px',
                medium: '2px',
                thick:  '3px'
            },
            style: {
                solid:  'solid',
                dotted: 'dotted',
                dashed: 'dashed',
                double: 'double'
            },
            radius: {
                xs: '3px',
                sm: '4px',
                md: '6px',
                lg: '8px',
                xl: '12px'
            }
        },
        shadows: {
            // 陰影 (Kage) - Shadow system
            ambient:  '0 0 20px rgba(0, 0, 0, 0.1)',
            subtle:   '0 2px 4px rgba(0, 0, 0, 0.2)',
            medium:   '0 4px 8px rgba(0, 0, 0, 0.3)',
            strong:   '0 8px 16px rgba(0, 0, 0, 0.4)',
            inner:    'inset 0 2px 4px rgba(0, 0, 0, 0.2)',
            text:     '0 1px 2px rgba(0, 0, 0, 0.3)',
            glow:     '0 0 8px rgba(88, 36, 36, 0.3)',
        },
        transitions: {
            instant: 'all 0.1s ease',
            fast:    'all 0.2s ease',
            normal:  'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            slow:    'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            spring:  'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }
    };

    const generateThemeStyles = () => `
        /* Root Theme */
        .${THEME_CLASS} {
            color-scheme: dark !important;
            font-smooth: always !important;
            -webkit-font-smoothing: antialiased !important;
            -moz-osx-font-smoothing: grayscale !important;
        }

        /* Global Container */
        .${THEME_CLASS} body {
            background: linear-gradient(
                170deg,
                ${themeConfig.colors.sumi.void} 0%,
                ${themeConfig.colors.sumi.deepest} 100%
            ) !important;
            color: ${themeConfig.colors.washi.white} !important;
            border: ${themeConfig.borders.width.hair} ${themeConfig.colors.accent.border} !important;
            text-shadow: ${themeConfig.shadows.text} !important;
        }

        /* Enhanced Message Containers */
        .${THEME_CLASS} .message-container,
        .${THEME_CLASS} .chat-message {
            background: linear-gradient(
                to bottom right,
                ${themeConfig.colors.sumi.dark},
                ${themeConfig.colors.sumi.medium}
            ) !important;
            border: ${themeConfig.borders.width.thin} ${themeConfig.colors.accent.border} !important;
            border-radius: ${themeConfig.borders.radius.lg} !important;
            box-shadow: ${themeConfig.shadows.medium}, ${themeConfig.shadows.ambient} !important;
            padding: 18px !important;
            margin: 14px 0 !important;
            transition: ${themeConfig.transitions.normal} !important;
        }

        .${THEME_CLASS} .message-container:hover,
        .${THEME_CLASS} .chat-message:hover {
            background: linear-gradient(
                to bottom right,
                ${themeConfig.colors.sumi.medium},
                ${themeConfig.colors.sumi.light}
            ) !important;
            border-color: rgba(255, 255, 255, 0.15) !important;
            box-shadow: ${themeConfig.shadows.strong}, ${themeConfig.shadows.glow} !important;
            transform: translateY(-2px) !important;
        }

        /* Premium Input Area */
        .${THEME_CLASS} .chat-input-container {
            background: linear-gradient(
                to bottom,
                ${themeConfig.colors.sumi.dark},
                ${themeConfig.colors.sumi.darker}
            ) !important;
            border: ${themeConfig.borders.width.thin} ${themeConfig.colors.accent.border} !important;
            border-radius: ${themeConfig.borders.radius.xl} !important;
            box-shadow: ${themeConfig.shadows.strong} !important;
            padding: 16px !important;
            margin: 20px 0 !important;
            transition: ${themeConfig.transitions.normal} !important;
        }

        .${THEME_CLASS} .chat-input-container:focus-within {
            border-color: ${themeConfig.colors.accent.primary} !important;
            box-shadow: ${themeConfig.shadows.strong}, ${themeConfig.shadows.glow} !important;
        }

        /* Refined Textarea */
        .${THEME_CLASS} textarea {
            background: ${themeConfig.colors.sumi.darker} !important;
            color: ${themeConfig.colors.washi.bright} !important;
            border: ${themeConfig.borders.width.thin} ${themeConfig.colors.accent.border} !important;
            border-radius: ${themeConfig.borders.radius.lg} !important;
            padding: 14px 16px !important;
            line-height: 1.6 !important;
            transition: ${themeConfig.transitions.normal} !important;
            box-shadow: ${themeConfig.shadows.inner} !important;
        }

        .${THEME_CLASS} textarea:focus {
            background: ${themeConfig.colors.sumi.dark} !important;
            border-color: ${themeConfig.colors.accent.primary} !important;
            box-shadow: ${themeConfig.shadows.inner}, 0 0 0 3px rgba(88, 36, 36, 0.2) !important;
        }

        /* Premium Code Blocks */
        .${THEME_CLASS} .code-block {
            background: ${themeConfig.colors.sumi.darker} !important;
            border: ${themeConfig.borders.width.thin} ${themeConfig.colors.accent.border} !important;
            border-radius: ${themeConfig.borders.radius.lg} !important;
            padding: 18px !important;
            margin: 14px 0 !important;
            box-shadow: ${themeConfig.shadows.medium} !important;
        }

        .${THEME_CLASS} pre,
        .${THEME_CLASS} code {
            font-family: 'Fira Code', 'JetBrains Mono', monospace !important;
            background: ${themeConfig.colors.sumi.void} !important;
            color: ${themeConfig.colors.washi.soft} !important;
            border-radius: ${themeConfig.borders.radius.md} !important;
            padding: 10px 14px !important;
            line-height: 1.5 !important;
            text-shadow: none !important;
        }

        /* Elegant Buttons */
        .${THEME_CLASS} button {
            background: linear-gradient(
                to bottom,
                ${themeConfig.colors.sumi.medium},
                ${themeConfig.colors.sumi.dark}
            ) !important;
            color: ${themeConfig.colors.washi.bright} !important;
            border: ${themeConfig.borders.width.thin} ${themeConfig.colors.accent.border} !important;
            border-radius: ${themeConfig.borders.radius.md} !important;
            padding: 10px 18px !important;
            font-weight: 500 !important;
            letter-spacing: 0.3px !important;
            transition: ${themeConfig.transitions.spring} !important;
            box-shadow: ${themeConfig.shadows.subtle}, ${themeConfig.shadows.ambient} !important;
        }

        .${THEME_CLASS} button:hover {
            background: linear-gradient(
                to bottom,
                ${themeConfig.colors.accent.primary},
                ${themeConfig.colors.accent.hover}
            ) !important;
            border-color: ${themeConfig.colors.accent.hover} !important;
            transform: translateY(-2px) !important;
            box-shadow: ${themeConfig.shadows.medium}, ${themeConfig.shadows.glow} !important;
        }

        .${THEME_CLASS} button:active {
            background: ${themeConfig.colors.accent.active} !important;
            transform: translateY(0) !important;
            box-shadow: ${themeConfig.shadows.subtle} !important;
        }

        /* Premium Scrollbar */
        .${THEME_CLASS} ::-webkit-scrollbar {
            width: 12px !important;
            height: 12px !important;
            background: ${themeConfig.colors.sumi.void} !important;
        }

        .${THEME_CLASS} ::-webkit-scrollbar-track {
            background: ${themeConfig.colors.sumi.deepest} !important;
            border: ${themeConfig.borders.width.hair} ${themeConfig.colors.accent.border} !important;
            border-radius: ${themeConfig.borders.radius.md} !important;
        }

        .${THEME_CLASS} ::-webkit-scrollbar-thumb {
            background: linear-gradient(
                to bottom,
                ${themeConfig.colors.sumi.medium},
                ${themeConfig.colors.sumi.dark}
            ) !important;
            border: 3px solid ${themeConfig.colors.sumi.void} !important;
            border-radius: ${themeConfig.borders.radius.md} !important;
            transition: ${themeConfig.transitions.fast} !important;
        }

        .${THEME_CLASS} ::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(
                to bottom,
                ${themeConfig.colors.sumi.light},
                ${themeConfig.colors.sumi.medium}
            ) !important;
        }

        /* Refined Selection */
        .${THEME_CLASS} ::selection {
            background: ${themeConfig.colors.accent.primary} !important;
            color: ${themeConfig.colors.washi.bright} !important;
            text-shadow: none !important;
        }

        /* Links Enhancement */
        .${THEME_CLASS} a {
            color: ${themeConfig.colors.accent.primary} !important;
            text-decoration: none !important;
            border-bottom: ${themeConfig.borders.width.hair} ${themeConfig.borders.style.dotted} ${themeConfig.colors.accent.primary} !important;
            transition: ${themeConfig.transitions.fast} !important;
        }

        .${THEME_CLASS} a:hover {
            color: ${themeConfig.colors.accent.hover} !important;
            border-bottom-style: ${themeConfig.borders.style.solid} !important;
            text-shadow: ${themeConfig.shadows.glow} !important;
        }
    `;

    const SumiEManager = {
        init() {
            this.injectStyles();
            this.setupMutationObserver();
            this.activateTheme();
            this.handleDynamicUpdates();
        },

        injectStyles() {
            const style = document.createElement('style');
            style.id = THEME_ID;
            style.textContent = generateThemeStyles();
            document.head.appendChild(style);
        },

        setupMutationObserver() {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) {
                            if (node.tagName === 'STYLE' && !node.id.includes(THEME_ID)) {
                                node.remove();
                            }
                        }
                    });
                });
            });

            observer.observe(document.documentElement, {
                childList: true,
                subtree: true
            });
        },

        handleDynamicUpdates() {
            document.addEventListener('readystatechange', () => {
                this.refreshStyles();
            });
        },

        refreshStyles() {
            const existingStyle = document.getElementById(THEME_ID);
            if (existingStyle) {
                existingStyle.textContent = generateThemeStyles();
            }
        },

        activateTheme() {
            document.documentElement.classList.add(THEME_CLASS);
console.log('🎨 Sumi-e Premium Theme Activated');
        }
    };

    // Optimized initialization with better timing
    const initializeTheme = () => {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                SumiEManager.init();
            });
        } else {
            SumiEManager.init();
        }

        // Additional safeguard for dynamic content
        window.addEventListener('load', () => {
            SumiEManager.refreshStyles();
        });
    };

    // Start initialization
    initializeTheme();
})();
