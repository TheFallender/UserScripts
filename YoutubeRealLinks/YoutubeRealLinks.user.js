// ==UserScript==
// @name         Youtube Real Links
// @author       TheFallender
// @version      1.0.3
// @description  Will replace the links with the actual content, not the Youtube Redirect
// @homepageURL  https://github.com/TheFallender/UserScripts
// @updateURL    https://raw.githubusercontent.com/TheFallender/UserScripts/master/YoutubeRealLinks/YoutubeRealLinks.user.js
// @downloadURL  https://raw.githubusercontent.com/TheFallender/UserScripts/master/YoutubeRealLinks/YoutubeRealLinks.user.js
// @supportURL   https://github.com/TheFallender/UserScripts
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @license      MIT
// @require      https://raw.githubusercontent.com/TheFallender/UserScripts/master/_Shared/WaitForElement.js
// @grant        none
// ==/UserScript==

(function () {
	"use strict";

	// Selectors
	const descriptionLinksSel =
        "#description-inline-expander .yt-core-attributed-string__link";
	const descriptionExpandedLinksSel =
		"#description-inline-expander[is-expanded] .yt-core-attributed-string__link";
    const ytMetadataSel = "ytd-watch-metadata";

    // Variables
    let isDescriptionPromiseRunning = false;
	let isDescriptionExpandedPromiseRunning = false;

	//Links replacement
	function replaceLinks(elements) {
		console.log("Cleanup started!");
		Array.from(elements).forEach((element) => {
			const elemURL = new URL(element.href);
			if (
				!elemURL.href.startsWith(
					"https://www.youtube.com/redirect?event=video_description&redir_token",
				)
			) {
				// No redirect or no youtube, skip
				return;
			}
			const urlParams = new URLSearchParams(elemURL.search);
			const redirectURL = urlParams.get("q");

			if (redirectURL) {
				element.href = decodeURIComponent(redirectURL);
			}
		});
	}

	// Observe video ID changes
	function observeVideoIdChange(targetElement, callback) {

		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				callback();
			});
		});

		observer.observe(targetElement, {
			attributes: true,
			attributeFilter: ["video-id", "videoId"],
		});

		return observer;
	}

    function setupWaitPromises() {
		if (!isDescriptionPromiseRunning) {
			console.log("Setting up the Description promise ");
			isDescriptionPromiseRunning = true;
			waitForElement(descriptionLinksSel, true).then((elements) => {
				replaceLinks(elements);
				isDescriptionPromiseRunning = false;
			});
		}

		if (!isDescriptionExpandedPromiseRunning) {
			console.log("Setting up the Description Expanded promise ");
			isDescriptionExpandedPromiseRunning = true;
			waitForElement(descriptionExpandedLinksSel, true).then((elements) => {
				replaceLinks(elements);
				isDescriptionExpandedPromiseRunning = false;
			});
		}
    }

    waitForElement(ytMetadataSel).then((element) =>
        observeVideoIdChange(element, setupWaitPromises)
    );
})();
