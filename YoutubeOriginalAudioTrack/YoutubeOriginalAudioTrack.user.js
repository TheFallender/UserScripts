// ==UserScript==
// @name         Youtube Video Original Audio Track
// @author       TheFallender
// @version      1.0.0
// @description  Will set the Audio Track to the original one as soon as the video loads
// @homepageURL  https://github.com/TheFallender/UserScripts
// @updateURL    https://raw.githubusercontent.com/TheFallender/UserScripts/master/YoutubeOriginalAudioTrack/YoutubeOriginalAudioTrack.user.js
// @downloadURL  https://raw.githubusercontent.com/TheFallender/UserScripts/master/YoutubeOriginalAudioTrack/YoutubeOriginalAudioTrack.user.js
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
	const ytPlayerSelector = "ytd-player";
	const ytMetadataSel = "ytd-watch-metadata";
	const audioTrackOriginal = /\s+original$/gi;

	// Variables
	let isAudioTrackPromiseRunning = false;

	//Links replacement
	function setOriginalAudioTrack(ytPlayer) {
		const audioTracks = ytPlayer.getAvailableAudioTracks().map((x) => {
			return x.getLanguageInfo().getName();
		});

		for (let audioTrack of audioTracks) {
			const name = audioTrack.getLanguageInfo().getName();

			if (audioTrackOriginal.test(name)) {
				player.setAudioTrack(track);
				break;
			}
		}
	}

	// Sleep function
	function sleep(ms) {
		return new Promise((resolve) => {
			setTimeout(resolve, ms);
		});
	}

	// Observe video ID changes
	function observeVideoIdChange(targetElement, callback) {
		const observer = new MutationObserver((mutations) => {
			mutations.forEach(async (mutation) => {
				await sleep(1000);
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
		if (!isAudioTrackPromiseRunning) {
			isAudioTrackPromiseRunning = true;
			waitForElement(ytPlayerSelector).then((element) => {
				setOriginalAudioTrack(element.player_);
				isAudioTrackPromiseRunning = false;
			});
		}
	}

	waitForElement(ytMetadataSel).then((element) => observeVideoIdChange(element, setupWaitPromises));
})();
