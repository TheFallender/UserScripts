// ==UserScript==
// @name         Youtube Real Links
// @author       TheFallender
// @version      1.0.2
// @description  Will replace the links with the actual content, not the Youtube Redirect
// @homepageURL  https://github.com/TheFallender/UserScripts
// @updateURL    https://raw.githubusercontent.com/TheFallender/UserScripts/master/YoutubeRealLinks/YoutubeRealLinks.user.js
// @downloadURL  https://raw.githubusercontent.com/TheFallender/UserScripts/master/YoutubeRealLinks/YoutubeRealLinks.user.js
// @supportURL   https://github.com/TheFallender/UserScripts
// @match        https://www.youtube.com/watch*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @license      MIT
// @require      https://raw.githubusercontent.com/TheFallender/UserScripts/master/_Shared/WaitForElement.js
// @grant        none
// ==/UserScript==


(function () {
    'use strict';

    // Selectors
    const descriptionLinksSel = '#description-inline-expander .yt-core-attributed-string__link';
    const descriptionExpandedLinksSel = '#description-inline-expander[is-expanded] .yt-core-attributed-string__link';

    //Links replacement
    function replaceLinks(elements) {
        Array.from(elements).forEach((element) => {
            const elemURL = new URL(element.href);
            if (!elemURL.hostname.includes('youtube.com') || elemURL.pathname !== '/redirect') {
                // No redirect or no youtube, skip
                return;
            }
            const urlParams = new URLSearchParams(elemURL.search);
            const redirectURL = urlParams.get('q');

            if (redirectURL) {
                element.href = decodeURIComponent(redirectURL);
            }
        });
    }

    // Page change detection
    let oldHref = "";
    function pageChangeCheck() {
        if (oldHref !== document.location.href) {
            if (new URL(document.location.href).pathname === '/watch') {
                waitForElementCallback(descriptionLinksSel, null, true, true).then((elements) => replaceLinks(elements));
                waitForElementCallback(descriptionExpandedLinksSel, null, true, true).then((elements) => replaceLinks(elements));
            }
        }
    }

    pageChangeCheck();
    setInterval(pageChangeCheck, 3000);
})();
