// ==UserScript==
// @name         Twitch Drops only show interesting
// @author       TheFallender
// @version      1.2.7
// @description  A script that hides the drops not interesting to the user
// @homepageURL  https://github.com/TheFallender/TamperMonkeyScripts
// @updateURL    https://raw.githubusercontent.com/TheFallender/TamperMonkeyScripts/master/TwitchDropsHide/TwitchDropsHide.user.js
// @downloadURL  https://raw.githubusercontent.com/TheFallender/TamperMonkeyScripts/master/TwitchDropsHide/TwitchDropsHide.user.js
// @supportURL   https://github.com/TheFallender/TamperMonkeyScripts
// @match        https://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?domain=twitch.tv
// @license      MIT
// @copyright    Copyright © 2024 TheFallender
// @grant        none
// ==/UserScript==

(function () {
    "use strict";

    // List selectors of drops and rewards
    const dropsListSel =
        "div.drops-root__content > div > div:has(>div.accordion-header h3.tw-title)";
    const rewardsListSel =
        "div.drops-root__content > div > div > div:has(>div.accordion-header h3.tw-title)";

    // Selector of data of the drops/rewards
    const dropsGameTitleSel = "div.accordion-header h3.tw-title";
    const rewardsCompanySel = "div.accordion-header p[class*=CoreText]";
    const rewardsGameSel = 'a.tw-link[href*="/directory/category/"]';

    // Bloat on the drops
    const bloatTextInfo = "div.drops-root__content > div > div:has(> span)";

    // Drops to always show
    const shownGames = [
        "33 Immortals",
        "Apex Legends",
        "Assassin's Creed Shadows",
        "Baldur's Gate 3",
        "BattleBit Remastered",
        "Call of Duty: Black Ops 6",
        "Call of Duty: Warzone",
        "Cyberpunk 2077",
        "Dark and Darker",
        "Destiny 2",
        "Diablo IV",
        "Don't Starve Together",
        "Enshrouded",
        "Escape from Tarkov",
        "Escape from Tarkov: Arena",
        "FINAL FANTASY VII REBIRTH",
        "Ghosts of Tabor",
        "Halo Infinite",
        "Halo: The Master Chief Collection",
        "HITMAN World of Assassination",
        "Hunt: Showdown 1896",
        "inZOI",
        "Kingdom Come: Deliverance II",
        "Last Epoch",
        "Marauders",
        "Marvel Rivals",
        "Nightingale",
        "No Man's Sky",
        "Palworld",
        "Path of Exile",
        "Path of Exile 2",
        "PAYDAY 2",
        "PAYDAY 3",
        "Pokémon GO",
        "PUBG: BATTLEGROUNDS",
        "Rust",
        "Sea of Thieves",
        "Special Events",
        "Splitgate",
        "Splitgate 2",
        "THE FINALS",
        "Tom Clancy's Rainbow Six Siege",
        "Tom Clancy's The Division 2",
        "Warhammer 40,000: Rogue Trader",
        "Warhammer 40,000: Space Marine II",
    ];

    // Which drops to hide
    const dropsGames = [
        "33 Immortals",
        "Aether Gazer",
        "AK-xolotl",
        "Albion Online",
        "Apex Legends",
        "Arcane",
        "ArcheAge",
        "Arena Breakout",
        "Arena Breakout: Infinite",
        "ASCENDANT.COM",
        "Assassin's Creed Mirage",
        "Assassin's Creed Odyssey",
        "Assassin's Creed Shadows",
        "Assassin's Creed Valhalla",
        "Avatar: Frontiers of Pandora",
        "Baldur's Gate 3",
        "BAPBAP",
        "BATTLE CRUSH",
        "Battle Teams 2",
        "BattleBit Remastered",
        "BattleCore Arena",
        "Black Desert",
        "Blade & Soul NEO",
        "Brawl Stars",
        "Brawlhalla",
        "Brazen Blaze",
        "BUMP! Superbrawl",
        "Caliber",
        "Call of Duty: Black Ops 6",
        "Call of Duty: Warzone",
        "Cards of Eternity: The Wheel of Time",
        "ChatTDT: Tower Defense Twitch",
        "Chess",
        "Clash of Clans",
        "Coin Pusher World",
        "Conan Exiles",
        "Conqueror's Blade",
        "Coryphaeus Championships",
        "Crossfire",
        "Crossout",
        "Cult of the Lamb",
        "Cyberpunk 2077",
        "Dark and Darker",
        "Dark and Darker Mobile",
        "DC Dual Force",
        "Dead by Daylight",
        "Dead Island 2",
        "Deathbound",
        "Deceive Inc.",
        "Delta Force",
        "Destiny 2",
        "Diablo IV",
        "Diabotical Rogue",
        "Disney Speedstorm",
        "Dofus",
        "DOFUS Touch",
        "Don't Starve Together",
        "Dragonheir: Silent Gods",
        "Dungeon Defenders II",
        "Dungeon Fighter Online",
        "Dungeon of the Endless",
        "Dungeonborne",
        "Dying Light 2: Stay Human",
        "Dysterra",
        "EA Sports College Football 25",
        "EA Sports FC 24",
        "EA Sports FC 25",
        "EA Sports Madden NFL 25",
        "Eco",
        "Elite: Dangerous",
        "Embervale.TV",
        "Endless Dungeon",
        "Enshrouded",
        "Epic Seven",
        "Escape from Tarkov",
        "Escape from Tarkov: Arena",
        "Eternal Return",
        "EVE Online",
        "Evilmun Family",
        "Expeditions: A MudRunner Game",
        "F4E: Extraction",
        "Fall Guys",
        "Farlight 84",
        "FIFA 23",
        "FINAL FANTASY VII REBIRTH",
        "Fishing Planet",
        "For Honor",
        "Fortnite",
        "FragPunk",
        "Freestyle Football R",
        "From Space",
        "Genshin Impact",
        "Ghostbusters: Spirits Unleashed",
        "Ghosts of Tabor",
        "Go Go Muffin",
        "GODDESS OF VICTORY: NIKKE",
        "Goose Goose Duck",
        "Gord",
        "Guardian Tales",
        "Guessr.tv",
        "Guild Wars 2",
        "Gundam Evolution",
        "Gwent: The Witcher Card Game",
        "Halo Infinite",
        "Halo: The Master Chief Collection",
        "HAWKED",
        "Hearthstone",
        "Hellcard",
        "HITMAN World of Assassination",
        "Homeworld 3",
        "Honkai Impact 3rd",
        "Honkai: Star Rail",
        "Honor of Kings",
        "House Flipper 2",
        "HUMANKIND",
        "Hunt: Showdown 1896",
        "HYENAS",
        "Infestation: The New Beginning",
        "Infestation: The New Z",
        "Infinity Nikki",
        "inZOI",
        "Kakele Online: MMORPG",
        "KartRider: Drift",
        "Kewlbiverse",
        "Killer Klowns from Outer Space: The Game",
        "King of the Castle",
        "Kingdom Come: Deliverance II",
        "Kirka.io",
        "Last Epoch",
        "League of Legends",
        "Legion TD 2",
        "Level Zero: Extraction",
        "Lineage II",
        "Lost Ark",
        "Lost Light",
        "Lynked: Banner of the Spark",
        "Madden NFL 24",
        "Madden NFL 25",
        "Mafiathon 2",
        "Marauders",
        "Marbles on Stream",
        "MARVEL Contest of Champions",
        "Marvel Rivals",
        "Marvel Snap",
        "MARVEL Strike Force",
        "Mecha BREAK",
        "Metin2",
        "Mini Royale",
        "Mir Korabley",
        "Mir Tankov",
        "MLB The Show 23",
        "MLB The Show 24",
        "MLB The Show 25",
        "Modern Warships",
        "MONOPOLY",
        "Mortal Kombat 1",
        "Mortal Online 2",
        "Mother Machine",
        "MultiVersus",
        "My Candy Love",
        "My Hero Ultra Rumble",
        "My Time at Sandrock",
        "Myth of Empires",
        "NARAKA: BLADEPOINT",
        "NBA 2K24",
        "NBA 2K25",
        "Neighbors: Suburban Warfare",
        "Neon Abyss: Infinity",
        "New World",
        "New World: Aeternum",
        "NextWorld2",
        "Nightingale",
        "Ninja Must Die",
        "Nitro: Stream Racing",
        "No Man's Sky",
        "NW2Online",
        "Off The Grid",
        "Oh Baby! Kart",
        "Once Human",
        "One Punch Man: World",
        "Operation Valor",
        "Out of the Park Baseball 24",
        "Out of the Park Baseball 25",
        "Out of the Park Baseball 26",
        "OUTERPLANE",
        "OutRage: Fight Fest",
        "Overwatch 2",
        "Paladins",
        "Palia",
        "Palworld",
        "Parallel",
        "Party Animals",
        "Path of Exile",
        "Path of Exile 2",
        "PAYDAY 2",
        "PAYDAY 3",
        "Planet Coaster 2",
        "Pokémon GO",
        "Pokémon Trading Card Game",
        "Pokémon Trading Card Game Live",
        "Pokémon UNITE",
        "Portal Fantasy",
        "Predecessor",
        "Project ETHOS",
        "Project F4E",
        "Project Genesis",
        "Project Winter",
        "Project: Arena",
        "PUBG Mobile",
        "PUBG: BATTLEGROUNDS",
        "Race Day Rampage",
        "Ravendawn",
        "RavenQuest",
        "Rawmen",
        "Relic Hunters Legend",
        "Rennsport",
        "Riders Republic",
        "Rise Online",
        "Rivals of Aether II",
        "Rocket League",
        "Rumble Club",
        "Rush Royale",
        "Rust",
        "S.K.I.L.L.: Special Force 2",
        "Sea of Thieves",
        "Seekers of Skyveil",
        "Shakes and Fidget",
        "Shatterline",
        "Shell Shockers",
        "Sid Meier's Civilization VII",
        "Skull and Bones",
        "Sky: Children of the Light",
        "Slapshot Rebound",
        "Slipstream: Rogue Space",
        "SMITE",
        "SMITE 2",
        "Snowbreak: Containment Zone",
        "Somnis: Rumble Rush",
        "Soulmask",
        "Special Events",
        "Spectre Divide",
        "Spellborne",
        "Splitgate",
        "Splitgate 2",
        "Squad Busters",
        "STALCRAFT",
        "STALCRAFT: X",
        "Stampede Racing Royale",
        "Standoff 2",
        "Star Wars Outlaws",
        "Star Wars: The Old Republic",
        "Starsiege: Deadzone",
        "Steel Hunters",
        "Stormgate",
        "Stream Raiders",
        "Strinova",
        "Stumble Guys",
        "Suicide Squad: Kill the Justice League",
        "Summoners War: Chronicles",
        "Super Animal Royale",
        "Superball",
        "SUPERVIVE",
        "SYNCED",
        "Tanki Online",
        "Tarisland",
        "Teamfight Tactics",
        "Terminull Brigade",
        "TerraTech Worlds",
        "The Bornless",
        "The Crew: Motorfest",
        "The Elder Scrolls Online",
        "THE FINALS",
        "The First Berserker: Khazan",
        "The First Descendant",
        "The Hidden Ones",
        "The Settlers: New Allies",
        "The Tomorrow Children",
        "Throne and Liberty",
        "Tom Clancy's Rainbow Six Siege",
        "Tom Clancy's The Division 2",
        "TopSpin 2K25",
        "Torchlight: Infinite",
        "Tower of Fantasy",
        "TRIBES 3: Rivals",
        "Trove",
        "Trust No Bunny",
        "Two Point Museum",
        "UFL",
        "Umamusume: Pretty Derby",
        "UNDAWN",
        "UNDECEMBER",
        "Undying",
        "UNITED 1944",
        "Unrooted",
        "VALORANT",
        "Vampire: The Masquerade - Bloodhunt",
        "Vaultbreakers",
        "Veiled Experts",
        "Venatur",
        "Wakfu",
        "War Robots: Frontiers",
        "War Thunder",
        "Warborne: Above Ashes",
        "Warcraft Rumble",
        "Warface",
        "Warface: Clutch",
        "Warframe",
        "Warhammer 40,000: Darktide",
        "Warhammer 40,000: Rogue Trader",
        "Warhammer 40,000: Space Marine II",
        "Warhammer 40,000: Speed Freeks",
        "Warhammer 40,000: Warpforge",
        "Warhammer Age of Sigmar: Realms of Ruin",
        "Warhammer Online: Age of Reckoning",
        "Warhammer: The Horus Heresy - Legions",
        "Warhaven",
        "West Hunt",
        "Wild Assault",
        "With Your Destiny",
        "World of Tanks",
        "World of Tanks Console",
        "World of Warcraft",
        "World of Warships",
        "World War Z: Aftermath",
        "Wuthering Waves",
        "WWE 2K25",
        "WWE SuperCard",
        "XDefiant",
        "XERA: Survival",
        "Zenless Zone Zero",
        "Zombie Within",
    ];

    const shownCompanyRewards = [
        "PC Game Pass",
        "Rust",
    ];

    const companyRewards = [
        "Apple TV+",
        "Discord",
        "PC Game Pass",
        "Rust",
        "Taco Bell",
        "Wuthering Waves",
    ];

    const shownGameRewards = [
        "Minecraft",
        "Monster Hunter Wilds",
    ];

    const gameRewards = [
        "Fallout 76",
        "FINAL FANTASY XIV ONLINE",
        "Harry Potter: Quidditch Champions",
        "Minecraft",
        "Monster Hunter Wilds",
        "Pokémon UNITE",
        "Street Fighter 6",
        "World of Warcraft",
        "XDefiant",
    ];

    //Method to wait for an element in the DOM
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

    //Remove the side nav bloat
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

                        // Bloat
                        waitForElement(bloatTextInfo, true).then((element) => {
                            Array.from(element).forEach((bloat) => {
                                bloat.remove();
                            });
                        });

                        //Wait for the Drops
                        waitForElement(dropsListSel, true).then((element) => {
                            Array.from(element).forEach((drop) => {
                                // Extract the names
                                const dropGame =
                                    drop.querySelector(
                                        dropsGameTitleSel
                                    )?.innerText;

                                // Drops to show
                                if (shownGames.includes(dropGame)) {
                                    return;
                                }

                                // Drops to remove
                                if (dropsGames.includes(dropGame)) {
                                    drop.remove();
                                }
                            });
                        });

                        //Wait for the Reward campaigns
                        waitForElement(rewardsListSel, true).then((element) => {
                            Array.from(element).forEach((drop) => {
                                // Extract the names
                                const rewardCompany =
                                    drop.querySelector(
                                        rewardsCompanySel
                                    )?.innerText;
                                const rewardGame =
                                    drop.querySelector(
                                        rewardsGameSel
                                    )?.innerText;

                                // Drops to show
                                if (
                                    shownCompanyRewards.includes(
                                        rewardCompany
                                    ) ||
                                    shownGameRewards.includes(rewardGame)
                                ) {
                                    return;
                                }

                                // Drops to remove
                                if (
                                    companyRewards.includes(rewardCompany) ||
                                    gameRewards.includes(rewardGame)
                                ) {
                                    drop.remove();
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
