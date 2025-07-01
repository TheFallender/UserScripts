// ==UserScript==
// @name         Steam Short Share
// @author       TheFallender
// @version      1.0.5
// @description  Will replace the links of sharing with the s.team/a/<id> format
// @homepageURL  https://github.com/TheFallender/UserScripts
// @updateURL    https://raw.githubusercontent.com/TheFallender/UserScripts/master/SteamShortShare/SteamShortShare.user.js
// @downloadURL  https://raw.githubusercontent.com/TheFallender/UserScripts/master/SteamShortShare/SteamShortShare.user.js
// @supportURL   https://github.com/TheFallender/UserScripts
// @match        https://store.steampowered.com/app/*
// @icon         https://www.google.com/s2/favicons?domain=s.team
// @license      MIT
// @require      https://raw.githubusercontent.com/TheFallender/UserScripts/master/_Shared/WaitForElement.js
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Selectors
    const shareButtonSel = '#queueActionsCtn > div';
    const gameId = document.location.pathname.match(/\/app\/(\d+)\//)[1];
    
    //Replace share links
    waitForElement(shareButtonSel, false).then((element) => {
        // Outer Div
        const queueBtnShare = document.createElement('div');
        queueBtnShare.id = 'queueBtnShare';
        queueBtnShare.classList.add('queue_control_button');
        queueBtnShare.style.flexGrow = '0';

        // Button Div
        const innerDiv = document.createElement('div');
        innerDiv.classList.add('btnv6_blue_hoverfade', 'btn_medium', 'queue_btn_inactive');
        innerDiv.setAttribute('data-panel', '{"focusable":true,"clickOnActivate":true}');
        innerDiv.setAttribute('data-tooltip-text', 'Quickly share your Steam links.');

        // Span with Share
        const spanElement = document.createElement('span');
        spanElement.appendChild(document.createTextNode(' Share'));

        // Closing Divs
        innerDiv.appendChild(spanElement);
        queueBtnShare.appendChild(innerDiv);

        const targetDiv = document.querySelector('#queueActionsCtn > div[style="clear: both;"]');

        // Add the whitespace before
        targetDiv.parentNode.insertBefore(document.createTextNode("\n"), targetDiv);

        // Add the button and the click
        let finalShareButton = targetDiv.parentNode.insertBefore(queueBtnShare, targetDiv);
        finalShareButton.onclick = (event) => { navigator.clipboard.writeText(`https://s.team/a/${gameId}`); };

        // Add the whitespace after
        targetDiv.parentNode.insertBefore(document.createTextNode("\n"), targetDiv);
    });
})();
