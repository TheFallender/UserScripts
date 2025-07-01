// ==UserScript==
// @name         Twitch Auto Fix
// @author       TheFallender
// @version      1.0.1
// @description  It will unmute/refresh automatically all Twitch Streams so the Drops are obtainable
// @homepageURL  https://github.com/TheFallender/UserScripts
// @updateURL    https://raw.githubusercontent.com/TheFallender/UserScripts/master/TwitchAutoUnmute/TwitchAutoUnmute.user.js
// @downloadURL  https://raw.githubusercontent.com/TheFallender/UserScripts/master/TwitchAutoUnmute/TwitchAutoUnmute.user.js
// @supportURL   https://github.com/TheFallender/UserScripts
// @match        https://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?domain=twitch.tv
// @license      MIT
// @require      https://raw.githubusercontent.com/TheFallender/UserScripts/master/_Shared/WaitForElement.js
// @grant        none
// ==/UserScript==

(function () {
	"use strict";
	
	// Mute and errors selectors
	const muteSelector = ".video-player__default-player button[data-a-target=\"player-mute-unmute-button\"]:enabled";
	const pausedSelector = ".video-player__default-player button[data-a-target=\"player-play-pause-button\"]:enabled";
	const errorSelector = ".content-overlay-gate__content:has(strong:contains(Error)) button"

	// Sleep function
	function sleep(ms) {
		return new Promise((resolve) => {
			setTimeout(resolve, ms);
		});
	}

	// Click and Requeue
	async function clickAndRequeue(selector, element) {
		// Click the element (mute, pause, error)
		element.click();

		// Wait 2.5 seconds
		await sleep(2500);
		
		// Requeue the wait for the element
		waitForElement(selector).then((element) => {
			clickAndRequeue(selector, element);
		});
	}

	// Startup the waits for the elements
	if (document.location.href.match(/twitch.tv\/\w+?$/)) {
		//Wait for the Mute button
		waitForElement(muteSelector).then((element) => {
			clickAndRequeue(muteSelector, element);
		});

		//Wait for the Paused button
		waitForElement(pausedSelector).then((element) => {
			clickAndRequeue(pausedSelector, element);
		});

		//Wait for the Error button
		waitForElement(errorSelector).then((element) => {
			clickAndRequeue(errorSelector, element);
		});
	}
})();
