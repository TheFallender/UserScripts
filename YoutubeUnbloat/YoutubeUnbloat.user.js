// ==UserScript==
// @name         Youtube Hide Titles and Streams (WIP)
// @author       TheFallender
// @version      0.1.1
// @description  A script that hides the titles and streams that the user may not be interested in.
// @homepageURL  https://github.com/TheFallender/UserScripts
// @updateURL    https://raw.githubusercontent.com/TheFallender/UserScripts/master/YoutubeUnbloat/YoutubeUnbloat.user.js
// @downloadURL  https://raw.githubusercontent.com/TheFallender/UserScripts/master/YoutubeUnbloat/YoutubeUnbloat.user.js
// @supportURL   https://github.com/TheFallender/UserScripts
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @license      MIT
// @require      https://raw.githubusercontent.com/TheFallender/UserScripts/master/_Shared/WaitForElement.js
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // List selectors of videos
    const youtubeVidsSelector = 'div#contents > ytd-rich-item-renderer.style-scope.ytd-rich-grid-row:not([yt_hide_searched])';
    const streamLiveSelector = 'div.badge[aria-label="LIVE"]';
    const pastStreamSelector = 'span.ytd-video-meta-block:contains(Streamed)'
    const streamScheduleSelector = 'span.inline-metadata-item:contains(Scheduled)'
    const videoTitleSelector = 'yt-formatted-string#video-title'

    // Json checks
    const blockJsons = {
        "AngryJoeShow": {
            "hideLives": true,
            "hidePastLives": true,
            "hideScheduled": true,
            "titles": [
                "AJS News",
                "Angry Impressions",
                "Angry Movie",
                "Angry Trailer",
            ]
        },
        "JesseKazam": {
            "hideLives": true,
            "hidePastLives": true,
            "hideScheduled": true,
            "titles": []
        },
        "Pestily": {
            "hideLives": true,
            "hidePastLives": true,
            "hideScheduled": true,
            "titles": []
        },
    };

    function removeBloat () {
        let oldHref = "";
        const body = document.querySelector("body");
        const observer = new MutationObserver(mutations => {
            mutations.forEach(() => {
                if (oldHref !== document.location.href) {
                    oldHref = document.location.href;
                    //Wait for the videos
                    waitForElement(youtubeVidsSelector, true).then((videoLists) => {
                        Array.from(videoLists).forEach((video) => {
                            const videoTitleElement = video.querySelector(videoTitleSelector);

                            // Get the channel
                            const channelName = videoTitleElement.ariaLabel.match(/.*by (.*) (\d+,*)+ views( \d+.*ago)*/)[1];

                            // Check if the channel is in the blockJsons
                            if (!channelName || !blockJsons[channelName]) {
                                video.setAttribute("yt_hide_searched");
                                return;
                            }

                            // Get the channel json
                            const channelJson = blockJsons[channelName]

                            // Check if it should be removed for being live
                            if ((channelJson.hideLives && video.querySelector(streamLiveSelector)) ||
                                (channelJson.hidePastLives && video.querySelector(pastStreamSelector)) ||
                                (channelJson.hideScheduled && video.querySelector(streamScheduleSelector))) {
                                video.remove()
                                return;
                            }

                            // Check if it should be removed for the title
                            const videoTitle = videoTitleElement.textContent.toLowerCase()
                            if (channelJson.titles.some(title => videoTitle.includes(title.toLowerCase()))) {
                                video.remove()
                                return;
                            }
                        });
                    });
                }
            });
        });
        observer.observe(body, { childList: true, subtree: true });
    }

    removeBloat();
})();
