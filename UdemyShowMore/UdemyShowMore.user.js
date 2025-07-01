// ==UserScript==
// @name         Udemy Show More
// @author       TheFallender
// @version      1.4.3
// @description  A script that will show all your elements in your collections.
// @homepageURL  https://github.com/TheFallender/UserScripts
// @updateURL    https://raw.githubusercontent.com/TheFallender/UserScripts/master/UdemyShowMore/UdemyShowMore.user.js
// @downloadURL  https://raw.githubusercontent.com/TheFallender/UserScripts/master/UdemyShowMore/UdemyShowMore.user.js
// @supportURL   https://github.com/TheFallender/UserScripts
// @match        https://www.udemy.com/home/my-courses/lists*
// @icon         https://www.google.com/s2/favicons?domain=udemy.com
// @license      MIT
// @require      https://raw.githubusercontent.com/TheFallender/UserScripts/master/_Shared/WaitForElement.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    //Main selector for the load more courses
    const loadMoreCourses = 'div > button[data-purpose="load-more-courses-for-collection"]';

    //Ratings
    const removeRatings = true;
    const ratingsSelector = 'button[data-purpose="review-button"]';

    //Wait until the load more courses button is loaded
    waitForElement(loadMoreCourses).then((element) => {
        //See more list
        let seeMoreList = document.querySelectorAll(loadMoreCourses);

        //Loop all of the elements
        seeMoreList.forEach (elem => {
            elem.click();
            elem.style.display = "none";
        });

        //Reset scroll
        window.scrollTo(0,0);

        //Remove Ratings
        if (removeRatings) {
            let ratingsList = document.querySelectorAll(ratingsSelector);
            ratingsList.forEach(elem => {
                elem.style.display = "none";
            });
        }
    });
})();
