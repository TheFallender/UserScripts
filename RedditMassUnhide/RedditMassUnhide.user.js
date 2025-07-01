// ==UserScript==
// @name         Reddit Mass Unhide
// @author       TheFallender
// @version      1.2.4
// @description  This script will unhide all your hidden posts, cause reddit sucks and doesn't have this feature by default.
// @homepageURL  https://github.com/TheFallender/UserScripts
// @updateURL    https://raw.githubusercontent.com/TheFallender/UserScripts/master/RedditMassUnhide/RedditMassUnhide.user.js
// @downloadURL  https://raw.githubusercontent.com/TheFallender/UserScripts/master/RedditMassUnhide/RedditMassUnhide.user.js
// @supportURL   https://github.com/TheFallender/UserScripts
// @match        https://www.reddit.com/user/*/hidden*
// @icon         https://www.google.com/s2/favicons?domain=reddit.com
// @license      MIT
// @require      http://code.jquery.com/jquery-3.6.0.min.js
// @require      http://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// @require      https://raw.githubusercontent.com/TheFallender/UserScripts/master/_Shared/WaitForElement.js
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    //Wait time: Time to wait between changes.
    const timeBetweenWaits = 150;

    //Hidden posts var
    let currentHiddenPosts = [];

    //Iterations done
    let iterations = 0;

    //Iteration limit
    const iterationsLimit = 5;

    //Selector items
    const postsLoaded = ".Post.scrollerItem";
    const postsHidden = "button:has(span:contains('unhide'))";
    const postToasts = "div:has(> div > div > svg.CloseIcon)";

    //Wait until the posts are loaded, if there are none
    //the script will be stalled here
    waitForElement(postsLoaded).then((element) => {
        //Timeout for each transition
        const interval = setInterval(() => {
            //Refresh hidden posts list
            if (currentHiddenPosts.length == 0) {
                //Scroll to the bottom to force a refresh
                window.scrollTo(0, document.body.scrollHeight);

                //Get posts
                currentHiddenPosts = $(postsHidden).toArray();

                //Increase iterations
                if (++iterations >= iterationsLimit) {
                    clearInterval(interval);
                    location.reload();
                }
            }

            //Unhide hidden post
            currentHiddenPosts.shift().click();
        }, timeBetweenWaits);
    });

    //Wait until the posts are loaded, if there are none
    //the script will be stalled here
    waitForElement(postsLoaded).then(() => {
        //Remove the toasts
        let divOfTheToasts = $(postToasts).toArray();
        if (divOfTheToasts.length > 0) {
            divOfTheToasts[0].remove();
        }
    });

})();
