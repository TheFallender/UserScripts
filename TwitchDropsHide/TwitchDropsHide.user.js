// ==UserScript==
// @name         Twitch Drops only show interesting
// @author       TheFallender
// @version      1.3.6
// @description  A script that hides the drops not interesting to the user
// @homepageURL  https://github.com/TheFallender/UserScripts
// @updateURL    https://raw.githubusercontent.com/TheFallender/UserScripts/master/TwitchDropsHide/TwitchDropsHide.user.js
// @downloadURL  https://raw.githubusercontent.com/TheFallender/UserScripts/master/TwitchDropsHide/TwitchDropsHide.user.js
// @supportURL   https://github.com/TheFallender/UserScripts
// @match        https://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?domain=twitch.tv
// @license      MIT
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @require      https://raw.githubusercontent.com/TheFallender/UserScripts/master/_Shared/WaitForElement.js
// ==/UserScript==

(function () {
	"use strict";

	// Closed drops selectors
	const openDropsSel = ".drops-root__content > :nth-child(2)";
	const closedDropsHeaderSel = ".drops-root__content > :nth-child(3)";
	const closedDropsSel = ".drops-root__content > :nth-child(4)";

	// List selectors of drops and rewards
	const dropsListSel = ".drops-root__content div:has(> .accordion-header)";
	const rewardsSpecificSel = '.tw-link[href*="/directory/category/"]';

	// Selector of data of the drops/rewards
	const titleSelector = ".accordion-header div > p:first-child";
	const rewardCompanySelector = ".accordion-header div > p:last-child";

	// Helper function to create a column
	function createColumn(doc, title) {
		const column = doc.createElement("column");
		Object.assign(column.style, {
			display: "flex",
			flexDirection: "column",
			gap: "10px",
			flex: "1",
			padding: "10px",
			border: "1px solid #bbb",
			borderRadius: "5px",
			backgroundColor: "rgba(25, 25, 25, 0.85)",
		});

		const header = doc.createElement("h3");
		Object.assign(header.style, {
			marginTop: "0",
			paddingBottom: "8px",
			borderBottom: "1px solid #eee",
		});
		header.textContent = title;

		column.appendChild(header);
		return column;
	}

	// Method to clean the textarea
	function sortAndDeduplicateTextarea(textarea) {
		if (!textarea) return;

		const content = textarea.value;

		// Split into lines, trim and filter out empties
		const lines = content
			.split("\n")
			.map((line) => line.trim())
			.filter((line) => line !== "");

		// Create unique map to deduplicate (it is case insensitive)
		const uniqueMap = new Map();
		lines.forEach((line) => {
			uniqueMap.set(line.toLowerCase(), line);
		});

		// Convert to array, sort it, and get original values that are not lowercased
		const sortedUniqueLines = Array.from(uniqueMap.keys())
			.sort()
			.map((key) => uniqueMap.get(key));

		textarea.value = sortedUniqueLines.join("\n") + "\n";

		// Trigger input event to update counters
		const inputEvent = new Event("input", { bubbles: true });
		textarea.dispatchEvent(inputEvent);
	}

	// Add the clean button to the textarea
	function addCleanButton(doc, textarea) {
		const parentVar = textarea.closest(".config_var");
		if (!parentVar) return;

		const cleanButton = doc.createElement("button");
		cleanButton.textContent = "CleanSort";
		Object.assign(cleanButton.style, {
			display: "inline",
			marginTop: "5px",
			margin: "5px 5px 5px 0",
			padding: "3px 5px",
			fontSize: "0.8em",
		});

		cleanButton.addEventListener("click", function (e) {
			e.preventDefault();
			sortAndDeduplicateTextarea(textarea);
		});

		// Append before the textarea
		textarea.parentNode.insertBefore(cleanButton, textarea);
	}

	// Define the configuration
	GM_config.init({
		id: "ttvDropsConfig",
		title: "Twitch Drops Only Show Interesting",
		fields: {
			// Use Blacklist and Whitelist to get the final list?
			blacklistAndWhitelist: {
				label: "Use the Blacklist and the whitelist?",
				type: "checkbox",
				default: false,
			},
			// Closed Drops
			closedDropsRemovalEnabled: {
				label: "Hide Closed Drops",
				type: "checkbox",
				default: true,
			},
			// Games Filtering
			gameFilterEnabled: {
				label: "Filtering Games",
				type: "checkbox",
				default: true,
			},
			whitelistGames: {
				label: "Games to Allow (one per line)",
				type: "textarea",
				default: "",
			},
			blacklistGames: {
				label: "Games to Block (one per line)",
				type: "textarea",
				default: "",
			},
			// Companies Filtering
			companyFilterEnabled: {
				label: "Filtering Companies",
				type: "checkbox",
				default: true,
			},
			whitelistCompanies: {
				label: "Companies to Allow (one per line)",
				type: "textarea",
				default: "",
			},
			blacklistCompanies: {
				label: "Companies to Block (one per line)",
				type: "textarea",
				default: "",
			},
			// Rewards Filtering
			rewardFilterEnabled: {
				label: "Filtering Rewards",
				type: "checkbox",
				default: true,
			},
			whitelistRewards: {
				label: "Rewards to Allow (one per line)",
				type: "textarea",
				default: "",
			},
			blacklistRewards: {
				label: "Rewards to Block (one per line)",
				type: "textarea",
				default: "",
			},
		},
		events: {
			open: function (doc) {
				// Set background color
				Object.assign(doc.activeElement.style, {
					color: "rgb(230, 230, 230)",
					backgroundColor: "rgba(30, 30, 30, 0.8)",
				});

				// Get the config wrapper
				const configWrapper = doc.getElementById("ttvDropsConfig_wrapper");
				if (!configWrapper) return;

				// Find all config vars
				const configVars = Array.from(doc.querySelectorAll(".config_var"));
				if (configVars.length === 0) return;

				// Get the buttons container
				const buttons = Array.from(doc.querySelectorAll(".saveclose_buttons"));
				buttons.push(doc.querySelector(".reset_holder"));

				// Create new layout containers
				const layoutContainer = doc.createElement("layoutContainer");
				Object.assign(layoutContainer.style, {
					display: "flex",
					flexDirection: "column",
					gap: "2%",
					marginTop: "1%",
				});

				// General settings (first two checkboxes)
				const generalSettings = doc.createElement("generalSettings");
				Object.assign(generalSettings.style, {
					display: "flex",
					flexDirection: "row",
					justifyContent: "center",
					borderBottom: "1px solid #ccc",
					paddingBottom: "1%",
					columnGap: "3.5%",
					marginTop: "1%",
				});

				// Columns container
				const columnsContainer = doc.createElement("columnsContainer");
				Object.assign(columnsContainer.style, {
					display: "flex",
					flexDirection: "row",
					gap: "3.5%",
					marginTop: "2%",
					padding: "0 1.5% 0 1.5%",
				});

				// Columns Setup
				const gamesColumn = createColumn(doc, "Games");
				const companiesColumn = createColumn(doc, "Companies");
				const rewardsColumn = createColumn(doc, "Rewards");

				// Columns
				columnsContainer.appendChild(gamesColumn);
				columnsContainer.appendChild(companiesColumn);
				columnsContainer.appendChild(rewardsColumn);

				// Organize Elements
				configVars.forEach((configVar) => {
					const id = configVar.id;

					// General settings
					if (id.includes("blacklistAndWhitelist") || id.includes("closedDropsRemovalEnabled")) {
						generalSettings.appendChild(configVar);
					}
					// Games
					else if (id.toLowerCase().includes("game")) {
						gamesColumn.appendChild(configVar);
					}
					// Companies
					else if (id.toLowerCase().includes("compan")) {
						companiesColumn.appendChild(configVar);
					}
					// Rewards
					else if (id.toLowerCase().includes("reward")) {
						rewardsColumn.appendChild(configVar);
					}
				});

				// Build the layout
				layoutContainer.appendChild(generalSettings);
				layoutContainer.appendChild(columnsContainer);

				// Clear the original container and add our new layout
				// Get the section that contains all the config_vars
				const configSection = doc.getElementById("ttvDropsConfig_section_0");
				if (configSection) {
					configSection.innerHTML = "";
					configSection.appendChild(layoutContainer);
					// Re-add the buttons
					buttons.forEach((button) => {
						Object.assign(button.style, {
							margin: "10px 10px 0px",
						});
						configSection.appendChild(button);
					});

					// Display Inline for Restore Button
					doc.querySelector(".reset_holder").style.display = "inline";
					doc.querySelector("#ttvDropsConfig_resetLink").style.color = "rgb(230, 230, 230)";
				}

				// Apply collapsible behavior to textareas
				const textareas = doc.querySelectorAll(".config_var > textarea");
				textareas.forEach((textarea) => {
					const parentVar = textarea.closest(".config_var");
					if (!parentVar) return;

					textarea.style.width = "100%";
					textarea.style.height = "18vh";
					textarea.style.resize = "vertical";
					textarea.style.backgroundColor = "rgba(23, 23, 23, 0.0)";
					textarea.style.color = "rgb(230, 230, 230)";

					const label = parentVar.querySelector(".field_label");
					if (!label) return;

					// Get the total count
					const getCount = () => textarea.value.split("\n").filter((s) => s.trim() !== "").length;

					// Add toggle and count
					const toggle = doc.createElement("span");
					Object.assign(toggle.style, {
						cursor: "pointer",
						userSelect: "none",
						marginLeft: "5px",
						fontWeight: "bold",
					});
					toggle.textContent = "▼";

					const countSpan = doc.createElement("span");
					Object.assign(countSpan.style, {
						fontSize: "0.9em",
						color: "rgb(230, 230, 230)",
						marginLeft: "5px",
					});
					countSpan.textContent = `(${getCount()} items)`;

					label.appendChild(toggle);
					label.appendChild(countSpan);

					// Set up toggle behavior
					label.style.cursor = "pointer";
					label.style.display = "inline";
					label.style.userSelect = "none";
					label.addEventListener("click", function (e) {
						if (e.target === textarea) return;

						const isCollapsed = textarea.style.display === "none";
						toggle.textContent = isCollapsed ? "▼" : "▶";

						textarea.style.display = isCollapsed ? "block" : "none";
					});

					// Update count on input
					textarea.addEventListener("input", function () {
						countSpan.textContent = `(${getCount()} items)`;
					});

					// Add the clean button to the textarea
					addCleanButton(doc, textarea);
				});
			},
			save: function () {
				location.reload();
			},
		},
	});

	// Register menu command to open config
	GM_registerMenuCommand("Settings", function () {
		GM_config.open();
	});

	function filterDrop(dropElement, dropText, greyListEnabled, whitelist, blacklist) {
		// Lowercase it
		dropText = dropText.toLowerCase();

		// If whitelist and blacklist is disabled
		if (!greyListEnabled) {
			if (!whitelist.includes(dropText)) {
				dropElement.remove();
			}
			return;
		}

		// Drops to show
		if (whitelist.includes(dropText)) {
			return;
		}

		// Drops to remove
		if (blacklist.includes(dropText)) {
			dropElement.remove();
		}
	}

	function extractListData(rawTextArea) {
		return rawTextArea
			.split("\n")
			.filter((s) => s.trim() !== "")
			.map((s) => s.toLowerCase());
	}

	//Remove the drops
	function removeDrops() {
		let oldHref = "";
		const body = document.querySelector("body");
		const observer = new MutationObserver((mutations) => {
			mutations.forEach(() => {
				if (oldHref !== document.location.href) {
					oldHref = document.location.href;
					if (document.location.href.includes("/drops/campaigns")) {
						// This will leave games not defined in either out, better that way than
						// missing drops of new games.

						// Get the settings
						const greyListEnabled = GM_config.get("blacklistAndWhitelist");

						// Game settings
						const gameFilterEnabled = GM_config.get("gameFilterEnabled");
						const whitelistGames = extractListData(GM_config.get("whitelistGames"));
						const blacklistGames = extractListData(GM_config.get("blacklistGames"));

						// Company settings
						const companyFilterEnabled = GM_config.get("companyFilterEnabled");
						const whitelistCompanies = extractListData(GM_config.get("whitelistCompanies"));
						const blacklistCompanies = extractListData(GM_config.get("blacklistCompanies"));

						// Reward settings
						const rewardFilterEnabled = GM_config.get("rewardFilterEnabled");
						const whitelistRewards = extractListData(GM_config.get("whitelistRewards"));
						const blacklistRewards = extractListData(GM_config.get("blacklistRewards"));

						// Closed drops settings
						const closedDropsRemovalEnabled = GM_config.get("closedDropsRemovalEnabled");

						//Wait for the Drops
						waitForElement(dropsListSel, true).then((element) => {
							let games = [];
							let rewards = [];

							// Remove closed drops
							let bottomSelector = closedDropsSel;
							if (closedDropsRemovalEnabled) {
								const header = document.querySelector(closedDropsHeaderSel);
								const closed = document.querySelector(closedDropsSel);
								if (header) header.remove();
								if (closed) closed.remove();

								bottomSelector = openDropsSel;
							}

							// Pad the container
							document.querySelector(bottomSelector).style.paddingBottom = "8vh";

							// Extract the data
							Array.from(element).forEach((dropElement) => {
								// Get the title of the drop
								const rewardGame = dropElement.querySelector(rewardsSpecificSel)?.innerText;
								if (rewardGame !== undefined) {
									const company =
										dropElement.querySelector(rewardCompanySelector)?.innerText;
									rewards.push([dropElement, rewardGame, company]);
								} else {
									const title = dropElement.querySelector(titleSelector)?.innerText;
									games.push([dropElement, title]);
								}
							});

							// Remove drops for games
							if (gameFilterEnabled) {
								games.forEach((game) => {
									// Unpack
									const element = game[0];
									const title = game[1];

									// Game Filtering
									filterDrop(
										element,
										title,
										greyListEnabled,
										whitelistGames,
										blacklistGames,
									);
								});
							}

							// Remove drops for rewards
							rewards.forEach((reward) => {
								// Unpack
								const element = reward[0];
								const game = reward[1];
								const company = reward[2];

								// Rewards Filtering
								if (companyFilterEnabled) {
									filterDrop(
										element,
										company,
										greyListEnabled,
										whitelistCompanies,
										blacklistCompanies,
									);
								}

								if (rewardFilterEnabled) {
									filterDrop(
										element,
										game,
										greyListEnabled,
										whitelistRewards,
										blacklistRewards,
									);
								}
							});
						});
					}
				}
			});
		});
		observer.observe(body, { childList: true, subtree: true });
	}

	removeDrops();
})();
