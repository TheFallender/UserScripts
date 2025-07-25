// ==UserScript==
// @name         Youtube Shorts - Remove from WH
// @author       TheFallender
// @version      1.3.3
// @description  This script will remove all the Shorts watched in your watch history.
// @homepageURL  https://github.com/TheFallender/UserScripts
// @updateURL    https://raw.githubusercontent.com/TheFallender/UserScripts/master/YoutubeShortsRemoveWH/YoutubeShortsRemoveWH.user.js
// @downloadURL  https://raw.githubusercontent.com/TheFallender/UserScripts/master/YoutubeShortsRemoveWH/YoutubeShortsRemoveWH.user.js
// @match        https://*.youtube.com/feed/history
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @license      MIT
// @require      http://code.jquery.com/jquery-3.6.0.min.js
// @require      http://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// @require      https://raw.githubusercontent.com/TheFallender/UserScripts/master/_Shared/WaitForElement.js
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Wait time: Time to wait between changes.
    const timeBetweenWaits = 500;

    // Iterations limit
    const iterationsLimit = -1;

    // Selector items
    const waitUntilReadySelector = "button#button.yt-icon-button div.yt-spec-icon-badge-shape--type-notification svg";
    const selShortsSelf = "ytd-reel-shelf-renderer";
    const selShortsSelfItemsList = "div#items";
    const selShortsSelfVideos = "div#items > ytd-reel-item-renderer";
    const selShortsSelfUnloadedVideo = "ytd-reel-item-renderer:not(:has(div#menu > ytd-menu-renderer))";
    const selShortsSelfMenuButton = "div#menu.ytd-reel-item-renderer > ytd-menu-renderer > yt-icon-button > button";
    const selShorts = "ytd-video-renderer:has(ytd-thumbnail-overlay-time-status-renderer[overlay-style='SHORTS'])"
    const selShortsButton = "yt-button-shape button";
    const selMenuRemove = "div.tp-yt-iron-dropdown ytd-menu-service-item-renderer";
    const selPostToasts = "tp-yt-paper-toast#toast";
    const selUnloadedVideos = "ytd-video-renderer:not(:has(div#overlays ytd-thumbnail-overlay-time-status-renderer))";

    // Sleep method for easier use
    function sleep (msTime) {
        return new Promise(r => setTimeout(r, msTime));
    }

    // Wait until the shorts are loaded, if there are none
    // the script will be stalled here
    waitForElement(waitUntilReadySelector).then(async (element) => {
        // Iteration limit
        for (let iterations = 0; iterations != iterationsLimit; iterations++, await sleep(3000)) {
            console.log(`Iteration: ${iterations}`);

            // Check if we have videos that have yet to load
            let unloadedVideos = null;
            do {
                unloadedVideos = document.querySelectorAll(selUnloadedVideos);
                if (unloadedVideos.length > 0) {
                    await sleep(5000)
                }
            } while (unloadedVideos.length > 0)

            // Get the first short shelf
            let shortsSelf = document.querySelector(selShortsSelf);
            console.log(`ShortsSelf: ${shortsSelf ? shortsSelf.querySelectorAll(selShortsSelfVideos).length : 'Not found'}`);

            // Shorts
            let shorts = document.querySelectorAll(selShorts);
            console.log(`Shorts: ${shorts.length}`);

            // Scroll if not found
            if (shortsSelf == null && shorts.length == 0) {
                // Scroll to the bottom to force a refresh
                window.scrollTo(0, document.documentElement.scrollHeight);
                continue;
            }

            // Clean the shorts list
            for (let i = 0; i < shorts.length; i++) {
                let short = shorts[i];

                // Click the button to delete it from the watch history
                short.querySelector(selShortsButton)?.click();

                // Remove the short
                short.remove();

                // Wait the time for the next short
                await sleep(timeBetweenWaits);
            }

            // Get the shorts list
            if (shortsSelf == null) {
                continue;
            }

            // Check if we have videos that have yet to load
            let shortsSelfVideosList = shortsSelf.querySelector(selShortsSelfItemsList);
            unloadedVideos = null;
            do {
                unloadedVideos = shortsSelfVideosList.querySelectorAll(selShortsSelfUnloadedVideo)
                if (unloadedVideos.length > 0) {
                     await sleep(5000)
                }
            } while (unloadedVideos.length > 0)

            //Shorts Shelf
            let shortsSelfVideos = shortsSelf.querySelectorAll(selShortsSelfVideos);
            while (shortsSelfVideos.length > 0) {
                let short = shortsSelfVideos[0];

                // Click the button to show the toast
                short.querySelector(selShortsSelfMenuButton).click()
                await sleep(250);

                // Click on the remove on the toast
                let shortMenu = Array.from(document.querySelectorAll(selMenuRemove));

                // Find the remove button
                let removeButton = shortMenu.find((menuItem) => {
                    if (menuItem.textContent.toLowerCase().includes('remove')) {
                        return true;
                    }
                });

                // Click the button
                removeButton.click();
                short.remove()

                // Wait the time for the next short
                await sleep(timeBetweenWaits);

                // Check again for the amount of videos
                shortsSelfVideos = shortsSelf.querySelectorAll(selShortsSelfVideos);
            }

            // Remove the list
            shortsSelf.remove()
        }

        location.reload();
    });
})();
