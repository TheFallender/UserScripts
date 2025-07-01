// ==UserScript==
// @name         Twitch Auto Fix
// @author       TheFallender
// @version      1.0.0
// @description  It will unmute/refresh automatically all Twitch Streams so the Drops are obtainable
// @homepageURL  https://github.com/TheFallender/TamperMonkeyScripts
// @updateURL    https://raw.githubusercontent.com/TheFallender/TamperMonkeyScripts/master/TwitchAutoUnmute/TwitchAutoUnmute.user.js
// @downloadURL  https://raw.githubusercontent.com/TheFallender/TamperMonkeyScripts/master/TwitchAutoUnmute/TwitchAutoUnmute.user.js
// @supportURL   https://github.com/TheFallender/TamperMonkeyScripts
// @match        https://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?domain=twitch.tv
// @license      MIT
// ==/UserScript==

(function () {
	"use strict";

	// Startup
	isSetupDone = false;

	// Mute and errors selectors
	const muteSelector = ".video-player__default-player button[data-a-target=\"player-mute-unmute-button\"]:enabled";
	const pausedSelector = ".video-player__default-player button[data-a-target=\"player-play-pause-button\"]:enabled";
	const errorSelector = ".content-overlay-gate__content:has(strong:contains(Error)) button"

	// Method to wait for an element in the DOM
	function waitForElement(selector, selectorAll = false) {
		return new Promise((resolve) => {
			//Return the element if it is already in the DOM
			if (!selectorAll) {
				const element = document.querySelector(selector);
				if (element) {
					resolve(element);
				}
			} else {
				const element = document.querySelectorAll(selector);
				if (element.length > 0) {
					resolve(element);
				}
			}

			//Wait for the element to be in the DOM
			const observer = new MutationObserver((mutations) => {
				if (!selectorAll) {
					const element = document.querySelector(selector);
					if (element) {
						resolve(element);
						observer.disconnect();
					}
				} else {
					const element = document.querySelectorAll(selector);
					if (element.length > 0) {
						resolve(element);
						observer.disconnect();
					}
				}
			});

			//Observer settings
			observer.observe(document.body, {
				childList: true,
				subtree: true,
			});
		});
	}

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

	// Remove the drops
	function removeDrops() {
		let oldHref = "";
		const body = document.querySelector("body");
		const observer = new MutationObserver((mutations) => {
			mutations.forEach(() => {
				if (oldHref !== document.location.href) {
					oldHref = document.location.href;
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
				}
			});
		});
		observer.observe(body, { childList: true, subtree: true });
	}

	removeDrops();
})();
