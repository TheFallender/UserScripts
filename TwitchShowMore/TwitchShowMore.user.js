// ==UserScript==
// @name         Twitch Show More
// @author       TheFallender
// @version      1.9.5
// @description  A script that will show all your streammers and hide the bloat
// @homepageURL  https://github.com/TheFallender/UserScripts
// @updateURL    https://raw.githubusercontent.com/TheFallender/UserScripts/master/TwitchShowMore/TwitchShowMore.user.js
// @downloadURL  https://raw.githubusercontent.com/TheFallender/UserScripts/master/TwitchShowMore/TwitchShowMore.user.js
// @supportURL   https://github.com/TheFallender/UserScripts
// @match        https://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?domain=twitch.tv
// @license      MIT
// @require      https://raw.githubusercontent.com/TheFallender/UserScripts/master/_Shared/WaitForElement.js
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    //Main selector for the show more
    const followedChannelsSelector = 'div.side-nav-show-more-toggle__button button';

    // Sleep method for easier use
    function sleep (msTime) {
        return new Promise(r => setTimeout(r, msTime));
    }

    //Remove the side nav bloat
    function removeBloat () {
        const body = document.querySelector("body");
        const observer = new MutationObserver(mutations => {
            //Wait until the followed channel button is loaded
            waitForElement(followedChannelsSelector).then(async (element) => {
                //Assign the show more element to the one it waited for
                let showMoreElement = element;

                //Loop until the Toggle doesn't have the "Show More" text
                for (; showMoreElement && showMoreElement.textContent == "Show More"; showMoreElement = document.querySelector(followedChannelsSelector)) {
                    showMoreElement.click();
                    await sleep(100);
                }

                //Hide the show more/show less button
                showMoreElement.setAttribute('style', 'display: none !important');
            });
        });
        observer.observe(body, { childList: true, subtree: true });
    }

    removeBloat();
})();
