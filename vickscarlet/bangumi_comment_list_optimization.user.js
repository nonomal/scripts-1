// ==UserScript==
// @name         Bangumi 高楼优化
// @version      2.0.3
// @namespace    b38.dev
// @description  优化高楼评论的滚动性能，只渲染可见区域的评论，减少卡顿和内存占用
// @author       神戸小鳥 @vickscarlet
// @license      MIT
// @icon         https://bgm.tv/img/favicon.ico
// @homepage     https://github.com/bangumi/scripts/blob/master/vickscarlet/bangumi_comment_list_optimization.user.js
// @match        *://bgm.tv/*
// @match        *://chii.in/*
// @match        *://bangumi.tv/*
// @run-at       document-start
// ==/UserScript==
(async () => {
    /**merge:js=_common.dom.style.js**/
    function addStyle(...styles) { const style = document.createElement('style'); style.append(document.createTextNode(styles.join('\n'))); document.head.appendChild(style); return style; }
    /**merge**/
    addStyle(/**merge:css=bangumi_comment_list_optimization.user.1.css**/`html {#comment_list .v-hd {>*:not(.v-ph) {display: none;}>.v-ph {display: block;}}.v-ph {display: none;}}`/**merge**/);
    const style = addStyle(/**merge:css=bangumi_comment_list_optimization.user.2.css**/`html {#sliderContainer,#comment_list > * > * {display: none;}}`/**merge**/);

    document.addEventListener('readystatechange', () => {
        if (document.readyState !== 'complete') return;
        const container = document.querySelector('#comment_list');
        if (!container) return style.remove();
        const items = Array.from(container.children);
        if (items.length < 30) return style.remove();

        let width = container.offsetWidth;
        window.addEventListener('resize', () => { width = container.offsetWidth })
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const item = entry.target;
                if (entry.isIntersecting) {
                    item.classList.remove('v-hd')
                } else {
                    if (width != item._lastWidth) {
                        const placeholder = item.querySelector(':scope>.v-ph');
                        const style = getComputedStyle(item);
                        const height = item.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom)
                        placeholder.style.height = `${height}px`
                        item._lastWidth = width
                    }
                    item.classList.add('v-hd');
                }
            });
        }, {
            root: null,
            rootMargin: '0px',
            threshold: [0, 0.01]
        });

        items.forEach(item => {
            item.classList.add('v-hd');
            const placeholder = document.createElement('div');
            placeholder.classList.add('v-ph')
            item.append(placeholder);
            observer.observe(item);
        });
        style.remove();
    })
})();
