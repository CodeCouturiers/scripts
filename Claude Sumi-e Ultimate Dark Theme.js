// ==UserScript==
// @name         Claude Sumi-e Ultimate Dark Theme
// @namespace    http://tampermonkey.net/
// @version      2.4.0
// @description  Premium Japanese ink-inspired ultra dark theme with enhanced UI/UX for Claude.ai
// @author       Your name
// @match        https://claude.ai/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    const THEME_ID = 'sumi-e-dark-theme';
    const THEME_CLASS = 'sumi-e-active';

    // Enhanced Japanese design system
    const themeConfig = {
        colors: {
            // 墨絵 (Sumi-e) shades
            sumi: {
                deepest: '#020203',    // 漆黒 - Shikkoku
                darker:  '#040405',     // 烏羽色 - Karasuba-iro
                dark:    '#080809',     // 濃墨 - Nōboku
                medium:  '#0a0a0b',     // 墨 - Sumi
                light:   '#0d0d0f',     // 薄墨 - Usuzumi
            },
            // 和紙 (Washi) tones
            washi: {
                white:   '#e0e0e0',     // 白練 - Shironeri
                gray:    '#808080',     // 鼠色 - Nezumi-iro
                soft:    '#c0c0c0',     // 白磁 - Hakuji
            },
            // 伝統色 (Dentō-shoku) accents
            accent: {
                primary:   '#582424',    // 葡萄色 - Budō-iro
                hover:    '#683030',     // 蘇芳 - Suō
                active:   '#783838',     // 真紅 - Shinku
                success:  '#234023',     // 常磐色 - Tokiwa-iro
                warning:  '#5d4023',     // 黄枯茶 - Kuchiba-iro
                border:   '#1a1a1c',     // 墨縁 - Sumi-en
            }
        },
        borders: {
            thin:    '1px solid',
            medium:  '2px solid',
            thick:   '3px solid',
            radius: {
                sm: '4px',
                md: '6px',
                lg: '8px'
            }
        },
        shadows: {
            subtle:  '0 1px 3px rgba(0, 0, 0, 0.3)',
            medium:  '0 2px 6px rgba(0, 0, 0, 0.4)',
            strong:  '0 4px 12px rgba(0, 0, 0, 0.5)',
            inner:   'inset 0 1px 3px rgba(0, 0, 0, 0.3)'
        },
        transitions: {
            fast:   'all 0.2s ease',
            normal: 'all 0.3s ease',
            slow:   'all 0.4s ease'
        }
    };

    const generateThemeStyles = () => `
        /* Base Theme */
        .${THEME_CLASS} {
            color-scheme: dark !important;
            transition: ${themeConfig.transitions.normal} !important;
        }

        /* Global Container */
        .${THEME_CLASS} body {
            background: linear-gradient(
                165deg,
                ${themeConfig.colors.sumi.deepest} 0%,
                ${themeConfig.colors.sumi.darker} 100%
            ) !important;
            color: ${themeConfig.colors.washi.white} !important;
            border: ${themeConfig.borders.thin} ${themeConfig.colors.accent.border} !important;
        }

        /* Message Containers */
        .${THEME_CLASS} .message-container,
        .${THEME_CLASS} .chat-message {
            background: ${themeConfig.colors.sumi.dark} !important;
            border: ${themeConfig.borders.thin} ${themeConfig.colors.accent.border} !important;
            border-radius: ${themeConfig.borders.radius.md} !important;
            box-shadow: ${themeConfig.shadows.medium} !important;
            padding: 16px !important;
            margin: 12px 0 !important;
            transition: ${themeConfig.transitions.normal} !important;
        }

        .${THEME_CLASS} .message-container:hover,
        .${THEME_CLASS} .chat-message:hover {
            background: ${themeConfig.colors.sumi.medium} !important;
            border-color: rgba(255, 255, 255, 0.1) !important;
            box-shadow: ${themeConfig.shadows.strong} !important;
            transform: translateY(-1px) !important;
        }

        /* Input Area Enhancement */
        .${THEME_CLASS} .chat-input-container {
            background: ${themeConfig.colors.sumi.dark} !important;
            border: ${themeConfig.borders.medium} ${themeConfig.colors.accent.border} !important;
            border-radius: ${themeConfig.borders.radius.lg} !important;
            box-shadow: ${themeConfig.shadows.medium} !important;
            padding: 12px !important;
            margin: 16px 0 !important;
        }

        .${THEME_CLASS} textarea {
            background: ${themeConfig.colors.sumi.darker} !important;
            color: ${themeConfig.colors.washi.white} !important;
            border: ${themeConfig.borders.thin} ${themeConfig.colors.accent.border} !important;
            border-radius: ${themeConfig.borders.radius.md} !important;
            padding: 12px !important;
            transition: ${themeConfig.transitions.normal} !important;
            box-shadow: ${themeConfig.shadows.inner} !important;
        }

        .${THEME_CLASS} textarea:focus {
            background: ${themeConfig.colors.sumi.dark} !important;
            border-color: ${themeConfig.colors.accent.primary} !important;
            box-shadow: 0 0 0 2px rgba(88, 36, 36, 0.2) !important;
        }

        /* Enhanced Code Blocks */
        .${THEME_CLASS} .code-block {
            background: ${themeConfig.colors.sumi.darker} !important;
            border: ${themeConfig.borders.thin} ${themeConfig.colors.accent.border} !important;
            border-radius: ${themeConfig.borders.radius.md} !important;
            padding: 16px !important;
            margin: 12px 0 !important;
        }

        .${THEME_CLASS} pre,
        .${THEME_CLASS} code {
            font-family: 'Fira Code', monospace !important;
            background: ${themeConfig.colors.sumi.deepest} !important;
            color: ${themeConfig.colors.washi.soft} !important;
            border-radius: ${themeConfig.borders.radius.sm} !important;
            padding: 8px 12px !important;
        }

        /* Buttons Styling */
        .${THEME_CLASS} button {
            background: ${themeConfig.colors.sumi.medium} !important;
            color: ${themeConfig.colors.washi.white} !important;
            border: ${themeConfig.borders.thin} ${themeConfig.colors.accent.border} !important;
            border-radius: ${themeConfig.borders.radius.md} !important;
            padding: 8px 16px !important;
            transition: ${themeConfig.transitions.fast} !important;
            box-shadow: ${themeConfig.shadows.subtle} !important;
        }

        .${THEME_CLASS} button:hover {
            background: ${themeConfig.colors.accent.primary} !important;
            border-color: ${themeConfig.colors.accent.hover} !important;
            transform: translateY(-1px) !important;
            box-shadow: ${themeConfig.shadows.medium} !important;
        }

        .${THEME_CLASS} button:active {
            background: ${themeConfig.colors.accent.active} !important;
            transform: translateY(0) !important;
        }

        /* Refined Scrollbar */
        .${THEME_CLASS} ::-webkit-scrollbar {
            width: 10px !important;
            height: 10px !important;
        }

        .${THEME_CLASS} ::-webkit-scrollbar-track {
            background: ${themeConfig.colors.sumi.deepest} !important;
            border: ${themeConfig.borders.thin} ${themeConfig.colors.accent.border} !important;
        }

        .${THEME_CLASS} ::-webkit-scrollbar-thumb {
            background: ${themeConfig.colors.sumi.medium} !important;
            border: 2px solid ${themeConfig.colors.sumi.deepest} !important;
            border-radius: ${themeConfig.borders.radius.md} !important;
            transition: ${themeConfig.transitions.fast} !important;
        }

        .${THEME_CLASS} ::-webkit-scrollbar-thumb:hover {
            background: ${themeConfig.colors.sumi.light} !important;
        }

        /* Selection Enhancement */
        .${THEME_CLASS} ::selection {
            background: ${themeConfig.colors.accent.primary} !important;
            color: ${themeConfig.colors.washi.white} !important;
            text-shadow: none !important;
        }
    `;

    const SumiEManager = {
        init() {
            this.injectStyles();
            this.setupMutationObserver();
            this.activateTheme();
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
                        if (node.nodeType === 1 && node.tagName === 'STYLE' && !node.id.includes(THEME_ID)) {
                            node.remove();
                        }
                    });
                });
            });

            observer.observe(document.documentElement, {
                childList: true,
                subtree: true
            });
        },

        activateTheme() {
            document.documentElement.classList.add(THEME_CLASS);
            console.log('🎨 Sumi-e Theme Activated');
        }
    };

    // Initialize with better timing
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => SumiEManager.init());
    } else {
        SumiEManager.init();
    }
})();
